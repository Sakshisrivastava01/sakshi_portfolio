# Portfolio CMS Setup Guide

This portfolio has been upgraded to a fully functional headless CMS powered by Supabase. To ensure your personal admin dashboard works and remains secure, follow these setup instructions carefully.

**Do NOT commit your `.env.local` file to version control.**

---

## 1. Local Development Setup

Create a `.env.local` file in the root directory of this project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Admin Panel Security
ADMIN_PASSWORD=your-secure-admin-password
JWT_SECRET=your-supabase-jwt-secret
```

### Where to get these values:

1. **Supabase URL & Anon Key**: 
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard).
   - Select your project.
   - Go to **Project Settings > API**.
   - Copy the `Project URL` to `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy the `anon` `public` key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2. **JWT Secret**:
   - Go to **Project Settings > API**.
   - Under the **JWT Settings** section, copy the `JWT Secret` to `JWT_SECRET`.
   - *This is critical. It allows your Next.js app to sign secure tokens that Supabase trusts.*

3. **Admin Password**:
   - Create a strong, secure password. This is what you will use to log into `http://localhost:3000/admin` and your live site's admin route.

---

## 2. Supabase Database Security (RLS) - CRITICAL

To prevent unauthorized users from modifying your database using your public `anon` key, you **must** enable Row Level Security (RLS).

1. Go to your Supabase Dashboard.
2. Navigate to **SQL Editor** on the left menu.
3. Create a new query and paste the following SQL script to lock down all your tables:

```sql
-- Enable RLS on all tables
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_settings ENABLE ROW LEVEL SECURITY;

-- Create a policy allowing ANYONE to SELECT (Read-only public access)
CREATE POLICY "Public Read Access" ON hero FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON about FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON experience FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON education FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON contact FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON social_links FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON resume FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON audio FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON analytics_settings FOR SELECT USING (true);

-- Create a policy allowing ONLY AUTHENTICATED ADMINS to INSERT/UPDATE/DELETE
-- This checks that the JWT has role = 'authenticated'
CREATE POLICY "Admin Write Access" ON hero FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON contact FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON resume FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON audio FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Access" ON analytics_settings FOR ALL USING (auth.role() = 'authenticated');
```

4. Click **Run**. Your database is now secure.

---

## 3. Supabase Storage Setup & Security

You must create the storage buckets and secure them so public users can view images/resumes but cannot upload malicious files.

1. Go to your Supabase Dashboard.
2. Navigate to **Storage**.
3. Create the following **Public** buckets:
   - `media`
   - `resumes`
   - `audio`

4. Go to **Storage > Policies**.
5. For **each** of the 3 buckets, create the following two policies:

   - **Policy 1 (Public Read):**
     - Allowed Operations: `SELECT`
     - Target Roles: `anon`, `authenticated`
     - Policy Definition: `true`

   - **Policy 2 (Admin Write):**
     - Allowed Operations: `INSERT`, `UPDATE`, `DELETE`
     - Target Roles: `authenticated`
     - Policy Definition: `true`

---

## 4. Production Deployment (Vercel)

When deploying to Vercel, you must manually add these Environment Variables to your project settings.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your portfolio project.
3. Go to **Settings > Environment Variables**.
4. Add the exact same variables from your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`

5. **Redeploy** the application so Vercel picks up the new variables.

---

## 5. Usage & Backups

- Navigate to `/admin` on your website.
- Log in using your `ADMIN_PASSWORD`.
- Use the **Backup & Restore** module periodically to download a JSON snapshot of your data.
- **Restore Procedure**: To restore from a JSON backup, simply upload the file in the Backup module. It will automatically upsert the records.
