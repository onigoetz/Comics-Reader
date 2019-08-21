/* global process */
import React from "react";

import { redirect, getDisplayName, getAuthMode } from "../utils";

export default function withDBMode(WrappedComponent) {
  const component = props => <WrappedComponent {...props} />;

  component.getInitialProps = async ctx => {
    const authMode = await getAuthMode();
    // Can only use this page in DB Mode
    if (authMode !== "db") {
      redirect(ctx.res, "/");
      return {};
    }

    return (
      (WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx))) ||
      {}
    );
  };

  component.displayName = `withDBMode(${getDisplayName(WrappedComponent)})`;

  return component;
}
