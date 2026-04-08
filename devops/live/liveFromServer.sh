#!/bin/bash
inputStream="udp://127.0.0.1:10001?fifo_size=5000000&overrun_nonfatal=1&buffer_size=8388608"
outputStream="rtmp://127.0.0.1:1935/live/1002"
# outputStream="udp://233.50.8.81:50830?pkt_size=1316"

function liveFromServer() {
        ffmpeg -hide_banner -loglevel info \
                -fflags +discardcorrupt \
                -flags low_delay \
                -thread_queue_size 8192 \
                -analyzeduration 10M -probesize 10M \
                -i "$inputStream" \
                -map 0:v:0 -map 0:a:0? \
                -c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p \
                -b:v 3500k -maxrate 3500k -bufsize 7000k \
                -g 60 -keyint_min 60 -sc_threshold 0 \
                -c:a aac -ar 48000 -ac 2 -b:a 128k \
                -f flv "$outputStream"
}
liveFromServer