// load basic application config
const getConfigFromEnvironment = (appEnvironment) => {
  const appConfig = require(`../../configs/${appEnvironment}`);

  if (process.env.PORT) {
    appConfig.port = process.env.PORT;
  }

  return appConfig;
};

module.exports = {
  getConfigFromEnvironment: getConfigFromEnvironment,
};
