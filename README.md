# Webapp Template

A simple template to start prototyping Web Applications and API's. This uses Fastify for HTTP & Websocket support, static file serving and templating HTML (ejs or anything supported by the point-of-view plugin).

This also includes basic configuration for prettier, Docker, and deploying to Heroku.

View a live demo of this on Heroku: [https://fastify-starter.herokuapp.com/](https://fastify-starter.herokuapp.com/)

## Running the app

```bash
npm run start-dev
```

## Run the tests

```bash
npm test
```

## Deploying to Heroku

Requires Heroku CLI

1. Create new Heroku App
1. Use heroku CLI to:
   ```
   $ heroku login
   ```
1. Set heroku environment vars: `heroku config:set NPM_CONFIG_PRODUCTION=true YARN_PRODUCTION=true NODE_ENV=production`
1. ```bash
   $ cd my-project/
   $ git init
   $ heroku git:remote -a AppNameInHeroku
   ```
1. ```bash
   $ git add .
   $ git commit -am "make it better"
   $ git push heroku master
   ```

## Using Docker

### Docker-compose

```bash
docker-compose up
```

### Build it

```bash
docker build -t webapp .
```

### Run it

```bash
docker run -it -p 80:5000 webapp
```
