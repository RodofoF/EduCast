import { api } from "./api";

export async function listUsers() {
  const { data } = await api.get("/users");
  return Array.isArray(data) ? data : data?.users || data?.data || [];
}

export async function createUser(payload) {
  const { data } = await api.post("/users", payload);
  return data;
}

export async function updateUser(userId, payload) {
  const { data } = await api.put(`/users/${userId}`, payload);
  return data;
}

export async function deleteUser(userId) {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
}