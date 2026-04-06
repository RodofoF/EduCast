import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PlaybackProgress } from "../types/catalog";

const PLAYBACK_KEY = "educast_playback_progress";

export async function readPlaybackProgressMap() {
  const raw = await AsyncStorage.getItem(PLAYBACK_KEY);
  if (!raw) return {} as Record<string, PlaybackProgress>;

  try {
    return JSON.parse(raw) as Record<string, PlaybackProgress>;
  } catch {
    return {} as Record<string, PlaybackProgress>;
  }
}

export async function readPlaybackProgress(itemId: string) {
  const map = await readPlaybackProgressMap();
  return map[itemId] ?? null;
}

export async function savePlaybackProgress(progress: PlaybackProgress) {
  const map = await readPlaybackProgressMap();
  map[progress.itemId] = progress;
  await AsyncStorage.setItem(PLAYBACK_KEY, JSON.stringify(map));
}

export async function clearPlaybackProgress(itemId: string) {
  const map = await readPlaybackProgressMap();
  delete map[itemId];
  await AsyncStorage.setItem(PLAYBACK_KEY, JSON.stringify(map));
}
