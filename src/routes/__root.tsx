import { ReactNode } from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  redirect,
  Scripts
} from "@tanstack/react-router";

import normalizeCss from "normalize.css/normalize.css?url";
import photoswipeCss from "photoswipe/style.css?url";
import variablesCss from "../css/variables.css?url";
import baseCss from "../css/base.css?url";
import headroomCss from "../css/headroom.css?url";
import buttonCss from "../css/Button.css?url";

import apiFetch from "../fetch";
import { getToken } from "../auth/auth";
import { getAuthMode, imageData } from "../utils";
import { IndexReadyResponse } from "../types";

const accountManagementURLs = /^\/(login|logout|change_password).*/;
const loginURLs = /^\/login.*/;
const indexNotReadyURL = "/index_not_ready";

const stylesheets = [
  normalizeCss,
  photoswipeCss,
  variablesCss,
  baseCss,
  headroomCss,
  buttonCss
];

const appleTouchIconSizes = ["60x60", "76x76", "120x120", "152x152", "180x180"];

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const pathname = location.pathname;
    const authMode = await getAuthMode();

    if (authMode === "db" && !loginURLs.test(pathname) && !getToken()) {
      throw redirect({ to: "/login" });
    }

    if (authMode !== "db" && accountManagementURLs.test(pathname)) {
      throw redirect({ to: "/" });
    }

    const indexData = await apiFetch<IndexReadyResponse>("indexready");
    if (
      !indexData.ready &&
      pathname !== indexNotReadyURL &&
      !accountManagementURLs.test(pathname)
    ) {
      throw redirect({ to: indexNotReadyURL });
    }

    return { authMode, ...imageData() };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "application-name", content: "Comic Books" },
      { name: "theme-color", content: "#000000" },
      { name: "msapplication-TileColor", content: "#b82824" },
      {
        name: "msapplication-config",
        content: "/static/images/browserconfig.xml"
      },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "apple-mobile-web-app-title", content: "Comic Books" }
    ],
    links: [
      ...stylesheets.map(href => ({ rel: "stylesheet", href })),
      { rel: "manifest", href: "/manifest.json" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/static/images/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/static/images/favicon-16x16.png"
      },
      {
        rel: "mask-icon",
        href: "/static/images/safari-pinned-tab.svg",
        color: "#b82824"
      },
      ...appleTouchIconSizes.map(sizes => ({
        rel: "apple-touch-icon",
        sizes,
        href: `/static/images/apple-touch-icon-${sizes}.png`
      }))
    ]
  }),
  component: RootComponent
});
