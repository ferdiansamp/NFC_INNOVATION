import dotenv from "dotenv";
dotenv.config();
import  "./Route/DatabaseConnection.js";
import express from "express";
const app = express();


import Path from "path";
import { fileURLToPath } from "url";

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const frontendBuild = Path.join(__dirname, "../frontend/build");

app.use(express.json());
app.use(express.static(frontendBuild));
app.use((req, res, next) => {
  res.sendFile(Path.join(frontendBuild, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
