import React from "react";

import { RawLoading } from "../components/Loading";
import { getDisplayName } from "../utils";
import apiFetch from "../fetch";

let globalIndexReady = { ready: false };
export async function getIndexReady() {
  if (!globalIndexReady.ready) {
    globalIndexReady = await apiFetch("indexready");
  }

  return globalIndexReady.ready;
}

export default function withIndexReady(WrappedComponent) {
  function Component({ indexReady, indexReadyData, ...props }) {
    if (indexReady) {
      return <WrappedComponent {...props} />;
    }

    return (
      <RawLoading>
        {indexReadyData.phase === "NONE" && <h1>Scan will begin shortly</h1>}
        {indexReadyData.phase === "SCAN" && (
          <>
            <h1>Scanning for Comics...</h1>
            <br />
            <small>{indexReadyData.books} books and directories found</small>
          </>
        )}
        {indexReadyData.phase === "THUMBS" && (
          <>
            <h1>Computing thumbnails...</h1>
            <br />

            <small>
              {Math.floor((indexReadyData.thumbs / indexReadyData.books) * 100)}
              % done
            </small>
          </>
        )}
        <br />
        <br />
        <small>This might take a while, come back later...</small>
      </RawLoading>
    );
  }

  Component.getInitialProps = async ctx => {
    const indexReady = await getIndexReady();

    if (!indexReady) {
      return { indexReady, indexReadyData: globalIndexReady };
    }

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, indexReady };
  };

  Component.displayName = `withIndexReady(${getDisplayName(WrappedComponent)})`;

  return Component;
}
