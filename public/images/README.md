# Image Directory Structure

This directory contains organized image assets for the Mae Liew Atelier website.

## Directory Structure

```
public/images/
├── portfolio/          # Portfolio and work samples
├── about/             # About page images (headshots, behind-the-scenes)
├── services/          # Service-related images and process photos
├── blog/              # Blog post images and content
└── general/           # General website assets (logos, icons, backgrounds)
```

## Image Naming Convention

### Standard Images
- Use descriptive, kebab-case names: `bridal-makeup-session-1.jpg`
- Include category prefix when helpful: `editorial-fashion-shoot.jpg`

### Responsive Images
- Add width suffix for different sizes: `bridal-makeup-session-1-640w.jpg`
- Supported widths: 320w, 640w, 768w, 1024w, 1200w, 1920w

### Optimized Formats
- WebP versions: `bridal-makeup-session-1.webp`
- AVIF versions: `bridal-makeup-session-1.avif`
- Thumbnails: `bridal-makeup-session-1-thumb.jpg`

## Image Optimization Guidelines

1. **Original Images**: High-quality originals (1920px max width)
2. **WebP Format**: Modern format with better compression
3. **AVIF Format**: Next-gen format for supported browsers
4. **Thumbnails**: Small versions for blur placeholders (50-100px width)
5. **Responsive Sizes**: Multiple sizes for different screen resolutions

## Usage Examples

```typescript
// Using LazyImage component
<LazyImage
  category="portfolio"
  filename="bridal-makeup-session-1.jpg"
  alt="Elegant bridal makeup with soft glam finish"
  aspectRatio="4/3"
/>

// Using ResponsiveImage component
<ResponsiveImage
  category="about"
  filename="mae-liew-headshot.jpg"
  alt="Mae Liew professional headshot"
  breakpoints={{
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw'
  }}
/>
```

## Performance Features

- **Lazy Loading**: Images load only when entering viewport
- **Format Detection**: Automatically serves best supported format
- **Progressive Loading**: Blur placeholder while loading
- **Responsive Images**: Serves appropriate size for device
- **Intersection Observer**: Efficient viewport detection
- **Framer Motion**: Smooth loading animations