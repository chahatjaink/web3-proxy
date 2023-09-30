/**
 * Handles GET requests
 */
async function handleGet(req, res) {
  res.statusCode = 400;
  res.send({
    error: "Invalid request parameters"
  });
}

module.exports = {
  handleGet,
};
