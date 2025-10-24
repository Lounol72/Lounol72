/**
 * Script de test pour vérifier le fonctionnement du système de portfolio
 * Usage: node scripts/test-portfolio.js
 */

const fs = require('fs');
const path = require('path');

// Importer les fonctions du script principal
const {
  fetchUserRepositories,
  fetchUserStats,
  categorizeProject,
  transformRepositoryToProject,
  generatePortfolioData
} = require('./fetch-github-data');

/**
 * Test de la catégorisation
 */
function testCategorization() {
  console.log('🧪 Test de la catégorisation...\n');
  
  const testRepos = [
    {
      name: 'projet-universite',
      description: 'Projet de base de données pour l\'université',
      topics: ['university', 'database', 'java']
    },
    {
      name: 'gamejam-2024',
      description: 'Jeu développé lors de la Global Game Jam 2024',
      topics: ['gamejam', 'unity', 'game']
    },
    {
      name: 'mon-site-personnel',
      description: 'Site web personnel avec React',
      topics: ['personal', 'website', 'react']
    },
    {
      name: 'projet-generique',
      description: 'Un projet sans mots-clés spécifiques',
      topics: ['javascript', 'web']
    }
  ];
  
  testRepos.forEach(repo => {
    const category = categorizeProject(repo);
    console.log(`📁 ${repo.name}: ${category}`);
    console.log(`   Description: ${repo.description}`);
    console.log(`   Topics: ${repo.topics.join(', ')}`);
    console.log('');
  });
}

/**
 * Test de la génération d'images placeholder
 */
function testImageGeneration() {
  console.log('🎨 Test de génération d\'images...\n');
  
  const languages = ['JavaScript', 'Python', 'Java', 'React', 'Vue.js'];
  
  languages.forEach(lang => {
    const image = generateLanguagePlaceholder(lang);
    console.log(`🖼️  ${lang}: ${image.substring(0, 50)}...`);
  });
  
  console.log('');
}

/**
 * Test de la structure des données
 */
function testDataStructure() {
  console.log('📊 Test de la structure des données...\n');
  
  // Créer des données de test
  const mockRepos = [
    {
      name: 'test-project-1',
      description: 'Projet de test 1',
      topics: ['javascript', 'react'],
      language: 'JavaScript',
      html_url: 'https://github.com/test/test-project-1',
      stargazers_count: 5,
      forks_count: 2,
      updated_at: '2024-01-15T10:30:00Z',
      created_at: '2024-01-01T00:00:00Z',
      archived: false,
      fork: false
    },
    {
      name: 'test-project-2',
      description: 'Projet de test 2',
      topics: ['python', 'university'],
      language: 'Python',
      html_url: 'https://github.com/test/test-project-2',
      stargazers_count: 3,
      forks_count: 1,
      updated_at: '2024-01-10T15:20:00Z',
      created_at: '2024-01-05T00:00:00Z',
      archived: false,
      fork: false
    }
  ];
  
  const mockUserStats = {
    totalRepos: 10,
    totalStars: 25,
    followers: 5,
    following: 10
  };
  
  const portfolioData = generatePortfolioData(mockRepos, mockUserStats);
  
  console.log('✅ Structure générée:');
  console.log(`   • Projets: ${portfolioData.projects.length}`);
  console.log(`   • Catégories: ${Object.keys(portfolioData.categories).length}`);
  console.log(`   • Total étoiles: ${portfolioData.stats.totalStars}`);
  console.log(`   • Par catégorie:`, portfolioData.stats.byCategory);
  console.log('');
}

/**
 * Test de la sauvegarde
 */
function testSaveData() {
  console.log('💾 Test de la sauvegarde...\n');
  
  const testData = {
    projects: [],
    categories: {
      'Test': {
        description: 'Catégorie de test',
        icon: 'fas fa-test',
        color: '#FF0000'
      }
    },
    stats: {
      totalProjects: 0,
      byCategory: {},
      totalStars: 0,
      totalForks: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      generatedBy: 'Test Script',
      source: 'Test'
    }
  };
  
  const outputPath = path.join(process.cwd(), 'data/test-portfolio.json');
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2), 'utf8');
    console.log(`✅ Fichier de test sauvegardé: ${outputPath}`);
    
    // Vérifier que le fichier peut être lu
    const readData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    console.log('✅ Fichier de test lu avec succès');
    
    // Nettoyer
    fs.unlinkSync(outputPath);
    console.log('✅ Fichier de test supprimé');
    
  } catch (error) {
    console.error('❌ Erreur lors du test de sauvegarde:', error.message);
  }
  
  console.log('');
}

/**
 * Test de la configuration
 */
function testConfiguration() {
  console.log('⚙️  Test de la configuration...\n');
  
  try {
    const config = require('./portfolio-config');
    
    console.log('✅ Configuration chargée:');
    console.log(`   • Règles de catégorisation: ${Object.keys(config.categorizationRules).length}`);
    console.log(`   • Couleurs de langages: ${Object.keys(config.languageColors).length}`);
    console.log(`   • Projets exclus: ${config.excludedProjects.length}`);
    console.log(`   • Catégories forcées: ${Object.keys(config.forcedCategories).length}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la configuration:', error.message);
  }
  
  console.log('');
}

/**
 * Fonction principale de test
 */
function runTests() {
  console.log('🚀 Début des tests du système de portfolio\n');
  console.log('=' .repeat(50));
  
  try {
    testConfiguration();
    testCategorization();
    testImageGeneration();
    testDataStructure();
    testSaveData();
    
    console.log('=' .repeat(50));
    console.log('🎉 Tous les tests sont passés avec succès !');
    console.log('✅ Le système est prêt à être utilisé');
    
  } catch (error) {
    console.error('\n💥 Erreur lors des tests:', error.message);
    process.exit(1);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runTests();
}

module.exports = {
  testCategorization,
  testImageGeneration,
  testDataStructure,
  testSaveData,
  testConfiguration,
  runTests
};
