# Backend EduCast

Este diretório contém a API do EduCast.

Funções principais:
- integrar frontend web, frontend mobile e servidor de streaming
- autenticar usuários
- gerenciar conteúdos ao vivo, on-demand e materiais
- armazenar dados no MySQL
- disponibilizar documentação Swagger

## Estrutura resumida

- src/config: configurações da aplicação e banco
- src/controllers: regras de negócio dos endpoints
- src/models: modelos do Sequelize
- src/routes: rotas da API
- src/middleware: autenticação e validações
- src/swagger: definição da documentação da API
- uploads: arquivos enviados
- __tests__: testes automatizados

## Como executar

No diretório backend:

```bash
docker compose up --build -d
```

Para ver logs:

```bash
docker compose logs -f api
```

## Acessos

- API/Swagger: http://localhost:3000/api-docs
- phpMyAdmin: http://localhost:8080
- MySQL (host): localhost:3307

## Usuários padrão

- admin@email.com.br / educastadmin
- student@email.com.br / educaststudent

## Testes

Com o backend em execução:

```bash
npm install
npm test
```

Executar apenas um arquivo de teste:

```bash
npm test -- contents.test.js
```

## Observação sobre grupos de usuário

Ao criar usuários, associe o campo userGroups.

Exemplo:

```json
{
  "username": "test",
  "email": "test@email.com.br",
  "password": "senha123",
  "userGroups": [1]
}
```

Mapeamento atual:
- 1 = Admin
- 2 = Teacher
- 3 = Student
- 4 = School 1