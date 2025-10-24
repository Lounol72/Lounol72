/**
 * Configuration pour la catégorisation automatique des projets
 * Personnalisez ces règles selon vos besoins
 */

module.exports = {
  // Règles de catégorisation basées sur les topics GitHub
  categorizationRules: {
    'Université': {
      topics: [
        'university', 'université', 'school', 'école', 'student', 'étudiant',
        'academic', 'académique', 'course', 'cours', 'assignment', 'devoir',
        'project', 'projet', 'tp', 'td', 'exam', 'examen', 'l3', 'm1', 'm2'
      ],
      keywords: [
        'université', 'university', 'school', 'student', 'academic',
        'course', 'assignment', 'project', 'tp', 'td', 'exam'
      ],
      description: 'Projets réalisés dans le cadre de mes études à l\'Université du Mans',
      icon: 'fas fa-graduation-cap',
      color: '#4A90E2'
    },
    
    'GameJam': {
      topics: [
        'gamejam', 'game-jam', 'ludum', 'dare', 'itch', 'game', 'jeu',
        'jam', '48h', '72h', 'weekend', 'week-end', 'global-game-jam',
        'ludum-dare', 'itch-io', 'game-development'
      ],
      keywords: [
        'gamejam', 'game-jam', 'ludum', 'dare', 'itch', 'game',
        'jam', '48h', '72h', 'weekend', 'week-end'
      ],
      description: 'Jeux développés lors d\'événements GameJam',
      icon: 'fas fa-gamepad',
      color: '#F5A623'
    },
    
    'Personnel': {
      topics: [
        'personal', 'personnel', 'portfolio', 'website', 'site', 'blog',
        'tool', 'outil', 'utility', 'utilitaire', 'script', 'automation',
        'side-project', 'hobby', 'learning', 'experiment'
      ],
      keywords: [
        'personal', 'personnel', 'portfolio', 'website', 'site',
        'tool', 'outil', 'utility', 'script', 'automation'
      ],
      description: 'Projets personnels et expérimentations',
      icon: 'fas fa-user',
      color: '#7ED321'
    }
  },
  
  // Configuration des langages et leurs couleurs
  languageColors: {
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
  },
  
  // Projets à exclure (par nom)
  excludedProjects: [
    'louno172', // Repository principal
    '.github', // Configuration GitHub
    'README', // Fichiers README
    'LICENSE' // Fichiers de licence
  ],
  
  // Projets à forcer dans une catégorie spécifique
  forcedCategories: {
    // 'nom-du-repo': 'Université'
  },
  
  // Configuration des images placeholder
  placeholderConfig: {
    width: 350,
    height: 250,
    backgroundColor: '#F3F4F6',
    textColor: '#6B7280',
    fontSize: 14,
    fontFamily: 'Arial, sans-serif'
  },
  
  // Configuration de l'API GitHub
  githubConfig: {
    perPage: 100,
    sort: 'updated',
    type: 'public'
  }
};
