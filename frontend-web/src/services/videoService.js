import { api } from "./api";

function appendIfFilled(formData, key, value) {
  if (value !== undefined && value !== null && value !== "") {
    formData.append(key, value);
  }
}

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.rows)) return data.rows;
  return [];
}

function buildVideoFormData(payload = {}) {
  const formData = new FormData();

  appendIfFilled(formData, "title", payload.title);
  appendIfFilled(formData, "subtitle", payload.subtitle);
  appendIfFilled(formData, "category", payload.category);
  appendIfFilled(formData, "theme", payload.theme);
  appendIfFilled(formData, "user_id", payload.user_id);
  appendIfFilled(formData, "description", payload.description);
  appendIfFilled(formData, "thumbnail_url", payload.thumbnail_url);
  appendIfFilled(formData, "video_url", payload.video_url);

  if (payload.thumbnail instanceof File) {
    formData.append("thumbnail", payload.thumbnail);
  }

  if (payload.video instanceof File) {
    formData.append("video", payload.video);
  }

  return formData;
}

export async function listLiveVideos() {
  const { data } = await api.get("/live");
  return normalizeListResponse(data);
}

export async function listOnDemandVideos() {
  const { data } = await api.get("/ondemand");
  return normalizeListResponse(data);
}

export async function createLiveVideo(payload) {
  const formData = buildVideoFormData(payload);

  const { data } = await api.post("/live", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function updateLiveVideo(id, payload) {
  const formData = buildVideoFormData(payload);

  const { data } = await api.put(`/live/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function createOnDemandVideo(payload) {
  const formData = buildVideoFormData(payload);

  const { data } = await api.post("/ondemand", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function updateOnDemandVideo(id, payload) {
  const formData = buildVideoFormData(payload);

  const { data } = await api.put(`/ondemand/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function deleteLiveVideo(id) {
  const { data } = await api.delete(`/live/${id}`);
  return data;
}

export async function deleteOnDemandVideo(id) {
  const { data } = await api.delete(`/ondemand/${id}`);
  return data;
}
