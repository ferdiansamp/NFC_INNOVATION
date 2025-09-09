import { useEffect, useState } from "react";

function App() {
  const [tiket, setTiket] = useState(null);

  useEffect(() => {
    // Koneksi ke backend websocket (ubah port sesuai backend server.js)
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("🔗 Terhubung ke WebSocket backend");
    };

    ws.onmessage = (event) => {
      console.log("📩 Data tiket diterima:", event.data);
      const data = JSON.parse(event.data);
      setTiket(data);
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket terputus");
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚄 Sistem Tiket NFC</h1>
      {tiket ? (
        <div>
          <h2>Data Tiket</h2>
          {tiket.tiket.map((row, i) => (
            <div
              key={i}
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ccc",
              }}
            >
              <p>
                <strong>Kode Pemesanan:</strong> {row.Kode_Pemesanan}
              </p>
              <p>
                <strong>Nama Penumpang:</strong> {row.nama}
              </p>
              <p>
                <strong>Kereta:</strong> {row.Nama_kereta} ({row.Jenis_kereta})
              </p>
              <p>
                <strong>Stasiun:</strong> {row.Stasiun_asal} →{" "}
                {row.Stasiun_tujuan}
              </p>
              <p>
                <strong>Jadwal:</strong> {row.Tanggal_Pergi} {row.Jam_berangkat}
              </p>
              <p>
                <strong>Kursi:</strong> {row.Kursi}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Tap kartu NFC untuk lihat data tiket...</p>
      )}
    </div>
  );
}

export default App;
