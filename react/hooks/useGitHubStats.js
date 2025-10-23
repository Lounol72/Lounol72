import { useState, useEffect } from 'react'

// Hook personnalisé pour gérer les statistiques GitHub
export const useGitHubStats = () => {
  const [stats, setStats] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true)
        
        // Vérifier le cache local d'abord (cache navigateur)
        const cacheKey = 'github_stats_cache'
        const cacheExpiry = 24 * 60 * 60 * 1000 // 24 heures (le serveur se met à jour toutes les semaines)
        const cachedData = localStorage.getItem(cacheKey)
        
        if (cachedData) {
          try {
            const { data, timestamp } = JSON.parse(cachedData)
            const now = new Date().getTime()
            
            // Si le cache navigateur est encore valide
            if (now - timestamp < cacheExpiry) {
              console.log('📦 Using browser cache for GitHub data')
              setStats(data.stats)
              setRepos(data.repos)
              setLoading(false)
              return
            }
          } catch (e) {
            console.warn('Invalid browser cache data, fetching from server')
          }
        }
        
        // Charger depuis le fichier JSON (cache serveur)
        console.log('🌐 Loading GitHub data from server cache')
        const response = await fetch('/data/github.json')
        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub data: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Vérifier la structure des données
        if (!data.stats || !data.repos || !Array.isArray(data.repos)) {
          throw new Error('Invalid data structure received')
        }
        
        // Sauvegarder dans le cache navigateur
        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: new Date().getTime()
        }))
        
        console.log(`✅ GitHub data loaded: ${data.repos.length} repos, ${data.stats.s} stars`)
        setStats(data.stats)
        setRepos(data.repos)
        
      } catch (err) {
        console.error('❌ Error loading GitHub stats:', err)
        setError(err.message)
        
        // En cas d'erreur, essayer d'utiliser le cache navigateur même s'il est expiré
        const fallbackCache = localStorage.getItem('github_stats_cache')
        if (fallbackCache) {
          try {
            const { data } = JSON.parse(fallbackCache)
            console.log('🔄 Using fallback cache due to error')
            setStats(data.stats)
            setRepos(data.repos)
            setError(null) // Annuler l'erreur si on a des données de fallback
          } catch (e) {
            console.error('Fallback cache also invalid')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  // Fonction pour formater la date
  const formatDate = (timestamp) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(timestamp).toLocaleDateString('fr-FR', options)
  }

  return {
    stats,
    repos,
    loading,
    error,
    formatDate
  }
}
