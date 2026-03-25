-- Add audio support to profile_customization table
ALTER TABLE profile_customization 
ADD COLUMN audio_url TEXT,
ADD COLUMN audio_files JSON,
ADD COLUMN audio_shuffle_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN show_audio_player BOOLEAN DEFAULT TRUE;
