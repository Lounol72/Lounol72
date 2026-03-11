/**
 * Portfolio Management System
 * Gère l'affichage et le filtrage des projets depuis le fichier JSON
 */

import type { PortfolioData, Project } from '../types/portfolio';

let portfolioData: PortfolioData | null = null;
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  loadPortfolioData();
});

async function loadPortfolioData(): Promise<void> {
  try {
    showLoadingState();
    const response = await fetch('data/portfolio.json');

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    portfolioData = (await response.json()) as PortfolioData;
    initializePortfolio();
  } catch (error) {
    console.error('Erreur lors du chargement du portfolio:', error);
    showErrorState('Impossible de charger les projets. Veuillez réessayer plus tard.');
  }
}

function initializePortfolio(): void {
  if (!portfolioData?.projects) {
    showErrorState('Aucun projet trouvé.');
    return;
  }

  updateFilterCounts();
  displayProjects(portfolioData.projects);
  initializeFilters();
  hideLoadingState();
}

function updateFilterCounts(): void {
  if (!portfolioData) return;

  const projects = portfolioData.projects;
  const counts: Record<string, number> = {
    'all': projects.length,
    'Université': projects.filter((p) => p.category === 'Université').length,
    'Personnel': projects.filter((p) => p.category === 'Personnel').length,
    'GameJam': projects.filter((p) => p.category === 'GameJam').length,
  };

  const categoryIds: Record<string, string> = {
    all: 'count-all',
    Université: 'count-universite',
    Personnel: 'count-personnel',
    GameJam: 'count-gamejam',
  };

  Object.keys(counts).forEach((category) => {
    const id = categoryIds[category];
    const countElement = id ? document.getElementById(id) : null;
    if (countElement) countElement.textContent = String(counts[category]);
  });
}

function displayProjects(projects: Project[]): void {
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (!portfolioGrid) return;

  if (!projects || projects.length === 0) {
    portfolioGrid.innerHTML = '<div class="no-projects">Aucun projet trouvé</div>';
    return;
  }

  portfolioGrid.innerHTML = projects.map((project) => generateProjectCard(project)).join('');
  animateProjectCards();
}

function getCategoryClass(category: string): string {
  const map: Record<string, string> = {
    'Université': 'category--universite',
    'Personnel': 'category--personnel',
    'GameJam': 'category--gamejam',
  };
  return map[category] ?? 'category--personnel';
}

function generateProjectCard(project: Project): string {
  const categoryInfo = portfolioData?.categories?.[project.category];
  const categoryIcon = categoryInfo?.icon ?? 'fas fa-folder';
  const categoryClass = getCategoryClass(project.category);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const techBadges = project.technologies
    .map((tech) => `<span class="tech-tag">${tech}</span>`)
    .join('');

  const categoryBadge = `
    <span class="portfolio-category ${categoryClass}">
      <i class="${categoryIcon}"></i> ${project.category}
    </span>
  `;

  const languageBadge = project.language
    ? `<span class="language-badge"><i class="fas fa-code"></i> ${project.language}</span>`
    : '';

  const actionButtons = `
    <div class="portfolio-actions">
      <a href="${project.github}" target="_blank" class="portfolio-action" rel="noopener">
        <i class="fab fa-github"></i> Code
      </a>
      ${project.demo ? `
        <a href="${project.demo}" target="_blank" class="portfolio-action" rel="noopener">
          <i class="fas fa-external-link-alt"></i> Démo
        </a>
      ` : ''}
    </div>
  `;

  return `
    <div class="portfolio-item" data-category="${project.category}" data-id="${project.id}">
      <div class="portfolio-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy"
             onerror="this.src='assets/images/placeholder-project.jpg'">
        <div class="portfolio-overlay">
          <a href="${project.github}" target="_blank" rel="noopener" class="portfolio-overlay-link" aria-label="Voir le code de ${project.title}">
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
      <div class="portfolio-info">
        ${categoryBadge}
        <h3 class="portfolio-title">${project.title}</h3>
        <p class="portfolio-description-text">${project.description}</p>
        <div class="portfolio-meta">
          <span><i class="fas fa-star"></i> ${project.stars}</span>
          <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
          <span><i class="fas fa-calendar"></i> ${formatDate(project.lastUpdated)}</span>
        </div>
        <div class="portfolio-technologies">
          ${techBadges}
          ${languageBadge}
        </div>
        ${actionButtons}
      </div>
    </div>
  `;
}

function initializeFilters(): void {
  const filters = document.querySelectorAll<HTMLButtonElement>('.filter');

  filters.forEach((filter) => {
    filter.addEventListener('click', function (this: HTMLButtonElement) {
      filters.forEach((f) => {
        f.classList.remove('active');
        f.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      const category = this.getAttribute('data-filter') ?? 'all';
      currentFilter = category;
      filterProjects(category);
    });
  });
}

function filterProjects(category: string): void {
  if (!portfolioData) return;

  const filteredProjects =
    category === 'all'
      ? portfolioData.projects
      : portfolioData.projects.filter((project) => project.category === category);

  displayProjects(filteredProjects);
}

function animateProjectCards(): void {
  const cards = document.querySelectorAll<HTMLElement>('.portfolio-item');

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

function showLoadingState(): void {
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (!portfolioGrid) return;

  const skeletonCards = Array.from({ length: 6 }, () => `
    <div class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-body">
        <div class="skeleton-line skeleton-line--badge"></div>
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--text"></div>
        <div class="skeleton-line skeleton-line--text-short"></div>
        <div class="skeleton-tags">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
      </div>
    </div>
  `).join('');

  portfolioGrid.innerHTML = `<div class="skeleton-grid">${skeletonCards}</div>`;
}

function hideLoadingState(): void {
  const skeletonGrid = document.querySelector('.skeleton-grid');
  if (skeletonGrid) skeletonGrid.remove();
}

function showErrorState(message: string): void {
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (portfolioGrid) {
    portfolioGrid.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button onclick="loadPortfolioData()" class="btn btn-primary">
          <i class="fas fa-refresh"></i> Réessayer
        </button>
      </div>
    `;
  }
}

function getPortfolioStats(): PortfolioData['stats'] | null {
  return portfolioData?.stats ?? null;
}

function searchProjects(query: string): Project[] {
  if (!portfolioData) return [];
  if (!query) return portfolioData.projects;

  const searchTerm = query.toLowerCase();
  return portfolioData.projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm))
  );
}

(window as Window & { loadPortfolioData?: () => Promise<void> }).loadPortfolioData = loadPortfolioData;

window.portfolioUtils = {
  getStats: getPortfolioStats,
  search: searchProjects,
  reload: loadPortfolioData,
};
