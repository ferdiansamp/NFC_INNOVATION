import { NFC } from "nfc-pcsc";
import fetch from "node-fetch";

export function initNFC(wss) {
  const nfc = new NFC();

  nfc.on("reader", reader => {
    // Matikan autoProcessing supaya gak coba baca ISO-DEP (APDU)
    reader.autoProcessing = false;

    console.log("✅ Reader terhubung:", reader.reader.name);

    reader.on("card", async card => {
      console.log("💳 UID NFC:", card.uid);

      try {
        // Panggil API tiket di Railway
        const response = await fetch("https://nfcinnovation-production.up.railway.app/api/tiket/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: card.uid })
        });

        const data = await response.json();
        console.log("🎟️ Data tiket:", data);

        // Kirim hasilnya ke semua client WebSocket (frontend React)
        wss.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify(data));
          }
        });

      } catch (err) {
        console.error("❌ Gagal ambil data tiket:", err.message);
      }
    });

    reader.on("error", err => console.error("⚠️ Reader error:", err));
    reader.on("end", () => console.log("⚠️ Reader terputus"));
  });

  nfc.on("error", err => {
    console.error("❌ NFC error:", err);
  });
}
