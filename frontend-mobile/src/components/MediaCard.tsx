import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { CatalogItem } from "../types/catalog";
import { theme } from "../utils/theme";

export default function MediaCard({
  item,
  onPress,
  compact = false,
}: {
  item: CatalogItem;
  onPress: () => void;
  compact?: boolean;
}) {
  const isLive = item.type === "LIVE";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ width: compact ? 168 : 184 }}
    >
      <View
        style={{
          height: compact ? 200 : 216,
          borderRadius: 22,
          overflow: "hidden",
          marginBottom: 10,
          borderWidth: 1,
          borderColor: isLive
            ? "rgba(248,113,113,0.18)"
            : "rgba(96,165,250,0.14)",
          backgroundColor: item.artworkColor,
        }}
      >
        {item.thumbnailUrl ? (
          <ImageBackground
            source={{ uri: item.thumbnailUrl }}
            resizeMode="cover"
            style={{
              flex: 1,
              padding: 12,
              justifyContent: "space-between",
            }}
          >
            <OverlayContent item={item} isLive={isLive} />
          </ImageBackground>
        ) : (
          <View
            style={{
              flex: 1,
              padding: 12,
              justifyContent: "space-between",
              backgroundColor: item.artworkColor,
            }}
          >
            <OverlayContent item={item} isLive={isLive} />
          </View>
        )}
      </View>

      <Text numberOfLines={1} style={{ color: theme.colors.text, fontSize: 14, fontWeight: "700" }}>
        {item.title}
      </Text>
      <Text numberOfLines={1} style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 4 }}>
        {item.subtitle}
      </Text>
      <Text numberOfLines={1} style={{ color: theme.colors.textSoft, fontSize: 12, marginTop: 4 }}>
        {item.duration}
      </Text>

      {(item.progress ?? 0) > 0 && !isLive && (
        <View
          style={{
            height: 4,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.12)",
            marginTop: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 4,
              width: `${Math.max(6, (item.progress ?? 0) * 100)}%`,
              borderRadius: 999,
              backgroundColor: theme.colors.primary,
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

function OverlayContent({
  item,
  isLive,
}: {
  item: CatalogItem;
  isLive: boolean;
}) {
  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(8,18,37,0.30)",
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 1,
        }}
      >
        {!!item.badge && (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: isLive
                ? "rgba(190,24,93,0.92)"
                : "rgba(255,255,255,0.14)",
              borderRadius: theme.radius.pill,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 10,
                fontWeight: "800",
                letterSpacing: 0.4,
              }}
            >
              {item.badge}
            </Text>
          </View>
        )}

        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.14)",
          }}
        >
          <Ionicons name="play" size={18} color="#ffffff" />
        </View>
      </View>

      <View style={{ zIndex: 1 }}>
        <Text
          style={{
            color: theme.colors.text,
            fontSize: 14,
            fontWeight: "800",
            marginBottom: 4,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.82)",
            fontSize: 12,
            lineHeight: 18,
          }}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
    </>
  );
}