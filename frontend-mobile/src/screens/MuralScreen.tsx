import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppShell from "../components/AppShell";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { getContents } from "../services/content";
import type { ContentItem } from "../types/content";
import { theme } from "../utils/theme";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function PostBadge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "accent";
}) {
  const isAccent = variant === "accent";

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: isAccent ? "rgba(96,165,250,0.16)" : "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: isAccent ? "rgba(96,165,250,0.30)" : theme.colors.cardBorder,
      }}
    >
      <Text
        style={{
          color: isAccent ? "#bfdbfe" : theme.colors.textMuted,
          fontSize: 12,
          fontWeight: "800",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function PostCard({ item }: { item: ContentItem }) {
  const author =
    item.user?.username || item.user?.email || (item.user_id ? `Usuário #${item.user_id}` : "EduCast");

  return (
    <View
      style={{
        backgroundColor: theme.colors.backgroundAlt,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        padding: 18,
        marginBottom: 14,
      }}
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <PostBadge label={item.category || "Avisos"} variant="accent" />
        <PostBadge label={item.theme || "Geral"} />
      </View>

      <Text
        style={{
          color: theme.colors.text,
          fontSize: 20,
          fontWeight: "900",
          letterSpacing: -0.4,
          marginBottom: item.subtitle ? 6 : 10,
        }}
      >
        {item.title}
      </Text>

      {!!item.subtitle && (
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          {item.subtitle}
        </Text>
      )}

      <Text
        style={{
          color: theme.colors.text,
          fontSize: 15,
          lineHeight: 24,
        }}
      >
        {item.content}
      </Text>

      <View
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: theme.colors.cardBorder,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
          <Ionicons name="person-circle-outline" size={16} color={theme.colors.textSoft} />
          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.textSoft,
              fontSize: 12,
              fontWeight: "700",
              flex: 1,
            }}
          >
            {author}
          </Text>
        </View>

        {!!item.createdAt && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="time-outline" size={14} color={theme.colors.textSoft} />
            <Text style={{ color: theme.colors.textSoft, fontSize: 12, fontWeight: "700" }}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function MuralScreen() {
  const [posts, setPosts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");

    try {
      const data = await getContents();
      setPosts(data);
    } catch (err) {
      console.error("Erro ao carregar mural:", err);
      setError("Não foi possível carregar as publicações do mural agora.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (loading) {
    return (
      <AppShell>
        <LoadingState label="Carregando publicações do mural..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor="#ffffff"
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadPosts(true);
            }}
          />
        }
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 28,
                fontWeight: "900",
                letterSpacing: -0.8,
                marginBottom: 6,
              }}
            >
              Mural
            </Text>

            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: 14,
                lineHeight: 20,
                marginBottom: error ? 14 : 0,
              }}
            >
              Avisos, recados e comunicados publicados por professores e administradores.
            </Text>

            {error ? (
              <View
                style={{
                  marginTop: 14,
                  backgroundColor: "rgba(248,113,113,0.12)",
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: "rgba(248,113,113,0.20)",
                  padding: 14,
                }}
              >
                <Text style={{ color: "#fecaca", fontSize: 13, fontWeight: "700" }}>{error}</Text>

                <TouchableOpacity
                  onPress={() => loadPosts()}
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 999,
                  }}
                >
                  <Ionicons name="refresh-outline" size={16} color="#ffffff" />
                  <Text style={{ color: "#ffffff", fontWeight: "800", fontSize: 12 }}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma publicação ainda"
            description="Quando professores ou administradores publicarem pelo painel web, os conteúdos aparecerão aqui."
            icon="megaphone-outline"
          />
        }
        renderItem={({ item }) => <PostCard item={item} />}
      />
    </AppShell>
  );
}