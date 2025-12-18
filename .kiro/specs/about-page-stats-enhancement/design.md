# Homepage & About Page Stats Enhancement Design

## Overview

This design document outlines the implementation of three key components for both the Mae Liew Atelier Homepage and About page: Card Stats, Animated Featured On Showreel, and Partners section. These components will be strategically placed to provide immediate social proof and establish credibility on both key pages.

## Architecture

### Component Structure
```
About Page Enhancement
├── StatsCards Component
│   ├── StatCard (Years)
│   ├── StatCard (Brides) 
│   └── StatCard (Satisfaction)
├── AnimatedFeaturedShowreel Component
│   ├── ScrollingContainer
│   ├── LogoItems (from database)
│   └── Animation Controller
└── PartnersGrid Component
    ├── PartnerLogo Items
    └── Grid Layout Manager
```

### Integration Points
- **Home.tsx**: Homepage component - components placed before "More than makeup" section
- **About.tsx**: About page component - components placed before main content section
- **CRMService**: Data source for featured publications and partners
- **Animation Library**: Framer Motion for smooth animations
- **Responsive System**: Tailwind CSS for mobile-first design

## Components and Interfaces

### 1. StatsCards Component

**Purpose**: Display key statistics in visually appealing cards

**Interface**:
```typescript
interface StatCardProps {
  number: string;
  label: string;
  icon?: string;
  delay?: number;
}

interface StatsCardsProps {
  className?: string;
}
```

**Design Specifications**:
- Three cards in a row (desktop) / stacked (mobile)
- Each card: 200px width, 120px height (desktop)
- Background: White with subtle shadow
- Typography: Large number (3xl), smaller label (sm)
- Animation: Fade in with stagger effect
- Icons: Optional decorative elements

### 2. AnimatedFeaturedShowreel Component

**Purpose**: Horizontal scrolling animation of publication logos

**Interface**:
```typescript
interface FeaturedItem {
  id: string;
  title: string;
  file_path: string;
  alt_text: string;
}

interface AnimatedFeaturedShowreelProps {
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}
```

**Design Specifications**:
- Infinite horizontal scroll animation
- Logo height: 40px (mobile) / 60px (desktop)
- Grayscale by default, color on hover
- Smooth CSS/JS animation at 30px/second
- Pause on hover, resume on mouse leave
- Duplicate items for seamless loop

### 3. PartnersGrid Component

**Purpose**: Display partner brand logos in organized grid

**Interface**:
```typescript
interface PartnerItem {
  id: string;
  title: string;
  file_path: string;
  alt_text: string;
}

interface PartnersGridProps {
  limit?: number;
  columns?: number;
  className?: string;
}
```

**Design Specifications**:
- Grid layout: 6 columns (desktop) / 3 columns (mobile)
- Logo container: 120px x 80px with padding
- Hover effect: Slight scale and opacity change
- Consistent spacing and alignment
- Responsive grid that adapts to screen size

## Data Models

### Statistics Data
```typescript
const statsData = [
  {
    number: "20+",
    label: "Years Experience",
    icon: "🎨"
  },
  {
    number: "500",
    label: "Brides Served",
    icon: "👰"
  },
  {
    number: "100%",
    label: "Satisfaction Rate",
    icon: "⭐"
  }
];
```

### Animation Configuration
```typescript
interface AnimationConfig {
  duration: number;
  easing: string;
  direction: 'left' | 'right';
  pauseOnHover: boolean;
  speed: number; // pixels per second
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Stats Display Consistency
*For any* viewport size, all three stat cards should always be visible and properly formatted with correct numbers and labels
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Animation Performance
*For any* device or browser, the featured showreel animation should maintain smooth 60fps performance without stuttering or frame drops
**Validates: Requirements 2.5**

### Property 3: Responsive Layout Integrity
*For any* screen size from mobile to desktop, all components should maintain proper spacing, alignment, and readability
**Validates: Requirements 4.1, 4.2, 4.3**

### Property 4: Data Integration Consistency
*For any* published featured item or partner in the database, it should appear correctly in the respective showreel component
**Validates: Requirements 2.2, 3.2**

### Property 5: Hover Interaction Reliability
*For any* interactive element (logos, cards), hover effects should consistently trigger and reverse without visual glitches
**Validates: Requirements 2.4, 3.4**

### Property 6: Performance Impact Minimization
*For any* page load, the addition of these three components should not increase total page load time by more than 200ms
**Validates: Requirements 6.1, 6.2, 6.3**

## Error Handling

### Data Loading Errors
- **Featured Items**: If no featured items exist, show placeholder or hide component
- **Partner Data**: Graceful degradation with fallback content
- **Image Loading**: Show placeholder while loading, error state for failed loads

### Animation Errors
- **Performance Issues**: Fallback to CSS-only animations if JS animations lag
- **Browser Compatibility**: Progressive enhancement for older browsers
- **Reduced Motion**: Respect user's motion preferences

### Responsive Errors
- **Layout Breaks**: Minimum and maximum width constraints
- **Touch Interactions**: Fallback for non-touch devices
- **Font Loading**: System font fallbacks

## Testing Strategy

### Unit Testing
- **Component Rendering**: Each component renders with correct props
- **Data Transformation**: Statistics and data formatting functions
- **Event Handlers**: Hover, click, and animation event handling
- **Responsive Utilities**: Breakpoint and layout helper functions

### Property-Based Testing
- **Animation Smoothness**: Test animation performance across different data sets
- **Layout Consistency**: Verify responsive behavior across viewport ranges
- **Data Display**: Ensure correct rendering with various data inputs
- **Interaction Reliability**: Test hover and touch interactions with random sequences

### Integration Testing
- **About Page Integration**: Components work together without conflicts
- **CRM Data Integration**: Real data from Supabase displays correctly
- **Animation Coordination**: Multiple animations don't interfere with each other
- **Performance Impact**: Page load times remain within acceptable limits

### Visual Regression Testing
- **Component Appearance**: Screenshots across different screen sizes
- **Animation States**: Key frames of animation sequences
- **Hover States**: Interactive state appearances
- **Error States**: How components look when data is missing

## Implementation Notes

### Animation Implementation
- Use `requestAnimationFrame` for smooth JavaScript animations
- Implement CSS transforms for better performance
- Add `will-change` property for animation optimization
- Use `transform3d` to trigger hardware acceleration

### Performance Considerations
- Lazy load images in showreel components
- Use `IntersectionObserver` for scroll-triggered animations
- Implement virtual scrolling for large partner lists
- Optimize image sizes and formats (WebP with fallbacks)

### Accessibility
- Add proper ARIA labels for statistics
- Ensure keyboard navigation for interactive elements
- Provide reduced motion alternatives
- Maintain proper color contrast ratios

### Browser Compatibility
- Support modern browsers (Chrome 80+, Firefox 75+, Safari 13+)
- Progressive enhancement for older browsers
- Polyfills for IntersectionObserver if needed
- Fallback animations using CSS only