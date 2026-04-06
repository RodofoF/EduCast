import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { theme } from "../utils/theme";

export default function LoadingState({ label = "Carregando conteúdo..." }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={{ color: theme.colors.textMuted, marginTop: 12, fontSize: 14 }}>{label}</Text>
    </View>
  );
}
