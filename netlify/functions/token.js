const API_KEY = process.env.HEYGEN_API_KEY;

exports.handler = async () => {
  const res = await fetch("https://api.heygen.com/v1/streaming.create_token", {
    method: "POST",
    headers: { "x-api-key": API_KEY }
  });
  const json = await res.json();
  return {
    statusCode: 200,
    body: json.token ? JSON.stringify({ token: json.token }) : JSON.stringify({ error: "Token generation failed" })
  };
};