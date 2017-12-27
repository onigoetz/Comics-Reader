import React from "react";
import { connect } from "react-redux";

import Header from "../components/Header";
import List from "../components/List";
import { isRead } from "../reducers/read";

function ListManager({ location, dir, parent, books }) {
  return (
    <div>
      <Header url={location.pathname} title={dir.name} parent={parent} />
      <div className="Content">
        <List books={books} />
      </div>
    </div>
  );
}

ListManager.displayName = "ListManager";

const mapStateToProps = (state, ownProps) => {
  const path =
    (ownProps.location && ownProps.location.pathname.replace("/list/", "")) ||
    "";

  const allBooks = state.books.books;

  const dir = allBooks[path] || {};

  let parent = {};
  if (dir.parent) {
    parent = allBooks[dir.parent] || {};
  }

  let books = [];
  if (dir.books) {
    books = dir.books
      .map(book => allBooks[book] || {})
      .map(book => {
        book.read = isRead(state.read.read, book.path);
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
