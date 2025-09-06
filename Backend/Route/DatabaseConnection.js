import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Kalau ada env dari Railway → pakai itu
// Kalau tidak ada (di lokal) → pakai env manual dari .env
const DB = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "127.0.0.1",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "test",
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test koneksi
DB.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Gagal konek DB:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Berhasil konek ke database!");
    conn.release();
  }
});

export default DB;
