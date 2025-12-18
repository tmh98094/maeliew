import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fc from 'fast-check';
import { CRMService, ServicePackage } from '../services/crmService';
import { supabase } from '../lib/supabase';

/**
 * Feature: website-cms-whatsapp-enhancement, Property 1: Admin-to-public data consistency
 * Validates: Requirements 1.3, 2.2, 2.5
 */

describe('Admin-to-Public Data Consistency', () => {
  beforeEach(async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping tests');
      return;
    }
    
    // Clean up any existing test data
    await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  });

  afterEach(async () => {
    if (!supabase) return;
    
    // Clean up test data
    await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  });

  it('should immediately reflect service changes from admin panel on public pages', async () => {
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
          description: fc.option(fc.string({ maxLength: 1000 })),
          status: fc.constant('active' as const),
          sort_order: fc.integer({ min: 0, max: 100 })
        }),
        async (serviceData) => {
          // Create service in admin panel
          const createdService = await CRMService.createService(serviceData);
          
          // Immediately query public services (simulating public page access)
          const publicServices = await CRMService.getAllServices({ status: 'active' });
          
          // Verify the created service appears in public query
          const foundService = publicServices.find(s => s.id === createdService.id);
          expect(foundService).toBeDefined();
          expect(foundService?.title).toBe(createdService.title);
          expect(foundService?.price).toBe(createdService.price);
          expect(foundService?.category).toBe(createdService.category);
          
          // Update service in admin panel
          const updatedData = {
            title: `Updated ${serviceData.title}`,
            price: serviceData.price + 100
          };
          
          const updatedService = await CRMService.updateService(createdService.id, updatedData);
          
          // Immediately query public services again
          const updatedPublicServices = await CRMService.getAllServices({ status: 'active' });
          const foundUpdatedService = updatedPublicServices.find(s => s.id === createdService.id);
          
          // Verify updates are immediately visible
          expect(foundUpdatedService).toBeDefined();
          expect(foundUpdatedService?.title).toBe(updatedData.title);
          expect(foundUpdatedService?.price).toBe(updatedData.price);
          
          // Verify timestamps reflect the update
          expect(new Date(foundUpdatedService!.updated_at).getTime()).toBeGreaterThan(
            new Date(foundUpdatedService!.created_at).getTime()
          );
        }
      ),
      { numRuns: 5 }
    );
  });

  it('should maintain data consistency when services are created, updated, and deleted', async () => {
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
            features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 3 }),
            status: fc.constant('active' as const),
            sort_order: fc.integer({ min: 0, max: 100 })
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (servicesData) => {
          // Create multiple services
          const createdServices: ServicePackage[] = [];
          for (const serviceData of servicesData) {
            const created = await CRMService.createService(serviceData);
            createdServices.push(created);
          }
          
          // Verify all services appear in public query
          const allPublicServices = await CRMService.getAllServices({ status: 'active' });
          expect(allPublicServices.length).toBeGreaterThanOrEqual(createdServices.length);
          
          for (const createdService of createdServices) {
            const foundService = allPublicServices.find(s => s.id === createdService.id);
            expect(foundService).toBeDefined();
          }
          
          // Update one service
          const serviceToUpdate = createdServices[0];
          const updateData = { title: `Updated ${serviceToUpdate.title}` };
          await CRMService.updateService(serviceToUpdate.id, updateData);
          
          // Verify update is reflected in public query
          const updatedPublicServices = await CRMService.getAllServices({ status: 'active' });
          const updatedService = updatedPublicServices.find(s => s.id === serviceToUpdate.id);
          expect(updatedService?.title).toBe(updateData.title);
          
          // Delete one service
          const serviceToDelete = createdServices[1];
          await CRMService.deleteService(serviceToDelete.id);
          
          // Verify deletion is reflected in public query
          const finalPublicServices = await CRMService.getAllServices({ status: 'active' });
          const deletedService = finalPublicServices.find(s => s.id === serviceToDelete.id);
          expect(deletedService).toBeUndefined();
          
          // Verify remaining services are still present
          const remainingServices = createdServices.slice(2);
          for (const remainingService of remainingServices) {
            const foundService = finalPublicServices.find(s => s.id === remainingService.id);
            expect(foundService).toBeDefined();
          }
        }
      ),
      { numRuns: 3 }
    );
  });

  it('should ensure blog posts created in admin appear immediately on public journal page', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 255 }),
          description: fc.string({ minLength: 10, maxLength: 1000 }),
          type: fc.constant('blog' as const),
          status: fc.constantFrom('published', 'draft'),
          tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
          alt_text: fc.string({ minLength: 1, maxLength: 255 })
        }),
        async (blogData) => {
          // Create blog post in admin panel
          const createdBlog = await CRMService.createContent(blogData);
          
          // Immediately query public blog posts (simulating journal page access)
          const publicBlogs = await CRMService.getAllContent({ 
            type: 'blog', 
            status: blogData.status === 'published' ? 'published' : undefined 
          });
          
          if (blogData.status === 'published') {
            // Verify published blog appears in public query
            const foundBlog = publicBlogs.find(b => b.id === createdBlog.id);
            expect(foundBlog).toBeDefined();
            expect(foundBlog?.title).toBe(createdBlog.title);
            expect(foundBlog?.description).toBe(createdBlog.description);
            expect(foundBlog?.status).toBe('published');
          } else {
            // Verify draft blog does not appear in public query
            const foundBlog = publicBlogs.find(b => b.id === createdBlog.id);
            expect(foundBlog).toBeUndefined();
          }
          
          // Update blog status to published if it was draft
          if (blogData.status === 'draft') {
            await CRMService.updateContent(createdBlog.id, { status: 'published' });
            
            // Verify it now appears in public query
            const updatedPublicBlogs = await CRMService.getAllContent({ 
              type: 'blog', 
              status: 'published' 
            });
            const foundUpdatedBlog = updatedPublicBlogs.find(b => b.id === createdBlog.id);
            expect(foundUpdatedBlog).toBeDefined();
            expect(foundUpdatedBlog?.status).toBe('published');
          }
        }
      ),
      { numRuns: 5 }
    );
  });

  it('should maintain category-based filtering consistency between admin and public views', async () => {
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
            price: fc.float({ min: 0.01, max: 10000 }),
            currency: fc.constant('RM' as const),
            features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 3 }),
            status: fc.constant('active' as const),
            sort_order: fc.integer({ min: 0, max: 100 })
          }),
          { minLength: 3, maxLength: 6 }
        ),
        async (servicesData) => {
          // Create services with different categories
          const createdServices: ServicePackage[] = [];
          for (const serviceData of servicesData) {
            const created = await CRMService.createService(serviceData);
            createdServices.push(created);
          }
          
          // Test category filtering consistency
          const categories = [...new Set(servicesData.map(s => s.category))];
          
          for (const category of categories) {
            // Query admin view by category
            const adminCategoryServices = await CRMService.getAllServices({ category });
            
            // Query public view by category (simulating public page filtering)
            const publicCategoryServices = await CRMService.getServicesByCategory(category);
            
            // Verify both queries return the same services
            const expectedCount = servicesData.filter(s => s.category === category).length;
            expect(adminCategoryServices.length).toBeGreaterThanOrEqual(expectedCount);
            expect(publicCategoryServices.length).toBeGreaterThanOrEqual(expectedCount);
            
            // Verify all services in both results belong to the correct category
            for (const service of adminCategoryServices) {
              expect(service.category).toBe(category);
            }
            
            for (const service of publicCategoryServices) {
              expect(service.category).toBe(category);
              expect(service.status).toBe('active'); // Public view should only show active services
            }
            
            // Verify the same services appear in both views
            for (const adminService of adminCategoryServices) {
              if (adminService.status === 'active') {
                const foundInPublic = publicCategoryServices.find(s => s.id === adminService.id);
                expect(foundInPublic).toBeDefined();
              }
            }
          }
        }
      ),
      { numRuns: 3 }
    );
  });

  it('should ensure real-time updates maintain sort order consistency', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            category: fc.constant('wedding' as const),
            price: fc.float({ min: 0.01, max: 10000 }),
            currency: fc.constant('RM' as const),
            features: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 3 }),
            status: fc.constant('active' as const),
            sort_order: fc.integer({ min: 1, max: 10 })
          }),
          { minLength: 3, maxLength: 5 }
        ),
        async (servicesData) => {
          // Create services with different sort orders
          const createdServices: ServicePackage[] = [];
          for (const serviceData of servicesData) {
            const created = await CRMService.createService(serviceData);
            createdServices.push(created);
          }
          
          // Query services in sorted order (admin view)
          const adminSortedServices = await CRMService.getAllServices();
          
          // Query services in sorted order (public view)
          const publicSortedServices = await CRMService.getServicesByCategory();
          
          // Verify both views maintain sort order
          for (let i = 1; i < adminSortedServices.length; i++) {
            expect(adminSortedServices[i].sort_order).toBeGreaterThanOrEqual(
              adminSortedServices[i - 1].sort_order
            );
          }
          
          for (let i = 1; i < publicSortedServices.length; i++) {
            expect(publicSortedServices[i].sort_order).toBeGreaterThanOrEqual(
              publicSortedServices[i - 1].sort_order
            );
          }
          
          // Update sort order of one service
          const serviceToUpdate = createdServices[0];
          const newSortOrder = Math.max(...createdServices.map(s => s.sort_order)) + 1;
          
          await CRMService.updateService(serviceToUpdate.id, { sort_order: newSortOrder });
          
          // Verify updated sort order is reflected in both views
          const updatedAdminServices = await CRMService.getAllServices();
          const updatedPublicServices = await CRMService.getServicesByCategory();
          
          const updatedAdminService = updatedAdminServices.find(s => s.id === serviceToUpdate.id);
          const updatedPublicService = updatedPublicServices.find(s => s.id === serviceToUpdate.id);
          
          expect(updatedAdminService?.sort_order).toBe(newSortOrder);
          expect(updatedPublicService?.sort_order).toBe(newSortOrder);
        }
      ),
      { numRuns: 3 }
    );
  });
});