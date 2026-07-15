# Curvy& community setup

This is a deliberately small, no-login community system. Visitors can submit
reviews, votes, and missing-brand suggestions with the public Supabase key. New
reviews and brand suggestions remain private until you approve them.

## 1. Create the database

1. Create a Supabase project.
2. Open **SQL Editor** in Supabase.
3. Paste and run `migrations/202607150001_public_community.sql`.

The migration enables Row Level Security. Browser visitors can only read
published reviews and brands, and insert pending submissions. They cannot
publish, edit, or delete submissions themselves.

## 2. Connect the local site

Copy `.env.example` to `.env`, then fill in the values from **Project Settings →
API**:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Only use the publishable/anon key in the website. Never expose the service-role
key in a `VITE_` variable.

Restart the local development server after changing `.env`.

## 3. Connect Vercel

Add the same two variables in **Vercel → Project Settings → Environment
Variables**, enable them for Production, Preview, and Development, then redeploy.

## 4. Moderate reviews

Open **Table Editor → reviews**. New rows have `status = pending`.

- Set `status` to `published` to make a review public.
- Set `status` to `rejected` to keep it hidden.
- Delete a row when a visitor asks for removal.

## 5. Moderate missing brands

Open **Table Editor → community_brands**. New rows have `status = pending`.

- Check the brand name, website, category, sizing system, and description.
- Set `status` to `published` to add it to the public directory and converter.
- Set `status` to `rejected` to keep it hidden.
- Delete a row when a visitor asks for removal.

Published community brands are loaded from Supabase for every visitor and are
never stored as local-only directory entries.

Votes are public immediately. A random browser-only visitor ID limits each
browser to one current vote per brand. The visible total also includes a small,
deterministic editorial launch baseline stored in `src/data.ts`; Supabase stores
only real visitor votes. This is a lightweight MVP rather than
strong anti-abuse protection; CAPTCHA and server-side rate limiting can be added
when traffic grows.
