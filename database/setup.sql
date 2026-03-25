-- LinkGlow MySQL Database Schema
-- Create database if it doesn't exist

CREATE DATABASE IF NOT EXISTS guns_lol_clone;
USE guns_lol_clone;

-- Users table with auto-increment ID
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profiles table with auto-increment ID
CREATE TABLE IF NOT EXISTS profiles (
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
CREATE TABLE IF NOT EXISTS profile_customization (
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
CREATE TABLE IF NOT EXISTS social_links (
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
CREATE TABLE IF NOT EXISTS link_clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES social_links(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Profile views table
CREATE TABLE IF NOT EXISTS profile_views (
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
CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
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

-- Template favorites table
CREATE TABLE IF NOT EXISTS template_favorites (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    template_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

-- Uploaded files table
CREATE TABLE IF NOT EXISTS uploaded_files (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert some default badges
INSERT IGNORE INTO badges (id, name, description, icon, color, is_premium) VALUES
('early-adopter', 'Early Adopter', 'One of the first users', 'star', '#FFD700', FALSE),
('premium', 'Premium', 'Premium member', 'crown', '#FF6B6B', TRUE),
('verified', 'Verified', 'Verified user', 'check', '#4ECDC4', FALSE),
('creator', 'Creator', 'Content creator', 'palette', '#45B7D1', FALSE);
