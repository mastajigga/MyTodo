const fs = require('fs');
const path = require('path');

const moveFiles = (source, destination) => {
  if (!fs.existsSync(source)) return;
  
  const files = fs.readdirSync(source, { withFileTypes: true });
  
  files.forEach(file => {
    const sourcePath = path.join(source, file.name);
    
    if (file.isDirectory()) {
      moveFiles(sourcePath, destination);
    } else if (file.name.endsWith('.test.tsx') || file.name.endsWith('.test.ts')) {
      const destPath = path.join(destination, file.name);
      fs.renameSync(sourcePath, destPath);
      console.log(`Moved ${sourcePath} to ${destPath}`);
    }
  });
};

// Créer les répertoires s'ils n'existent pas
const directories = [
  'src/__tests__/unit/components',
  'src/__tests__/unit/hooks',
  'src/__tests__/unit/utils',
  'src/__tests__/unit/services',
  'src/__tests__/integration/api',
  'src/__tests__/integration/database',
  'src/__tests__/integration/auth',
  'src/__tests__/e2e/flows',
  'src/__tests__/e2e/navigation',
  'src/__tests__/e2e/forms'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Déplacer les fichiers de test
console.log('Moving component tests...');
moveFiles('src/components', 'src/__tests__/unit/components');

console.log('Moving hook tests...');
moveFiles('src/hooks', 'src/__tests__/unit/hooks');

console.log('Moving service tests...');
moveFiles('src/services', 'src/__tests__/unit/services');

console.log('Moving auth tests...');
moveFiles('src/lib/auth', 'src/__tests__/integration/auth');

console.log('Moving database tests...');
moveFiles('src/test/services', 'src/__tests__/integration/database');

console.log('Moving E2E tests...');
moveFiles('src/test/e2e', 'src/__tests__/e2e/flows'); 