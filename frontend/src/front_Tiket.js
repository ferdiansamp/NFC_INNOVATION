import { useEffect, useState } from "react";

function Front_Tiket() {
  const [tiket, setTiket] = useState(null);
  const [mode, setMode] = useState("read");
  const [kodeTiket, setKodeTiket] = useState("");
  const [listTiket, setListTiket] = useState([]);

  // 🔹 Ganti mode (reset state)
  const setFrontendMode = (newMode) => {
    setMode(newMode);
    setTiket(null);
    setKodeTiket("");
  };

  // WebSocket listen UID (untuk read)
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/ws");
    ws.onopen = () => console.log("🔗 WS connected");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 UID diterima dari WebSocket:", data);

        if (data.uid && mode === "read") {
          console.log("🚦 Akan fetch ke backend dengan UID:", data.uid);
          fetch("http://localhost:5000/api/tiket/byUID", {
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
  }, [mode]);

  // Ambil list tiket untuk WRITE
  useEffect(() => {
    if (mode === "write") {
      fetch("http://localhost:5000/api/tiket/list")
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
    if (!kodeTiket) return alert("⚠️ Pilih tiket dulu!");
    const res = await fetch("http://localhost:5000/api/nfc/write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kodeTiket }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>🚄 Sistem Tiket NFC</h1>

      {/* Tombol Mode */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <button
          onClick={() => setFrontendMode("read")}
          disabled={mode === "read"}
          style={{
            marginRight: 10,
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: mode === "read" ? "#aaa" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: mode === "read" ? "default" : "pointer",
          }}
        >
          📖 Read
        </button>

        <button
          onClick={() => setFrontendMode("write")}
          disabled={mode === "write"}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: mode === "write" ? "#aaa" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: mode === "write" ? "default" : "pointer",
          }}
        >
          ✍️ Write
        </button>
      </div>

      {/* Mode WRITE */}
      {mode === "write" && (
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <h2>✍️ Tulis Tiket</h2>
          <select
            value={kodeTiket}
            onChange={(e) => setKodeTiket(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: 15,
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Pilih tiket --</option>
            {listTiket.map((t) => (
              <option key={t.Id_Tiket} value={t.Kode_Pemesanan}>
                {t.Kode_Pemesanan} - {t.Nama_Penumpang}
              </option>
            ))}
          </select>
          <button
            onClick={handleWrite}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#FF5722",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            🚀 Write ke Kartu
          </button>
        </div>
      )}

      {/* Mode READ */}
      {mode === "read" && (
        <div style={{ marginTop: 30, textAlign: "center" }}>
          {tiket && tiket.success ? (
            <>
              <h2>📋 Data Tiket</h2>
              {tiket.tiket.map((row, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    margin: "10px auto",
                    padding: 15,
                    maxWidth: 600,
                    backgroundColor: "#f9f9f9",
                    textAlign: "left",
                  }}
                >
                  <p><strong>Kode:</strong> {row.Kode_Pemesanan}</p>
                  <p><strong>Nama:</strong> {row.Nama_Penumpang}</p>
                  <p><strong>Kereta:</strong> {row.Nama_kereta} ({row.Jenis_kereta})</p>
                  <p><strong>Stasiun:</strong> {row.Stasiun_asal} → {row.Stasiun_tujuan}</p>
                  <p><strong>Jadwal:</strong> {row.Tanggal_Pergi} {row.Jam_berangkat} → {row.Tanggal_Pulang} {row.Jam_tiba}</p>
                  <p><strong>Kursi:</strong> {row.Kursi}</p>
                </div>
              ))}
            </>
          ) : (
            <p style={{ fontSize: "18px", marginTop: 20 }}>🪪 Tap kartu NFC...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Front_Tiket;
