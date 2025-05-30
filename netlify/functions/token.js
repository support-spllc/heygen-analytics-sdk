exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only POST allowed" })
    };
  }

  const apiKey = process.env.HEYGEN_API_KEY;

  const result = await fetch("https://api.heygen.com/v1/streaming.create_token", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    }
  });

  const json = await result.json();

  if (!json || !json.data || !json.data.token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Token fetch failed", details: json })
    };
  }

  // Decode base64 token to get actual token
  const decoded = Buffer.from(json.data.token, "base64").toString("utf-8");
  const parsed = JSON.parse(decoded);

  return {
    statusCode: 200,
    body: JSON.stringify({ token: parsed.token })
  };
};