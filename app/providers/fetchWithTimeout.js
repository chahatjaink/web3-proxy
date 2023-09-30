const prometheus = require("prom-client");
const axiosInstance = require("../utils/axiosInstance");
const { RATE_LIMITED_PROVIDERS } = require("../utils/config");
const { PROVIDERS } = require("../utils/providerConfig");
const { trace, metrics } = require("@opentelemetry/api");

const tracer = trace.getTracer("fetchWithTimeout", "0.1.0");
const meter = metrics.getMeter("fetchWithTimeout");

const counter = meter.createCounter("failed_count");
const { failed_count } = require("../utils/failedCountMetric");
// const failed_count = prometheus.register.getSingleMetric('failed_count');
// Create a metric to track custom application metrics
console.log("🚀 ~ file: fetchWithTimeout.js:12 ~ failed_count:", failed_count);

/**
 * Wrapper around fetch with an optional timeout
 * @param {URL} url
 * @param {Request} request
 * @param {number} timeout
 * @param {number} index
 * @param {object} proxy
*/
async function fetchWithTimeout(url, request, timeout, index, proxy) {
  // eslint-disable-next-line complexity
  return tracer.startActiveSpan(`${url.href}`, async (span) => {
    try {
      const response = proxy
        ? await postWithProxy(url, request.body, proxy, timeout)
        : await postWithoutProxy(url, request.body, timeout);

      if (response.data.error) {
        PROVIDERS[index].failedCount++;
        console.error(response.data.error.message);
        failed_count.set({ provider: url.href }, PROVIDERS[index].failedCount);
        throw new Error(response.data.error.message);
      }

      span.setStatus({ code: response.status, message: "Success" });
      span.end();
      return response;
    } catch (error) {
      if (span) {
        span.recordException(error.message);
        counter.add(1, { provider: url.href });
        span.setStatus({ code: error?.response?.status });

        if (error?.response?.status === 429) {
          handleRateLimit(error, url);
          console.error(`Rate limit hit on provider ${PROVIDERS[index].url}`);
          span.end();
          throw new Error(`Rate limit hit on provider ${PROVIDERS[index].url}`);
        } else {
          // If request times out or any other error
          PROVIDERS[index].failedCount++;
          failed_count.set({ provider: url.href }, PROVIDERS[index].failedCount);
          console.error(`${error.message} failed for ${PROVIDERS[index].url}`);
          prometheus.register.registerMetric(failed_count);
          span.end();
          throw error.message;
        }
      } else {
        // Handle cases where the span is not available
        console.error(`Error: ${error.message}`);
        throw error;
      }
    }
  });
}

async function postWithoutProxy(url, requestBody, timeout) {
  const response = await axiosInstance.post(url, requestBody, {
    headers: {
      "Content-Type": "application/json",
    },
    timeout,
  });

  return response;
}

async function postWithProxy(url, requestBody, proxy, timeout) {
  const response = await axiosInstance({
    method: "post",
    url,
    data: requestBody,
    proxy: {
      host: proxy.host,
      port: proxy.port,
    },
    headers: {
      "Content-Type": "application/json",
    },
    timeout,
  });

  return response;
}

const findProviderIndexByUrl = (providers, url) => {
  return providers.findIndex(provider => provider.url === url);
};

const updateRateLimitedProvider = (providers, url, retryAfter) => {
  const providerIndex = findProviderIndexByUrl(providers, url);
  const expirationTimeMs = Date.now() + retryAfter;
  if (providerIndex !== -1) {
    providers[providerIndex].retryAfter = expirationTimeMs;
  } else {
    providers.push({ url, expirationTimeMs });
  }
};

function handleRateLimit(error, url) {
  if (error?.response?.headers && error?.response?.headers?.["retry-after"]) {
    const retryAfter = parseInt(error.response.headers["retry-after"]);
    updateRateLimitedProvider(RATE_LIMITED_PROVIDERS, url.href, retryAfter);
  } else {
    updateRateLimitedProvider(RATE_LIMITED_PROVIDERS, url.href, 5000);
  }

  // Sort the RATE_LIMITED_PROVIDERS array based on retryAfter
  RATE_LIMITED_PROVIDERS.sort((a, b) => a.retryAfter - b.retryAfter);
}

module.exports = {
  fetchWithTimeout,
};
