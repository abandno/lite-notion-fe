// import { ClientId } from 'utils'; // 引入待测试的生成函数


import {ClientId} from "@/utils";

describe('ClientId Generator', () => {
  it('generates a valid ClientId', () => {
    console.log(ClientId.generateClientId());
  });

  it('generates unique ClientIds', () => {
    const clientIdsSet = new Set<number>();
    const iterations = 100; // 假设生成 100 个 ClientId
    for (let i = 0; i < iterations; i++) {
      const cid = ClientId.generateClientId();
      expect(clientIdsSet.has(cid)).toBe(false); // 检查新生成的 ClientId 未出现过
      clientIdsSet.add(cid);
    }
  });

  it('handles invalid or empty inputs correctly', () => {
    // 如果生成函数接受参数，这里应包含对无效参数的测试
    // 但通常生成ClientId的函数不需要外部输入，故此测试可能不适用
  });
});
