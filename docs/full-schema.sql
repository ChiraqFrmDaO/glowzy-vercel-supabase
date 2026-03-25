-- ============================================
-- Full Database Schema - Lovable Cloud
-- Generated: 2026-03-09
-- ============================================

-- ===================
-- PROFILES
-- ===================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  display_name text,
  email text,
  description text DEFAULT '',
  location text DEFAULT '',
  avatar_url text,
  discord_username text,
  discord_avatar_url text,
  discord_connected boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- ===================
-- PROFILE CUSTOMIZATION
-- ===================
CREATE TABLE public.profile_customization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  primary_color text DEFAULT '#459bd1',
  secondary_color text DEFAULT '#121212',
  accent_color text DEFAULT '#000000',
  text_color text DEFAULT '#ffffff',
  icon_color text DEFAULT '#ffffff',
  background_color text DEFAULT '#080808',
  background_url text,
  background_effect text DEFAULT 'none',
  username_effect text DEFAULT 'none',
  custom_cursor_url text,
  profile_opacity integer DEFAULT 80,
  profile_blur integer DEFAULT 20,
  profile_gradient_enabled boolean DEFAULT true,
  glow_username boolean DEFAULT true,
  glow_socials boolean DEFAULT true,
  glow_badges boolean DEFAULT true,
  swap_box_colors boolean DEFAULT false,
  animated_title boolean DEFAULT false,
  monochrome_icons boolean DEFAULT true,
  volume_control boolean DEFAULT true,
  discord_decoration boolean DEFAULT true,
  use_discord_avatar boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_customization ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customization viewable by everyone" ON public.profile_customization FOR SELECT USING (true);
CREATE POLICY "Users can insert own customization" ON public.profile_customization FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own customization" ON public.profile_customization FOR UPDATE USING (auth.uid() = user_id);

-- ===================
-- SOCIAL LINKS
-- ===================
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  platform text NOT NULL,
  url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Links viewable by everyone" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Users can manage own links" ON public.social_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own links" ON public.social_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own links" ON public.social_links FOR DELETE USING (auth.uid() = user_id);

-- ===================
-- BADGES
-- ===================
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#3b82f6',
  is_premium boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges viewable by everyone" ON public.badges FOR SELECT USING (true);

-- Seed default badges
INSERT INTO public.badges (name, description, icon, color, is_premium) VALUES
  ('Staff', 'Platform staff member', '🛡️', '#ef4444', true),
  ('Verified', 'Verified user', '✅', '#3b82f6', false),
  ('Premium', 'Premium subscriber', '⭐', '#f59e0b', true),
  ('Early Supporter', 'Early platform supporter', '🌟', '#8b5cf6', false),
  ('Developer', 'Platform developer', '💻', '#10b981', false),
  ('Bug Hunter', 'Found and reported bugs', '🐛', '#06b6d4', false),
  ('Content Creator', 'Active content creator', '🎨', '#ec4899', false),
  ('Community Helper', 'Helps the community', '🤝', '#14b8a6', false);

-- ===================
-- USER BADGES
-- ===================
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badges(id),
  enabled boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can manage own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own badges" ON public.user_badges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own badges" ON public.user_badges FOR DELETE USING (auth.uid() = user_id);

-- ===================
-- PROFILE VIEWS (Analytics)
-- ===================
CREATE TABLE public.profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id uuid NOT NULL,
  viewer_ip text,
  user_agent text,
  device_type text,
  country text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert views" ON public.profile_views FOR INSERT WITH CHECK (profile_user_id IS NOT NULL);
CREATE POLICY "Users can view own analytics" ON public.profile_views FOR SELECT USING (auth.uid() = profile_user_id);

-- ===================
-- LINK CLICKS (Analytics)
-- ===================
CREATE TABLE public.link_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES public.social_links(id),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert clicks" ON public.link_clicks FOR INSERT WITH CHECK (link_id IS NOT NULL AND user_id IS NOT NULL);
CREATE POLICY "Users can view own clicks" ON public.link_clicks FOR SELECT USING (auth.uid() = user_id);

-- ===================
-- TEMPLATES
-- ===================
CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  config jsonb NOT NULL DEFAULT '{}',
  preview_url text,
  creator_id uuid,
  is_public boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  uses_count integer DEFAULT 0,
  trending_score integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public templates viewable by everyone" ON public.templates FOR SELECT USING (is_public = true OR auth.uid() = creator_id);
CREATE POLICY "Users can create templates" ON public.templates FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own templates" ON public.templates FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own templates" ON public.templates FOR DELETE USING (auth.uid() = creator_id);

-- ===================
-- TEMPLATE FAVORITES
-- ===================
CREATE TABLE public.template_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  template_id uuid NOT NULL REFERENCES public.templates(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, template_id)
);

ALTER TABLE public.template_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON public.template_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.template_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.template_favorites FOR DELETE USING (auth.uid() = user_id);

-- ===================
-- UPLOADED FILES
-- ===================
CREATE TABLE public.uploaded_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own files" ON public.uploaded_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload files" ON public.uploaded_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own files" ON public.uploaded_files FOR DELETE USING (auth.uid() = user_id);

-- ===================
-- FUNCTIONS & TRIGGERS
-- ===================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, email, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  INSERT INTO public.profile_customization (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================
-- STORAGE BUCKETS
-- ===================
-- Buckets: avatars, backgrounds, uploads, cursors (all public)
