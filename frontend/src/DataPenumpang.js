import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;

    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }

    th {
      background-color: #6795fa;
      color: #fff;
    }

    tr:nth-child(even) {
      background-color: #f4f4f4;
    }
  }
`;

const DataPenumpang = () => {
  const [penumpang, setPenumpang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://nfcinnovation-production.up.railway.app/api/penumpang/")
      .then(res => {
        if (!res.ok) throw new Error("Gagal mengambil data");
        return res.json();
      })
      .then(data => {
        setPenumpang(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <h2>Data Penumpang</h2>
      <table>
        <thead>
          <tr>
            <th>ID Penumpang</th>
            <th>ID Pelanggan</th>
            <th>Nama</th>
            <th>Tipe ID</th>
            <th>No ID</th>
            <th>Jenis Kelamin</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          {penumpang.map((p) => (
            <tr key={p.Id_penumpang}>
              <td>{p.Id_penumpang}</td>
              <td>{p.Id_pelanggan}</td>
              <td>{p.nama}</td>
              <td>{p.Tipe_ID}</td>
              <td>{p.No_ID}</td>
              <td>{p.Jenis_Kelamin}</td>
              <td>{p.Kategori}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default DataPenumpang;
