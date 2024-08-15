import React from "react";
import { redirect } from "next/navigation";

import comicsIndex from "../../../server/comics";
import { RawLoading } from "../components/Loading";

export default async function Page() {
  if (comicsIndex.isReady) {
    redirect("/");
  }

  const thumbs = comicsIndex.foundThumbs;
  const books = comicsIndex.foundBooks;

  return (
    <RawLoading>
      {comicsIndex.phase === "NONE" && <h1>Scan will begin shortly</h1>}
      {comicsIndex.phase === "SCAN" && (
        <>
          <h1>Scanning for Comics...</h1>
          <br />
          <small>{books} books and directories found</small>
        </>
      )}
      {comicsIndex.phase === "THUMBS" && (
        <>
          <h1>Computing thumbnails...</h1>
          <br />

          <small>{Math.floor((thumbs / books) * 100)}% done</small>
        </>
      )}
      <br />
      <br />
      <small>This might take a while, come back later...</small>
    </RawLoading>
  );
}
