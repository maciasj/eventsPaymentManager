# Deployment Guide 🚀

This guide will walk you through deploying your Event Manager PWA to production using free hosting services.

## Prerequisites ✅

- [ ] GitHub account (free)
- [ ] Netlify or Vercel account (free)
- [ ] Supabase account (optional, free)

## Step 1: Set Up Supabase (Optional)

If you want cross-device synchronization:

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: event-manager-pwa
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to you
6. Click "Create new project" (takes ~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, click "SQL Editor" in the sidebar
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see: "Success. No rows returned"

### 1.3 Get API Credentials

1. Click "Settings" (gear icon) in the sidebar
2. Click "API" under Configuration
3. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key under "Project API keys")

## Step 2: Push Code to GitHub

### 2.1 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Fill in:
   - **Name**: event-manager-pwa
   - **Description**: Progressive Web App for event and payment management
   - **Visibility**: Public
4. Click "Create repository"

### 2.2 Push Your Code

Open your terminal in the project directory and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Event Manager PWA"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/event-manager-pwa.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy to Netlify

### 3.1 Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" and sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Click "GitHub"
5. Authorize Netlify to access your repositories
6. Select your `event-manager-pwa` repository

### 3.2 Configure Build Settings

Netlify should auto-detect these settings:

- **Branch**: main
- **Build command**: `npm run build`
- **Publish directory**: `dist`

Leave these as-is and click "Deploy site"

### 3.3 Add Environment Variables

1. After deployment starts, click "Site settings"
2. Click "Environment variables" in the sidebar
3. Click "Add a variable" → "Add a single variable"
4. Add each of these (if using Supabase):

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: Your Supabase Project URL

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key

5. Click "Save"

### 3.4 Redeploy with Environment Variables

1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for deployment to complete (~2 minutes)

### 3.5 Your App is Live! 🎉

Your app URL will be something like: `https://random-name-123.netlify.app`

You can customize it:
1. Go to "Site configuration"
2. Click "Change site name"
3. Enter a custom name (e.g., `my-event-manager`)
4. Your new URL: `https://my-event-manager.netlify.app`

## Step 4: Test on iPhone

### 4.1 Open in Safari

1. On your iPhone, open Safari
2. Navigate to your Netlify URL
3. The app should load and work perfectly

### 4.2 Install as PWA

1. Tap the Share button (square with arrow)
2. Scroll down and tap "Add to Home Screen"
3. Edit the name if desired
4. Tap "Add"

### 4.3 Launch and Test

1. Find the app icon on your home screen
2. Tap to launch
3. It should open fullscreen like a native app!
4. Test offline:
   - Turn on Airplane mode
   - The app should still work
   - Create an event
   - Turn off Airplane mode
   - The event should sync to Supabase

## Alternative: Deploy to Vercel

If you prefer Vercel over Netlify:

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your `event-manager-pwa` repository
5. Vercel auto-detects Vite settings
6. Add environment variables:
   - Click "Environment Variables"
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
7. Click "Deploy"

## Troubleshooting 🔧

### Build Fails

**Error**: "Command failed: npm run build"

**Solution**: 
- Check that all dependencies are in `package.json`
- Run `npm install` and `npm run build` locally first
- Check build logs in Netlify/Vercel for specific errors

### App Loads But Shows Errors

**Error**: "Failed to fetch events"

**Solution**:
- Verify Supabase URL and key are correct
- Check Supabase dashboard → SQL Editor → run `SELECT * FROM events`
- Make sure RLS policies are set up correctly

### PWA Won't Install on iPhone

**Solutions**:
- Make sure you're using Safari (not Chrome)
- Check that site is served over HTTPS (Netlify/Vercel do this automatically)
- Clear Safari cache: Settings → Safari → Clear History and Website Data
- Force refresh: Hold down reload button → "Reload Without Content Blockers"

### Service Worker Not Updating

**Solution**:
- In Netlify/Vercel, trigger "Clear cache and deploy"
- On iPhone: Settings → Safari → Advanced → Website Data → Remove All

## Custom Domain (Optional) 🌐

### Using Netlify

1. Purchase a domain (e.g., from Namecheap, Google Domains)
2. In Netlify: Site settings → Domain management → Add custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (~24 hours)

### Free Netlify Domain

Your Netlify URL (e.g., `my-event-manager.netlify.app`) is free and works perfectly!

## Production Checklist ✅

Before sharing with users:

- [ ] App loads without errors
- [ ] All features work (calendar, events, monthly report)
- [ ] Can create, edit, and delete events
- [ ] Data persists across page reloads
- [ ] Works offline
- [ ] Can install to iPhone home screen
- [ ] Syncs when coming back online (if using Supabase)
- [ ] UI looks polished and professional
- [ ] No console errors

## Updates and Maintenance 🔄

### Deploying Updates

1. Make changes to your code locally
2. Test with `npm run dev`
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Netlify/Vercel automatically rebuilds and deploys!

### Monitoring

- Check Netlify/Vercel dashboard for:
  - Build status
  - Error logs
  - Bandwidth usage
- Check Supabase dashboard for:
  - Database usage (500MB limit on free tier)
  - API requests

## Need Help? 💬

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **PWA Guide**: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps/)

---

🎉 **Congratulations!** Your Event Manager PWA is now live and can be used on any device, including iPhone, without the App Store!
