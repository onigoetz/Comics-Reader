import React from "react";
import { connect } from "react-redux";

import Header from "../components/Header";
import Loading from "../components/Loading";
import Book from "../components/Book";
import { loadPages } from "../reducers/pages";
import { markRead, isRead } from "../reducers/read";

class BookManager extends React.Component {
  handleRead = () => {
    this.props.dispatch(markRead(this.props.path));
  };

  componentDidMount() {

    document.title = this.props.book.name;

    if (!this.props.pages.length) {
      this.props.dispatch(loadPages(this.props.path));
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  render() {
    /*if (!this.state.data) {
        return ;
      }*/

    return (
      <div>
        <Header
          url={this.props.location.pathname}
          title={this.props.book.name}
          parent={this.props.parent}
        />
        {this.props.pages.length ? (
          <div className="Content Content--gallery">
            <Book
              pages={this.props.pages}
              read={this.props.read}
              onRead={this.handleRead}
            />
          </div>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // We need to lower case the login due to the way GitHub's API behaves.
  // Have a look at ../middleware/api.js for more details.
  const path =
    (ownProps.location && ownProps.location.pathname.replace("/book/", "")) ||
    "";

  const allBooks = state.books.books;

  const book = allBooks[path] || {};

  let parent = {};
  if (book.parent) {
    parent = allBooks[book.parent] || {};
  }

  const pages = state.pages.books[path] || [];

  const read = isRead(state.read.read, path);

  return {
    path,
    book,
    parent,
    pages,
    read
  };
};

export default connect(mapStateToProps)(BookManager);

BookManager.displayName = "BookManager";
