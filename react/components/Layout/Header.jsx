import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from './Navigation'
import { useTheme } from '../../contexts/ThemeContext'

// Composant Header avec navigation responsive et effet de scroll
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Gestion de l'effet de scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermeture du menu mobile lors du changement de section
  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="nav-container">
        <div className="nav-brand">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="brand-text"
          >
            Louis Subtil
          </motion.span>
        </div>

        <Navigation 
          isMobileMenuOpen={isMobileMenuOpen}
          onNavClick={handleNavClick}
        />

        <div className="nav-controls">
          {/* Bouton de basculement de thème */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Basculer le thème"
          >
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </motion.button>

          {/* Menu burger pour mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label="Menu mobile"
          >
            <motion.i 
              className="fas fa-bars"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            ></motion.i>
          </motion.button>
        </div>
      </nav>
    </motion.header>
  )
}

export default Header
