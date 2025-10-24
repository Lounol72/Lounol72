/**
 * Portfolio Management System
 * Gère l'affichage et le filtrage des projets depuis le fichier JSON
 */

// Variables globales
let portfolioData = null;
let currentFilter = 'all';

// Initialisation du portfolio au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioData();
});

/**
 * Charge les données du portfolio depuis le fichier JSON
 */
async function loadPortfolioData() {
    try {
        // Afficher l'état de chargement
        showLoadingState();
        
        // Charger les données depuis le fichier JSON
        const response = await fetch('data/portfolio.json');
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        portfolioData = await response.json();
        
        // Initialiser l'affichage
        initializePortfolio();
        
    } catch (error) {
        console.error('Erreur lors du chargement du portfolio:', error);
        showErrorState('Impossible de charger les projets. Veuillez réessayer plus tard.');
    }
}

/**
 * Initialise l'affichage du portfolio
 */
function initializePortfolio() {
    if (!portfolioData || !portfolioData.projects) {
        showErrorState('Aucun projet trouvé.');
        return;
    }
    
    // Mettre à jour les compteurs de filtres
    updateFilterCounts();
    
    // Afficher tous les projets
    displayProjects(portfolioData.projects);
    
    // Initialiser les événements de filtrage
    initializeFilters();
    
    // Masquer l'état de chargement
    hideLoadingState();
}

/**
 * Met à jour les compteurs dans les filtres
 */
function updateFilterCounts() {
    const projects = portfolioData.projects;
    const counts = {
        'all': projects.length,
        'Université': projects.filter(p => p.category === 'Université').length,
        'Personnel': projects.filter(p => p.category === 'Personnel').length,
        'GameJam': projects.filter(p => p.category === 'GameJam').length
    };
    
    // Mettre à jour les compteurs dans l'interface
    Object.keys(counts).forEach(category => {
        const countElement = document.getElementById(`count-${category.toLowerCase()}`);
        if (countElement) {
            countElement.textContent = counts[category];
        }
    });
}

/**
 * Affiche les projets dans la grille
 */
function displayProjects(projects) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    if (!projects || projects.length === 0) {
        portfolioGrid.innerHTML = '<div class="no-projects">Aucun projet trouvé</div>';
        return;
    }
    
    // Générer le HTML pour chaque projet
    const projectsHTML = projects.map(project => generateProjectCard(project)).join('');
    
    // Afficher les projets
    portfolioGrid.innerHTML = projectsHTML;
    
    // Appliquer les animations
    animateProjectCards();
}

/**
 * Génère le HTML d'une carte de projet
 */
function generateProjectCard(project) {
    const categoryInfo = portfolioData.categories[project.category];
    const categoryIcon = categoryInfo ? categoryInfo.icon : 'fas fa-folder';
    const categoryColor = categoryInfo ? categoryInfo.color : '#666';
    
    // Formater la date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };
    
    // Générer les badges de technologies
    const techBadges = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    // Générer le badge de catégorie
    const categoryBadge = `
        <div class="category-badge" style="background-color: ${categoryColor}20; color: ${categoryColor};">
            <i class="${categoryIcon}"></i>
            ${project.category}
        </div>
    `;
    
    // Générer les liens d'action
    const actionButtons = `
        <div class="portfolio-actions">
            <a href="${project.github}" target="_blank" class="btn btn--primary" rel="noopener">
                <i class="fab fa-github"></i> Code
            </a>
            ${project.demo ? `
                <a href="${project.demo}" target="_blank" class="btn btn--secondary" rel="noopener">
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
                    <div class="portfolio-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        
                        <div class="portfolio-meta">
                            <span><i class="fas fa-star"></i> ${project.stars}</span>
                            <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                            <span><i class="fas fa-calendar"></i> ${formatDate(project.lastUpdated)}</span>
                        </div>
                        
                        <div class="portfolio-technologies">
                            ${techBadges}
                        </div>
                        
                        ${categoryBadge}
                    </div>
                    
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialise les événements de filtrage
 */
function initializeFilters() {
    const filters = document.querySelectorAll('.filter');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Mettre à jour la classe active
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Récupérer la catégorie sélectionnée
            const category = this.getAttribute('data-filter');
            currentFilter = category;
            
            // Filtrer les projets
            filterProjects(category);
        });
    });
}

/**
 * Filtre les projets selon la catégorie
 */
function filterProjects(category) {
    const projects = portfolioData.projects;
    let filteredProjects;
    
    if (category === 'all') {
        filteredProjects = projects;
    } else {
        filteredProjects = projects.filter(project => project.category === category);
    }
    
    // Afficher les projets filtrés
    displayProjects(filteredProjects);
}

/**
 * Anime les cartes de projet lors de leur apparition
 */
function animateProjectCards() {
    const cards = document.querySelectorAll('.portfolio-item');
    
    cards.forEach((card, index) => {
        // État initial
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Animation avec délai
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Affiche l'état de chargement
 */
function showLoadingState() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    portfolioGrid.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Chargement des projets...</p>
        </div>
    `;
}

/**
 * Masque l'état de chargement
 */
function hideLoadingState() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

/**
 * Affiche un message d'erreur
 */
function showErrorState(message) {
    const portfolioGrid = document.getElementById('portfolio-grid');
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

/**
 * Fonction utilitaire pour obtenir les statistiques du portfolio
 */
function getPortfolioStats() {
    if (!portfolioData) return null;
    
    return {
        totalProjects: portfolioData.stats.totalProjects,
        byCategory: portfolioData.stats.byCategory,
        totalStars: portfolioData.stats.totalStars,
        totalForks: portfolioData.stats.totalForks,
        lastUpdated: portfolioData.stats.lastUpdated
    };
}

/**
 * Fonction pour rechercher des projets par nom ou technologie
 */
function searchProjects(query) {
    if (!portfolioData || !query) return portfolioData.projects;
    
    const searchTerm = query.toLowerCase();
    
    return portfolioData.projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
    );
}

// Exposer les fonctions utiles globalement
window.portfolioUtils = {
    getStats: getPortfolioStats,
    search: searchProjects,
    reload: loadPortfolioData
};