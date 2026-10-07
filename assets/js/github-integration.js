/**
 * GitHub Integration - Affiche uniquement les statistiques GitHub
 * Les projets du portfolio sont gérés par portfolio.ts
 */
class GitHubIntegration {
    githubData = null;
    async init() {
        await this.loadData();
        this.renderGitHubStats();
    }
    async loadData() {
        try {
            const githubResponse = await fetch('data/github.json');
            if (githubResponse.ok) {
                this.githubData = (await githubResponse.json());
            }
        }
        catch {
            console.log('ℹ️ Fichier github.json non disponible');
        }
    }
    // Sans données, le conteneur reste vide et masqué par le CSS (.gh-stats:empty)
    renderGitHubStats() {
        const statsContainer = document.getElementById('github-stats');
        const stats = this.githubData?.stats;
        if (!statsContainer || !stats)
            return;
        const items = [
            ['dépôts', stats.r],
            ['étoiles', stats.s],
            ['followers', stats.f],
        ];
        statsContainer.innerHTML = items
            .map(([label, value]) => `
        <div class="gh-stat">
          <dt>${label}</dt>
          <dd>${Number(value ?? 0)}</dd>
        </div>
      `)
            .join('');
    }
    async refresh() {
        await this.init();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const githubIntegration = new GitHubIntegration();
    githubIntegration.init();
    window.githubIntegration = githubIntegration;
});
export {};
