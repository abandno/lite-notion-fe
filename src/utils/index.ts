export * from "./RandomUtil"

export function removeIf(arr, fn) {
  if (arr == null) {
    return arr;
  }
  return arr.filter(fn)
}

export function isTrue(obj) {
  return obj && obj === "true";
}

/**
 * item 转换成 k1=v1&k2=v2
 * @param obj
 * @return {string} "" if null or empty
 */
export function toQueryString(obj={}) {
  if (obj == null) {
    return "";
  }
  return Object.keys(obj)
    .map(key => key + "=" + obj[key])
    .join("&");
}
