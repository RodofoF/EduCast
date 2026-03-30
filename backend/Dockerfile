FROM alpine:latest

WORKDIR /app

COPY . .

RUN apk add --no-cache nodejs npm python3 make g++ openssh-client net-tools iputils-ping ffmpeg ca-certificates tzdata

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]