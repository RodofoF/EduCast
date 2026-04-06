export type CatalogItemType = "VOD" | "LIVE";

export type CatalogItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  category: string;
  badge?: string;
  type: CatalogItemType;
  url: string;
  artworkColor: string;
  progress?: number;
  teacher?: string;
  lessons?: number;

  thumbnailUrl?: string;
  theme?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CatalogSection = {
  id: string;
  title: string;
  subtitle: string;
  items: CatalogItem[];
};

export type PlaybackProgress = {
  itemId: string;
  positionMs: number;
  durationMs: number;
  updatedAt: string;
  completed: boolean;
};