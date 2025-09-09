import { NFC } from "nfc-pcsc";
import fetch from "node-fetch";

const nfc = new NFC();

nfc.on("reader", reader => {
  console.log(`${reader.reader.name} terhubung`);

  reader.on("card", async card => {
    console.log("UID kartu terdeteksi:", card.uid);

    // kirim ke backend online
    try {
      const response = await fetch("https://nfcinnovation-production.up.railway.app/api/tiket/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: card.uid })
      });
      const data = await response.json();
      console.log("Data tiket:", data.tiket);
    } catch (err) {
      console.error("Gagal kirim UID ke backend:", err);
    }
  });

  reader.on("error", err => console.error("Reader error:", err));
  reader.on("end", () => console.log("Reader dilepas"));
});

nfc.on("error", err => console.error("NFC error:", err));
