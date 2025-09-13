import { useEffect, useState } from "react";

function Front_Tiket() {
  const [tiket, setTiket] = useState(null);
  const [mode, setMode] = useState("read");
  const [kodeTiket, setKodeTiket] = useState("");
  const [listTiket, setListTiket] = useState([]);

  // WebSocket listen UID
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/ws");
    ws.onopen = () => console.log("🔗 WS connected");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 UID diterima dari WebSocket:", data);

        if (data.uid) {
          console.log("🚦 Akan fetch ke Railway dengan UID:", data.uid);
          fetch("https://nfcinnovation-production.up.railway.app/api/tiket/byUID", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: data.uid }),
          })
            .then((res) => res.json())
            .then(setTiket)
            .catch(console.error);
        }
      } catch (e) {
        console.error("⚠️ WS parse error:", e);
      }
    };
    return () => ws.close();
  }, []);

  // Fetch list tiket untuk WRITE
  useEffect(() => {
    if (mode === "write") {
      fetch("https://nfcinnovation-production.up.railway.app/api/tiket/list")
        .then((res) => res.json())
        .then((data) => {
          console.log("📋 List tiket:", data);
          if (Array.isArray(data)) {
            setListTiket(data);
          } else {
            setListTiket([]);
          }
        })
        .catch(console.error);
    }
  }, [mode]);

  const handleWrite = async () => {
    if (!kodeTiket) return alert("Pilih tiket dulu!");
    const res = await fetch("http://localhost:5000/api/nfc/write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kodeTiket }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🚄 Sistem Tiket NFC</h1>
      <div>
        <button onClick={() => setMode("read")} disabled={mode === "read"}>
          📖 Read
        </button>
        <button onClick={() => setMode("write")} disabled={mode === "write"}>
          ✍️ Write
        </button>
      </div>

      {mode === "write" && (
        <div>
          <h2>✍️ Tulis Tiket</h2>
          <select value={kodeTiket} onChange={(e) => setKodeTiket(e.target.value)}>
            <option value="">-- Pilih tiket --</option>
            {listTiket.map((t) => (
              <option key={t.Id_Tiket} value={t.Kode_Pemesanan}>
                {t.Kode_Pemesanan} - {t.Nama_Penumpang}
              </option>
            ))}
          </select>
          <button onClick={handleWrite}>🚀 Write</button>
        </div>
      )}

      {mode === "read" &&
        (tiket && tiket.success ? (
          <div>
            <h2>Data Tiket</h2>
            {tiket.tiket.map((row, i) => (
              <div key={i} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
                <p><strong>Kode:</strong> {row.Kode_Pemesanan}</p>
                <p><strong>Nama:</strong> {row.Nama_Penumpang}</p>
                <p><strong>Kereta:</strong> {row.Nama_kereta} ({row.Jenis_kereta})</p>
                <p><strong>Stasiun:</strong> {row.Stasiun_asal} → {row.Stasiun_tujuan}</p>
                <p><strong>Jadwal:</strong> {row.Tanggal_Pergi} {row.Jam_berangkat} → {row.Tanggal_Pulang} {row.Jam_tiba}</p>
                <p><strong>Kursi:</strong> {row.Kursi}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>🪪 Tap kartu NFC...</p>
        ))}
    </div>
  );
}

export default Front_Tiket;
