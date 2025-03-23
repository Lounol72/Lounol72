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
