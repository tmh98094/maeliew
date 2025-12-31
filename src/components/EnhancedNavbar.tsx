import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Mail, Phone } from 'lucide-react';

const EnhancedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Only show white text on homepage hero (at top)
  const isHomePage = location.pathname === '/';
  const shouldUseWhiteText = isHomePage && !isScrolled;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Featured', path: '/portfolio?filter=featured' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Journal', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <Instagram size={20} />, href: 'https://instagram.com/maeliew_atelier', label: 'Instagram' },
    { icon: <Mail size={20} />, href: 'mailto:hello@maeliew.com', label: 'Email' },
    { icon: <Phone size={20} />, href: 'tel:+60123456789', label: 'Phone' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${isScrolled
          ? 'bg-pearl/95 backdrop-blur-md shadow-lg border-b border-champagne/20 py-4'
          : 'bg-transparent py-6'
          }`}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex justify-between items-center px-6 md:px-12">
          <Link to="/" className="z-50 group">
            <motion.div
              className={`font-display text-2xl md:text-4xl tracking-tight font-bold ${shouldUseWhiteText ? 'text-white drop-shadow-lg' : 'text-black'}`}
              whileHover={{ scale: 1.05 }}
            >
              MaeLiew Atelier
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-12 items-center">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:text-rose-600 ${shouldUseWhiteText ? 'text-white' : 'text-black'
                    }`}
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-accent-red to-muted-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Toggle */}
          <motion.button
            className="lg:hidden z-50 p-2"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X size={24} color="white" />
              ) : (
                <Menu size={24} color={shouldUseWhiteText ? "white" : "#0f0f0f"} />
              )}
            </motion.div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-soft-black/95 backdrop-blur-md z-40"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute right-0 top-0 h-full w-full sm:w-96 bg-gradient-to-b from-soft-black to-deep-charcoal p-8 flex flex-col justify-center"
            >
              <div className="space-y-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className="block text-white font-display text-4xl sm:text-5xl hover:text-accent-red transition-colors duration-300 group"
                    >
                      <span className="block transform group-hover:translate-x-4 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-16 pt-8 border-t border-white/20"
              >
                <div className="flex gap-6">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-accent-red transition-colors duration-300"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedNavbar;
