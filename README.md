# MyTodo - Application de Gestion de Tâches

## Description
MyTodo est une application collaborative de gestion de tâches construite avec Next.js, Supabase et TailwindCSS.

## Prérequis
- Node.js 18+
- npm ou yarn
- Une base de données Supabase

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/mytodo.git
cd mytodo
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env.local
```
Puis remplissez les variables dans `.env.local` avec vos informations Supabase.

## Développement

Pour lancer le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Tests

L'application utilise Jest et React Testing Library pour les tests. Voici les commandes disponibles :

### Exécuter les tests
```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Générer un rapport de couverture
npm run test:coverage
```

### Structure des tests
Les tests sont organisés de la manière suivante :
- `src/components/**/__tests__/` - Tests des composants
- `src/services/__tests__/` - Tests des services
- `src/hooks/__tests__/` - Tests des hooks personnalisés

### Bonnes pratiques
- Écrire des tests pour chaque nouveau composant
- Maintenir une couverture de tests d'au moins 80%
- Utiliser des mocks pour les appels API
- Tester les cas d'erreur

## Déploiement

L'application peut être déployée sur Netlify ou Vercel. Assurez-vous de configurer les variables d'environnement sur votre plateforme de déploiement.

## Contribution

1. Créez une branche pour votre fonctionnalité
2. Committez vos changements
3. Ouvrez une Pull Request

N'oubliez pas de :
- Écrire des tests pour vos nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire
- Suivre les conventions de code du projet

## Licence

MIT 