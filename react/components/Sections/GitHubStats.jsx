import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'
import { useGitHubStats } from '../../hooks/useGitHubStats'
import LoadingSpinner from '../UI/LoadingSpinner'

// Composant GitHubStats avec données en temps réel
const GitHubStats = () => {
  const { language } = useLanguage()
  const { stats, repos, loading, error, formatDate } = useGitHubStats()

  // Données avec support multilingue
  const statsData = {
    fr: {
      title: "Activité GitHub",
      myActivity: "Mon activité",
      recentProjects: "Mes projets récents",
      stats: {
        repositories: "Dépôts",
        stars: "Étoiles", 
        followers: "Followers"
      },
      lastUpdated: "Dernière mise à jour",
      noDescription: "Aucune description",
      updated: "Mis à jour"
    },
    en: {
      title: "GitHub Activity",
      myActivity: "My activity",
      recentProjects: "My recent projects",
      stats: {
        repositories: "Repositories",
        stars: "Stars",
        followers: "Followers"
      },
      lastUpdated: "Last updated",
      noDescription: "No description",
      updated: "Updated"
    }
  }

  const currentData = statsData[language]

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  // Composant pour les statistiques
  const StatItem = ({ icon, value, label }) => (
    <motion.div 
      className="stat-item"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <i className={icon}></i>
      <span className="stat-value">{value}</span>
      <p className="stat-label">{label}</p>
    </motion.div>
  )

  // Composant pour un repository
  const RepoItem = ({ repo }) => (
    <motion.div 
      className="recent-repo"
      whileHover={{ 
        scale: 1.02,
        y: -5
      }}
      transition={{ duration: 0.2 }}
    >
      <h4>
        <a 
          href={repo.u} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {repo.n}
        </a>
      </h4>
      <p>{repo.d || currentData.noDescription}</p>
      <div className="repo-meta">
        <span>
          <i className="fas fa-star"></i> {repo.s}
        </span>
        <span>
          <i className="fas fa-code-branch"></i> {repo.f}
        </span>
        <span>{repo.l || 'N/A'}</span>
        <span className="repo-date">
          {currentData.updated}: {formatDate(repo.t)}
        </span>
      </div>
    </motion.div>
  )

  return (
    <motion.section
      id="github-stats"
      className="github-stats"
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

        <div className="github-container">
          {/* Carte des statistiques */}
          <motion.div 
            className="github-card"
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{currentData.myActivity}</h3>
            
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="error-message">
                Impossible de charger les statistiques GitHub
              </div>
            ) : stats ? (
              <>
                <div className="github-stats-container">
                  <StatItem
                    icon="fas fa-code-branch"
                    value={stats.r}
                    label={currentData.stats.repositories}
                  />
                  <StatItem
                    icon="fas fa-star"
                    value={stats.s}
                    label={currentData.stats.stars}
                  />
                  <StatItem
                    icon="fas fa-users"
                    value={stats.f}
                    label={currentData.stats.followers}
                  />
                </div>
                <div className="last-updated">
                  <p>
                    {currentData.lastUpdated}: {formatDate(stats.t)}
                  </p>
                </div>
              </>
            ) : null}
          </motion.div>

          {/* Carte des projets récents */}
          <motion.div 
            className="github-card"
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{currentData.recentProjects}</h3>
            
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="error-message">
                Impossible de charger les projets récents
              </div>
            ) : repos && repos.length > 0 ? (
              <div className="recent-repos">
                {repos.map((repo, index) => (
                  <RepoItem key={index} repo={repo} />
                ))}
              </div>
            ) : (
              <div className="no-repos">
                Aucun projet trouvé
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default GitHubStats
