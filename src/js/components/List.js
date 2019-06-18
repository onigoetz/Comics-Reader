import React from "react";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { thumb, createUrl, cleanName } from "../utils";
import { TYPE_DIR } from "../types";

function allRead(folder) {
  return (
    folder.type === TYPE_DIR && folder.booksInside === folder.booksInsideRead
  );
}

function unread(folder) {
  return folder.type !== TYPE_DIR && !folder.read;
}

function bookCount(folder) {
  return folder.booksInside === 1 ? "1 book" : `${folder.booksInside} books`;
}

export default function List({ books }) {
  return (
    <ul className="List">
      {books.filter(Boolean).map(folder => {
        const classes = {
          "List__cell--allRead": allRead(folder),
          "List__cell--unread": unread(folder)
        };
        return (
          <li className={classnames("List__cell", classes)} key={folder.name}>
            <Link to={createUrl(folder)}>
              <div className="List__cell__image">
                {folder.type === TYPE_DIR &&
                  folder.booksInside !== folder.booksInsideRead && (
                    <div className="List__cell__unreadCount">
                      {folder.booksInside - folder.booksInsideRead}
                    </div>
                  )}
                <LazyLoad height={140} offset={200}>
                  <img
                    src={thumb(folder.path)}
                    height="140"
                    alt={folder.name}
                  />
                </LazyLoad>
              </div>
              <div className="List__cell__name">{cleanName(folder.name)}</div>
              {folder.type === TYPE_DIR && (
                <p className="List__cell__details">{bookCount(folder)}</p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
