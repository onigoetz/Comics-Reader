import { createFileRoute, getRouteApi, redirect } from "@tanstack/react-router";

import { RawLoading } from "../components/Loading";
import apiFetch from "../fetch";
import { IndexReadyResponse } from "../types";

const route = getRouteApi("/index_not_ready");

function Page() {
  const indexReadyData = route.useLoaderData();

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

export const Route = createFileRoute("/index_not_ready")({
  loader: async () => {
    const indexReadyData = await apiFetch<IndexReadyResponse>("indexready");

    if (indexReadyData.ready) {
      throw redirect({ to: "/" });
    }

    return indexReadyData;
  },
  component: Page
});
