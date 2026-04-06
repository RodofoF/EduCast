import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import AppShell from "../components/AppShell";
import FeaturedBanner from "../components/FeaturedBanner";
import ContentRow from "../components/ContentRow";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { getCatalogSections, getFeaturedItem } from "../services/catalog";
import { useAuthStore } from "../store/useAuthStore";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import type { CatalogItem, CatalogSection } from "../types/catalog";
import { theme } from "../utils/theme";

type Props = BottomTabScreenProps<MainTabParamList, "HomeTab"> & {
  navigation: BottomTabScreenProps<MainTabParamList, "HomeTab">["navigation"] &
  NativeStackScreenProps<RootStackParamList>["navigation"];
};

export default function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const [featured, setFeatured] = useState<CatalogItem | null>(null);
  const [sections, setSections] = useState<CatalogSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadContent = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");

    try {
      const [featuredItem, catalogSections] = await Promise.all([
        getFeaturedItem(),
        getCatalogSections(),
      ]);

      setFeatured(featuredItem);
      setSections(catalogSections);
    } catch {
      setError("Não foi possível carregar o catálogo agora.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useFocusEffect(
    useCallback(() => {
      loadContent(true);
    }, [loadContent])
  );

  function openDetails(item: CatalogItem) {
    navigation.navigate("Details", { item });
  }

  function openPlayer(item: CatalogItem) {
    navigation.navigate("Player", { item, resumeFromMs: 0 });
  }

  if (loading) {
    return (
      <AppShell>
        <LoadingState label="Carregando seu catálogo personalizado..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 }}
        refreshControl={
          <RefreshControl
            tintColor="#ffffff"
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadContent(true);
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <View>
            <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.8 }}>
              EduCast
            </Text>
            <Text style={{ color: theme.colors.textMuted, fontSize: 14, marginTop: 4 }}>
              Olá, {user?.username || user?.email || "usuário"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("ProfileTab")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.10)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Ionicons name="person-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {featured ? (
          <FeaturedBanner
            item={featured}
            onPlay={() => openPlayer(featured)}
            onDetails={() => openDetails(featured)}
          />
        ) : (
          <EmptyState
            title="Nenhum vídeo disponível"
            description="Assim que um vídeo for publicado no painel web, ele aparecerá aqui."
          />
        )}

        {error ? (
          <View style={{ marginBottom: 18 }}>
            <EmptyState title="Falha ao carregar" description={error} icon="alert-circle-outline" />
          </View>
        ) : null}

        {sections.length === 0 ? (
          <EmptyState
            title="Catálogo vazio"
            description="Quando houver conteúdos publicados, eles aparecerão aqui em formato de catálogo."
            icon="film-outline"
          />
        ) : (
          sections.map((section) => (
            <ContentRow
              key={section.id}
              title={section.title}
              subtitle={section.subtitle}
              items={section.items}
              onSelect={openDetails}
            />
          ))
        )}
      </ScrollView>
    </AppShell>
  );
}
