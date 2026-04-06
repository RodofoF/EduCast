#!/usr/bin/env bash
set -euo pipefail

# Minimal script: para cada entrada em dvblast.conf, inicia um ffmpeg em background
# Uso: CONF=./dvblast.conf RTMP_HOST=127.0.0.1:1935 ./ffmpeg.sh
#ffmpeg -re -i udp://127.0.0.1:10001 -c copy -f flv rtmp://127.0.0.1:1935/live/10001

CONF="${CONF:-$(dirname "$0")/dvblast.conf}"
RTMP_HOST="${RTMP_HOST:-127.0.0.1:1935}"
APP="${APP:-live}"

if [ ! -f "$CONF" ]; then
  echo "Config file not found: $CONF" >&2
  exit 1
fi

i=0
while IFS= read -r raw || [ -n "$raw" ]; do
  # remove comments
  line="${raw%%#*}"
  # trim
  line="$(echo "$line" | xargs)"
  [ -z "$line" ] && continue

  read -r addr _ id <<< "$line"
  if [ -z "$id" ]; then
	i=$((i+1))
	id="stream_$i"
  fi

  echo "Starting ffmpeg for $addr -> rtmp://$RTMP_HOST/$APP/$id"
  ffmpeg -re -i "$addr" -c copy -f flv "rtmp://$RTMP_HOST/$APP/$id" &
done < "$CONF"

wait


