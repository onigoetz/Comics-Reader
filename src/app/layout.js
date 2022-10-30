import Header from "../containers/Header";

import "normalize.css/normalize.css";
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";
import "../css/variables.css";
import "../css/base.css";
import "../css/headroom.css";
import "../css/Button.css";

export default function RootLayout({ children }) {
  const url = null;
  const current = null;
  const parent = null;

  return (
    <html lang="en">
      <head>
        {/* Generic PWA meta */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Comic Books" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/images/favicon-16x16.png"
        />

        {/* MS Edge */}
        <meta name="msapplication-TileColor" content="#b82824" />
        <meta
          name="msapplication-config"
          content="/static/images/browserconfig.xml"
        />

        {/* Safari */}
        <link
          rel="mask-icon"
          href="/static/images/safari-pinned-tab.svg"
          color="#b82824"
        />

        {/* iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Comic Books" />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/static/images/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/static/images/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/static/images/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/static/images/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/images/apple-touch-icon-180x180.png"
        />
      </head>
      <body>
        <Header url={url} current={current} parent={parent} />
        {children}
      </body>
    </html>
  );
}
