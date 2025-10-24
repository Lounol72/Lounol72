/**
 * Script pour générer le portfolio à partir des données GitHub
 * Utilise les données de data/github.json générées par fetch-github-stats.js
 */

const fs = require('fs');
const path = require('path');

// Configuration des catégories
const CATEGORIES = {
  'Université': {
    topics: ['university', 'université', 'school', 'école', 'student', 'étudiant', 'academic', 'académique', 'course', 'cours', 'assignment', 'devoir', 'project', 'projet', 'tp', 'td', 'exam', 'examen', 'l3', 'm1', 'm2'],
    keywords: ['université', 'university', 'school', 'student', 'academic', 'course', 'assignment', 'project', 'tp', 'td', 'exam'],
    description: 'Projets réalisés dans le cadre de mes études à l\'Université du Mans',
    icon: 'fas fa-graduation-cap',
    color: '#4A90E2'
  },
  'GameJam': {
    topics: ['gamejam', 'game-jam', 'ludum', 'dare', 'itch', 'game', 'jeu', 'jam', '48h', '72h', 'weekend', 'week-end', 'global-game-jam', 'ludum-dare', 'itch-io', 'game-development'],
    keywords: ['gamejam', 'game-jam', 'ludum', 'dare', 'itch', 'game', 'jam', '48h', '72h', 'weekend', 'week-end'],
    description: 'Jeux développés lors d\'événements GameJam',
    icon: 'fas fa-gamepad',
    color: '#F5A623'
  },
  'Personnel': {
    topics: ['personal', 'personnel', 'portfolio', 'website', 'site', 'blog', 'tool', 'outil', 'utility', 'utilitaire', 'script', 'automation', 'side-project', 'hobby', 'learning', 'experiment'],
    keywords: ['personal', 'personnel', 'portfolio', 'website', 'site', 'tool', 'outil', 'utility', 'script', 'automation'],
    description: 'Projets personnels et expérimentations',
    icon: 'fas fa-user',
    color: '#7ED321'
  }
};

// Projets à exclure
const EXCLUDED_PROJECTS = [
  'louno172', // Repository principal
  '.github', // Configuration GitHub
  'README', // Fichiers README
  'LICENSE' // Fichiers de licence
];

// Couleurs des langages
const LANGUAGE_COLORS = {
  'JavaScript': '#F7DF1E',
  'TypeScript': '#3178C6',
  'Python': '#3776AB',
  'Java': '#ED8B00',
  'C++': '#00599C',
  'C#': '#239120',
  'PHP': '#777BB4',
  'Ruby': '#CC342D',
  'Go': '#00ADD8',
  'Rust': '#000000',
  'HTML': '#E34F26',
  'CSS': '#1572B6',
  'Vue': '#4FC08D',
  'React': '#61DAFB',
  'Angular': '#DD0031',
  'Node.js': '#339933',
  'Swift': '#FA7343',
  'Kotlin': '#7F52FF',
  'Dart': '#0175C2',
  'Flutter': '#02569B',
  'Svelte': '#FF3E00',
  'Next.js': '#000000',
  'Nuxt.js': '#00DC82',
  'Laravel': '#FF2D20',
  'Django': '#092E20',
  'Flask': '#000000',
  'Express': '#000000',
  'Spring': '#6DB33F',
  'Vue.js': '#4FC08D',
  'jQuery': '#0769AD',
  'Bootstrap': '#7952B3',
  'Tailwind': '#06B6D4',
  'Sass': '#CC6699',
  'Less': '#1D365D',
  'Webpack': '#8DD6F9',
  'Vite': '#646CFF',
  'Gulp': '#CF4647',
  'Grunt': '#FBA919'
};

/**
 * Détermine la catégorie d'un projet
 */
function categorizeProject(repo) {
  const name = repo.n.toLowerCase();
  const description = (repo.d || '').toLowerCase();
  const topics = repo.topics || [];
  
  // Vérifier les topics
  for (const topic of topics) {
    const topicLower = topic.toLowerCase();
    
    for (const [category, rules] of Object.entries(CATEGORIES)) {
      if (rules.topics.some(keyword => topicLower.includes(keyword))) {
        return category;
      }
    }
  }
  
  // Vérifier le nom et la description
  const textToCheck = `${name} ${description}`;
  
  for (const [category, rules] of Object.entries(CATEGORIES)) {
    if (rules.keywords.some(keyword => textToCheck.includes(keyword))) {
      return category;
    }
  }
  
  // Par défaut, catégoriser comme Personnel
  return 'Personnel';
}

/**
 * Génère une image placeholder basée sur le langage
 */
function generateLanguagePlaceholder(language) {
  const color = LANGUAGE_COLORS[language] || '#6B7280';
  
  const svg = `
    <svg width="350" height="250" viewBox="0 0 350 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="350" height="250" fill="#F3F4F6"/>
      <rect x="50" y="50" width="250" height="150" rx="8" fill="${color}" opacity="0.1"/>
      <circle cx="175" cy="125" r="30" fill="${color}" opacity="0.3"/>
      <text x="175" y="135" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${color}" font-weight="bold">${language || 'Code'}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Transforme un repository en projet
 */
function transformRepositoryToProject(repo) {
  const category = categorizeProject(repo);
  const lastUpdated = new Date(repo.t).toISOString().split('T')[0];
  const year = new Date(repo.t).getFullYear();
  
  return {
    id: `github-${repo.n}`,
    title: repo.n.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: repo.d || 'Aucune description disponible',
    category: category,
    image: generateLanguagePlaceholder(repo.l),
    technologies: repo.l ? [repo.l] : [],
    github: repo.u,
    demo: null, // Pas disponible dans les données GitHub
    stars: repo.s || 0,
    forks: repo.f || 0,
    lastUpdated: lastUpdated,
    status: 'active',
    year: year,
    topics: repo.topics || [],
    language: repo.l,
    archived: false,
    fork: false
  };
}

/**
 * Fonction principale
 */
function generatePortfolio() {
  try {
    console.log('🚀 Génération du portfolio à partir des données GitHub...\n');
    
    // Charger les données GitHub
    const githubDataPath = path.join(process.cwd(), 'data', 'github.json');
    
    if (!fs.existsSync(githubDataPath)) {
      console.error('❌ Fichier data/github.json non trouvé');
      console.log('💡 Exécutez d\'abord: node .github/scripts/fetch-github-stats.js');
      process.exit(1);
    }
    
    const githubData = JSON.parse(fs.readFileSync(githubDataPath, 'utf8'));
    console.log('✅ Données GitHub chargées');
    
    // Transformer les repositories en projets
    const projects = githubData.repos
      .filter(repo => {
        // Exclure les projets dans la liste d'exclusion
        return !EXCLUDED_PROJECTS.some(excluded => 
          repo.n.toLowerCase().includes(excluded.toLowerCase())
        );
      })
      .map(transformRepositoryToProject);
    
    console.log(`📁 ${projects.length} projets trouvés`);
    
    // Calculer les statistiques
    const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
    const totalForks = projects.reduce((sum, project) => sum + project.forks, 0);
    
    // Calculer les statistiques par catégorie
    const byCategory = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {});
    
    // Créer la structure de données du portfolio
    const portfolioData = {
      projects: projects,
      categories: CATEGORIES,
      stats: {
        totalProjects: projects.length,
        byCategory: byCategory,
        totalStars: totalStars,
        totalForks: totalForks,
        lastUpdated: new Date().toISOString().split('T')[0],
        userStats: {
          totalRepos: githubData.stats.r || 0,
          totalStars: totalStars,
          followers: githubData.stats.f || 0,
          following: 0 // Pas disponible dans les données GitHub
        }
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: 'GitHub Scripts',
        source: 'GitHub API',
        username: 'Lounol72'
      }
    };
    
    // Créer le dossier data s'il n'existe pas
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Sauvegarder les données
    const outputPath = path.join(dataDir, 'portfolio.json');
    fs.writeFileSync(outputPath, JSON.stringify(portfolioData, null, 2));
    
    // Afficher un résumé
    console.log('\n📊 Résumé du portfolio:');
    console.log(`   • Total projets: ${projects.length}`);
    console.log(`   • Étoiles totales: ${totalStars}`);
    console.log(`   • Forks totaux: ${totalForks}`);
    console.log(`   • Par catégorie:`, byCategory);
    console.log(`\n✅ Portfolio généré dans data/portfolio.json`);
    console.log('\n🎉 Génération terminée avec succès !');
    
  } catch (error) {
    console.error('\n💥 Erreur lors de la génération du portfolio:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  generatePortfolio();
}

module.exports = {
  categorizeProject,
  transformRepositoryToProject,
  generatePortfolio
};
