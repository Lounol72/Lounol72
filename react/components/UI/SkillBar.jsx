import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Composant SkillBar avec animation de progression
const SkillBar = ({ name, level, color, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Animation de la barre de progression
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <motion.div 
      className="skill"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="skill-header">
        <span className="skill-name">{name}</span>
        <span className="skill-percentage">{level}%</span>
      </div>
      
      <div className="skill-bar-container">
        <motion.div
          className="skill-bar"
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${level}%` : 0 }}
          transition={{ 
            duration: 1.5, 
            delay: delay + 0.2,
            ease: "easeOut"
          }}
          style={{ 
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 20px ${color}40`
          }}
        />
      </div>
    </motion.div>
  )
}

export default SkillBar
