FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg ca-certificates tzdata && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /work

COPY ffmpeg.sh /usr/local/bin/ffmpeg.sh
RUN chmod +x /usr/local/bin/ffmpeg.sh

ENTRYPOINT ["/usr/local/bin/ffmpeg.sh"]
