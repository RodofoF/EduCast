import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppShell from "../components/AppShell";
import MediaCard from "../components/MediaCard";
import SectionHeader from "../components/SectionHeader";
import LoadingState from "../components/LoadingState";
import { getRelatedItems } from "../services/catalog";
import { readPlaybackProgress } from "../services/storage";
import type { RootStackParamList } from "../navigation/types";
import type { CatalogItem } from "../types/catalog";
import { theme } from "../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Details">;

export default function DetailsScreen({ navigation, route }: Props) {
  const item = route.params.item;
  const [related, setRelated] = useState<CatalogItem[]>([]);
  const [resumeFromMs, setResumeFromMs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([getRelatedItems(item), readPlaybackProgress(item.id)]).then(([relatedItems, progress]) => {
      if (!active) return;
      setRelated(relatedItems);
      setResumeFromMs(progress?.positionMs ?? 0);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [item]);

  return (
    <AppShell>
      {loading ? (
        <LoadingState label="Preparando detalhes do conteúdo..." />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              minHeight: 280,
              borderRadius: 28,
              padding: 22,
              justifyContent: "flex-end",
              backgroundColor: item.artworkColor,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
              marginBottom: 22,
            }}
          >
            {!!item.badge && (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: item.type === "LIVE" ? "rgba(190,24,93,0.92)" : "rgba(255,255,255,0.14)",
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "800" }}>{item.badge}</Text>
              </View>
            )}

            <Text style={{ color: "#bfdbfe", fontSize: 13, fontWeight: "700", marginBottom: 8 }}>
              {item.subtitle}
            </Text>
            <Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: "900", lineHeight: 34, marginBottom: 10 }}>
              {item.title}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 21 }}>
              {item.description}
            </Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
            <MetaPill icon="time-outline" label={item.duration} />
            <MetaPill icon="film-outline" label={item.type} />
            <MetaPill icon="book-outline" label={item.category} />
            <MetaPill icon="person-outline" label={item.teacher || "Equipe EduCast"} />
          </View>

          <View
            style={{
              backgroundColor: theme.colors.backgroundAlt,
              borderRadius: 24,
              padding: 18,
              borderWidth: 1,
              borderColor: theme.colors.cardBorder,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "800", marginBottom: 8 }}>
              Sobre esta aula
            </Text>
            <Text style={{ color: theme.colors.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 16 }}>
              {item.description} Este fluxo deixa o app mais próximo de plataformas de streaming, com um ponto de decisão antes do player.
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Player", { item, resumeFromMs })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: theme.colors.primary,
                borderRadius: 18,
                paddingVertical: 14,
                marginBottom: 10,
              }}
            >
              <Ionicons name={resumeFromMs > 0 ? "play-forward" : "play"} size={18} color={theme.colors.primaryDark} />
              <Text style={{ color: theme.colors.primaryDark, fontWeight: "800" }}>
                {resumeFromMs > 0 ? "Continuar assistindo" : "Assistir agora"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 18,
                paddingVertical: 14,
              }}
            >
              <Ionicons name="arrow-back-outline" size={18} color="#ffffff" />
              <Text style={{ color: theme.colors.text, fontWeight: "800" }}>Voltar</Text>
            </TouchableOpacity>
          </View>

          <SectionHeader title="Você também pode gostar" subtitle="Conteúdos relacionados ao tema ou formato" />
          <FlatList
            horizontal
            data={related}
            keyExtractor={(candidate) => candidate.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingBottom: 10 }}
            renderItem={({ item: relatedItem }) => (
              <MediaCard item={relatedItem} onPress={() => navigation.replace("Details", { item: relatedItem })} compact />
            )}
          />
        </ScrollView>
      )}
    </AppShell>
  );
}

function MetaPill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 9,
      }}
    >
      <Ionicons name={icon} size={14} color="#c7d2fe" />
      <Text style={{ color: theme.colors.text, fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}
