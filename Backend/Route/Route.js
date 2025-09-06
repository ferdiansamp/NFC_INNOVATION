import express from "express";
import router from  express.Router();
import DB from "./Route/DatabaseConnection.js";

router.get('/api/DataPelanggan',(req,res)=>{
  let sql ='select * from data_pelanggan';

  DB.query(sql,(err,result)=>{
    if(err){
      console.error('Gagal mengambil data pelanggan:', err);
      return res.status(500).json({ error: 'Gagal mengambil data pelanggan' });
    }
    res.json(result);
  });
});
