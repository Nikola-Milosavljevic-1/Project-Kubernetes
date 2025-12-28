# Guide de résolution des erreurs TypeScript/ESLint

Ce guide vous explique comment résoudre les erreurs de types que vous rencontrez dans Cursor.

## Problèmes identifiés

1. **Erreurs TypeScript** : Types manquants pour `jest` et `node`
2. **Erreurs de modules** : TypeScript ne reconnaît pas certains modules comme `bcrypt`, `mongoose`, `express`, etc.

## Solution : Installation des dépendances

### Étape 1 : Installer les types manquants

Les types manquants ont été ajoutés au `package.json`. Vous devez maintenant installer les dépendances :

```bash
cd backend
npm install
```

Cela installera automatiquement :
- `@types/jest` - Types pour Jest
- `@types/bcrypt` - Types pour bcrypt
- `@types/supertest` - Types pour supertest
- `@types/node` - Types pour Node.js (déjà présent mais sera mis à jour)

### Étape 2 : Redémarrer le serveur TypeScript dans Cursor

Après avoir installé les dépendances :

1. **Fermez et rouvrez Cursor** (ou redémarrez le serveur TypeScript)
   - Sur macOS : `Cmd + Shift + P` → Tapez "TypeScript: Restart TS Server"
   - Sur Windows/Linux : `Ctrl + Shift + P` → Tapez "TypeScript: Restart TS Server"

2. **Attendez quelques secondes** que TypeScript recharge les types

### Étape 3 : Vérifier que tout fonctionne

Les erreurs devraient disparaître. Si ce n'est pas le cas :

1. Vérifiez que `node_modules` contient bien les dossiers `@types` :
   ```bash
   ls node_modules/@types
   ```
   Vous devriez voir : `jest`, `node`, `bcrypt`, `express`, `cors`, etc.

2. Vérifiez que le `tsconfig.json` est correct (déjà corrigé)

## Explication des erreurs

### Pourquoi ces erreurs apparaissent ?

- **TypeScript vérifie les fichiers JavaScript** : Le `tsconfig.json` a `"checkJs": true`, ce qui fait que TypeScript analyse aussi les fichiers `.js`
- **Types manquants** : TypeScript a besoin de fichiers de définition (`.d.ts`) pour comprendre les types des modules Node.js
- **Packages `@types/*`** : Ces packages contiennent les définitions de types pour les modules JavaScript

### Modules concernés

- `console`, `process`, `crypto` → Types fournis par `@types/node`
- `bcrypt` → Types fournis par `@types/bcrypt`
- `mongoose` → Types fournis par `@types/mongoose` (si nécessaire)
- `express` → Types fournis par `@types/express`
- `jest` → Types fournis par `@types/jest`

## Si les erreurs persistent

Si après avoir installé les dépendances et redémarré TypeScript, vous avez encore des erreurs :

1. **Vérifiez la version de Node.js** :
   ```bash
   node --version
   ```
   Assurez-vous d'avoir Node.js 16 ou supérieur

2. **Supprimez et réinstallez les dépendances** :
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Vérifiez le `tsconfig.json`** : Il devrait contenir `"types": ["node", "jest"]` dans `compilerOptions`

4. **Vérifiez que Cursor utilise bien le `tsconfig.json` du dossier backend** :
   - Ouvrez un fichier `.js` dans le dossier `src/`
   - Regardez en bas à droite de Cursor : il devrait indiquer "TypeScript" ou "JavaScript"
   - Cliquez dessus et sélectionnez "TypeScript" si nécessaire

## Note importante

Ces erreurs sont **purement visuelles** dans l'éditeur. Votre code fonctionnera quand même correctement quand vous lancerez `npm start`. Cependant, les corriger améliore l'expérience de développement avec l'autocomplétion et la détection d'erreurs.

