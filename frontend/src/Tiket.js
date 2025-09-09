import React, { useEffect, useState } from "react";

const TiketViewer = ({ uid }) => {
  const [tiket, setTiket] = useState([]);

  useEffect(() => {
    if (!uid) return;

    fetch("https://nfcinnovation-production.up.railway.app/api/tiket/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    })
      .then(res => res.json())
      .then(data => setTiket(data.tiket))
      .catch(err => console.error(err));
  }, [uid]);

  return (
    <div>
      <h2>Data Tiket & Penumpang</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Id Tiket</th>
            <th>Kode Pemesanan</th>
            <th>Kursi</th>
            <th>Id Penumpang</th>
            <th>Nama</th>
            <th>Tipe_ID</th>
            <th>No_ID</th>
            <th>Jenis Kelamin</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          {tiket.map(t => (
            <tr key={t.Id_Tiket}>
              <td>{t.Id_Tiket}</td>
              <td>{t.Kode_Pemesanan}</td>
              <td>{t.Kursi}</td>
              <td>{t.Id_penumpang}</td>
              <td>{t.nama}</td>
              <td>{t.Tipe_ID}</td>
              <td>{t.No_ID}</td>
              <td>{t.Jenis_Kelamin}</td>
              <td>{t.Kategori}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TiketViewer;
