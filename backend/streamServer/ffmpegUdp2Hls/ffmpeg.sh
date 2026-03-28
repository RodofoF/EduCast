#!/usr/bin/env bash
set -euo pipefail

SRC="${SRC:-udp://233.0.0.100:65000?localaddr=198.19.2.101&fifo_size=1000000&overrun_nonfatal=1}"
DST="${DST:-rtmp://127.0.0.1:1935/live/65000}"
LOGLEVEL="${LOGLEVEL:-info}"

exec ffmpeg -v "$LOGLEVEL" -re -i "$SRC" -c copy -f flv "$DST"
