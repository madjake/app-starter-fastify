// TODO: Is this really a plugin? No. It's not
// This belongs back in the core app.
// Registering the fastify-jwt plugin goes with middleware code
// The decorators need a decorators directory or some such

import fastifyJWT from "fastify-jwt";

const authentication = (fastify) => {
  fastify.register(fastifyJWT, {
    secret: fastify.config.jwt.secret,
    cookie: {
      cookieName: fastify.config.cookies.jwtTokenName,
    },
  });

  // Routes can set this as a preValidation check to make sure somebody has Auth'd with the app
  fastify.decorate("authenticate", async function (request, reply, done) {
    try {
      await request.jwtVerify();
    } catch (err) {
      console.log(err);
      reply
        .status(401)
        .type("text/html; charset=utf-8")
        .send("Not authenticated.");
    }
  });

  // Convenience methods for adding routes that require this auth behavior
  fastify.decorate("addAuthRoute", function (opts) {
    let preValidation = opts.preValidation || [];
    opts.preValidation = [...preValidation, this.authenticate];
    this.route(opts);
  });

  fastify.decorate("addGETAuthRoute", function (path, handler, opts) {
    opts = opts || {};
    opts.method = "GET";
    opts.path = path;
    opts.handler = handler;

    this.addAuthRoute(opts);
  });
};

export default authentication;
