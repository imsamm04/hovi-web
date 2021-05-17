FROM node:9.4.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
USER root

COPY package.json /usr/src/app/
RUN npm install

COPY . .
