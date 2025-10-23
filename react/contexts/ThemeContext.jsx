import React, { createContext, useContext, useState, useEffect } from 'react'

// Création du contexte pour la gestion du thème
const ThemeContext = createContext()

// Hook personnalisé pour utiliser le contexte du thème
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Provider du contexte de thème
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Récupération du thème depuis le localStorage ou défaut 'dark'
    return localStorage.getItem('portfolio-theme') || 'dark'
  })

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
  }

  // Application du thème au body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
