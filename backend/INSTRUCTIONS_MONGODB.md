# Instructions pour configurer MongoDB

Ce guide vous explique étape par étape comment configurer MongoDB pour que le backend fonctionne correctement.

## Prérequis

- MongoDB installé sur votre machine
- MongoDB Compass installé (pour la gestion visuelle de la base de données)

## Étape 1 : Vérifier que MongoDB est démarré

Avant de commencer, assurez-vous que MongoDB est bien démarré sur votre machine.

### Sur macOS/Linux :
```bash
# Vérifier si MongoDB est en cours d'exécution
sudo systemctl status mongod
# ou
brew services list | grep mongodb
```

### Sur Windows :
- Vérifiez dans les services Windows que "MongoDB" est en cours d'exécution

## Étape 2 : Créer la base de données avec MongoDB Compass

1. **Ouvrir MongoDB Compass** :
   - Lancez l'application MongoDB Compass que vous avez installée

2. **Se connecter à MongoDB** :
   - MongoDB Compass devrait se connecter automatiquement à `mongodb://localhost:27017`
   - Si ce n'est pas le cas, entrez cette URI dans le champ de connexion
   - Cliquez sur "Connect"

3. **Créer la base de données** :
   - Une fois connecté, vous verrez la liste des bases de données existantes
   - Cliquez sur le bouton vert "Create Database" en haut à gauche
   - Dans le formulaire qui s'ouvre :
     - **Database Name** : `lottery_db`
     - **Collection Name** : vous pouvez mettre `users` (ou n'importe quoi, les collections seront créées automatiquement)
   - Cliquez sur "Create Database"

4. **Vérifier** :
   - Vous devriez maintenant voir `lottery_db` dans la liste des bases de données
   - Cliquez dessus pour voir son contenu (il sera vide pour l'instant, c'est normal)

## Étape 3 : Configurer le backend

1. **Créer le fichier `.env`** :
   - Dans le dossier `backend/`, créez un nouveau fichier nommé `.env`
   - Ajoutez-y le contenu suivant :
   ```
   MONGO_URI=mongodb://localhost:27017/lottery_db
   PORT=5050
   ```
   - Remplacez `lottery_db` par le nom de votre base de données si vous avez choisi un autre nom

2. **Vérifier la connexion** :
   - Ouvrez un terminal dans le dossier `backend/`
   - Installez les dépendances si ce n'est pas déjà fait :
     ```bash
     npm install
     ```
   - Lancez le serveur :
     ```bash
     npm start
     ```
   - Si tout fonctionne, vous devriez voir dans la console :
     ```
     Connected to MongoDB
     Backend running on port 5050
     ```

3. **Tester la connexion** :
   - Dans un autre terminal, testez l'endpoint de santé :
     ```bash
     curl http://localhost:5050/health
     ```
   - Vous devriez recevoir un message indiquant que la base de données est connectée

## Étape 4 : Vérifier que les collections sont créées

Une fois que vous avez utilisé l'application (créé un compte, joué, etc.), retournez dans MongoDB Compass :

1. Cliquez sur la base de données `lottery_db`
2. Vous devriez voir trois collections créées automatiquement :
   - **users** : Contient les utilisateurs
   - **gamestates** : Contient l'état du jeu (jackpot)
   - **histories** : Contient l'historique des gains

## Dépannage

### Erreur : "MongoServerError: connect ECONNREFUSED"
- **Cause** : MongoDB n'est pas démarré
- **Solution** : Démarrez MongoDB (voir Étape 1)

### Erreur : "MongoServerError: Authentication failed"
- **Cause** : MongoDB nécessite une authentification
- **Solution** : Si votre MongoDB nécessite un utilisateur/mot de passe, modifiez l'URI dans `.env` :
  ```
  MONGO_URI=mongodb://username:password@localhost:27017/lottery_db
  ```

### Erreur : "MongooseError: Operation `users.findOne()` buffering timed out"
- **Cause** : La connexion à MongoDB échoue
- **Solution** : Vérifiez que :
  - MongoDB est bien démarré
  - L'URI dans `.env` est correcte
  - Le port 27017 n'est pas bloqué par un firewall

### La base de données n'apparaît pas dans MongoDB Compass
- **Cause** : Les bases de données vides ne s'affichent parfois pas
- **Solution** : C'est normal, la base apparaîtra une fois que l'application aura créé des données

## Notes importantes

- Les collections seront créées automatiquement lors de la première utilisation
- Vous n'avez pas besoin de créer manuellement les collections ou les schémas
- Si vous supprimez la base de données, elle sera recréée automatiquement au prochain démarrage
- Les données sont persistantes : elles restent même après avoir arrêté le serveur

