import { PortfolioItem } from './contentModels'

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'portfolio-001',
    title: 'Romantic Garden Wedding',
    category: 'bridal',
    subcategory: 'outdoor-wedding',
    description: 'Soft, romantic bridal makeup perfect for an outdoor garden ceremony. Natural glowing skin with subtle enhancement of features.',
    images: {
      thumbnail: '/images/portfolio/bridal-thumb-1.webp',
      gallery: [
        '/images/portfolio/bridal-1.webp',
        '/images/portfolio/bridal-2.webp',
        '/images/portfolio/bridal-3.webp'
      ],
      featured: '/images/portfolio/bridal-featured-1.webp'
    },
    techniques: ['Airbrush foundation', 'Natural contouring', 'Waterproof formulas'],
    products: ['Giorgio Armani Luminous Silk', 'Charlotte Tilbury Pillow Talk'],
    client: 'Sarah M.',
    date: '2024-03-15',
    featured: true,
    caseStudyId: 'case-001'
  },
  {
    id: 'portfolio-002',
    title: 'High Fashion Editorial',
    category: 'editorial',
    subcategory: 'fashion-magazine',
    description: 'Bold, avant-garde makeup featuring geometric shapes and metallic accents for a high-fashion editorial spread.',
    images: {
      thumbnail: '/images/portfolio/editorial-thumb-1.webp',
      gallery: [
        '/images/portfolio/editorial-1.webp',
        '/images/portfolio/editorial-2.webp',
        '/images/portfolio/editorial-3.webp'
      ],
      featured: '/images/portfolio/editorial-featured-1.webp'
    },
    techniques: ['Geometric design', 'Metallic application', 'Color blocking'],
    products: ['Make Up For Ever Artist Color', 'Pat McGrath Labs Metallics'],
    client: 'Vogue Singapore',
    date: '2024-02-28',
    featured: true,
    caseStudyId: 'case-002'
  },
  {
    id: 'portfolio-003',
    title: 'Corporate Headshots',
    category: 'commercial',
    subcategory: 'corporate',
    description: 'Professional, polished makeup for corporate headshots that convey confidence and approachability.',
    images: {
      thumbnail: '/images/portfolio/commercial-thumb-1.webp',
      gallery: [
        '/images/portfolio/commercial-1.webp',
        '/images/portfolio/commercial-2.webp'
      ],
      featured: '/images/portfolio/commercial-featured-1.webp'
    },
    techniques: ['HD makeup', 'Color correction', 'Professional lighting'],
    products: ['Make Up For Ever HD Foundation', 'NARS Concealer'],
    client: 'Tech Startup Inc.',
    date: '2024-01-20',
    featured: false
  },
  {
    id: 'portfolio-004',
    title: 'Glamorous Evening Look',
    category: 'personal',
    subcategory: 'special-occasion',
    description: 'Sophisticated evening makeup with dramatic eyes and flawless complexion for a gala event.',
    images: {
      thumbnail: '/images/portfolio/personal-thumb-1.webp',
      gallery: [
        '/images/portfolio/personal-1.webp',
        '/images/portfolio/personal-2.webp'
      ],
      featured: '/images/portfolio/personal-featured-1.webp'
    },
    techniques: ['Smoky eyes', 'Highlighting', 'Long-wear formulas'],
    products: ['Tom Ford Eye Color Quad', 'Fenty Beauty Highlighter'],
    client: 'Private Client',
    date: '2024-04-05',
    featured: true
  },
  {
    id: 'portfolio-005',
    title: 'Natural Beauty Editorial',
    category: 'editorial',
    subcategory: 'beauty-editorial',
    description: 'Clean, natural beauty look focusing on healthy, glowing skin and subtle enhancement.',
    images: {
      thumbnail: '/images/portfolio/natural-thumb-1.webp',
      gallery: [
        '/images/portfolio/natural-1.webp',
        '/images/portfolio/natural-2.webp',
        '/images/portfolio/natural-3.webp'
      ],
      featured: '/images/portfolio/natural-featured-1.webp'
    },
    techniques: ['Skin prep', 'Minimal coverage', 'Natural enhancement'],
    products: ['Glossier Cloud Paint', 'RMS Beauty Living Luminizer'],
    client: 'Beauty Magazine',
    date: '2024-03-22',
    featured: false
  },
  {
    id: 'portfolio-006',
    title: 'Vintage Glamour Bridal',
    category: 'bridal',
    subcategory: 'vintage-inspired',
    description: 'Classic Hollywood glamour inspired bridal look with winged eyeliner and red lips.',
    images: {
      thumbnail: '/images/portfolio/vintage-thumb-1.webp',
      gallery: [
        '/images/portfolio/vintage-1.webp',
        '/images/portfolio/vintage-2.webp'
      ],
      featured: '/images/portfolio/vintage-featured-1.webp'
    },
    techniques: ['Winged eyeliner', 'Classic contouring', 'Bold lips'],
    products: ['MAC Ruby Woo', 'Stila Stay All Day Liner'],
    client: 'Emma K.',
    date: '2024-02-14',
    featured: true
  }
]

export const getPortfolioByCategory = (category: string) => {
  return portfolioItems.filter(item => item.category === category)
}

export const getFeaturedPortfolio = () => {
  return portfolioItems.filter(item => item.featured)
}

export const getPortfolioById = (id: string) => {
  return portfolioItems.find(item => item.id === id)
}