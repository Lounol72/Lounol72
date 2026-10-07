/**
 * GitHub Integration - Affiche uniquement les statistiques GitHub
 * Les projets du portfolio sont gérés par portfolio.ts
 */

import type { GitHubData } from '../types/portfolio';

class GitHubIntegration {
  private githubData: GitHubData | null = null;

  async init(): Promise<void> {
    await this.loadData();
    this.renderGitHubStats();
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

  // Sans données, le conteneur reste vide et masqué par le CSS (.gh-stats:empty)
  private renderGitHubStats(): void {
    const statsContainer = document.getElementById('github-stats');
    const stats = this.githubData?.stats;
    if (!statsContainer || !stats) return;

    const items: Array<[string, number | undefined]> = [
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

  async refresh(): Promise<void> {
    await this.init();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const githubIntegration = new GitHubIntegration();
  githubIntegration.init();
  window.githubIntegration = githubIntegration;
});
