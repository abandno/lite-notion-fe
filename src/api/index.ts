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

export function moveNode(param) {
  return post('/api/document/moveNode', param);
}

export function updateDocInfo(param) {
  return post('/api/document/updateDocInfo', param);
}

export function getDocInfo(param) {
  return get('/api/document/getDocInfo', param);
}
