// Backend/Route/TiketProxy.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.all("/*", async (req, res) => {
  try {
    const targetUrl = "https://nfcinnovation-production.up.railway.app/api/tiket" + req.path;
    console.log("🔗 Proxying to:", targetUrl);

    const options = {
      method: req.method,
      headers: {
        ...req.headers,            // forward semua header asli
        host: undefined,           // biar nggak paksa override Host
        origin: undefined,         // jangan paksa origin
      },
    };

    // hanya kirim body kalau bukan GET/HEAD
    if (!["GET", "HEAD"].includes(req.method)) {
      options.body = JSON.stringify(req.body);
      options.headers["Content-Type"] = "application/json";
    }

    const response = await fetch(targetUrl, options);

    const text = await response.text();
    console.log("📥 Response dari Railway:", text);

    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch {
      res.status(response.status).send(text);
    }
  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
