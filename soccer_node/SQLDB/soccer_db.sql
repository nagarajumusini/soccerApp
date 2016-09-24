-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2016 at 11:20 AM
-- Server version: 10.1.8-MariaDB
-- PHP Version: 5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `soccer_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `soccer_matches`
--

CREATE TABLE `soccer_matches` (
  `id` int(11) NOT NULL,
  `lteam_id` int(11) NOT NULL,
  `rteam_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `soccer_matches`
--

INSERT INTO `soccer_matches` (`id`, `lteam_id`, `rteam_id`, `date`) VALUES
(9, 1, 2, '2016-09-21 23:52:12'),
(10, 1, 3, '2016-09-22 21:44:17'),
(11, 1, 4, '2016-09-24 20:44:19'),
(12, 2, 1, '2016-09-21 23:46:07'),
(13, 2, 3, '2016-09-23 21:40:06'),
(14, 2, 4, '2016-09-26 20:34:03'),
(15, 3, 2, '2016-09-26 20:41:06'),
(16, 3, 4, '2016-09-29 20:38:05'),
(17, 4, 5, '2016-09-20 19:34:01');

-- --------------------------------------------------------

--
-- Table structure for table `soccer_scores`
--

CREATE TABLE `soccer_scores` (
  `id` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `won_team_id` int(11) NOT NULL,
  `loss_team_id` int(11) NOT NULL,
  `isdraw` tinyint(1) NOT NULL DEFAULT '0',
  `goals` int(11) NOT NULL,
  `xgoals` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `soccer_scores`
--

INSERT INTO `soccer_scores` (`id`, `match_id`, `won_team_id`, `loss_team_id`, `isdraw`, `goals`, `xgoals`) VALUES
(4, 9, 2, 1, 0, 12, 8),
(5, 10, 1, 3, 1, 12, 12),
(6, 11, 4, 1, 0, 10, 2),
(7, 12, 2, 1, 0, 3, 1),
(8, 13, 3, 2, 0, 23, 21),
(9, 14, 4, 2, 1, 11, 11),
(10, 15, 3, 2, 0, 11, 1),
(11, 16, 3, 4, 0, 23, 1),
(12, 17, 4, 5, 1, 56, 5);

-- --------------------------------------------------------

--
-- Table structure for table `soccer_teams`
--

CREATE TABLE `soccer_teams` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `soccer_teams`
--

INSERT INTO `soccer_teams` (`id`, `name`) VALUES
(1, 'team1'),
(2, 'team2'),
(3, 'team3'),
(4, 'team4'),
(5, 'team5');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `soccer_matches`
--
ALTER TABLE `soccer_matches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `soccer_scores`
--
ALTER TABLE `soccer_scores`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `soccer_teams`
--
ALTER TABLE `soccer_teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `soccer_matches`
--
ALTER TABLE `soccer_matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `soccer_scores`
--
ALTER TABLE `soccer_scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `soccer_teams`
--
ALTER TABLE `soccer_teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
