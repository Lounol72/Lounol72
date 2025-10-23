import React from 'react'
import { motion } from 'framer-motion'
import Header from './components/Layout/Header'
import Hero from './components/Sections/Hero'
import About from './components/Sections/About'
import Skills from './components/Sections/Skills'
import Education from './components/Sections/Education'
import Portfolio from './components/Sections/Portfolio'
import PortfolioFallback from './components/Sections/PortfolioFallback'
import PortfolioSimple from './components/Sections/PortfolioSimple'
import PortfolioDebug from './components/Sections/PortfolioDebug'
import GitHubStats from './components/Sections/GitHubStats'
import Contact from './components/Sections/Contact'
import Footer from './components/Layout/Footer'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'

// Composant principal de l'application
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
          <main>
            <Hero />
            <About />
            <Skills />
            <Education />
            <Portfolio />
            <GitHubStats />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
