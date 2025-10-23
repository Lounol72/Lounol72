import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'

// Composant Footer avec informations de contact et liens sociaux
const Footer = () => {
  const { language } = useLanguage()
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Gestion de l'affichage du bouton retour en haut
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Données du footer avec support multilingue
  const footerData = {
    fr: {
      copyright: "© 2024 Louis Subtil. Tous droits réservés.",
      credits: "Design réalisé avec ❤️ et React.",
      social: {
        linkedin: "LinkedIn",
        github: "GitHub",
        email: "Email"
      }
    },
    en: {
      copyright: "© 2024 Louis Subtil. All rights reserved.",
      credits: "Design made with ❤️ and React.",
      social: {
        linkedin: "LinkedIn",
        github: "GitHub", 
        email: "Email"
      }
    }
  }

  const currentData = footerData[language]

  // Liens sociaux
  const socialLinks = [
    {
      name: 'linkedin',
      url: 'https://www.linkedin.com/in/louis-subtil-7a0b40254/',
      icon: 'fab fa-linkedin',
      label: currentData.social.linkedin
    },
    {
      name: 'github',
      url: 'https://github.com/Lounol72',
      icon: 'fab fa-github',
      label: currentData.social.github
    },
    {
      name: 'email',
      url: 'mailto:louis.subtil@example.com',
      icon: 'fas fa-envelope',
      label: currentData.social.email
    }
  ]

  // Animation des éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.footer
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="footer-container">
        {/* Liens sociaux */}
        <motion.div 
          className="footer-social"
          variants={itemVariants}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ 
                scale: 1.2,
                rotate: 5
              }}
              whileTap={{ scale: 0.9 }}
              aria-label={link.label}
            >
              <i className={link.icon}></i>
            </motion.a>
          ))}
        </motion.div>

        {/* Informations de copyright */}
        <motion.div 
          className="footer-info"
          variants={itemVariants}
        >
          <p className="copyright">{currentData.copyright}</p>
          <p className="credits">{currentData.credits}</p>
        </motion.div>

        {/* Bouton retour en haut */}
        {showBackToTop && (
          <motion.button
            className="back-to-top visible"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Retour en haut"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <i className="fas fa-arrow-up"></i>
          </motion.button>
        )}
      </div>
    </motion.footer>
  )
}

export default Footer