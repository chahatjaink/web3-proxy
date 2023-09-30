/**
 * Handles OPTIONS requests
 * Borrowed from
 * https://developers.cloudflare.com/workers/examples/cors-header-proxy
 */
async function handleOptions(request, response) {
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400", // 1 day,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      "Access-Control-Allow-Headers": request.headers.get(
        "Access-Control-Request-Headers"
      ),
    };

    response.writeHead(204, respHeaders);
    response.end();
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    response.setHeader("Allow", "GET, HEAD, POST, OPTIONS");
    response.writeHead(200);
    response.end();
  }
}

module.exports = {
  handleOptions,
};
