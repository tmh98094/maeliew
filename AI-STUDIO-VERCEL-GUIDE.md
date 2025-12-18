# AI Studio to Vercel Deployment Guide

## Common Issues with Google AI Studio Exports

When downloading projects from Google AI Studio, they come with configurations that cause **blank page deployments** on Vercel. This guide fixes all common issues.

---

## 🚨 Known Problems

### 1. **Tailwind CDN in Production**
- AI Studio uses `<script src="https://cdn.tailwindcss.com"></script>` 
- **Problem**: CDN is blocked in production builds
- **Solution**: Remove CDN, use PostCSS plugin

### 2. **Bleeding Edge Versions**
- React 19.x (too new, compatibility issues)
- Tailwind v4 (unstable, requires special config)
- Vite 6.x (breaking changes)
- **Solution**: Downgrade to stable LTS versions

### 3. **Git Branch Mismatch**
- Local git initializes with `master` branch
- GitHub default is `main` branch
- Vercel deploys from `main`
- **Problem**: Pushing to `master` won't trigger deployment
- **Solution**: Rename branch to `main`

---

## ✅ Step-by-Step Fix

### Step 1: Fix package.json
Replace dependencies with stable versions:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.6.2",
    "vite": "^5.4.11"
  }
}
```

### Step 2: Remove Tailwind CDN from index.html
**Remove** any lines containing:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = { ... }
</script>
```

Ensure you have the module script:
```html
<script type="module" src="/index.tsx"></script>
```

### Step 3: Create tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Add your custom theme here
    },
  },
  plugins: [],
}
```

### Step 4: Create postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 5: Update index.css
Use Tailwind v3 syntax (NOT v4):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased;
  }
}
```

**Do NOT use:**
- `@import "tailwindcss"`
- `@theme { ... }` (Tailwind v4 only)

### Step 6: Update vite.config.ts
Remove any Tailwind Vite plugin imports:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ... other config
});
```

**Do NOT include:**
- `import tailwindcss from '@tailwindcss/vite'`
- `tailwindcss()` in plugins array

### Step 7: Clean Install
```bash
# Stop all dev servers first!
# Then:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build  # Test build works
```

### Step 8: Fix Git Branch
```bash
git branch -M main  # Rename to main
git remote add origin https://github.com/username/repo
git push -u origin main --force
```

---

## 🚀 Vercel Deployment Checklist

1. ✅ Verify GitHub repo is on `main` branch
2. ✅ Import project in Vercel
3. ✅ Framework Preset: **Vite**
4. ✅ Build Command: `vite build` or `npm run build`
5. ✅ Output Directory: `dist`
6. ✅ Node Version: **18.x** or **20.x**
7. ✅ If blank page: **Clear Build Cache** in Vercel settings

---

## 🔍 Debugging Tips

### Blank Page on Vercel?
**Check browser console:**
- CDN warning? → Remove Tailwind CDN from index.html
- Module errors? → Check React/Vite versions
- 404 on JS files? → Check build output directory is `dist`

### Local Build Fails?
```bash
# Check for version conflicts
npm list react react-dom tailwindcss vite

# If corrupted node_modules:
rm -rf node_modules package-lock.json
npm install
```

### Git Push Doesn't Trigger Vercel?
```bash
# Check which branch you're on
git branch

# If on master, switch to main
git branch -M main
git push -u origin main --force
```

---

## 📋 Quick Reference Commands

```bash
# Clean start
rm -rf node_modules package-lock.json dist
npm cache clean --force
npm install

# Test locally
npm run dev      # Should work on localhost
npm run build    # Should complete without errors

# Deploy
git add .
git commit -m "Fix AI Studio config for production"
git push origin main
```

---

## ⚠️ Common Mistakes to Avoid

1. ❌ Don't use React 19.x for production
2. ❌ Don't use Tailwind v4 (use v3.4.x)
3. ❌ Don't leave Tailwind CDN in index.html
4. ❌ Don't push to `master` if Vercel expects `main`
5. ❌ Don't skip clearing Vercel build cache

---

## ✨ Expected File Structure

```
project/
├── index.html              # NO CDN, has module script
├── index.tsx              # React 18 createRoot
├── index.css              # @tailwind directives (v3 syntax)
├── package.json           # React 18, Tailwind v3, Vite 5
├── tailwind.config.js     # PostCSS config
├── postcss.config.js      # PostCSS plugins
├── vite.config.ts         # NO tailwindcss() plugin
├── components/            # Your components
└── public/               # Static assets
    └── images/
```

---

**Last Updated:** 2025-11-27  
**Tested With:** React 18.3.1, Tailwind 3.4.17, Vite 5.4.11, Vercel
