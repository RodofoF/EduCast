import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppShell from "../components/AppShell";
import { theme } from "../utils/theme";
import { useAuthStore } from "../store/useAuthStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

function getApiOrigin(url: string) {
  return url.replace(/\/api\/?$/, "");
}

function buildQrImageUrl() {
  return `${API_URL.replace(/\/$/, "")}/qr/static/image`;
}

function extractConfigFromApiUrl(url: string) {
  try {
    const parsed = new URL(url);
    return {
      serverIp: parsed.hostname,
      apiPort: parsed.port || "3000",
      streamPort: "9090",
    };
  } catch {
    return {
      serverIp: "localhost",
      apiPort: "3000",
      streamPort: "9090",
    };
  }
}

export default function QRCodeScreen() {
  const token = useAuthStore((state) => state.token);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const qrImageUrl = useMemo(() => buildQrImageUrl(), []);
  const config = useMemo(() => extractConfigFromApiUrl(API_URL), []);

  return (
    <AppShell
      showHeader
      title="QRcode"
      subtitle="Escaneie este QR para compartilhar rapidamente a configuração de acesso do EduCast."
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: theme.colors.backgroundAlt,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
            padding: 20,
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <View
            style={{
              width: 280,
              height: 280,
              borderRadius: 24,
              backgroundColor: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {loading && !hasError ? (
              <ActivityIndicator size="large" color={theme.colors.accent} />
            ) : null}

            <Image
              key={reloadKey}
              source={{
                uri: `${qrImageUrl}?t=${Date.now()}`,
                headers: token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : undefined,
              }}
              resizeMode="contain"
              style={{
                width: 240,
                height: 240,
                display: hasError ? "none" : "flex",
              }}
              onLoadStart={() => {
                setLoading(true);
                setHasError(false);
              }}
              onLoadEnd={() => {
                setLoading(false);
              }}
              onError={() => {
                setLoading(false);
                setHasError(true);
              }}
            />

            {hasError ? (
              <View style={{ alignItems: "center", paddingHorizontal: 18 }}>
                <Text
                  style={{
                    color: "#111827",
                    fontSize: 16,
                    fontWeight: "800",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Não foi possível carregar o QR
                </Text>
                <Text
                  style={{
                    color: "#4b5563",
                    fontSize: 13,
                    textAlign: "center",
                    lineHeight: 19,
                  }}
                >
                  Verifique a URL da API, o token de acesso e se o backend está
                  online.
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => setReloadKey((prev) => prev + 1)}
            style={{
              marginTop: 18,
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: theme.colors.cardBorder,
            }}
          >
            <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
              Atualizar QR
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.backgroundAlt,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
            padding: 18,
            gap: 14,
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 18,
              fontWeight: "800",
            }}
          >
            Configuração atual
          </Text>

          <InfoRow label="API base" value={getApiOrigin(API_URL)} />
          <InfoRow label="Servidor" value={config.serverIp} />
          <InfoRow label="Porta API" value={config.apiPort} />
          <InfoRow label="Porta Stream" value={config.streamPort} />
          <InfoRow label="Endpoint QR" value="/api/qr/static/image" />
        </View>
      </ScrollView>
    </AppShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.06)",
      }}
    >
      <Text
        style={{
          color: theme.colors.textSoft,
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 15,
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
    </View>
  );
}