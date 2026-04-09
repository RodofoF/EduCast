import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAuthStore } from "../store/useAuthStore";

type Props = NativeStackScreenProps<RootStackParamList, "ScanLoginQr">;

type User = {
  id: number;
  username: string;
  email: string;
  userGroups: number[];
  createdAt?: string;
  updatedAt?: string;
};

type QrLoginPayload = {
  type: "educast-share-login";
  token: string;
  user: User;
};

function parseQrPayload(raw: string): QrLoginPayload | null {
  try {
    const parsed = JSON.parse(raw);

    if (
      parsed?.type === "educast-share-login" &&
      typeof parsed?.token === "string" &&
      parsed?.user
    ) {
      return parsed as QrLoginPayload;
    }

    return null;
  } catch {
    return null;
  }
}

export default function ScanLoginQrScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  async function handleBarcodeScanned({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);

    const payload = parseQrPayload(data);

    if (!payload) {
      Alert.alert(
        "QR inválido",
        "Esse QRCode não é um QR de acesso válido do EduCast.",
        [
          {
            text: "Tentar novamente",
            onPress: () => setScanned(false),
          },
        ]
      );
      return;
    }

    try {
      await setAuth({
        token: payload.token,
        user: payload.user,
      });

      Alert.alert("Sucesso", "Acesso liberado com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            });
          },
        },
      ]);
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível salvar o acesso lido no QRCode."
      );
      setScanned(false);
    }
  }

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: "#0f172a" }} />;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0f172a",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 22,
            fontWeight: "800",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Permissão de câmera
        </Text>

        <Text
          style={{
            color: "#cbd5e1",
            fontSize: 15,
            textAlign: "center",
            marginBottom: 24,
            lineHeight: 22,
          }}
        >
          Precisamos da câmera para ler o QRCode de acesso.
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: "#2563eb",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            Permitir câmera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 14,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#475569",
          }}
        >
          <Text style={{ color: "#cbd5e1", fontWeight: "700" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          right: 20,
          backgroundColor: "rgba(15, 23, 42, 0.82)",
          borderRadius: 20,
          padding: 16,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Ler QRCode
        </Text>

        <Text
          style={{
            color: "#cbd5e1",
            fontSize: 14,
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          Aponte a câmera para o QRCode exibido no outro aparelho.
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 40,
          left: 20,
          right: 20,
          gap: 12,
        }}
      >
        {scanned && (
          <TouchableOpacity
            onPress={() => setScanned(false)}
            style={{
              backgroundColor: "#2563eb",
              paddingVertical: 13,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "800",
                textAlign: "center",
              }}
            >
              Ler novamente
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.82)",
            paddingVertical: 13,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#334155",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}