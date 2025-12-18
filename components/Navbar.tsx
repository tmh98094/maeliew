import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Journal', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 flex justify-between items-center px-6 md:px-12 py-6 ${
          isScrolled ? 'bg-[#fdfbf7]/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent'
        }`}
      >
        <Link to="/" className="z-50 group">
          <div className="font-serif text-2xl tracking-tighter font-bold uppercase">
            Mae<span className="text-[#E63946]">.</span>Atelier
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="uppercase text-xs tracking-[0.2em] hover:text-[#E63946] transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#E63946] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X color={isOpen ? "white" : "black"} /> : <Menu color={isScrolled ? "black" : "white"} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="text-white font-serif text-4xl mb-8 hover:text-[#E63946] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;