/**
 * Script pour récupérer les données GitHub et mettre à jour le portfolio
 * Exécuté automatiquement par GitHub Actions chaque semaine
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./portfolio-config');

// Configuration
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'louno172';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_FILE = 'data/portfolio.json';

// Configuration de l'API GitHub
const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Updater'
  }
});

/**
 * Récupère tous les repositories publics de l'utilisateur
 */
async function fetchUserRepositories() {
  try {
    console.log(`🔍 Récupération des repositories de ${GITHUB_USERNAME}...`);
    
    const response = await githubAPI.get(`/users/${GITHUB_USERNAME}/repos`, {
      params: {
        type: 'public',
        sort: 'updated',
        per_page: 100
      }
    });
    
    console.log(`✅ ${response.data.length} repositories trouvés`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des repositories:', error.message);
    throw error;
  }
}

/**
 * Récupère les statistiques utilisateur
 */
async function fetchUserStats() {
  try {
    console.log('📊 Récupération des statistiques utilisateur...');
    
    const response = await githubAPI.get(`/users/${GITHUB_USERNAME}`);
    const user = response.data;
    
    return {
      totalRepos: user.public_repos,
      totalStars: user.public_repos > 0 ? await fetchTotalStars() : 0,
      followers: user.followers,
      following: user.following
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error.message);
    return {
      totalRepos: 0,
      totalStars: 0,
      followers: 0,
      following: 0
    };
  }
}

/**
 * Calcule le nombre total d'étoiles
 */
async function fetchTotalStars() {
  try {
    const response = await githubAPI.get(`/users/${GITHUB_USERNAME}/starred`, {
      params: { per_page: 1 }
    });
    
    // GitHub ne fournit pas directement le total, on fait une estimation
    // basée sur les repositories de l'utilisateur
    const repos = await githubAPI.get(`/users/${GITHUB_USERNAME}/repos`);
    return repos.data.reduce((total, repo) => total + repo.stargazers_count, 0);
  } catch (error) {
    console.warn('⚠️ Impossible de calculer le total d\'étoiles');
    return 0;
  }
}

/**
 * Détermine la catégorie d'un projet basée sur ses topics et sa description
 */
function categorizeProject(repo) {
  const topics = repo.topics || [];
  const description = (repo.description || '').toLowerCase();
  const name = repo.name.toLowerCase();
  
  // Vérifier si le projet est dans la liste des catégories forcées
  if (config.forcedCategories[name]) {
    return config.forcedCategories[name];
  }
  
  // Vérifier si le projet doit être exclu
  if (config.excludedProjects.some(excluded => name.includes(excluded.toLowerCase()))) {
    return null; // Projet exclu
  }
  
  // Vérifier les topics
  for (const topic of topics) {
    const topicLower = topic.toLowerCase();
    
    for (const [category, rules] of Object.entries(config.categorizationRules)) {
      if (rules.topics.some(keyword => topicLower.includes(keyword))) {
        return category;
      }
    }
  }
  
  // Vérifier le nom et la description
  const textToCheck = `${name} ${description}`;
  
  for (const [category, rules] of Object.entries(config.categorizationRules)) {
    if (rules.keywords.some(keyword => textToCheck.includes(keyword))) {
      return category;
    }
  }
  
  // Par défaut, catégoriser comme Personnel
  return 'Personnel';
}

/**
 * Génère une image placeholder basée sur le langage principal
 */
function generateLanguagePlaceholder(language) {
  const color = config.languageColors[language] || '#6B7280';
  const { width, height, backgroundColor, textColor, fontSize, fontFamily } = config.placeholderConfig;
  
  // Générer une image SVG avec la couleur du langage
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
      <rect x="50" y="50" width="${width-100}" height="${height-100}" rx="8" fill="${color}" opacity="0.1"/>
      <circle cx="${width/2}" cy="${height/2}" r="30" fill="${color}" opacity="0.3"/>
      <text x="${width/2}" y="${height/2 + 15}" text-anchor="middle" font-family="${fontFamily}" font-size="${fontSize}" fill="${color}" font-weight="bold">${language || 'Code'}</text>
    </svg>
  `).toString('base64')}`;
}

/**
 * Transforme un repository GitHub en objet projet
 */
function transformRepositoryToProject(repo) {
  const category = categorizeProject(repo);
  
  // Si le projet est exclu, retourner null
  if (!category) {
    return null;
  }
  
  const lastUpdated = new Date(repo.updated_at).toISOString().split('T')[0];
  
  return {
    id: `github-${repo.name}`,
    title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: repo.description || 'Aucune description disponible',
    category: category,
    image: generateLanguagePlaceholder(repo.language),
    technologies: repo.language ? [repo.language] : [],
    github: repo.html_url,
    demo: repo.homepage || null,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    lastUpdated: lastUpdated,
    status: repo.archived ? 'archived' : (repo.fork ? 'fork' : 'active'),
    year: new Date(repo.created_at).getFullYear(),
    topics: repo.topics || [],
    language: repo.language,
    size: repo.size,
    archived: repo.archived,
    fork: repo.fork
  };
}

/**
 * Génère la structure complète du portfolio
 */
function generatePortfolioData(repositories, userStats) {
  const projects = repositories
    .map(transformRepositoryToProject)
    .filter(project => project !== null); // Filtrer les projets exclus
  
  // Calculer les statistiques par catégorie
  const byCategory = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {});
  
  // Calculer les totaux
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
  const totalForks = projects.reduce((sum, project) => sum + project.forks, 0);
  
  // Générer les catégories depuis la configuration
  const categories = {};
  for (const [key, rules] of Object.entries(config.categorizationRules)) {
    categories[key] = {
      description: rules.description,
      icon: rules.icon,
      color: rules.color
    };
  }
  
  return {
    projects: projects,
    categories: categories,
    stats: {
      totalProjects: projects.length,
      byCategory: byCategory,
      totalStars: totalStars,
      totalForks: totalForks,
      lastUpdated: new Date().toISOString().split('T')[0],
      userStats: userStats
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      generatedBy: 'GitHub Action',
      source: 'GitHub API',
      username: GITHUB_USERNAME
    }
  };
}

/**
 * Sauvegarde les données dans le fichier JSON
 */
function savePortfolioData(data) {
  try {
    const outputPath = path.join(process.cwd(), OUTPUT_FILE);
    const jsonData = JSON.stringify(data, null, 2);
    
    fs.writeFileSync(outputPath, jsonData, 'utf8');
    console.log(`✅ Données sauvegardées dans ${OUTPUT_FILE}`);
    
    // Afficher un résumé
    console.log('\n📊 Résumé du portfolio:');
    console.log(`   • Total projets: ${data.stats.totalProjects}`);
    console.log(`   • Étoiles totales: ${data.stats.totalStars}`);
    console.log(`   • Forks totaux: ${data.stats.totalForks}`);
    console.log(`   • Par catégorie:`, data.stats.byCategory);
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error.message);
    throw error;
  }
}

/**
 * Fonction principale
 */
async function main() {
  try {
    console.log('🚀 Début de la mise à jour du portfolio...\n');
    
    // Vérifier la présence du token GitHub
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN est requis pour accéder à l\'API GitHub');
    }
    
    // Récupérer les données
    const [repositories, userStats] = await Promise.all([
      fetchUserRepositories(),
      fetchUserStats()
    ]);
    
    // Générer les données du portfolio
    const portfolioData = generatePortfolioData(repositories, userStats);
    
    // Sauvegarder
    savePortfolioData(portfolioData);
    
    console.log('\n🎉 Mise à jour du portfolio terminée avec succès !');
    
  } catch (error) {
    console.error('\n💥 Erreur lors de la mise à jour du portfolio:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = {
  fetchUserRepositories,
  fetchUserStats,
  categorizeProject,
  transformRepositoryToProject,
  generatePortfolioData
};
