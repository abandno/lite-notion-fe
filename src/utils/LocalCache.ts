

export class LocalCache {
  private loader

  constructor(loader) {
    this.loader = loader;
  }

  set(key: string, value: any, expire: number) {
    const expireAt = new Date().getTime() + expire;
    localStorage.setItem(key, JSON.stringify([value, expireAt]));
  }

  get(key: string) {
    const item = localStorage.getItem(key);
    let value = null;
    if (item != null) {
      const playload = JSON.parse(item);
      if (playload[1] > new Date().getTime()) {
        value = playload[0];
      }
    }

    if (value != null) {
      return value;
    }

    // 不存在或已过期
    const nv = this.loader && this.loader(key, this);
    return nv;
  }

}
