/**
 * Génère les cartes de statistiques du README de profil (profile/*.svg)
 * à partir de l'API GraphQL de GitHub, en remplacement de github-readme-stats.
 *
 * Token : PROFILE_CARDS_TOKEN (lecture des dépôts privés, pour les langages) ou GITHUB_TOKEN.
 * Confidentialité : seuls des totaux et des pourcentages sont publiés, jamais le nom d'un dépôt privé.
 */

const fs = require('fs');
const path = require('path');

const USERNAME = process.env.USERNAME || 'Lounol72';
const TOKEN = process.env.PROFILE_CARDS_TOKEN || process.env.GITHUB_TOKEN;
const OUTPUT_DIR = path.resolve(process.cwd(), 'profile');

// Langages ignorés dans la carte (fichiers générés ou annexes)
const EXCLUDED_LANGUAGES = ['Makefile', 'CMake', 'Dockerfile', 'Batchfile', 'Shell', 'PowerShell'];
// Dépôts ignorés pour les langages : leur volume vient de code tiers commité (bibliothèques, environnement virtuel)
const EXCLUDED_REPOSITORIES = ['Shooter2D'];
const MAX_LANGUAGES = 6;
// Couleurs GitHub trop sombres pour le fond de la carte
const LANGUAGE_COLOR_OVERRIDES = { C: '#9aa5ce' };

// Palette Tokyo Night, assortie aux badges du README
const THEME = {
  bg: '#1a1b27',
  border: '#414868',
  title: '#7aa2f7',
  text: '#a9b1d6',
  muted: '#565f89',
  value: '#c0caf5',
  icon: '#bb9af7',
  accent: '#9ece6a',
  fire: '#ff9e64',
};
const FONT = "'Segoe UI', Ubuntu, 'Helvetica Neue', Sans-Serif";

async function graphql(query, variables = {}) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Profile-Cards-Generator/1.0',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (!response.ok || json.errors) {
    throw new Error(`GraphQL ${response.status} : ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.data;
}

const escapeXml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const formatNumber = (n) => new Intl.NumberFormat('fr-FR').format(n);

const formatDate = (isoDay, withYear = true) =>
  new Date(`${isoDay}T00:00:00Z`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  });

// --- Collecte des données ---

const REPOSITORIES_QUERY = `repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
  nodes {
    name
    isPrivate
    stargazerCount
    languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
      edges { size node { name color } }
    }
  }
}`;

async function fetchProfile() {
  const data = await graphql(
    `query($login: String!) {
      user(login: $login) {
        createdAt
        pullRequests { totalCount }
        issues { totalCount }
        contributionsCollection {
          contributionYears
          totalCommitContributions
          restrictedContributionsCount
          totalRepositoriesWithContributedCommits
          contributionCalendar { totalContributions }
        }
        ${REPOSITORIES_QUERY}
      }
    }`,
    { login: USERNAME }
  );

  // Un token fine-grained ne voit les dépôts privés qu'à travers `viewer` (le propriétaire du token)
  try {
    const { viewer } = await graphql(`query { viewer { login ${REPOSITORIES_QUERY} } }`);
    const privateCount = viewer.repositories.nodes.filter((r) => r.isPrivate).length;
    console.log(`🔑 Token de ${viewer.login} : ${viewer.repositories.nodes.length} dépôts visibles, dont ${privateCount} privés`);
    if (viewer.login.toLowerCase() === USERNAME.toLowerCase()) {
      data.user.repositories = viewer.repositories;
    }
  } catch (error) {
    // Token du workflow (pas un utilisateur) : on garde les dépôts publics obtenus via `user`
    console.log(`🔑 Lecture via viewer impossible (${error.message.slice(0, 160)}) : dépôts publics uniquement`);
  }

  return data.user;
}

async function fetchCalendarDays(years) {
  const now = new Date();
  const days = new Map();

  for (const year of years) {
    const from = new Date(Date.UTC(year, 0, 1));
    const to = new Date(Math.min(Date.UTC(year, 11, 31, 23, 59, 59), now.getTime()));
    const data = await graphql(
      `query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar { weeks { contributionDays { date contributionCount } } }
          }
        }
      }`,
      { login: USERNAME, from: from.toISOString(), to: to.toISOString() }
    );
    for (const week of data.user.contributionsCollection.contributionCalendar.weeks) {
      for (const day of week.contributionDays) days.set(day.date, day.contributionCount);
    }
  }

  return [...days.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function computeStreaks(days) {
  const total = days.reduce((sum, [, count]) => sum + count, 0);

  let longest = { length: 0, start: null, end: null };
  let run = { length: 0, start: null };
  for (const [date, count] of days) {
    if (count > 0) {
      if (run.length === 0) run.start = date;
      run.length++;
      if (run.length > longest.length) longest = { length: run.length, start: run.start, end: date };
    } else {
      run = { length: 0, start: null };
    }
  }

  // Série actuelle : une journée en cours sans contribution ne casse pas encore la série
  let i = days.length - 1;
  if (i >= 0 && days[i][1] === 0) i--;
  let current = { length: 0, start: null, end: null };
  if (i >= 0 && days[i][1] > 0) {
    current.end = days[i][0];
    while (i >= 0 && days[i][1] > 0) {
      current.start = days[i][0];
      current.length++;
      i--;
    }
  }

  return { total, current, longest, since: days.find(([, c]) => c > 0)?.[0] ?? days[0]?.[0] };
}

function computeLanguages(repositories) {
  const totals = new Map();
  for (const repo of repositories) {
    if (EXCLUDED_REPOSITORIES.includes(repo.name)) continue;
    for (const { size, node } of repo.languages.edges) {
      if (EXCLUDED_LANGUAGES.includes(node.name)) continue;
      const color = LANGUAGE_COLOR_OVERRIDES[node.name] ?? node.color ?? THEME.muted;
      const entry = totals.get(node.name) ?? { name: node.name, color, size: 0 };
      entry.size += size;
      totals.set(node.name, entry);
    }
  }
  const sorted = [...totals.values()].sort((a, b) => b.size - a.size);
  const sum = sorted.reduce((s, l) => s + l.size, 0) || 1;
  const top = sorted.slice(0, MAX_LANGUAGES).map((l) => ({ ...l, percent: (l.size / sum) * 100 }));
  const others = sorted.slice(MAX_LANGUAGES).reduce((s, l) => s + l.size, 0);
  if (others > 0) top.push({ name: 'Autres', color: THEME.muted, percent: (others / sum) * 100 });
  return top;
}

// --- Rendu SVG ---

function card(width, height, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title">
  <title id="title">${escapeXml(title)}</title>
  <style>
    text { font-family: ${FONT}; }
    .title { font-size: 18px; font-weight: 600; fill: ${THEME.title}; }
    .label { font-size: 14px; fill: ${THEME.text}; }
    .value { font-size: 14px; font-weight: 700; fill: ${THEME.value}; }
    .muted { font-size: 12px; fill: ${THEME.muted}; }
    .big { font-size: 28px; font-weight: 700; fill: ${THEME.value}; }
  </style>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="6" fill="${THEME.bg}" stroke="${THEME.border}"/>
  <text x="25" y="35" class="title">${escapeXml(title)}</text>
${body}
</svg>
`;
}

// Icônes Octicons (MIT, © GitHub), en 16 px
const ICONS = {
  commit: 'M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z',
  lock: 'M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 1 0-5 0v2Z',
  pr: 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z',
  issue: 'M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z',
  star: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z',
  repo: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
};

function renderStats(profile, totalLastYear) {
  const c = profile.contributionsCollection;
  const stars = profile.repositories.nodes.filter((r) => !r.isPrivate).reduce((s, r) => s + r.stargazerCount, 0);
  const rows = [
    ['commit', 'Commits publics (12 mois)', c.totalCommitContributions],
    ['lock', 'Contributions privées (12 mois)', c.restrictedContributionsCount],
    ['pr', 'Pull requests', profile.pullRequests.totalCount],
    ['issue', 'Issues', profile.issues.totalCount],
    ['repo', 'Dépôts contribués (12 mois)', c.totalRepositoriesWithContributedCommits],
    ['star', 'Étoiles reçues', stars],
  ];

  const body = rows
    .map(([icon, label, value], i) => {
      const y = 62 + i * 22;
      return `  <g transform="translate(25, ${y})">
    <path transform="translate(0, -12)" fill="${THEME.icon}" d="${ICONS[icon]}"/>
    <text x="26" y="0" class="label">${escapeXml(label)}</text>
    <text x="300" y="0" class="value" text-anchor="end">${formatNumber(value)}</text>
  </g>`;
    })
    .join('\n');

  const ring = `  <g transform="translate(400, 108)">
    <circle r="50" fill="none" stroke="${THEME.title}" stroke-width="5"/>
    <text y="4" class="big" text-anchor="middle">${formatNumber(totalLastYear)}</text>
    <text y="24" class="muted" text-anchor="middle">contributions</text>
    <text y="76" class="muted" text-anchor="middle">sur 12 mois</text>
  </g>`;

  return card(495, 200, 'Statistiques GitHub', `${body}\n${ring}`);
}

function renderLanguages(languages) {
  const barX = 25;
  const barWidth = 445;
  let offset = 0;
  const segments = languages
    .map((l) => {
      const w = (l.percent / 100) * barWidth;
      const rect = `    <rect x="${(barX + offset).toFixed(2)}" y="55" width="${Math.max(w, 0).toFixed(2)}" height="8" fill="${l.color}"/>`;
      offset += w;
      return rect;
    })
    .join('\n');

  const legend = languages
    .map((l, i) => {
      const x = 25 + (i % 2) * 225;
      const y = 92 + Math.floor(i / 2) * 26;
      return `  <g transform="translate(${x}, ${y})">
    <circle cx="5" cy="-5" r="5" fill="${l.color}"/>
    <text x="18" y="0" class="label">${escapeXml(l.name)}</text>
    <text x="205" y="0" class="muted" text-anchor="end">${l.percent.toFixed(1).replace('.', ',')} %</text>
  </g>`;
    })
    .join('\n');

  const body = `  <clipPath id="bar"><rect x="${barX}" y="55" width="${barWidth}" height="8" rx="4"/></clipPath>
  <g clip-path="url(#bar)">
${segments}
  </g>
${legend}`;

  return card(495, 200, 'Langages les plus utilisés', body);
}

function renderStreak(streaks) {
  const range = (s) => (s.length ? `${formatDate(s.start, false)} – ${formatDate(s.end)}` : 'aucune série en cours');
  const column = (x, value, label, detail, color) => `  <g transform="translate(${x}, 0)">
    <text x="0" y="108" class="big" text-anchor="middle" fill="${color}" style="fill:${color}">${escapeXml(value)}</text>
    <text x="0" y="136" class="label" text-anchor="middle">${escapeXml(label)}</text>
    <text x="0" y="160" class="muted" text-anchor="middle">${escapeXml(detail)}</text>
  </g>`;

  const body = [
    column(82, formatNumber(streaks.total), 'Contributions', `depuis ${formatDate(streaks.since)}`, THEME.value),
    `  <line x1="165" y1="70" x2="165" y2="170" stroke="${THEME.border}"/>`,
    column(247, `${streaks.current.length} j`, 'Série actuelle', range(streaks.current), THEME.fire),
    `  <line x1="330" y1="70" x2="330" y2="170" stroke="${THEME.border}"/>`,
    column(412, `${streaks.longest.length} j`, 'Plus longue série', range(streaks.longest), THEME.accent),
  ].join('\n');

  return card(495, 200, 'Régularité', body);
}

async function main() {
  if (!TOKEN) throw new Error('Aucun token : définir PROFILE_CARDS_TOKEN ou GITHUB_TOKEN');

  const profile = await fetchProfile();
  const days = await fetchCalendarDays(profile.contributionsCollection.contributionYears);
  const streaks = computeStreaks(days);
  const languages = computeLanguages(profile.repositories.nodes);
  const privateRepos = profile.repositories.nodes.filter((r) => r.isPrivate).length;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const totalLastYear = profile.contributionsCollection.contributionCalendar.totalContributions;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'stats.svg'), renderStats(profile, totalLastYear));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'langs.svg'), renderLanguages(languages));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'streak.svg'), renderStreak(streaks));

  console.log(`✅ Cartes générées dans profile/ (${profile.repositories.nodes.length} dépôts dont ${privateRepos} privés lus)`);
  console.log(`📊 ${totalLastYear} contributions sur 12 mois, ${streaks.total} au total`);
  console.log(`🔥 Série actuelle ${streaks.current.length} j, plus longue ${streaks.longest.length} j`);
  console.log(`🧑‍💻 ${languages.map((l) => `${l.name} ${l.percent.toFixed(1)}%`).join(', ')}`);
  if (privateRepos === 0) console.log('ℹ️ Aucun dépôt privé visible : la carte des langages ne couvre que les dépôts publics.');
}

main().catch((error) => {
  console.error('❌', error.message);
  process.exit(1);
});
