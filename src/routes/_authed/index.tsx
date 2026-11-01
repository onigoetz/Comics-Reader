import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import ListManager from "../../containers/ListManager";

const route = getRouteApi("/_authed/");

function ListPage() {
  const { isRetina, supportsWebp } = route.useRouteContext();

  return (
    <ListManager path="" isRetina={isRetina} supportsWebp={supportsWebp} />
  );
}

export const Route = createFileRoute("/_authed/")({
  component: ListPage
});
