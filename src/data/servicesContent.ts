import { ServiceDetail } from './contentModels'

export const services: ServiceDetail[] = [
  {
    id: 'bridal-makeup',
    name: 'Bridal Makeup',
    category: 'bridal',
    shortDescription: 'Flawless, long-lasting makeup for your special day',
    fullDescription: 'Your wedding day deserves nothing less than perfection. I specialize in creating timeless, elegant bridal looks that enhance your natural beauty and photograph beautifully. From the initial consultation to your wedding day, I ensure every detail is perfect.',
    process: [
      {
        step: 1,
        title: 'Initial Consultation',
        description: 'We discuss your vision, wedding theme, dress style, and personal preferences to create the perfect look.',
        duration: '45 minutes'
      },
      {
        step: 2,
        title: 'Makeup Trial',
        description: 'Complete makeup application with photos and adjustments to perfect your bridal look.',
        duration: '2-3 hours'
      },
      {
        step: 3,
        title: 'Wedding Day Application',
        description: 'Flawless makeup application with touch-up kit and timeline coordination.',
        duration: '1.5-2 hours'
      }
    ],
    duration: 'Full day service',
    pricing: {
      starting: 800,
      currency: 'SGD',
      includes: [
        'Initial consultation',
        'Makeup trial session',
        'Wedding day application',
        'Touch-up kit',
        'False lashes',
        'Travel within Singapore'
      ],
      addOns: [
        { name: 'Bridal party makeup (per person)', price: 150 },
        { name: 'Mother of bride/groom makeup', price: 200 },
        { name: 'Additional trial session', price: 250 }
      ]
    },
    images: [
      '/images/services/bridal-1.webp',
      '/images/services/bridal-2.webp'
    ],
    faqs: [
      {
        question: 'How far in advance should I book?',
        answer: 'I recommend booking 6-12 months in advance, especially for peak wedding season (March-June and September-December).'
      },
      {
        question: 'Do you travel for destination weddings?',
        answer: 'Yes, I offer destination wedding services. Travel and accommodation costs will be added to the package.'
      }
    ]
  }
]