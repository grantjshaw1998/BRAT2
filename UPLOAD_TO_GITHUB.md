# 🚀 Upload Bible App v2.0 to GitHub

## Your Repository: https://github.com/grantjshaw1998/Bible-app-test-v2

Follow these exact steps to upload all your files:

## 📋 Step 1: Initialize Git (if not already done)
```bash
git init
```

## 📋 Step 2: Add Your GitHub Repository as Remote
```bash
git remote add origin https://github.com/grantjshaw1998/Bible-app-test-v2.git
```

## 📋 Step 3: Add All Files to Git
```bash
git add .
```

## 📋 Step 4: Commit All Files
```bash
git commit -m "Initial commit: Bible Research App v2.0 - Complete Bible study app with React, TypeScript, and Supabase"
```

## 📋 Step 5: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## 🔧 If You Get Authentication Errors:

### Option A: Use Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Use your username and token as password when prompted

### Option B: Use GitHub CLI (if installed)
```bash
gh auth login
git push -u origin main
```

## 📁 Files That Will Be Uploaded:

### Core Application Files:
- `src/` - All React components and TypeScript code
- `public/` - Static assets
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Database Scripts:
- `scripts/uploadBibleBooks.ts` - Upload Bible books
- `scripts/uploadSampleVerses.ts` - Upload sample verses
- `scripts/checkDatabase.ts` - Database verification

### Configuration Files:
- `.gitignore` - Git ignore rules
- `README.md` - Project documentation
- `components.json` - UI component configuration
- `postcss.config.cjs` - PostCSS configuration

### Supabase Migrations:
- `supabase/migrations/` - Database schema migrations

## 🎯 After Upload:

1. **Set Repository Description**: "Modern Bible study app with advanced search, note-taking, highlighting, and collaborative study features"

2. **Add Topics/Tags**: 
   - `bible-study`
   - `react`
   - `typescript`
   - `supabase`
   - `tailwindcss`
   - `bible-app`

3. **Enable Features**:
   - Issues (for bug reports)
   - Discussions (for community)
   - Wiki (for documentation)

4. **Set Up Environment Variables** (for deployment):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 🚀 Deploy to Netlify (Optional):

1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

Your Bible Research App v2.0 will be live and ready for the world to use!