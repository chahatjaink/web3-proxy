const { tryProvider } = require("../providers/tryProvider");

/**
 * Handles POST requests
 */
async function handlePost(req, res) {
  try {
    const response = await tryProvider(req);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in handlePost:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handlePost,
};
