import React from "react";
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/theme";

type AppShellProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  rightAction?: React.ReactNode;
};

export default function AppShell({
  children,
  style,
  title,
  subtitle,
  showHeader = false,
  rightAction,
}: AppShellProps) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}
      edges={["top", "bottom"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />

      <View style={{ flex: 1 }}>
        {showHeader && (
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 18,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                {!!title && (
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontSize: 32,
                      fontWeight: "900",
                      letterSpacing: -0.9,
                      marginBottom: subtitle ? 6 : 0,
                    }}
                  >
                    {title}
                  </Text>
                )}

                {!!subtitle && (
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontSize: 15,
                      lineHeight: 22,
                    }}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>

              {rightAction ? (
                rightAction
              ) : (
                <TouchableOpacity
                  activeOpacity={0.85}
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
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={{ flex: 1 }}>{children}</View>
      </View>
    </SafeAreaView>
  );
}