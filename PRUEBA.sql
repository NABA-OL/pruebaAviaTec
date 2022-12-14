-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: prueba_estacionamiento
-- ------------------------------------------------------
-- Server version	8.0.23

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
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `nom_empleado` varchar(45) NOT NULL,
  `user_empleado` varchar(45) NOT NULL,
  `password_empleado` varchar(45) NOT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `id_empleado_UNIQUE` (`id_empleado`),
  UNIQUE KEY `user_empleado_UNIQUE` (`user_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (1,'Nicolas B','NAB123','123123'),(2,'Admin','admin123','123456');
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reg_vehiculos`
--

DROP TABLE IF EXISTS `reg_vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reg_vehiculos` (
  `id_vehiculo` int NOT NULL AUTO_INCREMENT,
  `placa` varchar(45) NOT NULL,
  `hora_entrada` timestamp NOT NULL,
  `hora_salida` timestamp NULL DEFAULT NULL,
  `total_tiempo_esta` int DEFAULT NULL,
  `estado` varchar(3) NOT NULL,
  `total_pago` varchar(6) DEFAULT NULL,
  `id_empleado` int NOT NULL,
  `tipo_vec` int NOT NULL,
  PRIMARY KEY (`id_vehiculo`),
  UNIQUE KEY `idvehiculo_UNIQUE` (`id_vehiculo`),
  KEY `id_empleado_fk_idx` (`id_empleado`),
  KEY `id_tipo_veh_fk_idx` (`tipo_vec`),
  CONSTRAINT `id_empleado_fk` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`),
  CONSTRAINT `id_tipo_veh_fk` FOREIGN KEY (`tipo_vec`) REFERENCES `tipo_veh` (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reg_vehiculos`
--

LOCK TABLES `reg_vehiculos` WRITE;
/*!40000 ALTER TABLE `reg_vehiculos` DISABLE KEYS */;
INSERT INTO `reg_vehiculos` VALUES (1,'ghj123','2022-09-10 20:00:00','2022-09-11 03:35:34',200,'OUT','13680',1,1),(2,'asd568','2022-09-12 01:21:33','2022-09-12 03:24:22',300,'OUT','3690',1,1),(3,'sdf567','2022-09-12 01:58:18','2022-09-13 04:29:53',400,'OUT','0',1,5),(5,'nab123','2022-09-13 04:02:13','2022-09-12 15:46:07',500,'OUT','3520',1,3),(6,'cgfcgc','2022-09-13 04:26:13','2022-09-13 04:27:22',100,'OUT','5',1,3),(7,'cgf123','2022-09-13 15:43:02','2022-09-13 15:44:37',150,'OUT','60',1,1),(9,'asd777','2022-09-13 15:47:52','2022-09-13 15:49:52',1000,'OUT','80',1,4),(10,'asd666','2022-09-13 15:48:05','2022-09-13 15:51:03',500,'OUT','0',1,5),(11,'asd555','2022-09-13 15:43:02','2022-09-13 15:53:01',600,'OUT','100',1,2),(12,'asd444','2022-09-13 15:43:02','2022-09-13 15:54:12',700,'OUT','0',1,5),(13,'asd888','2022-09-13 15:55:48','2022-09-13 15:56:16',800,'OUT','0',1,1),(14,'nab124','2022-09-13 15:56:50','2022-09-13 15:57:59',10,'OUT','5',1,3),(15,'ghj222','2022-09-13 16:05:00',NULL,NULL,'IN',NULL,1,1),(16,'asd111','2022-09-13 21:53:19',NULL,NULL,'IN',NULL,1,5),(17,'asdfghj','2022-09-13 22:02:11',NULL,NULL,'IN',NULL,2,3);
/*!40000 ALTER TABLE `reg_vehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_veh`
--

DROP TABLE IF EXISTS `tipo_veh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_veh` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `ntipo_veh` varchar(45) NOT NULL,
  `cobroxmin` int NOT NULL,
  PRIMARY KEY (`id_tipo`),
  UNIQUE KEY `id_tipo_UNIQUE` (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_veh`
--

LOCK TABLES `tipo_veh` WRITE;
/*!40000 ALTER TABLE `tipo_veh` DISABLE KEYS */;
INSERT INTO `tipo_veh` VALUES (1,'Auto Particular',30),(2,'Motocicleta',10),(3,'Bicicleta',5),(4,'Pesado',40),(5,'Auto Oficial',0);
/*!40000 ALTER TABLE `tipo_veh` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-13 18:55:56
