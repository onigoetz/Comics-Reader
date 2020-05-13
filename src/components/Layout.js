import React from "react";

import Header from "../containers/Header";

export default function Layout({ children, url, current, parent }) {
  return (
    <>
      <Header url={url} current={current} parent={parent} />
      {children}
    </>
  );
}
