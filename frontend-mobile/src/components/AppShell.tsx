import React from "react";
import { StatusBar, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../utils/theme";

export default function AppShell({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
