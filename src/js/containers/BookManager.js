import React from "react";
import { connect } from "react-redux";

import Loading from "../components/Loading";
import Book from "../components/Book";
import { loadPages } from "../reducers/pages";
import { markRead, isRead } from "../reducers/read";
import { navigate } from "../reducers/route";
import { selectBook } from "../reducers/books";

class BookManager extends React.Component {
  handleRead = () => {
    this.props.dispatch(markRead(this.props.path));
  };

  componentDidMount() {
    if (!this.props.pages.length) {
      this.props.dispatch(loadPages(this.props.path));
    }

    this.props.dispatch(
      navigate(
        this.props.book.name,
        this.props.location.pathname,
        this.props.parent
      )
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.book.name !== this.props.book.name) {
      this.props.dispatch(
        navigate(
          nextProps.book.name,
          nextProps.location.pathname,
          nextProps.parent
        )
      );

      if (!nextProps.pages.length) {
        this.props.dispatch(loadPages(nextProps.path));
      }
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  render() {
    if (!this.props.pages.length) {
      return <Loading />;
    }

    return (
      <div className="Content Content--gallery">
        <Book
          pages={this.props.pages}
          read={this.props.read}
          onRead={this.handleRead}
        />
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

  const { book, parent, pages } = selectBook(state, path.replace(/%23/g, "#"));

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
