const path = require('path');
const crypto = require('crypto');

// These methods can be defined int he config json file to indicate which
// method is being used to store the JWT Secret. The key path is `jwt.secretStorageMethod`
const SecretStorageMethods = {
  Vault: 'Vault',
  AwsSecretsManager: 'AwsSecretsManager',
  EnvironmentVariable: 'EnvironmentVariable',
  Random: 'Random',
  Config: 'Config',
};

// load application config from flat file
// and resolve and other config related values
const getConfigFromEnvironment = (appEnvironment) => {
  const configPath = path.join(
    __dirname,
    `../../configs/${appEnvironment}.json`,
  );

  const appConfig = require(configPath);

  switch (appConfig.jwt.secretStorageMethod) {
    case SecretStorageMethods.Vault:
      //implement
      break;
    case SecretStorageMethods.AwsSecretsManager:
      //implement
      break;
    case SecretStorageMethods.EnvironmentVariable: //For testing and running locally.
      appConfig.jwt.secret = process.env[appConfig.jwt.EnvironmentVariableName];
      break;
    case SecretStorageMethods.Random: // For testing and running locally
      appConfig.jwt.secret = crypto.randomBytes(128).toString('hex');
      break;
    case SecretStorageMethods.Config: // use the secret from the config file...
      break;
    default:
      throw Error(
        `No valid JWT secret storage method defined. Method is: ${appConfig.jwt.secretStorageMethod}`,
      );
      break;
  }

  return appConfig;
};

module.exports = {
  getConfigFromEnvironment: getConfigFromEnvironment,
};
