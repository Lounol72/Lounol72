document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 0) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Ajouter la prise en charge de la bascule du menu sur mobile
    const menuBurger = document.getElementById('menu-burger');
    const menu = document.getElementById('menu');
    
    if (menuBurger && menu) {
        menuBurger.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
    
    // Filtrage du portfolio
    const filters = document.querySelectorAll('.filter');
    const items = document.querySelectorAll('.portfolio-item');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Mettre à jour la classe active
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrer les éléments
            const category = this.getAttribute('data-filter');
            
            items.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Load GitHub stats from JSON files
    loadGitHubStats();
    
    // Load GitHub projects for portfolio
    loadGitHubProjects();
});

// GitHub Stats optimisé avec cache local
function loadGitHubStats() {
    // Vérifier le cache local d'abord
    const cacheKey = 'github_stats_cache';
    const cacheExpiry = 3600000; // 1 heure en millisecondes
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
        try {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();
            
            // Si le cache est encore valide, utiliser les données en cache
            if (now - timestamp < cacheExpiry) {
                renderGitHubStats(data);
                console.log('GitHub stats loaded from cache');
                return;
            }
        } catch (e) {
            console.warn('Invalid cache data, fetching fresh data');
        }
    }
    
    // Sinon, charger depuis le fichier JSON
    fetch('data/github.json')
        .then(response => response.json())
        .then(data => {
            // Sauvegarder dans le cache local
            localStorage.setItem(cacheKey, JSON.stringify({
                data,
                timestamp: new Date().getTime()
            }));
            
            // Afficher les données
            renderGitHubStats(data);
        })
        .catch(error => {
            console.error('Error loading GitHub stats:', error);
            document.getElementById('github-stats-container').innerHTML = 
                '<div class="error-message">Impossible de charger les statistiques GitHub</div>';
            document.getElementById('recent-repos').innerHTML = 
                '<div class="error-message">Impossible de charger les projets récents</div>';
        });
}

// Fonction pour afficher les données
function renderGitHubStats(data) {
    // Format date helper function
    function formatDate(timestamp) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(timestamp).toLocaleDateString('fr-FR', options);
    }
    
    // Mise à jour des stats
    const stats = data.stats;
    document.getElementById('repo-count').textContent = stats.r;
    document.getElementById('star-count').textContent = stats.s;
    document.getElementById('followers-count').textContent = stats.f;
    document.getElementById('last-updated-date').textContent = formatDate(stats.t);
    
    // Mise à jour des repos
    const repos = data.repos;
    let repoHTML = '';
    repos.forEach(repo => {
        repoHTML += `
        <div class="recent-repo">
            <h4><a href="${repo.u}" target="_blank">${repo.n}</a></h4>
            <p>${repo.d || 'Aucune description'}</p>
            <div class="repo-meta">
                <span><i class="fas fa-star"></i> ${repo.s}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.f}</span>
                <span>${repo.l || 'N/A'}</span>
                <span class="repo-date">Mis à jour: ${formatDate(repo.t)}</span>
            </div>
        </div>`;
    });
    
    document.getElementById('recent-repos').innerHTML = repoHTML;
}

// Chargement des projets GitHub pour le portfolio
function loadGitHubProjects() {
    // Vérifier le cache local d'abord
    const cacheKey = 'github_projects_cache';
    const cacheExpiry = 3600000; // 1 heure en millisecondes
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
        try {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();
            
            // Si le cache est encore valide, utiliser les données en cache
            if (now - timestamp < cacheExpiry) {
                renderGitHubProjects(data);
                console.log('GitHub projects loaded from cache');
                return;
            }
        } catch (e) {
            console.warn('Invalid cache data, fetching fresh data');
        }
    }
    
    // Sinon, charger depuis le fichier JSON
    fetch('data/github.json')
        .then(response => response.json())
        .then(data => {
            // Sauvegarder dans le cache local
            localStorage.setItem(cacheKey, JSON.stringify({
                data,
                timestamp: new Date().getTime()
            }));
            
            // Afficher les données
            renderGitHubProjects(data);
        })
        .catch(error => {
            console.error('Error loading GitHub projects:', error);
            document.getElementById('portfolio-grid').innerHTML = 
                '<div class="error-message">Impossible de charger les projets GitHub</div>';
        });
}

// Fonction pour afficher les projets GitHub
function renderGitHubProjects(data) {
    const repos = data.repos || [];
    
    if (repos.length === 0) {
        document.getElementById('portfolio-grid').innerHTML = 
            '<div class="no-projects">Aucun projet GitHub trouvé</div>';
        return;
    }
    
    // Transformer les repos en projets avec catégories
    const projects = repos.map(repo => {
        const category = getCategoryFromTopics(repo.topics || [], repo.l, repo.d);
        const placeholderImage = getLanguagePlaceholder(repo.l);
        
        return {
            id: repo.n,
            title: repo.n,
            description: repo.d || 'Aucune description disponible',
            category: category,
            image: placeholderImage,
            technologies: [repo.l].filter(Boolean),
            github: repo.u,
            demo: null,
            stars: repo.s || 0,
            forks: repo.f || 0,
            lastUpdated: repo.t
        };
    });
    
    // Générer les statistiques par catégorie
    const stats = getCategoryStats(projects);
    
    // Mettre à jour les filtres
    const filtersContainer = document.querySelector('.portfolio-filters');
    if (filtersContainer) {
        filtersContainer.innerHTML = generateCategoryFilters(stats);
        
        // Réattacher les événements de filtrage
        attachFilterEvents();
    }
    
    // Générer le HTML des projets
    let projectsHTML = '';
    projects.forEach(project => {
        projectsHTML += generateProjectCard(project);
    });
    
    // Afficher les projets
    document.getElementById('portfolio-grid').innerHTML = projectsHTML;
    
    // Appliquer les animations d'apparition
    animateProjectCards();
}

// Génère le HTML d'une carte de projet
function generateProjectCard(project) {
    const formatDate = (timestamp) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(timestamp).toLocaleDateString('fr-FR', options);
    };
    
    const categoryBadge = generateCategoryBadge(project.category);
    const technologies = project.technologies.map(tech => 
        `<span class="skill-tag">${tech}</span>`
    ).join('');
    
    return `
        <div class="portfolio-item" data-category="${project.category}">
            <div class="portfolio-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
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
                            ${technologies}
                        </div>
                        ${categoryBadge}
                    </div>
                    <div class="portfolio-actions">
                        <a href="${project.github}" target="_blank" class="btn btn--primary">
                            <i class="fab fa-github"></i> Voir le code
                        </a>
                        ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn--secondary">Démo</a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Réattache les événements de filtrage
function attachFilterEvents() {
    const filters = document.querySelectorAll('.filter');
    const items = document.querySelectorAll('.portfolio-item');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Mettre à jour la classe active
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrer les éléments
            const category = this.getAttribute('data-filter');
            
            items.forEach((item, index) => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // Animation d'apparition avec délai
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                }
            });
        });
    });
}

// Anime les cartes de projet
function animateProjectCards() {
    const cards = document.querySelectorAll('.portfolio-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}
