import Router from "next/router";

import { RawLoading } from "../components/Loading";
import { redirect } from "../utils";
import apiFetch from "../fetch";

export default function Page({ indexReadyData }) {
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
            {Math.floor((indexReadyData.thumbs / indexReadyData.books) * 100)}%
            done
          </small>
        </>
      )}
      <br />
      <br />
      <small>This might take a while, come back later...</small>
    </RawLoading>
  );
}

Page.getInitialProps = async ctx => {
  const indexReadyData = await apiFetch("indexready");

  if (indexReadyData.ready) {
    redirect(ctx.res, Router, "/");
    return {};
  }

  return { indexReadyData };
};
