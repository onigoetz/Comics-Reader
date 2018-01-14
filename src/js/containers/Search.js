import React from "react";
import Portal from "react-portal/es/Portal";
import { connect } from "react-redux";
//import PropTypes from "prop-types";
import {Link} from "react-router-dom";
//import Headroom from "react-headroom";

import {IoIosSearch} from "../components/Icons";
import {TYPE_DIR} from "../types";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchVisible: false,
      text: ""
    };
  }

  handleSearchToggle = () => {
    this.setState(oldState => ({ searchVisible: !oldState.searchVisible }));
  };

  handleSearch = (event) => {
    this.setState({text: event.target.value});
  }

  matching() {
    const term = this.state.text.toLowerCase();

    return Object.keys(this.props.books)
      .map(item => this.props.books[item])
      .filter(item => item.name.toLowerCase().indexOf(term) !== -1);
  }

  renderItem(item) {
    const url = (item.type === TYPE_DIR ? "/list/" : "/book/") + item.path;

    return <Link to={url} onClick={this.handleSearchToggle} className="SearchResult__item" key={`${item.parent}/${item.name}`}><small>{item.parent}</small> / {item.name}</Link>;
  }

  render() {
    return (
      <div className="Search">
        <button
          onClick={this.handleSearchToggle}
          className="Button Button--link"
          title="Search"
        >
          <IoIosSearch />
        </button>
        {this.state.searchVisible && <input onChange={this.handleSearch} value={this.state.text} className="Input" /> }
        {this.state.searchVisible && this.state.text && <Portal>
          <div className="SearchResult">
            {this.matching().map(item => this.renderItem(item))}
          </div>
        </Portal>}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {books: state.books.books};
};

export default connect(mapStateToProps)(Search);