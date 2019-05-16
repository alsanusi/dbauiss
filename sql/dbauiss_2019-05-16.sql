# ************************************************************
# Sequel Pro SQL dump
# Version 5438
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.16)
# Database: dbauiss
# Generation Time: 2019-05-16 09:34:20 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table alumniData
# ------------------------------------------------------------

DROP TABLE IF EXISTS `alumniData`;

CREATE TABLE `alumniData` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `namaLengkap` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `daerahAsal` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `alamat` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `nomorTelepon` varchar(50) NOT NULL DEFAULT '',
  `jenisKelamin` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `tanggalLahir` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `status` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `jurusan` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `detailJurusan` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `tahunKelulusan` varchar(20) NOT NULL DEFAULT '',
  `pekerjaan` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  `pekerjaanDetails` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `alumniData` WRITE;
/*!40000 ALTER TABLE `alumniData` DISABLE KEYS */;

INSERT INTO `alumniData` (`id`, `namaLengkap`, `email`, `daerahAsal`, `alamat`, `nomorTelepon`, `jenisKelamin`, `tanggalLahir`, `status`, `jurusan`, `detailJurusan`, `tahunKelulusan`, `pekerjaan`, `pekerjaanDetails`)
VALUES
	(30,'Muhammad Alkautsar Sanusi','malkautsars@gmail.com','Sulawesi Selatan','Jln Toddopuli X No 11','01112829758','Pria','1996-11-18','Degree','Computing, Technology & Games Development','Information Technology with specialism in Mobile Technology','2017','Information Technology','Software Engineering'),
	(31,'Nizam Hukmi Pababbari','info.nizamp@gmail.com','Sulawesi Selatan','Jln Alauddin','081524003495','Pria','1996-02-02','Degree','Computing, Technology & Games Development','Information Technology with specialism in Business Information Systems','2017','Business & Marketing','Businessman'),
	(32,'Muhammad Febric Fitriansyah','mfebrik@gmail.com','Jakarta','Ngagel','0111998876','Pria','1996-02-02','Degree','Computing, Technology & Games Development','Information Technology with specialism in Business Information Systems','2017','Multimedia','Videography'),
	(36,'Irvan Khalis','irvankhalis@gmail.com','Jakarta','Jln Toddopuli X No 11','082194275704','Pria','1996-11-11','Degree','Computing, Technology & Games Development','Multimedia Technology','2017','Multimedia','VFX'),
	(37,'Jaya Karim','jayakarim@gmail.com','Sulawesi Selatan','Alauddin','082194275704','Pria','1996-12-12','Foundation','-','-','2017','Business & Marketing','Businessman'),
	(39,'Fawwas Hamdi','fawwashamdi@gmail.com','Sulawesi Selatan','Jln Toddopuli X No 11','01112829758','Pria','1996-11-18','Degree','Computing, Technology & Games Development','Information Technology with specialism in Information Systems Security','2017','Others','Continue Master');

/*!40000 ALTER TABLE `alumniData` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table studentData
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studentData`;

CREATE TABLE `studentData` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tpNumber` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `namaLengkap` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `daerahAsal` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `alamat` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `nomorTelepon` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `jenisKelamin` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `tanggalLahir` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `status` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `jurusan` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `detailJurusan` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `semester` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `studentData` WRITE;
/*!40000 ALTER TABLE `studentData` DISABLE KEYS */;

INSERT INTO `studentData` (`id`, `tpNumber`, `namaLengkap`, `email`, `daerahAsal`, `alamat`, `nomorTelepon`, `jenisKelamin`, `tanggalLahir`, `status`, `jurusan`, `detailJurusan`, `semester`)
VALUES
	(2,'TP034292','Kevin Faisharahman','kevinfaisharahman@gmail.com','Jakarta','Endah Promenade C-26-03','0172768487','Pria','2000-04-21','Degree','Business, Management, Marketing, Tourism & Media','Business Management with specialism in E-Business','1'),
	(3,'TP033442','Als','als@gmail.com','Sulsel','Jln Toddopuli X No 11','01112829758','Pria','1986-11-18','Foundation','-','-','1'),
	(4,'TP045532','Aldi Abdillah','aldiabdillah@gmail.com','Kaltim','Endah Promenade D-29-6','082194275704','Pria','2000-05-16','Degree','Computing, Technology & Games Development','Software Engineering','2'),
	(5,'TP019283','Fadhil Ramzy','ramzy@gmail.com','Jatim','Endah Promenade','01112829758','Pria','2000-11-18','Degree','Business, Management, Marketing, Tourism & Media','Business Management with specialism in E-Business','2'),
	(6,'TP034292','RizkiJ','rizkij@gmail.com','Sulawesi Selatan','Jln Toddopuli X No 11','082194275704','Pria','1996-11-18','Foundation','-','-','2');

/*!40000 ALTER TABLE `studentData` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
