# Frontend Web EduCast

Este diretório contém o painel web administrativo do EduCast.

Funções principais:
- autenticação de usuários administrativos
- gerenciamento de usuários
- gerenciamento de conteúdos (mural, aulas e materiais)
- integração com API do backend
- reprodução de streams HLS/DASH via interface web

## Estrutura resumida

- src/pages: páginas principais (login, dashboard, mural, usuários, videoaulas)
- src/components: componentes reutilizáveis
- src/layouts: estrutura visual das páginas
- src/routes: rotas da aplicação
- src/services: comunicação com backend/streaming
- src/store: estado global
- src/utils: funções utilitárias

## Como executar

No diretório frontend-web:

```bash
docker compose up --build
```

Acesso via Docker:

- http://localhost:8081

## Variáveis principais

Definidas no arquivo `.env`:

- `VITE_API_URL`: URL base da API backend
- `VITE_STREAM_BASE_URL`: URL base do streaming (HLS/DASH)

## Scripts úteis (execução local)

```bash
npm install
npm run dev
```

## Demonstração

Tela de login do painel administrativo:

![Login Web](./assets/web-login.jpeg)