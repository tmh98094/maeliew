import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { 
  validateMalaysianPhone, 
  formatMalaysianPhone, 
  MALAYSIA_CONTACT_INFO, 
  MALAYSIA_BUDGET_RANGES 
} from '../utils/malaysiaLocalization'

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  eventDate: string
  budget: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'bridal', label: 'Bridal Makeup' },
  { value: 'editorial', label: 'Editorial Makeup' },
  { value: 'commercial', label: 'Commercial Makeup' },
  { value: 'lessons', label: 'Makeup Lessons' },
  { value: 'other', label: 'Other' }
]

const budgetRanges = MALAYSIA_BUDGET_RANGES

export const EnhancedContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: MALAYSIA_CONTACT_INFO.businessEmail, // Pre-populate with business email
    phone: '',
    service: '',
    eventDate: '',
    budget: '',
    message: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return ''
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        if (!validateMalaysianPhone(value)) {
          return 'Please enter a valid Malaysian phone number (e.g., +60 12-345 6789)'
        }
        return ''
      
      case 'service':
        if (!value) return 'Please select a service'
        return ''
      
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        return ''
      
      default:
        return ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    Object.keys(formData).forEach(key => {
      if (key !== 'eventDate' && key !== 'budget') { // Optional fields
        const error = validateField(key, formData[key as keyof FormData])
        if (error) newErrors[key] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      return
    }

    setStatus('loading')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Format phone number before submission
      const formattedData = {
        ...formData,
        phone: formatMalaysianPhone(formData.phone)
      }
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formattedData)
      
      setStatus('success')
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: MALAYSIA_CONTACT_INFO.businessEmail, // Keep business email pre-populated
          phone: '',
          service: '',
          eventDate: '',
          budget: '',
          message: ''
        })
        setTouched({})
        setStatus('idle')
      }, 3000)
      
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
      
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    }
  }

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-3 border rounded-lg transition-all duration-200 
    ${errors[fieldName] && touched[fieldName] 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:ring-black focus:border-black'
    }
    focus:ring-2 focus:outline-none
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `

  return (
    <div className="max-w-2xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={status === 'loading'}
              className={inputClasses('name')}
              placeholder="Your full name"
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            <AnimatePresence>
              {errors.name && touched.name && (
                <motion.p
                  id="name-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle size={16} className="mr-1" />
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={status === 'loading'}
              className={inputClasses('email')}
              placeholder="your.email@example.com"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.p
                  id="email-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle size={16} className="mr-1" />
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Phone and Service Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={status === 'loading'}
              className={inputClasses('phone')}
              placeholder={MALAYSIA_CONTACT_INFO.phonePlaceholder}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            <AnimatePresence>
              {errors.phone && touched.phone && (
                <motion.p
                  id="phone-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle size={16} className="mr-1" />
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
              Service Interested In *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={status === 'loading'}
              className={inputClasses('service')}
              aria-describedby={errors.service ? 'service-error' : undefined}
            >
              {serviceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <AnimatePresence>
              {errors.service && touched.service && (
                <motion.p
                  id="service-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle size={16} className="mr-1" />
                  {errors.service}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Event Date and Budget Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
              Event Date (Optional)
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              className={inputClasses('eventDate')}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range (Optional)
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              className={inputClasses('budget')}
            >
              {budgetRanges.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={status === 'loading'}
            className={inputClasses('message')}
            placeholder="Tell me about your vision, event details, or any specific requirements..."
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          <AnimatePresence>
            {errors.message && touched.message && (
              <motion.p
                id="message-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle size={16} className="mr-1" />
                {errors.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={status === 'loading'}
          className={`
            w-full py-4 px-6 rounded-lg font-medium transition-all duration-200
            ${status === 'loading' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-black hover:bg-gray-800 active:bg-gray-900'
            }
            text-white flex items-center justify-center space-x-2
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
          `}
          whileHover={status !== 'loading' ? { scale: 1.02 } : {}}
          whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
        >
          {status === 'loading' && <Loader className="animate-spin" size={20} />}
          {status === 'success' && <CheckCircle size={20} />}
          {status === 'error' && <AlertCircle size={20} />}
          {status === 'idle' && <Send size={20} />}
          
          <span>
            {status === 'loading' && 'Sending Message...'}
            {status === 'success' && 'Message Sent Successfully!'}
            {status === 'error' && 'Failed to Send - Try Again'}
            {status === 'idle' && 'Send Message'}
          </span>
        </motion.button>

        {/* Status Messages */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
            >
              <div className="flex items-center">
                <CheckCircle size={20} className="mr-2" />
                <div>
                  <p className="font-medium">Thank you for your message!</p>
                  <p className="text-sm">I'll get back to you within 24 hours.</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
            >
              <div className="flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <div>
                  <p className="font-medium">Something went wrong</p>
                  <p className="text-sm">Please try again or contact me directly.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  )
}

export default EnhancedContactForm