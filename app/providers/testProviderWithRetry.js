// providers.js
const { fetchWithTimeout } = require("./fetchWithTimeout");
const { PROVIDER_TIMEOUT, ENVIRONMENT } = require("../utils/config");
const { supported_methods } = require("../utils/supportedMethod");
/**
 * Test a provider and retry with the next one if it fails
 * @param {URL} url
 * @param {Request} request
 * @param {Array} providersArray
 * @param {object} proxy
 * @param {number} index
 */
async function testProviderWithRetry(request, providersArray, proxy, index = 0) {
  let data;
  while (index < providersArray.length) {
    console.log("TCL: testProviderWithRetry -> providersArray", providersArray[index]);
    let method = handleMultipleMethods(request);

    if (!supported_methods[ENVIRONMENT][providersArray[index].url].includes(method)) {
      index++;
      console.error(`"${request.body.method}" method not supported by ${providersArray[index].url}, skipping`);
      continue;
    }
    let url = new URL(providersArray[index].url);
    try {
      data = await fetchWithTimeout(
        url,
        request,
        PROVIDER_TIMEOUT,
        index,
        proxy
      );
      return data;
    } catch (e) {
      console.error(
        `Request failed on ${providersArray[index].url}, trying next provider ${providersArray[index + 1].url}`
      );
      index++;
    }
    if (index === providersArray.length)
      throw new Error("All providers failed");
  }
}

function handleMultipleMethods(req) {
  if (Array.isArray(req.body)) {
    if (req.body.length > 0) {
      return req.body[0].method;
    } else {
      console.error("No methods specified in request body");
      return undefined;
    }
  } else {
    return req.body.method;
  }
}

module.exports = {
  testProviderWithRetry,
};

