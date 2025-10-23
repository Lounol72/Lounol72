import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'

// Composant Hero avec animations d'entrée et call-to-action
const Hero = () => {
  const { language } = useLanguage()

  // Données du hero avec support multilingue
  const heroData = {
    fr: {
      name: "Louis Subtil",
      title: "Étudiant en Informatique",
      subtitle: "le Mans Université",
      cta: {
        portfolio: "Voir mon portfolio",
        contact: "Me contacter"
      }
    },
    en: {
      name: "Louis Subtil",
      title: "Computer Science Student",
      subtitle: "Le Mans University",
      cta: {
        portfolio: "View my portfolio",
        contact: "Contact me"
      }
    }
  }

  const currentData = heroData[language]

  // Animations d'entrée
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  // Fonctions de navigation
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.section
      id="home"
      className="hero"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <motion.div 
          className="hero-text"
          variants={itemVariants}
        >
          <motion.h1 
            className="hero-name"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            {currentData.name}
          </motion.h1>
          
          <motion.p 
            className="hero-title"
            variants={itemVariants}
          >
            {currentData.title}
          </motion.p>
          
          <motion.h5 
            className="hero-subtitle"
            variants={itemVariants}
          >
            {currentData.subtitle}
          </motion.h5>
        </motion.div>

        <motion.div 
          className="hero-cta"
          variants={itemVariants}
        >
          <motion.button
            className="cta-button primary"
            onClick={() => scrollToSection('#portfolio')}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {currentData.cta.portfolio}
          </motion.button>
          
          <motion.button
            className="cta-button secondary"
            onClick={() => scrollToSection('#contact')}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {currentData.cta.contact}
          </motion.button>
        </motion.div>
      </div>

      {/* Indicateur de scroll */}
      <motion.div 
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <i className="fas fa-chevron-down"></i>
      </motion.div>
    </motion.section>
  )
}

export default Hero
