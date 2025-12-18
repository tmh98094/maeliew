// Content models for case studies, services, and portfolio items

export interface CaseStudy {
  id: string
  title: string
  client: string
  category: 'bridal' | 'editorial' | 'commercial' | 'personal'
  description: string
  challenge: string
  solution: string
  results: string
  images: {
    before?: string[]
    after: string[]
    process: string[]
  }
  techniques: string[]
  products: string[]
  duration: string
  date: string
  testimonial?: Testimonial
}

export interface ServiceDetail {
  id: string
  name: string
  category: 'bridal' | 'editorial' | 'commercial' | 'lessons'
  shortDescription: string
  fullDescription: string
  process: ProcessStep[]
  duration: string
  pricing: {
    starting: number
    currency: string
    includes: string[]
    addOns?: { name: string; price: number }[]
  }
  images: string[]
  faqs: FAQ[]
}

export interface ProcessStep {
  step: number
  title: string
  description: string
  duration?: string
  image?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Testimonial {
  id: string
  client: string
  role?: string
  content: string
  rating: number
  date?: string
  projectId?: string
  image?: string
  verified: boolean
}

export interface TimelineEvent {
  id: string
  year: number
  title: string
  description: string
  type: 'achievement' | 'training' | 'milestone' | 'award'
  location?: string
  image?: string
  details?: string[]
}

export interface PortfolioItem {
  id: string
  title: string
  category: 'bridal' | 'editorial' | 'commercial' | 'personal'
  subcategory?: string
  description: string
  images: {
    thumbnail: string
    gallery: string[]
    featured: string
  }
  techniques: string[]
  products: string[]
  client?: string
  date: string
  featured: boolean
  caseStudyId?: string
}

// Content validation utilities
export class ContentValidator {
  static validateCaseStudy(caseStudy: Partial<CaseStudy>): string[] {
    const errors: string[] = []
    
    if (!caseStudy.title?.trim()) errors.push('Title is required')
    if (!caseStudy.client?.trim()) errors.push('Client is required')
    if (!caseStudy.description?.trim()) errors.push('Description is required')
    if (!caseStudy.challenge?.trim()) errors.push('Challenge is required')
    if (!caseStudy.solution?.trim()) errors.push('Solution is required')
    if (!caseStudy.results?.trim()) errors.push('Results are required')
    if (!caseStudy.images?.after?.length) errors.push('At least one after image is required')
    if (!caseStudy.techniques?.length) errors.push('At least one technique is required')
    if (!caseStudy.date) errors.push('Date is required')
    
    return errors
  }

  static validateServiceDetail(service: Partial<ServiceDetail>): string[] {
    const errors: string[] = []
    
    if (!service.name?.trim()) errors.push('Service name is required')
    if (!service.shortDescription?.trim()) errors.push('Short description is required')
    if (!service.fullDescription?.trim()) errors.push('Full description is required')
    if (!service.process?.length) errors.push('At least one process step is required')
    if (!service.duration?.trim()) errors.push('Duration is required')
    if (!service.pricing?.starting) errors.push('Starting price is required')
    if (!service.pricing?.includes?.length) errors.push('At least one included item is required')
    
    return errors
  }

  static validatePortfolioItem(item: Partial<PortfolioItem>): string[] {
    const errors: string[] = []
    
    if (!item.title?.trim()) errors.push('Title is required')
    if (!item.description?.trim()) errors.push('Description is required')
    if (!item.images?.thumbnail) errors.push('Thumbnail image is required')
    if (!item.images?.gallery?.length) errors.push('At least one gallery image is required')
    if (!item.images?.featured) errors.push('Featured image is required')
    if (!item.date) errors.push('Date is required')
    
    return errors
  }

  static validateTestimonial(testimonial: Partial<Testimonial>): string[] {
    const errors: string[] = []
    
    if (!testimonial.client?.trim()) errors.push('Client name is required')
    if (!testimonial.content?.trim()) errors.push('Testimonial content is required')
    if (!testimonial.rating || testimonial.rating < 1 || testimonial.rating > 5) {
      errors.push('Rating must be between 1 and 5')
    }
    if (!testimonial.date) errors.push('Date is required')
    
    return errors
  }
}