/* global baseURL */

export function dirname(path) {
  return path.indexOf("/") === -1 ? "" : path.replace(/\\/g, "/").replace(/\/[^/]*\/?$/, "");
}

export function isNumeric(mixedVar) {
  const whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
  return (typeof mixedVar === "number" || (typeof mixedVar === "string" && whitespace.indexOf(mixedVar.slice(-1)) === -1)) && mixedVar !== "" && !isNaN(mixedVar);
}

export function image(preset, img) {
  if (!img) {
    return "";
  }

  return `${baseURL}images/cache/${preset}/${img.replace("#", "%23")}`;
}

const srcReplace = /(\.[A-z]{3,4}\/?(\?.*)?)$/;

export function toRetina(src) {
  return src.replace(srcReplace, "@2x$1");
}

export const isRetina = ((window.matchMedia && (window.matchMedia("only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)").matches || window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)").matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
