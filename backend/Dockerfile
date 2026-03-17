FROM alpine:latest

WORKDIR /app

COPY . .

RUN apk add --no-cache nodejs npm
RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]