import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Award, Users, Star, Quote } from 'lucide-react'
import AnimationWrapper from './animations/AnimationWrapper'
import { timelineEvents } from '../data/timeline'
import { testimonials } from '../data/testimonials'

// Enhanced About Timeline Component
export const EnhancedTimeline: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-max section-padding">
        <AnimationWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">My Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From passionate beginner to award-winning makeup artist, 
              here's the story of my professional evolution.
            </p>
          </div>
        </AnimationWrapper>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-0.5"></div>

          {timelineEvents.map((event, index) => (
            <AnimationWrapper
              key={event.id}
              animation="slideUp"
              delay={index * 0.1}
            >
              <div className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-black rounded-full transform md:-translate-x-2 z-10">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"></div>
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <motion.div
                    className="bg-gray-50 p-6 rounded-lg shadow-sm"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-full mr-3 ${
                        event.type === 'achievement' ? 'bg-green-100 text-green-600' :
                        event.type === 'training' ? 'bg-blue-100 text-blue-600' :
                        event.type === 'award' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {event.type === 'achievement' && <Award size={16} />}
                        {event.type === 'training' && <Users size={16} />}
                        {event.type === 'award' && <Star size={16} />}
                        {event.type === 'milestone' && <Calendar size={16} />}
                      </div>
                      <span className="text-2xl font-serif font-bold text-black">{event.year}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    
                    {event.location && (
                      <p className="text-sm text-gray-500 mb-3">📍 {event.location}</p>
                    )}
                    
                    {event.details && (
                      <ul className="text-sm text-gray-600 space-y-1">
                        {event.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-black mr-2">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </div>
              </div>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

// Enhanced Testimonials Section
export const EnhancedTestimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-max section-padding">
        <AnimationWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Client Love</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nothing makes me happier than seeing my clients feel confident and beautiful. 
              Here's what they have to say about their experience.
            </p>
          </div>
        </AnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimationWrapper
              key={testimonial.id}
              animation="slideUp"
              delay={index * 0.1}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col"
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote icon */}
                <div className="text-gray-300 mb-4">
                  <Quote size={32} />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-6 flex-grow italic">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.client}</p>
                      {testimonial.role && (
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      )}
                    </div>
                    {testimonial.verified && (
                      <div className="text-green-500 text-xs bg-green-50 px-2 py-1 rounded">
                        ✓ Verified
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

// Service Process Details
export const ServiceProcessDetails: React.FC = () => {
  const processes = [
    {
      service: 'Bridal Makeup',
      steps: [
        {
          step: 1,
          title: 'Initial Consultation',
          description: 'We discuss your vision, wedding theme, and personal style preferences.',
          duration: '30-45 minutes'
        },
        {
          step: 2,
          title: 'Trial Session',
          description: 'Complete makeup trial to perfect your look and make any adjustments.',
          duration: '2-3 hours'
        },
        {
          step: 3,
          title: 'Wedding Day',
          description: 'Flawless application on your special day with touch-up kit provided.',
          duration: '1.5-2 hours'
        }
      ]
    },
    {
      service: 'Editorial Makeup',
      steps: [
        {
          step: 1,
          title: 'Concept Discussion',
          description: 'Understanding the creative vision and mood board requirements.',
          duration: '15-30 minutes'
        },
        {
          step: 2,
          title: 'Look Creation',
          description: 'Artistic makeup application tailored to the editorial concept.',
          duration: '1-2 hours'
        },
        {
          step: 3,
          title: 'On-Set Support',
          description: 'Touch-ups and adjustments throughout the photoshoot.',
          duration: 'As needed'
        }
      ]
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container-max section-padding">
        <AnimationWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">My Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every service follows a carefully crafted process to ensure 
              exceptional results and a seamless experience.
            </p>
          </div>
        </AnimationWrapper>

        <div className="space-y-16">
          {processes.map((process, processIndex) => (
            <AnimationWrapper
              key={process.service}
              animation="slideUp"
              delay={processIndex * 0.2}
            >
              <div>
                <h3 className="text-2xl font-serif font-bold text-center mb-8">
                  {process.service} Process
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {process.steps.map((step, stepIndex) => (
                    <motion.div
                      key={step.step}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: stepIndex * 0.1 }}
                    >
                      {/* Step number */}
                      <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {step.step}
                      </div>
                      
                      {/* Step content */}
                      <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      <p className="text-sm text-gray-500 font-medium">
                        Duration: {step.duration}
                      </p>
                      
                      {/* Connector line */}
                      {stepIndex < process.steps.length - 1 && (
                        <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 transform translate-x-4"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

// Educational Content Section
export const EducationalContent: React.FC = () => {
  const tips = [
    {
      title: 'Skin Preparation',
      description: 'The secret to long-lasting makeup starts with proper skincare.',
      tips: [
        'Cleanse and moisturize 30 minutes before makeup application',
        'Use a primer suited to your skin type',
        'Apply sunscreen as your base layer'
      ]
    },
    {
      title: 'Color Matching',
      description: 'Finding the perfect foundation shade is crucial for a natural look.',
      tips: [
        'Test foundation on your jawline, not your hand',
        'Check the color in natural light',
        'Consider your undertones when selecting shades'
      ]
    },
    {
      title: 'Makeup Longevity',
      description: 'Professional techniques to make your makeup last all day.',
      tips: [
        'Set your makeup with translucent powder',
        'Use setting spray for extra hold',
        'Blot excess oils instead of adding more powder'
      ]
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-max section-padding">
        <AnimationWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Beauty Tips</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional makeup artistry techniques and tips to help you 
              achieve beautiful results at home.
            </p>
          </div>
        </AnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <AnimationWrapper
              key={tip.title}
              animation="slideUp"
              delay={index * 0.1}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm h-full"
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-3">{tip.title}</h3>
                <p className="text-gray-600 mb-4">{tip.description}</p>
                
                <ul className="space-y-2">
                  {tip.tips.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-black mr-2 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

