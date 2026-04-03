# EduCast

O **EduCast** nasce do desafio Hackathon com o tema:

> **"Auxílio aos professores e professoras no ensino público"**

O objetivo é desenvolver uma plataforma tecnológica que facilite o ensino em regiões com acesso limitado à internet, promovendo inclusão digital e acesso ao conteúdo educacional.

---

## 📌 Visão Geral

O EduCast é composto por **quatro camadas principais**:

- 📦 Backend (API + Banco de Dados)
- 📱 Frontend Mobile (App para alunos/professores)
- 🌐 Frontend Web (Painel administrativo e gestão)
- 📡 DevOps / Streaming (`educast_nginx_rtmp` para RTMP, HLS/DASH e MP4 on-demand)

A proposta é permitir a distribuição de conteúdo educacional mesmo em cenários com baixa conectividade, utilizando CDN local e sincronização de dados.

---

## 🧠 Problema

O Brasil possui regiões com acesso limitado à internet, dificultando o ensino remoto e híbrido.

---

## 💡 Solução

O EduCast permite:

- Distribuição de conteúdo via CDN local
- Consumo de aulas mesmo com baixa conexão
- Integração com transmissões ao vivo
- Organização de conteúdo educacional

![Diagrama](EduCast.png)
---


## 🚀 Funcionalidades

### ✔️ Atuais

- Transmissão de aulas ao vivo
- Mural de comunicados
- Consumo de conteúdo educacional

### 🔮 Futuras

- Sistema de notas
- Registro de presença via QR Code
- Chat de vídeo local
- Sistema de exercícios
- Interação em tempo real entre alunos e professores

---

## 📸 Demonstração do Projeto

### 🌐 Frontend Web

Tela de login do painel administrativo:

![Login Web](./assets/web-login.PNG)

---

### 📱 Frontend Mobile

Tela de login do aplicativo:

![Login Mobile](./assets/mobile-login.png)

---

## 🧩 Estrutura do Projeto

```
EduCast/
├── 📦 backend/                    # API Node.js + Banco de Dados
│   ├── src/
│   │   ├── config/               # Configurações
│   │   ├── controllers/          # Lógica de controle
│   │   ├── models/               # Modelos de dados
│   │   ├── routes/               # Rotas da API
│   │   ├── middleware/           # Middleware (autenticação, etc)
│   │   └── services/             # Serviços de negócio
│   ├── tbsBoard/                # Instruções para preparação do servidor com a placa TBS
│   ├── mysql_data/               # Dados do banco de dados
│   ├── uploads/                  # Arquivos enviados
│   ├── docker-compose.yml        # Orquestração de containers
│   ├── Dockerfile                # Imagem Docker
│   ├── package.json              # Dependências Node.js
│   ├── app.js                    # Aplicação Express
│   └── server.js                 # Entrada do servidor
│
├── 📱 frontend-mobile/           # App React Native (Expo)
│   ├── src/
│   │   ├── screens/              # Telas do aplicativo
│   │   ├── services/             # Serviços (API, storage)
│   │   └── store/                # Estado global (Zustand)
│   ├── App.tsx                   # Componente principal
│   ├── package.json              # Dependências
│   └── tsconfig.json             # Configuração TypeScript
│
├── 🌐 frontend-web/              # Painel administrativo (React + Vite)
│   ├── src/
│   │   ├── pages/                # Páginas da aplicação
│   │   ├── routes/               # Roteamento
│   │   ├── services/             # Serviços (API)
│   │   ├── store/                # Estado global (Zustand)
│   │   ├── App.jsx               # Componente principal
│   │   ├── main.jsx              # Entrada
│   │   └── index.css             # Estilos globais
│   ├── index.html                # HTML principal
│   ├── package.json              # Dependências
│   ├── vite.config.js            # Configuração Vite
│   └── eslint.config.js          # Linting
│
├── 📡 devops/                    # Servidor de streaming com o container `educast_nginx_rtmp`
│   ├── docker-compose.yml        # Orquestração do streaming
│   ├── Dockerfile                # Imagem do nginx-rtmp
│   ├── nginx.conf                # Configuração RTMP + HLS + DASH + on-demand
│   ├── live/                     # Vídeos locais usados para simular canais ao vivo
│   ├── ondemand/                 # Biblioteca MP4 servida sob demanda
│   └── README.MD                 # Documentação do container de streaming
│
├── 🎨 assets/                    # Imagens e recursos visuais
├── README.MD                     # Documentação principal
```

**Descrição dos componentes principais:**

| Componente | Descrição | Tecnologia |
|-----------|-----------|-----------|
| **Backend** | API RESTful, autenticação, banco de dados | Node.js, Express, MySQL, JWT |
| **Frontend Mobile** | Aplicativo para alunos e professores | React Native, TypeScript, Expo |
| **Frontend Web** | Painel administrativo e gestão | React, Vite, TailwindCSS |
| **DevOps / Streaming** | Container `educast_nginx_rtmp` para RTMP, HLS/DASH ao vivo e MP4 on-demand | Docker, Nginx RTMP, FFmpeg |

---

## 🛠️ Tecnologias

### Backend
- Node.js
- Express
- MySQL
- Sequelize
- JWT
- Swagger
- Docker

### Frontend Mobile
- React Native + Expo
- TypeScript
- Axios
- Zustand
- AsyncStorage

### Frontend Web
- React (Vite)
- React Router
- Axios
- Zustand
- Tailwind CSS

---

# ⚙️ Como rodar o projeto

## Streaming (`educast_nginx_rtmp`) — subir primeiro

Antes do backend e dos frontends, inicie o container de streaming no diretório `devops`:

```bash
cd devops
docker compose up --build -d
```

Esse passo sobe o container `educast_nginx_rtmp`, responsável por:

- receber/publicar RTMP na porta `1935`
- gerar saídas ao vivo em HLS e DASH
- servir vídeos MP4 da pasta `ondemand` pela porta `9090`

## 🔧 Backend

1. Após o streaming estar ativo, execute o comando docker no diretório `backend`
```bash
docker compose up --build
```
Omita a flag `-d` para conseguir visualizar os logs

2. Acessos
* Documentação: http://localhost:3000/api-docs
* DB PhpAdmin: http://localhost:8080

3. Usuários
Na primeira build ou inicialização do projeto existe o usuário `admin` default para gerenciar o projeto. O primeiro acesso pode ser acessado por
* Login: admin@email.com.br
* Password: educastadmin

---

## 📱 Frontend Mobile (Expo)

```bash
  cd frontend-mobile
  npm install
  npx expo start
```
* 1=Admin, 2=Teacher, 3=Student, 4=School 1
Escaneie o QR Code com o Expo Go para ter acesso ao app em desenvolvimento.

---

## 🌐 Frontend Web

```bash
  cd frontend-web
  npm install
  npm run dev
```
Para acessar o frontend web **http://localhost:5173**

---

## 🔐 Variáveis de ambiente

Cada projeto possui sua próprias variáveis, no momento elas estão expostas para facilitar o desenvolvimento.
```bash
#Backend
PORT=3000

# Banco
DB_HOST=db
DB_USER=educast
DB_PASSWORD=educast
DB_NAME=educast
DB_PORT=3306

# Segurança
JWT_SECRET=educastsecret

# Admin padrão
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_EMAIL=admin@email.com.br
ADMIN_DEFAULT_PASSWORD=educastadmin

# Swagger (ajustado para acessar via celular também)
SWAGGER_PROTOCOL=http
SWAGGER_HOST=192.168.4.51 ##usar o endereço IP da máquina
SWAGGER_PORT=3000
```

```bash
#Mobile
EXPO_PUBLIC_API_URL=http://SEU_IP_MAQUINA:3000
```
```bash
#Web
VITE_API_URL=http://localhost:3000
```
⚠️ Observações importantes

Para acessar pelo celular, utilize o IP da máquina (não localhost)
Certifique-se que backend e frontend estão na mesma rede
Expo Go deve estar atualizado

---
## Testes

Atualmente, os testes automatizados do projeto estão concentrados no backend, na pasta `backend/__tests__`.

Para executar os testes:

```bash
cd backend
npm install
npm test
```
Para executar somente um bloco de teste, indique o arquivo que deseja testart, no meu exemplo irei testar tudo relacionado a contents, que está em meu arquivo **contents.test.js**

```bash
npm test -- contents.test.js
``` 

O script configurado executa o Jest em ambiente de teste:

```bash
NODE_ENV=test jest --runInBand
```

Arquivos de teste atuais:
- `backend/__tests__/app.test.js`
- `backend/__tests__/auth.test.js`
- `backend/__tests__/contents.test.js`


## Próximos passos
### Backend
* Preparar o backend para interagir com o servidor e a placa, permitindo integração via API com outros sistemas
* Criar script para mocked data,
  * Deve associar o fluxo ao vivo;
  * Deve fazer upload dos conteudos ondemand
  * Fazer upload de contents
  * Criar usuários
### Frontend



### Testes
* Testar a aplicação diretamente no servidor de streaming para validar os fluxos ao vivo e compartilhamento de informaçoes
* Fazer a build do app para fazer o teste real

## Entrega
Fluxo de demonstração da entrega, com foco em sincronização inicial via servidor e compartilhamento local sem dependência de internet.

### 1. Preparação do cenário
* Realizar o deploy no servidor de streaming com a placa.
* Posicionar um notebook ao lado do servidor para simular o ambiente de gestão do professor.
* Preparar dois celulares com o aplicativo instalado e sem conteúdos sincronizados inicialmente.

### 2. Sincronização inicial com o servidor
* No celular 1, escanear o QR Code de acesso ao Wi-Fi da mesma rede do servidor de streaming.
* Após entrar na rede, o aplicativo atualiza os conteúdos, baixa os materiais on-demand e exibe o conteúdo ao vivo.
* Desconectar o celular 1 do Wi-Fi e demonstrar que os conteúdos continuam disponíveis offline.

### 3. Compartilhamento descentralizado entre celulares
* Com o celular 1 fora da rede do servidor, ativar o hotspot para que ele passe a atuar como ponto de distribuição local.
* Conectar o celular 2 ao hotspot do celular 1.
* No aplicativo do celular 1, acessar a área de compartilhamento e gerar o QR Code de transferência.

### 4. Como o QR Code funciona nesse fluxo
* O QR Code contém variáveis de configuração da origem dos conteúdos, como `SERVER_IP`.
* Na sincronização inicial, o celular 1 lê um QR Code cujo `SERVER_IP` aponta para o servidor de streaming.
* No compartilhamento local, o celular 2 lê o QR Code gerado pelo celular 1, e então interpreta o `SERVER_IP` como o endereço do próprio celular 1.
* Com isso, o celular 2 passa a baixar os conteúdos diretamente do celular 1, sem precisar acessar o servidor central.

### 5. Resultado esperado da entrega
* Validar que um dispositivo sem interação prévia com o servidor (celular 2) consegue receber os conteúdos por proximidade.
* Demonstrar o objetivo principal do projeto: distribuição de conteúdo descentralizada, com suporte a ambientes de baixa ou nenhuma conectividade.




