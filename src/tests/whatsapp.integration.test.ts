import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { 
  generateServiceWhatsAppURL,
  generateGeneralWhatsAppURL,
  generateCategoryWhatsAppURL,
  generateCategorySpecificMessage,
  validateWhatsAppNumber,
  formatWhatsAppNumber,
  getWhatsAppURL,
  WHATSAPP_CONFIG
} from '../utils/whatsappIntegration';

/**
 * Feature: website-cms-whatsapp-enhancement, Property 6: WhatsApp integration functionality
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 */

describe('WhatsApp Integration Functionality', () => {
  it('should generate correct WhatsApp URLs with business number +60 12-2681879', () => {
    fc.assert(
      fc.property(
        fc.record({
          serviceName: fc.string({ minLength: 1, maxLength: 100 }),
          servicePrice: fc.string({ minLength: 1, maxLength: 20 }),
          serviceId: fc.option(fc.uuid())
        }),
        ({ serviceName, servicePrice, serviceId }) => {
          const whatsappMessage = generateServiceWhatsAppURL(serviceName, servicePrice, serviceId);
          
          // Verify business number is correct
          expect(whatsappMessage.recipient).toBe('+60 12-2681879');
          
          // Verify URL contains correct phone number (formatted for WhatsApp)
          expect(whatsappMessage.url).toContain('wa.me/60122681879');
          
          // Verify URL is properly formatted
          expect(whatsappMessage.url).toMatch(/^https:\/\/wa\.me\/60122681879\?text=.+/);
          
          // Verify message contains service details
          expect(whatsappMessage.message).toContain(serviceName);
          expect(whatsappMessage.message).toContain(servicePrice);
          
          // Verify metadata
          expect(whatsappMessage.metadata.source).toBe('service_inquiry');
          expect(whatsappMessage.metadata.service_id).toBe(serviceId);
          expect(whatsappMessage.metadata.timestamp).toBeInstanceOf(Date);
          
          // Verify URL encoding
          const decodedMessage = decodeURIComponent(whatsappMessage.url.split('text=')[1]);
          expect(decodedMessage).toBe(whatsappMessage.message);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should include appropriate service-specific message templates', () => {
    fc.assert(
      fc.property(
        fc.record({
          serviceName: fc.string({ minLength: 1, maxLength: 100 }),
          servicePrice: fc.string({ minLength: 1, maxLength: 20 }),
          category: fc.constantFrom('wedding', 'rom', 'pre-wedding', 'addon', 'personal')
        }),
        ({ serviceName, servicePrice, category }) => {
          const whatsappMessage = generateCategoryWhatsAppURL(serviceName, servicePrice, category);
          
          // Verify message contains service details
          expect(whatsappMessage.message).toContain(serviceName);
          expect(whatsappMessage.message).toContain(servicePrice);
          
          // Verify message is contextual to category
          const message = whatsappMessage.message.toLowerCase();
          switch (category) {
            case 'wedding':
              expect(message).toMatch(/wedding|trial|bridal/);
              break;
            case 'rom':
              expect(message).toContain('rom');
              break;
            case 'pre-wedding':
              expect(message).toMatch(/pre-wedding|photography|styling/);
              break;
            case 'addon':
              expect(message).toMatch(/add|service/);
              break;
            case 'personal':
              expect(message).toMatch(/personal|makeup/);
              break;
          }
          
          // Verify professional tone
          expect(message).toContain('hi mae');
          expect(message).toContain('thank you');
          expect(message).toMatch(/please|could you/);
          
          // Verify URL structure
          expect(whatsappMessage.url).toMatch(/^https:\/\/wa\.me\/60122681879\?text=.+/);
        }
      ),
      { numRuns: 25 }
    );
  });

  it('should validate and format WhatsApp business number correctly', () => {
    const testNumbers = [
      '+60 12-2681879',
      '+60122681879',
      '60122681879',
      '+60 12 2681879',
      '+60-12-2681879'
    ];

    testNumbers.forEach(number => {
      // All variations should be valid
      expect(validateWhatsAppNumber(number)).toBe(true);
      
      // All should format to the same clean number
      const formatted = formatWhatsAppNumber(number);
      expect(formatted).toBe('+60122681879');
    });

    // Invalid numbers should be rejected
    const invalidNumbers = [
      '+1234567890', // Wrong country code
      '+60', // Too short
      'invalid', // Not a number
      '', // Empty
      '+60000000000' // Invalid format
    ];

    invalidNumbers.forEach(number => {
      expect(validateWhatsAppNumber(number)).toBe(false);
    });
  });

  it('should generate general inquiry URLs for non-service specific contacts', () => {
    const generalMessage = generateGeneralWhatsAppURL();
    
    // Verify business number
    expect(generalMessage.recipient).toBe('+60 12-2681879');
    
    // Verify URL format
    expect(generalMessage.url).toMatch(/^https:\/\/wa\.me\/60122681879\?text=.+/);
    
    // Verify message content
    expect(generalMessage.message).toContain('Hi Mae');
    expect(generalMessage.message).toContain('makeup services');
    expect(generalMessage.message).toContain('Thank you');
    
    // Verify metadata
    expect(generalMessage.metadata.source).toBe('general_contact');
    expect(generalMessage.metadata.timestamp).toBeInstanceOf(Date);
    
    // Verify URL encoding
    const decodedMessage = decodeURIComponent(generalMessage.url.split('text=')[1]);
    expect(decodedMessage).toBe(generalMessage.message);
  });

  it('should handle special characters and encoding in service names and prices', () => {
    fc.assert(
      fc.property(
        fc.record({
          serviceName: fc.string({ minLength: 1, maxLength: 100 }).map(s => s + ' & Special'),
          servicePrice: fc.string({ minLength: 1, maxLength: 20 }).map(p => `RM ${p}.00`)
        }),
        ({ serviceName, servicePrice }) => {
          const whatsappMessage = generateServiceWhatsAppURL(serviceName, servicePrice);
          
          // Verify message contains the exact service details
          expect(whatsappMessage.message).toContain(serviceName);
          expect(whatsappMessage.message).toContain(servicePrice);
          
          // Verify URL is properly encoded
          expect(whatsappMessage.url).toMatch(/^https:\/\/wa\.me\/60122681879\?text=.+/);
          
          // Verify decoding works correctly
          const urlParts = whatsappMessage.url.split('text=');
          expect(urlParts).toHaveLength(2);
          
          const decodedMessage = decodeURIComponent(urlParts[1]);
          expect(decodedMessage).toBe(whatsappMessage.message);
          expect(decodedMessage).toContain(serviceName);
          expect(decodedMessage).toContain(servicePrice);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain consistent URL structure across all WhatsApp integrations', () => {
    fc.assert(
      fc.property(
        fc.record({
          serviceName: fc.string({ minLength: 1, maxLength: 100 }),
          servicePrice: fc.string({ minLength: 1, maxLength: 20 }),
          category: fc.option(fc.constantFrom('wedding', 'rom', 'pre-wedding', 'addon', 'personal'))
        }),
        ({ serviceName, servicePrice, category }) => {
          // Generate different types of WhatsApp URLs
          const serviceURL = generateServiceWhatsAppURL(serviceName, servicePrice);
          const generalURL = generateGeneralWhatsAppURL();
          const categoryURL = category 
            ? generateCategoryWhatsAppURL(serviceName, servicePrice, category)
            : generateServiceWhatsAppURL(serviceName, servicePrice);
          
          // All URLs should use the same business number
          [serviceURL, generalURL, categoryURL].forEach(whatsappMessage => {
            expect(whatsappMessage.recipient).toBe('+60 12-2681879');
            expect(whatsappMessage.url).toMatch(/^https:\/\/wa\.me\/60122681879\?text=.+/);
            expect(whatsappMessage.metadata.timestamp).toBeInstanceOf(Date);
          });
          
          // Service and category URLs should have service_inquiry source
          expect(serviceURL.metadata.source).toBe('service_inquiry');
          expect(categoryURL.metadata.source).toBe('service_inquiry');
          
          // General URL should have general_contact source
          expect(generalURL.metadata.source).toBe('general_contact');
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should generate appropriate messages for different service categories', () => {
    const categories: Array<'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal'> = 
      ['wedding', 'rom', 'pre-wedding', 'addon', 'personal'];
    
    categories.forEach(category => {
      const serviceName = `Test ${category} Service`;
      const servicePrice = 'RM 1,000.00';
      
      const message = generateCategorySpecificMessage(category, serviceName, servicePrice);
      
      // Verify message contains service details
      expect(message).toContain(serviceName);
      expect(message).toContain(servicePrice);
      
      // Verify professional greeting and closing
      expect(message).toMatch(/^Hi Mae!/);
      expect(message).toMatch(/Thank you!$/);
      
      // Verify category-specific content
      const lowerMessage = message.toLowerCase();
      switch (category) {
        case 'wedding':
          expect(lowerMessage).toMatch(/wedding|trial|package/);
          break;
        case 'rom':
          expect(lowerMessage).toContain('rom');
          break;
        case 'pre-wedding':
          expect(lowerMessage).toMatch(/pre-wedding|photography|styling/);
          break;
        case 'addon':
          expect(lowerMessage).toMatch(/add|booking/);
          break;
        case 'personal':
          expect(lowerMessage).toMatch(/personal|makeup/);
          break;
      }
    });
  });

  it('should handle URL generation with custom messages', () => {
    fc.assert(
      fc.property(
        fc.record({
          customMessage: fc.string({ minLength: 10, maxLength: 200 }),
          phoneNumber: fc.option(fc.constant('+60 12-2681879'))
        }),
        ({ customMessage, phoneNumber }) => {
          const url = getWhatsAppURL(customMessage, phoneNumber);
          
          // Verify URL structure
          expect(url).toMatch(/^https:\/\/wa\.me\/60122681879\?text=.+/);
          
          // Verify message encoding
          const encodedMessage = url.split('text=')[1];
          const decodedMessage = decodeURIComponent(encodedMessage);
          expect(decodedMessage).toBe(customMessage);
          
          // Verify phone number formatting
          expect(url).toContain('wa.me/60122681879');
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain message template consistency and professionalism', () => {
    const templates = WHATSAPP_CONFIG.messageTemplates;
    
    // Test service inquiry template
    const serviceMessage = templates.serviceInquiry('Test Service', 'RM 500.00');
    expect(serviceMessage).toMatch(/^Hi Mae!/);
    expect(serviceMessage).toContain('Test Service');
    expect(serviceMessage).toContain('RM 500.00');
    expect(serviceMessage).toMatch(/Thank you!$/);
    expect(serviceMessage).toMatch(/please|could you/i);
    
    // Test general inquiry template
    const generalMessage = templates.generalInquiry();
    expect(generalMessage).toMatch(/^Hi Mae!/);
    expect(generalMessage).toContain('makeup services');
    expect(generalMessage).toMatch(/Thank you!$/);
    expect(generalMessage).toMatch(/please|could you/i);
    
    // Verify professional tone
    [serviceMessage, generalMessage].forEach(message => {
      expect(message).not.toMatch(/hey|hi there|sup/i); // Avoid casual greetings
      expect(message).toMatch(/please|could you|would you/i); // Polite requests
      expect(message).toMatch(/thank you/i); // Polite closing
    });
  });

  it('should handle edge cases and error conditions gracefully', () => {
    // Empty service name
    const emptyNameMessage = generateServiceWhatsAppURL('', 'RM 100.00');
    expect(emptyNameMessage.url).toMatch(/^https:\/\/wa\.me\/60122681879\?text=.+/);
    expect(emptyNameMessage.message).toContain('RM 100.00');
    
    // Empty price
    const emptyPriceMessage = generateServiceWhatsAppURL('Test Service', '');
    expect(emptyPriceMessage.url).toMatch(/^https:\/\/wa\.me\/60122681879\?text=.+/);
    expect(emptyPriceMessage.message).toContain('Test Service');
    
    // Special characters in service name
    const specialCharsMessage = generateServiceWhatsAppURL('Service & More!', 'RM 1,500.00');
    expect(specialCharsMessage.message).toContain('Service & More!');
    expect(specialCharsMessage.message).toContain('RM 1,500.00');
    
    // Verify URL encoding handles special characters
    const decodedMessage = decodeURIComponent(specialCharsMessage.url.split('text=')[1]);
    expect(decodedMessage).toBe(specialCharsMessage.message);
  });
});