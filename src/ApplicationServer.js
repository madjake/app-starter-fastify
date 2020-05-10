const path = require('path');
const helmet = require('fastify-helmet');
const authenticationPlugin = require('./plugins/authentication');

const notFoundMessages = [
  'Not found.',
  'Nothing here pal.',
  'Yup. This is an empty page.',
  '☢',
  '☣',
];

const errorMessages = ['🔥', '☣'];

class ApplicationServer {
  constructor(applicationConfig) {
    this.applicationConfig = applicationConfig;

    this.fastify = require('fastify')({
      logger: true,
    });

    this.injectBaseDependencies();
    this.loadMiddleware();
  }
  
  // Decorate fastify with 'Global' dependencies like the config
  injectBaseDependencies() {
    this.fastify.decorate('config', this.applicationConfig);

    // whitelist what is exposed to the request handler
    this.fastify.decorateRequest('config', {
      cookies: this.applicationConfig.cookies,
      jwt: {
        expiresIn: this.applicationConfig.jwt.expiresIn
      }
    });
  }

  loadMiddleware() {
    this.fastify.register(require('point-of-view'), {
      engine: {
        ejs: require('ejs'),
      },
      options: {},
    });

    this.fastify.register(helmet);
    this.fastify.register(require('fastify-cookie'))

    authenticationPlugin(this.fastify);
  }

  // Static file serving
  registerBaseRoutes() {
    // Serve static files under the public directory
    this.fastify.register(require('fastify-static'), {
      root: path.join(__dirname, '../public'),
      prefix: '/static',
    }); 
  }
 
  registerRoutes(routes) {
    routes(this.fastify);
  }
 
  // handles invalid routes and general errors
  registerErrorHandlers() {
    this.fastify.setErrorHandler(function (err, request, reply) {
      console.log(err);
      reply
        .code(500)
        .send(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
    });

    this.fastify.setNotFoundHandler(function (request, reply) {
      reply
        .code(404)
        .send(
          notFoundMessages[Math.floor(Math.random() * notFoundMessages.length)],
        );
    });
  }

  getAddress() {
    return this.fastify.server.address().address;
  }

  getPort() {
    return this.fastify.server.address().port;
  }

  async start() {
    this.registerBaseRoutes();
    this.registerErrorHandlers();
    
    this.fastify.listen(this.applicationConfig.port, this.applicationConfig.host, (err, address) => {
      if (err) {
        throw err;
      }
    });

    await this.fastify.ready();
  }

  close() {
    this.fastify.close();
  }
}

module.exports = ApplicationServer;
