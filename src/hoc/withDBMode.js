/* global process */
import React from "react";

import { redirect, getDisplayName, getAuthMode } from "../utils";

export default function withDBMode(WrappedComponent) {
  function Component(props) {
    return <WrappedComponent {...props} />;
  }

  Component.getInitialProps = async ctx => {
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

  Component.displayName = `withDBMode(${getDisplayName(WrappedComponent)})`;

  return Component;
}
