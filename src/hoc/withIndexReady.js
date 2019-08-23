import React from "react";

import { RawLoading } from "../components/Loading";
import { getDisplayName, getIndexReady } from "../utils";

export default function withIndexReady(WrappedComponent) {
  const component = ({ indexReady, ...props }) =>
    indexReady ? (
      <WrappedComponent {...props} />
    ) : (
      <RawLoading>
        Scanning for Comics...
        <br />
        <small>This might take a while, come back later</small>
      </RawLoading>
    );

  component.getInitialProps = async ctx => {
    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    const indexReady = await getIndexReady();

    return { ...componentProps, indexReady };
  };

  component.displayName = `withIndexReady(${getDisplayName(WrappedComponent)})`;

  return component;
}
