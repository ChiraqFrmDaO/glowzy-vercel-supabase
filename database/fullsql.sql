-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for guns_lol_clone
CREATE DATABASE IF NOT EXISTS `guns_lol_clone` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `guns_lol_clone`;

-- Dumping structure for table guns_lol_clone.badges
CREATE TABLE IF NOT EXISTS `badges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.badges: ~6 rows (approximately)
INSERT INTO `badges` (`id`, `name`, `description`, `icon`, `color`, `is_premium`, `created_at`) VALUES
	(1, 'Verified', 'Verified user badge', '✓', '#22c55e', 0, '2026-03-10 16:29:37'),
	(2, 'Pro', 'Pro user badge', '⭐', '#3b82f6', 1, '2026-03-10 16:29:37'),
	(3, 'Developer', 'Developer badge', '💻', '#8b5cf6', 1, '2026-03-10 16:29:37'),
	(4, 'Early Adopter', 'Early adopter badge', '🚀', '#f59e0b', 0, '2026-03-10 16:29:37'),
	(5, 'Admin', 'Administrator', '⚔', '	#0000F', 1, '2026-03-10 19:19:07'),
	(6, 'Owner', 'Owner', '👑', '#0000F', 1, '2026-03-11 11:40:47');

-- Dumping structure for table guns_lol_clone.link_clicks
CREATE TABLE IF NOT EXISTS `link_clicks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `link_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `link_id` (`link_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `link_clicks_ibfk_1` FOREIGN KEY (`link_id`) REFERENCES `social_links` (`id`) ON DELETE CASCADE,
  CONSTRAINT `link_clicks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.link_clicks: ~0 rows (approximately)

-- Dumping structure for table guns_lol_clone.profiles
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `discord_avatar_url` text DEFAULT NULL,
  `discord_connected` tinyint(1) DEFAULT 0,
  `discord_username` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `location` text DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.profiles: ~1 rows (approximately)
INSERT INTO `profiles` (`id`, `user_id`, `username`, `display_name`, `description`, `avatar_url`, `discord_avatar_url`, `discord_connected`, `discord_username`, `email`, `location`, `is_premium`, `created_at`, `updated_at`) VALUES
	(6, 6, 'dexter', NULL, 'dddddd', NULL, NULL, 0, NULL, 'dexterstore11@gmail.com', 'NL', 1, '2026-03-10 17:51:27', '2026-03-10 17:57:44');

-- Dumping structure for table guns_lol_clone.profile_customization
CREATE TABLE IF NOT EXISTS `profile_customization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `primary_color` varchar(7) DEFAULT NULL,
  `secondary_color` varchar(7) DEFAULT NULL,
  `accent_color` varchar(7) DEFAULT NULL,
  `text_color` varchar(7) DEFAULT NULL,
  `background_color` varchar(7) DEFAULT NULL,
  `background_url` text DEFAULT NULL,
  `background_effect` varchar(50) DEFAULT NULL,
  `icon_color` varchar(7) DEFAULT NULL,
  `profile_opacity` decimal(3,2) DEFAULT 1.00,
  `profile_blur` decimal(3,2) DEFAULT 0.00,
  `profile_gradient_enabled` tinyint(1) DEFAULT 0,
  `glow_username` tinyint(1) DEFAULT 0,
  `glow_socials` tinyint(1) DEFAULT 0,
  `glow_badges` tinyint(1) DEFAULT 0,
  `discord_decoration` tinyint(1) DEFAULT 0,
  `monochrome_icons` tinyint(1) DEFAULT 0,
  `swap_box_colors` tinyint(1) DEFAULT 0,
  `animated_title` tinyint(1) DEFAULT 0,
  `username_effect` varchar(50) DEFAULT NULL,
  `volume_control` tinyint(1) DEFAULT 0,
  `custom_cursor_url` text DEFAULT NULL,
  `use_discord_avatar` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `profile_customization_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.profile_customization: ~0 rows (approximately)
INSERT INTO `profile_customization` (`id`, `user_id`, `primary_color`, `secondary_color`, `accent_color`, `text_color`, `background_color`, `background_url`, `background_effect`, `icon_color`, `profile_opacity`, `profile_blur`, `profile_gradient_enabled`, `glow_username`, `glow_socials`, `glow_badges`, `discord_decoration`, `monochrome_icons`, `swap_box_colors`, `animated_title`, `username_effect`, `volume_control`, `custom_cursor_url`, `use_discord_avatar`, `created_at`, `updated_at`) VALUES
	(2, 6, NULL, NULL, NULL, NULL, NULL, NULL, 'particles', NULL, 1.00, 0.00, 0, 0, 0, 0, 0, 0, 0, 0, 'glow', 0, NULL, 0, '2026-03-10 17:51:27', '2026-03-10 19:08:56');

-- Dumping structure for table guns_lol_clone.profile_views
CREATE TABLE IF NOT EXISTS `profile_views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_user_id` int(11) NOT NULL,
  `viewer_ip` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `referrer` text DEFAULT NULL,
  `country` varchar(2) DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `profile_user_id` (`profile_user_id`),
  CONSTRAINT `profile_views_ibfk_1` FOREIGN KEY (`profile_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.profile_views: ~0 rows (approximately)
INSERT INTO `profile_views` (`id`, `profile_user_id`, `viewer_ip`, `user_agent`, `referrer`, `country`, `device_type`, `created_at`) VALUES
	(1, 6, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'http://localhost:8080/dashboard/badges', NULL, 'desktop', '2026-03-11 11:43:40'),
	(2, 6, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'http://localhost:8080/dashboard/badges', NULL, 'desktop', '2026-03-11 11:43:44'),
	(3, 6, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'http://localhost:8080/dashboard/badges', NULL, 'desktop', '2026-03-11 11:43:46'),
	(4, 6, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'http://localhost:8080/dashboard/badges', NULL, 'desktop', '2026-03-11 11:44:21'),
	(5, 6, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'http://localhost:8080/dashboard/badges', NULL, 'desktop', '2026-03-11 11:44:23'),
	(6, 6, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'http://localhost:8080/dashboard/badges', NULL, 'desktop', '2026-03-11 11:45:01'),
	(7, 6, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'http://localhost:8080/dashboard/badges', NULL, 'desktop', '2026-03-11 11:45:14');

-- Dumping structure for table guns_lol_clone.social_links
CREATE TABLE IF NOT EXISTS `social_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `url` text NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `social_links_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.social_links: ~2 rows (approximately)
INSERT INTO `social_links` (`id`, `user_id`, `platform`, `url`, `display_order`, `created_at`, `updated_at`) VALUES
	(2, 6, 'Discord', 'discord.gg/dexterstore', 0, '2026-03-10 18:52:20', '2026-03-10 18:52:30');

-- Dumping structure for table guns_lol_clone.templates
CREATE TABLE IF NOT EXISTS `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config`)),
  `preview_url` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `is_public` tinyint(1) DEFAULT 0,
  `trending_score` decimal(10,2) DEFAULT 0.00,
  `uses_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `templates_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.templates: ~3 rows (approximately)
INSERT INTO `templates` (`id`, `name`, `description`, `creator_id`, `config`, `preview_url`, `tags`, `is_public`, `trending_score`, `uses_count`, `created_at`, `updated_at`) VALUES
	(1, 'Minimal', 'Clean minimal design', NULL, '{"theme": "minimal", "layout": "centered"}', NULL, '["minimal", "clean"]', 1, 0.00, 0, '2026-03-10 16:29:37', '2026-03-10 16:29:37'),
	(2, 'Dark', 'Dark theme design', NULL, '{"theme": "dark", "layout": "centered"}', NULL, '["dark", "modern"]', 1, 0.00, 0, '2026-03-10 16:29:37', '2026-03-10 16:29:37'),
	(3, 'Colorful', 'Colorful vibrant design', NULL, '{"theme": "colorful", "layout": "centered"}', NULL, '["colorful", "vibrant"]', 1, 0.00, 0, '2026-03-10 16:29:37', '2026-03-10 16:29:37');

-- Dumping structure for table guns_lol_clone.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `premium` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.users: ~1 rows (approximately)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`, `premium`) VALUES
	(6, 'dexter', 'dexterstore11@gmail.com', '$2b$10$hLb6Z17Vy2dd4DWxHWhOj.ahdqSIPt9mm50AX07BgzcaqvOEd2Mze', '2026-03-10 17:51:27', '2026-03-10 17:57:47', '1');

-- Dumping structure for table guns_lol_clone.user_badges
CREATE TABLE IF NOT EXISTS `user_badges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `badge_id` int(11) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `badge_id` (`badge_id`),
  CONSTRAINT `user_badges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_badges_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5452 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.user_badges: ~1 rows (approximately)
INSERT INTO `user_badges` (`id`, `user_id`, `badge_id`, `enabled`, `created_at`) VALUES
	(6, 6, 6, 1, '2026-03-11 11:42:30');

-- Dumping structure for table guns_lol_clone.user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role` enum('admin','moderator') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_role` (`user_id`,`role`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table guns_lol_clone.user_roles: ~1 rows (approximately)
INSERT INTO `user_roles` (`id`, `user_id`, `role`, `created_at`) VALUES
	(6, 6, 'admin', '2026-03-10 19:25:40');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
