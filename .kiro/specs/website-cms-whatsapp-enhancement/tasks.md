# Website CMS and WhatsApp Enhancement Implementation Plan

- [x] 1. Set up Services CMS database schema and migration


  - Create Supabase services table with proper schema for packages, pricing, and features
  - Set up database functions for services CRUD operations
  - Create migration script to transfer existing services data from static files to Supabase
  - Add RLS policies for services table security
  - _Requirements: 1.1, 1.4, 7.1, 7.2_



- [x] 1.1 Write property test for migration data integrity


  - **Property 9: Migration data integrity**
  - **Validates: Requirements 7.2, 7.3, 7.4**

- [ ] 2. Create Services Manager component for admin panel
  - Build comprehensive services management interface with create, edit, delete functionality
  - Implement form validation for service data (title, description, pricing, features)


  - Add image gallery management for service packages
  - Integrate with existing CRM service architecture


  - _Requirements: 1.1, 1.2, 1.3_



- [ ] 2.1 Write property test for services data structure completeness
  - **Property 2: Services data structure completeness**
  - **Validates: Requirements 1.2**

- [x] 2.2 Write property test for admin-to-public data consistency


  - **Property 1: Admin-to-public data consistency**


  - **Validates: Requirements 1.3, 2.2, 2.5**

- [ ] 3. Update Services page to use Supabase data
  - Replace static services data with dynamic Supabase queries
  - Implement Malaysian Ringgit (RM) currency formatting throughout services display
  - Update service package rendering to use database content


  - Ensure real-time updates when admin changes are made


  - _Requirements: 1.3, 1.5, 7.3_

- [ ] 3.1 Write property test for Malaysian currency formatting
  - **Property 4: Malaysian currency formatting**
  - **Validates: Requirements 1.5, 3.2**

- [x] 4. Fix Blog/Journal system integration


  - Update Blog page to query Supabase content table instead of using mock data


  - Ensure blog posts created in admin panel appear on public journal page
  - Fix image handling for blog post featured images through Supabase storage
  - Implement proper blog post metadata display (dates, titles, excerpts)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.1 Write property test for blog data integration


  - **Property 3: Blog data integration**


  - **Validates: Requirements 2.1, 2.3, 2.4**

- [ ] 5. Implement Malaysia localization for contact form
  - Update contact form phone number placeholder to use +60 Malaysia country code
  - Convert all budget ranges to Malaysian Ringgit (RM) currency
  - Set default recipient email to maeliew@gmail.com
  - Implement Malaysian phone number format validation


  - Update form submission to use Malaysian formatting standards


  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5.1 Write property test for Malaysian phone number handling
  - **Property 5: Malaysian phone number handling**
  - **Validates: Requirements 3.1, 3.4, 3.5**

- [ ] 6. Create WhatsApp integration system
  - Build WhatsApp URL generation utility with business number +60 12-2681879
  - Create message templates for service-specific inquiries
  - Implement "I want this service" buttons for each service package
  - Add service details to WhatsApp message templates
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 6.1 Write property test for WhatsApp integration functionality
  - **Property 6: WhatsApp integration functionality**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ] 7. Implement WhatsApp floating contact button
  - Create floating WhatsApp button component with business number integration
  - Position floater to be accessible without blocking important content
  - Optimize floater size and positioning for mobile devices
  - Ensure consistent styling with website design system
  - Add floater to all pages across the website
  - _Requirements: 4.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 7.1 Write property test for WhatsApp floater presence and functionality
  - **Property 7: WhatsApp floater presence and functionality**
  - **Validates: Requirements 6.1, 6.3, 6.4, 6.5**

- [ ] 8. Simplify Portfolio page by removing case studies
  - Remove case study components from portfolio display
  - Update portfolio items to show only title, category, and image gallery
  - Maintain clean gallery layout and smooth navigation between categories
  - Focus on visual presentation rather than detailed case studies
  - Ensure portfolio loading and navigation remains smooth
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8.1 Write property test for portfolio content simplification
  - **Property 8: Portfolio content simplification**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [ ] 9. Execute data migration and cleanup
  - Run migration script to transfer all existing services data to Supabase
  - Verify all migrated content displays correctly from database
  - Replace remaining static data imports with dynamic Supabase queries
  - Remove static data files that have been successfully migrated
  - Test all functionality to ensure no regressions
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10. Integration testing and validation checkpoint
  - Ensure all tests pass, ask the user if questions arise
  - Verify services CMS functionality works end-to-end
  - Test blog system displays Supabase data correctly
  - Validate WhatsApp integration works on all devices
  - Confirm Malaysia localization is applied consistently
  - Test portfolio simplification maintains good UX

- [ ] 10.1 Write comprehensive integration tests
  - Test complete data flow from admin panel to public pages
  - Verify WhatsApp integration across different browsers and devices
  - Test Malaysia localization formatting in various scenarios
  - Validate portfolio navigation and display after case study removal

- [ ] 11. Performance optimization and final polish
  - Optimize database queries for services and blog content loading
  - Ensure WhatsApp URL generation performs well under load
  - Test responsive design for all new components across device sizes
  - Validate accessibility compliance for new UI elements
  - Conduct final quality assurance testing
  - _Requirements: All requirements final validation_