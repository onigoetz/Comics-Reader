import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Headroom from "react-headroom";

import ChangePassword from "./ChangePassword";
import Search from "./Search";
import { cleanName } from "../utils";
import { IoIosHome, IoIosArrowBack, IoIosAccount } from "../components/Icons";

function isNotHome(url) {
  return url && url !== "/" && url !== "/list/";
}

function Home() {
  return (
    <Link
      to=""
      className="Header__item Header__item--link Button Button--link"
      title="Back to Home"
    >
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
          className="Header__item Header__item--link Button Button--link Button--back"
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
        className="Header__item Header__item--link Button Button--link Button--back"
        title={`Back to ${title}`}
      >
        <IoIosArrowBack />
        {title}
      </Link>
    </div>
  );
}

const Previous = withRouter(PreviousInner);

function User() {
  return (
    <div className="Button Button--link">
      <IoIosAccount />
      <div className="Dropdown__content">
        <button className="Link Button Button--link">Change Password</button>
        <ChangePassword />
        <Link to="/logout" className="Link">
          Logout
        </Link>
      </div>
    </div>
  );
}

function Header({ url, title, parent, previousUrl, token }) {
  return (
    <Headroom disableInlineStyles>
      <header className="Header">
        <div className="Header__Section pull-right">
          <Search />
          {isNotHome(url) ? <Home /> : null}
          {token ? <User /> : null}
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
  return { ...state.route, token: state.auth.token };
};

export default connect(mapStateToProps)(Header);
