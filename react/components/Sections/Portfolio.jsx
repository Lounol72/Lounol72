import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'
import { useGitHubStats } from '../../hooks/useGitHubStats'
import ProjectCard from '../UI/ProjectCard'

// Composant Portfolio avec filtres et animations
const Portfolio = () => {
  const { language } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const { repos, loading, error } = useGitHubStats()

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
    
    const academicLanguages = ['C', 'C++', 'Java', 'Python', 'Assembly', 'MATLAB']
    if (academicLanguages.includes(language) && 
        (normalizedDescription.includes('university') || 
         normalizedDescription.includes('school') ||
         normalizedDescription.includes('academic'))) {
      return 'academic'
    }
    
    return 'personal'
  }

  // Fonction pour générer un placeholder par langage
  const getLanguagePlaceholder = (language) => {
    const languageColors = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#f89820',
      'C': '#00599c',
      'C++': '#00599c',
      'C#': '#239120',
      'CSS': '#264de4',
      'HTML': '#e34f26',
      'PHP': '#777bb4',
      'Ruby': '#cc342d',
      'Go': '#00add8',
      'Rust': '#000000',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'Scala': '#dc322f',
      'R': '#276dc3',
      'MATLAB': '#e16737',
      'Shell': '#89e051',
      'PowerShell': '#012456',
      'Dart': '#0175c2',
      'Lua': '#000080',
      'Perl': '#39457e',
      'Haskell': '#5d4f85',
      'Clojure': '#5881d8',
      'Elixir': '#4e2a8a',
      'Erlang': '#a90533',
      'F#': '#378bda',
      'OCaml': '#ec6813',
      'Racket': '#3c5caa',
      'Scheme': '#1f4e79',
      'Prolog': '#ff6b35',
      'Assembly': '#6e4c13',
      'VHDL': '#adb2cb',
      'Verilog': '#b2b7f8',
      'SystemVerilog': '#dae1fc',
      'Tcl': '#e4cc98',
      'AutoHotkey': '#334455',
      'AutoIt': '#1c3552',
      'VBScript': '#15dcdc',
      'ActionScript': '#882b00',
      'AppleScript': '#101f1c',
      'Awk': '#c30e9b',
      'Bash': '#4eaa25',
      'Crystal': '#000100',
      'D': '#ba595e',
      'Delphi': '#b30000',
      'Emacs Lisp': '#c065db',
      'Forth': '#341708',
      'Fortran': '#4d41b1',
      'FreeMarker': '#0050b2',
      'Frege': '#00cafe',
      'Game Maker Language': '#71b417',
      'GDScript': '#355570',
      'Gherkin': '#5b2063',
      'Gradle': '#02303a',
      'Groovy': '#4298b8',
      'Hack': '#878787',
      'Handlebars': '#f7931e',
      'Haxe': '#df7900',
      'Jupyter Notebook': '#da5b0b',
      'Makefile': '#427819',
      'Markdown': '#083fa1',
      'Nim': '#ffc200',
      'Nix': '#7e7eff',
      'Objective-C': '#438eff',
      'Objective-C++': '#6866fb',
      'Pascal': '#e3f171',
      'PostScript': '#da291c',
      'Pug': '#a86454',
      'PureScript': '#1d222d',
      'QML': '#44a51c',
      'Roff': '#ecdebe',
      'SAS': '#b34936',
      'Sass': '#cf649a',
      'Solidity': '#363636',
      'Stylus': '#ff6347',
      'TeX': '#3d6117',
      'Terraform': '#623ce4',
      'Vue': '#4fc08d',
      'WebAssembly': '#654ff0',
      'XSLT': '#eb8ceb',
      'YAML': '#cb171e',
      'Zig': '#ec915c'
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

  // Fonctions utilitaires pour les couleurs
  const adjustColorBrightness = (color, factor) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const newR = Math.max(0, Math.min(255, r + (255 - r) * factor))
    const newG = Math.max(0, Math.min(255, g + (255 - g) * factor))
    const newB = Math.max(0, Math.min(255, b + (255 - b) * factor))
    
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
  }

  const getContrastColor = (backgroundColor) => {
    const hex = backgroundColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  // Transformer les repos GitHub en projets
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

  // Filtrer les projets selon la catégorie active
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  // Si pas de projets, afficher un message
  if (!loading && !error && projects.length === 0) {
    return (
      <section id="portfolio" className="portfolio">
        <div className="container">
          <h2 className="section-title">{currentData.title}</h2>
          <div className="no-projects">
            <p>Aucun projet GitHub trouvé. Vérifiez votre configuration.</p>
          </div>
        </div>
      </section>
    )
  }

  // Gestion du loading et des erreurs
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
    // Fallback avec projets statiques en cas d'erreur
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
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
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
              onClick={() => setActiveFilter(key)}
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

        {/* Message si aucun projet trouvé */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="no-projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>Aucun projet trouvé pour cette catégorie.</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default Portfolio
