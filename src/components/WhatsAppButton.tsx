import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { 
  generateCategoryWhatsAppURL, 
  openWhatsApp, 
  WhatsAppButtonProps 
} from '../utils/whatsappIntegration';

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  serviceName,
  servicePrice,
  serviceCategory,
  serviceId,
  className = '',
  children,
  onClick
}) => {
  const handleClick = () => {
    // Generate WhatsApp URL with service details
    const whatsappMessage = generateCategoryWhatsAppURL(
      serviceName,
      servicePrice,
      serviceCategory,
      serviceId
    );
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Open WhatsApp
    openWhatsApp(whatsappMessage);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-6 py-3 
        bg-green-500 hover:bg-green-600 
        text-white font-medium rounded-lg 
        transition-all duration-200 
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={`Inquire about ${serviceName} via WhatsApp`}
    >
      <MessageCircle size={18} />
      {children || 'I want this service'}
    </motion.button>
  );
};

// Service-specific WhatsApp button for services page
export const ServiceWhatsAppButton: React.FC<{
  serviceName: string;
  servicePrice: string;
  serviceCategory?: 'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal';
  serviceId?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}> = ({ 
  serviceName, 
  servicePrice, 
  serviceCategory, 
  serviceId,
  variant = 'primary' 
}) => {
  const handleClick = () => {
    // Generate WhatsApp URL with service details
    const whatsappMessage = generateCategoryWhatsAppURL(
      serviceName,
      servicePrice,
      serviceCategory,
      serviceId
    );
    
    // Open WhatsApp
    openWhatsApp(whatsappMessage);
  };

  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase tracking-widest text-sm";
  
  const variantClasses = {
    primary: "bg-black hover:bg-[#E63946] text-white focus:ring-gray-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500",
    outline: "border-2 border-black text-black hover:bg-black hover:text-white focus:ring-gray-500"
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={`Inquire about ${serviceName} via WhatsApp`}
    >
      <MessageCircle size={16} />
      I want this service
    </motion.button>
  );
};

// Compact WhatsApp button for cards/lists
export const CompactWhatsAppButton: React.FC<{
  serviceName: string;
  servicePrice: string;
  serviceCategory?: 'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal';
  serviceId?: string;
}> = ({ serviceName, servicePrice, serviceCategory, serviceId }) => {
  return (
    <WhatsAppButton
      serviceName={serviceName}
      servicePrice={servicePrice}
      serviceCategory={serviceCategory}
      serviceId={serviceId}
      className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm hover:shadow-md"
    >
      <MessageCircle size={14} />
      Inquire
    </WhatsAppButton>
  );
};

// General contact WhatsApp button
export const GeneralWhatsAppButton: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className = '', children }) => {
  const handleClick = () => {
    const whatsappMessage = {
      recipient: '+60 12-2681879',
      message: "Hi Mae! I'm interested in your makeup services. Could you please share more information about your packages and availability? Thank you!",
      url: "https://wa.me/60122681879?text=" + encodeURIComponent("Hi Mae! I'm interested in your makeup services. Could you please share more information about your packages and availability? Thank you!"),
      metadata: {
        source: 'general_contact' as const,
        timestamp: new Date()
      }
    };
    
    openWhatsApp(whatsappMessage);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-6 py-3 
        bg-green-500 hover:bg-green-600 
        text-white font-medium rounded-lg 
        transition-all duration-200 
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title="Contact Mae via WhatsApp"
    >
      <MessageCircle size={18} />
      {children || 'Contact via WhatsApp'}
    </motion.button>
  );
};