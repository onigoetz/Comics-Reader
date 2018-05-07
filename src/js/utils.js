/* global baseURL */

import { TYPE_DIR } from "./types";

const mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
const isRetina = window.devicePixelRatio > 1.5 || (window.matchMedia && window.matchMedia(mediaQuery).matches);

export function dirname(path) {
  return path.indexOf("/") === -1
    ? ""
    : path.replace(/\\/g, "/").replace(/\/[^/]*\/?$/, "");
}

export function basename(path) {
  return path.indexOf("/") === -1
    ? path
    : `${path}`.substring(path.lastIndexOf("/") + 1);
}

export function isNumeric(mixedVar) {
  const whitespace =
    " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
  return (
    (typeof mixedVar === "number" ||
      (typeof mixedVar === "string" &&
        whitespace.indexOf(mixedVar.slice(-1)) === -1)) &&
    mixedVar !== "" &&
    !isNaN(mixedVar)
  );
}

export function image(preset, img) {
  if (!img) {
    return "";
  }

  let imageUrl = img.replace("#", "%23");
  if (isRetina) {
    imageUrl = img.replace(/(\.[A-z]{3,4}\/?(\?.*)?)$/, "@2x$1");
  }

  return `${baseURL}images/cache/${preset}/${imageUrl}`;
}

export function createUrl(node) {
  return (node.type === TYPE_DIR ? "/list/" : "/book/") + node.path;
}

export function thumb(path) {
  return `${baseURL}thumb/${isRetina ? 2 : 1}/${path.replace("#", "%23")}`;
}
