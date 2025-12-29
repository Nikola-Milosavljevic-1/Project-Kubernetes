[![Backend Build Status](https://github.com/Nikola-Milosavljevic-1/Project-Kubernetes/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Nikola-Milosavljevic-1/Project-Kubernetes/actions)
[![Frontend Build Status](https://github.com/Nikola-Milosavljevic-1/Project-Kubernetes/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Nikola-Milosavljevic-1/Project-Kubernetes/actions)

# Frontend / Backend – Kubernetes Project

Ce projet fournit une **initialisation complète** d’une application
frontend / backend conteneurisée et orchestrée avec Kubernetes.

L’objectif est de fournir une **base technique fonctionnelle**
afin que l’équipe puisse développer les fonctionnalités métier.

---

## 1. Architecture

Frontend → Backend API → MongoDB
(orchestré avec Kubernetes)


- Frontend : Vue.js
- Backend : Express.js + Node.js
- Database : MongoDB
    MongoDB est utilisé comme base de données NoSQL afin de stocker les utilisateurs grâce à un schéma flexible, facilement évolutif et bien adapté aux applications modernes.
- Orchestration : Kubernetes (Kind)
    Kubernetes est utilisé pour orchestrer les conteneurs Docker, car il est simple à exécuter en local et permet de se rapprocher des conditions de déploiement réelles.
- CI : GithubActions
    La chaîne d’intégration continue vérifie automatiquement la qualité du code, exécute les tests unitaires du backend et construit les images Docker. La CI met à jour les fichiers de déploiement Kubernetes en modifiant la version des images Docker afin de déclencher le déploiement continu à chaque changement validé. Les flags sont affichés dans le README pour indiquer l’état de la CI, des tests et du déploiement.
- CD : ArgoCD dans Kubernetes
    Le déploiement continu repose sur un cluster Kubernetes local supervisé par ArgoCD. ArgoCD détecte automatiquement toute modification des fichiers Kubernetes et déploie la nouvelle version en récupérant les images mises à jour depuis Docker Hub.

---

## 2. Structure du projet

```text
frontend-backend-kubernetes/
├── backend/            # API Node.js
├── frontend/           # Application frontend
└── kubernetes/         # Manifests Kubernetes
```


---

## 3. Prérequis

- Docker
- Kubernetes (Docker Desktop avec Kubernetes *kind* activé)
- kubectl
- Node.js (uniquement pour développement local backend)
- Argocd (Faut installer avec Kubernetes)

---

## 4. L'ancement local

### Backend

Installation des dépendances et démarrage du serveur :

```bash
cd backend
npm install
npm start
```

* **API disponible sur :** `http://localhost:5050`
* **Endpoint de test :** `GET /health`

Des commandes utiles pour passer le ci:

```bash
npm run lint   
npm run lint:fix # fixer des erreurs de lint  
npm run type-check 
npm test    

```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Des commandes utiles pour passer le ci :
```bash
npm run lint   
npm run lint:fix # fixer des erreurs de lint  
npm run type-check 

```


---

### Lancer avec Kubernetes (Recommandé, le plus proche de la production)

#### a) Installer Argocd

Voir la partie Utilisation de agroCD

#### b) Vérifier le cluster

Assurez-vous que le nœud est en état `Ready` :

```bash
kubectl get nodes
```

#### c) Déployer la stack complète

Depuis la racine du projet :

```bash
kubectl apply -f ./kubernetes/
```

#### d) Vérifications

**1. Vérifier l’état des pods :**

```bash
kubectl get pods
```

*Résultat attendu :*

```text
frontend-xxxxx   1/1 Running
backend-xxxxx    1/1 Running
mongodb-xxxxx    1/1 Running
```

**2. Vérifier les services :**

```bash
kubectl get svc
```

#### e) Accéder au frontend

C'est configuré le `http://localhost:80`


---

#### f) Logs et Debug (optionnel)

##### Logs d’un pod

```bash
kubectl logs backend
kubectl logs frontend
kubectl logs mongodb
```

##### Détails d’un pod

```bash
kubectl describe pod backend
```


#### g) Utilisation de agroCD (Déjà lancé avec Kubernetes)
1. Installer ArgoCD dans le cluster Kubernetes (**Faut le faire avant de lancer le service Kubernetes**):

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

```
2. Accéder à l'interface web d'ArgoCD(attend l'initialisation complète des pods) :

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```   
Ouvrir un navigateur et aller à l'adresse : `https://localhost:8080`

3. Se connecter à ArgoCD :
- Nom d'utilisateur : `admin`
- Mot de passe : Récupérer le mot de passe initial avec la commande suivante :
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```      
ArgoCD va surveiller les modifications des ymls dans les dossiers kubernetes sur le github et appliquer automatiquement les changements dans le cluster.

#### h) Fermer la stack

```bash
kubectl delete -f ./kubernetes/
```

---

## 5. Développement à poursuivre

* Implémentation des routes backend
* Utilisation complète de MongoDB (models, CRUD)
* Enrichissement du frontend
* Gestion des erreurs
* Scaling (replicas Kubernetes)
