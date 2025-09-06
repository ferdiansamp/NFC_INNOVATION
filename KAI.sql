-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: KAI
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Kereta`
--

DROP TABLE IF EXISTS `Kereta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Kereta` (
  `Id_kereta` int NOT NULL,
  `Nama_kereta` varchar(100) NOT NULL,
  `Jenis_kereta` varchar(50) NOT NULL,
  `Stasiun_asal` varchar(50) NOT NULL,
  `Stasiun_tujuan` varchar(50) NOT NULL,
  `Jam_berangkat` time NOT NULL,
  `Jam_tiba` time NOT NULL,
  PRIMARY KEY (`Id_kereta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Kereta`
--

LOCK TABLES `Kereta` WRITE;
/*!40000 ALTER TABLE `Kereta` DISABLE KEYS */;
/*!40000 ALTER TABLE `Kereta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tiket`
--

DROP TABLE IF EXISTS `Tiket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tiket` (
  `Id_Tiket` int NOT NULL AUTO_INCREMENT,
  `Kode_Pemesanan` varchar(7) DEFAULT NULL,
  `Id_pelanggan` int NOT NULL,
  `Id_kereta` int NOT NULL,
  `Tanggal_Pergi` date NOT NULL,
  `Tanggal_Pulang` date DEFAULT NULL,
  `Kursi` varchar(100) NOT NULL,
  PRIMARY KEY (`Id_Tiket`),
  KEY `Id_pelanggan` (`Id_pelanggan`),
  KEY `Id_kereta` (`Id_kereta`),
  CONSTRAINT `Tiket_ibfk_1` FOREIGN KEY (`Id_pelanggan`) REFERENCES `data_pelanggan` (`Id_pelanggan`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Tiket_ibfk_2` FOREIGN KEY (`Id_kereta`) REFERENCES `Kereta` (`Id_kereta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tiket`
--

LOCK TABLES `Tiket` WRITE;
/*!40000 ALTER TABLE `Tiket` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tiket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_pelanggan`
--

DROP TABLE IF EXISTS `data_pelanggan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_pelanggan` (
  `Id_pelanggan` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `no_hp` bigint NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Tipe_ID` varchar(20) NOT NULL,
  `No_ID` bigint NOT NULL,
  `Jenis_Kelamin` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `Tanggal_Lahir` date DEFAULT NULL,
  `Alamat` varchar(255) DEFAULT NULL,
  `Kota_Kabupaten` varchar(100) DEFAULT NULL,
  `Hobi` varchar(255) DEFAULT NULL,
  `Pekerjaan` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id_pelanggan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_pelanggan`
--

LOCK TABLES `data_pelanggan` WRITE;
/*!40000 ALTER TABLE `data_pelanggan` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_pelanggan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-03 13:10:42
