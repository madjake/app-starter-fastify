import { getConfigFromEnvironment } from "./lib/config.js";
import { httpRoutes, webSocketHandler } from "./routes.js";
import ApplicationServer from "./ApplicationServer.js";

const appConfig = getConfigFromEnvironment(process.env.NODE_ENV || "local");

// Environment variable PORT clobbers config to support Heroku
if (process.env.PORT) {
  appConfig.port = process.env.PORT;
}

const applicationServer = new ApplicationServer(appConfig);

applicationServer.registerRoutes(httpRoutes);
applicationServer.registerRoutes(webSocketHandler);

(async () => {
  await applicationServer.start();
})();
