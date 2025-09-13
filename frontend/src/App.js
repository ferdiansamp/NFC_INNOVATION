import React from "react";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "./Header";
import TiketViewer from "./front_Tiket";



export default function App() {
  const GlobalStyle = createGlobalStyle`
body{
  font-family: Arial, sans-serif;

  background-color: #f4f4f4;
  color: #333;
}
`;

 
 
 const TombolKereta = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 10px;

  button {
    width: 100px;
    height: 50px;
    background-color: #6795faff;
    color: #fff;
    font-size: 20px;
    border: none;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
  }

  button:hover {
    background-color: #4a78d4;
  }
`;

 
  return (
    <>
      <GlobalStyle />
      <div>
        <Header />
  
          <TiketViewer />

     
        <TombolKereta>
          

              <Link to="/kereta">
                <button>MASUK</button>
              </Link>
                 <Link to="/kereta">
                <button>KERETA</button>
              </Link>
        </TombolKereta>
      </div>
    </>
  );
}
