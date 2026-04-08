# Frontend Mobile EduCast

Este diretório contém o aplicativo mobile do EduCast (React Native + Expo).

Funções principais:
- autenticação de usuários
- consumo de conteúdos educacionais
- reprodução de vídeos ao vivo e on-demand
- navegação entre mural, player, busca, perfil e detalhes
- integração com API e streaming

## Estrutura resumida

- src/screens: telas principais do app
- src/components: componentes reutilizáveis
- src/navigation: navegação do aplicativo
- src/services: integração com API/streaming
- src/store: estado global
- src/types: tipagens compartilhadas
- src/utils: utilitários

## Como executar

No diretório frontend-mobile:

```bash
npm install
npx expo start
```

Depois, use o Expo Go para abrir o app via QR Code.

## Variáveis principais

Definidas no arquivo `.env`:

- `EXPO_PUBLIC_API_URL`: URL base da API backend
- `EXPO_PUBLIC_STREAM_BASE_URL`: URL base do streaming


## Demonstração

Tela de login para referência:

![Login Mobile](./assets/mobile-login.jpeg)