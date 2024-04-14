import request from "@/utils/request";
import {post} from "@/utils/request";
import Mock from 'mockjs';

export function addDocument() {
  if (process.env.REACT_MOCK_API) {
    return Mock.mock('/api/document/add', 'post', {
      code: 0,
      msg: "success",
      data: {
        id: 1,
        title: "mock",
        content: "mock",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });
  }
  return post('/document/add', {});
}
