import React from "react";
import Link from "next/link";
import Image from "next/image";
import classnames from "classnames";

import styles from "./List.module.css";

import { image, createUrl, cleanName } from "../utils";
import { TYPE_DIR } from "../types";

function allRead(folder) {
  return (
    (folder.type === TYPE_DIR &&
      folder.booksInside === folder.booksInsideRead) ||
    (folder.type !== TYPE_DIR && folder.read)
  );
}

function unread(folder) {
  return folder.type !== TYPE_DIR && !folder.read;
}

function bookCount(folder) {
  return folder.booksInside === 1 ? "1 book" : `${folder.booksInside} books`;
}

export default function List({ books: rawBooks, isRetina, supportsWebp }) {
  const readBooks = [];
  const unreadBooks = [];

  rawBooks.filter(Boolean).forEach((folder) => {
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

function SubList({ books, isRetina, supportsWebp }) {
  return (
    <ul className={styles.List}>
      {books.map((folder) => {
        const classes = {
          [styles["List__cell--allRead"]]: allRead(folder),
          [styles["List__cell--unread"]]: unread(folder),
        };
        return (
          <li
            className={classnames(styles.List__cell, classes)}
            key={folder.name}
          >
            <Link
              href={folder.type === TYPE_DIR ? "/list/[list]" : "/book/[book]"}
              as={createUrl(folder)}
            >
              <a>
                <div className={styles.List__cell__image}>
                  {folder.type === TYPE_DIR &&
                    folder.booksInside !== folder.booksInsideRead && (
                      <div className={styles.List__cell__unreadCount}>
                        {folder.booksInside - folder.booksInsideRead}
                      </div>
                    )}
                  <Image
                    src={image(folder.thumb, "thumb", isRetina, supportsWebp)}
                    height={140}
                    width={folder.thumbWidth}
                    loader={({ src }) => src}
                    alt={folder.name}
                    unoptimized
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
              </a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
