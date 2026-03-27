import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";
import { useAuthStore } from "./src/store/useAuthStore";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  async function handleLogout() {
    await logout();
    navigation.replace("Login");
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        Home
      </Text>

      <Text
        style={{
          color: "#cbd5e1",
          fontSize: 15,
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        Olá, {user?.username || user?.email || "usuário"}.
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#dc2626",
          paddingVertical: 14,
          paddingHorizontal: 28,
          borderRadius: 16,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 15,
            fontWeight: "700",
          }}
        >
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const loadAuth = useAuthStore((state) => state.loadAuth);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}