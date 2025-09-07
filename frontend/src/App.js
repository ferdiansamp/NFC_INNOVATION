import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "./Header";
import DataPelanggan from "./DataPelanggan";
import DataPenumpang from "./DataPenumpang";



export default function App() {
  const GlobalStyle = createGlobalStyle`
body{
  font-family: Arial, sans-serif;

  background-color: #f4f4f4;
  color: #333;
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

 
  return (
    <>
      <GlobalStyle />
      <div>
        <Header />
        <DataPenumpang />

        <DataPelanggan />
        <TombolKereta>

              <Link to="/kereta">
                <button>KERETA</button>
              </Link>
                 <Link to="/kereta">
                <button>KERETA</button>
              </Link>
        </TombolKereta>
      </div>
    </>
  );
}
