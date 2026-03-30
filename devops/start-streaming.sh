#!/bin/sh
set -eu

nginx -g 'daemon off;' &
NGINX_PID=$!

echo "[startup] Aguardando o nginx-rtmp iniciar..."
sleep 3

/bin/sh /opt/live/live.sh &
LIVE_PID=$!

cleanup() {
  echo "[startup] Encerrando nginx e simuladores..."
  kill "$LIVE_PID" "$NGINX_PID" 2>/dev/null || true
  wait "$LIVE_PID" "$NGINX_PID" 2>/dev/null || true
}

trap cleanup INT TERM

while kill -0 "$NGINX_PID" 2>/dev/null && kill -0 "$LIVE_PID" 2>/dev/null; do
  sleep 2
done

cleanup
exit 1
