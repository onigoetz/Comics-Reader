import React from "react";
import { Portal } from "react-portal";

const ESCAPE = 27;

export default class Dialog extends React.Component {
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown);
    document.addEventListener("click", this.handleOutsideMouseClick);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
    document.removeEventListener("click", this.handleOutsideMouseClick);
  }

  closePortal() {
    this.props.onExit();
  }

  handleKeydown = (e) => {
    if (e.keyCode === ESCAPE) {
      this.closePortal();
    }
  }

  handleOutsideMouseClick = (e) => {
    const root = this.portalNode;
    if (!root || root.contains(e.target)) {
      return;
    }

    this.closePortal();
  }

  render() {
    return <Portal>
      <div className="DialogWrapper">
        <div className="Dialog" ref={ portalNode => ( this.portalNode = portalNode ) }>
          <h2 className="Dialog__title">{this.props.title}</h2>
          <div className="Dialog__content">
            {this.props.children}
          </div>
        </div>
      </div>
    </Portal>;
  }
}
