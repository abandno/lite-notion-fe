import {post, get} from "@/utils/request";

export function addDocument(param) {
  return post('/api/document/add', param);
}

export function deleteDocument(param) {
  return post('/api/document/delete', param);
}

export function listDocument(param) {
  return get('/api/document/list', param);
}
