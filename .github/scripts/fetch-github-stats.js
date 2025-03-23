const axios = require('axios');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const username = process.env.USERNAME || 'Lounol72';

async function fetchGitHubStats() {
  try {
    // Utiliser l'API publique sans token
    const userResponse = await axios.get(`https://api.github.com/users/${username}`);
    const userData = userResponse.data;
    
    // Récupérer uniquement les dépôts publics
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&type=public`);
    const reposData = reposResponse.data;

    // Ne stocker que les données publiques essentielles
    const stats = {
      t: new Date().getTime(), // timestamp compact
      r: userData.public_repos, // nombre de dépôts
      s: reposData.reduce((total, repo) => total + repo.stargazers_count, 0), // étoiles
      f: userData.followers // followers
    };

    // Sélectionner seulement les 5 dépôts les plus récents avec données minimales
    const repos = reposData
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5)
      .map(repo => ({
        n: repo.name, // nom
        d: repo.description, // description
        u: repo.html_url, // URL
        l: repo.language, // langage
        s: repo.stargazers_count, // étoiles
        f: repo.forks_count, // forks
        t: new Date(repo.updated_at).getTime() // date mise à jour (timestamp)
      }));

    // Création d'un seul fichier compact
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Minifier le JSON
    const minifiedData = JSON.stringify({stats, repos});
    
    // Option 1: Simplement minifié
    fs.writeFileSync(path.join(dataDir, 'github.json'), minifiedData);
    
    // Option 2: Avec compression gzip (pour les serveurs qui supportent la décompression)
    const compressed = zlib.gzipSync(minifiedData);
    fs.writeFileSync(path.join(dataDir, 'github.json.gz'), compressed);
    
    console.log('GitHub stats updated successfully!');
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.message);
    process.exit(1);
  }
}

fetchGitHubStats(); 