-- Add Stripe customer ID column to profiles table
ALTER TABLE profiles ADD COLUMN stripe_customer_id VARCHAR(255);

-- Fix uploaded_files table - drop and recreate with correct schema
DROP TABLE IF EXISTS uploaded_files;

CREATE TABLE uploaded_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
