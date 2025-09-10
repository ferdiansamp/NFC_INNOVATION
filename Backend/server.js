import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

import "./Route/DatabaseConnection.js";
import penumpangRoutes from "./Route/Penumpang.js";
import pelangganRoutes from "./Route/Pelanggan.js";
import Tiket from "./Route/Tiket.js";


import Path from "path";
import { fileURLToPath } from "url";

// __dirname workaround in ESM
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const frontendBuild = Path.join(__dirname, "../frontend/build");

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/penumpang", penumpangRoutes);
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/tiket", Tiket);

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

// WebSocket tanpa NFC
export const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  if (request.url === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

if (process.env.ENABLE_NFC === "true") {
  const { initNFC } = await import("./reader/NFC.js");
  initNFC(wss);
}
