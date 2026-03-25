@echo off
REM Database Migration Script for Audio Manager (Windows)
REM This script adds the necessary database fields for multiple audio support

echo 🎵 Running Audio Manager database migration...

REM Check if MySQL is available
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL is not installed or not in PATH
    echo Please install MySQL and ensure it's running
    pause
    exit /b 1
)

REM Database connection details (update these with your actual credentials)
set DB_HOST=%DB_HOST:-localhost%
set DB_USER=%DB_USER:-root%
set DB_PASSWORD=%DB_PASSWORD:-
set DB_NAME=%DB_NAME:-guns_lol_clone%

echo 📊 Connecting to database: %DB_NAME% at %DB_HOST%

REM Run the migration
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < "..\database\add_audio_support.sql"

if %errorlevel% equ 0 (
    echo ✅ Migration completed successfully!
    echo 🎉 Your Audio Manager is now ready to use!
) else (
    echo ❌ Migration failed. Please check your database connection and permissions.
)

pause
