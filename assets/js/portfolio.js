/**
 * Portfolio Management System
 * Gère l'affichage et le filtrage des projets depuis le fichier JSON
 */
let portfolioData = null;
let currentFilter = 'all';
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
});
async function loadPortfolioData() {
    try {
        showLoadingState();
        const response = await fetch('data/portfolio.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        portfolioData = (await response.json());
        initializePortfolio();
    }
    catch (error) {
        console.error('Erreur lors du chargement du portfolio:', error);
        showErrorState('Impossible de charger les projets. Veuillez réessayer plus tard.');
    }
}
function initializePortfolio() {
    if (!portfolioData?.projects) {
        showErrorState('Aucun projet trouvé.');
        return;
    }
    updateFilterCounts();
    displayProjects(portfolioData.projects);
    initializeFilters();
    hideLoadingState();
}
function updateFilterCounts() {
    if (!portfolioData)
        return;
    const projects = portfolioData.projects;
    const counts = {
        'all': projects.length,
        'Université': projects.filter((p) => p.category === 'Université').length,
        'Personnel': projects.filter((p) => p.category === 'Personnel').length,
        'GameJam': projects.filter((p) => p.category === 'GameJam').length,
    };
    const categoryIds = {
        all: 'count-all',
        Université: 'count-universite',
        Personnel: 'count-personnel',
        GameJam: 'count-gamejam',
    };
    Object.keys(counts).forEach((category) => {
        const id = categoryIds[category];
        const countElement = id ? document.getElementById(id) : null;
        if (countElement)
            countElement.textContent = String(counts[category]);
    });
}
function displayProjects(projects) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid)
        return;
    if (!projects || projects.length === 0) {
        portfolioGrid.innerHTML = '<div class="no-projects">Aucun projet trouvé</div>';
        return;
    }
    portfolioGrid.innerHTML = projects.map((project, index) => generateProjectCard(project, index)).join('');
    animateProjectCards();
}
const LANG_COLORS = {
    'TypeScript': '#3178C6',
    'JavaScript': '#F7DF1E',
    'Java': '#ED8B00',
    'C': '#A8B9CC',
    'C++': '#00599C',
    'C#': '#239120',
    'Python': '#3776AB',
    'CSS': '#1572B6',
    'HTML': '#E34F26',
    'Rust': '#CE422B',
    'Go': '#00ADD8',
    'Ruby': '#CC342D',
    'PHP': '#777BB4',
    'Swift': '#FA7343',
    'Kotlin': '#7F52FF',
};
function getCategoryClass(category) {
    const map = {
        'Université': 'category--universite',
        'Personnel': 'category--personnel',
        'GameJam': 'category--gamejam',
    };
    return map[category] ?? 'category--personnel';
}
function generateProjectCard(project, index) {
    const categoryInfo = portfolioData?.categories?.[project.category];
    const categoryIcon = categoryInfo?.icon ?? 'fas fa-folder';
    const categoryClass = getCategoryClass(project.category);
    const langColor = LANG_COLORS[project.language] ?? '#cba6f7';
    const indexNum = String((index ?? 0) + 1).padStart(2, '0');
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };
    return `
    <div class="portfolio-item" data-category="${project.category}" data-id="${project.id}" style="--lang-color: ${langColor}">
      <div class="portfolio-card-accent"></div>
      <div class="portfolio-card-content">
        <div class="portfolio-card-top">
          <div class="portfolio-lang-indicator">
            <span class="lang-dot"></span>
            <span>${project.language ?? 'Code'}</span>
          </div>
          <span class="portfolio-category ${categoryClass}">
            <i class="${categoryIcon}" aria-hidden="true"></i> ${project.category}
          </span>
        </div>
        <div class="portfolio-card-body">
          <div class="portfolio-index-num">${indexNum}</div>
          <h3 class="portfolio-title">${project.title}</h3>
          <p class="portfolio-description-text">${project.description}</p>
        </div>
        <div class="portfolio-card-footer">
          <div class="portfolio-meta">
            <span><i class="fas fa-star" aria-hidden="true"></i> ${project.stars}</span>
            <span><i class="fas fa-code-branch" aria-hidden="true"></i> ${project.forks}</span>
            <span><i class="fas fa-clock" aria-hidden="true"></i> ${formatDate(project.lastUpdated)}</span>
          </div>
          <div class="portfolio-actions">
            <a href="${project.github}" target="_blank" class="portfolio-action" rel="noopener noreferrer" aria-label="Voir le code de ${project.title} sur GitHub">
              <i class="fab fa-github" aria-hidden="true"></i> Code
            </a>
            ${project.demo ? `
            <a href="${project.demo}" target="_blank" class="portfolio-action portfolio-action--demo" rel="noopener noreferrer" aria-label="Voir la démo de ${project.title}">
              <i class="fas fa-external-link-alt" aria-hidden="true"></i> Démo
            </a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}
function initializeFilters() {
    const filters = document.querySelectorAll('.filter');
    filters.forEach((filter) => {
        filter.addEventListener('click', function () {
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
function filterProjects(category) {
    if (!portfolioData)
        return;
    const filteredProjects = category === 'all'
        ? portfolioData.projects
        : portfolioData.projects.filter((project) => project.category === category);
    displayProjects(filteredProjects);
}
function animateProjectCards() {
    const cards = document.querySelectorAll('.portfolio-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });
}
function showLoadingState() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid)
        return;
    const skeletonCards = Array.from({ length: 6 }, () => `<div class="skeleton-card"></div>`).join('');
    portfolioGrid.innerHTML = `<div class="skeleton-grid">${skeletonCards}</div>`;
}
function hideLoadingState() {
    const skeletonGrid = document.querySelector('.skeleton-grid');
    if (skeletonGrid)
        skeletonGrid.remove();
}
function showErrorState(message) {
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
function getPortfolioStats() {
    return portfolioData?.stats ?? null;
}
function searchProjects(query) {
    if (!portfolioData)
        return [];
    if (!query)
        return portfolioData.projects;
    const searchTerm = query.toLowerCase();
    return portfolioData.projects.filter((project) => project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm)));
}
window.loadPortfolioData = loadPortfolioData;
window.portfolioUtils = {
    getStats: getPortfolioStats,
    search: searchProjects,
    reload: loadPortfolioData,
};
export {};
