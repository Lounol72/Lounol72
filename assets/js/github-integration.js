/**
 * GitHub Integration - Compatible avec les scripts existants
 * Utilise les données générées par fetch-github-stats.js et fetch-github-data.js
 */

class GitHubIntegration {
  constructor() {
    this.portfolioData = null;
    this.githubData = null;
    this.isLoading = false;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Initialise l'intégration GitHub
   */
  async init() {
    try {
      this.showLoading();
      await this.loadData();
      this.renderGitHubStats();
      this.renderPortfolioProjects();
      this.hideLoading();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation GitHub:', error);
      this.showError('Impossible de charger les données GitHub');
    }
  }

  /**
   * Charge les données depuis les fichiers JSON
   */
  async loadData() {
    try {
      // Charger les données du portfolio (générées par fetch-github-data.js)
      const portfolioResponse = await fetch('data/portfolio.json');
      if (portfolioResponse.ok) {
        this.portfolioData = await portfolioResponse.json();
        console.log('✅ Données portfolio chargées:', this.portfolioData);
      } else {
        console.warn('⚠️ Fichier portfolio.json non trouvé');
      }

      // Charger les données GitHub (générées par fetch-github-stats.js) - optionnel
      try {
        const githubResponse = await fetch('data/github.json');
        if (githubResponse.ok) {
          this.githubData = await githubResponse.json();
          console.log('✅ Données GitHub chargées:', this.githubData);
        } else {
          console.log('ℹ️ Fichier github.json non trouvé, utilisation des données portfolio uniquement');
        }
      } catch (githubError) {
        console.log('ℹ️ Fichier github.json non disponible, utilisation des données portfolio uniquement');
      }
    } catch (error) {
      console.warn('⚠️ Impossible de charger certaines données:', error);
    }
  }

  /**
   * Affiche les statistiques GitHub
   */
  renderGitHubStats() {
    const statsContainer = document.getElementById('github-stats');
    if (!statsContainer) return;

    // Priorité aux données GitHub si disponibles
    if (this.githubData && this.githubData.stats) {
      const stats = this.githubData.stats;
      statsContainer.innerHTML = `
        <div class="github-stats-container">
          <div class="github-stats-header">
            <i class="fab fa-github github-stats-icon"></i>
            <h3 class="github-stats-title">Statistiques GitHub</h3>
          </div>
          <div class="github-stats-grid">
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.r || 0}</span>
              <span class="github-stat-label">Repositories</span>
            </div>
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.s || 0}</span>
              <span class="github-stat-label">Étoiles</span>
            </div>
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.f || 0}</span>
              <span class="github-stat-label">Followers</span>
            </div>
          </div>
        </div>
      `;
    } 
    // Sinon utiliser les données du portfolio
    else if (this.portfolioData && this.portfolioData.stats) {
      const stats = this.portfolioData.stats;
      statsContainer.innerHTML = `
        <div class="github-stats-container">
          <div class="github-stats-header">
            <i class="fab fa-github github-stats-icon"></i>
            <h3 class="github-stats-title">Statistiques GitHub</h3>
          </div>
          <div class="github-stats-grid">
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.userStats?.totalRepos || 0}</span>
              <span class="github-stat-label">Repositories</span>
            </div>
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.totalStars || 0}</span>
              <span class="github-stat-label">Étoiles</span>
            </div>
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.userStats?.followers || 0}</span>
              <span class="github-stat-label">Followers</span>
            </div>
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.totalForks || 0}</span>
              <span class="github-stat-label">Forks</span>
            </div>
          </div>
        </div>
      `;
    } 
    // Si aucune donnée n'est disponible
    else {
      statsContainer.innerHTML = `
        <div class="github-stats-container">
          <div class="github-stats-header">
            <i class="fab fa-github github-stats-icon"></i>
            <h3 class="github-stats-title">Statistiques GitHub</h3>
          </div>
          <div class="github-empty">
            <i class="fas fa-info-circle"></i>
            <h3>Aucune donnée disponible</h3>
            <p>Les statistiques GitHub seront disponibles après la première exécution des scripts.</p>
          </div>
        </div>
      `;
    }
  }

  /**
   * Affiche les projets du portfolio
   */
  renderPortfolioProjects() {
    if (!this.portfolioData || !this.portfolioData.projects) {
      this.showPortfolioEmpty();
      return;
    }

    const projects = this.portfolioData.projects;
    const categories = this.portfolioData.categories || {};

    // Vérifier si le portfolio est vide
    if (projects.length === 0) {
      this.showPortfolioEmpty();
      return;
    }

    // Mettre à jour les filtres
    this.updateFilters(categories);

    // Afficher les projets
    this.renderProjects(projects);

    // Mettre à jour les compteurs
    this.updateCounters(projects);
  }

  /**
   * Affiche un message quand le portfolio est vide
   */
  showPortfolioEmpty() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = `
      <div class="portfolio-empty">
        <i class="fas fa-folder-open"></i>
        <h3>Portfolio en cours de construction</h3>
        <p>Les projets GitHub seront automatiquement ajoutés après la première exécution des scripts.</p>
        <div class="portfolio-actions">
          <a href="https://github.com/louno172" target="_blank" rel="noopener" class="btn btn-primary">
            <i class="fab fa-github"></i>
            Voir sur GitHub
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Met à jour les filtres de catégories
   */
  updateFilters(categories) {
    const filtersContainer = document.querySelector('.portfolio-filters');
    if (!filtersContainer) return;

    const allCount = this.portfolioData.projects.length;
    
    filtersContainer.innerHTML = `
      <button class="filter active" data-filter="all">
        <span>Tous</span>
        <span class="filter-count">${allCount}</span>
      </button>
      ${Object.entries(categories).map(([key, category]) => {
        const count = this.portfolioData.projects.filter(p => p.category === key).length;
        return `
          <button class="filter" data-filter="${key}">
            <i class="${category.icon}"></i>
            <span>${key}</span>
            <span class="filter-count">${count}</span>
          </button>
        `;
      }).join('')}
    `;

    // Attacher les événements de filtrage
    this.attachFilterEvents();
  }

  /**
   * Attache les événements de filtrage
   */
  attachFilterEvents() {
    const filters = document.querySelectorAll('.filter');
    const projects = document.querySelectorAll('.portfolio-item');

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        // Mettre à jour l'état actif
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        // Filtrer les projets
        const category = filter.getAttribute('data-filter');
        projects.forEach(project => {
          if (category === 'all' || project.getAttribute('data-category') === category) {
            project.style.display = 'block';
            project.style.animation = 'fadeInUp 0.6s ease-out';
          } else {
            project.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * Affiche les projets
   */
  renderProjects(projects) {
    const projectsContainer = document.querySelector('.portfolio-grid');
    if (!projectsContainer) return;

    projectsContainer.innerHTML = projects.map(project => `
      <div class="portfolio-item" data-category="${project.category}">
        <div class="portfolio-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
          <div class="portfolio-overlay">
            <i class="fas fa-external-link-alt"></i>
          </div>
        </div>
        <div class="portfolio-info">
          <h3 class="portfolio-title">${project.title}</h3>
          <p class="portfolio-description">${project.description}</p>
          <div class="portfolio-meta">
            <span><i class="fas fa-star"></i> ${project.stars || 0}</span>
            <span><i class="fas fa-code-branch"></i> ${project.forks || 0}</span>
            <span><i class="fas fa-calendar"></i> ${project.year || new Date().getFullYear()}</span>
          </div>
          <div class="portfolio-technologies">
            ${project.technologies.map(tech => `
              <span class="technology-tag">${tech}</span>
            `).join('')}
          </div>
          <div class="portfolio-category">${project.category}</div>
          <div class="portfolio-actions">
            ${project.github ? `
              <a href="${project.github}" target="_blank" rel="noopener" class="portfolio-action">
                <i class="fab fa-github"></i>
                <span>Code</span>
              </a>
            ` : ''}
            ${project.demo ? `
              <a href="${project.demo}" target="_blank" rel="noopener" class="portfolio-action">
                <i class="fas fa-external-link-alt"></i>
                <span>Demo</span>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Met à jour les compteurs de filtres
   */
  updateCounters(projects) {
    const counters = document.querySelectorAll('.filter-count');
    const categoryCounts = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {});

    counters.forEach(counter => {
      const filter = counter.closest('.filter');
      const category = filter.getAttribute('data-filter');
      if (category !== 'all') {
        counter.textContent = categoryCounts[category] || 0;
      }
    });
  }

  /**
   * Affiche l'état de chargement
   */
  showLoading() {
    const containers = document.querySelectorAll('#github-stats, .portfolio-grid');
    containers.forEach(container => {
      container.innerHTML = `
        <div class="github-loading">
          <div class="github-loading-spinner"></div>
        </div>
      `;
    });
  }

  /**
   * Cache l'état de chargement
   */
  hideLoading() {
    const loadingElements = document.querySelectorAll('.github-loading');
    loadingElements.forEach(element => element.remove());
  }

  /**
   * Affiche une erreur
   */
  showError(message) {
    const containers = document.querySelectorAll('#github-stats, .portfolio-grid');
    containers.forEach(container => {
      container.innerHTML = `
        <div class="github-empty">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Erreur de chargement</h3>
          <p>${message}</p>
        </div>
      `;
    });
  }

  /**
   * Rafraîchit les données
   */
  async refresh() {
    this.cache.clear();
    await this.init();
  }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
  const githubIntegration = new GitHubIntegration();
  githubIntegration.init();

  // Exposer globalement pour les tests
  window.githubIntegration = githubIntegration;
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubIntegration;
}
