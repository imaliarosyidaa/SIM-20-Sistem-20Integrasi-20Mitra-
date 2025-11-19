# syntax=docker/dockerfile:1

ARG NODE_VERSION=25.2.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev", "--", "--host"]