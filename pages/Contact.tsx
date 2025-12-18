import React from 'react';
import { motion } from 'framer-motion';
import { EnhancedContactForm } from '../src/components/EnhancedContactForm';
import { SmoothPageTransition, ToastProvider } from '../src/components/AdvancedUIComponents';
import { MALAYSIA_CONTACT_INFO } from '../src/utils/malaysiaLocalization';

const Contact: React.FC = () => {
  return (
    <ToastProvider>
      <SmoothPageTransition className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Info Side */}
          <div className="md:w-1/3">
             <h1 className="font-serif text-6xl mb-8">Inquire</h1>
             <div className="w-12 h-1 bg-[#E63946] mb-8"></div>
             
             <p className="text-gray-600 font-light leading-relaxed mb-12">
               To secure your date for 2026/2027, please fill out the form or contact us directly. We recommend booking 6-12 months in advance.
             </p>

             <div className="space-y-8">
               <div>
                  <span className="uppercase tracking-widest text-xs text-gray-400 font-bold block mb-1">Email</span>
                  <a href={`mailto:${MALAYSIA_CONTACT_INFO.businessEmail}`} className="text-xl font-serif hover:text-[#E63946] transition-colors">
                    {MALAYSIA_CONTACT_INFO.businessEmail}
                  </a>
               </div>
               <div>
                  <span className="uppercase tracking-widest text-xs text-gray-400 font-bold block mb-1">Studio</span>
                  <p className="text-lg font-serif">Foresta Damansara Condominium</p>
                  <p className="text-gray-500 text-sm">Persiaran Meranti, Bandar Sri Damansara</p>
               </div>
                <div>
                  <span className="uppercase tracking-widest text-xs text-gray-400 font-bold block mb-1">Trial Hours</span>
                  <p className="text-gray-500 text-sm">Weekdays: 11:00 AM — 2:00 PM</p>
               </div>
             </div>
          </div>

          {/* Enhanced Form Side */}
          <div className="md:w-2/3">
            <EnhancedContactForm />
          </div>

        </div>

        <div className="mt-24 w-full h-80 overflow-hidden relative grayscale">
          <img src="https://picsum.photos/1200/400?random=map" alt="Aesthetic Location" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
             <span className="text-white font-serif text-3xl">Visit the Atelier</span>
          </div>
        </div>

      </div>
    </SmoothPageTransition>
    </ToastProvider>
  );
};

export default Contact;