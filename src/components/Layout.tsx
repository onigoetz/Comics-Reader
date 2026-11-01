import { ReactNode } from "react";

import Header from "../containers/Header";
import { ClientNode } from "../types";

interface LayoutProps {
  children: ReactNode;
  url?: string;
  current?: Pick<ClientNode, "name"> | null;
  parent?: ClientNode | null;
}

export default function Layout({
  children,
  url,
  current,
  parent
}: LayoutProps) {
  return (
    <>
      <Header url={url} current={current} parent={parent} />
      {children}
    </>
  );
}
