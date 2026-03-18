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

- React Native
- Expo
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
