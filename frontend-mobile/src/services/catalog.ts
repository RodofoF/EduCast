import { api } from "./auth";
import type { CatalogItem, CatalogSection } from "../types/catalog";
import { readPlaybackProgressMap } from "./storage";

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://192.168.1.11:3000";

function resolveAssetUrl(value?: string | null) {
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_BASE}${value}`;
  }

  return `${API_BASE}/${value}`;
}

function randomColorFromString(seed: string) {
  const palette = [
    "#1d4ed8",
    "#0f766e",
    "#6d28d9",
    "#b45309",
    "#be123c",
    "#7c3aed",
    "#0369a1",
    "#14532d",
    "#7f1d1d",
    "#312e81",
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return palette[Math.abs(hash) % palette.length];
}

function formatDurationFromUrl(url: string, type: "LIVE" | "VOD") {
  if (type === "LIVE") return "Ao vivo";

  const lower = url.toLowerCase();

  if (lower.endsWith(".mp4")) return "Vídeo";
  if (lower.endsWith(".m3u8")) return "Stream";
  return "Conteúdo";
}

function normalizeListResponse(data: any) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.contents)) return data.contents;
  if (Array.isArray(data?.lives)) return data.lives;
  if (Array.isArray(data?.ondemands)) return data.ondemands;
  return [];
}

function mapLiveToCatalogItem(item: any): CatalogItem {
  const videoUrl = resolveAssetUrl(item?.video_url);
  const thumbnailUrl = resolveAssetUrl(item?.thumbnail_url);

  return {
    id: `live-${item?.id}`,
    title: item?.title || "Live sem título",
    subtitle: item?.subtitle || "Ao vivo",
    description: item?.description || "Transmissão ao vivo disponível no EduCast.",
    duration: formatDurationFromUrl(videoUrl, "LIVE"),
    category: item?.category || "Ao vivo",
    badge: "AO VIVO",
    type: "LIVE",
    url: videoUrl,
    artworkColor: randomColorFromString(`live-${item?.id}-${item?.title || ""}`),
    teacher: item?.theme || "Ao vivo",
    lessons: 1,
    thumbnailUrl,
    theme: item?.theme || "",
    createdAt: item?.createdAt,
    updatedAt: item?.updatedAt,
  };
}

function mapOnDemandToCatalogItem(item: any): CatalogItem {
  const videoUrl = resolveAssetUrl(item?.video_url);
  const thumbnailUrl = resolveAssetUrl(item?.thumbnail_url);

  return {
    id: `vod-${item?.id}`,
    title: item?.title || "Vídeo sem título",
    subtitle: item?.subtitle || "Conteúdo gravado",
    description: item?.description || "Conteúdo on-demand disponível no EduCast.",
    duration: formatDurationFromUrl(videoUrl, "VOD"),
    category: item?.category || "Videoaulas",
    badge: "NOVO",
    type: "VOD",
    url: videoUrl,
    artworkColor: randomColorFromString(`vod-${item?.id}-${item?.title || ""}`),
    teacher: item?.theme || "EduCast",
    lessons: 1,
    thumbnailUrl,
    theme: item?.theme || "",
    createdAt: item?.createdAt,
    updatedAt: item?.updatedAt,
  };
}

async function fetchLiveItems(): Promise<CatalogItem[]> {
  const { data } = await api.get("/live");
  const items = normalizeListResponse(data);

  return items
    .filter((item: any) => item?.video_url)
    .map(mapLiveToCatalogItem);
}

async function fetchOnDemandItems(): Promise<CatalogItem[]> {
  const { data } = await api.get("/ondemand");
  const items = normalizeListResponse(data);

  return items
    .filter((item: any) => item?.video_url)
    .map(mapOnDemandToCatalogItem);
}

async function withProgress(items: CatalogItem[]) {
  const progressMap = await readPlaybackProgressMap();

  return items.map((item) => {
    const progress = progressMap[item.id];
    const ratio = progress?.durationMs
      ? Math.min(progress.positionMs / progress.durationMs, 1)
      : 0;

    return {
      ...item,
      progress: Number.isFinite(ratio) ? ratio : 0,
    };
  });
}

export async function getFeaturedItem() {
  const [vods, lives] = await Promise.all([fetchOnDemandItems(), fetchLiveItems()]);
  const ordered = [...vods, ...lives].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  const itemsWithProgress = await withProgress(ordered);
  return itemsWithProgress[0] ?? null;
}

export async function getCatalogSections(): Promise<CatalogSection[]> {
  const [vodsRaw, livesRaw] = await Promise.all([fetchOnDemandItems(), fetchLiveItems()]);
  const vods = await withProgress(vodsRaw);
  const lives = await withProgress(livesRaw);

  const novidades = [...vods]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 10);

  const continueWatching = vods
    .filter((item) => (item.progress ?? 0) > 0)
    .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
    .slice(0, 10);

  const recommended = vods
    .filter((item) => !continueWatching.some((cw) => cw.id === item.id))
    .slice(0, 10);

  const sections: CatalogSection[] = [];

  if (continueWatching.length) {
    sections.push({
      id: "continue",
      title: "Continue assistindo",
      subtitle: "Retome seu aprendizado de onde parou",
      items: continueWatching,
    });
  }

  if (lives.length) {
    sections.push({
      id: "live",
      title: "Canais ao vivo",
      subtitle: "Transmissões publicadas pelo painel web",
      items: lives,
    });
  }

  if (novidades.length) {
    sections.push({
      id: "news",
      title: "Novidades",
      subtitle: "Conteúdos mais recentes publicados",
      items: novidades,
    });
  }

  if (recommended.length) {
    sections.push({
      id: "recommended",
      title: "Recomendados para você",
      subtitle: "Conteúdos disponíveis no catálogo",
      items: recommended,
    });
  }

  return sections;
}

export async function searchCatalog(term: string) {
  const [vodsRaw, livesRaw] = await Promise.all([fetchOnDemandItems(), fetchLiveItems()]);
  const items = await withProgress([...vodsRaw, ...livesRaw]);

  const normalized = term.trim().toLowerCase();

  if (!normalized) {
    return items.filter((item) => item.type === "VOD");
  }

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.subtitle,
      item.description,
      item.category,
      item.teacher,
      item.type,
      item.theme || "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export async function getRelatedCatalogItems(currentItem: CatalogItem) {
  const [vodsRaw, livesRaw] = await Promise.all([fetchOnDemandItems(), fetchLiveItems()]);
  const allItems = await withProgress([...vodsRaw, ...livesRaw]);

  return allItems
    .filter((item) => item.id !== currentItem.id)
    .filter(
      (item) =>
        item.type === currentItem.type ||
        item.category === currentItem.category ||
        item.theme === currentItem.theme
    )
    .slice(0, 10);
}
export async function getRelatedItems(currentItem: CatalogItem) {
  return getRelatedCatalogItems(currentItem);
}