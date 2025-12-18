import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { 
  validateMalaysianPhone, 
  formatMalaysianPhone, 
  MALAYSIA_CONTACT_INFO 
} from '../utils/malaysiaLocalization';

/**
 * Feature: website-cms-whatsapp-enhancement, Property 5: Malaysian phone number handling
 * Validates: Requirements 3.1, 3.4, 3.5
 */

describe('Malaysian Phone Number Handling', () => {
  it('should validate Malaysian phone number formats correctly', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Valid Malaysian phone number patterns
          fc.tuple(fc.constantFrom('+60'), fc.integer({ min: 10000000, max: 199999999 })).map(([prefix, num]) => `${prefix}${num}`),
          fc.tuple(fc.constant('60'), fc.integer({ min: 10000000, max: 199999999 })).map(([prefix, num]) => `${prefix}${num}`),
          fc.tuple(fc.constant('0'), fc.integer({ min: 10000000, max: 199999999 })).map(([prefix, num]) => `${prefix}${num}`),
          fc.integer({ min: 10000000, max: 199999999 }).map(num => `${num}`),
          // With formatting
          fc.tuple(fc.constantFrom('+60'), fc.integer({ min: 10, max: 19 }), fc.integer({ min: 1000000, max: 9999999 }))
            .map(([prefix, area, num]) => `${prefix} ${area}-${num.toString().slice(0, 3)} ${num.toString().slice(3)}`),
        ),
        (phoneNumber) => {
          const isValid = validateMalaysianPhone(phoneNumber);
          expect(typeof isValid).toBe('boolean');
          
          if (isValid) {
            // If valid, should contain digits and possibly + symbol
            const cleaned = phoneNumber.replace(/[^\d+]/g, '');
            expect(cleaned.length).toBeGreaterThanOrEqual(8);
            expect(cleaned.length).toBeLessThanOrEqual(13);
            
            // Should start with valid Malaysian prefixes
            expect(
              cleaned.startsWith('+60') || 
              cleaned.startsWith('60') || 
              cleaned.startsWith('0') ||
              /^[1-9]/.test(cleaned)
            ).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject invalid phone number formats', () => {
    const invalidPhones = [
      '', // Empty
      '123', // Too short
      '00000000', // Invalid prefix
      '+1234567890', // Wrong country code
      '+60000000000', // Invalid area code (starts with 0)
      'abc123def', // Contains letters
      '++60123456789', // Double plus
      '+60 00-123 4567', // Invalid area code
    ];

    invalidPhones.forEach(phone => {
      expect(validateMalaysianPhone(phone)).toBe(false);
    });
  });

  it('should validate specific Malaysian phone number patterns', () => {
    const validPhones = [
      '+60123456789',
      '+60 12-345 6789',
      '60123456789',
      '0123456789',
      '123456789',
      '+60 19-876 5432',
      '019-876 5432',
      MALAYSIA_CONTACT_INFO.businessPhone
    ];

    validPhones.forEach(phone => {
      expect(validateMalaysianPhone(phone)).toBe(true);
    });
  });

  it('should format Malaysian phone numbers consistently', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string().filter(s => validateMalaysianPhone(s)),
          fc.constantFrom(
            '+60123456789',
            '60123456789', 
            '0123456789',
            '123456789',
            MALAYSIA_CONTACT_INFO.businessPhone
          )
        ),
        (phoneNumber) => {
          const formatted = formatMalaysianPhone(phoneNumber);
          
          // Should always start with +60
          expect(formatted).toMatch(/^\+60\s/);
          
          // Should follow the pattern +60 XX-XXX XXXX
          expect(formatted).toMatch(/^\+60\s\d{1,2}-\d{3,4}\s\d{4}$/);
          
          // Should contain only digits, spaces, + and - after formatting
          expect(formatted).toMatch(/^[\+\d\s\-]+$/);
          
          // Should be a reasonable length
          expect(formatted.length).toBeGreaterThanOrEqual(13);
          expect(formatted.length).toBeLessThanOrEqual(17);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle contact form phone number validation scenarios', () => {
    fc.assert(
      fc.property(
        fc.record({
          phone: fc.oneof(
            fc.string({ minLength: 8, maxLength: 15 }).filter(s => /^\+?[\d\s\-\(\)]+$/.test(s)),
            fc.constantFrom('', '   ', '123', 'invalid', '+1234567890')
          )
        }),
        ({ phone }) => {
          const isValid = validateMalaysianPhone(phone);
          
          if (phone.trim() === '' || phone.length < 8) {
            // Empty or too short should be invalid
            expect(isValid).toBe(false);
          } else if (phone.includes('+1') || phone.includes('+44') || phone.includes('+86')) {
            // Wrong country codes should be invalid
            expect(isValid).toBe(false);
          } else if (/[a-zA-Z]/.test(phone)) {
            // Contains letters should be invalid
            expect(isValid).toBe(false);
          }
          
          // If valid, formatting should work
          if (isValid) {
            const formatted = formatMalaysianPhone(phone);
            expect(formatted).toMatch(/^\+60\s\d{1,2}-\d{3,4}\s\d{4}$/);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should maintain consistency with business contact information', () => {
    // Test the business phone number specifically
    const businessPhone = MALAYSIA_CONTACT_INFO.businessPhone;
    
    expect(validateMalaysianPhone(businessPhone)).toBe(true);
    
    const formatted = formatMalaysianPhone(businessPhone);
    expect(formatted).toMatch(/^\+60\s\d{1,2}-\d{3,4}\s\d{4}$/);
    
    // Business phone should be properly formatted already
    expect(businessPhone).toBe('+60 12-2681879');
    
    // Placeholder should be valid format
    const placeholder = MALAYSIA_CONTACT_INFO.phonePlaceholder;
    expect(placeholder).toMatch(/^\+60\s\d{1,2}-\d{3}\s\d{4}$/);
    expect(validateMalaysianPhone(placeholder)).toBe(true);
  });

  it('should handle form submission data formatting correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          email: fc.emailAddress(),
          phone: fc.oneof(
            fc.constantFrom(
              '+60123456789',
              '60123456789',
              '0123456789', 
              '123456789',
              '+60 12-345 6789',
              '012-345 6789'
            )
          ),
          message: fc.string({ minLength: 10, maxLength: 500 })
        }),
        (formData) => {
          // Validate phone number
          const isValidPhone = validateMalaysianPhone(formData.phone);
          expect(isValidPhone).toBe(true);
          
          // Format for submission
          const formattedPhone = formatMalaysianPhone(formData.phone);
          
          // Verify formatted phone follows Malaysian standards
          expect(formattedPhone).toMatch(/^\+60\s\d{1,2}-\d{3,4}\s\d{4}$/);
          
          // Verify formatting is consistent
          const reformatted = formatMalaysianPhone(formattedPhone);
          expect(reformatted).toBe(formattedPhone);
          
          // Create submission data
          const submissionData = {
            ...formData,
            phone: formattedPhone
          };
          
          // Verify submission data maintains Malaysian formatting
          expect(submissionData.phone).toMatch(/^\+60\s/);
          expect(validateMalaysianPhone(submissionData.phone)).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should provide helpful validation error messages for Malaysian context', () => {
    const testCases = [
      { input: '', shouldBeValid: false },
      { input: '123', shouldBeValid: false },
      { input: '+1234567890', shouldBeValid: false },
      { input: 'abc123def', shouldBeValid: false },
      { input: '+60123456789', shouldBeValid: true },
      { input: '0123456789', shouldBeValid: true },
      { input: MALAYSIA_CONTACT_INFO.businessPhone, shouldBeValid: true }
    ];

    testCases.forEach(({ input, shouldBeValid }) => {
      const isValid = validateMalaysianPhone(input);
      expect(isValid).toBe(shouldBeValid);
      
      if (shouldBeValid) {
        // Valid numbers should format correctly
        const formatted = formatMalaysianPhone(input);
        expect(formatted).toMatch(/^\+60\s\d{1,2}-\d{3,4}\s\d{4}$/);
      }
    });
  });

  it('should handle edge cases and boundary conditions', () => {
    const edgeCases = [
      '+60100000000', // Minimum valid mobile
      '+60199999999', // Maximum valid mobile  
      '+60312345678', // Landline format
      '+60 12 345 6789', // Spaces instead of dashes
      '60-12-345-6789', // Dashes throughout
      '(012) 345-6789', // Parentheses format
    ];

    edgeCases.forEach(phone => {
      const isValid = validateMalaysianPhone(phone);
      
      if (isValid) {
        const formatted = formatMalaysianPhone(phone);
        expect(formatted).toMatch(/^\+60\s\d{1,2}-\d{3,4}\s\d{4}$/);
        
        // Re-validation should still pass
        expect(validateMalaysianPhone(formatted)).toBe(true);
      }
    });
  });

  it('should maintain phone number integrity through multiple format operations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '+60123456789',
          '60123456789',
          '0123456789',
          MALAYSIA_CONTACT_INFO.businessPhone
        ),
        (originalPhone) => {
          // Multiple format operations should be idempotent
          const formatted1 = formatMalaysianPhone(originalPhone);
          const formatted2 = formatMalaysianPhone(formatted1);
          const formatted3 = formatMalaysianPhone(formatted2);
          
          expect(formatted1).toBe(formatted2);
          expect(formatted2).toBe(formatted3);
          
          // All versions should be valid
          expect(validateMalaysianPhone(originalPhone)).toBe(true);
          expect(validateMalaysianPhone(formatted1)).toBe(true);
          expect(validateMalaysianPhone(formatted2)).toBe(true);
          expect(validateMalaysianPhone(formatted3)).toBe(true);
          
          // Final format should follow standard pattern
          expect(formatted3).toMatch(/^\+60\s\d{1,2}-\d{3,4}\s\d{4}$/);
        }
      ),
      { numRuns: 20 }
    );
  });
});