import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import Layout from "../../components/Layout";
import { fetchWithAuth } from "../../fetch";
import { IndexError } from "../../types";

const route = getRouteApi("/_authed/errors");

function Errors() {
  const { errors } = route.useLoaderData();

  return (
    <Layout current={{ name: "Errors" }}>
      <ol>
        {errors.length === 0 && (
          <li>No error while indexing, enjoy all your books !</li>
        )}
        {errors.map(item => {
          return (
            <li key={item[0]}>
              <strong>{item[0]}</strong>
              <br />
              <p>{item[1].message}</p>
              <pre>{item[1].stack}</pre>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
}

export const Route = createFileRoute("/_authed/errors")({
  loader: ({ context }) =>
    fetchWithAuth<{ errors: [string, IndexError][] }>(context.token, "errors"),
  component: Errors
});
