/* global process */

"use client";

import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Headroom from "react-headroom";
import Head from "next/head";

import Search from "./Search";
import { cleanName, createUrl } from "../utils";
import { FiChevronLeft, FiUser, FiHome } from "react-icons/fi";
import { useAuth } from "../hoc/withAuth";

import styles from "./Header.module.css";

function isNotHome(url) {
  return url !== "/" && url !== "/list/";
}

function canGoBack(url) {
  return url && isNotHome() && url !== "/login";
}

function Home() {
  return (
    <Link href="/" className="Button Button--link" title="Back to Home">
      <FiHome />
    </Link>
  );
}

function Previous({ parent, previousUrl, history }) {
  if (!parent || parent === "") {
    return null;
  }

  const title = parent.name;

  // TODO :: restore previousUrl feature
  /*const url = parent.path ? `/list/${parent.path}` : previousUrl;

  // If the url is identical to the previousUrl,
  // It means we can do the equivalent of the browser's back button.
  // And thus we can benefit from scroll restoration
  
  if (url === previousUrl) {
    return (
      <div className="Header__Section pull-left">
        <button
          className="Button Button--link Button--back"
          title={`Back to ${title}`}
          onClick={() => history.goBack()}
        >
          <IoIosArrowBack />
          {title}
        </button>
      </div>
    );
  }*/

  return (
    <div className={`${styles.Header__Section} ${styles.pullLeft}`}>
      <Link
        href={parent.path ? createUrl(parent) : "/"}
        className="Button Button--link Button--back"
        title={`Back to ${title}`}
      >
        <FiChevronLeft />
        {title}
      </Link>
    </div>
  );
}

function User() {
  return (
    <div className={`${styles.Dropdown__trigger} Button Button--link`}>
      <FiUser />
      <div className={styles.Dropdown__content}>
        <Link href="/change_password" className="Link">
          Change Password
        </Link>
        <Link href="/logout" className="Link">
          Logout
        </Link>
      </div>
    </div>
  );
}

function Header({ url, current, parent }) {
  const { token } = useAuth();

  return (
    <>
      <Head>
        <title>Comics Reader {current && `- ${cleanName(current.name)}`}</title>
      </Head>
      <Headroom disableInlineStyles>
        <header className={styles.Header}>
          <div className={`${styles.Header__Section} ${styles.pullRight}`}>
            {(token || typeof url === "string") && <Search />}
            {canGoBack(url) && <Home />}
            {token && <User />}
          </div>
          {canGoBack(url) && <Previous parent={parent} />}
          <h1 className={styles.Header__title}>
            {current && cleanName(current.name)}
          </h1>
        </header>
      </Headroom>
    </>
  );
}

Header.propTypes = {
  current: PropTypes.any,
  parent: PropTypes.any,
  url: PropTypes.any
};

export default Header;
