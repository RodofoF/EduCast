## Acessar um container por terminal que já esta em execução
docker exec -it <containerID> sh


## Build da imagem
docker build -t ffmpeg-bridge .

## Scripts 

### Executar scripts enviando variáveis SRC e DST

### Fluxo 65000
docker run -d --name ffmpeg-65000 \
  --network host \
  --restart always \
  -e SRC="udp://233.0.0.100:65000?localaddr=198.19.2.101&fifo_size=1000000&overrun_nonfatal=1" \
  -e DST="rtmp://127.0.0.1:1935/live/65000" \
  ffmpeg-bridge

### Fluxo 65001
docker run -d --name ffmpeg-65001 \
  --network host \
  --restart always \
  -e SRC="udp://233.0.0.100:65001?localaddr=198.19.2.101&fifo_size=1000000&overrun_nonfatal=1" \
  -e DST="rtmp://127.0.0.1:1935/live/65001" \
  ffmpeg-bridge

### Fluxo 65002
docker run -d --name ffmpeg-65002 \
  --network host \
  --restart always \
  -e SRC="udp://233.0.0.100:65002?localaddr=198.19.2.101&fifo_size=1000000&overrun_nonfatal=1" \
  -e DST="rtmp://127.0.0.1:1935/live/65002" \
  ffmpeg-bridge

### Fluxo 65003
docker run -d --name ffmpeg-65003 \
  --network host \
  --restart always \
  -e SRC="udp://233.0.0.100:65003?localaddr=198.19.2.101&fifo_size=1000000&overrun_nonfatal=1" \
  -e DST="rtmp://127.0.0.1:1935/live/65003" \
  ffmpeg-bridge