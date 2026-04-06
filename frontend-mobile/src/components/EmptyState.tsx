import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/theme";

export default function EmptyState({
  title,
  description,
  icon = "search-outline",
}: {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.backgroundAlt,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.08)",
          marginBottom: 14,
        }}
      >
        <Ionicons name={icon} size={24} color="#ffffff" />
      </View>
      <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "800", marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ color: theme.colors.textMuted, fontSize: 14, textAlign: "center", lineHeight: 21 }}>
        {description}
      </Text>
    </View>
  );
}
