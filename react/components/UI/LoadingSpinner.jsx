import React from 'react'
import { motion } from 'framer-motion'

// Composant LoadingSpinner avec animation
const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium', 
    large: 'spinner-large'
  }

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  }

  return (
    <div className={`loading-container ${sizeClasses[size]}`}>
      <motion.div
        className={`loading-spinner ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.p
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Chargement...
      </motion.p>
    </div>
  )
}

export default LoadingSpinner
