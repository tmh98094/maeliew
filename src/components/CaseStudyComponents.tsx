import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, User, Calendar, Tag, ExternalLink } from 'lucide-react'
import AnimationWrapper from './animations/AnimationWrapper'
import { CaseStudy } from '../data/contentModels'

// Sample case studies data
const sampleCaseStudies: CaseStudy[] = [
  {
    id: 'case-001',
    title: 'Elegant Garden Wedding',
    client: 'Sarah & Michael',
    category: 'bridal',
    description: 'A romantic garden wedding requiring natural, glowing makeup that would photograph beautifully in outdoor lighting.',
    challenge: 'Creating a look that would remain flawless through outdoor ceremony, photos in varying light conditions, and a 12-hour celebration.',
    solution: 'Used long-wearing, photography-friendly products with a focus on enhancing natural features. Applied strategic highlighting for dimension in photos.',
    results: 'The bride looked radiant throughout the entire day. Photos captured beautiful, natural-looking makeup that enhanced rather than masked her features.',
    images: {
      before: ['/images/portfolio/bridal-before-1.jpg'],
      after: [
        '/images/portfolio/bridal-after-1.jpg',
        '/images/portfolio/bridal-after-2.jpg',
        '/images/portfolio/bridal-after-3.jpg'
      ],
      process: [
        '/images/portfolio/bridal-process-1.jpg',
        '/images/portfolio/bridal-process-2.jpg'
      ]
    },
    techniques: ['Airbrush foundation', 'Strategic contouring', 'Waterproof formulas', 'Color correction'],
    products: ['Giorgio Armani Luminous Silk', 'Charlotte Tilbury Pillow Talk', 'Urban Decay All Nighter'],
    duration: '3 hours',
    date: '2024-03-15',
    testimonial: {
      id: 'test-001',
      client: 'Sarah Chen',
      role: 'Bride',
      content: 'Mae transformed me into the most beautiful version of myself on my wedding day. Her attention to detail and ability to enhance my natural features was incredible.',
      rating: 5,
      date: '2024-03-15',
      verified: true
    }
  },
  {
    id: 'case-002',
    title: 'High Fashion Editorial Shoot',
    client: 'Vogue Singapore',
    category: 'editorial',
    description: 'Bold, avant-garde makeup for a high fashion editorial featuring geometric shapes and metallic accents.',
    challenge: 'Creating dramatic, artistic looks that would translate well in high-resolution photography while maintaining wearability for the model.',
    solution: 'Developed a series of geometric designs using professional theatrical makeup and metallic pigments, with careful attention to symmetry and photogenic angles.',
    results: 'The editorial was featured as a cover story, with the makeup being highlighted as a key artistic element. The shoot won a regional photography award.',
    images: {
      after: [
        '/images/portfolio/editorial-1.jpg',
        '/images/portfolio/editorial-2.jpg',
        '/images/portfolio/editorial-3.jpg'
      ],
      process: [
        '/images/portfolio/editorial-process-1.jpg',
        '/images/portfolio/editorial-process-2.jpg'
      ]
    },
    techniques: ['Geometric design', 'Metallic application', 'Color blocking', 'Precision lining'],
    products: ['Make Up For Ever Artist Color', 'Pat McGrath Labs Metallics', 'Mehron Paradise Paints'],
    duration: '4 hours',
    date: '2024-02-28'
  }
]

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  onClick: () => void
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy, onClick }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer group"
      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
      onClick={onClick}
    >
      {/* Featured Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={caseStudy.images.after[0]}
          alt={caseStudy.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center"
          >
            View Case Study <ExternalLink size={16} className="ml-2" />
          </motion.div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
            {caseStudy.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{caseStudy.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{caseStudy.description}</p>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            {caseStudy.client}
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {new Date(caseStudy.date).toLocaleDateString()}
          </div>
        </div>
        
        {/* Techniques Preview */}
        <div className="mt-4 flex flex-wrap gap-1">
          {caseStudy.techniques.slice(0, 3).map(technique => (
            <span key={technique} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {technique}
            </span>
          ))}
          {caseStudy.techniques.length > 3 && (
            <span className="text-gray-500 text-xs">+{caseStudy.techniques.length - 3} more</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface CaseStudyModalProps {
  caseStudy: CaseStudy
  isOpen: boolean
  onClose: () => void
}

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ caseStudy, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentSection, setCurrentSection] = useState<'after' | 'process' | 'before'>('after')
  
  const allImages = caseStudy.images[currentSection] || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  React.useEffect(() => {
    setCurrentImageIndex(0)
  }, [currentSection])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold">{caseStudy.title}</h2>
                <p className="text-gray-600">{caseStudy.client}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div>
              {/* Image Section Tabs */}
              <div className="flex mb-4 border-b">
                {(['after', 'process', 'before'] as const).map(section => (
                  caseStudy.images[section] && caseStudy.images[section]!.length > 0 && (
                    <button
                      key={section}
                      onClick={() => setCurrentSection(section)}
                      className={`px-4 py-2 font-medium capitalize ${
                        currentSection === section
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {section === 'after' ? 'Final Result' : 
                       section === 'process' ? 'Process' : 'Before'}
                    </button>
                  )
                ))}
              </div>

              {/* Image Display */}
              {allImages.length > 0 && (
                <div className="relative">
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`${caseStudy.title} - ${currentSection}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  
                  {/* Navigation */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </div>
              )}
            </div>

            {/* Case Study Details */}
            <div className="space-y-6">
              {/* Meta Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  {new Date(caseStudy.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-gray-500" />
                  {caseStudy.duration}
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-gray-500" />
                  {caseStudy.client}
                </div>
                <div className="flex items-center">
                  <Tag size={16} className="mr-2 text-gray-500" />
                  <span className="capitalize">{caseStudy.category}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Project Overview</h3>
                <p className="text-gray-700">{caseStudy.description}</p>
              </div>

              {/* Challenge */}
              <div>
                <h3 className="font-semibold mb-2">Challenge</h3>
                <p className="text-gray-700">{caseStudy.challenge}</p>
              </div>

              {/* Solution */}
              <div>
                <h3 className="font-semibold mb-2">Solution</h3>
                <p className="text-gray-700">{caseStudy.solution}</p>
              </div>

              {/* Results */}
              <div>
                <h3 className="font-semibold mb-2">Results</h3>
                <p className="text-gray-700">{caseStudy.results}</p>
              </div>

              {/* Techniques */}
              <div>
                <h3 className="font-semibold mb-2">Techniques Used</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.techniques.map(technique => (
                    <span key={technique} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {technique}
                    </span>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold mb-2">Key Products</h3>
                <ul className="text-gray-700 space-y-1">
                  {caseStudy.products.map(product => (
                    <li key={product} className="flex items-start">
                      <span className="text-black mr-2">•</span>
                      {product}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              {caseStudy.testimonial && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Client Feedback</h3>
                  <blockquote className="text-gray-700 italic mb-2">
                    "{caseStudy.testimonial.content}"
                  </blockquote>
                  <p className="text-sm text-gray-600">
                    — {caseStudy.testimonial.client}
                    {caseStudy.testimonial.role && `, ${caseStudy.testimonial.role}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export const CaseStudyGallery: React.FC = () => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(sampleCaseStudies.map(cs => cs.category)))]
  
  const filteredCaseStudies = filter === 'all' 
    ? sampleCaseStudies 
    : sampleCaseStudies.filter(cs => cs.category === filter)

  return (
    <section className="py-16 bg-white">
      <div className="container-max section-padding">
        <AnimationWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Case Studies</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dive deep into my creative process and see how I bring each client's vision to life.
            </p>
          </div>
        </AnimationWrapper>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Projects' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((caseStudy, index) => (
            <AnimationWrapper
              key={caseStudy.id}
              animation="slideUp"
              delay={index * 0.1}
            >
              <CaseStudyCard
                caseStudy={caseStudy}
                onClick={() => setSelectedCaseStudy(caseStudy)}
              />
            </AnimationWrapper>
          ))}
        </div>

        {/* Case Study Modal */}
        {selectedCaseStudy && (
          <CaseStudyModal
            caseStudy={selectedCaseStudy}
            isOpen={!!selectedCaseStudy}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}
      </div>
    </section>
  )
}

export default CaseStudyGallery