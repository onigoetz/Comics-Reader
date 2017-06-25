import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 -1 50 50">
                <path d="M 25 0.052734375 C 24.728 0.052734375 24.466344 0.16432813 24.277344 0.36132812 L 0.38867188 25.25 C 0.005671875 25.648 0.01896875 26.281063 0.41796875 26.664062 C 0.81596875 27.045063 1.4490312 27.033766 1.8320312 26.634766 L 5 23.333984 L 5 50 L 45 50 L 45 23.335938 L 48.167969 26.636719 C 48.363969 26.841719 48.627625 26.943359 48.890625 26.943359 C 49.139625 26.943359 49.389031 26.851016 49.582031 26.666016 C 49.980031 26.282016 49.993328 25.649953 49.611328 25.251953 L 25.720703 0.36132812 C 25.532703 0.16432812 25.272 0.052734375 25 0.052734375 z M 35 5 L 35 8.015625 L 41 14.265625 L 41 5 L 35 5 z M 20 29 L 30 29 L 30 48 L 20 48 L 20 29 z" transform="translate(1 -1)" />
            </svg>
        </Link>;
    }

    renderPrevious() {

        if (!this.props.parent || this.props.parent === "") {
            return;
        }

        const url = "/list/" + this.props.parent.path;
        const title = this.props.parent.name;

        return <Link to={url} className="Button Button--link pull-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path  d="M 32.136719 3.0605469 A 1.0001 1.0001 0 0 0 31.443359 3.3515625 L 10.357422 24.265625 A 1.0001 1.0001 0 0 0 10.351562 25.679688 L 31.265625 46.765625 A 1.0001 1.0001 0 0 0 32.679688 46.771484 L 38.705078 40.794922 A 1.0001 1.0001 0 0 0 38.710938 39.380859 L 24.476562 25.029297 L 38.826172 10.796875 A 1.0001 1.0001 0 0 0 38.832031 9.3828125 L 32.857422 3.3574219 A 1.0001 1.0001 0 0 0 32.136719 3.0605469 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible" />
            </svg>{title}
        </Link>;
    }
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    parent: PropTypes.any,
    url: PropTypes.any
};

Header.displayName = "Header";
