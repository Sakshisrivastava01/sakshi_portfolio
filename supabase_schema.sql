-- Run this in your Supabase SQL Editor

-- 1. Hero
CREATE TABLE IF NOT EXISTS public.hero (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT 'Sakshi Srivastava',
  title TEXT DEFAULT 'AI/ML Engineer',
  subtitle TEXT DEFAULT 'Building the future of artificial intelligence',
  description TEXT,
  audio_url TEXT,
  profile_image_url TEXT
);

-- 2. About
CREATE TABLE IF NOT EXISTS public.about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT,
  career_objective TEXT,
  focus_areas TEXT[],
  highlights TEXT[]
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 100,
  icon TEXT,
  color TEXT
);

-- 4. Experience
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  metrics TEXT[],
  achievements TEXT[]
);

-- 5. Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  live_url TEXT,
  status TEXT DEFAULT 'In Progress',
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  banner_url TEXT,
  metrics TEXT[],
  tags TEXT[]
);

-- 6. Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  credential_id TEXT,
  verify_url TEXT,
  image_url TEXT,
  pdf_url TEXT,
  skills TEXT[]
);

-- 7. Education
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  cgpa TEXT,
  year TEXT,
  description TEXT
);

-- 8. Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  badge TEXT,
  link TEXT
);

-- 9. Contact
CREATE TABLE IF NOT EXISTS public.contact (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  location TEXT
);

-- 10. Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT
);

-- 11. Resume
CREATE TABLE IF NOT EXISTS public.resume (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pdf_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. Audio
CREATE TABLE IF NOT EXISTS public.audio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audio_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 13. SEO Settings
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_title TEXT,
  meta_description TEXT,
  open_graph_image TEXT,
  keywords TEXT[],
  favicon_url TEXT
);

-- 14. Analytics Settings
CREATE TABLE IF NOT EXISTS public.analytics_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  google_analytics_id TEXT,
  vercel_analytics_enabled BOOLEAN DEFAULT true
);

-- Storage Buckets Setup
-- Note: Buckets must typically be created via the Supabase Dashboard, but here is the logic:
-- Insert into storage.buckets (id, name, public) VALUES 
-- ('resumes', 'resumes', true),
-- ('certificates', 'certificates', true),
-- ('projects', 'projects', true),
-- ('audio', 'audio', true),
-- ('media', 'media', true);

-- Example Row Level Security (RLS) Setup
-- Enables SELECT for everyone, but INSERT/UPDATE/DELETE requires auth
-- ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access" ON public.hero FOR SELECT USING (true);
