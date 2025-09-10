import { useEffect, useState } from "react";

function Front_Tiket() {
  const [tiket, setTiket] = useState(null);

  useEffect(() => {
    // Koneksi ke backend WebSocket (ubah host/port sesuai server-mu)
    const ws = new WebSocket(
      process.env.NODE_ENV === "production"
        ? "wss://nfcinnovation-production.up.railway.app"
        : "ws://localhost:5000"
    );

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🚄 Sistem Tiket NFC</h1>

      {tiket ? (
        <div>
          <h2>Data Tiket</h2>
          {tiket.tiket.map((row, i) => (
            <div
              key={i}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <p>
                <strong>Kode Pemesanan:</strong> {row.Kode_Pemesanan}
              </p>
              <p>
                <strong>Nama Penumpang:</strong> {row.Nama_Penumpang}
              </p>
              <p>
                <strong>Kereta:</strong> {row.Nama_kereta} ({row.Jenis_kereta})
              </p>
              <p>
                <strong>Stasiun:</strong> {row.Stasiun_asal} →{" "}
                {row.Stasiun_tujuan}
              </p>
              <p>
                <strong>Jadwal Pergi:</strong> {row.Tanggal_Pergi} |{" "}
                {row.Jam_berangkat}
              </p>
              <p>
                <strong>Jadwal Tiba:</strong> {row.Tanggal_Pulang} |{" "}
                {row.Jam_tiba}
              </p>
              <p>
                <strong>Kursi:</strong> {row.Kursi}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>🪪 Tap kartu NFC untuk lihat data tiket...</p>
      )}
    </div>
  );
}

export default Front_Tiket;
