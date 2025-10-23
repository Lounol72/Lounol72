import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'

// Composant de navigation avec animations et support multilingue
const Navigation = ({ isMobileMenuOpen, onNavClick }) => {
  const { language, changeLanguage } = useLanguage()

  // Données de navigation avec support multilingue
  const navItems = [
    { id: 'home', fr: 'Accueil', en: 'Home', href: '#home' },
    { id: 'about', fr: 'À propos', en: 'About', href: '#about' },
    { id: 'skills', fr: 'Compétences', en: 'Skills', href: '#skills' },
    { id: 'portfolio', fr: 'Portfolio', en: 'Portfolio', href: '#portfolio' },
    { id: 'contact', fr: 'Contact', en: 'Contact', href: '#contact' }
  ]

  // Animation des éléments de navigation
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  }

  // Fonction pour gérer le clic sur un élément de navigation
  const handleNavItemClick = (href) => {
    onNavClick()
    // Scroll fluide vers la section
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Fonction pour basculer la langue
  const toggleLanguage = () => {
    changeLanguage(language === 'fr' ? 'en' : 'fr')
  }

  return (
    <>
      {/* Navigation desktop */}
      <motion.nav 
        className="nav-desktop"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            variants={navItemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavItemClick(item.href)}
            className="nav-item"
          >
            {language === 'fr' ? item.fr : item.en}
          </motion.button>
        ))}
      </motion.nav>

      {/* Navigation mobile */}
      <motion.nav
        className={`nav-mobile ${isMobileMenuOpen ? 'active' : ''}`}
        initial={false}
        animate={{
          x: isMobileMenuOpen ? 0 : '100%',
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="nav-mobile-content">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavItemClick(item.href)}
              className="nav-mobile-item"
            >
              {language === 'fr' ? item.fr : item.en}
            </motion.button>
          ))}
          
          {/* Sélecteur de langue mobile */}
          <div className="nav-mobile-controls">
            <button
              onClick={toggleLanguage}
              className="language-toggle"
            >
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <motion.div
          className="nav-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onNavClick}
        />
      )}
    </>
  )
}

export default Navigation
