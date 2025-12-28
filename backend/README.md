# Backend - Plateforme de Loterie

Ce dossier contient toute la partie backend de la plateforme de loterie.

## Architecture

Le backend est organisé selon une architecture MVC (Model-View-Controller) pour une meilleure organisation du code :

```
backend/
├── src/
│   ├── models/          # Modèles MongoDB (User, GameState, History)
│   ├── controllers/     # Contrôleurs (auth, user, game)
│   ├── middlewares/     # Middlewares (authentification)
│   ├── utils/           # Utilitaires (tokens, logique de jeu, sessions)
│   ├── app.js           # Point d'entrée de l'application
│   ├── routes.js        # Définition des routes API
│   └── db.js            # Configuration de la connexion MongoDB
├── package.json
└── README.md
```

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer MongoDB (voir section ci-dessous)

3. Créer un fichier `.env` à la racine du dossier `backend/` avec votre configuration :
```bash
cp .env.example .env
```

4. Lancer le serveur :
```bash
npm start
```

Le serveur démarre sur le port 5050 par défaut.

## Configuration MongoDB

### Étape 1 : Installer MongoDB

Si vous n'avez pas encore MongoDB installé :

1. Téléchargez MongoDB Community Server depuis [mongodb.com](https://www.mongodb.com/try/download/community)
2. Installez MongoDB selon votre système d'exploitation
3. Démarrez le service MongoDB

### Étape 2 : Créer la base de données avec MongoDB Compass

1. **Ouvrir MongoDB Compass** :
   - Lancez l'application MongoDB Compass sur votre ordinateur

2. **Se connecter à MongoDB** :
   - Par défaut, MongoDB Compass se connecte à `mongodb://localhost:27017`
   - Si votre MongoDB est configuré différemment, ajustez l'URI de connexion

3. **Créer la base de données** :
   - Dans MongoDB Compass, cliquez sur le bouton "Create Database"
   - Nom de la base de données : `lottery_db` (ou le nom que vous préférez)
   - Nom de la collection : vous pouvez laisser vide pour l'instant, les collections seront créées automatiquement par l'application

4. **Vérifier la connexion** :
   - Une fois la base créée, vous devriez voir `lottery_db` dans la liste des bases de données
   - Notez l'URI de connexion (généralement `mongodb://localhost:27017/lottery_db`)

### Étape 3 : Configurer le backend

1. **Créer le fichier `.env`** :
   - Copiez le fichier `.env.example` vers `.env`
   - Ouvrez `.env` et modifiez la variable `MONGO_URI` avec votre URI de connexion :
   ```
   MONGO_URI=mongodb://localhost:27017/lottery_db
   ```

2. **Vérifier la connexion** :
   - Lancez le serveur avec `npm start`
   - Si tout fonctionne, vous devriez voir dans la console : "Connected to MongoDB"
   - Vous pouvez tester avec : `curl http://localhost:5050/health`

### Collections créées automatiquement

L'application créera automatiquement les collections suivantes dans votre base de données :

- **users** : Contient les utilisateurs (username, password hashé, balance)
- **gamestates** : Contient l'état du jeu (jackpot actuel)
- **histories** : Contient l'historique des gains

Vous n'avez pas besoin de créer ces collections manuellement, elles seront créées lors de la première utilisation.

## API Endpoints

### Authentification

- `POST /api/auth/login` - Connexion ou inscription d'un utilisateur

### Utilisateur

- `GET /api/user/me` - Récupère les informations de l'utilisateur connecté (requiert authentification)
- `POST /api/user/recharge` - Recharge le compte de l'utilisateur (requiert authentification)

### Jeu

- `GET /api/game/status` - Récupère l'état actuel du jackpot
- `POST /api/game/play` - Lance un tour de loterie (requiert authentification)
- `GET /api/game/history` - Récupère l'historique des 10 derniers gagnants

## Tests

Pour lancer les tests :
```bash
npm test
```

## Notes importantes

- Les mots de passe sont hashés avec bcrypt avant d'être stockés
- Les sessions sont stockées en mémoire (redémarrage du serveur = déconnexion de tous)
- Le jackpot initial est de 1000 jetons
- Les nouveaux utilisateurs commencent avec 100 jetons
- La probabilité de gagner augmente avec le montant misé

