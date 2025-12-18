import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';

const EnhancedFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    services: [
      { name: 'Bridal Makeup', href: '/services#bridal' },
      { name: 'Editorial Shoots', href: '/services#editorial' },
      { name: 'Celebrity Styling', href: '/services#celebrity' },
      { name: 'Workshops', href: '/services#workshops' },
    ],
    company: [
      { name: 'About Mae', href: '/about' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Journal', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Booking Policy', href: '/booking-policy' },
    ],
  };

  const contactInfo = [
    { icon: <Phone size={16} />, text: '+60 12-345 6789', href: 'tel:+60123456789' },
    { icon: <Mail size={16} />, text: 'hello@maeliew.com', href: 'mailto:hello@maeliew.com' },
    { icon: <MapPin size={16} />, text: 'Kuala Lumpur, Malaysia', href: '#' },
  ];

  const socialLinks = [
    { icon: <Instagram size={20} />, href: 'https://instagram.com/maeliew_atelier', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gradient-to-b from-soft-black to-deep-charcoal text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent-red rounded-full blur-3xl transform -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-muted-gold rounded-full blur-3xl transform translate-x-48 translate-y-48" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container-max section-padding py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link to="/" className="inline-block mb-6">
                  <div className="font-display text-3xl tracking-tighter font-bold">
                    Mae<span className="text-accent-red">.</span>Atelier
                  </div>
                </Link>
                <p className="text-gray-300 leading-relaxed mb-6 max-w-sm">
                  Crafting timeless beauty with over 20 years of expertise in makeup artistry. 
                  From bridal elegance to editorial excellence.
                </p>
                
                {/* Social Links */}
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent-red transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Services */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-serif text-xl mb-6 text-champagne">Services</h3>
                <ul className="space-y-3">
                  {footerLinks.services.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-accent-red transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Company */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="font-serif text-xl mb-6 text-champagne">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-accent-red transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Contact Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="font-serif text-xl mb-6 text-champagne">Get in Touch</h3>
                <ul className="space-y-4">
                  {contactInfo.map((contact, index) => (
                    <li key={index}>
                      <a
                        href={contact.href}
                        className="flex items-center gap-3 text-gray-300 hover:text-accent-red transition-colors duration-300 text-sm group"
                      >
                        <span className="text-accent-red group-hover:scale-110 transition-transform duration-300">
                          {contact.icon}
                        </span>
                        {contact.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container-max section-padding py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
                <p>&copy; 2024 Mae Liew Atelier. All rights reserved.</p>
                <div className="flex gap-4">
                  {footerLinks.legal.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="hover:text-accent-red transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Made with</span>
                <Heart size={14} className="text-accent-red animate-pulse" />
                <span>in Malaysia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 w-12 h-12 bg-accent-red rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <ArrowUp size={20} className="text-white" />
      </motion.button>
    </footer>
  );
};

export default EnhancedFooter;
