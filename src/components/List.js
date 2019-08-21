import React from "react";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import classnames from "classnames";

import { image, createUrl, cleanName } from "../utils";
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

export default function List({ books, isRetina, supportsWebp }) {
  return (
    <ul className="List">
      {books.filter(Boolean).map(folder => {
        const classes = {
          "List__cell--allRead": allRead(folder),
          "List__cell--unread": unread(folder)
        };
        return (
          <li className={classnames("List__cell", classes)} key={folder.name}>
            <Link
              href={folder.type === TYPE_DIR ? "/list/[list]" : "/book/[book]"}
              as={createUrl(folder)}
            >
              <a>
                <div className="List__cell__image">
                  {folder.type === TYPE_DIR &&
                    folder.booksInside !== folder.booksInsideRead && (
                      <div className="List__cell__unreadCount">
                        {folder.booksInside - folder.booksInsideRead}
                      </div>
                    )}
                  <LazyLoad height={140} offset={200}>
                    <img
                      src={image(folder.thumb, "thumb", isRetina, supportsWebp)}
                      height="140"
                      alt={folder.name}
                    />
                  </LazyLoad>
                </div>
                <div className="List__cell__name">{cleanName(folder.name)}</div>
                {folder.type === TYPE_DIR && (
                  <p className="List__cell__details">{bookCount(folder)}</p>
                )}
              </a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
