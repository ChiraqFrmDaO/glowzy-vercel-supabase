# Audio Manager Setup Guide

The Audio Manager allows you to upload, manage, and organize multiple audio files for your profile.

## 🚀 Quick Setup

### 1. Database Migration
First, run the database migration to add support for multiple audio files:

**Windows:**
```bash
cd scripts
migrate-audio.bat
```

**Mac/Linux:**
```bash
cd scripts
chmod +x migrate-audio.sh
./migrate-audio.sh
```

**Manual SQL:**
If the scripts don't work, run this SQL directly in your MySQL client:
```sql
ALTER TABLE profile_customization 
ADD COLUMN audio_url TEXT,
ADD COLUMN audio_files JSON;
```

### 2. Start the Development Server
```bash
npm run dev
```

## 📱 Using the Audio Manager

1. **Navigate to Customize**: Go to your dashboard and click on "Customize"
2. **Audio Manager Section**: You'll see the new Audio Manager below the asset uploaders
3. **Add Audio**: Click "Add Audio" to upload new audio files (MP3, WAV, etc.)
4. **Manage Files**: 
   - Click the edit icon to rename audio files
   - Click the trash icon to remove audio files
   - Use "Shuffle Audios" to randomize the order

## 🎯 Features

- **Multiple Audio Support**: Upload up to 4 audio files (Premium users)
- **Edit Names**: Click the edit icon to customize audio file names
- **Remove Files**: Easily remove unwanted audio files
- **Shuffle Order**: Randomize the playback order
- **Premium Limits**: Free users get 1 audio, Premium users get up to 4
- **Backward Compatibility**: Existing single audio files continue to work

## 🔧 Technical Details

### Database Schema
- `audio_url`: Single audio file URL (backward compatibility)
- `audio_files`: JSON array of audio objects with id, name, and url

### Audio Object Structure
```json
{
  "id": "unique-id",
  "name": "Audio Name",
  "url": "/uploads/filename.mp3"
}
```

### File Upload Limits
- Maximum file size: 10MB
- Supported formats: MP3, WAV, OGG, M4A
- Maximum files: 1 (free), 4 (premium)

## 🐛 Troubleshooting

### Audio Not Playing
1. Check if the database migration was applied
2. Verify the audio files are uploaded correctly
3. Check browser console for errors

### Upload Issues
1. Ensure file size is under 10MB
2. Check file format is supported
3. Verify you're logged in

### Database Errors
1. Run the migration script again
2. Check MySQL connection details
3. Verify database permissions

## 🔄 Migration Notes

The system maintains full backward compatibility:
- Existing `audio_url` fields continue to work
- Single audio files are automatically migrated to the new format
- No data loss during the upgrade

## 🎨 Customization

You can modify the Audio Manager settings in `src/pages/dashboard/Customize.tsx`:
```tsx
<AudioManager
  audios={audioFiles}
  onAudiosChange={handleAudioFilesChange}
  maxAudios={4}        // Change max audio limit
  isPremium={false}    // Check user premium status
/>
```

Enjoy your new Audio Manager! 🎵
