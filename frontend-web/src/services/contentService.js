import { api } from "./api";

export async function listContents() {
  const { data } = await api.get("/content");
  return Array.isArray(data) ? data : data?.contents || data?.data || [];
}

export async function createContent(payload) {
  const { data } = await api.post("/content", payload);
  return data;
}

export async function updateContent(contentId, payload) {
  const { data } = await api.put(`/content/${contentId}`, payload);
  return data;
}

export async function deleteContent(contentId) {
  const { data } = await api.delete(`/content/${contentId}`);
  return data;
}