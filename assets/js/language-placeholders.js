// Générateur d'images placeholder par langage de programmation
// Retourne des data URI SVG avec couleurs spécifiques au langage

const languageColors = {
  'JavaScript': '#f7df1e',
  'TypeScript': '#3178c6',
  'Python': '#3776ab',
  'Java': '#f89820',
  'C': '#00599c',
  'C++': '#00599c',
  'C#': '#239120',
  'CSS': '#264de4',
  'HTML': '#e34f26',
  'PHP': '#777bb4',
  'Ruby': '#cc342d',
  'Go': '#00add8',
  'Rust': '#000000',
  'Swift': '#fa7343',
  'Kotlin': '#7f52ff',
  'Scala': '#dc322f',
  'R': '#276dc3',
  'MATLAB': '#e16737',
  'Shell': '#89e051',
  'PowerShell': '#012456',
  'Dart': '#0175c2',
  'Lua': '#000080',
  'Perl': '#39457e',
  'Haskell': '#5d4f85',
  'Clojure': '#5881d8',
  'Elixir': '#4e2a8a',
  'Erlang': '#a90533',
  'F#': '#378bda',
  'OCaml': '#ec6813',
  'Racket': '#3c5caa',
  'Scheme': '#1f4e79',
  'Prolog': '#ff6b35',
  'Assembly': '#6e4c13',
  'VHDL': '#adb2cb',
  'Verilog': '#b2b7f8',
  'SystemVerilog': '#dae1fc',
  'Tcl': '#e4cc98',
  'AutoHotkey': '#334455',
  'AutoIt': '#1c3552',
  'VBScript': '#15dcdc',
  'ActionScript': '#882b00',
  'AppleScript': '#101f1c',
  'Awk': '#c30e9b',
  'Bash': '#4eaa25',
  'Crystal': '#000100',
  'D': '#ba595e',
  'Delphi': '#b30000',
  'Emacs Lisp': '#c065db',
  'Forth': '#341708',
  'Fortran': '#4d41b1',
  'FreeMarker': '#0050b2',
  'Frege': '#00cafe',
  'Game Maker Language': '#71b417',
  'GDScript': '#355570',
  'Gherkin': '#5b2063',
  'Gradle': '#02303a',
  'Groovy': '#4298b8',
  'Hack': '#878787',
  'Handlebars': '#f7931e',
  'Haxe': '#df7900',
  'Jupyter Notebook': '#da5b0b',
  'Makefile': '#427819',
  'Markdown': '#083fa1',
  'Nim': '#ffc200',
  'Nix': '#7e7eff',
  'Objective-C': '#438eff',
  'Objective-C++': '#6866fb',
  'Pascal': '#e3f171',
  'PostScript': '#da291c',
  'Pug': '#a86454',
  'PureScript': '#1d222d',
  'QML': '#44a51c',
  'Roff': '#ecdebe',
  'SAS': '#b34936',
  'Sass': '#cf649a',
  'Solidity': '#363636',
  'Stylus': '#ff6347',
  'TeX': '#3d6117',
  'Terraform': '#623ce4',
  'Vue': '#4fc08d',
  'WebAssembly': '#654ff0',
  'XSLT': '#eb8ceb',
  'YAML': '#cb171e',
  'Zig': '#ec915c'
};

/**
 * Génère un placeholder SVG pour un langage de programmation
 * @param {string} language - Le nom du langage
 * @param {number} width - Largeur de l'image (défaut: 400)
 * @param {number} height - Hauteur de l'image (défaut: 250)
 * @returns {string} Data URI SVG
 */
function getLanguagePlaceholder(language, width = 400, height = 250) {
  const color = languageColors[language] || '#666666';
  const backgroundColor = adjustColorBrightness(color, 0.1);
  const textColor = getContrastColor(color);
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#gradient)"/>
      
      <!-- Code brackets -->
      <g transform="translate(${width/2 - 60}, ${height/2 - 30})" fill="${color}" opacity="0.3">
        <path d="M0 0 L20 0 L20 10 L10 10 L10 20 L20 20 L20 30 L0 30 Z"/>
        <path d="M40 0 L60 0 L60 30 L40 30 L40 20 L50 20 L50 10 L40 10 Z"/>
      </g>
      
      <!-- Language name -->
      <text x="50%" y="60%" text-anchor="middle" 
            font-family="'Inter', 'Segoe UI', sans-serif" 
            font-size="${Math.min(width/8, 32)}" 
            font-weight="600" 
            fill="${textColor}"
            filter="url(#shadow)">
        ${language || 'Code'}
      </text>
      
      <!-- Decorative elements -->
      <circle cx="${width * 0.2}" cy="${height * 0.2}" r="3" fill="${color}" opacity="0.6"/>
      <circle cx="${width * 0.8}" cy="${height * 0.3}" r="2" fill="${color}" opacity="0.4"/>
      <circle cx="${width * 0.1}" cy="${height * 0.8}" r="4" fill="${color}" opacity="0.3"/>
      <circle cx="${width * 0.9}" cy="${height * 0.7}" r="2.5" fill="${color}" opacity="0.5"/>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Ajuste la luminosité d'une couleur
 * @param {string} color - Couleur hexadécimale
 * @param {number} factor - Facteur d'ajustement (-1 à 1)
 * @returns {string} Couleur ajustée
 */
function adjustColorBrightness(color, factor) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.max(0, Math.min(255, r + (255 - r) * factor));
  const newG = Math.max(0, Math.min(255, g + (255 - g) * factor));
  const newB = Math.max(0, Math.min(255, b + (255 - b) * factor));
  
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

/**
 * Détermine la couleur de texte optimale (noir ou blanc) selon le contraste
 * @param {string} backgroundColor - Couleur de fond hexadécimale
 * @returns {string} Couleur de texte optimale
 */
function getContrastColor(backgroundColor) {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calcul de la luminance relative
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Génère un placeholder pour un projet sans langage spécifique
 * @param {string} projectName - Nom du projet
 * @param {number} width - Largeur de l'image
 * @param {number} height - Hauteur de l'image
 * @returns {string} Data URI SVG
 */
function getGenericProjectPlaceholder(projectName, width = 400, height = 250) {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
  const color = colors[projectName.length % colors.length];
  const backgroundColor = adjustColorBrightness(color, 0.1);
  const textColor = getContrastColor(color);
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#gradient)"/>
      
      <!-- Project icon -->
      <g transform="translate(${width/2 - 30}, ${height/2 - 30})" fill="${color}" opacity="0.4">
        <rect x="0" y="0" width="60" height="40" rx="8" fill="none" stroke="currentColor" stroke-width="3"/>
        <rect x="10" y="10" width="40" height="20" rx="4" fill="currentColor" opacity="0.3"/>
        <circle cx="20" cy="25" r="3" fill="currentColor"/>
        <circle cx="40" cy="25" r="3" fill="currentColor"/>
      </g>
      
      <!-- Project name -->
      <text x="50%" y="70%" text-anchor="middle" 
            font-family="'Inter', 'Segoe UI', sans-serif" 
            font-size="${Math.min(width/10, 24)}" 
            font-weight="500" 
            fill="${textColor}"
            filter="url(#shadow)">
        ${projectName}
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLanguagePlaceholder,
    getGenericProjectPlaceholder,
    languageColors
  };
}
