-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Vært: mariadb
-- Genereringstid: 04. 05 2026 kl. 14:08:13
-- Serverversion: 10.6.20-MariaDB-ubu2004
-- PHP-version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `2026_1_washworld`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `reset_pk` varchar(32) NOT NULL,
  `user_fk` varchar(32) NOT NULL,
  `reset_key` varchar(64) NOT NULL,
  `used_at` int(11) DEFAULT 0,
  `created_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `subscriptions`
--

CREATE TABLE `subscriptions` (
  `subscription_pk` varchar(32) NOT NULL,
  `user_fk` varchar(32) NOT NULL,
  `subscription_name` varchar(100) NOT NULL,
  `subscription_price` decimal(10,2) NOT NULL,
  `subscription_started_at` datetime NOT NULL DEFAULT current_timestamp(),
  `subscription_active` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `users`
--

CREATE TABLE `users` (
  `user_pk` varchar(32) NOT NULL,
  `user_first_name` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password_hash` varchar(255) NOT NULL,
  `user_license_plate` varchar(20) NOT NULL,
  `user_verified_at` datetime DEFAULT NULL,
  `user_verification_key` varchar(32) NOT NULL,
  `user_reset_password_key` varchar(64) NOT NULL,
  `user_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `wash_history`
--

CREATE TABLE `wash_history` (
  `wash_pk` varchar(32) NOT NULL,
  `user_fk` varchar(32) NOT NULL,
  `location_fk` varchar(32) NOT NULL,
  `wash_type` varchar(100) NOT NULL,
  `normal_price` decimal(10,2) NOT NULL,
  `subscription_price` decimal(10,2) NOT NULL,
  `washed_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `wash_locations`
--

CREATE TABLE `wash_locations` (
  `location_pk` varchar(32) NOT NULL,
  `location_name` varchar(100) NOT NULL,
  `location_city` varchar(100) NOT NULL,
  `location_address` varchar(255) NOT NULL,
  `location_opening_hours` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `wash_locations`
--

INSERT INTO `wash_locations` (`location_pk`, `location_name`, `location_city`, `location_address`, `location_opening_hours`) VALUES
('loc001', 'Wash World Køge', 'Køge', 'Køge Centrum 1', '06:00 - 22:00'),
('loc002', 'Wash World Ishøj', 'Ishøj', 'Ishøj Bycenter 10', '06:00 - 22:00'),
('loc003', 'Wash World Roskilde', 'Roskilde', 'Roskildevej 55', '07:00 - 21:00'),
('loc004', 'Wash World Greve', 'Greve', 'Greve Main Street 20', '06:00 - 22:00');

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`reset_pk`),
  ADD KEY `user_fk` (`user_fk`);

--
-- Indeks for tabel `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`subscription_pk`),
  ADD KEY `user_fk` (`user_fk`);

--
-- Indeks for tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_pk`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- Indeks for tabel `wash_history`
--
ALTER TABLE `wash_history`
  ADD PRIMARY KEY (`wash_pk`),
  ADD KEY `user_fk` (`user_fk`),
  ADD KEY `location_fk` (`location_fk`);

--
-- Indeks for tabel `wash_locations`
--
ALTER TABLE `wash_locations`
  ADD PRIMARY KEY (`location_pk`);

--
-- Begrænsninger for dumpede tabeller
--

--
-- Begrænsninger for tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`);

--
-- Begrænsninger for tabel `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`);

--
-- Begrænsninger for tabel `wash_history`
--
ALTER TABLE `wash_history`
  ADD CONSTRAINT `wash_history_ibfk_1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`),
  ADD CONSTRAINT `wash_history_ibfk_2` FOREIGN KEY (`location_fk`) REFERENCES `wash_locations` (`location_pk`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
