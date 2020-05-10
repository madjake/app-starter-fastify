import * as path from "path";

import fastify from "fastify";
import helmet from "fastify-helmet";
import fastifyCookie from "fastify-cookie";
import fastifyStatic from "fastify-static";
import pointOfView from "point-of-view";
import ejsTemplates from "ejs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import authenticationPlugin from "./plugins/authentication.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const notFoundMessages = [
  "Not found.",
  "Nothing here pal.",
  "Yup. This is an empty page.",
  "☢",
  "☣",
];

const errorMessages = ["🔥", "☣"];

class ApplicationServer {
  constructor(applicationConfig) {
    this.applicationConfig = applicationConfig;

    this.fastify = fastify({
      logger: applicationConfig.logging.enabled,
    });

    this.injectBaseDependencies();
    this.loadMiddleware();
  }

  // Decorate fastify with 'Global' dependencies like the config
  injectBaseDependencies() {
    this.fastify.decorate("config", this.applicationConfig);

    // whitelist what is exposed to the request handler
    this.fastify.decorateRequest("config", {
      cookies: this.applicationConfig.cookies,
      jwt: {
        expiresIn: this.applicationConfig.jwt.expiresIn,
      },
    });
  }

  loadMiddleware() {
    this.fastify.register(pointOfView, {
      engine: {
        ejs: ejsTemplates,
      },
      options: {},
    });

    this.fastify.register(helmet);
    this.fastify.register(fastifyCookie);

    authenticationPlugin(this.fastify);
  }

  // Static file serving
  registerBaseRoutes() {
    // Serve static files under the public directory
    this.fastify.register(fastifyStatic, {
      root: path.join(__dirname, "../public"),
      prefix: "/static",
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
          notFoundMessages[Math.floor(Math.random() * notFoundMessages.length)]
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

    this.fastify.listen(
      this.applicationConfig.port,
      this.applicationConfig.host,
      (err, address) => {
        if (err) {
          throw err;
        }
      }
    );

    await this.fastify.ready();
  }

  close() {
    this.fastify.close();
  }
}

export default ApplicationServer;
