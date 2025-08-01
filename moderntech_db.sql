
CREATE DATABASE IF NOT EXISTS `moderntech_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE=utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `moderntech_db`;

-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employees_information`
--
DROP TABLE IF EXISTS `employees_information`;
CREATE TABLE `employees_information` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `employment_history` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `employees_information` WRITE;
/*!40000 ALTER TABLE `employees_information` DISABLE KEYS */;
INSERT INTO `employees_information` VALUES 
(1,'Sibongile Nkosi','Software Engineer','Development',70000.00,'Joined 2015, Senior 2018','sibongile.nkosi@moderntech.com'),
(2,'Lungile Moyo','HR Manager','HR',80000.00,'Joined 2013, Manager 2017','lungile.moyo@moderntech.com'),
(3,'Thabo Molefe','Quality Analyst','QA',55000.00,'Joined in 2018','thabo.molefe@moderntech.com'),
(4,'Keshav Naidoo','Sales Representative','Sales',60000.00,'Joined in 2020','keshav.naidoo@moderntech.com'),
(5,'Zanele Khumalo','Marketing Specialist','Marketing',58000.00,'Joined in 2019','zanele.khumalo@moderntech.com'),
(6,'Sipho Zulu','UI/UX Designer','Design',65000.00,'Joined in 2016','sipho.zulu@moderntech.com'),
(7,'Naledi Moeketsi','DevOps Engineer','IT',72000.00,'Joined in 2017','naledi.moeketsi@moderntech.com'),
(8,'Farai Gumbo','Content Strategist','Marketing',56000.00,'Joined in 2021','farai.gumbo@moderntech.com'),
(9,'Karabo Dlamini','Accountant','Finance',62000.00,'Joined in 2018','karabo.dlamini@moderntech.com'),
(10,'Fatima Patel','Customer Support Lead','Support',58000.00,'Joined in 2016','fatima.patel@moderntech.com');
/*!40000 ALTER TABLE `employees_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `attendance_tracking` date DEFAULT NULL,
  `status` enum('present','absent','leave') DEFAULT 'present',
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees_information` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` (`employee_id`, `name`, `attendance_tracking`, `status`) VALUES
(1, 'Sibongile Nkosi', '2025-07-25', 'present'),
(1, 'Sibongile Nkosi', '2025-07-26', 'absent'),
(1, 'Sibongile Nkosi', '2025-07-27', 'present'),
(1, 'Sibongile Nkosi', '2025-07-28', 'present'),
(1, 'Sibongile Nkosi', '2025-07-29', 'present'),

(2, 'Lungile Moyo', '2025-07-25', 'present'),
(2, 'Lungile Moyo', '2025-07-26', 'present'),
(2, 'Lungile Moyo', '2025-07-27', 'absent'),
(2, 'Lungile Moyo', '2025-07-28', 'present'),
(2, 'Lungile Moyo', '2025-07-29', 'present'),

(3, 'Thabo Molefe', '2025-07-25', 'present'),
(3, 'Thabo Molefe', '2025-07-26', 'present'),
(3, 'Thabo Molefe', '2025-07-27', 'present'),
(3, 'Thabo Molefe', '2025-07-28', 'absent'),
(3, 'Thabo Molefe', '2025-07-29', 'present'),

(4, 'Keshav Naidoo', '2025-07-25', 'absent'),
(4, 'Keshav Naidoo', '2025-07-26', 'present'),
(4, 'Keshav Naidoo', '2025-07-27', 'present'),
(4, 'Keshav Naidoo', '2025-07-28', 'present'),
(4, 'Keshav Naidoo', '2025-07-29', 'present'),

(5, 'Zanele Khumalo', '2025-07-25', 'present'),
(5, 'Zanele Khumalo', '2025-07-26', 'present'),
(5, 'Zanele Khumalo', '2025-07-27', 'absent'),
(5, 'Zanele Khumalo', '2025-07-28', 'present'),
(5, 'Zanele Khumalo', '2025-07-29', 'present'),

(6, 'Sipho Zulu', '2025-07-25', 'present'),
(6, 'Sipho Zulu', '2025-07-26', 'present'),
(6, 'Sipho Zulu', '2025-07-27', 'absent'),
(6, 'Sipho Zulu', '2025-07-28', 'present'),
(6, 'Sipho Zulu', '2025-07-29', 'present'),

(7, 'Naledi Moeketsi', '2025-07-25', 'present'),
(7, 'Naledi Moeketsi', '2025-07-26', 'present'),
(7, 'Naledi Moeketsi', '2025-07-27', 'present'),
(7, 'Naledi Moeketsi', '2025-07-28', 'absent'),
(7, 'Naledi Moeketsi', '2025-07-29', 'present'),

(8, 'Farai Gumbo', '2025-07-25', 'present'),
(8, 'Farai Gumbo', '2025-07-26', 'absent'),
(8, 'Farai Gumbo', '2025-07-27', 'present'),
(8, 'Farai Gumbo', '2025-07-28', 'present'),
(8, 'Farai Gumbo', '2025-07-29', 'present'),

(9, 'Karabo Dlamini', '2025-07-25', 'present'),
(9, 'Karabo Dlamini', '2025-07-26', 'present'),
(9, 'Karabo Dlamini', '2025-07-27', 'present'),
(9, 'Karabo Dlamini', '2025-07-28', 'absent'),
(9, 'Karabo Dlamini', '2025-07-29', 'present'),

(10, 'Fatima Patel', '2025-07-25', 'present'),
(10, 'Fatima Patel', '2025-07-26', 'present'),
(10, 'Fatima Patel', '2025-07-27', 'absent'),
(10, 'Fatima Patel', '2025-07-28', 'present'),
(10, 'Fatima Patel', '2025-07-29', 'present');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `employee_salaries`
--
DROP TABLE IF EXISTS `employee_salaries`;
CREATE TABLE `employee_salaries` (
  `employeeId` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `hoursWorked` int DEFAULT NULL,
  `leaveDeductions` int DEFAULT NULL,
  `finalSalary` int DEFAULT NULL,
  PRIMARY KEY (`employeeId`),
  CONSTRAINT `employee_salaries_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees_information` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `employee_salaries` WRITE;
/*!40000 ALTER TABLE `employee_salaries` DISABLE KEYS */;
INSERT INTO `employee_salaries` VALUES 
(1,'Sibongile Nkosi',160,8,69500),
(2,'Lungile Moyo',150,10,79000),
(3,'Thabo Molefe',168,2,64800),
(4,'Keshav Naidoo',162,4,57750),
(5,'Zanele Khumalo',158,5,57850),
(6,'Sipho Zulu',165,6,59700),
(7,'Naledi Moeketsi',170,8,66780),
(8,'Farai Gumbo',177,9,78900);
/*!40000 ALTER TABLE `employee_salaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--
DROP TABLE IF EXISTS `leave_requests`;
CREATE TABLE `leave_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeId` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employeeId` (`employeeId`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees_information` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
INSERT INTO `leave_requests` VALUES 
(1,1,'2025-07-22','Sick Leave','Approved'),
(2,1,'2024-12-01','Personal','Pending'),
(3,2,'2025-07-15','Family Responsibility','Denied'),
(4,2,'2024-12-02','Vacation','Approved'),
(5,3,'2025-07-10','Medical Appointment','Approved'),
(6,3,'2024-12-05','Personal','Pending'),
(7,4,'2025-07-20','Bereavement','Approved'),
(8,5,'2024-12-01','Childcare','Pending'),
(9,6,'2025-07-18','Sick Leave','Approved'),
(10,7,'2025-07-22','Vacation','Pending'),
(11,8,'2024-12-02','Medical Appointment','Approved'),
(12,9,'2025-07-19','Childcare','Denied'),
(13,10,'2024-12-03','Vacation','Pending');
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'admin@gmail.com','admin123');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
