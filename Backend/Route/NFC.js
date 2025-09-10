import { NFC } from "nfc-pcsc";
import fetch from "node-fetch";

export function initNFC(wss) {
  const nfc = new NFC();

  nfc.on("reader", reader => {
    reader.autoProcessing = false; // tetap false biar gak error ISO-DEP
    console.log("✅ Reader terhubung:", reader.reader.name);

    reader.on("card", async card => {
      try {
        // ambil UID manual dengan transmit()
        const getUidCmd = Buffer.from([0xFF, 0xCA, 0x00, 0x00, 0x00]);
        const uidResponse = await reader.transmit(getUidCmd, 40); // max 40 bytes
        const uid = uidResponse.toString("hex").toUpperCase();

        console.log("💳 UID NFC:", uid);

        // panggil API tiket
        const response = await fetch("https://nfcinnovation-production.up.railway.app/api/tiket/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid })
        });

        const data = await response.json();
        console.log("🎟️ Data tiket:", data);

        // kirim ke frontend via websocket
        wss.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify(data));
          }
        });

      } catch (err) {
        console.error("❌ Gagal baca UID:", err.message);
      }
    });

    reader.on("error", err => console.error("⚠️ Reader error:", err));
    reader.on("end", () => console.log("⚠️ Reader terputus"));
  });

  nfc.on("error", err => {
    console.error("❌ NFC error:", err);
  });
}
