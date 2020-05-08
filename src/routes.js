

// PAGES

const indexPage = require('./pages/index');

const registerRoutes = (fastify) => {
  fastify.get('/', indexPage); //home page
};

const websocketHandlers = (fastify) => {
  fastify.register(require('fastify-websocket'), {
    handle,
    options: {
      maxPayload: 1048576, // we set the maximum allowed messages size to 1 MiB (1024 bytes * 1024 bytes)
      path: '/ws', // we accept only connections matching this path e.g.: ws://localhost:3000/fastify
      verifyClient: function (info, next) {
        if (info.req.headers['x-fastify-header'] !== appConfig.filterHeaderValue) {
          return next(false) // the connection is not allowed
        }
        next(true) // the connection is allowed
      }
    }
  })
};
module.exports = {
  registerRoutes: registerRoutes,
  registerWebsocketHandlers: websocketHandlers,
};
