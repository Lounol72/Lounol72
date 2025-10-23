import React from 'react'
import { motion } from 'framer-motion'

// Composant SkillTag avec animations hover
const SkillTag = ({ name, delay = 0 }) => {
  return (
    <motion.span
      className="skill-tag"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.1,
        y: -5,
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: "easeOut"
      }}
    >
      {name}
    </motion.span>
  )
}

export default SkillTag
