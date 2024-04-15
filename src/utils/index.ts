export function removeIf(arr, fn) {
  if (arr == null) {
    return arr;
  }
  return arr.filter(fn)
}

export function isTrue(obj) {
  return obj && obj === "true";
}
