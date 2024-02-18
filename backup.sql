-- MariaDB dump 10.19  Distrib 10.8.3-MariaDB, for osx10.17 (arm64)
--
-- Host: 127.0.0.1    Database: allsports
-- ------------------------------------------------------
-- Server version	10.11.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academy`
--

DROP TABLE IF EXISTS `academy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academy` (
  `id` varchar(191) NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT 0,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  `sportTypeId` varchar(191) DEFAULT NULL,
  `nameArb` varchar(191) NOT NULL,
  `nameEng` varchar(191) NOT NULL,
  `descriptionArb` varchar(191) DEFAULT NULL,
  `descriptionEng` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Academy_nameEng_key` (`nameEng`),
  UNIQUE KEY `Academy_nameArb_key` (`nameArb`),
  KEY `Academy_sportTypeId_fkey` (`sportTypeId`),
  CONSTRAINT `Academy_sportTypeId_fkey` FOREIGN KEY (`sportTypeId`) REFERENCES `SportType` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academy`
--

LOCK TABLES `academy` WRITE;
/*!40000 ALTER TABLE `academy` DISABLE KEYS */;
INSERT INTO `academy` VALUES
('d17ea7b2-1c2d-41e8-b769-bfe16f3922cd',1,'2023-04-28 15:54:06.481','2023-04-28 16:00:39.149','8e63ac5d-90b2-4985-9aca-4a54bd3fde45','test','test','test','test');
/*!40000 ALTER TABLE `academy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academyinformation`
--

DROP TABLE IF EXISTS `academyinformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academyinformation` (
  `id` varchar(191) NOT NULL,
  `gender` enum('MALE','FEMALE','BOTH') NOT NULL,
  `ageFrom` int(11) NOT NULL,
  `ageTo` int(11) NOT NULL,
  `daysInMonth` int(11) NOT NULL,
  `academyId` varchar(191) NOT NULL,
  `instagramAccount` varchar(191) DEFAULT NULL,
  `phoneNumber` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AcademyInformation_academyId_key` (`academyId`),
  UNIQUE KEY `AcademyInformation_id_key` (`id`),
  UNIQUE KEY `AcademyInformation_instagramAccount_key` (`instagramAccount`),
  UNIQUE KEY `AcademyInformation_phoneNumber_key` (`phoneNumber`),
  CONSTRAINT `AcademyInformation_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academyinformation`
--

LOCK TABLES `academyinformation` WRITE;
/*!40000 ALTER TABLE `academyinformation` DISABLE KEYS */;
INSERT INTO `academyinformation` VALUES
('71b53c51-64ee-4155-9b29-6b485a76887e','MALE',3,4,12,'d17ea7b2-1c2d-41e8-b769-bfe16f3922cd','shawlkw','98877449');
/*!40000 ALTER TABLE `academyinformation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academyview`
--

DROP TABLE IF EXISTS `academyview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academyview` (
  `id` varchar(191) NOT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `academyId` varchar(191) NOT NULL,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AcademyView_academyId_key` (`academyId`),
  CONSTRAINT `AcademyView_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academyview`
--

LOCK TABLES `academyview` WRITE;
/*!40000 ALTER TABLE `academyview` DISABLE KEYS */;
/*!40000 ALTER TABLE `academyview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `id` varchar(191) NOT NULL,
  `address` varchar(191) NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT 0,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  `governorateId` varchar(191) DEFAULT NULL,
  `academyId` varchar(191) NOT NULL,
  `googleLat` double DEFAULT NULL,
  `googleLng` double DEFAULT NULL,
  `googleLocation` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Address_academyId_key` (`academyId`),
  KEY `Address_governorateId_fkey` (`governorateId`),
  CONSTRAINT `Address_academyId_fkey` FOREIGN KEY (`academyId`) REFERENCES `Academy` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Address_governorateId_fkey` FOREIGN KEY (`governorateId`) REFERENCES `Governorate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES
('52ab885f-4ee9-47e0-bdf5-782fc5866283','test',0,'2023-04-28 15:54:06.481','2023-04-28 15:54:06.481','19d119b2-a961-4345-87f8-51b6f06438cc','d17ea7b2-1c2d-41e8-b769-bfe16f3922cd',0,0,'');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `id` varchar(191) NOT NULL,
  `nameEng` varchar(191) NOT NULL,
  `nameArb` varchar(191) NOT NULL,
  `descriptionEng` varchar(191) DEFAULT NULL,
  `descriptionArb` varchar(191) DEFAULT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT 0,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `location` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Event_nameEng_key` (`nameEng`),
  UNIQUE KEY `Event_nameArb_key` (`nameArb`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventview`
--

DROP TABLE IF EXISTS `eventview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventview` (
  `id` varchar(191) NOT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `eventId` varchar(191) NOT NULL,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EventView_eventId_key` (`eventId`),
  CONSTRAINT `EventView_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventview`
--

LOCK TABLES `eventview` WRITE;
/*!40000 ALTER TABLE `eventview` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `governorate`
--

DROP TABLE IF EXISTS `governorate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `governorate` (
  `id` varchar(191) NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT 0,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  `nameArb` varchar(191) NOT NULL,
  `nameEng` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Governorate_nameEng_key` (`nameEng`),
  UNIQUE KEY `Governorate_nameArb_key` (`nameArb`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `governorate`
--

LOCK TABLES `governorate` WRITE;
/*!40000 ALTER TABLE `governorate` DISABLE KEYS */;
INSERT INTO `governorate` VALUES
('19d119b2-a961-4345-87f8-51b6f06438cc',1,'2023-04-28 14:48:04.921','2023-04-28 14:48:04.921','العاصمة','Capital');
/*!40000 ALTER TABLE `governorate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `headerimage`
--

DROP TABLE IF EXISTS `headerimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `headerimage` (
  `id` varchar(191) NOT NULL,
  `link` varchar(191) DEFAULT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `numberOfClicks` int(11) NOT NULL DEFAULT 0,
  `enable` tinyint(1) NOT NULL DEFAULT 0,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  `linkType` enum('EXTERNAL','INTERNAL') DEFAULT NULL,
  `type` enum('ACADEMY','EVENT') DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `headerimage`
--

LOCK TABLES `headerimage` WRITE;
/*!40000 ALTER TABLE `headerimage` DISABLE KEYS */;
INSERT INTO `headerimage` VALUES
('7b372f6f-b03e-4016-809a-5e0057c6dbdf','/',NULL,0,0,'2023-04-29 08:39:48.390','2023-04-29 08:39:48.390','INTERNAL','ACADEMY',0);
/*!40000 ALTER TABLE `headerimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT 0,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES
('49f84255-d5fd-46dc-9571-2ebc333ad157','SUPER_ADMIN',0,'2023-04-28 14:47:27.205','2023-04-28 14:47:27.205');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sporttype`
--

DROP TABLE IF EXISTS `sporttype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sporttype` (
  `id` varchar(191) NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT 0,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  `nameArb` varchar(191) NOT NULL,
  `nameEng` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SportType_nameEng_key` (`nameEng`),
  UNIQUE KEY `SportType_nameArb_key` (`nameArb`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sporttype`
--

LOCK TABLES `sporttype` WRITE;
/*!40000 ALTER TABLE `sporttype` DISABLE KEYS */;
INSERT INTO `sporttype` VALUES
('8e63ac5d-90b2-4985-9aca-4a54bd3fde45',1,'2023-04-28 14:47:57.333','2023-04-28 14:47:57.333','سباحة','Swimming');
/*!40000 ALTER TABLE `sporttype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sporttypeview`
--

DROP TABLE IF EXISTS `sporttypeview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sporttypeview` (
  `id` varchar(191) NOT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `sportTypeId` varchar(191) NOT NULL,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SportTypeView_sportTypeId_key` (`sportTypeId`),
  CONSTRAINT `SportTypeView_sportTypeId_fkey` FOREIGN KEY (`sportTypeId`) REFERENCES `SportType` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sporttypeview`
--

LOCK TABLES `sporttypeview` WRITE;
/*!40000 ALTER TABLE `sporttypeview` DISABLE KEYS */;
/*!40000 ALTER TABLE `sporttypeview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT 0,
  `name` varchar(191) DEFAULT NULL,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
('192d85a7-2308-44f0-a09a-4e2d596843a1','im@abdullaziz.me','$2b$10$HYLsdKjjIi5kfLrZpHQjTOl3DN2VQ5n9TI331sLpJ7Vn0elEgVZb.',1,'Abdul Aziz','2023-04-28 14:47:37.305','2023-04-28 14:47:37.305');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrole`
--

DROP TABLE IF EXISTS `userrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userrole` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `roleId` varchar(191) NOT NULL,
  `createdDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `modifyDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UserRole_userId_fkey` (`userId`),
  KEY `UserRole_roleId_fkey` (`roleId`),
  CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrole`
--

LOCK TABLES `userrole` WRITE;
/*!40000 ALTER TABLE `userrole` DISABLE KEYS */;
INSERT INTO `userrole` VALUES
('618ee22d-77db-4d23-8eea-840127f6152f','192d85a7-2308-44f0-a09a-4e2d596843a1','49f84255-d5fd-46dc-9571-2ebc333ad157','2023-04-28 14:47:37.305','2023-04-28 14:47:37.305');
/*!40000 ALTER TABLE `userrole` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-29 12:46:43
