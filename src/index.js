const path = require('path');
const helmet = require('fastify-helmet');
const routes = require('./routes');
const config = require('./lib/config');

const appConfig = config.getConfigFromEnvironment(
  process.env.NODE_ENV || 'local'
);

const fastify = require('fastify')({
  logger: true,
});

fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs'),
  },
  options: {},
});

fastify.register(helmet);

// Serve static files under the public directory
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../public'),
  prefix: '/static',
});

// Decorate requests with dependencies
fastify.decorateRequest('config', appConfig);

routes.registerRoutes(fastify);

const notFoundMessages = [
  'Not found.',
  'Nothing here pal.',
  'Yup. This is an empty page.',
  '☢',
  '☣',
];

const errorMessages = ['🔥', '☣'];

fastify.setErrorHandler(function (err, request, reply) {
  console.log(err);
  reply
    .code(500)
    .send(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
});

fastify.setNotFoundHandler(function (request, reply) {
  reply
    .code(404)
    .send(
      notFoundMessages[Math.floor(Math.random() * notFoundMessages.length)],
    );
});

fastify.listen(appConfig.port, appConfig.host, (err, address) => {
  if (err) {
    throw err;
  }

  fastify.log.info(`Server listening on ${address}`);
});
