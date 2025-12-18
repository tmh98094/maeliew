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
          <a href="mailto:contact@maeatelier.com" className="flex items-center gap-2 hover:text-[#E63946] transition-colors">
            <Mail size={16} /> contact@maeatelier.com
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-[#E63946] transition-colors">
            <Instagram size={16} /> @maeliew_atelier
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