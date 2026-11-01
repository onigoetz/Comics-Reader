import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import ListManager from "../../containers/ListManager";

const route = getRouteApi("/_authed/list/$list");

function ListPage() {
  const { list } = route.useParams();
  const { isRetina, supportsWebp } = route.useRouteContext();

  return (
    <ListManager path={list} isRetina={isRetina} supportsWebp={supportsWebp} />
  );
}

export const Route = createFileRoute("/_authed/list/$list")({
  component: ListPage
});
