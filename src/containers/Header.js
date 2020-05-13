/* global process */
import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Headroom from "react-headroom";
import Head from "next/head";

import Search from "./Search";
import { cleanName, createUrl } from "../utils";
import { FiChevronLeft, FiUser, FiHome } from "react-icons/fi";
import { useAuth } from "../hoc/withAuth";

function isNotHome(url) {
  return url !== "/" && url !== "/list/";
}

function canGoBack(url) {
  return url && isNotHome() && url !== "/login";
}

function Home() {
  return (
    <Link href="/">
      <a className="Button Button--link" title="Back to Home">
        <FiHome />
      </a>
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

  const linkProps = parent.path
    ? {
        href: "/list/[list]",
        as: createUrl(parent)
      }
    : { href: "/" };

  return (
    <div className="Header__Section pull-left">
      <Link {...linkProps}>
        <a
          className="Button Button--link Button--back"
          title={`Back to ${title}`}
        >
          <FiChevronLeft />
          {title}
        </a>
      </Link>
    </div>
  );
}

function User() {
  return (
    <div className="Button Button--link">
      <FiUser />
      <div className="Dropdown__content">
        <Link href="/change_password">
          <a className="Link">Change Password</a>
        </Link>
        <Link href="/logout">
          <a className="Link">Logout</a>
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#000000" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href={`/static/images/apple-touch.png`} />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/static/images/apple-touch-72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/static/images/apple-touch-114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/static/images/apple-touch-144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="256x156"
          href="/static/images/apple-touch-256.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/static/images/apple-touch-512.png"
        />
      </Head>
      <Headroom disableInlineStyles>
        <header className="Header">
          <div className="Header__Section pull-right">
            {(token || url) && <Search />}
            {canGoBack(url) && <Home />}
            {token && <User />}
          </div>
          {canGoBack(url) && <Previous parent={parent} />}
          <h1 className="Header__title">
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
