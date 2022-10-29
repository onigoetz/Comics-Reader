import React, { useState } from "react";

import { fetchWithAuth } from "../../fetch";
import withAuth, { useAuth } from "../../hoc/withAuth";
import Book from "../../components/Book";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { imageData, urlizeNode } from "../../utils";
import useFetch from "../../hooks/useFetch";

function markRead(token, book) {
  return fetchWithAuth(token, `read/${urlizeNode(book)}`, {
    method: "POST"
  });
}

function BookManager({ currentUrl, path, isRetina, supportsWebp }) {
  const [isRead, setRead] = useState(false);
  const { token } = useAuth();

  const { data, loading, error, retry } = useFetch(
    `book/${encodeURIComponent(path)}`
  );

  return (
    <Layout
      url={currentUrl}
      current={data ? data.dir : null}
      parent={data ? data.parent : null}
    >
      {loading && <Loading inline />}
      {error && (
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

BookManager.getInitialProps = async ({ query, req }) => {
  const path = query.book;
  const url = `/book/${path}`;

  const { isRetina, supportsWebp } = imageData(req);

  return {
    isRetina,
    supportsWebp,
    currentUrl: url,
    path
  };
};

export default withAuth(BookManager);
