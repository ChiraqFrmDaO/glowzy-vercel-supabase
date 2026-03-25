import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, X, Music, Image, MousePointer } from "lucide-react";
import { toast } from "sonner";

export default function Customize() {
  const { user, profile, refreshProfile } = useAuth();

  const [customization, setCustomization] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // File upload refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const cursorInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({});

  // local form state for fields that come from profile
  const [descriptionValue, setDescriptionValue] = useState("");
  const [locationValue, setLocationValue] = useState("");

  // sync local state when profile loads
  useEffect(() => {
    if (profile) {
      setDescriptionValue(profile.description || "");
      setLocationValue(profile.location || "");
      setUploadedFiles({
        avatar: profile.avatar_url || "",
        audio: customization.audio_url || "",
        cursor: customization.custom_cursor_url || "",
        background: customization.background_url || ""
      });
    }
  }, [profile, customization]);

  useEffect(() => {
    if (!user) return;
    loadCustomization();
  }, [user]);

  const loadCustomization = async () => {
    try {
      if (!user) return;

      const token = localStorage.getItem("token");
      console.log("Loading customization with token:", token ? "exists" : "missing");

      const resp = await fetch(`/api/profile-customization/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Failed to load customization:", resp.status, errorText);
        setCustomization({});
        return;
      }

      const data = await resp.json();
      setCustomization(data || {});

      // Set uploaded files from existing data
      if (data) {
        setUploadedFiles({
          avatar: profile?.avatar_url || "",
          audio: data.audio_url || "",
          cursor: data.custom_cursor_url || "",
          background: data.background_url || ""
        });
      }
    } catch (err) {
      console.error("Customization load error:", err);
      setCustomization({});
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (type: string, file: File) => {
    if (!user || !file) return;

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      // Log file details for debugging
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem("token");
      const resp = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${resp.status}`);
      }

      const result = await resp.json();
      const fileUrl = result.publicUrl;

      console.log('Upload successful:', result);

      // Update the appropriate field based on type
      if (type === 'avatar') {
        // Update profile avatar
        await fetch(`/api/profiles/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar_url: fileUrl }),
        });
        refreshProfile();
      } else {
        // Update customization field
        const fieldMap: { [key: string]: string } = {
          audio: 'audio_url',
          cursor: 'custom_cursor_url',
          background: 'background_url'
        };

        updateField(fieldMap[type], fileUrl);
      }

      setUploadedFiles(prev => ({ ...prev, [type]: fileUrl }));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to upload ${type}: ${errorMessage}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleFileSelect = (type: string) => {
    const inputRefs: { [key: string]: React.RefObject<HTMLInputElement> } = {
      avatar: avatarInputRef,
      audio: audioInputRef,
      cursor: cursorInputRef,
      background: backgroundInputRef
    };

    inputRefs[type]?.current?.click();
  };

  const updateField = (field: string, value: any) => {
    setCustomization((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const removeFile = async (type: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");

      if (type === 'avatar') {
        await fetch(`/api/profiles/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar_url: null }),
        });
        refreshProfile();
      } else {
        const fieldMap: { [key: string]: string } = {
          audio: 'audio_url',
          cursor: 'custom_cursor_url',
          background: 'background_url'
        };

        updateField(fieldMap[type], null);
      }

      setUploadedFiles(prev => ({ ...prev, [type]: '' }));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} removed`);
    } catch (error) {
      console.error('Remove error:', error);
      toast.error(`Failed to remove ${type}`);
    }
  };

  const save = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const { id, created_at, updated_at, ...updates } = customization;

      console.log("Current customization state:", customization);
      console.log("Updates to save:", updates);
      console.log("User ID:", user.id);

      if (Object.keys(updates).length === 0) {
        console.log("No changes to save");
        toast.info("No changes to save");
        return;
      }

      const resp = await fetch(`/api/profile-customization/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      console.log("Save response status:", resp.status);

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Save error:", resp.status, errorText);
        toast.error(`Save failed: ${errorText}`);
      } else {
        toast.success("Customization saved!");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save customization");
    } finally {
      setSaving(false);
    }
  };

  const updateDescription = async (desc: string) => {
    if (!user) return;

    await fetch(`/api/profiles/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ description: desc }),
    });

    refreshProfile();
  };

  const updateLocation = async (loc: string) => {
    if (!user) return;

    await fetch(`/api/profiles/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ location: loc }),
    });

    refreshProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center text-sm text-muted-foreground">Not logged in</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Assets Uploader</h1>

        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"

        refreshProfile();
      };

      if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              className="h-24 rounded-lg bg-muted/50 flex items-center justify-center border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden"
              onClick={() => handleFileSelect(key)}
            >
              {uploading[key] ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : uploadedFiles[key] ? (
                <div className="relative w-full h-full">
                  {key === 'audio' ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-xs text-primary ml-2">Audio uploaded</span>
                    </div>
                  ) : (
                    <img
                      src={uploadedFiles[key]}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(key);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <Icon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            <input
              ref={{
                avatar: avatarInputRef,
                audio: audioInputRef,
                cursor: cursorInputRef,
                background: backgroundInputRef
              }[key]}
              type="file"
              accept={{
                avatar: 'image/*',
                audio: 'audio/*',
                cursor: 'image/*,.cur',
                background: 'image/*,video/*'
              }[key]}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(key, file);
              }}
              className="hidden"
            />
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-foreground">Background Settings</h2>

      <div className="glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Background Image Upload */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">
              Background Image
            </label>
            <div
              className="h-32 rounded-lg bg-muted/50 flex items-center justify-center border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden group"
              onClick={() => handleFileSelect('background')}
            >
              {uploading.background ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : uploadedFiles.background ? (
                <div className="relative w-full h-full">
                  <img
                    src={uploadedFiles.background}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile('background');
                      }}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Click to upload background</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP (max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">
              Background Color (Fallback)
            </label>
            <div className="space-y-2">
              <input
                type="color"
                value={customization.background_color || '#000000'}
                onChange={(e) => updateField('background_color', e.target.value)}
                className="w-full h-10 rounded-lg border border-border cursor-pointer"
              />
              <input
                type="text"
                value={customization.background_color || ''}
                onChange={(e) => updateField('background_color', e.target.value)}
                placeholder="#000000"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">
            Background Effects
          </label>
          <select
            value={customization.background_effect || "none"}
            onChange={(e) => updateField("background_effect", e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="none">None</option>
            <option value="particles">Particles</option>
            <option value="rain">Rain</option>
            <option value="snow">Snow</option>
          </select>
        </div>

        {/* Preview */}
        {uploadedFiles.background && (
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">
              Full Background Preview
            </label>
            <div 
              className="h-48 rounded-lg border border-border relative overflow-hidden"
              style={{
                backgroundImage: `url(${uploadedFiles.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                backgroundColor: customization.background_color || 'transparent'
              }}
            >
              {/* Preview content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
                  <div className="text-center">
                    <div className="font-semibold">Background Preview</div>
                    <div className="text-xs opacity-80 mt-1">This will be your full profile background</div>
                  </div>
                </div>
              </div>
              
              {/* Preview effects */}
              {customization.background_effect && customization.background_effect !== 'none' && (
                <div className="absolute inset-0 pointer-events-none">
                  {customization.background_effect === 'particles' && (
                    <div className="particles-container">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full animate-pulse opacity-60"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your PNG background will cover the entire profile page
            </p>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-foreground">General Customization</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Description
            </label>

            <input
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              onBlur={(e) => updateDescription(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Username Effects
            </label>

            <select
              value={customization.username_effect || "none"}
              onChange={(e) => updateField("username_effect", e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="none">None</option>
              <option value="glow">Glow</option>
              <option value="rainbow">Rainbow</option>
              <option value="pulse">Pulse</option>
            </select>
          </div>
        </div>

        <div className="glass rounded-xl p-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Location
            </label>

            <input
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              onBlur={(e) => updateLocation(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}