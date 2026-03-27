import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { loginRequest } from "../services/auth";
import { useAuthStore } from "../store/useAuthStore";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
  setError("");
  setLoading(true);

  try {
    const data = await loginRequest({ email, password });
    await setAuth({
      token: data.token,
      user: data.user,
    });

    navigation.replace("Home");
  } catch (err: any) {
    console.log("ERRO LOGIN:", err?.message);
    console.log("ERRO RESPONSE:", err?.response?.data);
    console.log("ERRO FULL:", err);

    setError(
      err?.response?.data?.error ||
        err?.message ||
        "Não foi possível realizar o login."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              color: "#ffffff",
              fontSize: 32,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            EduCast
          </Text>

          <Text
            style={{
              color: "#cbd5e1",
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            Entre com sua conta para acessar seus conteúdos e recursos da
            plataforma.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 24,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: 20,
            }}
          >
            Login
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#334155",
              marginBottom: 8,
            }}
          >
            E-mail
          </Text>
          <TextInput
            placeholder="admin@email.com.br"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 15,
              color: "#0f172a",
              marginBottom: 16,
            }}
          />

          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#334155",
              marginBottom: 8,
            }}
          >
            Senha
          </Text>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#94a3b8"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 15,
              color: "#0f172a",
              marginBottom: 12,
            }}
          />

          <TouchableOpacity onPress={() => setSecure((prev) => !prev)}>
            <Text
              style={{
                color: "#2563eb",
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              {secure ? "Mostrar senha" : "Ocultar senha"}
            </Text>
          </TouchableOpacity>

          {!!error && (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#fecaca",
                backgroundColor: "#fef2f2",
                borderRadius: 16,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "#b91c1c", fontSize: 14 }}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: "#0f172a",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                Entrar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}