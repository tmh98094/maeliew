import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fc from 'fast-check';
import { CRMService, ServicePackage } from '../services/crmService';
import { supabase } from '../lib/supabase';

/**
 * Feature: website-cms-whatsapp-enhancement, Property 2: Services data structure completeness
 * Validates: Requirements 1.2
 */

describe('Services Data Structure Completeness', () => {
  beforeEach(async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping tests');
      return;
    }
    
    // Clean up any existing test data
    await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  });

  afterEach(async () => {
    if (!supabase) return;
    
    // Clean up test data
    await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  });

  it('should validate all required fields are present and properly typed', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 255 }),
          category: fc.constantFrom('wedding', 'rom', 'pre-wedding', 'addon', 'personal'),
          price: fc.float({ min: 0.01, max: 10000 }),
          currency: fc.constant('RM' as const),
          features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 10 }),
          description: fc.option(fc.string({ maxLength: 1000 })),
          duration: fc.option(fc.string({ maxLength: 100 })),
          note: fc.option(fc.string({ maxLength: 500 })),
          images: fc.option(fc.array(fc.webUrl(), { maxLength: 5 })),
          status: fc.constantFrom('active', 'inactive', 'archived'),
          sort_order: fc.integer({ min: 0, max: 100 })
        }),
        async (serviceData) => {
          // Create service through Services Manager
          const createdService = await CRMService.createService(serviceData);
          
          // Verify all required fields are present
          expect(createdService.id).toBeDefined();
          expect(typeof createdService.id).toBe('string');
          expect(createdService.id.length).toBeGreaterThan(0);
          
          expect(createdService.title).toBeDefined();
          expect(typeof createdService.title).toBe('string');
          expect(createdService.title.length).toBeGreaterThan(0);
          expect(createdService.title.length).toBeLessThanOrEqual(255);
          
          expect(createdService.category).toBeDefined();
          expect(typeof createdService.category).toBe('string');
          expect(['wedding', 'rom', 'pre-wedding', 'addon', 'personal']).toContain(createdService.category);
          
          expect(createdService.price).toBeDefined();
          expect(typeof createdService.price).toBe('number');
          expect(createdService.price).toBeGreaterThan(0);
          
          expect(createdService.currency).toBeDefined();
          expect(createdService.currency).toBe('RM');
          
          expect(createdService.features).toBeDefined();
          expect(Array.isArray(createdService.features)).toBe(true);
          expect(createdService.features.length).toBeGreaterThan(0);
          
          expect(createdService.status).toBeDefined();
          expect(['active', 'inactive', 'archived']).toContain(createdService.status);
          
          expect(createdService.sort_order).toBeDefined();
          expect(typeof createdService.sort_order).toBe('number');
          expect(createdService.sort_order).toBeGreaterThanOrEqual(0);
          
          // Verify timestamps are present
          expect(createdService.created_at).toBeDefined();
          expect(createdService.updated_at).toBeDefined();
          
          // Verify optional fields handle null/undefined correctly
          if (serviceData.description !== null && serviceData.description !== undefined) {
            expect(createdService.description).toBe(serviceData.description);
          }
          
          if (serviceData.duration !== null && serviceData.duration !== undefined) {
            expect(createdService.duration).toBe(serviceData.duration);
          }
          
          if (serviceData.note !== null && serviceData.note !== undefined) {
            expect(createdService.note).toBe(serviceData.note);
          }
          
          if (serviceData.images !== null && serviceData.images !== undefined) {
            expect(createdService.images).toEqual(serviceData.images);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should validate features array contains only non-empty strings', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 255 }),
          category: fc.constantFrom('wedding', 'rom', 'pre-wedding', 'addon', 'personal'),
          price: fc.float({ min: 0.01, max: 10000 }),
          currency: fc.constant('RM' as const),
          features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 10 }),
          status: fc.constant('active' as const),
          sort_order: fc.integer({ min: 0, max: 100 })
        }),
        async (serviceData) => {
          const createdService = await CRMService.createService(serviceData);
          
          // Verify features array structure
          expect(Array.isArray(createdService.features)).toBe(true);
          expect(createdService.features.length).toBeGreaterThan(0);
          
          // Verify each feature is a non-empty string
          for (const feature of createdService.features) {
            expect(typeof feature).toBe('string');
            expect(feature.trim().length).toBeGreaterThan(0);
            expect(feature.length).toBeLessThanOrEqual(100);
          }
          
          // Verify no duplicate features
          const uniqueFeatures = [...new Set(createdService.features)];
          expect(uniqueFeatures.length).toBe(createdService.features.length);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should validate pricing and currency formatting', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 255 }),
          category: fc.constantFrom('wedding', 'rom', 'pre-wedding', 'addon', 'personal'),
          price: fc.float({ min: 0.01, max: 10000 }),
          currency: fc.constant('RM' as const),
          features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
          status: fc.constant('active' as const),
          sort_order: fc.integer({ min: 0, max: 100 })
        }),
        async (serviceData) => {
          const createdService = await CRMService.createService(serviceData);
          
          // Verify price is a positive number
          expect(typeof createdService.price).toBe('number');
          expect(createdService.price).toBeGreaterThan(0);
          expect(createdService.price).toBeLessThanOrEqual(10000);
          expect(Number.isFinite(createdService.price)).toBe(true);
          
          // Verify currency is always RM
          expect(createdService.currency).toBe('RM');
          
          // Verify price precision (should handle decimal places correctly)
          const priceString = createdService.price.toString();
          const decimalPlaces = priceString.includes('.') ? priceString.split('.')[1].length : 0;
          expect(decimalPlaces).toBeLessThanOrEqual(2);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should validate category constraints and sort order', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 255 }),
          category: fc.constantFrom('wedding', 'rom', 'pre-wedding', 'addon', 'personal'),
          price: fc.float({ min: 0.01, max: 10000 }),
          currency: fc.constant('RM' as const),
          features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
          status: fc.constantFrom('active', 'inactive', 'archived'),
          sort_order: fc.integer({ min: 0, max: 100 })
        }),
        async (serviceData) => {
          const createdService = await CRMService.createService(serviceData);
          
          // Verify category is from allowed values
          const allowedCategories = ['wedding', 'rom', 'pre-wedding', 'addon', 'personal'];
          expect(allowedCategories).toContain(createdService.category);
          
          // Verify status is from allowed values
          const allowedStatuses = ['active', 'inactive', 'archived'];
          expect(allowedStatuses).toContain(createdService.status);
          
          // Verify sort_order is a non-negative integer
          expect(typeof createdService.sort_order).toBe('number');
          expect(createdService.sort_order).toBeGreaterThanOrEqual(0);
          expect(Number.isInteger(createdService.sort_order)).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should validate form data processing and sanitization', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 255 }).map(s => `  ${s}  `), // Add whitespace
          category: fc.constantFrom('wedding', 'rom', 'pre-wedding', 'addon', 'personal'),
          price: fc.float({ min: 0.01, max: 10000 }),
          currency: fc.constant('RM' as const),
          features: fc.array(
            fc.string({ minLength: 1, maxLength: 100 }).map(s => `  ${s}  `), // Add whitespace
            { minLength: 1, maxLength: 5 }
          ),
          description: fc.option(fc.string({ maxLength: 1000 }).map(s => `  ${s}  `)),
          status: fc.constant('active' as const),
          sort_order: fc.integer({ min: 0, max: 100 })
        }),
        async (serviceData) => {
          const createdService = await CRMService.createService(serviceData);
          
          // Verify title is trimmed
          expect(createdService.title).toBe(serviceData.title.trim());
          expect(createdService.title).not.toMatch(/^\s|\s$/);
          
          // Verify features are trimmed and filtered
          for (const feature of createdService.features) {
            expect(feature).not.toMatch(/^\s|\s$/);
            expect(feature.length).toBeGreaterThan(0);
          }
          
          // Verify description is trimmed if present
          if (serviceData.description && createdService.description) {
            expect(createdService.description).toBe(serviceData.description.trim());
            expect(createdService.description).not.toMatch(/^\s|\s$/);
          }
        }
      ),
      { numRuns: 10 }
    );
  });
});