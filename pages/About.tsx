import React from 'react';
import { motion } from 'framer-motion';
import StatsCards from '../src/components/StatsCards';
import AnimatedFeaturedShowreel from '../src/components/AnimatedFeaturedShowreel';
import PartnersGrid from '../src/components/PartnersGrid';
import { SmoothPageTransition } from '../src/components/AdvancedUIComponents';

const About: React.FC = () => {
  return (
    <SmoothPageTransition className="w-full bg-[#fdfbf7]">
      {/* Header Image */}
      <div className="h-[70vh] w-full relative overflow-hidden">
        <img 
          src="/images/portfolio/wd1.jpeg" 
          alt="Studio header" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-6xl md:text-8xl text-white text-center"
          >
            The Atelier
          </motion.h1>
        </div>
      </div>

      {/* Stats Cards - positioned before main content section */}
      <StatsCards className="bg-[#fdfbf7]" />

      {/* Animated Featured Showreel */}
      <AnimatedFeaturedShowreel className="bg-[#fdfbf7]" />

      {/* Partners Grid */}
      <PartnersGrid className="bg-[#fdfbf7]" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-24">
        
        {/* Intro */}
        <div className="mb-24 text-center md:text-left">
           <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-8 leading-tight">
             Talented. Passionate. Caring. <br/>
             <span className="text-gray-400 italic">20 Years of Artistry.</span>
           </h2>
          

           <div className="flex flex-col md:flex-row gap-12 text-gray-600 font-light leading-loose text-lg">
             <div className="flex-1">
               <p className="mb-6">
                 Mae Liew Atelier Workshop is the culmination of a lifelong dedication to the art of beauty. Founded by Mae Liew in 2008, the studio has become a beacon for brides and celebrities seeking a look that is both timeless and uniquely their own.
               </p>
               <p>
                 Mae's philosophy is simple: dedication. She strives to create unique looks that meet individual styles and references, and moreover, exceed expectations.
               </p>
             </div>
             <div className="flex-1">
               <p>
                 Her technique is forged in the fires of the high-fashion industry and tempered by the precision of Japanese training. Whether it is a TVB actress on a red carpet or a bride walking down the aisle, the standard of perfection remains the same.
               </p>
             </div>
           </div>
        </div>

        {/* Timeline */}
        <div className="border-t border-gray-200 pt-24 mb-32">
          <h3 className="uppercase tracking-widest text-sm font-bold text-[#E63946] mb-16 text-center">Career Milestones</h3>
          
          <div className="space-y-16 relative">
            <div className="absolute left-0 md:left-1/2 h-full w-[1px] bg-gray-200 -z-10 transform -translate-x-1/2 hidden md:block"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
              <div className="md:w-1/2 text-right hidden md:block">
                <h4 className="font-serif text-2xl">MAC Cosmetics</h4>
                <p className="text-gray-500 text-sm">Makeup Consultant</p>
              </div>
              <div className="w-4 h-4 bg-[#E63946] rounded-full flex-shrink-0"></div>
              <div className="md:w-1/2">
                <span className="text-xs font-bold text-gray-400 block mb-2">1999 — 2003</span>
                <p className="text-gray-600 font-light">
                  Achieved break-record sales and provided extensive training to students. Built the foundation of product knowledge and client relations.
                </p>
                <div className="md:hidden mt-2">
                   <h4 className="font-serif text-xl">MAC Cosmetics</h4>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
               <div className="md:w-1/2 text-right hidden md:block">
                 <span className="text-xs font-bold text-gray-400 block mb-2">2004 — 2007</span>
                 <p className="text-gray-600 font-light">
                    Headed the brand instructor team. Demonstrated elite technique and leadership. Underwent specialized training in Japan.
                 </p>
               </div>
               <div className="w-4 h-4 bg-black rounded-full flex-shrink-0"></div>
               <div className="md:w-1/2">
                 <h4 className="font-serif text-2xl">Shu Uemura</h4>
                 <p className="text-gray-500 text-sm">Brand Instructor</p>
                 <div className="md:hidden mt-4">
                    <span className="text-xs font-bold text-gray-400 block mb-2">2004 — 2007</span>
                    <p className="text-gray-600 font-light">
                       Headed the brand instructor team. Demonstrated elite technique and leadership. Underwent specialized training in Japan.
                    </p>
                 </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
               <div className="md:w-1/2 text-right hidden md:block">
                 <h4 className="font-serif text-2xl">Mae Liew Atelier</h4>
                 <p className="text-gray-500 text-sm">Founder & Creative Director</p>
               </div>
               <div className="w-4 h-4 bg-[#E63946] rounded-full flex-shrink-0"></div>
               <div className="md:w-1/2">
                 <span className="text-xs font-bold text-gray-400 block mb-2">2008 — 2022</span>
                 <p className="text-gray-600 font-light mb-3">
                    Founded Mae Liew Atelier, bringing together years of expertise to create a premier destination for bridal and special occasion makeup. Conducted workshops for luxury brands including Clé de Peau Beauté (2015), NARS (2017), Urban Decay (2019), and Estée Lauder (2021).
                 </p>
                 <div className="md:hidden mt-2">
                    <h4 className="font-serif text-xl">Mae Liew Atelier</h4>
                 </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
               <div className="md:w-1/2 text-right hidden md:block">
                 <span className="text-xs font-bold text-gray-400 block mb-2">2023 — Present</span>
                 <p className="text-gray-600 font-light">
                    Recognized as Top 10 Malaysian Bridal Makeup Artist by Marie France Asia. Continued excellence in bridal artistry and industry leadership.
                 </p>
               </div>
               <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0"></div>
               <div className="md:w-1/2">
                 <h4 className="font-serif text-2xl">Industry Recognition</h4>
                 <p className="text-gray-500 text-sm">Award-Winning Artist</p>
                 <div className="md:hidden mt-4">
                    <span className="text-xs font-bold text-gray-400 block mb-2">2023 — Present</span>
                    <p className="text-gray-600 font-light">
                       Recognized as Top 10 Malaysian Bridal Makeup Artist by Marie France Asia. Continued excellence in bridal artistry and industry leadership.
                    </p>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          <img src="https://i.ibb.co/spzr8f5G/Loading2.jpg" alt="Studio work" className="w-full h-full object-cover translate-y-8" />
          <img src="https://i.ibb.co/JRDtN0zJ/Loading3.jpg" alt="Studio work" className="w-full h-full object-cover" />
          <img src="https://i.ibb.co/BK2cbPXJ/Loading4.jpg" alt="Studio work" className="w-full h-full object-cover translate-y-12" />
          <img src="https://i.ibb.co/v4yVSsWh/Loading5.jpg" alt="Studio work" className="w-full h-full object-cover" />
        </div>

      </div>

    </SmoothPageTransition>
  );
};

export default About;