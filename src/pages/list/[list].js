import React from "react";

import withIndexReady from "../../hoc/withIndexReady";
import withAuth from "../../hoc/withAuth";
import Layout from "../../components/Layout";
import List from "../../components/List";
import { imageData } from "../../utils";

import Loading from "../../components/Loading";
import useFetch from "../../hooks/useFetch";

function ListManager({ currentUrl, path, isRetina, supportsWebp }) {
  const encodedPath = path ? `/${encodeURIComponent(path)}` : "";
  const { data, loading, error, retry } = useFetch(`list${encodedPath}`);

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
        <List
          books={data.books}
          isRetina={isRetina}
          supportsWebp={supportsWebp}
        />
      )}
    </Layout>
  );
}

ListManager.getInitialProps = async ({ query, req, token }) => {
  const path = query.list || "";
  const url = path ? `/list/${path}` : "";

  const { isRetina, supportsWebp } = imageData(req);

  return {
    isRetina,
    supportsWebp,
    currentUrl: url,
    path
  };
};

export default withAuth(withIndexReady(ListManager));
