import React from 'react'
import { motion } from 'framer-motion'

interface HoverCardProps {
  children: React.ReactNode
  className?: string
  scale?: number
  rotate?: number
  shadow?: boolean
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  scale = 1.05,
  rotate = 0,
  shadow = true
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale,
        rotate,
        boxShadow: shadow ? '0 20px 40px rgba(0,0,0,0.1)' : undefined
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  amplitude?: number
  duration?: number
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className = '',
  amplitude = 10,
  duration = 3
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

interface PulseElementProps {
  children: React.ReactNode
  className?: string
  scale?: number
  duration?: number
}

export const PulseElement: React.FC<PulseElementProps> = ({
  children,
  className = '',
  scale = 1.1,
  duration = 2
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}