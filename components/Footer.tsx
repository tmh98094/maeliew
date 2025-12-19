import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-20 px-6 md:px-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        
        <div className="md:w-1/3">
          <h2 className="font-serif text-3xl mb-6">Mae Liew Atelier</h2>
          <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs">
            "Bride: a woman with a fine prospect of happiness behind her." — Ambrose Bierce
          </p>
        </div>

        <div className="md:w-1/3 flex flex-col gap-4">
          <h3 className="uppercase tracking-widest text-xs text-gray-500 mb-2">Navigation</h3>
          <Link to="/portfolio" className="hover:text-[#E63946] transition-colors">Portfolio</Link>
          <Link to="/services" className="hover:text-[#E63946] transition-colors">Services & Rates</Link>
          <Link to="/about" className="hover:text-[#E63946] transition-colors">About Mae</Link>
          <Link to="/contact" className="hover:text-[#E63946] transition-colors">Contact</Link>
        </div>

        <div className="md:w-1/3 flex flex-col gap-4">
          <h3 className="uppercase tracking-widest text-xs text-gray-500 mb-2">Connect</h3>
          <a href="mailto:maeliew@gmail.com" className="flex items-center gap-2 hover:text-[#E63946] transition-colors">
            <Mail size={16} /> maeliew@gmail.com
          </a>
          <a href="https://www.instagram.com/maeliew_atelier_workshop/?hl=en" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#E63946] transition-colors">
            <Instagram size={16} /> @maeliew_atelier_workshop
          </a>
          <a href="https://www.facebook.com/maeliewmakeup/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#E63946] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg> Facebook
          </a>
          <a href="tel:+60122681879" className="flex items-center gap-2 hover:text-[#E63946] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg> +6012-2681879
          </a>
          <div className="mt-8 text-xs text-gray-600">
            © 2026 Mae Liew Atelier Workshop. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;