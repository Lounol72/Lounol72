import React, { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import ProjectCard from '../UI/ProjectCard'

// Composant Portfolio simple sans animations complexes
const PortfolioSimple = () => {
  const { language } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')

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
    },
    {
      id: 'icpocket-java',
      title: 'ICPocket Java',
      description: 'Version Java de l\'application ICPocket pour la gestion de crypto-monnaies',
      category: 'academic',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmODk4MjA7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmODk4MjA7c3RvcC1vcGFjaXR5OjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSJ3aGl0ZSI+SmF2YTwvdGV4dD48L3N2Zz4=',
      technologies: ['Java', 'Swing', 'Crypto'],
      github: 'https://github.com/Lounol72/ICPocket-java',
      demo: null
    },
    {
      id: 'lounol72',
      title: 'Lounol72',
      description: 'Mon profil GitHub personnel avec mes projets et contributions',
      category: 'personal',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzNzc2YWI7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzNzc2YWI7c3RvcC1vcGFjaXR5OjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSJ3aGl0ZSI+UHl0aG9uPC90ZXh0Pjwvc3ZnPg==',
      technologies: ['Python', 'GitHub', 'Profile'],
      github: 'https://github.com/Lounol72/Lounol72',
      demo: null
    }
  ]

  const currentData = portfolioData[language]

  // Filtrer les projets selon la catégorie active
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  // Debug pour voir ce qui se passe
  console.log('PortfolioSimple Debug:', {
    activeFilter,
    projects: projects.length,
    filteredProjects: filteredProjects.length,
    projectsData: projects.map(p => ({ id: p.id, category: p.category }))
  })

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <h2 className="section-title">
          {currentData.title}
        </h2>

        {/* Filtres */}
        <div className="portfolio-filters">
          {Object.entries(currentData.filters).map(([key, label]) => (
            <button
              key={key}
              className={`filter ${activeFilter === key ? 'active' : ''}`}
              onClick={() => {
                console.log('Filter clicked:', key)
                setActiveFilter(key)
              }}
              data-filter={key}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grille des projets */}
        <div className="portfolio-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={`${project.id}-${activeFilter}`}
              project={project}
              index={index}
              variants={null} // Pas d'animations
            />
          ))}
        </div>

        {/* Message si aucun projet trouvé */}
        {filteredProjects.length === 0 && (
          <div className="no-projects">
            <p>Aucun projet trouvé dans cette catégorie.</p>
          </div>
        )}

        {/* Debug info */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <h4>Debug Info:</h4>
          <p>Filtre actif: <strong>{activeFilter}</strong></p>
          <p>Projets totaux: <strong>{projects.length}</strong></p>
          <p>Projets filtrés: <strong>{filteredProjects.length}</strong></p>
          <p>Projets: {projects.map(p => `${p.id}(${p.category})`).join(', ')}</p>
        </div>
      </div>
    </section>
  )
}

export default PortfolioSimple
