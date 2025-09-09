import { NFC } from "nfc-pcsc";
import fetch from "node-fetch";

const nfc = new NFC();

nfc.on("reader", reader => {
  console.log(`Reader terdeteksi: ${reader.name}`);

  reader.on("card", async card => {
    console.log("Kartu terbaca, UID:", card.uid);

    // Kirim UID ke backend
    try {
      const res = await fetch("http://localhost:5000/api/penumpang/nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nfc_code: card.uid }),
      });
      const data = await res.json();
      console.log("Data penumpang:", data);
    } catch (err) {
      console.error("Gagal mengirim UID ke backend:", err);
    }
  });

  reader.on("error", err => console.error("Reader error:", err));
  reader.on("end", () => console.log(`Reader ${reader.name} dilepas`));
});

nfc.on("error", err => console.error("NFC error:", err));
