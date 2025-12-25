import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { EnhancedTestimonials } from '../src/components/RichContentSections';
import { SmoothPageTransition } from '../src/components/AdvancedUIComponents';
import InstagramGallery from '../src/components/InstagramGallery';
import StatsCards from '../src/components/StatsCards';
import AnimatedFeaturedShowreel from '../src/components/AnimatedFeaturedShowreel';
import PartnersGrid from '../src/components/PartnersGrid';
import SEO from '../src/components/SEO';
import StructuredData from '../src/components/StructuredData';

// --- DATA ---
const HERO_IMAGES = [
  {
    desktop: "/images/general/hero (2).webp",
    mobile: "/images/mobilehero1.webp"
  },
  {
    desktop: "/images/general/hero (3).webp",
    mobile: "/images/mobilehero2.webp"
  },
  {
    desktop: "/images/general/hero (4).webp",
    mobile: "/images/mobilehero3.webp"
  }
];

const CATEGORIES = [
  { id: 'wedding', label: 'Wedding' },
  { id: 'rom', label: 'ROM' },
  { id: 'celebrity', label: 'Celebrity' },
];

const getPortfolioPreviews = () => {
  try {
    const savedCollections = localStorage.getItem('curatedCollections');
    if (savedCollections) {
      const collections = JSON.parse(savedCollections);
      const previews: any = {};
      collections.forEach((collection: any) => {
        previews[collection.category] = collection.images;
      });
      return previews;
    }
  } catch (error) {
    console.error('Error loading curated collections:', error);
  }

  // Fallback to default
  return {
    wedding: ["/images/portfolio/wd.webp", "/images/portfolio/wd1.webp", "/images/portfolio/wd2.webp"],
    rom: ["/images/portfolio/rom1.webp", "/images/portfolio/rom3.webp", "/images/portfolio/rom2.webp"],
    celebrity: ["/images/about/ceb1.webp", "/images/about/ceb2.webp", "/images/about/ceb3.webp"]
  };
};

const SERVICES_PREVIEW = [
  {
    title: "The Wedding",
    subtitle: "Bridal Artistry",
    image: "/images/general/wedding2.webp",
    link: "/services"
  },
  {
    title: "ROM",
    subtitle: "Conceptual Shoots",
    image: "/images/general/ROM.webp",
    link: "/services"
  },
  {
    title: "Personal Makeup",
    subtitle: "High Fashion",
    image: "/images/general/personal.webp",
    link: "/services"
  }
];



// --- COMPONENTS ---

const AchievementItem: React.FC<{
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  align: 'left' | 'right'
}> = ({ title, subtitle, desc, image, align }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", amount: 0.5 });

  return (
    <div ref={ref} className="h-screen w-full flex items-center justify-center sticky top-0 bg-[#0a0a0a] overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        initial={{ scale: 1.2 }}
        animate={isInView ? { scale: 1 } : { scale: 1.2 }}
        transition={{ duration: 10, ease: "linear" }}
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </motion.div>

      <div className={`relative z-10 max-w-6xl mx-auto px-6 w-full flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <motion.div
          className="bg-black/80 backdrop-blur-sm p-8 md:p-16 max-w-xl border-l-4 border-[#E63946]"
          initial={{ opacity: 0, x: align === 'right' ? 50 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: align === 'right' ? 50 : -50 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#E63946] uppercase tracking-[0.3em] text-xs font-bold mb-4 block">{subtitle}</span>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-none">{title}</h2>
          <p className="text-gray-300 font-light leading-relaxed">{desc}</p>
        </motion.div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const [activeTab, setActiveTab] = useState<'wedding' | 'rom' | 'celebrity'>('wedding');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [portfolioPreviews, setPortfolioPreviews] = useState(getPortfolioPreviews());

  // Hero Carousel Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load curated collections on mount and listen for changes
  useEffect(() => {
    const loadCollections = () => {
      setPortfolioPreviews(getPortfolioPreviews());
    };

    // Load initially
    loadCollections();

    // Listen for storage changes (when admin updates collections)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'curatedCollections') {
        loadCollections();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SmoothPageTransition className="w-full bg-[#fdfbf7]">
      <SEO
        title="Mae Liew Atelier - Top 10 Malaysian Bridal Makeup Artist"
        description="Award-winning bridal makeup artist in Kuala Lumpur. Top 10 Malaysian Bridal Makeup Artist by Marie France Asia. Specializing in wedding, ROM, and celebrity makeup with 20+ years experience."
        keywords="bridal makeup artist Malaysia, wedding makeup KL, makeup artist Kuala Lumpur, bridal makeup, ROM makeup, celebrity makeup artist, Mae Liew, makeup artist Malaysia, wedding makeup artist, bridal beauty Malaysia"
        url="https://www.maeliewatelier.com"
        image="https://www.maeliewatelier.com/images/about/mae.webp"
      />
      <StructuredData type="organization" />
      <StructuredData type="person" />
      <StructuredData type="service" />

      {/* 1. HERO CAROUSEL */}
      <section className="h-[100vh] w-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-black">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentHeroIndex}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <motion.div
                style={{ y: yHero }}
                className="w-full h-full"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: "easeOut" }} // Ken Burns Effect
              >
                <picture className="w-full h-full block">
                  <source media="(max-width: 768px)" srcSet={HERO_IMAGES[currentHeroIndex].mobile} />
                  <img
                    src={HERO_IMAGES[currentHeroIndex].desktop}
                    alt="Mae Liew Atelier Hero"
                    className="w-full h-full object-cover brightness-[0.65]"
                  />
                </picture>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase font-light mb-6">Est. 2008 • Kuala Lumpur</p>
            <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl tracking-tighter leading-none mb-8">
              The Art of <br /> <span className="italic font-light">Timeless Beauty</span>
            </h1>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {HERO_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-500 ${i === currentHeroIndex ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Cards - positioned before "More than makeup" section */}
      <StatsCards className="bg-[#fdfbf7]" />

      {/* Animated Featured Showreel */}
      <AnimatedFeaturedShowreel className="bg-[#fdfbf7]" />

      {/* Partners Grid */}
      <PartnersGrid className="bg-[#fdfbf7]" />

      {/* 2. INTRO - Mobile Friendly Swipe */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-[2px] bg-[#E63946] mb-8"></div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
              More than makeup.<br />An <span className="text-gray-400 italic">experience.</span>
            </h2>
            <p className="text-gray-600 font-light leading-loose text-lg mb-8">
              With over 20 years of experience, Mae Liew brings high-fashion discipline to every face she touches. Trained in Japan and a former instructor for global brands.
            </p>
            <Link to="/about" className="text-sm uppercase tracking-widest font-bold border-b border-black pb-1">Read Story</Link>
          </div>
          {/* Mobile Swipeable Gallery with Hidden Scrollbar */}
          <div className="flex overflow-x-auto snap-x gap-4 md:gap-0 pb-8 md:pb-0 md:block no-scrollbar">
            <img src="images/about/mae.webp" alt="Mae Liew" className="w-[85vw] md:w-full flex-shrink-0 snap-center shadow-xl object-cover aspect-[3/4]" />
            <img src="https://picsum.photos/600/800?random=about2" alt="Mae Liew Work" className="w-[85vw] md:hidden flex-shrink-0 snap-center shadow-xl object-cover aspect-[3/4]" />
          </div>
        </div>
      </section>

      {/* 3. IMPACT ACHIEVEMENTS (Sticky Scroll) */}
      <section className="relative bg-black">
        <div className="text-center py-20 bg-black text-white">
          <h3 className="uppercase tracking-[0.3em] text-[#E63946] text-xs font-bold mb-4">Milestones</h3>
          <h2 className="font-serif text-4xl">A Legacy of Excellence</h2>
        </div>

        <AchievementItem
          title="Tinashe"
          subtitle="International R&B Artist"
          desc="Commissioned for exclusive event styling. Trusted by global icons for red carpet precision and stage-ready durability."
          image="/images/about/tinashe2.webp"
          align="left"
        />
        <AchievementItem
          title="Shu Uemura"
          subtitle="Japan-Trained Excellence"
          desc="Former Brand Instructor for Shu Uemura, trained in Japan. Mastered the art of precision and technique that defines Japanese beauty standards."
          image="/images/about/shuuemura.webp"
          align="right"
        />
        <AchievementItem
          title="MAC Cosmetics"
          subtitle="Global Beauty Authority"
          desc="Consultant for MAC Cosmetics with record-breaking sales achievements. A mentor to the next generation of makeup artists worldwide."
          image="/images/about/mac2.webp"
          align="left"
        />
        <AchievementItem
          title="TVB Actresses"
          subtitle="Hong Kong Magazine"
          desc="The preferred artist for Tavia Yeung, Chrissie Chau, and Gin Lee. Delivering high-definition perfection for the camera."
          image="/images/about/hongkong.webp"
          align="right"
        />
      </section>

      {/* 4. OUR SERVICES ANIMATED SECTION */}
      <section className="py-16 md:py-32 px-6 bg-[#111] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h3 className="uppercase tracking-[0.3em] text-[#E63946] text-xs font-bold mb-4">Our Expertise</h3>
            <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl px-4">Crafting Your Look</h2>
          </div>

          {/* Mobile: Simple Cards / Desktop: Horizontal Accordion */}
          <div className="block md:hidden">
            {/* Mobile Layout - Simple Cards */}
            <div className="space-y-6">
              {SERVICES_PREVIEW.map((svc, i) => (
                <motion.div
                  key={`mobile-${i}`}
                  className="relative group h-[280px] overflow-hidden rounded-xl border border-white/20"
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={svc.link} className="block w-full h-full">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={svc.image}
                        alt={svc.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                      <span className="text-[#E63946] text-xs uppercase tracking-widest mb-2 block">{svc.subtitle}</span>
                      <h3 className="font-serif text-xl mb-3 leading-tight">{svc.title}</h3>
                      <div className="w-full h-[2px] bg-white mb-3"></div>
                      <div className="flex items-center gap-2 text-sm uppercase tracking-widest">
                        Explore <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop Layout - Horizontal Accordion */}
          <div className="hidden md:flex gap-4 h-[600px]">
            {SERVICES_PREVIEW.map((svc, i) => (
              <motion.div
                key={`desktop-${i}`}
                className="relative group flex-1 overflow-hidden border border-white/20 cursor-pointer rounded-lg"
                whileHover={{ flexGrow: 3 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Link to={svc.link} className="block w-full h-full">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>

                  {/* Content - Hover-only on Desktop */}
                  <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                    <span className="text-[#E63946] text-xs uppercase tracking-widest mb-2 block translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">{svc.subtitle}</span>
                    <h3 className="font-serif text-3xl lg:text-4xl mb-2 leading-tight">{svc.title}</h3>
                    <div className="w-8 group-hover:w-full h-[2px] bg-white transition-all duration-500"></div>
                    <div className="mt-4 flex items-center gap-2 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      Explore <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CURATED WORKS (Tabs & Swipe) */}
      <section className="py-24 px-6 bg-[#f4f1ea]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8">
            <h2 className="font-serif text-4xl mb-4 text-gray-900 text-center md:text-left">Curated Collections</h2>
            <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 no-scrollbar justify-center md:justify-start">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as any)}
                  className={`text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === cat.id ? 'text-black font-bold border-b-2 border-[#E63946]' : 'text-gray-400'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {/* Mobile: Swipeable. Desktop: Grid. Added no-scrollbar */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              className="flex overflow-x-auto snap-x gap-4 md:grid md:grid-cols-3 pb-8 md:pb-0 no-scrollbar"
            >
              {portfolioPreviews[activeTab]?.map((src, i) => (
                <div key={i} className="min-w-[80vw] md:min-w-0 snap-center relative aspect-[3/4] group cursor-pointer">
                  <img
                    src={src}
                    alt="Portfolio"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 md:bg-black/0 md:group-hover:bg-black/20 transition-all"></div>
                </div>
              )) || []}
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-[#E63946]">View All <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* 6. ENHANCED TESTIMONIALS */}
      <EnhancedTestimonials />

      {/* 7. INSTAGRAM GALLERY */}
      <section className="py-20 bg-white">
        <div className="text-center mb-12">
          <a href="https://instagram.com/maeliew_atelier" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-serif text-2xl hover:text-[#E63946]">
            📸 @maeliew_atelier
          </a>
          <p className="text-gray-600 mt-4">Follow our latest work and behind-the-scenes moments</p>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <InstagramGallery
            className="rounded-lg overflow-hidden shadow-lg"
            style={{ minHeight: '500px' }}
          />
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-32 px-6 bg-[#E63946] text-white text-center">
        <h2 className="font-serif text-4xl md:text-6xl mb-8">Ready to be timeless?</h2>
        <Link to="/contact">
          <button className="bg-white text-[#E63946] px-12 py-4 uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-colors">
            Book 2026 Date
          </button>
        </Link>
      </section>
    </SmoothPageTransition>
  );
};

export default Home;