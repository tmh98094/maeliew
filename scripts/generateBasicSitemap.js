import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSitemap = () => {
  const baseUrl = 'https://www.maeliewatelier.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages with their priorities and change frequencies
  const staticPages = [
    { path: '', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/services', changefreq: 'monthly', priority: '0.9' },
    { path: '/portfolio', changefreq: 'weekly', priority: '0.9' },
    { path: '/blog', changefreq: 'daily', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.7' }
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  
  console.log(`✅ Sitemap generated with ${staticPages.length} URLs`);
  console.log(`📁 Saved to: ${sitemapPath}`);
  
  return staticPages.length;
};

// Generate robots.txt
const generateRobotsTxt = () => {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin
Disallow: /api/
Disallow: /_next/
Disallow: /src/

# Sitemap
Sitemap: https://www.maeliewatelier.com/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1`;

  const publicDir = path.join(__dirname, '..', 'public');
  const robotsPath = path.join(publicDir, 'robots.txt');
  
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
  
  console.log('✅ robots.txt generated');
  console.log(`📁 Saved to: ${robotsPath}`);
};

// Run the generators
const main = () => {
  console.log('🚀 Generating SEO files...\n');
  
  try {
    const urlCount = generateSitemap();
    generateRobotsTxt();
    
    console.log('\n🎉 SEO files generated successfully!');
    console.log(`📊 Total URLs in sitemap: ${urlCount}`);
    console.log('\n📝 Next steps:');
    console.log('1. Submit sitemap to Google Search Console');
    console.log('2. Submit sitemap to Bing Webmaster Tools');
    console.log('3. Monitor indexing status');
    console.log('4. Add Google Analytics tracking ID to Analytics component');
  } catch (error) {
    console.error('❌ Error generating SEO files:', error);
  }
};

main();