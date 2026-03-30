#!/bin/sh
set -eu

BASE_DIR="${BASE_DIR:-/opt/live}"
RTMP_HOST="${RTMP_HOST:-127.0.0.1:1935}"
APP_NAME="${APP_NAME:-live}"

start_channel() {
  file_name="$1"
  channel_name="$2"
  file_path="$BASE_DIR/$file_name"

  if [ ! -f "$file_path" ]; then
    echo "[live] Arquivo não encontrado: $file_path" >&2
    return 1
  fi

  echo "[live] Iniciando canal $channel_name com $file_name -> rtmp://$RTMP_HOST/$APP_NAME/$channel_name"

  ffmpeg -hide_banner -loglevel warning \
    -stream_loop -1 -re \
    -i "$file_path" \
    -map 0:v:0 -map 0:a:0? \
    -c:v libx264 -preset veryfast -tune zerolatency \
    -pix_fmt yuv420p -g 60 -keyint_min 60 \
    -c:a aac -ar 44100 -b:a 128k \
    -f flv "rtmp://$RTMP_HOST/$APP_NAME/$channel_name" &
}

cleanup() {
  echo "[live] Encerrando simuladores de canais..."
  kill $(jobs -p) 2>/dev/null || true
}

trap cleanup INT TERM EXIT

# Simulação de 3 canais da placa TBS usando vídeos locais em loop.
start_channel "10001.mp4" "1001"
start_channel "10012.mp4" "1012"
start_channel "10003.mp4" "1003"

wait