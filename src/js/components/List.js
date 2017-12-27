import React from "react";
import LazyLoad from "react-lazy-load";
import {Link} from "react-router-dom";

import {isNumeric, image, toRetina, isRetina} from "../utils";
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

    const thumb = isRetina ? toRetina(image("small", folder.thumb)) : image("big", folder.thumb);

    items.push(<li className="List__cell" key={folder.name}>
      <Link to={url}>
        <div className="List__cell__body">
          <LazyLoad height={75} width={60} offsetVertical={200} className="List__cell__media pull-left" >
            <img src={thumb} height="75" alt={folder.name} />
          </LazyLoad>
          {folder.name}
          {folder.read && <p><small>Read</small></p>}
          {folder.type === TYPE_DIR ? <p>{folder.books.length} Tomes</p> : ""}
          <IoIosArrowForward />
        </div>
      </Link>
    </li>);
  }

  return <ul className="List">{items}</ul>;
}
