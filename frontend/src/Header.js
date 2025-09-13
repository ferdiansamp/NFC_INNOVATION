import React, { useEffect, useState } from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  background-color: #0033a0;
  padding: 15px;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const Judul = styled.header`
  font-size: 30px;
  font-weight: bold;
`;

export default function Header() {
  const [tiket, setTiket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(

         "ws://localhost:5000/ws"
    );

    ws.onopen = () => console.log("🔗 Header terhubung ke WebSocket");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTiket(data.tiket?.[0]); // ambil tiket pertama (atau bisa loop kalau mau banyak)
      } catch (err) {
        console.error("⚠️ Gagal parse data header:", err.message);
      }
    };
    ws.onclose = () => console.log("❌ WS header terputus");
    return () => ws.close();
  }, []);

  return (
    <HeaderWrapper>
      <Judul>KAI ACCESS</Judul>
      <p>
        <strong>Kode Pemesanan:</strong>{" "}
        {tiket ? tiket.Kode_Pemesanan : "-"}
      </p>
      <p>
        <strong>Kereta:</strong>{" "}
        {tiket ? `${tiket.Nama_kereta} (${tiket.Jenis_kereta})` : "-"}
      </p>
      <p>
        <strong>Stasiun:</strong>{" "}
        {tiket ? `${tiket.Stasiun_asal} → ${tiket.Stasiun_tujuan}` : "-"}
      </p>
    </HeaderWrapper>
  );
}
