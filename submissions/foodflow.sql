-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 34.124.250.62    Database: foodflow
-- ------------------------------------------------------
-- Server version	8.0.31-google

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
-- Table structure for table `Listing`
--

DROP TABLE IF EXISTS `Listing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Listing` (
  `ListingID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Datetime` datetime(3) NOT NULL,
  `ExpiryDate` date NOT NULL,
  `Category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` int DEFAULT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `Image` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PickUpAddressFirst` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PickUpAddressSecond` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PickUpAddressThird` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PickUpPostalCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PickUpStartDate` date NOT NULL,
  `PickUpEndDate` date NOT NULL,
  `PickUpStartTime` time NOT NULL,
  `PickUpEndTime` time NOT NULL,
  `ContactPhone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactEmail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ListingID`),
  KEY `Listing_UserID_fkey` (`UserID`),
  CONSTRAINT `Listing_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Listing`
--

LOCK TABLES `Listing` WRITE;
/*!40000 ALTER TABLE `Listing` DISABLE KEYS */;
INSERT INTO `Listing` VALUES (6,123,'Apple of my eye','2023-11-06 15:56:00.000','2023-11-05','Fruits',2,'Freshly harvested apples from my orchard. Crisp and juicy!','0914f81e-7e25-46ff-b2c7-59e2e91d86b1.jpg','123 Apple St.','Orchard Block B','Unit 45','90210','2023-11-01','2023-11-03','01:30:00','09:30:00','987654321','goodfood@gmail.com'),(7,123,'Magnificent Mangosteens','2023-11-06 13:54:00.000','2023-11-06','Fruits',2,'Freshly harvested mangosteens from my orchard. Crisp and juicy!','a5acc6c5-bb5b-457b-bd05-7eace14385f8.jpg','123 Mangosteen St.','Orchard Block B','Unit 45','90210','2023-11-01','2023-11-03','01:30:00','09:30:00','98765432','goodfood@gmail.com'),(9,456,'Outstanding Oranges','2023-10-30 14:45:00.000','2023-11-05','Fruits',1,'Freshly harvested oranges from my orchard. Crisp and juicy!','14b69392-c8dc-4a53-91bc-bfd46c9b0937.jpg','123 Orange St.','Orchard Block B','Unit 45','90210','2023-11-01','2023-11-03','01:30:00','09:30:00','987654321','goodfood@gmail.com'),(15,123,'Perfect Pepperoni','2023-11-05 20:06:00.000','2023-11-06','Italian',2,'Rumble in your jungle!','d2edfc4c-f263-4b9a-8d29-913941d9f8c8.jpg','SIT','NYP','Singapore','654321','2023-11-05','2023-11-05','12:06:00','23:06:00','98765432','test@email.com'),(16,456,'Massive Milo','2023-11-05 20:09:00.000','2023-11-06','Drink',1,'SIUUUUUUU','2ac16b56-62dd-4b41-8b98-82c7bf8920cd.jpg','SIT','NYP','Singapore','654321','2023-11-05','2023-11-05','12:09:00','23:09:00','98765432','test@email.com'),(24,123,'Van Houten Semi-Sweet Almond Box 2000g','2023-11-10 18:57:00.000','2024-12-13','Sweets',1,'Very Nice Chocolate but bought too much','0173744a-6f7b-4bad-8358-2238750164bb.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-11-10','2023-12-30','09:00:00','22:00:00','99126290','SITNYP@gmail.com'),(25,123,'AYAM BRAND TUNA','2023-11-10 15:01:00.000','2025-02-01','Canned Food',2,'AYAM BRAND MAYO Flavored Tuna','d5fa58fb-0b05-40d9-826d-23985b1ec5e6.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2024-01-01','2024-03-01','09:10:00','22:10:00','99126290','SITNYP@gmail.com'),(26,123,'Dole Banana','2023-11-10 15:13:00.000','2024-12-12','Fruits & Vegetable',1,'Dole Banana 10 Pcs','43357241-d855-423f-a0f7-b80e5c9f9150.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-12-10','2024-04-10','10:10:00','22:10:00','99126290','SITNYP@gmail.com'),(27,123,'Fresh Gala Apples','2023-11-10 15:16:00.000','2024-10-10','Fruits & Vegetables',0,'6 Pcs Gala Apples. Grab and Go please!','01dfeb36-81e6-4daf-bbfb-e09f0a6f7e35.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-12-01','2023-12-10','10:10:00','22:10:00','99126290','SITNYP@gmail.com'),(28,123,'Cereal','2023-11-10 15:19:00.000','2024-02-01','Grains',1,'Yummy Cereal!','b143d36e-24bf-4c16-8d66-f4db1ab1b3f2.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2024-01-01','2024-02-01','10:10:00','22:10:00','99126290','SITNYP@gmail.com'),(29,123,'Spicy Tuna','2023-11-10 15:21:00.000','2024-12-20','Canned Food',1,'Spicy yet delicious!','7d0a7144-9289-44b4-9806-865ee983e071.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-12-10','2024-12-10','10:10:00','22:10:00','99126290','SITNYP@gmail.com'),(30,123,'Kettle Honey Dijon Chips','2023-11-10 15:25:00.000','2025-12-01','Chips',1,'Honey Dijon Mustard Chips bought from Supermarket!','19a42c71-2837-498f-90e8-9d25afcbd8e2.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-10-10','2024-01-12','07:00:00','10:10:00','99126290','SITNYP@gmail.com'),(31,123,'KitKat','2023-11-10 15:27:00.000','2024-12-12','Chocolate',1,'Have a Break , Have a KitKat!','b2118352-9c93-43c6-b333-3f03468d4ef2.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-12-12','2024-10-10','10:01:00','22:12:00','99126290','SITNYP@gmail.com'),(32,123,'Nikocado Avocado','2023-11-10 15:29:00.000','2024-10-10','Fruits & Vegetables',1,'Yummy Avocado','3b3143f4-5573-49df-a8e0-988fb18a0dd8.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-10-10','2023-12-10','10:10:00','22:10:00','99126290','SITNYP@gmail.com'),(33,123,'Muscat Grape','2023-11-10 15:31:00.000','2023-10-10','Fruits & Vegetables',1,'Muscat Grapes, Sedap Gilaaaaaaaaa','745a6763-a0f9-4c17-b6e5-8b77a8e06182.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-12-12','2024-12-12','10:10:00','22:10:00','99126290','SITNYP@gmail.com'),(34,123,'Milo','2023-11-10 15:33:00.000','2024-12-12','Chocolate',1,'WHO DOESNT LOVE MILO CUBES','20131254-82d7-470c-b20e-a421421f3cb6.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2023-12-12','2024-01-01','10:10:00','22:10:00','99126290','SITNYP@gmail.com'),(35,123,'Brown Rice','2023-11-10 15:37:00.000','2024-12-12','Rice',1,'Healthy Brown Rice!','68e9b61c-6a9a-4341-8032-93e72093e7d0.jpg','SIT@RP','SIT@RP','SIT@RP','s178293','2024-01-01','2024-10-10','10:10:00','22:10:00','99126290','SITNYP@gmail.com');
/*!40000 ALTER TABLE `Listing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reservation`
--

DROP TABLE IF EXISTS `Reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reservation` (
  `ReservationID` int NOT NULL AUTO_INCREMENT,
  `Datetime` datetime(3) NOT NULL,
  `Remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `UserID` int DEFAULT NULL,
  `ListingID` int DEFAULT NULL,
  PRIMARY KEY (`ReservationID`),
  KEY `Reservation_UserID_fkey` (`UserID`),
  KEY `Reservation_ListingID_fkey` (`ListingID`),
  CONSTRAINT `Reservation_ListingID_fkey` FOREIGN KEY (`ListingID`) REFERENCES `Listing` (`ListingID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Reservation_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=911 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reservation`
--

LOCK TABLES `Reservation` WRITE;
/*!40000 ALTER TABLE `Reservation` DISABLE KEYS */;
INSERT INTO `Reservation` VALUES (904,'2023-11-09 22:21:11.000','',456,15),(905,'2023-11-09 22:21:12.000','',456,7),(908,'2023-11-10 15:01:45.000','',456,6),(909,'2023-11-10 15:01:47.000','',456,25),(910,'2023-11-10 15:01:50.000','',456,27);
/*!40000 ALTER TABLE `Reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FirstName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `LastName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DOB` date NOT NULL,
  `AddressFirst` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AddressSecond` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AddressThird` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PostalCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `User_Username_key` (`Username`),
  UNIQUE KEY `User_Email_key` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=460 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (123,'donorExample','Donor','One','donor','user@example.com','$2b$10$i/9BMSbhj/JvgQE.6h/fL.LsShbT8Bd7BPqZq.ezHssJekSiAZm2K','1989-12-31','123 First Lane','Suite 1','Third Building','123456'),(456,'patronExample','Patron','One','patron','user2@example.com','$2b$10$i/9BMSbhj/JvgQE.6h/fL.LsShbT8Bd7BPqZq.ezHssJekSiAZm2K','1989-12-31','123 First Lane','Suite 1','Third Building','123456');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('bb352f59-cd33-432f-bd70-8cec4ec6114b','7fd64474f65c5c0dfd13dfbe199f802b0bdf9e119abc26b9303af5cf8642bd94','2023-10-23 17:11:16.799','20231023171116_make_username_unique',NULL,NULL,'2023-10-23 17:11:16.299',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-11  2:27:02
