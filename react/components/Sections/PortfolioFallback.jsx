import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'
import ProjectCard from '../UI/ProjectCard'

// Composant Portfolio de fallback avec projets statiques
const PortfolioFallback = () => {
  const { language } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const [animationKey, setAnimationKey] = useState(0)

  // Données du portfolio avec support multilingue
  const portfolioData = {
    fr: {
      title: "Mes projets",
      filters: {
        all: "Tous",
        academic: "Académique", 
        personal: "Personnel",
        hackathon: "Hackathon"
      }
    },
    en: {
      title: "My projects",
      filters: {
        all: "All",
        academic: "Academic",
        personal: "Personal", 
        hackathon: "Hackathon"
      }
    }
  }

  // Projets statiques de fallback
  const projects = [
    {
      id: 'icpocket',
      title: 'ICPocket',
      description: 'Développement d\'une application de gestion de crypto-monnaie sur la blockchain Internet Computer',
      category: 'personal',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDU5OWM7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDU5OWM7c3RvcC1vcGFjaXR5OjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSJ3aGl0ZSI+QzwvdGV4dD48L3N2Zz4=',
      technologies: ['C', 'Threads', 'Web', 'SDL2'],
      github: 'https://github.com/Lounol72/ICPocket',
      demo: null
    },
    {
      id: 'citybuilder',
      title: 'CityBuilder',
      description: 'Simulateur de construction de ville développé en C avec interface graphique',
      category: 'academic',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDU5OWM7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDU5OWM7c3RvcC1vcGFjaXR5OjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSJ3aGl0ZSI+QzwvdGV4dD48L3N2Zz4=',
      technologies: ['C', 'Graphics', 'Simulation'],
      github: 'https://github.com/Lounol72/CityBuilder',
      demo: null
    },
    {
      id: 'jaicc',
      title: 'JaiCCv1',
      description: 'Fork de GCC qui parse le nombre d\'erreurs et affiche des memes selon un seuil d\'erreurs',
      category: 'hackathon',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmN2RmMWU7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmN2RmMWU7c3RvcC1vcGFjaXR5OjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSJ3aGl0ZSI+SmF2YVNjcmlwdDwvdGV4dD48L3N2Zz4=',
      technologies: ['JavaScript', 'GCC', 'Compiler'],
      github: 'https://github.com/Lounol72/JaiCCv1',
      demo: null
    }
  ]

  const currentData = portfolioData[language]

  // Filtrer les projets selon la catégorie active
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  // Debug pour voir ce qui se passe
  console.log('PortfolioFallback Debug:', {
    activeFilter,
    projects: projects.length,
    filteredProjects: filteredProjects.length,
    projectsData: projects.map(p => ({ id: p.id, category: p.category }))
  })

  // Animations simplifiées
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.section
      id="portfolio"
      className="portfolio"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.h2 
          className="section-title"
          variants={itemVariants}
        >
          {currentData.title}
        </motion.h2>

        {/* Filtres */}
        <motion.div 
          className="portfolio-filters"
          variants={itemVariants}
        >
          {Object.entries(currentData.filters).map(([key, label]) => (
            <motion.button
              key={key}
              className={`filter ${activeFilter === key ? 'active' : ''}`}
              onClick={() => {
                setActiveFilter(key)
                setAnimationKey(prev => prev + 1) // Force la re-animation
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-filter={key}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Grille des projets */}
        <motion.div 
          className="portfolio-grid"
          variants={containerVariants}
          key={`${activeFilter}-${animationKey}`} // Force la re-animation lors du changement de filtre
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={`${project.id}-${activeFilter}`} // Clé unique par filtre
              project={project}
              index={index}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        {/* Message si aucun projet trouvé */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="no-projects"
            variants={itemVariants}
          >
            <p>Aucun projet trouvé dans cette catégorie.</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default PortfolioFallback
