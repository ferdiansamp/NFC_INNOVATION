import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import "./Route/DatabaseConnection.js";
import express from "express";
import penumpangRoutes from "./Route/Penumpang.js";
import pelangganRoutes from "./Route/Pelanggan.js";
import Tiket from "./Route/Tiket.js";
import { initNFC } from "./Route/NFC.js";
import { WebSocketServer } from "ws";

import Path from "path";
import { fileURLToPath } from "url";

// __dirname workaround in ESM
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const frontendBuild = Path.join(__dirname, "../frontend/build");

app.use(cors());
app.use(express.json());

app.use("/api/penumpang", penumpangRoutes);
app.use("/api", pelangganRoutes);
app.use("/api/tiket", Tiket);


app.use(express.static(frontendBuild));
app.get("*", (req, res) => {
  console.log("Serving React app for path:", req.url); // bisa lihat URL yang diakses
  res.sendFile(Path.join(frontendBuild, "index.html"));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});



const wss = new WebSocketServer({ server });
initNFC(wss);
wss.on("connection", (ws) => {
  console.log("🔗 Client WebSocket terhubung");
  ws.on("close", () => console.log("❌ Client WebSocket terputus"));
});
wss.on("error", (err) => {
  console.error("⚠️ WebSocket error:", err);  })