import { put, list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await list({ prefix: "achievers-show/state.json", limit: 1 });
      if (!result.blobs.length) return res.status(200).json(null);
      const response = await fetch(result.blobs[0].url, { cache: "no-store" });
      return res.status(200).json(await response.json());
    }
    if (req.method === "POST") {
      const blob = await put("achievers-show/state.json", JSON.stringify(req.body), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json"
      });
      return res.status(200).json({ ok: true, url: blob.url });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
