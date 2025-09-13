import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.all("/*", async (req, res) => {
  try {
    const url = "https://nfcinnovation-production.up.railway.app/api/tiket" + req.path;
    const response = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "GET" ? null : JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
