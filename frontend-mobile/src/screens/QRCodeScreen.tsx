import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import AppShell from "../components/AppShell";
import { theme } from "../utils/theme";
import { useAuthStore } from "../store/useAuthStore";

type QrLoginPayload = {
  type: "educast-share-login";
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    userGroups: number[];
    createdAt?: string;
    updatedAt?: string;
  };
};

export default function QRCodeScreen() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const qrValue = useMemo(() => {
    if (!token || !user) return "";

    const payload: QrLoginPayload = {
      type: "educast-share-login",
      token,
      user,
    };

    return JSON.stringify(payload);
  }, [token, user]);

  async function copiarPayload() {
    if (!qrValue) return;
    await Clipboard.setStringAsync(qrValue);
    Alert.alert("Copiado", "O conteúdo do QR foi copiado.");
  }

  if (!token || !user) {
    return (
      <AppShell
        showHeader
        title="QRcode"
        subtitle="Faça login para gerar um QR de acesso."
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 18,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Nenhuma sessão ativa encontrada
          </Text>

          <Text
            style={{
              color: theme.colors.textSoft,
              fontSize: 14,
              textAlign: "center",
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            Entre no app para gerar o QRCode de compartilhamento de acesso.
          </Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell
      showHeader
      title="QRcode"
      subtitle="Escaneie este QR no outro aparelho para compartilhar rapidamente o acesso do aluno."
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
            <QRCode value={qrValue} size={220} />
          </View>

          <TouchableOpacity
            onPress={copiarPayload}
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
              Copiar conteúdo do QR
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
            Sessão compartilhada
          </Text>

          <InfoRow label="Usuário" value={user.username} />
          <InfoRow label="E-mail" value={user.email} />
          <InfoRow label="ID" value={String(user.id)} />
          <InfoRow label="Grupos" value={user.userGroups.join(", ")} />
          <InfoRow label="Tipo QR" value="educast-share-login" />
        </View>

        <View
          style={{
            marginTop: 18,
            backgroundColor: "rgba(245, 158, 11, 0.10)",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(245, 158, 11, 0.28)",
            padding: 16,
          }}
        >
          <Text
            style={{
              color: "#fbbf24",
              fontWeight: "800",
              fontSize: 15,
              marginBottom: 6,
            }}
          >
            Atenção
          </Text>
          <Text
            style={{
              color: theme.colors.textSoft,
              lineHeight: 22,
              fontSize: 14,
            }}
          >
            Esta é uma solução simples para apresentação/MVP. Esse QR compartilha
            a sessão atual do aluno e não é o fluxo ideal para produção.
          </Text>
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