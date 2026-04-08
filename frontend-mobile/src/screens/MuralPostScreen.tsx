import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppShell from "../components/AppShell";
import type { RootStackParamList } from "../navigation/types";
import { theme } from "../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "MuralPost">;

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
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
        backgroundColor: isAccent
          ? "rgba(96,165,250,0.16)"
          : "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: isAccent
          ? "rgba(96,165,250,0.30)"
          : theme.colors.cardBorder,
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

export default function MuralPostScreen({ navigation, route }: Props) {
  const { post } = route.params;

  const author =
    post.user?.username ||
    post.user?.email ||
    (post.user_id ? `Usuário #${post.user_id}` : "EduCast");

  return (
    <AppShell>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 18,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
          }}
        >
          <Ionicons name="arrow-back-outline" size={16} color="#ffffff" />
          <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "800" }}>
            Voltar ao mural
          </Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: theme.colors.backgroundAlt,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
            padding: 22,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <PostBadge label={post.category || "Avisos"} variant="accent" />
            <PostBadge label={post.theme || "Geral"} />
          </View>

          <Text
            style={{
              color: theme.colors.text,
              fontSize: 28,
              lineHeight: 34,
              fontWeight: "900",
              letterSpacing: -0.6,
              marginBottom: post.subtitle ? 8 : 16,
            }}
          >
            {post.title}
          </Text>

          {!!post.subtitle && (
            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 18,
              }}
            >
              {post.subtitle}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 22,
              paddingBottom: 18,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.cardBorder,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="person-circle-outline" size={18} color={theme.colors.textSoft} />
              <Text style={{ color: theme.colors.textSoft, fontSize: 13, fontWeight: "700" }}>
                {author}
              </Text>
            </View>

            {!!post.createdAt && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="time-outline" size={16} color={theme.colors.textSoft} />
                <Text style={{ color: theme.colors.textSoft, fontSize: 13, fontWeight: "700" }}>
                  {formatDate(post.createdAt)}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
              lineHeight: 28,
            }}
          >
            {post.content}
          </Text>
        </View>
      </ScrollView>
    </AppShell>
  );
}