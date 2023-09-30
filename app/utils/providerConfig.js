const { ENVIRONMENT, environmentConfig } = require("./config");

function updateProviders(ENVIRONMENT) {
  const providers = environmentConfig[ENVIRONMENT];
  console.log("chain based providers", providers);
  if (providers) {
    return providers;
  } else {
    console.error(`Invalid ENVIRONMENT: ${ENVIRONMENT}`);
  }
}

// Set the initial environment and update PROVIDERS
const PROVIDERS = updateProviders(ENVIRONMENT);

module.exports = { PROVIDERS };
