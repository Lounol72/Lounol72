/**
 * GitHub Integration - Affiche uniquement les statistiques GitHub
 * Les projets du portfolio sont gérés par portfolio.ts
 */

import type { GitHubData } from '../types/portfolio';

class GitHubIntegration {
  private githubData: GitHubData | null = null;

  async init(): Promise<void> {
    try {
      this.showLoading();
      await this.loadData();
      this.renderGitHubStats();
      this.hideLoading();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation GitHub:', error);
      this.showError('Impossible de charger les données GitHub');
    }
  }

  private async loadData(): Promise<void> {
    try {
      const githubResponse = await fetch('data/github.json');
      if (githubResponse.ok) {
        this.githubData = (await githubResponse.json()) as GitHubData;
      }
    } catch {
      console.log('ℹ️ Fichier github.json non disponible');
    }
  }

  private renderGitHubStats(): void {
    const statsContainer = document.getElementById('github-stats');
    if (!statsContainer) return;

    if (this.githubData?.stats) {
      const stats = this.githubData.stats;
      statsContainer.innerHTML = `
        <div class="github-stats-container">
          <div class="github-stats-header">
            <i class="fab fa-github github-stats-icon"></i>
            <h3 class="github-stats-title">Statistiques GitHub</h3>
          </div>
          <div class="github-stats-grid">
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.r ?? 0}</span>
              <span class="github-stat-label">Repositories</span>
            </div>
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.s ?? 0}</span>
              <span class="github-stat-label">Étoiles</span>
            </div>
            <div class="github-stat-card">
              <span class="github-stat-number">${stats.f ?? 0}</span>
              <span class="github-stat-label">Followers</span>
            </div>
          </div>
        </div>
      `;
    } else {
      statsContainer.innerHTML = `
        <div class="github-stats-container">
          <div class="github-stats-header">
            <i class="fab fa-github github-stats-icon"></i>
            <h3 class="github-stats-title">Statistiques GitHub</h3>
          </div>
          <div class="github-empty">
            <i class="fas fa-info-circle"></i>
            <h3>Aucune donnée disponible</h3>
            <p>Les statistiques GitHub seront disponibles après la première exécution de <code>npm run update-portfolio</code>.</p>
            <a href="https://github.com/Lounol72" target="_blank" rel="noopener" class="btn btn-primary">
              <i class="fab fa-github"></i> Voir sur GitHub
            </a>
          </div>
        </div>
      `;
    }
  }

  private showLoading(): void {
    const statsContainer = document.getElementById('github-stats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="github-loading">
          <div class="github-loading-spinner"></div>
        </div>
      `;
    }
  }

  private hideLoading(): void {
    const statsContainer = document.getElementById('github-stats');
    const loadingElement = statsContainer?.querySelector('.github-loading');
    if (loadingElement) loadingElement.remove();
  }

  private showError(message: string): void {
    const statsContainer = document.getElementById('github-stats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="github-empty">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Erreur de chargement</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }

  async refresh(): Promise<void> {
    await this.init();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const githubIntegration = new GitHubIntegration();
  githubIntegration.init();
  (window as Window & { githubIntegration?: GitHubIntegration }).githubIntegration = githubIntegration;
});
