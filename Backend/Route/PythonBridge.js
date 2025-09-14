import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// interpreter python venv (absolute)
const pythonPath = "/home/hawkcan/NFC_INNOVATION/Backend/venv/bin/python3";

// script path (relative dari Backend/Route → naik 1 folder ke Backend)
const scriptPath = path.resolve(__dirname, "../PythonNFC/nfc_service_pcsc.py");

function runPython(mode, args = []) {
  return new Promise((resolve, reject) => {
    const py = spawn(pythonPath, [scriptPath, mode, ...args]);
    let data = "";

    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.stderr.on("data", (err) =>
      console.error("🐍 Python error:", err.toString())
    );
    py.on("close", () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error("Parse gagal: " + data));
      }
    });
  });
}

export async function readCard(req, res) {
  try {
    const result = await runPython("read");
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function writeCard(req, res) {
  const { kodeTiket } = req.body;
  if (!kodeTiket) return res.status(400).json({ success: false, error: "kodeTiket wajib diisi" });

  try {
    const result = await runPython("write", [kodeTiket]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


export async function readCardRaw() {
  try {
    return await runPython("read");
  } catch (err) {
    return { success: false, error: err.message };
  }
}
