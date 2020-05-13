import React from "react";

import "normalize.css/normalize.css";
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";
import "../css/variables.css";
import "../css/base.css";
import "../css/headroom.css";
import "../css/Button.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
