import React from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface AnimationWrapperProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' | 'parallax'
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  triggerOnce?: boolean
}

const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0 }
  },
  parallax: {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 }
  }
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  triggerOnce = true
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    amount: threshold, 
    once: triggerOnce 
  })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else if (!triggerOnce) {
      controls.start('hidden')
    }
  }, [isInView, controls, triggerOnce])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationVariants[animation]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimationWrapper