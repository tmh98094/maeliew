// WhatsApp integration utilities for Mae Liew Atelier

export interface WhatsAppConfig {
  businessNumber: '+60 12-2681879';
  messageTemplates: {
    serviceInquiry: (serviceName: string, servicePrice: string) => string;
    generalInquiry: () => string;
  };
}

export interface WhatsAppMessage {
  recipient: string;
  message: string;
  url: string;
  metadata: {
    source: 'service_inquiry' | 'general_contact' | 'floater';
    service_id?: string;
    timestamp: Date;
  };
}

// WhatsApp business configuration
export const WHATSAPP_CONFIG: WhatsAppConfig = {
  businessNumber: '+60 12-2681879',
  messageTemplates: {
    serviceInquiry: (serviceName: string, servicePrice: string) => 
      `Hi Mae! I'm interested in your "${serviceName}" service (${servicePrice}). Could you please provide more details about availability and booking process? Thank you!`,
    
    generalInquiry: () => 
      `Hi Mae! I'm interested in your makeup services. Could you please share more information about your packages and availability? Thank you!`
  }
};

// Generate WhatsApp URL for service inquiry
export const generateServiceWhatsAppURL = (
  serviceName: string, 
  servicePrice: string,
  serviceId?: string
): WhatsAppMessage => {
  const message = WHATSAPP_CONFIG.messageTemplates.serviceInquiry(serviceName, servicePrice);
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = WHATSAPP_CONFIG.businessNumber.replace(/[\s\-]/g, ''); // Remove spaces and dashes
  
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  return {
    recipient: WHATSAPP_CONFIG.businessNumber,
    message,
    url,
    metadata: {
      source: 'service_inquiry',
      service_id: serviceId,
      timestamp: new Date()
    }
  };
};

// Generate WhatsApp URL for general inquiry
export const generateGeneralWhatsAppURL = (): WhatsAppMessage => {
  const message = WHATSAPP_CONFIG.messageTemplates.generalInquiry();
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = WHATSAPP_CONFIG.businessNumber.replace(/[\s\-]/g, '');
  
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  return {
    recipient: WHATSAPP_CONFIG.businessNumber,
    message,
    url,
    metadata: {
      source: 'general_contact',
      timestamp: new Date()
    }
  };
};

// Generate WhatsApp URL for floater button
export const generateFloaterWhatsAppURL = (): WhatsAppMessage => {
  const message = WHATSAPP_CONFIG.messageTemplates.generalInquiry();
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = WHATSAPP_CONFIG.businessNumber.replace(/[\s\-]/g, '');
  
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  return {
    recipient: WHATSAPP_CONFIG.businessNumber,
    message,
    url,
    metadata: {
      source: 'floater',
      timestamp: new Date()
    }
  };
};

// Open WhatsApp with the generated URL
export const openWhatsApp = (whatsappMessage: WhatsAppMessage): void => {
  // Track the interaction (could be sent to analytics)
  console.log('WhatsApp interaction:', whatsappMessage.metadata);
  
  // Open WhatsApp
  window.open(whatsappMessage.url, '_blank');
};

// Validate WhatsApp business number format
export const validateWhatsAppNumber = (number: string): boolean => {
  // Remove all non-digit characters except +
  const cleaned = number.replace(/[^\d+]/g, '');
  
  // Should be in format +60xxxxxxxxx
  return /^\+60\d{9,10}$/.test(cleaned);
};

// Format WhatsApp number for URL (remove spaces and dashes)
export const formatWhatsAppNumber = (number: string): string => {
  return number.replace(/[\s\-]/g, '');
};

// Check if WhatsApp is available (mobile detection)
export const isWhatsAppAvailable = (): boolean => {
  // Check if running on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // WhatsApp Web works on desktop too, so always return true
  return true;
};

// Get appropriate WhatsApp URL based on device
export const getWhatsAppURL = (message: string, phoneNumber: string = WHATSAPP_CONFIG.businessNumber): string => {
  const encodedMessage = encodeURIComponent(message);
  const formattedNumber = formatWhatsAppNumber(phoneNumber);
  
  // Use wa.me for universal compatibility
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
};

// Service-specific message templates
export const SERVICE_MESSAGE_TEMPLATES = {
  wedding: (serviceTitle: string, price: string) => 
    `Hi Mae! I'm interested in your wedding service "${serviceTitle}" (${price}). Could you please share more details about the package, trial session, and availability for my wedding date? Thank you!`,
    
  rom: (serviceTitle: string, price: string) => 
    `Hi Mae! I'd like to inquire about your ROM service "${serviceTitle}" (${price}). Could you please provide more information about what's included and your availability? Thank you!`,
    
  'pre-wedding': (serviceTitle: string, price: string) => 
    `Hi Mae! I'm interested in your pre-wedding photography service "${serviceTitle}" (${price}). Could you please share details about the styling options and booking process? Thank you!`,
    
  addon: (serviceTitle: string, price: string) => 
    `Hi Mae! I'd like to add "${serviceTitle}" (${price}) to my booking. Could you please provide more details about this service? Thank you!`,
    
  personal: (serviceTitle: string, price: string) => 
    `Hi Mae! I'm interested in your personal makeup service "${serviceTitle}" (${price}). Could you please share more information about availability and booking? Thank you!`
};

// Generate category-specific WhatsApp message
export const generateCategorySpecificMessage = (
  category: 'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal',
  serviceTitle: string,
  price: string
): string => {
  const template = SERVICE_MESSAGE_TEMPLATES[category];
  return template ? template(serviceTitle, price) : WHATSAPP_CONFIG.messageTemplates.serviceInquiry(serviceTitle, price);
};

// Create WhatsApp button props
export interface WhatsAppButtonProps {
  serviceName: string;
  servicePrice: string;
  serviceCategory?: 'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal';
  serviceId?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

// Generate WhatsApp URL with category-specific message
export const generateCategoryWhatsAppURL = (
  serviceName: string,
  servicePrice: string,
  category?: 'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal',
  serviceId?: string
): WhatsAppMessage => {
  const message = category 
    ? generateCategorySpecificMessage(category, serviceName, servicePrice)
    : WHATSAPP_CONFIG.messageTemplates.serviceInquiry(serviceName, servicePrice);
    
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = WHATSAPP_CONFIG.businessNumber.replace(/[\s\-]/g, '');
  
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  return {
    recipient: WHATSAPP_CONFIG.businessNumber,
    message,
    url,
    metadata: {
      source: 'service_inquiry',
      service_id: serviceId,
      timestamp: new Date()
    }
  };
};