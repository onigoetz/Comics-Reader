import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//import Headroom from "react-headroom";

import ChangePassword from "./ChangePassword";
import Search from "./Search";
import { IoIosHome, IoIosArrowBack, IoIosAccount } from "../components/Icons";

class Header extends Component {
  isNotHome() {
    return (
      this.props.url && this.props.url !== "/" && this.props.url !== "/list/"
    );
  }

  render() {
    return (
      <header className="Header">
        <div className="Header__Section pull-right">
          <Search />
          {this.isNotHome() ? this.renderHome() : null}
          {this.props.token ? this.renderUser() : null}
        </div>
        {this.isNotHome() ? this.renderPrevious() : null}
        <h1 className="Header__title">{this.props.title}</h1>
      </header>
    );
  }

  renderUser() {
    return (
      <div className="Button Button--link">
        <IoIosAccount />
        <div className="Dropdown__content">
          <button className="Link Button Button--link">
            Change Password
          </button>
          <ChangePassword />
          <Link to="/logout" className="Link">
            Logout
          </Link>
        </div>
      </div>
    );
  }

  renderHome() {
    return (
      <Link to="" className="Header__item Header__item--link Button Button--link" title="Back to Home">
        <IoIosHome />
      </Link>
    );
  }

  renderPrevious() {
    if (!this.props.parent || this.props.parent === "") {
      return null;
    }

    const url = `/list/${this.props.parent.path}`;
    const title = this.props.parent.name;

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
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  parent: PropTypes.any,
  url: PropTypes.any
};

Header.displayName = "Header";

const mapStateToProps = state => {
  return { ...state.route, token: state.auth.token };
};

export default connect(mapStateToProps)(Header);
