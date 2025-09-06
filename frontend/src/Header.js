import React from "react";
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
  return (
    <HeaderWrapper>
      <Judul>KAI ACCESS</Judul>
      <p>KERETA : SAWUNGGALIH</p>
      <p>JADWAL KEBERANGKATAN : 19.00</p>
      <p>STASIUN : LOKAJA</p>
    </HeaderWrapper>
  );
}
