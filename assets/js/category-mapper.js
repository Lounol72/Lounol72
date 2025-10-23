// Mappeur de topics GitHub vers catégories de portfolio
// Détermine la catégorie d'un projet basée sur ses topics GitHub

/**
 * Mappe les topics GitHub vers les catégories du portfolio
 * @param {Array} topics - Liste des topics GitHub
 * @param {string} language - Langage principal du projet
 * @param {string} description - Description du projet
 * @returns {string} Catégorie du projet ('academic', 'personal', 'hackathon')
 */
function getCategoryFromTopics(topics = [], language = '', description = '') {
  // Normaliser les topics en minuscules
  const normalizedTopics = topics.map(topic => topic.toLowerCase());
  const normalizedDescription = description.toLowerCase();
  
  // Mots-clés pour chaque catégorie
  const academicKeywords = [
    'university', 'school', 'college', 'academic', 'education', 'student',
    'homework', 'assignment', 'project', 'course', 'learning', 'study',
    'algorithm', 'data-structure', 'computer-science', 'cs', 'programming',
    'thesis', 'dissertation', 'research', 'paper', 'coursera', 'edx',
    'udemy', 'udacity', 'mooc', 'tutorial', 'exercise', 'practice'
  ];
  
  const hackathonKeywords = [
    'hackathon', 'competition', 'contest', 'challenge', 'event', '24h',
    '48h', 'weekend', 'jam', 'game-jam', 'devfest', 'startup', 'innovation',
    'prize', 'winner', 'award', 'demo', 'pitch', 'presentation'
  ];
  
  const personalKeywords = [
    'personal', 'side-project', 'hobby', 'fun', 'experiment', 'playground',
    'sandbox', 'test', 'demo', 'showcase', 'portfolio', 'blog', 'website',
    'app', 'tool', 'utility', 'script', 'automation', 'productivity',
    'game', 'entertainment', 'music', 'art', 'creative', 'design'
  ];
  
  // Vérifier les topics pour les catégories
  const hasAcademicTopic = academicKeywords.some(keyword => 
    normalizedTopics.some(topic => topic.includes(keyword))
  );
  
  const hasHackathonTopic = hackathonKeywords.some(keyword => 
    normalizedTopics.some(topic => topic.includes(keyword))
  );
  
  const hasPersonalTopic = personalKeywords.some(keyword => 
    normalizedTopics.some(topic => topic.includes(keyword))
  );
  
  // Vérifier la description pour des indices supplémentaires
  const hasAcademicDescription = academicKeywords.some(keyword => 
    normalizedDescription.includes(keyword)
  );
  
  const hasHackathonDescription = hackathonKeywords.some(keyword => 
    normalizedDescription.includes(keyword)
  );
  
  // Logique de priorité pour la catégorisation
  if (hasHackathonTopic || hasHackathonDescription) {
    return 'hackathon';
  }
  
  if (hasAcademicTopic || hasAcademicDescription) {
    return 'academic';
  }
  
  if (hasPersonalTopic) {
    return 'personal';
  }
  
  // Catégorisation basée sur le langage et la description
  const academicLanguages = ['C', 'C++', 'Java', 'Python', 'Assembly', 'MATLAB'];
  const gameLanguages = ['C', 'C++', 'C#', 'JavaScript', 'Lua'];
  
  if (academicLanguages.includes(language) && 
      (normalizedDescription.includes('university') || 
       normalizedDescription.includes('school') ||
       normalizedDescription.includes('academic'))) {
    return 'academic';
  }
  
  if (gameLanguages.includes(language) && 
      (normalizedDescription.includes('game') || 
       normalizedDescription.includes('pokemon') ||
       normalizedDescription.includes('play'))) {
    return 'personal';
  }
  
  // Par défaut, considérer comme personnel
  return 'personal';
}

/**
 * Obtient l'icône et la couleur associées à une catégorie
 * @param {string} category - Catégorie du projet
 * @returns {Object} Objet contenant l'icône et la couleur
 */
function getCategoryStyle(category) {
  const styles = {
    'academic': {
      icon: 'fas fa-graduation-cap',
      color: '#4a90e2',
      label: 'Académique',
      description: 'Projets universitaires et éducatifs'
    },
    'personal': {
      icon: 'fas fa-user',
      color: '#7ed321',
      label: 'Personnel',
      description: 'Projets personnels et side-projects'
    },
    'hackathon': {
      icon: 'fas fa-trophy',
      color: '#f5a623',
      label: 'Hackathon',
      description: 'Projets de compétition et hackathons'
    }
  };
  
  return styles[category] || styles['personal'];
}

/**
 * Génère un badge HTML pour une catégorie
 * @param {string} category - Catégorie du projet
 * @returns {string} HTML du badge
 */
function generateCategoryBadge(category) {
  const style = getCategoryStyle(category);
  
  return `
    <span class="category-badge" style="background-color: ${style.color}20; color: ${style.color}; border: 1px solid ${style.color}40;">
      <i class="${style.icon}"></i>
      ${style.label}
    </span>
  `;
}

/**
 * Filtre les projets par catégorie
 * @param {Array} projects - Liste des projets
 * @param {string} category - Catégorie à filtrer ('all', 'academic', 'personal', 'hackathon')
 * @returns {Array} Projets filtrés
 */
function filterProjectsByCategory(projects, category) {
  if (category === 'all') {
    return projects;
  }
  
  return projects.filter(project => project.category === category);
}

/**
 * Obtient les statistiques par catégorie
 * @param {Array} projects - Liste des projets
 * @returns {Object} Statistiques par catégorie
 */
function getCategoryStats(projects) {
  const stats = {
    total: projects.length,
    academic: 0,
    personal: 0,
    hackathon: 0
  };
  
  projects.forEach(project => {
    if (stats.hasOwnProperty(project.category)) {
      stats[project.category]++;
    }
  });
  
  return stats;
}

/**
 * Génère le HTML des filtres de catégorie
 * @param {Object} stats - Statistiques par catégorie
 * @returns {string} HTML des filtres
 */
function generateCategoryFilters(stats) {
  const filters = [
    { key: 'all', label: 'Tous', count: stats.total },
    { key: 'academic', label: 'Académique', count: stats.academic },
    { key: 'personal', label: 'Personnel', count: stats.personal },
    { key: 'hackathon', label: 'Hackathon', count: stats.hackathon }
  ];
  
  return filters.map(filter => `
    <button class="filter ${filter.key === 'all' ? 'active' : ''}" 
            data-filter="${filter.key}">
      ${filter.label}
      <span class="filter-count">${filter.count}</span>
    </button>
  `).join('');
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCategoryFromTopics,
    getCategoryStyle,
    generateCategoryBadge,
    filterProjectsByCategory,
    getCategoryStats,
    generateCategoryFilters
  };
}
