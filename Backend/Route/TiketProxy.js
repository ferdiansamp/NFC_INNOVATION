// // Backend/Route/TiketProxy.js
// import express from "express";
// import fetch from "node-fetch";

// const router = express.Router();

// router.all("/*", async (req, res) => {
//   try {
//     const url =
//       "https://nfcinnovation-production.up.railway.app/api/tiket" + req.path;
//     console.log("🔗 Proxying to:", url);

//     const options = {
//       method: req.method,
//       headers: {
//         "Content-Type": "application/json",
//         "Host": "nfcinnovation-production.up.railway.app" // ✅ fix host header
//       },
//     };

//     if (req.method !== "GET") {
//       options.body = JSON.stringify(req.body);
//     }

//     const response = await fetch(url, options);

//     // Debug response
//     const text = await response.text();
//     console.log("📥 Response dari Railway:", text);

//     try {
//       const data = JSON.parse(text);
//       res.json(data);
//     } catch (err) {
//       res.status(500).json({ error: "Invalid JSON dari Railway", raw: text });
//     }
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// export default router;
