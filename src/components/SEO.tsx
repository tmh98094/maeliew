import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = "Mae Liew Atelier - Top 10 Malaysian Bridal Makeup Artist",
  description = "Award-winning bridal makeup artist in Kuala Lumpur. Top 10 Malaysian Bridal Makeup Artist by Marie France Asia. Specializing in wedding, ROM, and celebrity makeup with 20+ years experience.",
  keywords = "bridal makeup artist Malaysia, wedding makeup KL, makeup artist Kuala Lumpur, bridal makeup, ROM makeup, celebrity makeup artist, Mae Liew, makeup artist Malaysia, wedding makeup artist, bridal beauty Malaysia",
  image = "https://www.maeliewatelier.com/images/about/mae.webp",
  url = "https://www.maeliewatelier.com",
  type = "website",
  author = "Mae Liew",
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const siteTitle = title.includes('Mae Liew Atelier') ? title : `${title} | Mae Liew Atelier`;
  const fullUrl = url.startsWith('http') ? url : `https://www.maeliewatelier.com${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://www.maeliewatelier.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Mae Liew Atelier" />
      <meta property="og:locale" content="en_MY" />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@maeliewatelier" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Geographic and Business Meta Tags */}
      <meta name="geo.region" content="MY-14" />
      <meta name="geo.placename" content="Kuala Lumpur" />
      <meta name="geo.position" content="3.139003;101.686855" />
      <meta name="ICBM" content="3.139003, 101.686855" />
      
      {/* Mobile and Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#E63946" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </Helmet>
  );
};

export default SEO;