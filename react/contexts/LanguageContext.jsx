import React, { createContext, useContext, useState } from 'react'

// Création du contexte pour la gestion des langues
const LanguageContext = createContext()

// Hook personnalisé pour utiliser le contexte de langue
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Provider du contexte de langue
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr')

  // Fonction pour changer de langue
  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  const value = {
    language,
    changeLanguage,
    isFrench: language === 'fr'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
