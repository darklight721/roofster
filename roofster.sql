-- phpMyAdmin SQL Dump
-- version 3.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 21, 2012 at 03:50 PM
-- Server version: 5.5.25a
-- PHP Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `roofster`
--

-- --------------------------------------------------------

--
-- Table structure for table `roof`
--

CREATE TABLE IF NOT EXISTS `roof` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(16) NOT NULL,
  `address` varchar(256) NOT NULL,
  `city` varchar(128) NOT NULL,
  `country` varchar(128) NOT NULL,
  `rate` int(11) NOT NULL DEFAULT '0',
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `contact_person` varchar(128) NOT NULL,
  `contact_number` varchar(128) NOT NULL,
  `details` text,
  `email` varchar(128) DEFAULT NULL,
  `passcode` varchar(16) DEFAULT NULL,
  `date_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `roof`
--

INSERT INTO `roof` (`id`, `type`, `address`, `city`, `country`, `rate`, `latitude`, `longitude`, `contact_person`, `contact_number`, `details`, `email`, `passcode`, `date_added`) VALUES
(1, 'room', '', 'Cebu City', 'Philippines', 0, 0, 0, '', '', '', '', '', '2012-08-21 13:02:13'),
(2, 'room', 'gfs', 'Cebu City', 'Philippines', 543, 0, 0, 'tre', 'tret', 'ytre', 'tre@gfd.com', 'fsddf', '2012-08-21 13:30:32'),
(3, 'room', 'tret', 'Cebu City', 'Philippines', 54654, 0, 0, 'gfds', 'gfds', 'gfdsgfd', 'tre@fdsgf.vom', 'gfdgfd', '2012-08-21 13:33:41');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
