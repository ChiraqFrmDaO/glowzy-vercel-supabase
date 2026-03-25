# PowerShell script to run the database migration
Write-Host "🎵 Running Audio Manager database migration..."

# Database connection details
$DB_HOST = "localhost"
$DB_USER = "root"
$DB_PASSWORD = ""  # Update if you have a password
$DB_NAME = "guns_lol_clone"

Write-Host "📊 Connecting to database: $DB_NAME at $DB_HOST"

# Read and execute the SQL file
$SQL_CONTENT = Get-Content "..\database\add_audio_support.sql" -Raw

try {
    # Try to connect and execute
    $connection = New-Object System.Data.MySqlClient.MySqlConnection
    $connection.ConnectionString = "Server=$DB_HOST;Database=$DB_NAME;Uid=$DB_USER;Pwd=$DB_PASSWORD;"
    
    $connection.Open()
    $command = $connection.CreateCommand()
    $command.CommandText = $SQL_CONTENT
    $command.ExecuteNonQuery()
    
    $connection.Close()
    
    Write-Host "✅ Migration completed successfully!"
    Write-Host "🎉 Your Audio Manager is now ready to use!"
} catch {
    Write-Host "❌ Migration failed: $($_.Exception.Message)"
    Write-Host "Please check your MySQL connection and try running the SQL manually."
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
