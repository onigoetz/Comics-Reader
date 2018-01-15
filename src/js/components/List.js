import React from "react";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";

import { thumb, createUrl } from "../utils";
import { TYPE_DIR } from "../types";

function getRead(folder) {
  if (folder.type !== TYPE_DIR || !folder.booksInsideRead) {
    return null;
  }

  if (folder.booksInside === folder.booksInsideRead) {
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
          <li className="List__cell" key={folder.name}>
            <Link to={createUrl(folder)}>
              <LazyLoad height={140} offset={200}>
                <img src={thumb(folder.path)} height="140" alt={folder.name} />
              </LazyLoad>
              <span className="List__cell__name">{folder.name}</span>
              {folder.read && (
                <p>
                  <small>Read</small>
                </p>
              )}
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
