import React, { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import AppShell from "../components/AppShell";
import EmptyState from "../components/EmptyState";
import MediaCard from "../components/MediaCard";
import { getCatalogSections, searchCatalog } from "../services/catalog";
import { useAuthStore } from "../store/useAuthStore";
import type { CatalogItem } from "../types/catalog";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import { theme } from "../utils/theme";

type Props = BottomTabScreenProps<MainTabParamList, "ProfileTab"> & {
  navigation: BottomTabScreenProps<MainTabParamList, "ProfileTab">["navigation"] &
    NativeStackScreenProps<RootStackParamList>["navigation"];
};

export default function ProfileScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [continueWatching, setContinueWatching] = useState<CatalogItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([getCatalogSections(), searchCatalog("")]).then(([sections, allItems]) => {
        if (!active) return;

        const progressItems = allItems.filter((item) => (item.progress ?? 0) > 0 && item.type === "VOD");
        setContinueWatching(
          progressItems.length > 0 ? progressItems : sections.flatMap((section) => section.items).slice(0, 4)
        );
      });

      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <AppShell>
      <FlatList
        data={continueWatching}
        keyExtractor={(item) => item.id}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 14 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View
              style={{
                backgroundColor: theme.colors.backgroundAlt,
                borderRadius: 28,
                padding: 22,
                borderWidth: 1,
                borderColor: theme.colors.cardBorder,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.10)",
                  marginBottom: 16,
                }}
              >
                <Ionicons name="person" size={24} color="#ffffff" />
              </View>

              <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "900", marginBottom: 6 }}>
                {user?.username || "Usuário EduCast"}
              </Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 14, marginBottom: 18 }}>
                {user?.email || "Conta não identificada"}
              </Text>

              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                <InfoPill label="Perfil" value="Professor" icon="school-outline" />
                <InfoPill label="Grupo" value={`${user?.userGroups?.length || 0} acesso(s)`} icon="layers-outline" />
                <InfoPill label="Status" value="Ativo" icon="checkmark-circle-outline" />
              </View>

              <TouchableOpacity
                onPress={async () => {
                  await logout();
                  navigation.getParent()?.reset({ index: 0, routes: [{ name: "Login" as never }] });
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  paddingVertical: 13,
                }}
              >
                <Ionicons name="log-out-outline" size={18} color="#ffffff" />
                <Text style={{ color: theme.colors.text, fontWeight: "800" }}>Encerrar sessão</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800", marginBottom: 4 }}>
                Continue assistindo
              </Text>
              <Text style={{ color: theme.colors.textSoft, fontSize: 13 }}>
                Seu histórico recente fica salvo para retomar com facilidade.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Ainda sem progresso"
            description="Quando você assistir conteúdos, seu histórico aparecerá aqui automaticamente."
            icon="time-outline"
          />
        }
        renderItem={({ item }) => (
          <MediaCard item={item} onPress={() => navigation.navigate("Details", { item })} compact />
        )}
      />
    </AppShell>
  );
}

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.08)",
      }}
    >
      <Ionicons name={icon} size={16} color="#ffffff" />
      <Text style={{ color: theme.colors.text, fontSize: 12, fontWeight: "700" }}>
        {label}: <Text style={{ color: theme.colors.textMuted }}>{value}</Text>
      </Text>
    </View>
  );
}
