import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { formatMalaysianCurrency, formatRMCurrency } from '../utils/malaysiaLocalization';

/**
 * Feature: website-cms-whatsapp-enhancement, Property 4: Malaysian currency formatting
 * Validates: Requirements 1.5, 3.2
 */

describe('Malaysian Currency Formatting', () => {
  it('should format all price amounts with RM currency symbol and Malaysian conventions', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.01, max: 100000, noNaN: true }),
        (amount) => {
          const formatted = formatMalaysianCurrency(amount);
          
          // Verify RM prefix is present
          expect(formatted).toMatch(/^RM\s/);
          
          // Verify the format is "RM X.XX"
          expect(formatted).toMatch(/^RM\s\d+\.\d{2}$/);
          
          // Verify the numeric part matches the input (with proper rounding)
          const numericPart = formatted.replace('RM ', '');
          const parsedAmount = parseFloat(numericPart);
          expect(parsedAmount).toBeCloseTo(amount, 2);
          
          // Verify no trailing zeros beyond 2 decimal places
          expect(numericPart).toMatch(/^\d+\.\d{2}$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases and boundary values correctly', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(0.01), // Minimum valid amount
          fc.constant(0.99), // Less than 1
          fc.constant(1.00), // Exactly 1
          fc.constant(999.99), // Just under 1000
          fc.constant(1000.00), // Exactly 1000
          fc.constant(9999.99), // Large amount
          fc.float({ min: 0.01, max: 0.99 }), // Small amounts
          fc.float({ min: 1000, max: 10000 }) // Large amounts
        ),
        (amount) => {
          const formatted = formatMalaysianCurrency(amount);
          
          // Verify format consistency regardless of amount size
          expect(formatted).toMatch(/^RM\s\d+\.\d{2}$/);
          
          // Verify precision is maintained
          const numericPart = parseFloat(formatted.replace('RM ', ''));
          expect(numericPart).toBeCloseTo(amount, 2);
          
          // Verify no scientific notation
          expect(formatted).not.toMatch(/[eE]/);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should format budget ranges consistently with RM currency', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: 100, max: 10000, noNaN: true }), { minLength: 2, maxLength: 10 }),
        (amounts) => {
          const formattedAmounts = amounts.map(formatMalaysianCurrency);
          
          // Verify all amounts use consistent RM formatting
          for (const formatted of formattedAmounts) {
            expect(formatted).toMatch(/^RM\s\d+\.\d{2}$/);
          }
          
          // Verify sorting works correctly with formatted amounts
          const sortedOriginal = [...amounts].sort((a, b) => a - b);
          const sortedFormatted = formattedAmounts
            .map(f => ({ formatted: f, numeric: parseFloat(f.replace('RM ', '')) }))
            .sort((a, b) => a.numeric - b.numeric)
            .map(item => item.formatted);
          
          const expectedSorted = sortedOriginal.map(formatMalaysianCurrency);
          expect(sortedFormatted).toEqual(expectedSorted);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should provide consistent short format for UI display', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.01, max: 50000, noNaN: true }),
        (amount) => {
          const shortFormat = formatRMCurrency(amount);
          
          // Verify RM prefix is present
          expect(shortFormat).toMatch(/^RM\s/);
          
          if (amount >= 1000) {
            // Should use 'k' notation for amounts >= 1000
            expect(shortFormat).toMatch(/^RM\s\d+\.\d{1}k$/);
            
            // Verify the conversion is correct
            const numericPart = parseFloat(shortFormat.replace('RM ', '').replace('k', ''));
            expect(numericPart).toBeCloseTo(amount / 1000, 1);
          } else {
            // Should show whole number for amounts < 1000
            expect(shortFormat).toMatch(/^RM\s\d+$/);
            
            // Verify the amount is correct (rounded to nearest whole number)
            const numericPart = parseInt(shortFormat.replace('RM ', ''));
            expect(numericPart).toBe(Math.round(amount));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain precision and avoid floating point errors', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.01, max: 1000, noNaN: true }),
        (amount) => {
          const formatted = formatMalaysianCurrency(amount);
          const numericPart = parseFloat(formatted.replace('RM ', ''));
          
          // Verify no precision loss beyond 2 decimal places
          expect(numericPart.toFixed(2)).toBe(amount.toFixed(2));
          
          // Verify the formatted string represents the exact 2-decimal precision
          const expectedFormatted = `RM ${amount.toFixed(2)}`;
          expect(formatted).toBe(expectedFormatted);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle service pricing scenarios correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          basePrice: fc.float({ min: 500, max: 5000 }),
          addOnPrice: fc.float({ min: 50, max: 1000 }),
          discountPercent: fc.float({ min: 0, max: 0.3 }) // 0-30% discount
        }),
        ({ basePrice, addOnPrice, discountPercent }) => {
          const totalPrice = basePrice + addOnPrice;
          const discountedPrice = totalPrice * (1 - discountPercent);
          
          // Format all prices
          const formattedBase = formatMalaysianCurrency(basePrice);
          const formattedAddOn = formatMalaysianCurrency(addOnPrice);
          const formattedTotal = formatMalaysianCurrency(totalPrice);
          const formattedDiscounted = formatMalaysianCurrency(discountedPrice);
          
          // Verify all use consistent RM formatting
          [formattedBase, formattedAddOn, formattedTotal, formattedDiscounted].forEach(formatted => {
            expect(formatted).toMatch(/^RM\s\d+\.\d{2}$/);
          });
          
          // Verify mathematical relationships are preserved
          const baseNum = parseFloat(formattedBase.replace('RM ', ''));
          const addOnNum = parseFloat(formattedAddOn.replace('RM ', ''));
          const totalNum = parseFloat(formattedTotal.replace('RM ', ''));
          const discountedNum = parseFloat(formattedDiscounted.replace('RM ', ''));
          
          expect(totalNum).toBeCloseTo(baseNum + addOnNum, 2);
          expect(discountedNum).toBeLessThanOrEqual(totalNum);
          expect(discountedNum).toBeCloseTo(totalNum * (1 - discountPercent), 2);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should format contact form budget ranges with proper RM currency', () => {
    const budgetRanges = [
      { min: 0, max: 500 },
      { min: 500, max: 1000 },
      { min: 1000, max: 2000 },
      { min: 2000, max: 5000 },
      { min: 5000, max: 10000 }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...budgetRanges),
        (range) => {
          const minFormatted = formatMalaysianCurrency(range.min);
          const maxFormatted = formatMalaysianCurrency(range.max);
          
          // Verify both min and max use RM formatting
          expect(minFormatted).toMatch(/^RM\s\d+\.\d{2}$/);
          expect(maxFormatted).toMatch(/^RM\s\d+\.\d{2}$/);
          
          // Verify range relationship is maintained
          const minNum = parseFloat(minFormatted.replace('RM ', ''));
          const maxNum = parseFloat(maxFormatted.replace('RM ', ''));
          expect(maxNum).toBeGreaterThan(minNum);
          
          // Verify exact values
          expect(minNum).toBe(range.min);
          expect(maxNum).toBe(range.max);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should handle special pricing scenarios in Malaysian context', () => {
    const specialPrices = [
      880.00,   // ROM Weekday
      1180.00,  // ROM Weekend  
      1300.00,  // Half Day Pre-wedding
      1800.00,  // Classic Wedding
      2000.00,  // Full Day Pre-wedding
      2250.00,  // Premium Wedding
      380.00,   // Family Member
      400.00,   // Additional Makeup Trial
      450.00,   // Touch-up & Restyle
      650.00    // Personal Service
    ];

    specialPrices.forEach(price => {
      const formatted = formatMalaysianCurrency(price);
      
      // Verify RM formatting
      expect(formatted).toMatch(/^RM\s\d+\.\d{2}$/);
      
      // Verify exact price preservation
      const numericPart = parseFloat(formatted.replace('RM ', ''));
      expect(numericPart).toBe(price);
      
      // Verify specific expected formats for known prices
      expect(formatted).toBe(`RM ${price.toFixed(2)}`);
    });
  });
});