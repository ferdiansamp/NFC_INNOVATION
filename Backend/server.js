import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

import "./Route/DatabaseConnection.js";
import penumpangRoutes from "./Route/Penumpang.js";
import pelangganRoutes from "./Route/Pelanggan.js";
import Tiket from "./Route/Tiket.js";
import nfcRouter, { attachWSS } from "./Route/NFC.js";

import Path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const frontendBuild = Path.join(__dirname, "../frontend/build");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/penumpang", penumpangRoutes);
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/tiket", Tiket);
app.use("/api/nfc", nfcRouter);

// React build
app.use(express.static(frontendBuild));
app.get("*", (req, res) => {
  res.sendFile(Path.join(frontendBuild, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});

// =========================
// WebSocket NFC Integration
// =========================
const wss = new WebSocketServer({ server, path: "/ws" });
attachWSS(wss);

wss.on("connection", (ws) => {
  console.log("🔗 Client WebSocket terhubung");
  ws.on("close", () => console.log("❌ Client WebSocket terputus"));
});

// =========================
// NFC Python Loop (READ ONLY)
// =========================
if (process.env.ENABLE_NFC === "true") {
  console.log("📡 NFC mode aktif: READ loop dijalankan");

  setInterval(() => {
    if (global.NFC_MODE === "write") return; // jangan ganggu mode write

    const py = spawn("python3", ["Backend/reader/nfc_service.py", "read"]);
    let data = "";
    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.on("close", () => {
      try {
        const json = JSON.parse(data);
        wss.clients.forEach((client) => {
          if (client.readyState === 1) client.send(JSON.stringify(json));
        });
      } catch (err) {
        console.error("⚠️ Gagal parse output Python:", err);
      }
    });
  }, 3000); // polling tiap 3 detik
}
