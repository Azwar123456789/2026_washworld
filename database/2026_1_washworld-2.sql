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
  `user_phone` varchar(20) DEFAULT NULL,
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
  `location_opening_hours` varchar(100) NOT NULL,
  `location_lat` decimal(10,7) DEFAULT NULL,
  `location_lng` decimal(10,7) DEFAULT NULL,
  `que_status` int(11) NOT NULL DEFAULT 0,
  `in_que` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `wash_locations`
(
  `location_pk`,
  `location_name`,
  `location_city`,
  `location_address`,
  `location_opening_hours`,
  `location_lat`,
  `location_lng`,
  `que_status`,
  `in_que`
)
VALUES
('loc001', 'Wash World Køge', 'Køge', 'Københavnsvej 86, 4600 Køge', '07:00 - 22:00', 55.456146, 12.182126, 2, 1),
('loc002', 'Wash World Ishøj', 'Ishøj', 'Vejleåvej 19, 2635 Ishøj', '07:00 - 22:00', 55.615676, 12.351193, 4, 2),
('loc003', 'Wash World Roskilde', 'Roskilde', 'Ringstedvej 73, 4000 Roskilde', '07:00 - 22:00', 55.641716, 12.080347, 1, 0),
('loc004', 'Wash World Taastrup', 'Taastrup', 'Roskildevej 376, 2630 Taastrup', '07:00 - 22:00', 55.652414, 12.301533, 3, 1),
('loc005', 'Wash World Ballerup', 'Ballerup', 'Industriparken 6, 2750 Ballerup', '07:00 - 22:00', 55.731226, 12.363456, 0, 0),
('loc006', 'Wash World Herlev', 'Herlev', 'Nørrelundvej 2, 2730 Herlev', '07:00 - 22:00', 55.723442, 12.423231, 2, 1),
('loc007', 'Wash World Hillerød', 'Hillerød', 'Industrivænget 3, 3400 Hillerød', '07:00 - 22:00', 55.927900, 12.300800, 5, 3),
('loc008', 'Wash World Farum', 'Farum', 'Gammelgårdsvej 84, 3520 Farum', '07:00 - 22:00', 55.808000, 12.360200, 1, 0),
('loc009', 'Wash World Holbæk', 'Holbæk', 'Springstrup 5, 4300 Holbæk', '07:00 - 22:00', 55.718300, 11.704900, 3, 1),
('loc010', 'Wash World Kalundborg', 'Kalundborg', 'Holbækvej 74, 4400 Kalundborg', '07:00 - 22:00', 55.679100, 11.073500, 0, 0),
('loc011', 'Wash World Slagelse', 'Slagelse', 'Idagårdsvej 2, 4200 Slagelse', '07:00 - 22:00', 55.403800, 11.354600, 2, 1),
('loc012', 'Wash World Ringsted', 'Ringsted', 'Nørregade 70, 4100 Ringsted', '07:00 - 22:00', 55.442100, 11.790100, 4, 2),
('loc013', 'Wash World Vordingborg', 'Vordingborg', 'Valdemarsgade 57, 4760 Vordingborg', '07:00 - 22:00', 55.008100, 11.910500, 1, 0),
('loc014', 'Wash World Nykøbing Falster', 'Nykøbing Falster', 'Guldborgsundcentret 32, 4800 Nykøbing Falster', '07:00 - 22:00', 54.769000, 11.874000, 3, 1),
('loc015', 'Wash World Odense', 'Odense', 'Nyborgvej 343, 5220 Odense', '07:00 - 22:00', 55.395000, 10.431000, 2, 1),
('loc016', 'Wash World Odense SØ', 'Odense SØ', 'Ørbækvej 99, 5220 Odense SØ', '07:00 - 22:00', 55.383000, 10.430000, 0, 0),
('loc017', 'Wash World Fredericia', 'Fredericia', 'Vejlevej 20, 7000 Fredericia', '07:00 - 22:00', 55.565000, 9.752000, 4, 2),
('loc018', 'Wash World Kolding', 'Kolding', 'Vejlevej 132, 6000 Kolding', '07:00 - 22:00', 55.490000, 9.472000, 1, 0),
('loc019', 'Wash World Esbjerg', 'Esbjerg', 'Sædding Ringvej 6, 6710 Esbjerg', '07:00 - 22:00', 55.476500, 8.447400, 3, 1),
('loc020', 'Wash World Silkeborg', 'Silkeborg', 'Nordre Ringvej 90, 8600 Silkeborg', '07:00 - 22:00', 56.170000, 9.554000, 2, 1),
('loc021', 'Wash World Viborg', 'Viborg', 'Falkevej 25, 8800 Viborg', '07:00 - 22:00', 56.453000, 9.402000, 5, 3),
('loc022', 'Wash World Herning', 'Herning', 'Dæmningen 21, 7400 Herning', '07:00 - 22:00', 56.136000, 8.973000, 1, 0),
('loc023', 'Wash World Randers', 'Randers', 'Messingvej 10, 8940 Randers', '07:00 - 22:00', 56.460000, 10.036000, 0, 0),
('loc024', 'Wash World Aalborg Gug', 'Aalborg', 'Gammel Vissevej 1C, 9210 Aalborg', '07:00 - 22:00', 57.012000, 9.911000, 4, 2),
('loc025', 'Wash World Nørresundby', 'Nørresundby', 'Loftbrovej 2, 9400 Nørresundby', '07:00 - 22:00', 57.072600, 9.919500, 2, 1);
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
