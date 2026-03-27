# TBS 6590

## Objetivo
Receber o fluxo do video do satélite e preparar para o servidor para ser uma CDN de vídeo

## Dependencia
O servidor utilizado está com Ubuntu Server 20.04, é indicação que utilize essa versão por compatibilidade de hardware 
```bash
    apt update && apt install -y \
    build-essential git make gcc g++ \
    linux-headers-$(uname -r) \
    patchutils libproc-processtable-perl perl pkg-config \
    libncurses5-dev libelf-dev bc bison flex \
    dvb-apps v4l-utils usbutils \
    ffmpeg vlc \
    tcpdump htop curl wget nano \
    dvblast
```

## Configuração
Siga os passos do manual em tbs6590_user_guide.pdf



### Escrever processos de lock da carrier

Comando de lock da placa com DVBlast
dvblast -a 0 -f 11740000 -s 29900000 -v 0 -p -m psk_8 -5 DVBS2

Enviar fluxo
dvblast -a 0 -f 11740000 -s 29900000 -v 0 -p -m psk_8 -5 DVBS2 -U -d 239.0.0.1:1234