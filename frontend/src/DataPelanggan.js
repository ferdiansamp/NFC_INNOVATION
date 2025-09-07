import React, { useEffect, useState } from "react";

const DataPelanggan = () => {
  const [pelanggan, setPelanggan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetch("https://nfcinnovation-production.up.railway.app/api/pelanggan/")
    .then(res => {
      console.log("status:", res.status);
      return res.json();
    })
    .then(data => {
      console.log(data);
      setPelanggan(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });
}, []);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Daftar Pelanggan</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>No HP</th>
            <th>Email</th>
            <th>Tipe ID</th>
            <th>No ID</th>
            <th>Jenis Kelamin</th>
            <th>Tanggal Lahir</th>
            <th>Alamat</th>
            <th>Kota/Kab</th>
            <th>Hobi</th>
            <th>Pekerjaan</th>
          </tr>
        </thead>
        <tbody>
          {pelanggan.map((p) => (
            <tr key={p.Id_pelanggan}>
              <td>{p.Id_pelanggan}</td>
              <td>{p.nama}</td>
              <td>{p.no_hp}</td>
              <td>{p.Email}</td>
              <td>{p.Tipe_ID}</td>
              <td>{p.No_ID}</td>
              <td>{p.Jenis_Kelamin}</td>
              <td>{p.Tanggal_Lahir}</td>
              <td>{p.Alamat}</td>
              <td>{p.Kota_Kabupaten}</td>
              <td>{p.Hobi}</td>
              <td>{p.Pekerjaan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPelanggan;
