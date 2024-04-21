import {post, get} from "@/utils/request";

export function addDocument() {
  return post('/api/document/add', {});
}

export function deleteDocument() {
  return post('/api/document/delete', {});
}

export function listDocument() {
  return get('/api/document/list', {});
}
