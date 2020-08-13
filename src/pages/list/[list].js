import React from "react";

import withIndexReady from "../../hoc/withIndexReady";
import withAuth from "../../hoc/withAuth";
import Layout from "../../components/Layout";
import List from "../../components/List";
import { fetchWithAuth } from "../../fetch";
import { imageData } from "../../utils";

function ListManager({
  currentUrl,
  dir,
  parent,
  books,
  isRetina,
  supportsWebp
}) {
  return (
    <Layout url={currentUrl} current={dir} parent={parent}>
      <List books={books} isRetina={isRetina} supportsWebp={supportsWebp} />
    </Layout>
  );
}

ListManager.getInitialProps = async ({ query, req, token }) => {
  const path = query.list || "";
  const url = !!path ? `/list/${path}` : "";

  const { isRetina, supportsWebp } = imageData(req);

  const { dir, parent, books } = await fetchWithAuth(
    token,
    `list${path ? `/${encodeURIComponent(path)}` : ""}`
  );

  return {
    isRetina,
    supportsWebp,
    currentUrl: url,
    dir,
    parent,
    books
  };
};

export default withAuth(withIndexReady(ListManager));
