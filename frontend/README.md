# Frontend - Plateforme de Loterie

Ce dossier contient la partie frontend de la plateforme de loterie développée avec Vue.js 3.

## Installation

```bash
npm install
```

## Démarrage en développement

```bash
npm run dev
```

Le serveur de développement démarre sur `http://localhost:5173`

## Configuration

Le frontend est configuré pour communiquer avec le backend via un proxy Vite :
- Les requêtes vers `/api/*` sont automatiquement redirigées vers `http://localhost:5050/api/*`
- Cette configuration se trouve dans `vite.config.js`

## Important : Démarrage du backend

**Avant de lancer le frontend, assurez-vous que le backend est démarré :**

1. Ouvrez un terminal dans le dossier `backend/`
2. Lancez le serveur backend :
   ```bash
   npm start
   ```
3. Vérifiez que le backend répond sur `http://localhost:5050`

Le backend doit être démarré pour que le frontend puisse fonctionner correctement.

## Structure du projet

```
frontend/
├── src/
│   ├── api/          # Appels API vers le backend
│   ├── config/        # Configuration (URL API, etc.)
│   ├── pages/         # Pages de l'application
│   ├── router/        # Configuration du routage
│   └── components/    # Composants réutilisables
├── vite.config.js     # Configuration Vite (proxy, etc.)
└── package.json
```

## Fonctionnalités

- **Page de connexion/inscription** : Permet de se connecter ou de créer un compte
- **Dashboard** : Interface principale après connexion (à développer)
