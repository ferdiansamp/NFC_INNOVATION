import express from "express";
import DB from "./DatabaseConnection.js";

const router = express.Router();

// 🔹 Cari tiket by kode pemesanan
router.post("/", (req, res) => {
  const { kodeTiket } = req.body;
  const sql = `
    SELECT t.Id_Tiket, t.Kode_Pemesanan, t.UID_NFC, t.Tanggal_Pergi, t.Tanggal_Pulang, t.Kursi,
           p.Id_penumpang, p.Nama AS Nama_Penumpang, p.Tipe_ID, p.No_ID, p.Jenis_Kelamin, p.Kategori,
           k.Id_kereta, k.Nama_kereta, k.Jenis_kereta, k.Stasiun_asal, k.Stasiun_tujuan, k.Jam_berangkat, k.Jam_tiba
    FROM Tiket t
    JOIN data_penumpang p ON t.Id_penumpang = p.Id_penumpang
    JOIN Kereta k ON t.Id_kereta = k.Id_kereta
    WHERE t.Kode_Pemesanan = ?
    ORDER BY t.Id_Tiket ASC
  `;
  DB.query(sql, [kodeTiket], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.json({ success: false, message: "Tiket tidak ditemukan" });
    res.json({ success: true, tiket: results });
  });
});

// 🔹 Cari tiket by UID NFC
router.post("/byUID", (req, res) => {
  const { uid } = req.body;
    console.log("🔎 Cari tiket dengan UID:", uid);
  const sql = `
    SELECT t.Id_Tiket, t.Kode_Pemesanan, t.UID_NFC, t.Tanggal_Pergi, t.Tanggal_Pulang, t.Kursi,
           p.Id_penumpang, p.Nama AS Nama_Penumpang, p.Tipe_ID, p.No_ID, p.Jenis_Kelamin, p.Kategori,
           k.Id_kereta, k.Nama_kereta, k.Jenis_kereta, k.Stasiun_asal, k.Stasiun_tujuan, k.Jam_berangkat, k.Jam_tiba
    FROM Tiket t
    JOIN data_penumpang p ON t.Id_penumpang = p.Id_penumpang
    JOIN Kereta k ON t.Id_kereta = k.Id_kereta
    WHERE t.UID_NFC = ?
    ORDER BY t.Id_Tiket ASC
  `;
  DB.query(sql, [uid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.json({ success: false, message: "Tiket tidak ditemukan" });
    res.json({ success: true, tiket: results });
  });
});

// 🔹 Map UID ke tiket
router.post("/mapUID", (req, res) => {
  const { kodePemesanan, uid } = req.body;
  if (!kodePemesanan || !uid) return res.status(400).json({ error: "Data kurang" });

  DB.query("UPDATE Tiket SET UID_NFC = ? WHERE Kode_Pemesanan = ?", [uid, kodePemesanan], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "UID berhasil dihubungkan ke tiket" });
  });
});

// 🔹 List tiket
router.get("/list", (req, res) => {
  DB.query(`
    SELECT t.Id_Tiket, t.Kode_Pemesanan, p.Nama AS Nama_Penumpang
    FROM Tiket t
    JOIN data_penumpang p ON t.Id_penumpang = p.Id_penumpang
    ORDER BY t.Id_Tiket DESC
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const seen = new Set();
    const uniqueResults = results.filter(r => {
      if (seen.has(r.Kode_Pemesanan)) return false;
      seen.add(r.Kode_Pemesanan);
      return true;
    });
    res.json(uniqueResults);
  });
});

export default router;
