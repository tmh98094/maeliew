# Website CMS and WhatsApp Enhancement Design Document

## Overview

This design document outlines the comprehensive enhancement of the Mae Liew Atelier website to implement full CMS functionality for services management, fix blog integration issues, localize contact forms for Malaysia, and add WhatsApp integration features. The enhancement builds upon the existing Supabase infrastructure to create a fully content-manageable website with direct client communication channels.

The current website already has a robust CRM system with Supabase integration, React components, and admin panel functionality. Our enhancements will extend this system to cover services management, fix blog data flow issues, implement Malaysia-specific localization, and add WhatsApp business integration for improved client engagement.

## Architecture

### Enhanced CMS Architecture
The enhanced website will extend the existing Supabase-based CRM system:

- **Services Management System**: Full CRUD operations for service packages with pricing, descriptions, and image galleries
- **Blog System Integration**: Fixed data flow from admin panel to public blog pages using Supabase
- **WhatsApp Integration Layer**: URL generation and message templating for direct client communication
- **Localization Layer**: Malaysia-specific formatting for currency, phone numbers, and contact information
- **Portfolio Simplification**: Streamlined portfolio display without case study complexity

### Data Flow Architecture
```
Admin Panel → Supabase Database → Public Website
     ↓              ↓                    ↓
Services CMS → Services Table → Services Page
Blog Manager → Content Table → Journal Page
             ↓
WhatsApp Integration → URL Generation → Client Communication
```

### State Management Enhancement
Building on existing React state management:
- Extended CRM service for services management
- Blog data integration with existing content system
- WhatsApp URL generation utilities
- Malaysia localization context providers

## Components and Interfaces

### Services Management System
```typescript
interface ServicePackage {
  id: string;
  title: string;
  category: 'wedding' | 'rom' | 'pre-wedding' | 'personal';
  price: number;
  currency: 'RM';
  features: string[];
  description?: string;
  duration?: string;
  note?: string;
  images?: string[];
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

interface ServicesManagerProps {
  services: ServicePackage[];
  onCreateService: (service: Omit<ServicePackage, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateService: (id: string, updates: Partial<ServicePackage>) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
}
```

### WhatsApp Integration System
```typescript
interface WhatsAppConfig {
  businessNumber: '+60 12-2681879';
  messageTemplates: {
    serviceInquiry: (serviceName: string, servicePrice: string) => string;
    generalInquiry: () => string;
  };
}

interface WhatsAppButtonProps {
  type: 'service' | 'general';
  serviceName?: string;
  servicePrice?: string;
  className?: string;
  children: React.ReactNode;
}

interface WhatsAppFloaterProps {
  position: 'bottom-right' | 'bottom-left';
  offset: { x: number; y: number };
  zIndex: number;
}
```

### Malaysia Localization System
```typescript
interface MalaysiaLocalization {
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
```

### Enhanced Blog Integration
```typescript
interface BlogPost extends Content {
  type: 'blog';
  published_at?: string;
  excerpt?: string;
  reading_time?: number;
  featured_image?: string;
}

interface BlogDisplayProps {
  posts: BlogPost[];
  loading: boolean;
  error?: string;
}
```

## Data Models

### Services Database Schema
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'RM',
  features JSONB NOT NULL DEFAULT '[]',
  description TEXT,
  duration VARCHAR(100),
  note TEXT,
  images JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### WhatsApp Integration Model
```typescript
interface WhatsAppMessage {
  recipient: string;
  message: string;
  url: string;
  metadata: {
    source: 'service_inquiry' | 'general_contact' | 'floater';
    service_id?: string;
    timestamp: Date;
  };
}
```

### Malaysia Localization Model
```typescript
interface LocalizedContent {
  currency_format: 'RM {amount}';
  phone_format: '+60 {number}';
  date_format: 'DD/MM/YYYY';
  business_info: {
    email: 'maeliew@gmail.com';
    phone: '+60 12-2681879';
    address: 'Foresta Damansara Condominium, Persiaran Meranti, Bandar Sri Damansara';
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all properties identified in the prework, I've consolidated related properties to eliminate redundancy and ensure each property provides unique validation value:

**Consolidation Analysis:**
- Properties 1.1-1.3 and 2.1-2.2, 2.5 relate to admin-to-public data consistency and can be combined
- Properties 1.5, 3.2 both relate to RM currency formatting and can be consolidated
- Properties 4.1-4.4 all relate to WhatsApp integration functionality and can be grouped
- Properties 5.1-5.5 all relate to portfolio simplification and can be combined
- Properties 6.1-6.5 all relate to WhatsApp floater functionality and can be consolidated
- Properties 7.2-7.4 relate to migration data integrity and can be combined

Property 1: Admin-to-public data consistency
*For any* content created or updated in the admin panel (services or blog posts), the changes should be immediately visible on the corresponding public pages
**Validates: Requirements 1.3, 2.2, 2.5**

Property 2: Services data structure completeness
*For any* service created through the Services Manager, it should contain all required fields (title, description, pricing, duration, features) and validate properly
**Validates: Requirements 1.2**

Property 3: Blog data integration
*For any* blog post created in the admin panel, it should be stored in Supabase with proper metadata and displayed on the journal page instead of mock data
**Validates: Requirements 2.1, 2.3, 2.4**

Property 4: Malaysian currency formatting
*For any* price or budget amount displayed on the website, it should be formatted with RM currency symbol and Malaysian conventions
**Validates: Requirements 1.5, 3.2**

Property 5: Malaysian phone number handling
*For any* phone number input or validation, it should use +60 country code and validate Malaysian phone number formats
**Validates: Requirements 3.1, 3.4, 3.5**

Property 6: WhatsApp integration functionality
*For any* WhatsApp button or link, it should generate correct URLs with the business number +60 12-2681879 and include appropriate service-specific message templates
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

Property 7: WhatsApp floater presence and functionality
*For any* page on the website, the WhatsApp floater should be present, accessible, and maintain consistent styling without blocking content
**Validates: Requirements 6.1, 6.3, 6.4, 6.5**

Property 8: Portfolio content simplification
*For any* portfolio item displayed, it should show only essential information (title, category, images) without case study details while maintaining clean layout
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

Property 9: Migration data integrity
*For any* content migrated from static files to Supabase, it should preserve all original formatting, images, and metadata while replacing static references with database queries
**Validates: Requirements 7.2, 7.3, 7.4**

## Error Handling

### Services Management Errors
- Graceful handling of Supabase connection failures with retry mechanisms
- Validation errors for incomplete service data with clear user feedback
- Image upload failures with fallback options and error messages
- Currency conversion errors with default RM formatting

### Blog Integration Errors
- Fallback to cached content when Supabase is unavailable
- Image upload failures with placeholder handling
- Publishing errors with draft state preservation
- Content validation errors with detailed feedback

### WhatsApp Integration Errors
- URL generation failures with fallback to manual contact information
- Mobile app detection for WhatsApp availability
- Message template errors with basic message fallback
- Network connectivity issues with offline contact options

### Localization Errors
- Currency formatting failures with basic number display
- Phone number validation errors with clear format guidance
- Date/time formatting issues with ISO standard fallback
- Translation missing errors with English fallback

## Testing Strategy

### Dual Testing Approach

The testing strategy will implement both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Testing Requirements:**
- Unit tests will verify specific examples, edge cases, and error conditions
- Integration tests will verify CMS data flow from admin to public pages
- UI tests will validate WhatsApp button functionality and floater behavior
- Localization tests will verify Malaysian formatting standards
- Migration tests will validate data transfer accuracy

**Property-Based Testing Requirements:**
- Property-based tests will use **fast-check** as the testing library for JavaScript/TypeScript
- Each property-based test will run a minimum of 100 iterations to ensure thorough coverage
- Property-based tests will be tagged with comments referencing the design document properties
- Each test will use the format: '**Feature: website-cms-whatsapp-enhancement, Property {number}: {property_text}**'
- Tests will generate random data to validate universal properties across all inputs

**Testing Framework Configuration:**
- Jest will be used as the primary testing framework
- React Testing Library for component testing
- fast-check for property-based testing
- Supabase test client for database integration testing
- Playwright for end-to-end WhatsApp integration testing

### Services Management Testing
- CRUD operations testing for all service management functions
- Data validation testing for service creation and updates
- Image upload and storage testing with Supabase integration
- Currency formatting testing for Malaysian Ringgit display

### Blog Integration Testing
- Data flow testing from admin panel to public blog pages
- Image handling testing for blog post featured images
- Content status testing (draft, published, archived)
- Metadata preservation testing during content operations

### WhatsApp Integration Testing
- URL generation testing for various service types and scenarios
- Message template testing with different service parameters
- Mobile compatibility testing for WhatsApp app integration
- Floater positioning and accessibility testing across devices

### Localization Testing
- Currency formatting testing for various price ranges
- Phone number validation testing for Malaysian formats
- Contact form localization testing with Malaysian standards
- Business information consistency testing across all pages

### Migration Testing
- Data integrity testing during static-to-database migration
- Content preservation testing for formatting and metadata
- Reference replacement testing for static imports to database queries
- Cleanup testing for removal of migrated static files

### Performance Testing
- Database query optimization for services and blog content
- Image loading performance for service galleries and blog posts
- WhatsApp URL generation performance under load
- Responsive design performance across device types