import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { CatalogItem } from "../types/catalog";
import { theme } from "../utils/theme";

export default function FeaturedBanner({
  item,
  onPlay,
  onDetails,
}: {
  item: CatalogItem;
  onPlay: () => void;
  onDetails: () => void;
}) {
  const content = (
    <View
      style={{
        position: "relative",
        minHeight: 290,
        borderRadius: 28,
        padding: 22,
        overflow: "hidden",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(8,18,37,0.38)",
        }}
      />

      {!!item.badge && (
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: "rgba(255,255,255,0.14)",
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginBottom: 14,
            zIndex: 1,
          }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 11, fontWeight: "800", letterSpacing: 0.4 }}>
            {item.badge}
          </Text>
        </View>
      )}

      <Text style={{ color: "#bfdbfe", fontSize: 13, fontWeight: "700", marginBottom: 8, zIndex: 1 }}>
        {item.subtitle}
      </Text>

      <Text
        style={{
          color: theme.colors.text,
          fontSize: 30,
          fontWeight: "900",
          lineHeight: 34,
          marginBottom: 10,
          maxWidth: 280,
          zIndex: 1,
        }}
      >
        {item.title}
      </Text>

      <Text
        style={{
          color: "#dbe4f0",
          fontSize: 14,
          lineHeight: 21,
          maxWidth: 310,
          marginBottom: 18,
          zIndex: 1,
        }}
      >
        {item.description}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flexWrap: "wrap", zIndex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}
        >
          <Ionicons name="videocam-outline" size={14} color="#dbeafe" />
          <Text style={{ color: "#dbeafe", fontSize: 12, fontWeight: "700" }}>{item.duration}</Text>
        </View>

        <TouchableOpacity
          onPress={onPlay}
          activeOpacity={0.9}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: theme.colors.primary,
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 11,
          }}
        >
          <Ionicons name="play" size={18} color={theme.colors.primaryDark} />
          <Text style={{ color: theme.colors.primaryDark, fontSize: 13, fontWeight: "800" }}>
            Assistir agora
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDetails}
          activeOpacity={0.9}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 11,
          }}
        >
          <Ionicons name="information-circle-outline" size={18} color="#ffffff" />
          <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "800" }}>
            Detalhes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (item.thumbnailUrl) {
    return (
      <ImageBackground
        source={{ uri: item.thumbnailUrl }}
        resizeMode="cover"
        imageStyle={{ borderRadius: 28 }}
        style={{
          minHeight: 290,
          borderRadius: 28,
          marginBottom: 28,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(96,165,250,0.14)",
          backgroundColor: item.artworkColor,
        }}
      >
        {content}
      </ImageBackground>
    );
  }

  return (
    <View
      style={{
        minHeight: 290,
        borderRadius: 28,
        marginBottom: 28,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(96,165,250,0.14)",
        backgroundColor: item.artworkColor,
      }}
    >
      {content}
    </View>
  );
}