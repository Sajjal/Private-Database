FROM alpine:latest

RUN apk --no-cache add zip

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY . /app

RUN npm install

ENTRYPOINT [ "npm", "start" ]