# 📸 Image Storage Guide

## Where Are Your Images?

Your portfolio website now uses **Supabase Storage** to store and serve images. Here's how it works:

---

## 🗂️ Current Setup

### Supabase Storage Bucket
- **Bucket Name**: `portfolio-images`
- **Access**: Public (anyone can view)
- **Upload**: Authenticated users only (you need to be logged in to the admin panel)

### Your Current Images in Database

You have 2 portfolio items in your Supabase database:

1. **IMG-20250411-WA0080.jpg**
   - Status: Published
   - Path: `/uploads/IMG-20250411-WA0080.jpg` ⚠️ (needs to be re-uploaded)

2. **IMG_20250227_083058.jpg**
   - Status: Published
   - Path: `/uploads/IMG_20250227_083058.jpg` ⚠️ (needs to be re-uploaded)

**Problem**: These paths point to `/uploads/` which doesn't exist. The images need to be uploaded to Supabase Storage.

---

## ✅ How to Fix Your Existing Images

### Option 1: Re-upload Through Admin Panel (Recommended)

1. Go to your admin panel: `http://localhost:3000/#/admin`
2. Navigate to the **Portfolio** tab
3. Click **Edit** on each existing portfolio item
4. Upload the image file again
5. Click **Save**

The new upload will:
- Store the image in Supabase Storage
- Generate a public URL like: `https://odvxdynmfwkpgokneebu.supabase.co/storage/v1/object/public/portfolio-images/portfolio/1234567890-abc123.jpg`
- Update the database with the correct path

### Option 2: Manual Database Update (If you have the images locally)

If you have the original image files on your computer:

1. Upload them through the admin panel as new portfolio items
2. Delete the old entries with broken paths

---

## 🎨 How to Add New Portfolio Images

### Through Admin Panel (Easy Way)

1. **Login** to admin panel: `http://localhost:3000/#/admin`
2. Click **Portfolio** tab
3. Click **Add Portfolio Item** button
4. Fill in the form:
   - **Title**: Name of the work
   - **Description**: Details about the work
   - **Category**: Select from dropdown
   - **Project**: (Optional) Link to a project
   - **Alt Text**: For accessibility
   - **Tags**: Comma-separated (e.g., "bridal, makeup, outdoor")
   - **Status**: Choose "Published" to show on website
5. **Upload Image**: Click the upload button and select your image
6. Click **Save**

The image will automatically:
- Upload to Supabase Storage
- Get a public URL
- Appear on your Portfolio page

---

## 🔍 Where to View Your Images

### On Your Website
- **Portfolio Page**: `http://localhost:3000/#/portfolio`
- All published portfolio items will display here

### In Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/odvxdynmfwkpgokneebu
2. Click **Storage** in the left sidebar
3. Click **portfolio-images** bucket
4. You'll see all uploaded images organized by folder

### Image URLs
All images get a public URL like:
```
https://odvxdynmfwkpgokneebu.supabase.co/storage/v1/object/public/portfolio-images/portfolio/[filename]
```

---

## 📁 Folder Structure in Storage

```
portfolio-images/
└── portfolio/
    ├── 1734567890-abc123.jpg
    ├── 1734567891-def456.jpg
    └── 1734567892-ghi789.jpg
```

Each uploaded image gets a unique filename with timestamp to prevent conflicts.

---

## 🚀 What Changed

### Before
- Portfolio page showed mock/placeholder images from static data files
- Images were hardcoded in `src/data/portfolioContent.ts`
- No way to manage images dynamically

### After
- Portfolio page pulls from Supabase database
- Images stored in Supabase Storage (cloud-hosted)
- Full CRUD operations through admin panel
- Images automatically optimized and served via CDN

---

## 🛠️ Technical Details

### Storage Service
- Location: `src/services/storageService.ts`
- Handles: Upload, delete, list images
- Bucket: `portfolio-images` (public access)

### Portfolio Manager
- Location: `src/components/PortfolioManager.tsx`
- Features: Upload images, auto-generate URLs, delete from storage

### Portfolio Page
- Location: `pages/Portfolio.tsx`
- Now fetches from Supabase instead of static data
- Shows loading state while fetching
- Displays "No items" message if database is empty

---

## ⚠️ Important Notes

1. **Old Mock Images**: The old static portfolio data in `src/data/portfolioContent.ts` is no longer used
2. **Image Paths**: Always use the full Supabase Storage URL (starts with `https://`)
3. **Authentication**: You must be logged in to upload/delete images
4. **File Size**: Supabase free tier has storage limits (check your dashboard)
5. **Backup**: Consider backing up important images locally

---

## 🎯 Next Steps

1. **Re-upload your 2 existing portfolio items** with the actual image files
2. **Add more portfolio items** through the admin panel
3. **Test the Portfolio page** to see your images display correctly
4. **Delete old entries** with broken `/uploads/` paths

---

## 💡 Tips

- Use high-quality images (but not too large - aim for under 2MB)
- Fill in alt text for better SEO and accessibility
- Use descriptive titles and tags
- Set status to "Published" to show on website
- Use "Draft" status while working on items

---

## 🆘 Troubleshooting

### Images not showing?
- Check if status is "Published"
- Verify the file_path in database starts with `https://`
- Check browser console for errors
- Ensure you're logged in when uploading

### Upload failing?
- Check file size (max 50MB)
- Ensure you're authenticated
- Check browser console for errors
- Verify Supabase project is active

### Can't see images in Supabase Dashboard?
- Go to Storage → portfolio-images bucket
- If empty, images haven't been uploaded yet
- Try uploading through admin panel

---

**Your portfolio is now powered by Supabase! 🎉**
