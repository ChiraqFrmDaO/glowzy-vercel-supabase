#!/bin/bash

# Database Migration Script for Audio Manager
# This script adds the necessary database fields for multiple audio support

echo "🎵 Running Audio Manager database migration..."

# Check if MySQL is available
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed or not in PATH"
    echo "Please install MySQL and ensure it's running"
    exit 1
fi

# Database connection details (update these with your actual credentials)
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_NAME=${DB_NAME:-guns_lol_clone}

echo "📊 Connecting to database: $DB_NAME at $DB_HOST"

# Run the migration
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << 'EOF'
-- Add audio support to profile_customization table
ALTER TABLE profile_customization 
ADD COLUMN audio_url TEXT,
ADD COLUMN audio_files JSON;

-- Show the updated table structure
DESCRIBE profile_customization;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo "🎉 Your Audio Manager is now ready to use!"
else
    echo "❌ Migration failed. Please check your database connection and permissions."
fi
