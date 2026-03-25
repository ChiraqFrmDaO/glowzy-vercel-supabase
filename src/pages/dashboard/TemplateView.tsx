import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Star, Eye, TrendingUp, User, Calendar, Tag } from "lucide-react";

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
  category?: string;
}

export default function TemplateView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTemplate(id);
    }
  }, [id]);

  const fetchTemplate = async (templateId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/templates/${templateId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTemplate(data);
    } catch (err) {
      console.error('Failed to fetch template:', err);
      setError('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const parseTags = (tags: string | string[]): string[] => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      try {
        return JSON.parse(tags);
      } catch {
        return tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const handleUseTemplate = async () => {
    if (!template) return;
    
    try {
      // Here you would implement the logic to apply the template
      console.log('Using template:', template.id);
      alert('Template applied successfully!');
    } catch (error) {
      console.error('Error using template:', error);
      alert('Failed to apply template');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-muted-foreground">Loading template...</div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-destructive">{error || 'Template not found'}</div>
          <button
            onClick={() => navigate('/dashboard/templates')}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/templates')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground">Template Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preview Image */}
          <div className="rounded-xl overflow-hidden border">
            {template.preview_image ? (
              <img
                src={template.preview_image}
                alt={template.name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-muted to-background flex items-center justify-center">
                <div className="text-muted-foreground">No preview image</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground">
              {template.description || 'No description available.'}
            </p>
          </div>

          {/* Tags */}
          {parseTags(template.tags).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {parseTags(template.tags).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleUseTemplate}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              Use Template
            </button>
            <button
              onClick={() => {
                const url = `${window.location.origin}/templates/${template.id}`;
                navigator.clipboard.writeText(url);
                alert('Template link copied to clipboard!');
              }}
              className="w-full py-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Share Template
            </button>
          </div>

          {/* Stats */}
          <div className="rounded-xl border p-4 space-y-4">
            <h3 className="font-semibold">Statistics</h3>
            
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{template.download_count || template.uses || 0} uses</span>
            </div>
            
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">⚡ {template.trending || 0} trending</span>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">@{template.author_username}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(template.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Badge */}
          {template.is_premium && (
            <div className="rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-amber-500">Premium Template</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                This template requires a premium subscription
              </p>
            </div>
          )}

          {/* Category */}
          {template.category && (
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium capitalize">{template.category}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
