const axios = require('axios');
const fs = require('fs');
const path = require('path');
// Zlib est une bibliothèque intégrée à Node.js, pas besoin de l'installer séparément
const zlib = require('zlib');

const username = process.env.USERNAME || 'Lounol72';

// Configuration de sécurité - seules les données publiques sont récupérées
const SECURITY_CONFIG = {
  // Données autorisées (publiques uniquement)
  allowedUserFields: ['public_repos', 'followers', 'login', 'avatar_url'],
  allowedRepoFields: ['name', 'description', 'html_url', 'language', 'stargazers_count', 'forks_count', 'updated_at', 'topics'],
  
  // Données interdites (sécurité)
  forbiddenFields: ['email', 'private_repos', 'private_gists', 'total_private_repos', 'owned_private_repos', 'disk_usage', 'collaborators', 'two_factor_authentication', 'plan', 'suspended_at', 'business_plus', 'ldap_dn', 'site_admin', 'hireable', 'bio', 'blog', 'company', 'location', 'created_at', 'updated_at', 'id', 'node_id', 'gravatar_id', 'url', 'html_url', 'followers_url', 'following_url', 'gists_url', 'starred_url', 'subscriptions_url', 'organizations_url', 'repos_url', 'events_url', 'received_events_url', 'type', 'following', 'followers_url', 'following_url', 'gists_url', 'starred_url', 'subscriptions_url', 'organizations_url', 'repos_url', 'events_url', 'received_events_url', 'type', 'following'],
  
  // Cache configuration
  cacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
  maxRepos: 15, // Limite le nombre de repos pour éviter les données excessives
  maxDescriptionLength: 200 // Limite la longueur des descriptions
};

// Fonction de nettoyage des données pour la sécurité
function sanitizeData(data, allowedFields) {
  const sanitized = {};
  for (const field of allowedFields) {
    if (data.hasOwnProperty(field) && data[field] !== null && data[field] !== undefined) {
      sanitized[field] = data[field];
    }
  }
  return sanitized;
}

// Fonction de vérification du cache
function shouldUpdateCache() {
  const dataDir = path.resolve(process.cwd(), 'data');
  const cacheFile = path.join(dataDir, 'github.json');
  
  if (!fs.existsSync(cacheFile)) {
    return true; // Pas de cache, mettre à jour
  }
  
  try {
    const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    const lastUpdate = cacheData.lastUpdate || 0;
    const now = new Date().getTime();
    
    return (now - lastUpdate) > SECURITY_CONFIG.cacheExpiry;
  } catch (error) {
    console.warn('Cache file corrupted, will update:', error.message);
    return true;
  }
}

async function fetchGitHubStats() {
  try {
    // Vérifier si le cache est encore valide
    if (!shouldUpdateCache()) {
      console.log('Cache is still valid, skipping update');
      return;
    }

    console.log('Updating GitHub cache...');
    
    // Utiliser l'API publique sans token (données publiques uniquement)
    const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'Portfolio-Cache-Updater/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    // Nettoyer les données utilisateur (sécurité)
    const userData = sanitizeData(userResponse.data, SECURITY_CONFIG.allowedUserFields);
    
    // Récupérer uniquement les dépôts publics avec topics
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&type=public&sort=updated`, {
      headers: {
        'User-Agent': 'Portfolio-Cache-Updater/1.0',
        'Accept': 'application/vnd.github.mercy-preview+json'
      }
    });
    
    // Nettoyer les données des repos (sécurité)
    const reposData = reposResponse.data.map(repo => sanitizeData(repo, SECURITY_CONFIG.allowedRepoFields));

    // Ne stocker que les données publiques essentielles et sécurisées
    const stats = {
      t: new Date().getTime(), // timestamp compact
      r: userData.public_repos || 0, // nombre de dépôts publics
      s: reposData.reduce((total, repo) => total + (repo.stargazers_count || 0), 0), // étoiles totales
      f: userData.followers || 0, // followers
      lastUpdate: new Date().getTime() // timestamp de mise à jour
    };

    // Sélectionner les repos les plus récents avec données minimales et sécurisées
    const repos = reposData
      .filter(repo => repo.name && repo.html_url) // Filtrer les repos sans nom ou URL
      .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
      .slice(0, SECURITY_CONFIG.maxRepos)
      .map(repo => {
        // Nettoyer la description (limiter la longueur)
        let description = repo.description || '';
        if (description.length > SECURITY_CONFIG.maxDescriptionLength) {
          description = description.substring(0, SECURITY_CONFIG.maxDescriptionLength) + '...';
        }
        
        return {
          n: repo.name, // nom
          d: description, // description nettoyée
          u: repo.html_url, // URL
          l: repo.language || 'Other', // langage (fallback)
          s: repo.stargazers_count || 0, // étoiles
          f: repo.forks_count || 0, // forks
          t: new Date(repo.updated_at || Date.now()).getTime(), // date mise à jour (timestamp)
          topics: (repo.topics || []).slice(0, 10) // topics GitHub (limité à 10)
        };
      });

    // Création d'un seul fichier compact et sécurisé
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Données finales sécurisées
    const secureData = {
      stats,
      repos,
      meta: {
        lastUpdate: new Date().toISOString(),
        version: '1.0',
        security: 'public-data-only',
        cacheExpiry: SECURITY_CONFIG.cacheExpiry
      }
    };
    
    // Minifier le JSON
    const minifiedData = JSON.stringify(secureData);
    
    // Écriture du fichier minifié
    fs.writeFileSync(path.join(dataDir, 'github.json'), minifiedData);
    
    // Version compressée pour optimiser la taille
    try {
      const compressed = zlib.gzipSync(minifiedData);
      fs.writeFileSync(path.join(dataDir, 'github.json.gz'), compressed);
      console.log(`Compressed cache: ${Math.round(compressed.length / 1024)}KB`);
    } catch (compressionError) {
      console.warn('Warning: Could not create compressed version:', compressionError.message);
    }
    
    // Log de sécurité
    console.log('✅ GitHub cache updated successfully!');
    console.log(`📊 Stats: ${stats.r} repos, ${stats.s} stars, ${stats.f} followers`);
    console.log(`🔒 Security: Only public data stored`);
    console.log(`⏰ Next update: ${new Date(Date.now() + SECURITY_CONFIG.cacheExpiry).toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error fetching GitHub stats:', error.message);
    
    // En cas d'erreur, ne pas casser le site
    if (fs.existsSync(path.join(process.cwd(), 'data', 'github.json'))) {
      console.log('🔄 Using existing cache due to error');
    } else {
      console.error('💥 No cache available, site may not work properly');
    }
    
    process.exit(1);
  }
}

fetchGitHubStats(); 