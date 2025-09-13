import express from "express";
import DB from "./DatabaseConnection.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { kodeTiket } = req.body;
  console.log("Kode tiket diterima:", kodeTiket);

  const sql = `
    SELECT 
      t.Id_Tiket,
      t.Kode_Pemesanan,
      t.Tanggal_Pergi,
      t.Tanggal_Pulang,
      t.Kursi,

      p.Id_penumpang,
      p.nama AS Nama_Penumpang,
      p.Tipe_ID,
      p.No_ID,
      p.Jenis_Kelamin,
      p.Kategori,

      k.Id_kereta,
      k.Nama_kereta,
      k.Jenis_kereta,
      k.Stasiun_asal,
      k.Stasiun_tujuan,
      k.Jam_berangkat,
      k.Jam_tiba
    FROM Tiket t
    JOIN data_penumpang p ON t.Id_penumpang = p.Id_penumpang
    JOIN Kereta k ON t.Id_kereta = k.Id_kereta
    WHERE t.Kode_Pemesanan = ?
    ORDER BY t.Id_Tiket ASC
  `;

  DB.query(sql, [kodeTiket], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.json({ success: false, message: "Tiket tidak ditemukan" });
    }

    res.json({
      success: true,
      tiket: results, // bisa lebih dari 1
    });
  });
});


// ambil tiket by Id_Tiket
router.post("/getById", (req, res) => {
  const { kodeTiket } = req.body;

  const sql = `
    SELECT 
      t.Kode_Pemesanan
    FROM Tiket t
    WHERE t.Kode_Pemesanan = ?
    LIMIT 1
  `;

  DB.query(sql, [kodeTiket], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.json({ success: false, message: "Tiket tidak ditemukan" });

    res.json({ success: true, tiket: results[0] });
  });
});

// GET semua tiket (list untuk dropdown kasir)
router.get("/list", (req, res) => {
  const sql = `
    SELECT 
      t.Id_Tiket,
      t.Kode_Pemesanan,
      p.Nama AS Nama_Penumpang
    FROM Tiket t
    JOIN data_penumpang p ON t.Id_penumpang = p.Id_penumpang
    ORDER BY t.Id_Tiket DESC
  `;

  DB.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // supaya unik, kalau 1 kode pemesanan punya banyak kursi → ambil sekali aja
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
