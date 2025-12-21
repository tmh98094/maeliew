import fs from 'fs';
import path from 'path';
import { CRMService } from '../src/services/crmService';
import { titleToSlug } from '../src/utils/slugUtils';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

const generateSitemap = async () => {
  const baseUrl = 'https://www.maeliewatelier.com';
  const urls: SitemapUrl[] = [];

  // Static pages
  const staticPages = [
    { path: '', changefreq: 'weekly' as const, priority: '1.0' },
    { path: '/about', changefreq: 'monthly' as const, priority: '0.8' },
    { path: '/services', changefreq: 'monthly' as const, priority: '0.9' },
    { path: '/portfolio', changefreq: 'weekly' as const, priority: '0.9' },
    { path: '/blog', changefreq: 'daily' as const, priority: '0.8' },
    { path: '/contact', changefreq: 'monthly' as const, priority: '0.7' }
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  try {
    // Dynamic blog posts
    const blogPosts = await CRMService.getAllContent({
      type: 'blog',
      status: 'published',
      limit: 100
    });

    if (blogPosts) {
      blogPosts.forEach(post => {
        const slug = titleToSlug(post.title);
        urls.push({
          loc: `${baseUrl}/blog/${slug}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.6'
        });
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');

  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
  console.log(`📁 Saved to: ${sitemapPath}`);
  
  return urls.length;
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

  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
  
  console.log('✅ robots.txt generated');
  console.log(`📁 Saved to: ${robotsPath}`);
};

// Run the generators
const main = async () => {
  console.log('🚀 Generating SEO files...\n');
  
  try {
    const urlCount = await generateSitemap();
    generateRobotsTxt();
    
    console.log('\n🎉 SEO files generated successfully!');
    console.log(`📊 Total URLs in sitemap: ${urlCount}`);
    console.log('\n📝 Next steps:');
    console.log('1. Submit sitemap to Google Search Console');
    console.log('2. Submit sitemap to Bing Webmaster Tools');
    console.log('3. Monitor indexing status');
  } catch (error) {
    console.error('❌ Error generating SEO files:', error);
  }
};

if (require.main === module) {
  main();
}

export { generateSitemap, generateRobotsTxt };