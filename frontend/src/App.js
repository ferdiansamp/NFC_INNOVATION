import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "./Header";

// import Test from './Test';

export default function App() {
  const GlobalStyle = createGlobalStyle`
body{
  font-family: Arial, sans-serif;

  background-color: #f4f4f4;
  color: #333;
}
`;

 
  const DataPenumpang = styled.div`
    .coba {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 30px;
    }
  `;
  const TombolKereta = styled.div`
    position: absolute;
    bottom: 10%;
    right: 10%;

    button {
      width: 100px;
      height: 50px;
      background-color: #6795faff;
      color: #fff;
      font-size: 20px;
      border: none;
      font-weight: bold;
    }
  `;

  const [penumpang] = useState([
    {
      nama: "BUDI UMAR PRAKOSO WIJAYA BANGUN",
      umur: 25,
      kelas: "Eksekutif",
      kursi: "A1",
    },
    { nama: "Ani", umur: 30, kelas: "Bisnis", kursi: "B2" },
    { nama: "Candra", umur: 28, kelas: "Ekonomi", kursi: "C3" },
    { nama: "Dewi", umur: 32, kelas: "Ekonomi", kursi: "D4" },
  ]);

  return (
    <>
      <GlobalStyle />
      <div>
        <Header />

        <DataPenumpang>
          <div className="coba">
            <h3>DATA PENUMPANG</h3>
            {penumpang.length > 0 ? (
              <div>
                {penumpang.map((p, i) => (
                  <p key={i}>
                    {p.nama} | Umur: {p.umur} | Kelas: {p.kelas} | Kursi:{" "}
                    {p.kursi}
                  </p>
                ))}
              </div>
            ) : (
              <p>DATA MASIH KOSONG</p>
            )}
          </div>
        </DataPenumpang>
        <TombolKereta>

          
              <Link to="/kereta">
                <button>KERETA</button>
              </Link>
         
          
        </TombolKereta>
      </div>
    </>
  );
}
