import React from "react";

import { RawLoading } from "../components/Loading";
import { getDisplayName } from "../utils";
import apiFetch from "../fetch";

let indexReady;
let indexReadyData;
export async function getIndexReady() {
  if (!indexReady) {
    indexReadyData = await apiFetch("indexready");
    indexReady = indexReadyData.ready;
  }

  return indexReady;
}

export default function withIndexReady(WrappedComponent) {
  const component = ({ indexReady, indexReadyData, ...props }) =>
    indexReady ? (
      <WrappedComponent {...props} />
    ) : (
      <RawLoading>
        {indexReadyData.phase == "NONE" && <h1>Scan will begin shortly</h1>}
        {indexReadyData.phase == "SCAN" && (
          <>
            <h1>Scanning for Comics...</h1>
            <br />
            <small>{indexReadyData.books} books and directories found</small>
          </>
        )}
        {indexReadyData.phase == "THUMBS" && (
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

  component.getInitialProps = async ctx => {
    const indexReady = await getIndexReady();

    if (!indexReady) {
      return { indexReady, indexReadyData };
    }

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, indexReady };
  };

  component.displayName = `withIndexReady(${getDisplayName(WrappedComponent)})`;

  return component;
}
