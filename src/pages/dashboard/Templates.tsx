import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Star, Eye, TrendingUp, Link2, Plus, X, Image, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Template {
  id: number;
  name: string;
  description?: string;
  author_username: string;
  uses: number;
  download_count: number;
  trending: number;
  tags: string | string[];
  preview_image?: string;
  is_premium: boolean;
  created_at: string;
}

export default function Templates() {
  const [tab, setTab] = useState("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [myTemplates, setMyTemplates] = useState<Template[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState("public");
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const tabs = [
    { id: "library", label: "Template Library" },
    { id: "favorites", label: "Favorite Templates" },
    { id: "recent", label: "Last Used Templates" },
    { id: "uploads", label: "My Uploads" },
  ];

  useEffect(() => {
    fetchTemplates();
    fetchMyTemplates();
    fetchFavorites();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) { fetchTemplates(); fetchMyTemplates(); fetchFavorites(); }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const fetchTemplates = async (loadMore: boolean = false): Promise<void> => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setTemplates([]);
      }

      const offset = loadMore ? templates.length : 0;
      const response = await fetch(`/api/templates?limit=12&offset=${offset}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const processedTemplates = (data.templates || []).map((template: any) => ({
        ...template,
        is_premium: Boolean(template.is_premium),
        is_public: Boolean(template.is_public),
      }));

      if (loadMore) {
        setTemplates((prev) => [...prev, ...processedTemplates]);
      } else {
        setTemplates(processedTemplates);
      }

      setHasMore(data.hasMore || false);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      setError("Failed to load templates");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchMyTemplates = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch("/api/my-templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      const processed = (data || []).map((t: any) => ({
        ...t,
        is_premium: Boolean(t.is_premium),
        is_public: Boolean(t.is_public),
      }));
      setMyTemplates(processed);
    } catch (err) {
      console.error("Failed to fetch my templates:", err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/templates/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setFavorites((data || []).map((t: any) => t.id));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const toggleFavorite = async (templateId: number) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login to favorite templates"); return; }
    const isFav = favorites.includes(templateId);
    // Optimistic update
    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );
    try {
      const res = await fetch(`/api/templates/${templateId}/favorite`, {
        method: isFav ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      setFavorites((prev) =>
        isFav ? [...prev, templateId] : prev.filter((id) => id !== templateId)
      );
      toast.error("Failed to update favorite");
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) fetchTemplates(true);
  };

  const parseTags = (tags: string | string[]): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      return JSON.parse(tags);
    } catch {
      return tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  };

  const getRecentTemplateIds = (): number[] => {
    try { return JSON.parse(localStorage.getItem("template_recent") || "[]"); } catch { return []; }
  };

  const getActiveTemplates = (): Template[] => {
    let list: Template[] = [];
    if (tab === "library") list = templates;
    else if (tab === "favorites") list = templates.filter((t) => favorites.includes(t.id));
    // favorites are loaded from DB, so this correctly reflects server state
    else if (tab === "recent") {
      const recentIds = getRecentTemplateIds();
      list = recentIds.map((id) => templates.find((t) => t.id === id)).filter(Boolean) as Template[];
    }
    else if (tab === "uploads") list = myTemplates;
    return list.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parseTags(t.tags).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setPreviewImage(null);
    setPreviewImageUrl(null);
    setTemplateName("");
    setTagInput("");
    setTags([]);
    setVisibility("public");
  };

  const handleSubmitTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Template name is required");
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to create templates");
        return;
      }

      // Toon loading feedback
      const loadingToast = toast.loading("Creating template from your current customization...");

      const formData = new FormData();
      formData.append("name", templateName.trim());
      formData.append("description", "");
      formData.append("category", "bio");
      formData.append("tags", JSON.stringify(tags));
      formData.append("is_public", visibility === "public" ? "true" : "false");
      formData.append("is_premium", "false");
      if (previewImage) formData.append("preview", previewImage);

      console.log("Creating template with:", {
        name: templateName.trim(),
        tags,
        visibility,
        hasPreview: !!previewImage
      });

      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.error || "Failed to create template");
      }

      console.log("Template created successfully:", result);

      toast.success("Template created! Your current customization has been saved.");
      handleCloseModal();
      fetchTemplates();
    } catch (error: any) {
      console.error("Error creating template:", error);
      toast.error(error.message || "Failed to create template");
    } finally {
      setCreating(false);
    }
  };

  const handleUseTemplate = async (templateId: number) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to use templates");
        return;
      }

      // Toon loading toast
      const loadingToast = toast.loading("Applying template to your profile...");

      const response = await fetch(`/api/templates/${templateId}/use`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
  
      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to apply template");
      }
  
      console.log("Template applied:", data);
      
      // Toon success met aantal toegepaste velden
      const fieldsCount = data.fields_updated || 0;
      const message = fieldsCount > 0 
        ? `Template applied! ${fieldsCount} customization${fieldsCount !== 1 ? 's' : ''} updated.`
        : "Template applied successfully!";
      
      toast.success(message);

      // Sla op in recent history
      try {
        const recent: number[] = JSON.parse(localStorage.getItem("template_recent") || "[]");
        const updated = [templateId, ...recent.filter((id) => id !== templateId)].slice(0, 20);
        localStorage.setItem("template_recent", JSON.stringify(updated));
      } catch {}
      
      // Refresh templates om bijgewerkte uses count te tonen
      fetchTemplates();
      
      // Optioneel: navigeer naar customize pagina om veranderingen te zien
      setTimeout(() => {
        navigate(`/dashboard/customize`);
      }, 1500);

    } catch (error: any) {
      console.error("Error using template:", error);
      toast.error(error.message || "Failed to apply template");
    }
  };

  const handleViewTemplate = (templateId: number) => {
    navigate(`/dashboard/templates/${templateId}`);
  };

  const handleShareTemplate = (templateId: number) => {
    const url = `${window.location.origin}/templates/${templateId}`;
    navigator.clipboard.writeText(url);
    toast.success("Template link copied to clipboard!");
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-gradient-to-r from-blue-500/20 to-blue-400/10 rounded-xl p-4 border border-blue-500/20">
        <h1 className="text-lg font-bold text-foreground">
          Discover the perfect Glowzy.lol Template for your Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse community-created templates, or design your own.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm pb-1 transition-colors ${
                tab === t.id
                  ? "text-foreground border-b-2 border-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Explore community-created templates"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => fetchTemplates(false)}
          className="px-4 py-2.5 rounded-lg bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading templates...</div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-destructive">{error}</div>
          <button
            onClick={() => fetchTemplates(false)}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : getActiveTemplates().length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No templates found</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {getActiveTemplates().map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl overflow-hidden border border-transparent hover:border-primary/30 transition-all"
            >
              <div className="h-32 bg-gradient-to-br from-muted to-background relative">
                {template.preview_image && (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <button
                  onClick={() => toggleFavorite(template.id)}
                  className={`absolute top-2 right-2 hover:text-warning/80 transition-colors ${favorites.includes(template.id) ? "text-warning" : "text-muted-foreground"}`}
                >
                  <Star className={`w-4 h-4 ${favorites.includes(template.id) ? "fill-warning" : ""}`} />
                </button>
              </div>

              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-muted" />
                  <div>
                    <p className="text-xs font-medium text-foreground truncate">{template.name}</p>
                    <p className="text-[10px] text-muted-foreground">@{template.author_username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
                  <span className="flex items-center gap-0.5 text-success">
                    <Eye className="w-3 h-3" /> {template.download_count || template.uses || 0} uses
                  </span>
                  <span className="flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> ⚡ {template.trending || 0}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {parseTags(template.tags).map((tag, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 text-[9px] rounded bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => handleShareTemplate(template.id)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleViewTemplate(template.id)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 rounded-lg bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-sm font-bold text-foreground">Create Template</h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Fill in the details to create a new Template.<br />
                  This will create a template based on your current configuration.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground ml-3 mt-0.5 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Preview Image Upload */}
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Template Preview Image</p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-36 rounded-lg border border-border bg-muted/20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition-colors overflow-hidden"
                >
                  {previewImageUrl ? (
                    <img src={previewImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2">
                        <Image className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">Click to upload a file</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Template Name */}
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Template Name</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold select-none">A</span>
                  <input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="My New Template"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Template Tags */}
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Template Tags</p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-input border border-border">
                  <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Enter tag"
                    className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground min-w-0"
                  />
                  <button
                    onClick={handleAddTag}
                    className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                      >
                        #{tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-foreground transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Template Visibility */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <p className="text-xs font-medium text-foreground">Template Visibility</p>
                  <div className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] flex items-center justify-center font-bold cursor-help">?</div>
                </div>
                <div className="relative">
                  <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-5 pb-5">
              <button
                onClick={handleSubmitTemplate}
                disabled={creating || !templateName.trim()}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {creating ? "Creating..." : "Create Template"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}