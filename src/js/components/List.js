import React from "react";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { thumb, createUrl, cleanName } from "../utils";
import { TYPE_DIR } from "../types";

function allRead(folder) {
  return folder.type === TYPE_DIR && folder.booksInside === folder.booksInsideRead;
}

function unread(folder) {
  if (folder.type === TYPE_DIR) {
    return folder.booksInside !== folder.booksInsideRead;
  }

  return !folder.read;
}

function getRead(folder) {
  if (folder.type !== TYPE_DIR || !folder.booksInsideRead) {
    return null;
  }

  if (allRead(folder)) {
    return <small>(All Read)</small>;
  }

  return <small>({folder.booksInsideRead} Read)</small>;
}

export default function List({ books }) {
  return (
    <ul className="List">
      {books.filter(Boolean).map(folder => (
        <li className={classnames("List__cell", {"List__cell--allRead": allRead(folder), "List__cell--unread": unread(folder)})} key={folder.name}>
          <Link to={createUrl(folder)}>
            <div className="List__cell__image">
              <LazyLoad height={140} offset={200}>
                <img src={thumb(folder.path)} height="140" alt={folder.name} />
              </LazyLoad>
            </div>
            <div className="List__cell__name">{cleanName(folder.name)}</div>
            {folder.type === TYPE_DIR && (
              <p className="List__cell__details">
                {folder.booksInside} Books {getRead(folder)}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
