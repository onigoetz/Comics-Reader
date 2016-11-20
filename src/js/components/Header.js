import React from "react";
import Link from "react-router/Link";
import Headroom from "react-headroom";

export default class Header extends React.Component {
    render() {
        return <Headroom><header className="Header">
            {this.props.url ? this.renderHome() : null}
            {this.props.url ? this.renderPrevious() : null}
            <h1 className="Header__title">{this.props.title}</h1>
        </header></Headroom>;
    }

    renderHome() {
        return <Link to="" className="Button Button--link pull-right">
            <span className="icon icon-home"> </span>
        </Link>;
    }

    renderPrevious() {

        if (!this.props.parent || this.props.parent == "") {
            return;
        }

        const url = "/list/" + this.props.parent.path;
        const title = this.props.parent.name;

        return <Link to={url} className="Button Button--link pull-left">
            <span className="icon icon-left-nav"> </span>{title}
        </Link>;
    }
}

Header.propTypes = {
    title: React.PropTypes.string.isRequired,
    parent: React.PropTypes.any,
    url: React.PropTypes.any
};
