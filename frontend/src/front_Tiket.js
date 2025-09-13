import { useEffect, useState } from "react";

function Front_Tiket() {
  const [tiket, setTiket] = useState(null);
  const [mode, setMode] = useState("read");
  const [kodeTiket, setKodeTiket] = useState("");
  const [listTiket, setListTiket] = useState([]);

  // 🔹 Fetch list tiket untuk dropdown (saat mode WRITE)
  useEffect(() => {
    if (mode === "write") {
      fetch("https://nfcinnovation-production.up.railway.app/api/tiket/list")
        .then(res => res.json())
        .then(data => setListTiket(data))
        .catch(err => console.error("⚠️ Gagal ambil list tiket:", err));
    }
  }, [mode]);

  // 🔹 WebSocket untuk mode READ
  useEffect(() => {
    if (mode !== "read") return;

    const ws = new WebSocket("ws://localhost:5000/ws");

    ws.onopen = () => console.log("🔗 Terhubung ke WebSocket (READ)");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Data tiket (WS):", data);
        setTiket(data);
      } catch (err) {
        console.error("⚠️ Gagal parse WS:", err.message);
      }
    };
    ws.onclose = () => console.log("❌ WS terputus");
    ws.onerror = (err) => console.error("⚠️ WS error:", err);

    return () => ws.close();
  }, [mode]);

  // 🔹 Handle Write (kasir tulis tiket ke kartu NFC)
  const handleWrite = async () => {
    if (!kodeTiket) return alert("Pilih tiket dulu!");

    try {
      // 1. Fetch tiket dari Railway berdasarkan kode
      const resRailway = await fetch(
        "https://nfcinnovation-production.up.railway.app/api/tiket/getById",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kodeTiket }), // konsisten pakai kode pemesanan
        }
      );
      const dataRailway = await resRailway.json();

      if (!dataRailway.success) {
        alert("❌ Tiket tidak ditemukan di DB");
        return;
      }

      const kodePemesanan = dataRailway.tiket.Kode_Pemesanan;

      // 2. Kirim ke local NFC server untuk ditulis
      const resNFC = await fetch("http://localhost:5000/nfc/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kodeTiket: kodePemesanan }),
      });
      const dataNFC = await resNFC.json();

      alert(
        dataNFC.success
          ? `✅ Tiket ${kodePemesanan} ditulis ke kartu`
          : "❌ " + dataNFC.error
      );
    } catch (err) {
      alert("❌ Gagal connect ke server NFC / Railway");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>🚄 Sistem Tiket NFC</h1>

      {/* Tombol mode */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setMode("read")}
          disabled={mode === "read"}
          style={{ marginRight: 10 }}
        >
          📖 Mode Read
        </button>
        <button
          onClick={() => setMode("write")}
          disabled={mode === "write"}
        >
          ✍️ Mode Write
        </button>
        <p>🔔 Sekarang mode: <strong>{mode.toUpperCase()}</strong></p>
      </div>

      {/* Panel Mode Write */}
      {mode === "write" && (
        <div style={{ marginBottom: 20 }}>
          <h2>✍️ Tulis Tiket ke NFC</h2>
          <select
            value={kodeTiket}
            onChange={(e) => setKodeTiket(e.target.value)}
            style={{ marginRight: 10 }}
          >
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

      {/* Panel Mode Read */}
      {mode === "read" && (
        tiket && tiket.success ? (
          <div>
            <h2>Data Tiket</h2>
            {tiket.tiket.map((row, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 20,
                  padding: 15,
                  border: "1px solid #ccc",
                  borderRadius: 10,
                  backgroundColor: "#fff",
                }}
              >
                <p><strong>Kode Pemesanan:</strong> {row.Kode_Pemesanan}</p>
                <p><strong>Nama Penumpang:</strong> {row.Nama_Penumpang}</p>
                <p><strong>Kereta:</strong> {row.Nama_kereta} ({row.Jenis_kereta})</p>
                <p><strong>Stasiun:</strong> {row.Stasiun_asal} → {row.Stasiun_tujuan}</p>
                <p><strong>Jadwal Pergi:</strong> {row.Tanggal_Pergi} | {row.Jam_berangkat}</p>
                <p><strong>Jadwal Tiba:</strong> {row.Tanggal_Pulang} | {row.Jam_tiba}</p>
                <p><strong>Kursi:</strong> {row.Kursi}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>🪪 Tap kartu NFC untuk lihat data tiket...</p>
        )
      )}
    </div>
  );
}

export default Front_Tiket;
