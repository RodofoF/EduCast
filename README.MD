# EduCast

O EduCast nasce do desafio Hackathon com o tema **"Auxilio aos professores e professoras no ensino público"**
O Objetivo é desenvolver sistemas, ferramentas ou plataformas tecnológicas que facilitem o trabalho dos professores e professoras da rede publica de ensino, proporcionando mais eficiência, criatividade e interação com seus alunos.

Um dos exemplos utilizados para iniciar o projeto é a solução do tópico **Inclusão Digital**, propostas que ampliem o acesso ao ensino remoto ou hibrido, considerando a realidade dos alunos e alunas com acesso limitado a tecnologia.

## Proposta
O Brasil vai além de São Paulo onde temos a possibilidade de alcance de operadoras, porem pequenas vilas o acesso a internet é limmito.
Para levar conteúdo para regiões remotas estamos criando o EduCast um sistema que leva educação além da internet.
A proposta é levar conteúdo para regiões remota através do satélite e baixa conexão de dados. 
O projeto se concentra em armazenar conteúdo e transmissões ao Vivo em uma CDN local, sendo capaz de distribuir esse conteúdo para dispositivos móveis.

![Diagrama](EduCast.png)

## Features
* Sistema de notas para alunos;
* Sistema de presença ( Registrada sempre que você consome conteúdo escaneando o QR Code);
* Mural de comunicados da instituição;
* Receber aulas ao vivo via SRT no servidor e encaminhar para região
* Receber aulas ao vivo via satélite e encaminhar para região
* Receber conteúdo de estudo e transmitir para os alunos que escaneiam o QR Code, 

## Features futuras
* Sistema de chat de video local;
* Exercicios para alunos;

## Desafios técnicos
* Enviar o conteúdo para o servidor e armazenar, após isso o aplicativo tem que ser capaz de organizar essas informaçoes;
* O aplicativo tem que ser capaz de identificar os conteúdos ao vivo disponveis na CDN;
* Devemos ter uma plataforma web, util para gerenciar conteúdo e um app útil para os alunos consumirem o conteúdo;
* Permitir o compatilhamento de dados entre dispositivos e envio do dispositivo para a CDN e a CDN transmitir para a nuvem

# Tecnologias utilizadas

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
|     tbsBoard                    # Onde estão instruções para preparação do servidor com a placa TBS   
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
├── 📡 streamServer/              # Servidor de streaming (FFmpeg + Nginx)
│   ├── ffmpegUdp2Hls/            # Convertedor UDP para HLS
│   │   ├── ffmpeg.sh             # Script de processamento
│   │   └── Dockerfile            # Imagem Docker
│   ├── nginx/                    # Servidor web
│   │   └── nginx.conf            # Configuração
│   ├── app.js                    # Aplicação principal
│   └── docker-compose.yml        # Orquestração
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
| **Stream Server** | Transmissão de vídeo ao vivo | FFmpeg, Nginx, HLS |

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
- React Navigation
- Context API
- Expo Environment Variables

## Tecnologias utilizadas
### BackEnd
* Bcrypt
* Cors
* Dotenv
* Express
* JWT
* Multer
* Mysql
* Sequelize
* Swagger

### FrontEnd Mobile
* React Native + Expo
* Axios 
* TanStack Query 
* Zustand 
* AsyncStorage 

### FrontEnd Web
* React com Vite
* React Router
* Axios
* TanStack Query
* Zustand
* Tailwind CSS

## Iniciando o projeto
### BackEnd
1. Para iniciar o projeto execute o comando docker no diretório `backend`
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

### Backend explicação
* Usuários: Para criar os usuários é importante associar os usuários ao grupo
```bash
{
  "username": "test",
  "email": "rodolfo@email.com.br",
  "password": "senha123",
  "userGroups": [
    1
  ]
}
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

## Proximoms passos
* Preparar o backend para interagir com o server e a placa, sendo possivel a integração via api com outros sistemas
* Preparar um servidor nginx que irá receber o fluxo udp e transformar em HLS e DASH
* No servidor nginx teremos os arquivos estaticos que servirão o on demand
* Preparar um endpoint que indica quais videos estão disponíveis no ao vivo
* Preparar endpoints de conteúdo
* Preparar endpoints de mural da escola
