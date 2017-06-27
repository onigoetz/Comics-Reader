import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import Headroom from "react-headroom";

import {IoIosHome, IoIosArrowBack} from "./Icons";

export default class Header extends React.Component {

    isNotHome() {
        return this.props.url && this.props.url !== "/" && this.props.url !== "/list/";
    }

    render() {
        return <Headroom><header className="Header">
            {this.isNotHome() ? this.renderHome() : null}
            {this.isNotHome() ? this.renderPrevious() : null}
            <h1 className="Header__title">{this.props.title}</h1>
        </header></Headroom>;
    }

    renderHome() {
        return <Link to="" className="Button Button--link pull-right">
            <IoIosHome />
        </Link>;
    }

    renderPrevious() {
        if (!this.props.parent || this.props.parent === "") {
            return;
        }

        const url = "/list/" + this.props.parent.path;
        const title = this.props.parent.name;

        return <Link to={url} className="Button Button--link pull-left">
            <IoIosArrowBack />{title}
        </Link>;
    }
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    parent: PropTypes.any,
    url: PropTypes.any
};

Header.displayName = "Header";
