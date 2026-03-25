-- LinkGlow MySQL Database Schema
-- Clean and recreate database with auto-increment ID's

DROP DATABASE IF EXISTS guns_lol_clone;
CREATE DATABASE guns_lol_clone;
USE guns_lol_clone;

-- Users table with auto-increment ID
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profiles table with auto-increment ID
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    description TEXT,
    avatar_url TEXT,
    discord_avatar_url TEXT,
    discord_connected BOOLEAN DEFAULT FALSE,
    discord_username VARCHAR(50),
    email VARCHAR(255),
    location VARCHAR(100),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Profile customization table
CREATE TABLE profile_customization (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    accent_color VARCHAR(7),
    text_color VARCHAR(7),
    background_color VARCHAR(7),
    background_url TEXT,
    background_effect VARCHAR(50),
    icon_color VARCHAR(7),
    profile_opacity DECIMAL(3,2) DEFAULT 1.0,
    profile_blur DECIMAL(3,2) DEFAULT 0.0,
    profile_gradient_enabled BOOLEAN DEFAULT FALSE,
    glow_username BOOLEAN DEFAULT FALSE,
    glow_socials BOOLEAN DEFAULT FALSE,
    glow_badges BOOLEAN DEFAULT FALSE,
    discord_decoration BOOLEAN DEFAULT FALSE,
    monochrome_icons BOOLEAN DEFAULT FALSE,
    swap_box_colors BOOLEAN DEFAULT FALSE,
    animated_title BOOLEAN DEFAULT FALSE,
    username_effect VARCHAR(50),
    volume_control BOOLEAN DEFAULT FALSE,
    custom_cursor_url TEXT,
    use_discord_avatar BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Social links table
CREATE TABLE social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Link clicks table
CREATE TABLE link_clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES social_links(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Profile views table
CREATE TABLE profile_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_user_id INT NOT NULL,
    viewer_ip VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    device_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Badges table
CREATE TABLE badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges table
CREATE TABLE user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- Templates table
CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id INT,
    config JSON NOT NULL,
    preview_url TEXT,
    tags JSON,
    is_public BOOLEAN DEFAULT FALSE,
    trending_score DECIMAL(10,2) DEFAULT 0,
    uses_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert some default badges
INSERT INTO badges (name, description, icon, color, is_premium) VALUES
('Verified', 'Verified user badge', '✓', '#22c55e', FALSE),
('Pro', 'Pro user badge', '⭐', '#3b82f6', TRUE),
('Developer', 'Developer badge', '💻', '#8b5cf6', FALSE),
('Early Adopter', 'Early adopter badge', '🚀', '#f59e0b', FALSE);

-- Insert some default templates
INSERT INTO templates (name, description, creator_id, config, is_public, tags) VALUES
('Minimal', 'Clean minimal design', NULL, '{"theme": "minimal", "layout": "centered"}', TRUE, '["minimal", "clean"]'),
('Dark', 'Dark theme design', NULL, '{"theme": "dark", "layout": "centered"}', TRUE, '["dark", "modern"]'),
('Colorful', 'Colorful vibrant design', NULL, '{"theme": "colorful", "layout": "centered"}', TRUE, '["colorful", "vibrant"]');
