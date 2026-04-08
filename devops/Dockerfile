FROM tiangolo/nginx-rtmp

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /tmp/hls/live /tmp/dash/live /opt/live \
    && chmod -R 755 /tmp/hls /tmp/dash /opt/live

COPY nginx.conf /etc/nginx/nginx.conf
COPY live /opt/live
COPY start-streaming.sh /usr/local/bin/start-streaming.sh

RUN chmod +x /usr/local/bin/start-streaming.sh /opt/live/live.sh

EXPOSE 1935 80

CMD ["nginx", "-g", "daemon off;"]
# CMD ["/bin/sh", "/usr/local/bin/start-streaming.sh"]
# docker exec educast_nginx_rtmp /usr/local/bin/start-streaming.sh