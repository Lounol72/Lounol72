/**
 * Types pour les données du portfolio et GitHub
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Université' | 'Personnel' | 'GameJam';
  image: string;
  technologies: string[];
  github: string;
  demo: string | null;
  stars: number;
  forks: number;
  lastUpdated: string;
  status: string;
  year: number;
  topics: string[];
  language: string;
  archived: boolean;
  fork: boolean;
}

export interface CategoryInfo {
  description: string;
  icon: string;
  color: string;
}

export interface PortfolioStats {
  totalProjects: number;
  byCategory: Record<string, number>;
  totalStars: number;
  totalForks: number;
  lastUpdated: string;
  userStats?: {
    totalRepos: number;
    totalStars: number;
    followers: number;
    following: number;
  };
}

export interface PortfolioData {
  projects: Project[];
  categories: Record<string, CategoryInfo>;
  stats: PortfolioStats;
  metadata?: Record<string, unknown>;
}

export interface GitHubStats {
  r?: number;
  s?: number;
  f?: number;
  t?: number;
  lastUpdate?: number;
}

export interface GitHubRepo {
  n: string;
  d: string;
  u: string;
  l: string;
  s: number;
  f: number;
  t: number;
  topics: string[];
}

export interface GitHubData {
  stats: GitHubStats;
  repos: GitHubRepo[];
  meta?: Record<string, unknown>;
}

declare class GitHubIntegration {
  init(): Promise<void>;
  refresh(): Promise<void>;
}

declare global {
  interface Window {
    portfolioUtils?: {
      getStats: () => PortfolioStats | null;
      search: (query: string) => Project[];
      reload: () => Promise<void>;
    };
    githubIntegration?: GitHubIntegration;
  }
}
