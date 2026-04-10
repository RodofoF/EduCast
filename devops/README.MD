# Container de Streaming (`devops`)

Este diretório contém **um único container Docker** responsável por:

- receber/publicar streams **RTMP**
- gerar saídas **HLS** e **DASH** para os canais ao vivo
- servir vídeos **MP4 on-demand** da pasta `ondemand`
- simular 3 canais locais em loop para facilitar o desenvolvimento (execução manual)

---

## Visão geral

O serviço principal está definido em `docker-compose.yml` como `nginx-rtmp`.

Quando o container sobe, o fluxo é o seguinte:

1. o `Dockerfile` cria a imagem baseada em `tiangolo/nginx-rtmp`
2. o container inicia o `nginx` com o `CMD` padrão da imagem
3. o `nginx.conf` transforma streams em saídas **HLS** e **DASH** e também expõe os vídeos da pasta `ondemand/`

Para simular canais locais em desenvolvimento, execute manualmente `start-streaming.sh` dentro do container.
Esse script inicia o simulador `live/live.sh`, que publica os vídeos da pasta `live/` em **loop** para o próprio servidor RTMP.

Também existe o script `live/liveFromServer.sh`, usado para receber um sinal ao vivo externo (atualmente via `udp://127.0.0.1:10001`) e reenviar para `rtmp://127.0.0.1:1935/live/1002`.
Depois que esse stream entra no app `live` do nginx-rtmp, o `nginx.conf` faz a segmentação para **HLS** e **DASH** automaticamente.

---

## Estrutura importante

- `Dockerfile`: monta a imagem do servidor
- `docker-compose.yml`: sobe o container e monta os volumes
- `nginx.conf`: configuração RTMP + HTTP
- `start-streaming.sh`: inicialização do simulador de canais em ambiente local
- `live/live.sh`: publica os vídeos locais em loop via RTMP
- `live/liveFromServer.sh`: recebe stream ao vivo (UDP) e publica em RTMP para o nginx-rtmp transformar em HLS/DASH
- `live/`: vídeos usados para simular canais ao vivo
- `ondemand/`: biblioteca de vídeos disponíveis sob demanda

---

## Fluxos de live

### 1. Simulação local (loop de arquivos)

- Script: `live/live.sh`
- Entrada: arquivos MP4 da pasta `live/`
- Saída RTMP: `rtmp://127.0.0.1:1935/live/{canal}`
- Saída final: HLS em `/hls/live/{canal}/index.m3u8` e DASH em `/dash/live/{canal}/index.mpd`

### 2. Ingestão de live do servidor

- Script: `live/liveFromServer.sh`
- Entrada: `udp://127.0.0.1:10001`
- Saída RTMP: `rtmp://127.0.0.1:1935/live/1002`
- Saída final: HLS em `/hls/live/1002/index.m3u8` e DASH em `/dash/live/1002/index.mpd`

---

## Canais ao vivo simulados

Hoje o container simula estes 3 canais:

| Arquivo | Canal RTMP | HLS | DASH |
|---|---:|---|---|
| `live/10001.mp4` | `1001` | `/hls/live/1001/index.m3u8` | `/dash/live/1001/index.mpd` |
| `live/10012.mp4` | `1012` | `/hls/live/1012/index.m3u8` | `/dash/live/1012/index.mpd` |
| `live/10003.mp4` | `1003` | `/hls/live/1003/index.m3u8` | `/dash/live/1003/index.mpd` |

Esses vídeos ficam em loop e simulam o comportamento de entrada que viria de uma placa TBS.

---

## Vídeos on-demand

Os arquivos colocados em `ondemand/` ficam disponíveis em dois formatos de acesso:

### 1. HTTP direto (MP4)
Exemplo:

```text
http://localhost:9090/ondemand/speedcast/speedcast-demo.mp4
```

### 2. RTMP VOD
Exemplo:

```text
rtmp://localhost:1935/vod/mp4:speedcast/speedcast-demo.mp4
```

> Por enquanto, os vídeos on-demand estão sendo servidos apenas como **MP4**.

---

## Portas usadas

- `1935`: entrada/saída **RTMP**
- `9090`: servidor **HTTP** para HLS, DASH, healthcheck e arquivos on-demand

---

## Como subir

```bash
cd devops
docker compose up --build -d
```

## Como simular canais locais (desenvolvimento)

```bash
docker exec educast_nginx_rtmp /usr/local/bin/start-streaming.sh
```

## Como receber live externa e transformar em HLS/DASH

```bash
docker exec educast_nginx_rtmp sh /opt/live/liveFromServer.sh
```

## Como parar

```bash
docker compose down
```

## Logs

```bash
docker compose logs -f nginx-rtmp
```

---

## Endpoints úteis

### Healthcheck
```text
http://localhost:9090/health
```

### HLS ao vivo
```text
http://localhost:9090/hls/live/1001/index.m3u8
http://localhost:9090/hls/live/1003/index.m3u8
http://localhost:9090/hls/live/1012/index.m3u8
http://localhost:9090/hls/live/1002/index.m3u8   # quando liveFromServer.sh estiver ativo
```

### DASH ao vivo
```text
http://localhost:9090/dash/live/1001/index.mpd
http://localhost:9090/dash/live/1003/index.mpd
http://localhost:9090/dash/live/1012/index.mpd
http://localhost:9090/dash/live/1002/index.mpd   # quando liveFromServer.sh estiver ativo
```

### Estatísticas RTMP
```text
http://localhost:9090/stat
```
