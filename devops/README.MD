# Container de Streaming (`devops`)

Este diretório contém **um único container Docker** responsável por:

- receber/publicar streams **RTMP**
- gerar saídas **HLS** e **DASH** para os canais ao vivo
- servir vídeos **MP4 on-demand** da pasta `ondemand`
- simular 3 canais locais em loop para facilitar o desenvolvimento

---

## Visão geral

O serviço principal está definido em `docker-compose.yml` como `nginx-rtmp`.

Quando o container sobe, o fluxo é o seguinte:

1. o `Dockerfile` cria a imagem baseada em `tiangolo/nginx-rtmp`
2. o container inicia o `nginx` com o `CMD` padrão da imagem
3. o `nginx.conf` transforma streams em saídas **HLS** e **DASH** e também expõe os vídeos da pasta `ondemand/`

Para simular canais locais em desenvolvimento, execute manualmente `start-streaming.sh` dentro do container.
Esse script inicia o simulador `live/live.sh`, que publica os vídeos da pasta `live/` em **loop** para o próprio servidor RTMP.

---

## Estrutura importante

- `Dockerfile`: monta a imagem do servidor
- `docker-compose.yml`: sobe o container e monta os volumes
- `nginx.conf`: configuração RTMP + HTTP
- `start-streaming.sh`: inicialização do simulador de canais em ambiente local
- `live/live.sh`: publica os vídeos locais em loop via RTMP
- `live/`: vídeos usados para simular canais ao vivo
- `ondemand/`: biblioteca de vídeos disponíveis sob demanda

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
```

### DASH ao vivo
```text
http://localhost:9090/dash/live/1001/index.mpd
http://localhost:9090/dash/live/1003/index.mpd
http://localhost:9090/dash/live/1012/index.mpd
```

### Estatísticas RTMP
```text
http://localhost:9090/stat
```
