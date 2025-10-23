import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'
import { useGitHubStats } from '../../hooks/useGitHubStats'
import ProjectCard from '../UI/ProjectCard'

// Composant Portfolio de debug pour identifier les problèmes
const PortfolioDebug = () => {
  const { language } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const { repos, loading, error } = useGitHubStats()

  // Debug: Log des états
  console.log('🔍 PortfolioDebug - États:', {
    repos: repos?.length || 0,
    loading,
    error,
    activeFilter
  })

  // Données du portfolio
  const portfolioData = {
    fr: {
      title: "Mes projets (Debug)",
      filters: {
        all: "Tous",
        academic: "Académique", 
        personal: "Personnel",
        hackathon: "Hackathon"
      },
      noProjects: "Aucun projet trouvé pour cette catégorie."
    },
    en: {
      title: "My projects (Debug)",
      filters: {
        all: "All",
        academic: "Academic",
        personal: "Personal", 
        hackathon: "Hackathon"
      },
      noProjects: "No projects found for this category."
    }
  }

  // Fonction pour mapper les topics vers les catégories
  const getCategoryFromTopics = (topics = [], language = '', description = '') => {
    const normalizedTopics = topics.filter(topic => topic != null).map(topic => topic.toLowerCase())
    const normalizedDescription = (description || '').toLowerCase()
    
    const academicKeywords = ['university', 'school', 'college', 'academic', 'education', 'student', 'homework', 'assignment', 'project', 'course', 'learning', 'study']
    const hackathonKeywords = ['hackathon', 'competition', 'contest', 'challenge', 'event', '24h', '48h', 'weekend', 'jam', 'game-jam', 'devfest', 'startup', 'innovation']
    const personalKeywords = ['personal', 'side-project', 'hobby', 'fun', 'experiment', 'playground', 'sandbox', 'test', 'demo', 'showcase', 'portfolio', 'blog', 'website', 'app', 'tool', 'utility', 'script', 'automation', 'productivity', 'game', 'entertainment', 'music', 'art', 'creative', 'design']
    
    const hasAcademicTopic = academicKeywords.some(keyword => 
      normalizedTopics.some(topic => topic.includes(keyword))
    )
    const hasHackathonTopic = hackathonKeywords.some(keyword => 
      normalizedTopics.some(topic => topic.includes(keyword))
    )
    const hasPersonalTopic = personalKeywords.some(keyword => 
      normalizedTopics.some(topic => topic.includes(keyword))
    )
    
    const hasAcademicDescription = academicKeywords.some(keyword => 
      normalizedDescription.includes(keyword)
    )
    const hasHackathonDescription = hackathonKeywords.some(keyword => 
      normalizedDescription.includes(keyword)
    )
    
    if (hasHackathonTopic || hasHackathonDescription) return 'hackathon'
    if (hasAcademicTopic || hasAcademicDescription) return 'academic'
    if (hasPersonalTopic) return 'personal'
    
    // Fallback basé sur le langage et la description
    const academicLanguages = ['C', 'C++', 'Java', 'Python', 'Assembly', 'MATLAB']
    if (academicLanguages.includes(language) && 
        (normalizedDescription.includes('university') || 
         normalizedDescription.includes('school') || 
         normalizedDescription.includes('academic'))) {
      return 'academic'
    }
    
    return 'personal'
  }

  // Génération d'images placeholder basées sur le langage
  const getLanguagePlaceholder = (language) => {
    const languageColors = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#f89820',
      'C': '#00599c',
      'C++': '#00599c',
      'C#': '#239120',
      'PHP': '#777bb4',
      'Ruby': '#cc342d',
      'Go': '#00add8',
      'Rust': '#000000',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'HTML': '#e34f26',
      'CSS': '#1572b6',
      'Vue': '#4fc08d',
      'React': '#61dafb',
      'Angular': '#dd0031',
      'Node.js': '#339933',
      'Other': '#666666'
    }
    
    const color = languageColors[language] || '#666666'
    const backgroundColor = adjustColorBrightness(color, 0.1)
    const textColor = getContrastColor(color)
    
    const svg = `
      <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#gradient)"/>
        
        <g transform="translate(140, 95)" fill="${color}" opacity="0.3">
          <path d="M0 0 L20 0 L20 10 L10 10 L10 20 L20 20 L20 30 L0 30 Z"/>
          <path d="M40 0 L60 0 L60 30 L40 30 L40 20 L50 20 L50 10 L40 10 Z"/>
        </g>
        
        <text x="50%" y="60%" text-anchor="middle" 
              font-family="'Inter', 'Segoe UI', sans-serif" 
              font-size="32" 
              font-weight="600" 
              fill="${textColor}"
              filter="url(#shadow)">
          ${language || 'Code'}
        </text>
        
        <circle cx="80" cy="50" r="3" fill="${color}" opacity="0.6"/>
        <circle cx="320" cy="75" r="2" fill="${color}" opacity="0.4"/>
        <circle cx="40" cy="200" r="4" fill="${color}" opacity="0.3"/>
        <circle cx="360" cy="175" r="2.5" fill="${color}" opacity="0.5"/>
      </svg>
    `.trim()
    
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  const adjustColorBrightness = (color, factor) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const newR = Math.max(0, Math.min(255, Math.round(r + (255 - r) * factor)))
    const newG = Math.max(0, Math.min(255, Math.round(g + (255 - g) * factor)))
    const newB = Math.max(0, Math.min(255, Math.round(b + (255 - b) * factor)))
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
  }

  const getContrastColor = (backgroundColor) => {
    const hex = backgroundColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  }

  // Transformation des données GitHub en projets
  const projects = repos && repos.length > 0 ? repos.map(repo => {
    const category = getCategoryFromTopics(repo.topics || [], repo.l, repo.d)
    const placeholderImage = getLanguagePlaceholder(repo.l)
    
    return {
      id: repo.n,
      title: repo.n,
      description: repo.d || 'Aucune description disponible',
      category: category,
      image: placeholderImage,
      technologies: [repo.l].filter(Boolean),
      github: repo.u,
      demo: null,
      stars: repo.s || 0,
      forks: repo.f || 0,
      lastUpdated: repo.t
    }
  }) : []

  const currentData = portfolioData[language]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  // Debug: Log des projets
  console.log('🔍 PortfolioDebug - Projets:', {
    total: projects.length,
    filtered: filteredProjects.length,
    projects: projects.map(p => ({ id: p.id, category: p.category, title: p.title }))
  })

  // États de chargement et d'erreur
  if (!loading && !error && projects.length === 0) {
    return (
      <section id="portfolio" className="portfolio">
        <div className="container">
          <h2 className="section-title">{currentData.title}</h2>
          <div className="no-projects">
            <p>Aucun projet GitHub trouvé. Vérifiez votre configuration.</p>
            <div className="debug-info">
              <h3>Debug Info</h3>
              <p>Repos: {repos?.length || 0}</p>
              <p>Loading: {loading ? 'true' : 'false'}</p>
              <p>Error: {error || 'none'}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section id="portfolio" className="portfolio">
        <div className="container">
          <h2 className="section-title">{currentData.title}</h2>
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Chargement des projets GitHub...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    console.error('GitHub data error:', error)
    const fallbackProjects = [
      {
        id: 'icpocket',
        title: 'ICPocket',
        description: 'Développement d\'une application de gestion de crypto-monnaie sur la blockchain Internet Computer',
        category: 'personal',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDU5OWM7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDU5OWM7c3RvcC1vcGFjaXR5OjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSJ3aGl0ZSI+QzwvdGV4dD48L3N2Zz4=',
        technologies: ['C', 'Threads', 'Web', 'SDL2'],
        github: 'https://github.com/Lounol72/ICPocket',
        demo: null
      }
    ]
    
    return (
      <section id="portfolio" className="portfolio">
        <div className="container">
          <h2 className="section-title">{currentData.title}</h2>
          <div className="error-message">
            <p>Impossible de charger les projets GitHub. Affichage des projets statiques.</p>
            <div className="debug-info">
              <h3>Debug Info</h3>
              <p>Error: {error}</p>
              <p>Repos: {repos?.length || 0}</p>
            </div>
          </div>
          <div className="portfolio-grid">
            {fallbackProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                variants={itemVariants}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Animations
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

        <motion.div
          className="portfolio-filters"
          variants={itemVariants}
        >
          {Object.entries(currentData.filters).map(([key, label]) => (
            <motion.button
              key={key}
              className={`filter ${activeFilter === key ? 'active' : ''}`}
              onClick={() => setActiveFilter(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-filter={key}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="portfolio-grid"
          variants={containerVariants}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            className="no-projects"
            variants={itemVariants}
          >
            <p>{currentData.noProjects}</p>
          </motion.div>
        )}

        {/* Debug Info */}
        <div className="debug-info" style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <h3>🔍 Debug Info</h3>
          <p><strong>État:</strong> {loading ? 'Chargement...' : error ? 'Erreur' : 'Chargé'}</p>
          <p><strong>Projets totaux:</strong> {projects.length}</p>
          <p><strong>Projets filtrés:</strong> {filteredProjects.length}</p>
          <p><strong>Filtre actif:</strong> {activeFilter}</p>
          <p><strong>Erreur:</strong> {error || 'Aucune'}</p>
          <details>
            <summary>Détails des projets</summary>
            <ul>
              {projects.map(p => (
                <li key={p.id}>{p.id} - {p.category} - {p.title}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </motion.section>
  )
}

export default PortfolioDebug
