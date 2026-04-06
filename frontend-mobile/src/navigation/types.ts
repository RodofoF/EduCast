import type { CatalogItem } from "../types/catalog";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Details: { item: CatalogItem };
  Player: { item: CatalogItem; resumeFromMs?: number };
};

export type MainTabParamList = {
  HomeTab: undefined;
  MuralTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
};