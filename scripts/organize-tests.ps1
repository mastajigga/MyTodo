# Déplacer les tests de composants
Move-Item -Path "src/components/**/*.test.tsx" -Destination "src/__tests__/unit/components" -Force

# Déplacer les tests de hooks
Move-Item -Path "src/hooks/**/*.test.ts" -Destination "src/__tests__/unit/hooks" -Force

# Déplacer les tests de services
Move-Item -Path "src/services/**/*.test.ts" -Destination "src/__tests__/unit/services" -Force

# Déplacer les tests d'authentification
Move-Item -Path "src/lib/auth/**/*.test.ts" -Destination "src/__tests__/integration/auth" -Force

# Déplacer les tests d'API
Move-Item -Path "src/api/**/*.test.ts" -Destination "src/__tests__/integration/api" -Force

# Déplacer les tests de base de données
Move-Item -Path "src/test/services/*.test.ts" -Destination "src/__tests__/integration/database" -Force

# Déplacer les tests E2E
Move-Item -Path "src/test/e2e/**/*.test.ts" -Destination "src/__tests__/e2e/flows" -Force 