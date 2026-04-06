import { api } from "./auth";
import type { ContentItem } from "../types/content";

export async function getContents(): Promise<ContentItem[]> {
  const { data } = await api.get("/content");

  const items = Array.isArray(data) ? data : data?.contents || data?.data || [];

  return [...items].sort((a, b) => {
    const dateA = new Date(a?.createdAt || 0).getTime();
    const dateB = new Date(b?.createdAt || 0).getTime();
    return dateB - dateA;
  });
}