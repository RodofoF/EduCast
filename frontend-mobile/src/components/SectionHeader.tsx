import React from "react";
import { Text, View } from "react-native";
import { theme } from "../utils/theme";

export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 22,
          fontWeight: "800",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text style={{ color: theme.colors.textSoft, fontSize: 13 }}>
        {subtitle}
      </Text>
    </View>
  );
}
