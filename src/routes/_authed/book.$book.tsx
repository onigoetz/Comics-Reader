import { useState } from "react";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { fetchWithAuth } from "../../fetch";
import { useAuth } from "../../auth/auth";
import Book from "../../components/Book";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { urlizeNode } from "../../utils";
import useFetch from "../../hooks/useFetch";
import { BookResponse } from "../../types";

const route = getRouteApi("/_authed/book/$book");

function markRead(token: string | null, book: string) {
  return fetchWithAuth(token, `read/${urlizeNode(book)}`, {
    method: "POST"
  });
}

function BookManager() {
  const { book: path } = route.useParams();
  const { isRetina, supportsWebp } = route.useRouteContext();
  const currentUrl = `/book/${path}`;

  const [isRead, setRead] = useState(false);
  const { token } = useAuth();

  const { data, loading, error, retry } = useFetch<BookResponse>(
    `book/${encodeURIComponent(path)}`
  );

  return (
    <Layout
      url={currentUrl}
      current={data ? data.book : null}
      parent={data ? data.parent : null}
    >
      {loading && <Loading inline />}
      {!!error && (
        <>
          An error occured while loading this page
          <br />
          <button className="Button" onClick={retry}>
            Retry
          </button>
        </>
      )}
      {data && !loading && (
        <div className="Content Content--gallery">
          <Book
            isRetina={isRetina}
            supportsWebp={supportsWebp}
            pages={data.pages}
            read={data.read || isRead}
            onRead={() => {
              markRead(token, path).then(() => {
                setRead(true);
              });
            }}
          />
        </div>
      )}
    </Layout>
  );
}

export const Route = createFileRoute("/_authed/book/$book")({
  component: BookManager
});
