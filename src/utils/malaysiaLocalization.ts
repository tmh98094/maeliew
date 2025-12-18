// Malaysia localization utilities

export interface MalaysiaLocalization {
  currency: {
    symbol: 'RM';
    format: (amount: number) => string;
  };
  phoneNumber: {
    countryCode: '+60';
    placeholder: '+60 12-345 6789';
    validation: (phone: string) => boolean;
  };
  contactInfo: {
    businessEmail: 'maeliew@gmail.com';
    businessPhone: '+60 12-2681879';
  };
}

// Currency formatting for Malaysian Ringgit
export const formatMalaysianCurrency = (amount: number): string => {
  return `RM ${amount.toFixed(2)}`;
};

// Format currency for display (shorter version for UI)
export const formatRMCurrency = (amount: number): string => {
  if (amount >= 1000) {
    return `RM ${(amount / 1000).toFixed(1)}k`;
  }
  return `RM ${amount.toFixed(0)}`;
};

// Validate Malaysian phone number format
export const validateMalaysianPhone = (phone: string): boolean => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Malaysian phone number patterns:
  // +60xxxxxxxxx (international format)
  // 60xxxxxxxxx (without +)
  // 0xxxxxxxxx (local format)
  // xxxxxxxxx (mobile without leading 0)
  
  const patterns = [
    /^\+60[1-9]\d{7,9}$/, // International format
    /^60[1-9]\d{7,9}$/, // Without +
    /^0[1-9]\d{7,9}$/, // Local format
    /^[1-9]\d{7,9}$/ // Mobile without leading 0
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
};

// Format Malaysian phone number for display
export const formatMalaysianPhone = (phone: string): string => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Convert to international format
  if (cleaned.startsWith('+60')) {
    return cleaned.replace(/(\+60)(\d{1,2})(\d{3,4})(\d{4})/, '$1 $2-$3 $4');
  } else if (cleaned.startsWith('60')) {
    return cleaned.replace(/^60/, '+60 ').replace(/(\+60 )(\d{1,2})(\d{3,4})(\d{4})/, '$1$2-$3 $4');
  } else if (cleaned.startsWith('0')) {
    return cleaned.replace(/^0/, '+60 ').replace(/(\+60 )(\d{1,2})(\d{3,4})(\d{4})/, '$1$2-$3 $4');
  } else {
    return `+60 ${cleaned}`.replace(/(\+60 )(\d{1,2})(\d{3,4})(\d{4})/, '$1$2-$3 $4');
  }
};

// Malaysia business contact information
export const MALAYSIA_CONTACT_INFO = {
  businessEmail: 'maeliew@gmail.com',
  businessPhone: '+60 12-2681879',
  businessPhoneFormatted: '+60 12-2681879',
  countryCode: '+60',
  phonePlaceholder: '+60 12-345 6789'
};

// Budget ranges in Malaysian Ringgit
export const MALAYSIA_BUDGET_RANGES = [
  { value: '', label: 'Select budget range' },
  { value: 'under-500', label: 'Under RM 500' },
  { value: '500-1000', label: 'RM 500 - RM 1,000' },
  { value: '1000-2000', label: 'RM 1,000 - RM 2,000' },
  { value: '2000-5000', label: 'RM 2,000 - RM 5,000' },
  { value: 'over-5000', label: 'Over RM 5,000' }
];

// Service categories in Malaysian context
export const MALAYSIA_SERVICE_CATEGORIES = {
  wedding: 'Wedding Day Services',
  rom: 'Registration of Marriage (ROM)',
  'pre-wedding': 'Pre-Wedding Photography',
  addon: 'Add-On Services',
  personal: 'Personal Services'
};

// Format service duration for Malaysian context
export const formatServiceDuration = (duration?: string): string => {
  if (!duration) return '';
  
  // Common duration patterns
  const patterns = [
    { pattern: /full day/i, replacement: 'Full Day Service' },
    { pattern: /half day/i, replacement: 'Half Day Service' },
    { pattern: /(\d+)\s*hours?/i, replacement: '$1 Hours' },
    { pattern: /(\d+)-(\d+)\s*hours?/i, replacement: '$1-$2 Hours' }
  ];
  
  let formatted = duration;
  patterns.forEach(({ pattern, replacement }) => {
    formatted = formatted.replace(pattern, replacement);
  });
  
  return formatted;
};

// Format service features for display
export const formatServiceFeatures = (features: string[]): string[] => {
  return features.map(feature => {
    // Capitalize first letter and ensure proper formatting
    return feature.charAt(0).toUpperCase() + feature.slice(1).toLowerCase();
  });
};