-- Run this in your Supabase SQL Editor

-- 1. Create Projects Table
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
  tags TEXT[]
);

-- 2. Create Certifications Table
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

-- Note: In a production environment, you should enable Row Level Security (RLS)
-- and create policies that allow anyone to SELECT, but only authenticated
-- users to INSERT/UPDATE/DELETE. 

-- Example RLS setup:
-- ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access" ON public.projects FOR SELECT USING (true);
