import express from "express";
import DB from "./DatabaseConnection.js";

const router = express.Router();

router.post("/scan", (req, res) => {
  const { uid } = req.body;
  console.log("UID NFC diterima:", uid);

  const sql = `
    SELECT t.Id_Tiket, t.Kode_Pemesanan, t.Kursi,
           p.Id_penumpang, p.nama, p.Tipe_ID, p.No_ID, p.Jenis_Kelamin, p.Kategori,
           k.Nama_kereta, k.Jenis_kereta, k.Stasiun_asal, k.Stasiun_tujuan,
           k.Jam_berangkat, k.Jam_tiba
    FROM Tiket t
    JOIN data_penumpang p ON t.Id_penumpang = p.Id_penumpang
    JOIN kereta k ON t.Id_kereta = k.Id_kereta
    ORDER BY t.Id_Tiket ASC
    LIMIT 4
  `;

  DB.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, uid, tiket: results });
  });
});

export default router;
