import { useState, useRef } from "react";
import { Music, Upload, Edit2, Trash2, Plus, Shuffle, Play, Volume2 } from "lucide-react";
import { toast } from "sonner";

interface AudioFile {
  id: string;
  name: string;
  artist?: string;
  url: string;
}

interface AudioManagerProps {
  audios: AudioFile[];
  onAudiosChange: (audios: AudioFile[]) => void;
  maxAudios?: number;
  isPremium?: boolean;
  shuffleEnabled?: boolean;
  onShuffleChange?: (enabled: boolean) => void;
  showPlayer?: boolean;
  onShowPlayerChange?: (show: boolean) => void;
}

export default function AudioManager({ 
  audios, 
  onAudiosChange, 
  maxAudios = 1, 
  isPremium = false,
  shuffleEnabled = false,
  onShuffleChange,
  showPlayer = true,
  onShowPlayerChange
}: AudioManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingArtist, setEditingArtist] = useState("");
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    if (audios.length >= maxAudios) {
      toast.error(`Maximum ${maxAudios} audio${maxAudios > 1 ? 's' : ''} allowed`);
      return;
    }
    audioInputRef.current?.click();
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);

    try {
      if (file.size > 500 * 1024 * 1024) {
        throw new Error("Max file size 500MB");
      }

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const resp = await fetch("/api/audio-upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await resp.json();

      if (!resp.ok) throw new Error(result.error);

      const newAudio: AudioFile = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        artist: "", // Empty artist field for user to fill in
        url: result.publicUrl,
      };

      onAudiosChange([...audios, newAudio]);
      toast.success("Audio uploaded");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAudio = (id: string) => {
    onAudiosChange(audios.filter(audio => audio.id !== id));
    toast.success("Audio removed");
  };

  const startEditing = (audio: AudioFile) => {
    setEditingId(audio.id);
    setEditingName(audio.name);
    setEditingArtist(audio.artist || "");
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    console.log('Saving edit with name:', editingName, 'artist:', editingArtist);
    console.log('Current audio files:', audios);
    
    onAudiosChange(audios.map(audio => 
      audio.id === editingId ? { ...audio, name: editingName, artist: editingArtist } : audio
    ));
    
    setEditingId(null);
    setEditingName("");
    setEditingArtist("");
    toast.success("Audio name updated");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingArtist("");
  };

  const shuffleAudios = () => {
    const shuffled = [...audios].sort(() => Math.random() - 0.5);
    onAudiosChange(shuffled);
    toast.success("Audios shuffled");
  };

  return (
    <div className="space-y-4">

      {/* Audio list */}
      <div className="space-y-2">
        {audios.map((audio) => (
          <div 
            key={audio.id} 
            className="flex items-center gap-3 p-3 bg-background/50 border border-border rounded-lg"
          >
            <Music className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            
            {editingId === audio.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  placeholder="Track name"
                  className="w-full bg-background border border-border rounded px-2 py-1 text-sm"
                  autoFocus
                />
                <input
                  type="text"
                  value={editingArtist}
                  onChange={(e) => setEditingArtist(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  placeholder="Artist name"
                  className="w-full bg-background border border-border rounded px-2 py-1 text-sm"
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="text-sm font-medium truncate">{audio.name}</div>
                {audio.artist && (
                  <div className="text-xs text-muted-foreground truncate">{audio.artist}</div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => startEditing(audio)}
                className="p-1 hover:bg-background/80 rounded transition-colors"
                title="Edit name"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => removeAudio(audio.id)}
                className="p-1 hover:bg-destructive/20 rounded transition-colors text-destructive"
                title="Remove audio"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {audios.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No audio files added yet</p>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-2">Audio Settings</h4>
        
        {/* Shuffle Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Shuffle Playback</span>
          </div>
          <button
            onClick={() => onShuffleChange?.(!shuffleEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              shuffleEnabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              shuffleEnabled ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Show Player Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Show Player on Profile</span>
          </div>
          <button
            onClick={() => onShowPlayerChange?.(!showPlayer)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              showPlayer ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              showPlayer ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleFileSelect}
          disabled={uploading || audios.length >= maxAudios}
          className="flex items-center justify-center gap-2 w-full p-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Audio
            </>
          )}
        </button>

        {audios.length > 1 && (
          <button
            onClick={shuffleAudios}
            className="flex items-center justify-center gap-2 w-full p-2 bg-background/50 hover:bg-background/80 border border-border rounded-lg transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle Audios
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          // Reset input value to allow selecting the same file again
          e.target.value = '';
        }}
      />
    </div>
  );
}
