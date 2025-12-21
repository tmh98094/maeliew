import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type?: 'organization' | 'person' | 'article' | 'service' | 'review';
  data?: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type = 'organization', data }) => {
  const getStructuredData = () => {
    const baseUrl = 'https://www.maeliewatelier.com';
    
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Mae Liew Atelier",
          "alternateName": "Mae Liew Makeup Artist",
          "url": baseUrl,
          "logo": `${baseUrl}/images/about/mae.webp`,
          "image": `${baseUrl}/images/about/mae.webp`,
          "description": "Award-winning bridal makeup artist in Kuala Lumpur. Top 10 Malaysian Bridal Makeup Artist by Marie France Asia.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kuala Lumpur",
            "addressLocality": "Kuala Lumpur",
            "addressRegion": "Federal Territory of Kuala Lumpur",
            "postalCode": "50000",
            "addressCountry": "MY"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 3.139003,
            "longitude": 101.686855
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+60122681879",
            "contactType": "customer service",
            "availableLanguage": ["English", "Malay", "Chinese"]
          },
          "sameAs": [
            "https://www.instagram.com/maeliew_atelier_workshop/",
            "https://www.facebook.com/maeliewmakeup/"
          ],
          "founder": {
            "@type": "Person",
            "name": "Mae Liew",
            "jobTitle": "Professional Makeup Artist",
            "description": "Award-winning makeup artist with 20+ years experience, former MAC Cosmetics consultant and Shu Uemura brand instructor."
          },
          "award": [
            "Top 10 Malaysian Bridal Makeup Artist by Marie France Asia 2023"
          ],
          "knowsAbout": [
            "Bridal Makeup",
            "Wedding Makeup",
            "ROM Makeup",
            "Celebrity Makeup",
            "Editorial Makeup",
            "High Fashion Makeup"
          ]
        };

      case 'person':
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Mae Liew",
          "jobTitle": "Professional Makeup Artist",
          "description": "Award-winning bridal makeup artist with 20+ years experience. Top 10 Malaysian Bridal Makeup Artist by Marie France Asia.",
          "image": `${baseUrl}/images/about/mae.webp`,
          "url": baseUrl,
          "sameAs": [
            "https://www.instagram.com/maeliew_atelier_workshop/",
            "https://www.facebook.com/maeliewmakeup/"
          ],
          "worksFor": {
            "@type": "Organization",
            "name": "Mae Liew Atelier"
          },
          "hasOccupation": {
            "@type": "Occupation",
            "name": "Makeup Artist",
            "occupationLocation": {
              "@type": "City",
              "name": "Kuala Lumpur"
            }
          },
          "award": [
            "Top 10 Malaysian Bridal Makeup Artist by Marie France Asia 2023"
          ],
          "alumniOf": [
            {
              "@type": "Organization",
              "name": "MAC Cosmetics"
            },
            {
              "@type": "Organization", 
              "name": "Shu Uemura"
            }
          ]
        };

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Bridal Makeup Services",
          "description": "Professional bridal makeup services including wedding makeup, ROM makeup, and pre-wedding photoshoot makeup.",
          "provider": {
            "@type": "Organization",
            "name": "Mae Liew Atelier"
          },
          "areaServed": {
            "@type": "State",
            "name": "Kuala Lumpur"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Makeup Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Bridal Makeup",
                  "description": "Complete bridal makeup service including trial session"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "ROM Makeup",
                  "description": "Registration of Marriage makeup service"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Celebrity Makeup",
                  "description": "Professional makeup for events and photoshoots"
                }
              }
            ]
          }
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data?.title || "Mae Liew Atelier Blog",
          "description": data?.description || "Professional makeup tips and wedding beauty advice",
          "image": data?.image || `${baseUrl}/images/about/mae.webp`,
          "author": {
            "@type": "Person",
            "name": "Mae Liew"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Mae Liew Atelier",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/images/about/mae.webp`
            }
          },
          "datePublished": data?.publishedTime || new Date().toISOString(),
          "dateModified": data?.modifiedTime || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data?.url || baseUrl
          }
        };

      case 'review':
        return {
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "Organization",
            "name": "Mae Liew Atelier"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": data?.author || "Satisfied Client"
          },
          "reviewBody": data?.content || "Exceptional makeup artistry and professional service."
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;