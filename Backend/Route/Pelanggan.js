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
 * GET penumpang berdasarkan Id_penumpang
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM data_penumpang WHERE Id_penumpang = ?";
  DB.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Penumpang tidak ditemukan" });
    res.json(results[0]);
  });
});

/**
 * POST / tambahkan penumpang baru
 */
router.post("/", (req, res) => {
  const { Id_pelanggan, nama, Tipe_ID, No_ID, Jenis_Kelamin, Kategori } = req.body;

  const sql = `INSERT INTO data_penumpang 
    (Id_pelanggan, nama, Tipe_ID, No_ID, Jenis_Kelamin, Kategori)
    VALUES (?, ?, ?, ?, ?, ?)`;

  DB.query(sql, [Id_pelanggan, nama, Tipe_ID, No_ID, Jenis_Kelamin, Kategori], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Berhasil menambahkan penumpang", Id_penumpang: result.insertId });
  });
});

/**
 * PUT /:id → update penumpang
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { Id_pelanggan, nama, Tipe_ID, No_ID, Jenis_Kelamin, Kategori } = req.body;

  const sql = `UPDATE data_penumpang SET 
    Id_pelanggan = ?, nama = ?, Tipe_ID = ?, No_ID = ?, Jenis_Kelamin = ?, Kategori = ?
    WHERE Id_penumpang = ?`;

  DB.query(sql, [Id_pelanggan, nama, Tipe_ID, No_ID, Jenis_Kelamin, Kategori, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Penumpang tidak ditemukan" });
    res.json({ message: "Berhasil update penumpang" });
  });
});

/**
 * DELETE /:id → hapus penumpang
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM data_penumpang WHERE Id_penumpang = ?";
  DB.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Penumpang tidak ditemukan" });
    res.json({ message: "Berhasil menghapus penumpang" });
  });
});

export default router;
