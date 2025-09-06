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

app.use(express.json());
app.use(express.static(Path.join(__dirname, "frontend", "build")));

app.get("/", (req, res) => {
  res.sendFile(Path.join(__dirname, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
