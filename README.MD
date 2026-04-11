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
- 📡 DevOps / Streaming (`educast_nginx_rtmp` para RTMP, HLS/DASH)

A proposta é permitir a distribuição de conteúdo educacional mesmo em cenários com baixa conectividade, utilizando CDN local e sincronização de dados.

---

## 🧠 Problema

O Brasil possui regiões com acesso limitado à internet, dificultando o ensino remoto e híbrido.

---

## 💡 Solução
Para solucionar esse problema, propomos a plataforma **EduCast**.

O EduCast é uma plataforma que tem como objetivo descentralizar o consumo de CDNs e entregar uma experiência de educação a distância similar à de plataformas tradicionais, oferecendo integração entre backend, hardware (Placa TBS 6590), plataforma de gerência (frontend-web) e plataforma do usuário (frontend-mobile).

A proposta do EduCast é oferecer conteúdo educacional por meio da intranet. Se possível, o servidor também deve ter acesso à internet para receber conteúdo externo e distribuí-lo na intranet da região.

O projeto é inspirado em novas tecnologias como DVB-NIP, que se propõem a transmitir vídeos ao vivo e on-demand em padrões web.

Em nossa proposta temos um servidor on-premise configurado com uma placa TBS 6590. O processo de instalação está em `/devops/tbsBoard/tbs6590_user_guide.pdf`. Essa placa permite aproveitar o sinal via satélite e, com a aplicação no container `educast_nginx_rtmp`, fazer a conversão do sinal e transmitir para os usuários da plataforma. Também é possível receber um canal de educação, armazenar e depois distribuir como on-demand para a região, além da transmissão ao vivo para usuários conectados ao servidor.

![Diagrama](EduCast.png)

### Funcionalidades propostas

### DevOps
Esse diretório é importante apenas para o desenvolvedor, não para o usuário.
- Container para gerenciar os fluxos ao vivo gerados pela placa TBS ou por scripts internos de apoio ao desenvolvimento

### Plataforma Backend
- Servir de base integradora com hardware, mobile e web
- Armazenar conteúdos on-demand
- Hospedar DB e gerenciar com API

#### Plataforma de gerência (Frontend Web)
- Gerenciamento de links HLS do próprio servidor;
- Reaproveitamento de conteúdo de streaming de outras plataformas: inserir links HLS ou DASH na plataforma para acesso de quem estiver conectado à intranet;
- Upload de arquivos on-demand;
- Envio de conteúdo de ensino como matérias, livros, reflexão e etc.
- Gerenciamento dos usuários

### Plataforma do usuário (Frontend Mobile)
- Assistir vídeos ao vivo quando conectado à intranet;
- Assistir e armazenar vídeos on-demand;
- Consumir conteúdos de texto como matérias, livros, informativos e etc.
- Compartilhamento dos dados do app por meio do QR gerado no aplicativo, inclusive offline entre dispositivos móveis
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
│   │   └── swagger/              # Definições da documentação da API
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
│   ├── tbsBoard/                 # Instruções para preparação do servidor com a placa TBS
│   └── README.MD                 # Documentação do container de streaming
│
├── 🎨 assets/                    # Imagens e recursos visuais
├── README.MD                     # Documentação principal
```
---

## 🛠️ Tecnologias

- Backend: Node.js, Express, MySQL, Sequelize, JWT, Swagger e Docker
- Frontend Mobile: React Native (Expo), TypeScript, Axios, Zustand e AsyncStorage
- Frontend Web: React (Vite), React Router, Axios, Zustand e Tailwind CSS

---

# ⚙️ Como executar o projeto

## Streaming (`educast_nginx_rtmp`)

1. Como primeiro passo, inicie o container de streaming no diretório `devops`:

```bash
cd devops
docker compose up --build -d
```
Em ambiente local de desenvolvimento/teste, execute o script abaixo para simular vídeo ao vivo em loop.
No servidor preparado para a demo, essa simulação não é necessária.

```bash
docker exec educast_nginx_rtmp /usr/local/bin/start-streaming.sh
```

## 🔧 Backend

1. Após o streaming estar ativo, execute o comando Docker no diretório `backend`

```bash
docker compose up --build -d
```
Omita a flag `-d` para conseguir visualizar os logs

2. Acessos
* Documentação: http://localhost:3000/api-docs
* DB phpMyAdmin: http://localhost:8080

3. Usuários
Na primeira build ou inicialização do projeto, existem os usuários padrão `admin` e `student` para gerenciar o projeto. O primeiro acesso pode ser feito por:

* **Login:** admin@email.com.br
* **Password:** educastadmin

* **Login:** student@email.com.br
* **Password:** educaststudent

---

## 📱 Frontend Mobile (Expo)

1. Execute o comando abaixo no diretório `frontend-mobile`

```bash
  npm install
  npx expo start
```

Escaneie o QR Code com o Expo Go para acessar o app em desenvolvimento.

---

## 🌐 Frontend Web
1. Execute o comando abaixo no diretório `frontend-web`

```bash
  docker compose up --build -d
```

Para acessar o frontend web via Docker: **http://localhost:8081**

---

## 🔐 Variáveis de ambiente

Cada projeto possui suas próprias variáveis. No momento, elas estão expostas para facilitar o desenvolvimento.

⚠️ Observações importantes

Altere as variáveis que estão em localhost para o IP do equipamento utilizado para teste. Algumas aplicações podem não funcionar devido a esse conflito.

---
## Mais informações do projeto

Para não deixar o README.MD extenso, cada diretório possui um arquivo para orientar e trazer informações mais detalhadas de cada etapa do projeto.

---
## Links
### Pitch
* [Pitch](https://drive.google.com/file/d/1trfXMuCReIyagR2yFkGSxcpcK4u6haRe/view?usp=drive_link)

### Demonstração EduCast
* [MVP](https://drive.google.com/file/d/1TjUmKlNbPrzM9eY0wRVz8sdCK4zOryE8/view?usp=drive_link)

---
## Aprendizados 
* A importância da boa comunicação foi essencial durante o projeto. Como decidimos participar do hackathon em apenas duas pessoas, estávamos focados em nossas atividades e com pouco tempo para documentar, mas nossa comunicação diária nos ajudou a manter o ritmo e o processo de criação;
* Acreditamos que o conteúdo e o aprendizado durante a pós nos ajudaram a amadurecer o nosso código. Conseguimos entender com mais clareza o que devemos fazer e como fazer;
* O uso de IA é essencial. Não fizemos nada em Vibe Coding, mas, sem sombra de dúvida, é uma ferramenta sem limites quando precisamos consultar algo ou quando estamos começando um processo sobre o qual não temos total domínio e precisamos tirar dúvidas.

## Dificuldades
* Tivemos dificuldades no ajuste do app mobile. Como estávamos testando em Android e iOS, vimos algumas incompatibilidades em alguns momentos, mas conseguimos resolvê-las;
* No início do projeto, estávamos focados em alcançar um sistema mais completo, bem mais próximo do que apresentamos no pitch. Por exemplo, no início pensávamos em fazer um sistema de login mais complexo, com um banco relacionado a informações do aluno, sala, escola e conteúdo baixado. No entanto, vimos que teríamos pouco tempo para focar nas features de vídeo, que podem ser um diferencial no projeto;
* Tivemos dificuldades para configurar a placa TBS. No projeto, a ideia era ter uma melhor integração com o sistema do EduCast, mas não focamos nisso. Se focássemos nisso, teríamos uma ótima interação com a placa, mas nosso objetivo principal era ter uma ótima plataforma de ensino, então essa integração ficou como pendência.

## Pendências e futuras melhorias
* Melhor integração do EduCast com a placa TBS 6590. Poderíamos ter a gerência facilitada pelo frontend e fazer ajustes de frequência ou definir qual canal transmitir pelo EduCast;
* Melhor manipulação do QR e da transferência de arquivos. A ideia inicial era que o QR Code carregasse a variável de identificação do servidor: se o usuário escaneasse o QR do servidor, teria acesso ao conteúdo online e offline dele; se o usuário escaneasse o QR de outro usuário, o celular se transformaria em um "servidor";
* Criar interações dos usuários com a plataforma, como exercícios de fixação, quiz ou minigames. Isso tornaria o app mais atrativo.

---

## Autores
### Rodolfo Ferreira Fernandes
- E-mail: [rdf.8888@gmail.com](mailto:rdf.8888@gmail.com)
- RM: 365194

### Wanderson Sousa
- E-mail: [wanderson@wsousa.dev](mailto:wanderson@wsousa.dev)
- RM: 365367


