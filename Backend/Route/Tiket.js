import express from "express";
import DB from "./DatabaseConnection.js";

const router = express.Router();

// route untuk menerima UID dari reader
router.post("/scan", (req, res) => {
  const { uid } = req.body;
  console.log("UID NFC diterima:", uid);

  // Ambil 4 tiket pertama + info penumpang terkait
  const sql = `
    SELECT t.Id_Tiket, t.Kode_Pemesanan, t.Kursi,
           p.Id_penumpang, p.nama, p.Tipe_ID, p.No_ID, p.Jenis_Kelamin, p.Kategori
    FROM Tiket t
    JOIN data_penumpang p ON t.Id_penumpang = p.Id_penumpang
    ORDER BY t.Id_Tiket ASC
    LIMIT 4
  `;

  DB.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, uid, tiket: results });
  });
});

export default router;