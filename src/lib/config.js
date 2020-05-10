import * as path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// These methods can be defined int he config json file to indicate which
// method is being used to store the JWT Secret. The key path is `jwt.secretStorageMethod`
export const SecretStorageMethods = {
  Vault: "Vault",
  AwsSecretsManager: "AwsSecretsManager",
  EnvironmentVariable: "EnvironmentVariable",
  Random: "Random",
  Config: "Config",
};

// load application config from flat file
// and resolve and other config related values
export const getConfigFromEnvironment = (appEnvironment) => {
  const configPath = path.join(
    __dirname,
    `../../configs/${appEnvironment}.json`
  );

  const appConfig = JSON.parse(readFileSync(configPath, "utf8"));

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
      appConfig.jwt.secret = crypto.randomBytes(128).toString("hex");
      break;
    case SecretStorageMethods.Config: // use the secret from the config file...
      break;
    default:
      throw Error(
        `No valid JWT secret storage method defined. Method is: ${appConfig.jwt.secretStorageMethod}`
      );
      break;
  }

  return appConfig;
};
