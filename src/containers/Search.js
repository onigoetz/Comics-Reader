import React, { useEffect, useState, useRef } from "react";
import { Portal } from "react-portal";
import Link from "next/link";

import styles from "./Search.module.css";

import Input from "../components/Input";
import Loading from "../components/Loading";
import { FiSearch } from "react-icons/fi";
import useInput from "../hooks/useInput";
import { useAuth } from "../hoc/withAuth";
import { fetchWithAuth } from "../fetch";
import { createUrl } from "../utils";
import { TYPE_DIR } from "../types";

function Search() {
  const { token } = useAuth();

  const inputEl = useRef(null);

  const searchField = useInput("");
  const [loading, setLoading] = useState(false);
  const [bookList, setBooks] = useState([]);
  const [searchVisible, setVisiblity] = useState(false);

  useEffect(() => {
    if (searchVisible) {
      inputEl.current.focus();
    }
  }, [searchVisible]);

  useEffect(() => {
    if (searchField.value.length >= 3) {
      setLoading(true);

      const fetchOptions = {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ search: searchField.value })
      };

      fetchWithAuth(token, "search", fetchOptions).then(({ books }) => {
        setBooks(books);
        setLoading(false);
      });
    }
  }, [searchField.value, token]);

  const toggleSearch = () => {
    setVisiblity(!searchVisible);
  };

  return (
    <div className={styles.Search}>
      <button
        onClick={toggleSearch}
        className="Button Button--link"
        title="Search"
      >
        <FiSearch width="28px" height="28px" />
      </button>
      {searchVisible && <Input ref={inputEl} isSearch {...searchField.bind} />}
      {searchVisible && searchField.value.length >= 3 && (
        <Portal>
          <div className={styles.SearchResult}>
            {loading && <Loading />}
            {bookList.length === 0 && (
              <span>No result matches your search</span>
            )}
            {bookList.map(item => {
              return (
                <Link
                  href={
                    item.type === TYPE_DIR ? "/list/[list]" : "/book/[book]"
                  }
                  as={createUrl(item)}
                  key={item.path}
                >
                  <a
                    onClick={toggleSearch}
                    className={styles.SearchResult__item}
                  >
                    <small>{item.parent}</small> / {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
}

export default Search;
