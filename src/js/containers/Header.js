import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Headroom from "react-headroom";

import Search from "./Search";
import { cleanName } from "../utils";
import { IoIosHome, IoIosArrowBack } from "../components/Icons";

function isNotHome(url) {
  return url && url !== "/" && url !== "/list/";
}

function Home() {
  return (
    <Link to="" className="Button Button--link" title="Back to Home">
      <IoIosHome />
    </Link>
  );
}

function PreviousInner({ parent, previousUrl, history }) {
  if (!parent || parent === "") {
    return null;
  }

  const url = `/list/${parent.path}`;
  const title = parent.name;

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
  }

  return (
    <div className="Header__Section pull-left">
      <Link
        to={url}
        className="Button Button--link Button--back"
        title={`Back to ${title}`}
      >
        <IoIosArrowBack />
        {title}
      </Link>
    </div>
  );
}

const Previous = withRouter(PreviousInner);

function Header({ url, title, parent, previousUrl }) {
  return (
    <Headroom disableInlineStyles>
      <header className="Header">
        <div className="Header__Section pull-right">
          <Search />
          {isNotHome(url) ? <Home /> : null}
        </div>
        {isNotHome(url) ? (
          <Previous parent={parent} previousUrl={previousUrl} />
        ) : null}
        <h1 className="Header__title">{cleanName(title)}</h1>
      </header>
    </Headroom>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  parent: PropTypes.any,
  url: PropTypes.any
};

const mapStateToProps = state => {
  return state.route;
};

export default connect(mapStateToProps)(Header);
