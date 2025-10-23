#!/usr/bin/env node

/**
 * Script de vérification de sécurité pour le cache GitHub
 * Vérifie qu'aucune donnée sensible n'est stockée
 */

const fs = require('fs');
const path = require('path');

// Mots-clés sensibles à détecter
const SENSITIVE_PATTERNS = [
  // Données personnelles
  /email/i,
  /phone/i,
  /address/i,
  /location/i,
  /bio/i,
  /company/i,
  /hireable/i,
  
  // Données privées
  /private/i,
  /secret/i,
  /token/i,
  /key/i,
  /password/i,
  /auth/i,
  
  // Données système
  /node_id/i,
  /gravatar_id/i,
  /site_admin/i,
  /two_factor/i,
  /suspended/i,
  /business_plus/i,
  /ldap_dn/i,
  
  // URLs internes
  /api\.github\.com/i,
  /raw\.githubusercontent\.com/i,
  /avatars\.githubusercontent\.com/i
];

// Champs autorisés (whitelist)
const ALLOWED_FIELDS = [
  'n', 'd', 'u', 'l', 's', 'f', 't', 'topics', // repos
  'r', 's', 'f', 't', 'lastUpdate', // stats
  'lastUpdate', 'version', 'security', 'cacheExpiry' // meta
];

function checkCacheSecurity() {
  const dataDir = path.resolve(process.cwd(), 'data');
  const cacheFile = path.join(dataDir, 'github.json');
  
  console.log('🔒 Security Check - GitHub Cache');
  console.log('================================');
  
  if (!fs.existsSync(cacheFile)) {
    console.log('❌ Cache file not found');
    return false;
  }
  
  try {
    const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    const cacheString = JSON.stringify(cacheData);
    
    console.log('📁 Cache file found');
    console.log(`📊 Size: ${Math.round(fs.statSync(cacheFile).size / 1024)}KB`);
    
    // Vérification 1: Structure des données
    console.log('\n🔍 Checking data structure...');
    const requiredFields = ['stats', 'repos', 'meta'];
    const missingFields = requiredFields.filter(field => !cacheData.hasOwnProperty(field));
    
    if (missingFields.length > 0) {
      console.log(`❌ Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    console.log('✅ Required fields present');
    
    // Vérification 2: Données sensibles
    console.log('\n🔍 Checking for sensitive data...');
    let sensitiveFound = false;
    
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(cacheString)) {
        console.log(`❌ Sensitive pattern detected: ${pattern}`);
        sensitiveFound = true;
      }
    }
    
    if (sensitiveFound) {
      console.log('❌ Sensitive data found in cache!');
      return false;
    }
    console.log('✅ No sensitive data detected');
    
    // Vérification 3: Champs autorisés
    console.log('\n🔍 Checking allowed fields...');
    const allFields = getAllFields(cacheData);
    const unauthorizedFields = allFields.filter(field => !ALLOWED_FIELDS.includes(field));
    
    if (unauthorizedFields.length > 0) {
      console.log(`❌ Unauthorized fields found: ${unauthorizedFields.join(', ')}`);
      return false;
    }
    console.log('✅ Only authorized fields present');
    
    // Vérification 4: Métadonnées de sécurité
    console.log('\n🔍 Checking security metadata...');
    if (cacheData.meta && cacheData.meta.security === 'public-data-only') {
      console.log('✅ Security flag present');
    } else {
      console.log('⚠️  Security flag missing');
    }
    
    // Vérification 5: Limites de données
    console.log('\n🔍 Checking data limits...');
    if (cacheData.repos && cacheData.repos.length > 20) {
      console.log(`⚠️  Too many repos: ${cacheData.repos.length} (max recommended: 20)`);
    } else {
      console.log(`✅ Repo count OK: ${cacheData.repos.length}`);
    }
    
    // Vérification 6: Descriptions
    if (cacheData.repos) {
      const longDescriptions = cacheData.repos.filter(repo => 
        repo.d && repo.d.length > 200
      );
      if (longDescriptions.length > 0) {
        console.log(`⚠️  Long descriptions found: ${longDescriptions.length}`);
      } else {
        console.log('✅ Description lengths OK');
      }
    }
    
    console.log('\n🎉 Security check completed successfully!');
    console.log('✅ Cache is safe for public use');
    return true;
    
  } catch (error) {
    console.log(`❌ Error reading cache file: ${error.message}`);
    return false;
  }
}

function getAllFields(obj, prefix = '') {
  let fields = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        fields = fields.concat(getAllFields(obj[key], fullKey));
      } else {
        fields.push(fullKey);
      }
    }
  }
  
  return fields;
}

// Exécution du script
if (require.main === module) {
  const isSecure = checkCacheSecurity();
  process.exit(isSecure ? 0 : 1);
}

module.exports = { checkCacheSecurity };
