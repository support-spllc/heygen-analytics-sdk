import { Buffer } from "buffer"; // Only needed if not supported natively

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
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
    return res.status(500).json({ error: "Token fetch failed", details: json });
  }

  // decode base64
  const decoded = Buffer.from(json.data.token, "base64").toString("utf8");
  const parsed = JSON.parse(decoded);

  return res.status(200).json({ token: parsed.token });
};