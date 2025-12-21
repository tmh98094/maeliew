import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ServiceCategory } from '../types';
import { ServiceProcessDetails } from '../src/components/RichContentSections';
import { SmoothPageTransition } from '../src/components/AdvancedUIComponents';
import { CRMService, ServicePackage } from '../src/services/crmService';
import { formatMalaysianCurrency, MALAYSIA_SERVICE_CATEGORIES } from '../src/utils/malaysiaLocalization';
import { ServiceWhatsAppButton } from '../src/components/WhatsAppButton';
import SEO from '../src/components/SEO';
import StructuredData from '../src/components/StructuredData';

const Services: React.FC = () => {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const servicesData = await CRMService.getAllServices({ status: 'active' });
      setServices(servicesData);
    } catch (err) {
      console.error('Error loading services:', err);
      // Fallback to static data if Supabase fails
      console.log('Falling back to static services data');
      setServices([]); // For now, we'll use empty array and show static content
    } finally {
      setLoading(false);
    }
  };

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const categoryLabel = MALAYSIA_SERVICE_CATEGORIES[service.category] || service.category;
    if (!acc[categoryLabel]) {
      acc[categoryLabel] = [];
    }
    acc[categoryLabel].push(service);
    return acc;
  }, {} as Record<string, ServicePackage[]>);

  // Convert to the format expected by the existing UI, or use fallback static data
  const serviceCategories: ServiceCategory[] = services.length > 0 
    ? Object.entries(groupedServices).map(([category, items]) => ({
        category,
        items: items.map(service => ({
          title: service.title,
          price: formatMalaysianCurrency(service.price),
          features: service.features,
          note: service.note,
          serviceData: service // Include full service data for WhatsApp integration
        }))
      }))
    : [
        // Fallback static data with RM formatting
        {
          category: "Wedding Day Services",
          items: [
            {
              title: "Premium 2-Session Package",
              price: "RM 2,250.00",
              features: [
                "2 Sessions for the Bride",
                "2 Sets of premium false eyelashes",
                "Professional Skin Prepping",
                "Double eyelid lifting techniques",
                "Eyebrow shaping",
                "Body glow touch-up",
                "Assistance with gown dressing",
                "Complimentary grooming (at bride's location)",
                "1 FOC Full Makeup Trial (Hair excluded)"
              ]
            },
            {
              title: "Classic 1-Session Package",
              price: "RM 1,800.00",
              features: [
                "1 Session for the Bride",
                "1 Set of premium false eyelashes",
                "Professional Skin Prepping",
                "Double eyelid lifting techniques",
                "Eyebrow shaping",
                "Body glow touch-up",
                "Assistance with gown dressing",
                "Complimentary grooming (at bride's location)",
                "1 FOC Full Makeup Trial (Hair excluded)"
              ]
            }
          ]
        },
        {
          category: "Registration of Marriage (ROM)",
          items: [
            {
              title: "Weekday Session",
              price: "RM 880.00",
              features: [
                "Makeup & Hairdo",
                "1 Set of false eyelashes",
                "Skin prepping & Double eyelid lifting",
                "Eyebrow shaping & Body glow",
                "Assistance with gown"
              ]
            },
            {
              title: "Weekend Session",
              price: "RM 1,180.00",
              features: [
                "Makeup & Hairdo",
                "1 Set of false eyelashes",
                "Skin prepping & Double eyelid lifting",
                "Eyebrow shaping & Body glow",
                "Assistance with gown"
              ]
            }
          ]
        },
        {
          category: "Pre-Wedding Photography",
          items: [
            {
              title: "Half Day Session",
              price: "RM 1,300.00",
              features: [
                "2 Hours Makeup Time",
                "Max 4 Hours Follow-out",
                "1 Makeup Style & Max 2 Hair Styles",
                "Simple touch-up/hairdo for Groom"
              ]
            },
            {
              title: "Full Day Session",
              price: "RM 2,000.00",
              features: [
                "2 Hours Makeup Time",
                "Max 6 Hours Follow-out",
                "2 Makeup Styles & 3 Hair Styles",
                "Inclusive of Bridal Hair Accessories",
                "Skin Prepping & False Lashes",
                "Simple touch-up/hairdo for Groom"
              ],
              note: "Client to cover transport/accommodation for destination shoots."
            }
          ]
        }
      ];

  if (loading) {
    return (
      <SmoothPageTransition className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946]"></div>
          </div>
        </div>
      </SmoothPageTransition>
    );
  }

  if (error) {
    return (
      <SmoothPageTransition className="pt-32 pb-24 min-h-screen bg-[#fdfbf7]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center py-24">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadServices}
              className="bg-[#E63946] text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </SmoothPageTransition>
    );
  }

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

        {/* Pricing Lists */}
        <div className="space-y-32">
          {serviceCategories.map((category, idx) => (
            <div key={idx}>
              <h2 className="font-serif text-3xl mb-12 border-b border-gray-300 pb-4 flex justify-between items-end">
                {category.category}
                <span className="text-xs font-sans text-gray-400 font-normal uppercase tracking-widest">2026 Rates</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {category.items.map((item, i) => (
                  <div key={i} className="bg-white p-8 md:p-12 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#E63946]/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-[#E63946]/10"></div>
                    
                    <div className="flex justify-between items-baseline mb-8 relative z-10">
                      <h3 className="font-serif text-2xl max-w-[70%]">{item.title}</h3>
                      <span className="text-xl font-bold text-[#E63946]">{item.price}</span>
                    </div>
                    
                    <ul className="space-y-4 mb-8 relative z-10">
                      {item.features.map((feature, f) => (
                        <li key={f} className="text-gray-600 font-light text-sm flex items-start gap-3">
                          <span className="text-[#E63946] mt-[2px] text-xs">◆</span> 
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* WhatsApp Button */}
                    <div className="mb-4 relative z-10">
                      {(item as any).serviceData ? (
                        <ServiceWhatsAppButton
                          serviceName={(item as any).serviceData.title}
                          servicePrice={formatMalaysianCurrency((item as any).serviceData.price)}
                          serviceCategory={(item as any).serviceData.category}
                          serviceId={(item as any).serviceData.id}
                          variant="primary"
                        />
                      ) : (
                        <ServiceWhatsAppButton
                          serviceName={item.title}
                          servicePrice={item.price}
                          serviceCategory={category.category.toLowerCase().includes('wedding') ? 'wedding' : 
                                         category.category.toLowerCase().includes('rom') ? 'rom' :
                                         category.category.toLowerCase().includes('pre-wedding') ? 'pre-wedding' : 'personal'}
                          variant="primary"
                        />
                      )}
                    </div>
                    
                    {item.note && <p className="text-xs text-gray-400 italic mt-4 border-t pt-4 border-gray-100">{item.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add Ons Section - Dynamic from Supabase or static fallback */}
          {services.length > 0 && groupedServices['Add-On Services'] && groupedServices['Add-On Services'].length > 0 ? (
            <div className="bg-gray-50 p-12">
              <h2 className="font-serif text-3xl mb-8">A La Carte & Add-Ons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {groupedServices['Add-On Services'].map((service, index) => (
                  <div key={index} className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-light">{service.title}</span>
                    <span className="font-semibold">{formatMalaysianCurrency(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Fallback static add-ons with RM formatting
            <div className="bg-gray-50 p-12">
              <h2 className="font-serif text-3xl mb-8">A La Carte & Add-Ons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="font-light">Touch-up & Restyle (up to 3 hrs)</span>
                   <span className="font-semibold">RM 450.00</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="font-light">Subsequent Hours</span>
                   <span className="font-semibold">RM 100 / hour</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="font-light">Additional Makeup Trial</span>
                   <span className="font-semibold">RM 400</span>
                </div>
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="font-light">Additional Hair Trial</span>
                   <span className="font-semibold">RM 300</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="font-light">Family Member (Makeup & Hair) - Min 2</span>
                   <span className="font-semibold">RM 380 / pax</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                   <span className="font-light">Personal Makeup & Hair (by Mae)</span>
                   <span className="font-semibold">RM 650.00</span>
                </div>
              </div>
            </div>
          )}
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

        <div className="text-center mt-24">
           <Link to="/contact">
             <button className="bg-black text-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-[#E63946] transition-colors">
               Book Your Consultation
             </button>
           </Link>
        </div>

      </div>

      {/* Service Process Details */}
      <ServiceProcessDetails />
    </SmoothPageTransition>
  );
};

export default Services;