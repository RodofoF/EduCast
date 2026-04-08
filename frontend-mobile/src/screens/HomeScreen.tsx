import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
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

  const displayName = user?.username || user?.email || "usuário";

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
      <AppShell
        showHeader
        title="EduCast"
        subtitle={`Olá, ${displayName}`}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("ProfileTab")}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Ionicons name="person-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        }
      >
        <LoadingState label="Carregando seu catálogo personalizado..." />
      </AppShell>
    );
  }

  return (
    <AppShell
      showHeader
      title="EduCast"
      subtitle={`Olá, ${displayName}`}
      rightAction={
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("ProfileTab")}
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Ionicons name="person-outline" size={22} color="#ffffff" />
        </TouchableOpacity>
      }
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 28,
        }}
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
          <EmptyState
            title="Falha ao carregar"
            description={error}
            icon="alert-circle-outline"
          />
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