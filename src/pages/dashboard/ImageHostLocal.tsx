import { useState, useEffect } from "react";
import { useAuth } from "@/components/local/AuthProvider";
import { localStorage } from "@/integrations/local/storage";
import { saveUploadedFile, getUserFiles, deleteFile as deleteFileFromDb } from "@/integrations/local/client";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Copy, Trash2, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file_name: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  public_url: string;
  created_at: string;
}

export default function ImageHostLocal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadFiles();
  }, [user]);

  const loadFiles = async () => {
    if (!user) return;
    const data = getUserFiles(user.id);
    setFiles(data);
  };

  const uploadFile = async (file: File) => {
    if (!user) return;
    
    try {
      setUploading(true);
      
      const uploadedFile = await localStorage.uploadFile(user.id, file);
      
      // Save to database
      saveUploadedFile({
        id: uploadedFile.id,
        user_id: user.id,
        file_name: uploadedFile.fileName,
        original_name: uploadedFile.originalName,
        file_size: uploadedFile.fileSize,
        mime_type: uploadedFile.mimeType,
        storage_path: uploadedFile.storagePath,
        public_url: uploadedFile.publicUrl,
      });

      setFiles([{
        id: uploadedFile.id,
        file_name: uploadedFile.fileName,
        original_name: uploadedFile.originalName,
        file_size: uploadedFile.fileSize,
        mime_type: uploadedFile.mimeType,
        public_url: uploadedFile.publicUrl,
        created_at: new Date().toISOString(),
      }, ...files]);
      
      toast.success("File uploaded!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Link copied!");
  };

  const deleteFile = async (file: UploadedFile) => {
    if (!user) return;
    
    try {
      await localStorage.deleteFile(user.id, file.file_name);
      deleteFileFromDb(file.id, user.id);
      setFiles(files.filter(f => f.id !== file.id));
      toast.success("File deleted");
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl glass rounded-2xl p-6 relative">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Image Host (Local)</h2>
              <p className="text-sm text-muted-foreground mt-1">Upload and host your images locally</p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]); }}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) uploadFile(f); };
                input.click();
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer mb-6 ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}>
              {uploading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground font-medium">Drag & drop or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WEBP up to 10MB</p>
                </>
              )}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    <img src={file.public_url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.original_name}</p>
                    <p className="text-[10px] text-muted-foreground">{(file.file_size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={() => copyLink(file.public_url)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    {copied === file.public_url ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => deleteFile(file)}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!open && (
        <button onClick={() => setOpen(true)} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          <ImageIcon className="w-4 h-4 inline mr-2" /> Open Image Host
        </button>
      )}
    </div>
  );
}
