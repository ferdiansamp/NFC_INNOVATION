import express from "express";
import mysql from "mysql2";
import env from "dotenv";

const DB = mysql.createPool({
  host: process.env.DW_HOST || "localhost",
  user: process.env.DB_USER || "client",
  password: process.env.DB_PASSWORD || "1",
  database: process.env.DB_NAME || "KAI",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

DB.getConnection((err, connection) => {
  err
    ? (console.error("Gagal menjalankan server", err.message), process.exit(1))
    : console.log("Berhasil terhubung ke database"),
  connection.release();
});

export default DB;
