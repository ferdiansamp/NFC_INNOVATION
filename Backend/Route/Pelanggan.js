import express from "express";
import DB from "./DatabaseConnection.js";

const router = express.Router();

/**
 * GET semua penumpang
 */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM data_pelanggan";
  DB.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

/**
 * GET penumpang berdasarkan Id_pelanggan
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM data_pelanggan WHERE Id_pelanggan = ?";
  DB.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Penumpang tidak ditemukan" });
    res.json(results[0]);
  });
});

/**
 * POST / → tambahkan penumpang baru
 */
router.post("/", (req, res) => {
  const {
    nama,
    no_hp,
    Email,
    Tipe_ID,
    No_ID,
    Jenis_Kelamin,
    Tanggal_Lahir,
    Alamat,
    Kota_Kabupaten,
    Hobi,
    Pekerjaan
  } = req.body;

  const sql = `
    INSERT INTO data_pelanggan 
      (nama, no_hp, Email, Tipe_ID, No_ID, Jenis_Kelamin, Tanggal_Lahir, Alamat, Kota_Kabupaten, Hobi, Pekerjaan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  DB.query(
    sql,
    [nama, no_hp, Email, Tipe_ID, No_ID, Jenis_Kelamin, Tanggal_Lahir, Alamat, Kota_Kabupaten, Hobi, Pekerjaan],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Berhasil menambahkan penumpang", Id_pelanggan: result.insertId });
    }
  );
});

/**
 * PUT /:id → update penumpang
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    nama,
    no_hp,
    Email,
    Tipe_ID,
    No_ID,
    Jenis_Kelamin,
    Tanggal_Lahir,
    Alamat,
    Kota_Kabupaten,
    Hobi,
    Pekerjaan
  } = req.body;

  const sql = `
    UPDATE data_pelanggan SET 
      nama = ?, no_hp = ?, Email = ?, Tipe_ID = ?, No_ID = ?, Jenis_Kelamin = ?, 
      Tanggal_Lahir = ?, Alamat = ?, Kota_Kabupaten = ?, Hobi = ?, Pekerjaan = ?
    WHERE Id_pelanggan = ?
  `;

  DB.query(
    sql,
    [nama, no_hp, Email, Tipe_ID, No_ID, Jenis_Kelamin, Tanggal_Lahir, Alamat, Kota_Kabupaten, Hobi, Pekerjaan, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Penumpang tidak ditemukan" });
      res.json({ message: "Berhasil update penumpang" });
    }
  );
});

/**
 * DELETE /:id → hapus penumpang
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM data_pelanggan WHERE Id_pelanggan = ?";
  DB.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Penumpang tidak ditemukan" });
    res.json({ message: "Berhasil menghapus penumpang" });
  });
});

export default router;
