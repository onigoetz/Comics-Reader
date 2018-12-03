import React from "react";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { thumb, createUrl } from "../utils";
import { TYPE_DIR } from "../types";

function allRead(folder) {
  return folder.type === TYPE_DIR && folder.booksInside === folder.booksInsideRead;
}

function unreadBook(folder) {
  return folder.type !== TYPE_DIR && !folder.read;
}

function cleanName(name) {
  return name.replace(/(\.(:?cbr|cbz|zip|rar|pdf))$/, "");
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
      {books.map(folder => {
        if (!folder) {
          return <li>Not Found</li>;
        }

        return (
          <li className={classnames("List__cell", {"List__cell--allRead": allRead(folder)})} key={folder.name}>
            <Link to={createUrl(folder)}>
              <LazyLoad height={140} offset={200}>
                <img src={thumb(folder.path)} height="140" alt={folder.name} />
              </LazyLoad>
              <div className="List__cell__name">{unreadBook(folder) && <span className="UnreadBadge" />}{cleanName(folder.name)}</div>
              {folder.type === TYPE_DIR && (
                <p>
                  {folder.booksInside} Books {getRead(folder)}
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
