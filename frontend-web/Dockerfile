FROM alpine:latest

WORKDIR /app

COPY . .

RUN apk add --no-cache nodejs npm

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]