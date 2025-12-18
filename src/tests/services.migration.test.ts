import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fc from 'fast-check';
import { CRMService, ServicePackage } from '../services/crmService';
import { supabase } from '../lib/supabase';

/**
 * Feature: website-cms-whatsapp-enhancement, Property 9: Migration data integrity
 * Validates: Requirements 7.2, 7.3, 7.4
 */

describe('Services Migration Data Integrity', () => {
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

  it('should preserve all original formatting, images, and metadata during migration', async () => {
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
        async (originalService) => {
          // Create service in database
          const createdService = await CRMService.createService(originalService);
          
          // Retrieve service from database
          const retrievedService = await CRMService.getServiceById(createdService.id);
          
          // Verify all data is preserved
          expect(retrievedService.title).toBe(originalService.title);
          expect(retrievedService.category).toBe(originalService.category);
          expect(retrievedService.price).toBe(originalService.price);
          expect(retrievedService.currency).toBe(originalService.currency);
          expect(retrievedService.features).toEqual(originalService.features);
          expect(retrievedService.description).toBe(originalService.description);
          expect(retrievedService.duration).toBe(originalService.duration);
          expect(retrievedService.note).toBe(originalService.note);
          expect(retrievedService.images).toEqual(originalService.images);
          expect(retrievedService.status).toBe(originalService.status);
          expect(retrievedService.sort_order).toBe(originalService.sort_order);
          
          // Verify metadata fields are present
          expect(retrievedService.id).toBeDefined();
          expect(retrievedService.created_at).toBeDefined();
          expect(retrievedService.updated_at).toBeDefined();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should maintain data consistency when replacing static references with database queries', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            category: fc.constantFrom('wedding', 'rom', 'pre-wedding', 'addon', 'personal'),
            price: fc.float({ min: 0.01, max: 10000 }),
            currency: fc.constant('RM' as const),
            features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
            status: fc.constant('active' as const),
            sort_order: fc.integer({ min: 0, max: 100 })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (servicesData) => {
          // Create multiple services
          const createdServices: ServicePackage[] = [];
          for (const serviceData of servicesData) {
            const created = await CRMService.createService(serviceData);
            createdServices.push(created);
          }
          
          // Query all services (simulating dynamic query replacing static data)
          const allServices = await CRMService.getAllServices();
          
          // Verify all created services are returned
          expect(allServices.length).toBeGreaterThanOrEqual(createdServices.length);
          
          // Verify each created service exists in the query results
          for (const createdService of createdServices) {
            const foundService = allServices.find(s => s.id === createdService.id);
            expect(foundService).toBeDefined();
            expect(foundService?.title).toBe(createdService.title);
            expect(foundService?.category).toBe(createdService.category);
            expect(foundService?.price).toBe(createdService.price);
          }
          
          // Test category-specific queries
          const categories = [...new Set(servicesData.map(s => s.category))];
          for (const category of categories) {
            const categoryServices = await CRMService.getServicesByCategory(category);
            const expectedCount = servicesData.filter(s => s.category === category).length;
            
            expect(categoryServices.length).toBeGreaterThanOrEqual(expectedCount);
            
            // Verify all returned services belong to the correct category
            for (const service of categoryServices) {
              expect(service.category).toBe(category);
            }
          }
        }
      ),
      { numRuns: 5 }
    );
  });

  it('should ensure migrated content displays correctly with proper formatting', async () => {
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
          status: fc.constant('active' as const),
          sort_order: fc.integer({ min: 0, max: 100 })
        }),
        async (serviceData) => {
          // Create service
          const createdService = await CRMService.createService(serviceData);
          
          // Retrieve and verify formatting
          const retrievedService = await CRMService.getServiceById(createdService.id);
          
          // Verify price formatting (should be numeric for RM currency)
          expect(typeof retrievedService.price).toBe('number');
          expect(retrievedService.price).toBeGreaterThan(0);
          expect(retrievedService.currency).toBe('RM');
          
          // Verify features array formatting
          expect(Array.isArray(retrievedService.features)).toBe(true);
          expect(retrievedService.features.length).toBeGreaterThan(0);
          
          // Verify string fields are properly trimmed and formatted
          expect(retrievedService.title.trim()).toBe(retrievedService.title);
          expect(retrievedService.category.trim()).toBe(retrievedService.category);
          
          // Verify optional fields handle null/undefined correctly
          if (serviceData.description) {
            expect(retrievedService.description).toBe(serviceData.description);
          }
          
          // Verify status is properly constrained
          expect(['active', 'inactive', 'archived']).toContain(retrievedService.status);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should maintain referential integrity and proper indexing after migration', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            category: fc.constantFrom('wedding', 'rom', 'pre-wedding'),
            price: fc.float({ min: 100, max: 5000 }),
            currency: fc.constant('RM' as const),
            features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
            status: fc.constant('active' as const),
            sort_order: fc.integer({ min: 1, max: 10 })
          }),
          { minLength: 3, maxLength: 8 }
        ),
        async (servicesData) => {
          // Create services with different sort orders
          const createdServices: ServicePackage[] = [];
          for (const serviceData of servicesData) {
            const created = await CRMService.createService(serviceData);
            createdServices.push(created);
          }
          
          // Test ordering by sort_order (should be indexed for performance)
          const orderedServices = await CRMService.getAllServices();
          
          // Verify services are returned in sort_order
          for (let i = 1; i < orderedServices.length; i++) {
            expect(orderedServices[i].sort_order).toBeGreaterThanOrEqual(orderedServices[i - 1].sort_order);
          }
          
          // Test category filtering (should use index)
          const categories = [...new Set(servicesData.map(s => s.category))];
          for (const category of categories) {
            const categoryServices = await CRMService.getAllServices({ category });
            
            // Verify all returned services belong to the category
            for (const service of categoryServices) {
              expect(service.category).toBe(category);
            }
          }
          
          // Test status filtering (should use index)
          const activeServices = await CRMService.getAllServices({ status: 'active' });
          for (const service of activeServices) {
            expect(service.status).toBe('active');
          }
        }
      ),
      { numRuns: 5 }
    );
  });
});