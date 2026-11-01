import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { TYPE_DIR } from "./types";
import { ClientNode, ImageData } from "./types";

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

  if ("createImageBitmap" in window) {
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

export const imageData = createIsomorphicFn()
  .server(
    (): ImageData => {
      const accept = getRequestHeader("accept");
      return {
        isRetina,
        supportsWebp: !!accept && accept.indexOf("image/webp") > -1
      };
    }
  )
  .client((): ImageData => ({ isRetina, supportsWebp }));

export function cleanName(name: string) {
  return name.replace(/(\.(:?cbr|cbz|zip|rar|pdf))$/, "");
}

export function cleanPath(path: string) {
  return path.replace(/#/g, "%23");
}

export function image(
  img: string | undefined,
  preset: string,
  withRetina: boolean,
  withWebp: boolean
) {
  if (!img) {
    return "";
  }

  let imageUrl = cleanPath(img);
  if (withRetina) {
    imageUrl = imageUrl.replace(/(\.[A-z]{3,4}\/?(\?.*)?)$/, "@2x$1");
  }

  if (!withWebp) {
    imageUrl = imageUrl.replace(/\.webp$/, ".webp.png");
  }

  return `/images/cache/${preset}/${imageUrl}`;
}

export function urlizeNode(node: string) {
  return cleanPath(node).replace(/\//g, "|");
}

/**
 * Link props for a node, the router takes care of encoding the params
 */
export function nodeLink(node: Pick<ClientNode, "type" | "path">) {
  const param = node.path.replace(/\//g, "|");

  return node.type === TYPE_DIR
    ? ({ to: "/list/$list", params: { list: param } } as const)
    : ({ to: "/book/$book", params: { book: param } } as const);
}

let authMode: string | undefined;
export async function getAuthMode() {
  if (!authMode) {
    const { mode } = await apiFetch<{ mode: string }>("auth_mode");
    authMode = mode;
  }

  return authMode;
}
