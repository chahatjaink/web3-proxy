// healthCheck.js
const axios = require("axios");

async function performHealthCheck() {
    try {
        const postData = {
            jsonrpc: "2.0",
            method: "eth_getBlockByNumber",
            params: ["0x7c59125", true],
            id: 0,
        };

        const response = await axios.post("http://localhost:3001", postData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("POST request succeeded.");
        return response.data;
    } catch (error) {
        console.error(`Request error: ${error.message}`);
        throw new Error("POST request failed.");
    }
}

module.exports = {
    performHealthCheck,
};
