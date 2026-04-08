import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import AppShell from "../components/AppShell";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import MediaCard from "../components/MediaCard";
import { searchCatalog } from "../services/catalog";
import type { CatalogItem } from "../types/catalog";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import { theme } from "../utils/theme";

type Props = BottomTabScreenProps<MainTabParamList, "SearchTab"> & {
  navigation: BottomTabScreenProps<MainTabParamList, "SearchTab">["navigation"] &
    NativeStackScreenProps<RootStackParamList>["navigation"];
};

const quickFilters = ["Ao vivo", "Inclusão", "Aulas", "Plataforma", "Estratégia"];

export default function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    searchCatalog(query)
      .then((data) => {
        if (active) setItems(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  const headerDescription = useMemo(() => {
    if (!query.trim()) {
      return "Busque por título, categoria, professor ou tipo de conteúdo.";
    }
    return `${items.length} resultado(s) encontrados para “${query}”.`;
  }, [items.length, query]);

  return (
    <AppShell showHeader title="Buscar" subtitle={headerDescription}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: theme.colors.backgroundAlt,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
            paddingHorizontal: 14,
            paddingVertical: 4,
            marginBottom: 16,
          }}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={theme.colors.textSoft}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Pesquisar conteúdos"
            placeholderTextColor={theme.colors.textSoft}
            style={{
              flex: 1,
              color: theme.colors.text,
              fontSize: 15,
              paddingVertical: 12,
            }}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.colors.textSoft}
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 14 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28, flexGrow: 1 }}
          ListHeaderComponent={
            <View style={{ marginBottom: 18 }}>
              <FlatList
                horizontal
                data={quickFilters}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setQuery(item)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 999,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: theme.colors.cardBorder,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.text,
                        fontSize: 12,
                        fontWeight: "700",
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          }
          ListEmptyComponent={
            loading ? (
              <LoadingState label="Procurando conteúdos..." />
            ) : (
              <EmptyState
                title="Nada encontrado"
                description="Tente ajustar o termo pesquisado ou use um dos filtros sugeridos."
              />
            )
          }
          renderItem={({ item }) => (
            <MediaCard
              item={item}
              onPress={() => navigation.navigate("Details", { item })}
              compact
            />
          )}
        />
      </View>
    </AppShell>
  );
}