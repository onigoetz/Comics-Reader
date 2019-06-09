import React from "react";
import Portal from "react-portal/es/Portal";
import { connect } from "react-redux";
//import PropTypes from "prop-types";
import { Link } from "react-router-dom";
//import Headroom from "react-headroom";

import { IoIosSearch } from "../components/Icons";
import { createUrl } from "../utils";

function Search({ books }) {
  const inputEl = React.useRef(null);
  const [text, setText] = React.useState("");
  const [searchVisible, setVisiblity] = React.useState(false);

  React.useEffect(() => {
    if (searchVisible) {
      inputEl.current.focus();
    }
  }, [searchVisible]);

  const toggleSearch = () => {
    setVisiblity(!searchVisible);
  };

  const getMatching = () => {
    const term = text.toLowerCase();

    return Object.keys(books)
      .map(item => books[item])
      .filter(item => item.name.toLowerCase().indexOf(term) !== -1);
  };

  return (
    <div className="Search">
      <button
        onClick={toggleSearch}
        className="Button Button--link"
        title="Search"
      >
        <IoIosSearch />
      </button>
      {searchVisible && (
        <input
          ref={inputEl}
          onChange={event => {
            setText(event.target.value);
          }}
          value={text}
          className="Input Input--search"
        />
      )}
      {searchVisible && text && (
        <Portal>
          <div className="SearchResult">
            {getMatching().map(item => {
              return (
                <Link
                  to={createUrl(item)}
                  onClick={toggleSearch}
                  className="SearchResult__item"
                  key={`${item.parent}/${item.name}`}
                >
                  <small>{item.parent}</small> / {item.name}
                </Link>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
}

const mapStateToProps = state => {
  return { books: state.books.books };
};

export default connect(mapStateToProps)(Search);
