const fetch = require("node-fetch");

exports.handler = async function () {
  const apiKey = process.env.HEYGEN_API_KEY;

  const response = await fetch("https://api.heygen.com/v1/streaming.create_token", {
    method: "POST",
    headers: {
      "x-api-key": apiKey
    }
  });

  const data = await response.json();

  if (!response.ok || !data?.data?.token) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Token fetch failed",
        details: data
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ token: data.data.token })
  };
};