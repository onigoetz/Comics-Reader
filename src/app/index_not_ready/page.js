import React from "react";
import { redirect } from "next/navigation";

import { RawLoading } from "../../components/Loading";
import comicsIndex from "../../../server/comics";

export default function Page() {
  checkAuth();

  const indexReadyData = {
    ready: comicsIndex.isReady,
    books: comicsIndex.foundBooks,
    thumbs: comicsIndex.foundThumbs,
    phase: comicsIndex.phase
  };

  if (indexReadyData.ready) {
    redirect("/");
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
