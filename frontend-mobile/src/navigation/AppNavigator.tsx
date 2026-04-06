import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MuralScreen from "../screens/MuralScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DetailsScreen from "../screens/DetailsScreen";
import PlayerScreen from "../screens/PlayerScreen";
import type { MainTabParamList, RootStackParamList } from "./types";
import { theme } from "../utils/theme";
import { useAuthStore } from "../store/useAuthStore";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.text,
    border: "transparent",
    primary: theme.colors.text,
  },
};

function MainTabs() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(8,18,37,0.98)",
          borderTopWidth: 0,
          height: 82,
          paddingTop: 8,
          paddingBottom: 18,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#7c8aa5",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MuralTab") {
            iconName = focused ? "megaphone" : "megaphone-outline";
          } else if (route.name === "SearchTab") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="MuralTab" component={MuralScreen} options={{ title: "Mural" }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: "Buscar" }} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: "Perfil",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTitleStyle: { color: theme.colors.text, fontWeight: "800" },
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                await logout();
                navigation.getParent()?.reset({ index: 0, routes: [{ name: "Login" as never }] });
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "700" }}>Sair</Text>
            </TouchableOpacity>
          ),
          headerLeft: () => <View />,
        })}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const token = useAuthStore((state) => state.token);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          animation: "slide_from_right",
          contentStyle: { backgroundColor: theme.colors.background },
          headerTintColor: "#ffffff",
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerTitleStyle: { color: theme.colors.text, fontWeight: "800" },
        }}
      >
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Detalhes" }} />
            <Stack.Screen name="Player" component={PlayerScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}