# Website CMS and WhatsApp Enhancement Requirements

## Introduction

This document outlines the requirements for enhancing the Mae Liew Atelier website with comprehensive CMS functionality for services, fixing blog integration, localizing contact forms for Malaysia, and adding WhatsApp integration features. The enhancement will focus on making the website fully content-manageable through the admin panel while adding direct client communication channels.

## Glossary

- **Mae Liew Atelier**: The professional makeup artist website and brand
- **CMS System**: Content Management System integrated with Supabase for dynamic content
- **Admin Panel**: Administrative interface for managing website content
- **Services Manager**: Component for managing service packages and pricing
- **Blog System**: Journal/blog functionality with Supabase integration
- **WhatsApp Integration**: Direct messaging system connecting to WhatsApp Business
- **Contact Form**: Localized contact form with Malaysia-specific formatting
- **WhatsApp Floater**: Floating WhatsApp contact button

## Requirements

### Requirement 1

**User Story:** As a website administrator, I want to manage all services content through the admin panel, so that I can easily update service packages, descriptions, and pricing without code changes.

#### Acceptance Criteria

1. WHEN accessing the admin panel, THE Services Manager SHALL display all existing services with full editing capabilities
2. WHEN creating a new service, THE Services Manager SHALL allow input of title, description, pricing, duration, and image gallery
3. WHEN updating service content, THE Services Manager SHALL immediately reflect changes on the public services page
4. WHEN migrating existing services, THE CMS System SHALL import all current service data from static files to Supabase
5. WHERE service packages are displayed, THE CMS System SHALL show pricing in Malaysian Ringgit (RM) format

### Requirement 2

**User Story:** As a website administrator, I want the blog/journal functionality to work properly with Supabase data, so that published blog posts appear on the website instead of showing mock data.

#### Acceptance Criteria

1. WHEN blog posts are created in the admin panel, THE Blog System SHALL store them in Supabase with proper metadata
2. WHEN visitors access the journal page, THE Blog System SHALL display published posts from Supabase instead of mock data
3. WHEN blog posts include images, THE Blog System SHALL handle image uploads and display through Supabase storage
4. WHERE blog posts are listed, THE Blog System SHALL show proper publication dates, titles, and excerpts
5. WHEN blog posts are updated, THE Blog System SHALL reflect changes immediately on the public journal page

### Requirement 3

**User Story:** As a potential client in Malaysia, I want the contact form to use local formatting and currency, so that I can easily provide my information and budget preferences.

#### Acceptance Criteria

1. WHEN viewing the contact form, THE Contact Form SHALL display phone number placeholder with Malaysia country code (+60)
2. WHEN selecting budget ranges, THE Contact Form SHALL show all amounts in Malaysian Ringgit (RM)
3. WHEN the form loads, THE Contact Form SHALL pre-populate the email field with maeliew@gmail.com as the recipient
4. WHERE validation occurs, THE Contact Form SHALL validate Malaysian phone number formats
5. WHEN form submission happens, THE Contact Form SHALL format all data according to Malaysian standards

### Requirement 4

**User Story:** As a potential client, I want to easily inquire about specific services through WhatsApp, so that I can get quick responses and start the booking process.

#### Acceptance Criteria

1. WHEN viewing any service package, THE WhatsApp Integration SHALL display an "I want this service" button
2. WHEN clicking a service button, THE WhatsApp Integration SHALL open WhatsApp with pre-filled message including the specific service name
3. WHEN WhatsApp opens, THE WhatsApp Integration SHALL connect to the business number +60 12-2681879
4. WHERE service inquiries are made, THE WhatsApp Integration SHALL include service details in the message template
5. WHEN users want general contact, THE WhatsApp Integration SHALL provide a floating WhatsApp button for easy access

### Requirement 5

**User Story:** As a website visitor, I want a streamlined portfolio section without case studies, so that I can quickly browse Mae Liew's work without excessive detail.

#### Acceptance Criteria

1. WHEN viewing the portfolio page, THE Portfolio System SHALL display only portfolio images and basic project information
2. WHEN case study components are removed, THE Portfolio System SHALL maintain clean gallery layout and navigation
3. WHERE portfolio items are displayed, THE Portfolio System SHALL show title, category, and image gallery only
4. WHEN portfolio content loads, THE Portfolio System SHALL focus on visual presentation rather than detailed case studies
5. WHILE browsing portfolio, THE Portfolio System SHALL provide smooth navigation between different work categories

### Requirement 6

**User Story:** As a website visitor, I want persistent access to WhatsApp contact, so that I can easily reach out for inquiries at any time while browsing.

#### Acceptance Criteria

1. WHEN visiting any page, THE WhatsApp Floater SHALL display a floating WhatsApp contact button
2. WHEN clicking the floater, THE WhatsApp Floater SHALL open WhatsApp with the business number +60 12-2681879
3. WHERE the floater is positioned, THE WhatsApp Floater SHALL remain accessible without blocking important content
4. WHEN on mobile devices, THE WhatsApp Floater SHALL be optimally sized for touch interaction
5. WHILE browsing, THE WhatsApp Floater SHALL maintain consistent styling with the website's design system

### Requirement 7

**User Story:** As a website administrator, I want all existing content migrated to Supabase, so that the entire website operates through the CMS without any static data dependencies.

#### Acceptance Criteria

1. WHEN migration begins, THE CMS System SHALL transfer all existing services data to Supabase tables
2. WHEN content is migrated, THE CMS System SHALL preserve all existing formatting, images, and metadata
3. WHERE static data exists, THE CMS System SHALL replace static imports with dynamic Supabase queries
4. WHEN migration completes, THE CMS System SHALL verify all content displays correctly from the database
5. WHILE maintaining functionality, THE CMS System SHALL remove all static data files that have been migrated