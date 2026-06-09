# Portfolio CMS Setup Guide

This portfolio has been upgraded to a fully functional headless CMS powered by Supabase. To ensure your personal admin dashboard works and remains secure, follow these setup instructions.

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
```

### Where to get these values:

1. **Supabase URL & Anon Key**: 
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard).
   - Select your project.
   - Go to **Project Settings > API**.
   - Copy the `Project URL` to `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy the `anon` `public` key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2. **Admin Password**:
   - Create a strong, secure password. This is what you will use to log into `http://localhost:3000/admin` and your live site's admin route.

---

## 2. Supabase Storage Setup (Required for Uploads)

If you haven't already, you must create the storage buckets in Supabase for file uploads to work (Resume, Audio, Projects, Certifications).

1. Go to your Supabase Dashboard.
2. Navigate to **Storage** on the left menu.
3. Create the following **Public** buckets:
   - `media` (for generic images and project thumbnails)
   - `resumes` (for PDF resumes)
   - `audio` (for the hero intro track)

*Ensure these buckets are set to "Public" so the frontend can display the images/audio directly without signed URLs.*

---

## 3. Production Deployment (Vercel)

When deploying to Vercel, you must manually add these Environment Variables to your project settings.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your portfolio project.
3. Go to **Settings > Environment Variables**.
4. Add the exact same variables from your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`

5. **Redeploy** the application so Vercel picks up the new variables.

---

## 4. Usage

- Navigate to `/admin` on your website.
- Log in using your `ADMIN_PASSWORD`.
- Use the sidebar to manage every aspect of your site:
  - Text Content
  - Lists (Skills, Experience, Projects, Certs)
  - File Uploads (Images, Audio, PDFs)
  - Global Settings (SEO, Analytics)
- Use the **Backup & Restore** module periodically to download a JSON snapshot of your data.
