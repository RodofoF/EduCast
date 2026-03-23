# EduCast

O **EduCast** nasce do desafio Hackathon com o tema:

> **"Auxílio aos professores e professoras no ensino público"**

O objetivo é desenvolver uma plataforma tecnológica que facilite o ensino em regiões com acesso limitado à internet, promovendo inclusão digital e acesso ao conteúdo educacional.

---

## 📌 Visão Geral

O EduCast é composto por **três camadas principais**:

- 📦 Backend (API + Banco de Dados)
- 📱 Frontend Mobile (App para alunos/professores)
- 🌐 Frontend Web (Painel administrativo e gestão)

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

---

## 🖼️ Arquitetura

![Diagrama](EduCast.png)

---

## 🚀 Funcionalidades

### ✔️ Atuais

- Sistema de notas
- Registro de presença via QR Code
- Mural de comunicados
- Consumo de conteúdo educacional
- Transmissão de aulas ao vivo

### 🔮 Futuras

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
EduCast/
backend/
frontend-mobile/
frontend-web/

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

## 🔧 Backend

Para iniciar o projeto execute o comando docker no diretório `backend`
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


---

# Acessos

Swagger: http://localhost:3000/api-docs
PhpMyAdmin: http://localhost:8080

Usuário padrão:
email: admin@email.com.br
senha: educastadmin

---

📱 Frontend Mobile (Expo)

cd frontend-mobile
npm install
npx expo start

Depois:

Escaneie o QR Code com o Expo Go

---

🌐 Frontend Web

cd frontend-web

npm install

npm run dev

Acesse:

http://localhost:5173

---

🔐 Variáveis de ambiente

Cada projeto possui seu próprio .env.

Mobile
EXPO_PUBLIC_API_URL=http://SEU_IP_MAQUINA:3000
Web

VITE_API_URL=http://localhost:3000

⚠️ Observações importantes

Para acessar pelo celular, utilize o IP da máquina (não localhost)
Certifique-se que backend e frontend estão na mesma rede
Expo Go deve estar atualizado
