#!/usr/bin/env node

/**
 * Script de test pour vérifier le fonctionnement du cache GitHub
 */

const fs = require('fs');
const path = require('path');

function testCache() {
  console.log('🧪 Testing GitHub Cache');
  console.log('======================');
  
  const dataDir = path.resolve(process.cwd(), 'data');
  const cacheFile = path.join(dataDir, 'github.json');
  
  // Test 1: Existence du fichier
  console.log('\n📁 Test 1: Cache file existence');
  if (fs.existsSync(cacheFile)) {
    console.log('✅ Cache file exists');
  } else {
    console.log('❌ Cache file not found');
    return false;
  }
  
  // Test 2: Validité JSON
  console.log('\n📄 Test 2: JSON validity');
  try {
    const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    console.log('✅ JSON is valid');
  } catch (error) {
    console.log(`❌ JSON is invalid: ${error.message}`);
    return false;
  }
  
  // Test 3: Structure des données
  console.log('\n🏗️  Test 3: Data structure');
  const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  
  const requiredSections = ['stats', 'repos', 'meta'];
  for (const section of requiredSections) {
    if (cacheData[section]) {
      console.log(`✅ ${section} section present`);
    } else {
      console.log(`❌ ${section} section missing`);
      return false;
    }
  }
  
  // Test 4: Données des stats
  console.log('\n📊 Test 4: Stats data');
  const stats = cacheData.stats;
  const requiredStats = ['r', 's', 'f', 't'];
  
  for (const stat of requiredStats) {
    if (stats.hasOwnProperty(stat) && typeof stats[stat] === 'number') {
      console.log(`✅ ${stat}: ${stats[stat]}`);
    } else {
      console.log(`❌ ${stat} is missing or invalid`);
    }
  }
  
  // Test 5: Données des repos
  console.log('\n📦 Test 5: Repos data');
  const repos = cacheData.repos;
  
  if (Array.isArray(repos) && repos.length > 0) {
    console.log(`✅ ${repos.length} repos found`);
    
    // Vérifier la structure d'un repo
    const firstRepo = repos[0];
    const requiredRepoFields = ['n', 'd', 'u', 'l', 's', 'f', 't'];
    
    for (const field of requiredRepoFields) {
      if (firstRepo.hasOwnProperty(field)) {
        console.log(`✅ Repo field ${field}: ${firstRepo[field]}`);
      } else {
        console.log(`❌ Repo field ${field} missing`);
      }
    }
  } else {
    console.log('❌ No repos found or invalid format');
    return false;
  }
  
  // Test 6: Métadonnées
  console.log('\n🔍 Test 6: Metadata');
  const meta = cacheData.meta;
  
  if (meta) {
    console.log(`✅ Version: ${meta.version || 'unknown'}`);
    console.log(`✅ Security: ${meta.security || 'unknown'}`);
    console.log(`✅ Last update: ${meta.lastUpdate || 'unknown'}`);
  } else {
    console.log('❌ Metadata missing');
  }
  
  // Test 7: Taille du fichier
  console.log('\n📏 Test 7: File size');
  const fileSize = fs.statSync(cacheFile).size;
  const fileSizeKB = Math.round(fileSize / 1024);
  
  if (fileSizeKB < 50) {
    console.log(`✅ File size OK: ${fileSizeKB}KB`);
  } else {
    console.log(`⚠️  File size large: ${fileSizeKB}KB`);
  }
  
  // Test 8: Données sensibles
  console.log('\n🔒 Test 8: Security check');
  const cacheString = JSON.stringify(cacheData);
  const sensitivePatterns = ['email', 'private', 'token', 'secret', 'password'];
  
  let sensitiveFound = false;
  for (const pattern of sensitivePatterns) {
    if (cacheString.toLowerCase().includes(pattern)) {
      console.log(`❌ Sensitive data found: ${pattern}`);
      sensitiveFound = true;
    }
  }
  
  if (!sensitiveFound) {
    console.log('✅ No sensitive data detected');
  }
  
  console.log('\n🎉 Cache test completed!');
  return true;
}

// Exécution du script
if (require.main === module) {
  const success = testCache();
  process.exit(success ? 0 : 1);
}

module.exports = { testCache };
