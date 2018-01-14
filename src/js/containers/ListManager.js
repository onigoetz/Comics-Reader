import React from "react";
import { connect } from "react-redux";

import List from "../components/List";
import { isRead } from "../reducers/read";
import { listBooksInside } from "../reducers/books";
import { navigate } from "../reducers/route";

class ListManager extends React.Component {

  componentDidMount() {
    this.props.dispatch(navigate(this.props.dir.name, this.props.location.pathname, this.props.parent));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dir.name !== this.props.dir.name) {
      this.props.dispatch(navigate(nextProps.dir.name, nextProps.location.pathname, nextProps.parent));
    }
  }

  render() {
    return (
      <div className="Content">
        <List books={this.props.books} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let path =
    (ownProps.location && ownProps.location.pathname.replace("/list/", "")) ||
    "";

  if (path === "/") {
    path = "";
  }

  const allBooks = state.books.books;

  const dir = allBooks[path] || {};

  let parent = {};
  if (dir.parent !== undefined) {
    parent = allBooks[dir.parent] || {};
  }

  let books = [];
  if (dir.books) {
    books = dir.books
      .map(book => allBooks[book] || {})
      .map(book => {
        book.read = isRead(state.read.read, book.path);
        const booksInside = listBooksInside(allBooks, book.path);
        book.booksInsideRead = booksInside.filter(innerBook => isRead(state.read.read, innerBook)).length;
        book.booksInside = booksInside.length;
        return book;
      });
  }

  return {
    path,
    dir,
    parent,
    books
  };
};

export default connect(mapStateToProps)(ListManager);
