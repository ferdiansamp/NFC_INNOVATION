import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

import "./Route/DatabaseConnection.js";
import penumpangRoutes from "./Route/Penumpang.js";
import pelangganRoutes from "./Route/Pelanggan.js";
import Tiket from "./Route/Tiket.js";
import nfcRouter, { attachWSS, startNfcLoop } from "./Route/NFC.js";

import Path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const frontendBuild = Path.join(__dirname, "../frontend/build");

app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================
app.use("/api/penumpang", penumpangRoutes);
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/tiket", Tiket);
app.use("/api/nfc", nfcRouter);

// =========================
// React build
// =========================
app.use(express.static(frontendBuild));
app.get("*", (req, res) => {
  res.sendFile(Path.join(frontendBuild, "index.html"));
});

// =========================
// Start server
// =========================
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
// NFC Python Loop
// =========================
if (process.env.ENABLE_NFC === "true") {
  console.log("📡 NFC loop aktif (mode READ auto-broadcast)");
  startNfcLoop(); // loop sudah ada di NFC.js
}
