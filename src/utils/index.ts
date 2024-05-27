export * from "./RandomUtil"
export * from "./DeviceId"

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

/**
 * 数组中查找符合条件的元素, 返回 (e,ix)
 */
export function find(arr, fn) {
  if (arr == null) {
    return null;
  }
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i)) {
      return [arr[i], i];
    }
  }
  return null;
}
