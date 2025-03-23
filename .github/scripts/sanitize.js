// Ce script s'exécute avant le commit pour s'assurer qu'aucune donnée sensible n'est présente
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'data', 'github.json');

if (fs.existsSync(dataPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Vérifier et supprimer des champs potentiellement sensibles 
    // (même si normalement, le script principal ne les collecte pas)
    const sensitiveFields = ['email', 'token', 'key', 'password', 'secret'];
    
    function sanitizeObject(obj) {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        // Ignorer les clés sensibles
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          continue;
        }
        
        // Récursivement nettoyer les objets imbriqués
        sanitized[key] = typeof value === 'object' ? sanitizeObject(value) : value;
      }
      
      return sanitized;
    }
    
    const sanitizedData = sanitizeObject(data);
    fs.writeFileSync(dataPath, JSON.stringify(sanitizedData));
    console.log('Data sanitized successfully');
  } catch (error) {
    console.error('Error sanitizing data:', error);
    process.exit(1);
  }
} 