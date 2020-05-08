FROM node:12

WORKDIR /opt/app

COPY . /opt/app

RUN npm install

ENTRYPOINT npm run start-dev
