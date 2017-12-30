import React from "react";
import LazyLoad from "react-lazyload";
import {Link} from "react-router-dom";

import {isNumeric, thumb} from "../utils";
import {TYPE_DIR} from "../types";
import {IoIosArrowForward} from "./Icons";

export default function List({ books }) {
  const sepratators = books.length > 5;
  const items = [];
  let currentLetter = "", firstLetter;

  for (const i in books) {
    if (!books.hasOwnProperty(i)) {
      continue;
    }

    const folder = books[i];
    if (!folder) {
      items.push(<li>Not Found</li>);
      continue;
    }

    if (sepratators) {
      firstLetter = folder.name.substring(0, 1).toUpperCase();

      if (isNumeric(firstLetter)) {
        firstLetter = "#";
      }

      if (firstLetter !== currentLetter) {
        currentLetter = firstLetter;
        items.push(<li className="List__divider" key={`Letter-${currentLetter}`}>{currentLetter}</li>);
      }
    }

    const url = (folder.type === TYPE_DIR ? "/list/" : "/book/") + folder.path;

    let readCount = null;
    if (folder.type === TYPE_DIR && folder.booksInsideRead) {
      if (folder.booksInside === folder.booksInsideRead) {
        readCount = <small>(All Read)</small>;
      } else {
        readCount = <small>({folder.booksInsideRead} Read)</small>;
      }
    }

    items.push(<li className="List__cell" key={folder.name}>
      <Link to={url}>
        <div className="List__cell__body">
          <div className="List__cell__media pull-left">
            <LazyLoad height={75} width={60} offset={200}>
              <img src={thumb(folder.path)} height="75" alt={folder.name} />
            </LazyLoad>
          </div>
          {folder.name}
          {folder.read && <p><small>Read</small></p>}
          {folder.type === TYPE_DIR ? <p>{folder.booksInside} Books {readCount}</p> : ""}
          <IoIosArrowForward />
        </div>
      </Link>
    </li>);
  }

  return <ul className="List">{items}</ul>;
}
