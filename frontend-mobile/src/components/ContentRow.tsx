import React from "react";
import { FlatList, View } from "react-native";
import type { CatalogItem } from "../types/catalog";
import MediaCard from "./MediaCard";
import SectionHeader from "./SectionHeader";

export default function ContentRow({
  title,
  subtitle,
  items,
  onSelect,
}: {
  title: string;
  subtitle: string;
  items: CatalogItem[];
  onSelect: (item: CatalogItem) => void;
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <SectionHeader title={title} subtitle={subtitle} />
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <MediaCard item={item} onPress={() => onSelect(item)} compact={item.type !== "LIVE"} />
        )}
      />
    </View>
  );
}
