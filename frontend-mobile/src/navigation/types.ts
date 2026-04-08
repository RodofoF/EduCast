import type { CatalogItem } from "../types/catalog";
import type { ContentItem } from "../types/content";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Details: { item: CatalogItem };
  Player: { item: CatalogItem; resumeFromMs?: number };
  MuralPost: { post: ContentItem };
};

export type MainTabParamList = {
  HomeTab: undefined;
  MuralTab: undefined;
  SearchTab: undefined;
  QRCodeTab: undefined;
  ProfileTab: undefined;
};