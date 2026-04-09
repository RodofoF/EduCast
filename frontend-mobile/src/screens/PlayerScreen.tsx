import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppShell from "../components/AppShell";
import { savePlaybackProgress } from "../services/storage";
import type { RootStackParamList } from "../navigation/types";
import { theme } from "../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Player">;

function formatClock(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

export default function PlayerScreen({ navigation, route }: Props) {
  const { item, resumeFromMs = 0 } = route.params;
  const isLive = item.type === "LIVE";

  const [seekBarWidth, setSeekBarWidth] = useState(0);
  const lastPositionMsRef = useRef(Math.max(0, resumeFromMs));
  const lastDurationMsRef = useRef(0);

  const player = useVideoPlayer(item.url, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 1;

    if (resumeFromMs > 0 && !isLive) {
      p.currentTime = resumeFromMs / 1000;
    }

    p.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  const timeUpdate = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    currentLiveTimestamp: 0,
    currentOffsetFromLive: 0,
    bufferedPosition: 0,
  });

  const currentTimeSeconds = Number(timeUpdate?.currentTime ?? 0);
  const durationSeconds = Number(player.duration ?? 0);
  const canSeek =
    !isLive && Number.isFinite(durationSeconds) && durationSeconds > 0;
  const progressRatio = canSeek
    ? Math.min(Math.max(currentTimeSeconds / durationSeconds, 0), 1)
    : 0;

  const prettyStatus =
    status === "loading"
      ? "Carregando"
      : status === "readyToPlay"
        ? "Pronto"
        : status === "error"
          ? "Erro"
          : status;

  const playerHint = useMemo(() => {
    if (isLive) {
      return "Transmissão ao vivo: avanço e retrocesso ficam desabilitados.";
    }

    if (!canSeek) {
      return "O vídeo abriu, mas a duração ainda não foi identificada. Se a URL do OnDemand estiver chegando como stream ao vivo no backend, o avanço pode continuar bloqueado.";
    }

    return "Toque na barra para pular para qualquer ponto do vídeo ou use os botões de 10 segundos.";
  }, [canSeek, isLive]);

  useEffect(() => {
    lastPositionMsRef.current = Math.max(
      0,
      Math.floor(currentTimeSeconds * 1000),
    );
    lastDurationMsRef.current = Math.max(0, Math.floor(durationSeconds * 1000));
  }, [currentTimeSeconds, durationSeconds]);

  useEffect(() => {
    const persistFromRefs = () =>
      savePlaybackProgress({
        itemId: item.id,
        positionMs: lastPositionMsRef.current,
        durationMs: lastDurationMsRef.current,
        updatedAt: new Date().toISOString(),
        completed:
          lastDurationMsRef.current > 0 &&
          lastPositionMsRef.current >= lastDurationMsRef.current * 0.95,
      }).catch(() => undefined);

    const interval = setInterval(() => {
      persistFromRefs();
    }, 5000);

    return () => {
      clearInterval(interval);
      persistFromRefs();
    };
  }, [item.id]);

  function changePosition(seconds: number) {
    if (!canSeek) return;

    try {
      // garante que o player está ativo (Android precisa disso)
      if (!player.playing) {
        player.play();
      }

      setTimeout(() => {
        try {
          console.log("[Player] seekBy:", seconds);
          player.seekBy(seconds);
        } catch (err) {
          console.log("[Player] fallback currentTime");

          const nextTime = Math.min(
            durationSeconds,
            Math.max(0, currentTimeSeconds + seconds),
          );

          player.currentTime = nextTime;
        }
      }, 150);
    } catch (err) {
      console.log("[Player] erro geral no seek:", err);
    }
  }

  function seekToTouch(event: any) {
    if (!canSeek || seekBarWidth <= 0) return;

    const touchX = event?.nativeEvent?.locationX ?? 0;
    const ratio = Math.min(Math.max(touchX / seekBarWidth, 0), 1);
    player.currentTime = durationSeconds * ratio;
  }

  function handleSeekBarLayout(event: LayoutChangeEvent) {
    setSeekBarWidth(event.nativeEvent.layout.width);
  }

  return (
    <AppShell>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#ffffff" />
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
            marginHorizontal: 12,
          }}
        >
          {item.title}
        </Text>

        <View style={{ width: 40, height: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <VideoView
            style={{
              width: "100%",
              aspectRatio: 16 / 9,
              backgroundColor: "#000000",
            }}
            player={player}
            fullscreenOptions={{ enable: true }}
            allowsPictureInPicture
            contentFit="contain"
            nativeControls
          />
        </View>

        <View
          style={{
            marginTop: 16,
            backgroundColor: theme.colors.backgroundAlt,
            borderRadius: 24,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
          }}
        >
          <TouchableOpacity
            activeOpacity={canSeek ? 0.9 : 1}
            onLayout={handleSeekBarLayout}
            onPress={seekToTouch}
            style={{
              height: 18,
              justifyContent: "center",
              opacity: canSeek ? 1 : 0.5,
            }}
          >
            <View
              style={{
                height: 6,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.10)",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${progressRatio * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: theme.colors.primary,
                }}
              />
            </View>
          </TouchableOpacity>

          <View
            style={{
              marginTop: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: theme.colors.textSoft,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {isLive ? "AO VIVO" : formatClock(currentTimeSeconds)}
            </Text>
            <Text
              style={{
                color: theme.colors.textSoft,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {canSeek ? formatClock(durationSeconds) : prettyStatus}
            </Text>
          </View>

          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: 12,
              lineHeight: 18,
              marginTop: 10,
            }}
          >
            {playerHint}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => changePosition(-10)}
            disabled={!canSeek}
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: canSeek
                ? "rgba(255,255,255,0.10)"
                : "rgba(255,255,255,0.05)",
            }}
            activeOpacity={0.9}
          >
            <Ionicons
              name="play-back"
              size={18}
              color={canSeek ? "#ffffff" : "#6b7280"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => (isPlaying ? player.pause() : player.play())}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: theme.colors.primary,
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
            activeOpacity={0.9}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={18}
              color={theme.colors.primaryDark}
            />
            <Text
              style={{
                color: theme.colors.primaryDark,
                fontSize: 14,
                fontWeight: "800",
              }}
            >
              {isPlaying ? "Pausar" : "Reproduzir"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => changePosition(10)}
            disabled={!canSeek}
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: canSeek
                ? "rgba(255,255,255,0.10)"
                : "rgba(255,255,255,0.05)",
            }}
            activeOpacity={0.9}
          >
            <Ionicons
              name="play-forward"
              size={18}
              color={canSeek ? "#ffffff" : "#6b7280"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => player.replay()}
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.10)",
            }}
            activeOpacity={0.9}
          >
            <Ionicons name="refresh" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.backgroundAlt,
            borderRadius: 24,
            padding: 18,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
          }}
        >
          {!!item.badge && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor:
                  item.type === "LIVE"
                    ? "rgba(190,24,93,0.92)"
                    : "rgba(59,130,246,0.18)",
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginBottom: 12,
              }}
            >
              <Text
                style={{ color: "#dbeafe", fontSize: 11, fontWeight: "800" }}
              >
                {item.badge}
              </Text>
            </View>
          )}

          <Text
            style={{
              color: theme.colors.text,
              fontSize: 28,
              fontWeight: "900",
              lineHeight: 32,
              marginBottom: 6,
            }}
          >
            {item.title}
          </Text>

          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: 15,
              lineHeight: 21,
              marginBottom: 14,
            }}
          >
            {item.subtitle}
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <InfoPill icon="film-outline" label={item.type} />
            <InfoPill icon="time-outline" label={item.duration} />
            <InfoPill icon="pulse-outline" label={prettyStatus} />
            <InfoPill
              icon="person-outline"
              label={item.teacher || "Equipe EduCast"}
            />
          </View>

          <Text
            style={{
              color: "#d5ddea",
              fontSize: 14,
              lineHeight: 22,
              marginBottom: 16,
            }}
          >
            {item.description}
          </Text>

          <View
            style={{
              backgroundColor: "#091423",
              borderRadius: 18,
              padding: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <Text
              style={{
                color: theme.colors.textSoft,
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Progresso salvo automaticamente
            </Text>
            <Text
              style={{ color: theme.colors.text, fontSize: 12, lineHeight: 18 }}
            >
              Ao sair desta tela, o EduCast salva o ponto atual para você
              continuar depois.
            </Text>
          </View>

          {status === "loading" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 16,
              }}
            >
              <ActivityIndicator color="#ffffff" />
              <Text style={{ color: theme.colors.text, fontSize: 13 }}>
                Carregando vídeo...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </AppShell>
  );
}

function InfoPill({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 9,
      }}
    >
      <Ionicons name={icon} size={14} color="#c7d2fe" />
      <Text
        style={{ color: theme.colors.text, fontSize: 12, fontWeight: "700" }}
      >
        {label}
      </Text>
    </View>
  );
}
