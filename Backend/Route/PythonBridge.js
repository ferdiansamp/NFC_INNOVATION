import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Lokasi python venv (ubah kalau beda)
const pythonPath = path.resolve(__dirname, "../venv/bin/python3");

// 🔹 Lokasi script Python
const scriptPath = path.resolve(__dirname, "../PythonNFC/nfc_service_pcsc.py");

// Helper jalanin Python
function runPython(args = []) {
  return new Promise((resolve) => {
    const py = spawn(pythonPath, [scriptPath, ...args]);
    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.stderr.on("data", (err) => (error += err.toString()));

    py.on("close", () => {
      if (error) {
        console.error("🐍 Python error:", error);
        return resolve({ success: false, error });
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({ success: false, error: "Invalid JSON", raw: data });
      }
    });
  });
}

export async function readCard(req, res) {
  const result = await runPython(["read"]);
  res.json(result);
}

export async function writeCard(req, res) {
  const { kodeTiket } = req.body;
  if (!kodeTiket) return res.status(400).json({ success: false, error: "kodeTiket wajib" });

  const result = await runPython(["write", kodeTiket]);
  res.json(result);
}

export async function readCardRaw() {
  return await runPython(["read"]);
}
