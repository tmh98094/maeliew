import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fc from 'fast-check';
import { CRMService } from '../services/crmService';
import { Content } from '../lib/supabase';
import { supabase } from '../lib/supabase';

/**
 * Feature: website-cms-whatsapp-enhancement, Property 3: Blog data integration
 * Validates: Requirements 2.1, 2.3, 2.4
 */

describe('Blog Data Integration', () => {
  beforeEach(async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping tests');
      return;
    }
    
    // Clean up any existing test data
    await supabase.from('content').delete().eq('type', 'blog').neq('id', '00000000-0000-0000-0000-000000000000');
  });

  afterEach(async () => {
    if (!supabase) return;
    
    // Clean up test data
    await supabase.from('content').delete().eq('type', 'blog').neq('id', '00000000-0000-0000-0000-000000000000');
  });

  it('should store blog posts in Supabase with proper metadata when created in admin panel', async () => {
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
          tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 5 }),
          keywords: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 5 }),
          alt_text: fc.option(fc.string({ minLength: 1, maxLength: 255 })),
          meta_title: fc.option(fc.string({ minLength: 1, maxLength: 255 })),
          meta_description: fc.option(fc.string({ minLength: 1, maxLength: 500 }))
        }),
        async (blogData) => {
          // Create blog post in admin panel (simulated)
          const createdBlog = await CRMService.createContent(blogData);
          
          // Verify blog is stored with proper metadata
          expect(createdBlog.id).toBeDefined();
          expect(typeof createdBlog.id).toBe('string');
          expect(createdBlog.title).toBe(blogData.title);
          expect(createdBlog.description).toBe(blogData.description);
          expect(createdBlog.type).toBe('blog');
          expect(createdBlog.status).toBe(blogData.status);
          
          // Verify metadata fields
          expect(createdBlog.created_at).toBeDefined();
          expect(createdBlog.updated_at).toBeDefined();
          expect(createdBlog.view_count).toBe(0);
          expect(createdBlog.download_count).toBe(0);
          
          // Verify optional metadata
          if (blogData.tags && blogData.tags.length > 0) {
            expect(createdBlog.tags).toEqual(blogData.tags);
          }
          if (blogData.keywords && blogData.keywords.length > 0) {
            expect(createdBlog.keywords).toEqual(blogData.keywords);
          }
          if (blogData.alt_text) {
            expect(createdBlog.alt_text).toBe(blogData.alt_text);
          }
          if (blogData.meta_title) {
            expect(createdBlog.meta_title).toBe(blogData.meta_title);
          }
          if (blogData.meta_description) {
            expect(createdBlog.meta_description).toBe(blogData.meta_description);
          }
          
          // Verify published_at is set for published posts
          if (blogData.status === 'published') {
            expect(createdBlog.published_at).toBeDefined();
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should display published blog posts from Supabase on public journal page', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            description: fc.string({ minLength: 10, maxLength: 1000 }),
            type: fc.constant('blog' as const),
            status: fc.constantFrom('published', 'draft'),
            tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 3 })
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (blogPostsData) => {
          // Create multiple blog posts with different statuses
          const createdBlogs: Content[] = [];
          for (const blogData of blogPostsData) {
            const created = await CRMService.createContent(blogData);
            createdBlogs.push(created);
          }
          
          // Query public blog posts (simulating journal page access)
          const publicBlogs = await CRMService.getAllContent({ 
            type: 'blog', 
            status: 'published' 
          });
          
          // Verify only published blogs appear in public query
          const publishedBlogs = createdBlogs.filter(blog => blog.status === 'published');
          expect(publicBlogs.length).toBeGreaterThanOrEqual(publishedBlogs.length);
          
          // Verify each published blog appears in public results
          for (const publishedBlog of publishedBlogs) {
            const foundBlog = publicBlogs.find(blog => blog.id === publishedBlog.id);
            expect(foundBlog).toBeDefined();
            expect(foundBlog?.title).toBe(publishedBlog.title);
            expect(foundBlog?.description).toBe(publishedBlog.description);
            expect(foundBlog?.status).toBe('published');
          }
          
          // Verify draft blogs do not appear in public results
          const draftBlogs = createdBlogs.filter(blog => blog.status === 'draft');
          for (const draftBlog of draftBlogs) {
            const foundBlog = publicBlogs.find(blog => blog.id === draftBlog.id);
            expect(foundBlog).toBeUndefined();
          }
        }
      ),
      { numRuns: 5 }
    );
  });

  it('should handle blog post images through Supabase storage integration', async () => {
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
          status: fc.constant('published' as const),
          file_path: fc.option(fc.webUrl()),
          file_name: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
          file_size: fc.option(fc.integer({ min: 1000, max: 5000000 })),
          mime_type: fc.option(fc.constantFrom('image/jpeg', 'image/png', 'image/webp')),
          width: fc.option(fc.integer({ min: 100, max: 2000 })),
          height: fc.option(fc.integer({ min: 100, max: 2000 })),
          alt_text: fc.option(fc.string({ minLength: 1, maxLength: 255 }))
        }),
        async (blogData) => {
          // Create blog post with image metadata
          const createdBlog = await CRMService.createContent(blogData);
          
          // Verify image metadata is stored correctly
          if (blogData.file_path) {
            expect(createdBlog.file_path).toBe(blogData.file_path);
          }
          if (blogData.file_name) {
            expect(createdBlog.file_name).toBe(blogData.file_name);
          }
          if (blogData.file_size) {
            expect(createdBlog.file_size).toBe(blogData.file_size);
          }
          if (blogData.mime_type) {
            expect(createdBlog.mime_type).toBe(blogData.mime_type);
          }
          if (blogData.width) {
            expect(createdBlog.width).toBe(blogData.width);
          }
          if (blogData.height) {
            expect(createdBlog.height).toBe(blogData.height);
          }
          if (blogData.alt_text) {
            expect(createdBlog.alt_text).toBe(blogData.alt_text);
          }
          
          // Query the blog post to verify image data is retrievable
          const retrievedBlog = await CRMService.getContentById(createdBlog.id);
          expect(retrievedBlog.file_path).toBe(createdBlog.file_path);
          expect(retrievedBlog.alt_text).toBe(createdBlog.alt_text);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should display proper publication dates, titles, and excerpts in blog listings', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            description: fc.string({ minLength: 50, maxLength: 1000 }),
            type: fc.constant('blog' as const),
            status: fc.constant('published' as const),
            tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 3 })
          }),
          { minLength: 1, maxLength: 3 }
        ),
        async (blogPostsData) => {
          // Create blog posts
          const createdBlogs: Content[] = [];
          for (const blogData of blogPostsData) {
            const created = await CRMService.createContent(blogData);
            createdBlogs.push(created);
          }
          
          // Query blog posts for public display
          const publicBlogs = await CRMService.getAllContent({ 
            type: 'blog', 
            status: 'published' 
          });
          
          // Verify each blog has proper display data
          for (const blog of publicBlogs) {
            // Verify title is present and matches
            expect(blog.title).toBeDefined();
            expect(typeof blog.title).toBe('string');
            expect(blog.title.length).toBeGreaterThan(0);
            
            // Verify description/excerpt is present
            expect(blog.description).toBeDefined();
            expect(typeof blog.description).toBe('string');
            expect(blog.description.length).toBeGreaterThan(0);
            
            // Verify publication date is present
            expect(blog.created_at).toBeDefined();
            expect(new Date(blog.created_at)).toBeInstanceOf(Date);
            expect(new Date(blog.created_at).getTime()).not.toBeNaN();
            
            // If published_at exists, verify it's a valid date
            if (blog.published_at) {
              expect(new Date(blog.published_at)).toBeInstanceOf(Date);
              expect(new Date(blog.published_at).getTime()).not.toBeNaN();
            }
            
            // Verify status is published
            expect(blog.status).toBe('published');
            
            // Verify tags are properly formatted if present
            if (blog.tags && blog.tags.length > 0) {
              expect(Array.isArray(blog.tags)).toBe(true);
              for (const tag of blog.tags) {
                expect(typeof tag).toBe('string');
                expect(tag.length).toBeGreaterThan(0);
              }
            }
          }
        }
      ),
      { numRuns: 5 }
    );
  });

  it('should maintain proper ordering and filtering for blog post listings', async () => {
    if (!supabase) {
      console.warn('Supabase not configured, skipping test');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            description: fc.string({ minLength: 10, maxLength: 1000 }),
            type: fc.constant('blog' as const),
            status: fc.constant('published' as const)
          }),
          { minLength: 3, maxLength: 6 }
        ),
        async (blogPostsData) => {
          // Create blog posts with slight delays to ensure different timestamps
          const createdBlogs: Content[] = [];
          for (let i = 0; i < blogPostsData.length; i++) {
            const blogData = blogPostsData[i];
            const created = await CRMService.createContent(blogData);
            createdBlogs.push(created);
            
            // Small delay to ensure different timestamps
            if (i < blogPostsData.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          }
          
          // Query blog posts (should be ordered by creation date, newest first)
          const orderedBlogs = await CRMService.getAllContent({ 
            type: 'blog', 
            status: 'published' 
          });
          
          // Verify blogs are returned in reverse chronological order
          for (let i = 1; i < orderedBlogs.length; i++) {
            const currentDate = new Date(orderedBlogs[i].created_at);
            const previousDate = new Date(orderedBlogs[i - 1].created_at);
            expect(currentDate.getTime()).toBeLessThanOrEqual(previousDate.getTime());
          }
          
          // Verify all created blogs appear in results
          expect(orderedBlogs.length).toBeGreaterThanOrEqual(createdBlogs.length);
          
          for (const createdBlog of createdBlogs) {
            const foundBlog = orderedBlogs.find(blog => blog.id === createdBlog.id);
            expect(foundBlog).toBeDefined();
            expect(foundBlog?.status).toBe('published');
          }
        }
      ),
      { numRuns: 3 }
    );
  });

  it('should handle blog post updates and maintain data consistency', async () => {
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
          status: fc.constant('draft' as const)
        }),
        async (blogData) => {
          // Create draft blog post
          const createdBlog = await CRMService.createContent(blogData);
          expect(createdBlog.status).toBe('draft');
          
          // Verify draft doesn't appear in public listings
          const publicBlogsBefore = await CRMService.getAllContent({ 
            type: 'blog', 
            status: 'published' 
          });
          const foundDraft = publicBlogsBefore.find(blog => blog.id === createdBlog.id);
          expect(foundDraft).toBeUndefined();
          
          // Update blog to published status
          const updatedBlog = await CRMService.updateContent(createdBlog.id, { 
            status: 'published',
            title: `Updated ${blogData.title}`
          });
          
          expect(updatedBlog.status).toBe('published');
          expect(updatedBlog.title).toBe(`Updated ${blogData.title}`);
          
          // Verify updated blog now appears in public listings
          const publicBlogsAfter = await CRMService.getAllContent({ 
            type: 'blog', 
            status: 'published' 
          });
          const foundPublished = publicBlogsAfter.find(blog => blog.id === createdBlog.id);
          expect(foundPublished).toBeDefined();
          expect(foundPublished?.status).toBe('published');
          expect(foundPublished?.title).toBe(`Updated ${blogData.title}`);
          
          // Verify updated_at timestamp changed
          expect(new Date(foundPublished!.updated_at).getTime()).toBeGreaterThan(
            new Date(foundPublished!.created_at).getTime()
          );
        }
      ),
      { numRuns: 5 }
    );
  });
});