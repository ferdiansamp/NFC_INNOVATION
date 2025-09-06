import React from "react";
import { Link } from "react-router-dom";

export default function Kereta() {
  return (
    <div>
      <h2>Detail Kereta</h2>
      <p>Isi detail kereta dari database nanti tampil di sini.</p>
      <Link to="/">
        <button>Kembali</button>
      </Link>
    </div>
  );
}
