import { Link } from "@tanstack/react-router";
import classnames from "classnames";

import styles from "./List.module.css";

import { image, nodeLink, cleanName } from "../utils";
import { TYPE_DIR } from "../types";
import { ImageData, ListItem } from "../types";

function allRead(folder: ListItem) {
  return (
    (folder.type === TYPE_DIR &&
      folder.booksInside === folder.booksInsideRead) ||
    (folder.type !== TYPE_DIR && folder.read)
  );
}

function unread(folder: ListItem) {
  return folder.type !== TYPE_DIR && !folder.read;
}

function bookCount(folder: ListItem) {
  return folder.booksInside === 1 ? "1 book" : `${folder.booksInside} books`;
}

interface ListProps extends ImageData {
  books: ListItem[];
}

function SubList({ books, isRetina, supportsWebp }: ListProps) {
  return (
    <ul className={styles.List}>
      {books.map(folder => {
        const classes = {
          [styles["List__cell--allRead"]]: allRead(folder),
          [styles["List__cell--unread"]]: unread(folder)
        };
        return (
          <li
            className={classnames(styles.List__cell, classes)}
            key={folder.name}
          >
            <Link {...nodeLink(folder)}>
              <div className={styles.List__cell__image}>
                {folder.type === TYPE_DIR &&
                  folder.booksInside !== folder.booksInsideRead && (
                    <div className={styles.List__cell__unreadCount}>
                      {folder.booksInside - folder.booksInsideRead}
                    </div>
                  )}
                <img
                  src={image(folder.thumb, "thumb", isRetina, supportsWebp)}
                  height={140}
                  width={folder.thumbWidth}
                  alt={folder.name}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.List__cell__name}>
                {cleanName(folder.name)}
              </div>
              {folder.type === TYPE_DIR && (
                <p className={styles.List__cell__details}>
                  {bookCount(folder)}
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function List({
  books: rawBooks,
  isRetina,
  supportsWebp
}: ListProps) {
  const readBooks: ListItem[] = [];
  const unreadBooks: ListItem[] = [];

  rawBooks.filter(Boolean).forEach(folder => {
    if (allRead(folder)) {
      readBooks.push(folder);
    } else {
      unreadBooks.push(folder);
    }
  });

  return (
    <>
      <SubList
        books={unreadBooks}
        isRetina={isRetina}
        supportsWebp={supportsWebp}
      />
      {readBooks.length > 0 && (
        <>
          <h2 className={styles.List__heading}>Read</h2>
          <SubList
            books={readBooks}
            isRetina={isRetina}
            supportsWebp={supportsWebp}
          />
        </>
      )}
    </>
  );
}
