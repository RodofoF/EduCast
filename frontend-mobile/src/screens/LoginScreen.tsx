import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppShell from "../components/AppShell";
import { loginRequest } from "../services/auth";
import { useAuthStore } from "../store/useAuthStore";
import type { RootStackParamList } from "../navigation/types";
import { theme } from "../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginRequest({ email: email.trim(), password });
      await setAuth({ token: data.token, user: data.user });
      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Não foi possível realizar o login. Confira sua conexão e o endereço da API."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexGrow: 1,
              paddingHorizontal: 22,
              paddingTop: 12,
              paddingBottom: 28,
              justifyContent: "space-between",
              backgroundColor: theme.colors.background,
            }}
          >
            <View style={{ paddingTop: 8, marginBottom: 24 }}>
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <View
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 28,
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 8,
                  }}
                >
                  <Image
                    source={require("../../assets/logo-educast.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(37, 99, 235, 0.18)",
                  borderWidth: 1,
                  borderColor: "rgba(96, 165, 250, 0.25)",
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 999,
                  marginBottom: 18,
                }}
              >
                <Text
                  style={{
                    color: "#bfdbfe",
                    fontSize: 12,
                    fontWeight: "700",
                    letterSpacing: 0.4,
                  }}
                >
                  EduCast Mobile
                </Text>
              </View>

              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 40,
                  fontWeight: "800",
                  letterSpacing: -1,
                  marginBottom: 14,
                }}
              >
                EduCast
              </Text>

              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 26,
                  fontWeight: "800",
                  lineHeight: 32,
                  marginBottom: 12,
                  maxWidth: 340,
                }}
              >
                Sua plataforma de conteúdo, aulas e recursos em um só lugar.
              </Text>

              <Text
                style={{
                  color: theme.colors.textMuted,
                  fontSize: 15,
                  lineHeight: 23,
                  maxWidth: 340,
                  marginBottom: 20,
                }}
              >
                Experiência visual inspirada em streaming, com foco em descoberta,
                continuidade e navegação simples.
              </Text>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <MiniCard label="Aulas" value="Ao vivo e gravadas" />
                <MiniCard label="Recursos" value="Tudo centralizado" />
              </View>
            </View>

            <View
              style={{
                backgroundColor: theme.colors.backgroundAlt,
                borderRadius: 28,
                padding: 20,
                borderWidth: 1,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 24,
                  fontWeight: "800",
                  marginBottom: 6,
                }}
              >
                Entrar
              </Text>

              <Text
                style={{
                  color: theme.colors.textMuted,
                  fontSize: 14,
                  lineHeight: 21,
                  marginBottom: 18,
                }}
              >
                Use seu e-mail institucional para acessar o aplicativo.
              </Text>

              <Field label="E-mail">
                <TextInput
                  placeholder="admin@email.com.br"
                  placeholderTextColor={theme.colors.textSoft}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  style={inputStyle}
                />
              </Field>

              <Field label="Senha">
                <TextInput
                  placeholder="Digite sua senha"
                  placeholderTextColor={theme.colors.textSoft}
                  secureTextEntry={secure}
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassword}
                  style={inputStyle}
                />
              </Field>

              <TouchableOpacity
                onPress={() => setSecure((prev) => !prev)}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: "#93c5fd",
                    fontSize: 13,
                    fontWeight: "700",
                    marginBottom: 14,
                  }}
                >
                  {secure ? "Mostrar senha" : "Ocultar senha"}
                </Text>
              </TouchableOpacity>

              {!!error && (
                <View
                  style={{
                    backgroundColor: "rgba(248,113,113,0.12)",
                    borderWidth: 1,
                    borderColor: "rgba(248,113,113,0.22)",
                    borderRadius: 18,
                    padding: 12,
                    marginBottom: 14,
                  }}
                >
                  <Text
                    style={{ color: "#fecaca", fontSize: 13, lineHeight: 19 }}
                  >
                    {error}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.9}
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: 18,
                  paddingVertical: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.primaryDark} />
                ) : (
                  <Text
                    style={{
                      color: theme.colors.primaryDark,
                      fontSize: 15,
                      fontWeight: "800",
                    }}
                  >
                    Acessar plataforma
                  </Text>
                )}
              </TouchableOpacity>

              <Text
                style={{
                  color: theme.colors.textSoft,
                  fontSize: 13,
                  lineHeight: 20,
                }}
              >
                Educação com experiência digital mais fluida, acessível e
                preparada para crescer.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 13,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 20,
        padding: 14,
        borderWidth: 1,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(59, 130, 246, 0.18)",
      }}
    >
      <Text
        style={{
          color: "#93c5fd",
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 14,
          fontWeight: "700",
          lineHeight: 19,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const inputStyle = {
  borderRadius: 18,
  borderWidth: 1,
  borderColor: theme.colors.cardBorder,
  backgroundColor: "rgba(255,255,255,0.04)",
  color: theme.colors.text,
  paddingHorizontal: 14,
  paddingVertical: 14,
  fontSize: 15,
} as const;