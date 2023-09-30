const { testProviderWithRetry } = require("./testProviderWithRetry");
const ProxyList = require("free-proxy");
const proxyList = new ProxyList();
const { PROVIDERS } = require("../utils/providerConfig");
const { RATE_LIMITED_PROVIDERS } = require("../utils/config");

/**
 * Try a provider or retry with a proxy if needed
 * @param {Request} request
 */
async function tryProvider(request) {
  let data =
    (await tryPrimaryProvider(request, PROVIDERS)) ||
    (await tryRateLimitedProviders(request)) ||
    (await retryRateLimitedProviders(request));

  if (!data) {
    throw new Error("All providers failed");
  }

  return data;
}

async function tryPrimaryProvider(request, providersArray) {
  try {
    return await testProviderWithRetry(request, providersArray, null);
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function tryRateLimitedProviders(request) {
  if (RATE_LIMITED_PROVIDERS.length === 0) {
    return null;
  }

  const PROXY_LIST = await getProxyList();
  const promises = PROXY_LIST.map((proxy) => {
    tryProviderWithProxy(request, proxy);
  });
  const data = await Promise.any(promises);
  if (data && data.status === 200) {
    return data;
  }

  return retryRateLimitedProviders(request);
}

async function getProxyList() {
  const proxies = [];
  for (let i = 0; i < 3; i++) {
    proxies.push(await proxyList.randomFromCache());
  }
  return proxies;
}

async function tryProviderWithProxy(request, proxy) {
  try {
    return await testProviderWithRetry(request, RATE_LIMITED_PROVIDERS, proxy);
  } catch (error) {
    console.error(`Failed to make a request through proxy ${proxy.url} : ${error}`);
    return null;
  }
}

async function retryRateLimitedProviders(request) {
  if (RATE_LIMITED_PROVIDERS.length === 0) {
    return null;
  }

  const retryProvider = RATE_LIMITED_PROVIDERS.filter((provider) => {
    return provider.retryAfter <= Date.now();
  });

  if (retryProvider.length == 0)
    console.error("All rate limited providers are still rate limited, retrying failed");
  
  return tryPrimaryProvider(request, retryProvider);
}

module.exports = {
  tryProvider,
};
