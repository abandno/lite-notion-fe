import {v4 as uuidv4} from 'uuid';
import {murmur3} from 'murmurhash-js'

const CLIENT_ID = 'CLIENT_ID';

export class ClientId {
  // local Storage 里没有新增
  static getClientId() {
    let clientId = localStorage.getItem(CLIENT_ID)
    if (!clientId) {
      clientId = this.generateClientId() + '';
      localStorage.setItem(CLIENT_ID, clientId)
      console.log('generate new clientId:', clientId);
    }
    return parseInt(clientId);
  }

  private static generateClientId() {
    // murmurhash 3 算法对uuidv4生成的id进行hash
    let s = uuidv4() + Math.random().toString(16).substring(2, 12);
    // murmur3 32位有符号整数, 无符号右移0, 符号位就变成了数字的一部分
    let x = murmur3(s, 0x4ef5391a) >>> 0;
    // let x = BigInt(i) + BigInt(2 ** 31);
    let xs = x.toString(); // 9 or 10 位
    xs = xs.length < 10 ? '10' + xs : '1' + xs;
    return parseInt(xs);
  }
}

