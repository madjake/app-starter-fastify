const config = require('./lib/config');
const routes = require('./routes');
const ApplicationServer = require('./ApplicationServer');

const appConfig = config.getConfigFromEnvironment(
  process.env.NODE_ENV || 'local'
);

// Environment variable PORT clobbers config to support Heroku
if (process.env.PORT) {
  appConfig.port = process.env.PORT;
}

const applicationServer = new ApplicationServer(appConfig);

applicationServer.registerRoutes(routes.HTTPRoutes);
applicationServer.registerRoutes(routes.webSocketRoutes);

(async () => {
  await applicationServer.start();
})();
