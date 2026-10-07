/**
 * Portfolio Management System
 * Gère l'affichage et le filtrage des projets depuis le fichier JSON
 */
let portfolioData = null;
// Couleurs des langages, ajustées à la palette Catppuccin Mocha
const LANGUAGE_COLORS = {
    'C': '#a6adc8',
    'C++': '#f38ba8',
    'C#': '#a6e3a1',
    'Java': '#fab387',
    'JavaScript': '#f9e2af',
    'TypeScript': '#89b4fa',
    'Python': '#74c7ec',
    'Haskell': '#cba6f7',
    'HTML': '#eba0ac',
    'CSS': '#b4befe',
    'Rust': '#fab387',
    'Lua': '#89b4fa',
    'GLSL': '#94e2d5',
};
const CATEGORY_CLASSES = {
    'Université': 'category--universite',
    'Personnel': 'category--personnel',
    'GameJam': 'category--gamejam',
};
const FILTER_COUNT_IDS = {
    all: 'count-all',
    Université: 'count-universite',
    Personnel: 'count-personnel',
    GameJam: 'count-gamejam',
};
const MISSING_DESCRIPTION = 'Aucune description disponible';
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
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
        if (!portfolioData?.projects?.length) {
            showMessageState('fa-folder-open', 'Aucun projet à afficher pour le moment.');
            return;
        }
        updateFilterCounts();
        displayProjects(getActiveFilter());
    }
    catch (error) {
        console.error('Erreur lors du chargement du portfolio:', error);
        showMessageState('fa-triangle-exclamation', 'Impossible de charger les projets. Veuillez réessayer plus tard.', true);
    }
}
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function updateFilterCounts() {
    if (!portfolioData)
        return;
    const projects = portfolioData.projects;
    Object.entries(FILTER_COUNT_IDS).forEach(([category, id]) => {
        const count = category === 'all' ? projects.length : projects.filter((p) => p.category === category).length;
        const countElement = document.getElementById(id);
        if (!countElement)
            return;
        countElement.textContent = String(count);
        // Une catégorie vide n'a pas besoin de filtre
        const button = countElement.closest('.filter');
        if (button && category !== 'all')
            button.hidden = count === 0;
    });
}
function getActiveFilter() {
    return document.querySelector('.filter.active')?.dataset.filter ?? 'all';
}
function displayProjects(category) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid || !portfolioData)
        return;
    const projects = category === 'all'
        ? portfolioData.projects
        : portfolioData.projects.filter((project) => project.category === category);
    if (projects.length === 0) {
        showMessageState('fa-folder-open', 'Aucun projet dans cette catégorie.');
        return;
    }
    portfolioGrid.innerHTML = projects.map((project, index) => generateProjectCard(project, index)).join('');
}
function formatMonth(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime()))
        return '';
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}
function generateProjectCard(project, index) {
    const categoryInfo = portfolioData?.categories?.[project.category];
    const categoryIcon = categoryInfo?.icon ?? 'fas fa-folder';
    const categoryClass = CATEGORY_CLASSES[project.category] ?? 'category--personnel';
    const language = project.language && project.language !== 'Other' ? project.language : '';
    const langColor = LANGUAGE_COLORS[language];
    const style = `--i: ${index};${langColor ? ` --lang: ${langColor};` : ''}`;
    const hasDescription = project.description && project.description !== MISSING_DESCRIPTION;
    const description = hasDescription
        ? escapeHtml(project.description)
        : 'Pas encore de description.';
    // Les topics GitHub servent de tags (sans répéter le langage)
    const tags = (project.topics ?? [])
        .filter((topic) => topic.toLowerCase() !== language.toLowerCase())
        .slice(0, 4)
        .map((topic) => `<li>${escapeHtml(topic)}</li>`)
        .join('');
    const updated = formatMonth(project.lastUpdated);
    const stars = project.stars > 0
        ? `<span title="Étoiles sur GitHub"><i class="fas fa-star" aria-hidden="true"></i>${project.stars}</span>`
        : '';
    const demoLink = project.demo
        ? `<a href="${escapeHtml(project.demo)}" target="_blank" rel="noopener noreferrer" class="project-demo">Démo</a>`
        : '';
    return `
    <article class="project-card" data-category="${escapeHtml(project.category)}" style="${style}">
      <div class="project-top">
        <span class="project-lang">${escapeHtml(language || 'Code')}</span>
        <span class="project-cat ${categoryClass}">
          <i class="${escapeHtml(categoryIcon)}" aria-hidden="true"></i> ${escapeHtml(project.category)}
        </span>
      </div>
      <h3 class="project-title">
        <a href="${escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.title)}</a>
      </h3>
      <p class="project-desc${hasDescription ? '' : ' project-desc--empty'}">${description}</p>
      ${tags ? `<ul class="project-tags" aria-label="Thèmes">${tags}</ul>` : ''}
      <div class="project-foot">
        <span class="project-meta">
          ${stars}
          ${updated ? `<span>maj. ${updated}</span>` : ''}
        </span>
        <span class="project-links">
          ${demoLink}
          <span class="project-cta" aria-hidden="true">Code <i class="fas fa-arrow-up-right-from-square"></i></span>
        </span>
      </div>
    </article>
  `;
}
function initializeFilters() {
    const filters = document.querySelectorAll('.filter');
    filters.forEach((filter) => {
        filter.addEventListener('click', () => {
            filters.forEach((f) => {
                f.classList.toggle('active', f === filter);
                f.setAttribute('aria-pressed', String(f === filter));
            });
            displayProjects(filter.dataset.filter ?? 'all');
        });
    });
}
function showLoadingState() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid)
        return;
    portfolioGrid.innerHTML = Array.from({ length: 3 }, () => `
    <div class="project-card" aria-hidden="true">
      <div class="skeleton skeleton--line skeleton--short"></div>
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--line"></div>
      <div class="skeleton skeleton--line skeleton--short"></div>
    </div>
  `).join('');
}
function showMessageState(icon, message, withRetry = false) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid)
        return;
    portfolioGrid.innerHTML = `
    <div class="portfolio-state">
      <i class="fas ${icon}" aria-hidden="true"></i>
      <p>${message}</p>
      ${withRetry ? '<button type="button" class="btn btn-secondary" data-retry><i class="fas fa-rotate-right" aria-hidden="true"></i> Réessayer</button>' : ''}
    </div>
  `;
    portfolioGrid.querySelector('[data-retry]')?.addEventListener('click', () => loadPortfolioData());
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
window.portfolioUtils = {
    getStats: getPortfolioStats,
    search: searchProjects,
    reload: loadPortfolioData,
};
export {};
