/* global process */
import Router from "next/router";
import { TYPE_DIR } from "./types";

import apiFetch from "./fetch";

const serverSide = typeof window === "undefined";

let isRetina = false;
let supportsWebp = false;
(() => {
  if (serverSide) {
    return;
  }

  const mediaQuery =
    "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
  isRetina =
    window.devicePixelRatio > 1.5 ||
    (window.matchMedia && window.matchMedia(mediaQuery).matches);

  if (window.createImageBitmap) {
    const webpData =
      "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    fetch(webpData)
      .then(r => r.blob())
      .then(blob =>
        createImageBitmap(blob).then(
          () => {
            supportsWebp = true;
          },
          () => {}
        )
      );
  }
})();

export function getDisplayName(Component) {
  return Component.displayName || Component.name || "Component";
}

export function imageData(req) {
  if (serverSide) {
    const accept = req.headers.accept;
    return {
      isRetina,
      supportsWebp: accept && accept.indexOf("image/webp") > -1
    };
  }

  return { isRetina, supportsWebp };
}

export function cleanName(name) {
  return name.replace(/(\.(:?cbr|cbz|zip|rar|pdf))$/, "");
}

export function cleanPath(path) {
  return path.replace(/#/g, "%23");
}

export function image(img, preset, withRetina, withWebp) {
  if (!img) {
    return "";
  }

  let imageUrl = cleanPath(img);
  if (withRetina) {
    imageUrl = imageUrl.replace(/(\.[A-z]{3,4}\/?(\?.*)?)$/, "@2x$1");
  }

  // If webp isn't supported, we suffix with .png so that
  // the server can generate cacheable converted images
  if (!withWebp) {
    imageUrl = imageUrl.replace(/\.webp$/, ".webp.png");
  }

  return `/images/cache/${preset}/${imageUrl}`;
}

export function urlizeNode(node) {
  return cleanPath(node).replace(/\//g, "|");
}

export function createUrl(node) {
  return (node.type === TYPE_DIR ? "/list/" : "/book/") + urlizeNode(node.path);
}

export function redirect(res, url) {
  if (res) {
    res.redirect(url);
  } else {
    Router.push(url);
  }
}

let authMode;
export async function getAuthMode() {
  if (!authMode) {
    const { mode } = await apiFetch("auth_mode");
    authMode = mode;
  }

  return authMode;
}

let indexReady;
export async function getIndexReady() {
  if (!indexReady) {
    const { ready } = await apiFetch("indexready");
    indexReady = ready;
  }

  return indexReady;
}