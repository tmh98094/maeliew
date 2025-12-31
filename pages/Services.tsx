import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ServiceProcessDetails } from '../src/components/RichContentSections';
import { SmoothPageTransition } from '../src/components/AdvancedUIComponents';
import { GeneralWhatsAppButton } from '../src/components/WhatsAppButton';
import SEO from '../src/components/SEO';
import StructuredData from '../src/components/StructuredData';

const Services: React.FC = () => {
  return (
    <SmoothPageTransition className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
      <SEO
        title="Makeup Services - Bridal, Wedding & ROM Makeup"
        description="Professional makeup services in Kuala Lumpur. Bridal makeup, wedding makeup, ROM makeup, and celebrity makeup by award-winning artist Mae Liew. Book your consultation today."
        keywords="bridal makeup services, wedding makeup KL, ROM makeup, makeup services Malaysia, bridal makeup packages, wedding makeup artist, makeup consultation"
        url="https://www.maeliewatelier.com/services"
        image="https://www.maeliewatelier.com/images/general/wedding2.webp"
      />
      <StructuredData type="service" />
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-32"
        >
          <p className="text-gray-500 uppercase tracking-widest text-xs mb-4">Invest in Yourself</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">Service Rate Card 2026</h1>
          <div className="w-24 h-1 bg-[#E63946] mx-auto mt-8"></div>
        </motion.div>

        {/* Process Section */}
        <div className="mb-32">
          <h2 className="font-serif text-3xl mb-12 text-center">The Bridal Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Inquiry", desc: "Contact us to check availability. Weekend dates fill up fast." },
              { step: "02", title: "Deposit", desc: "Secure your date with a non-refundable deposit." },
              { step: "03", title: "Trial", desc: "FOC Trial session (Weekdays 11am-2pm) to perfect your look." },
              { step: "04", title: "The Day", desc: "Sit back and relax while we bring your vision to life." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 border-t-4 border-[#E63946] shadow-sm">
                <span className="text-4xl font-serif text-gray-200 font-bold mb-4 block">{item.step}</span>
                <h3 className="text-xl font-serif mb-2">{item.title}</h3>
                <p className="text-gray-500 font-light text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bespoke Services Inquiry */}
        <div className="mb-32 text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl mb-8">Bespoke Bridal Services</h2>
          <p className="text-gray-600 font-light leading-relaxed mb-12 text-lg">
            Every bride is unique, and so is our approach. We offer personalized makeup and styling packages tailored to your specific requirements, whether it's for your wedding day, ROM, or pre-wedding photography.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <GeneralWhatsAppButton className="bg-black hover:bg-[#E63946]">
              WhatsApp for Rates
            </GeneralWhatsAppButton>
            <Link to="/contact">
              <button className="border border-black px-10 py-3 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
                Contact Form
              </button>
            </Link>
          </div>
        </div>

        {/* FAQ / Important Info */}
        <div className="mt-32">
          <h2 className="font-serif text-3xl mb-12 text-center">Important Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Deposits & Payments</h4>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  Dates are only secured after deposit. Deposits are non-refundable and non-transferable. Balance payments due 1 week before the event.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Early Call Surcharge</h4>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  An additional RM 180.00 will be charged if makeup and hair are required to start before 6:00 AM.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Trials</h4>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  FOC Makeup trials are available on Weekdays between 11am - 2pm. Weekend trials are generally not available during peak season (Sept-Dec).
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Destination Weddings</h4>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  Client is responsible for all travel costs and accommodation (staying at the same hotel as the bride) for outstation or overseas events.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Service Process Details */}
      <ServiceProcessDetails />
    </SmoothPageTransition>
  );
};

export default Services;