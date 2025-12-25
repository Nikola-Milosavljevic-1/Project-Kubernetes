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

yaml

- Frontend : HTML / JavaScript (servi par Nginx)
- Backend : API Node.js (Express)
- Database : MongoDB
- Orchestration : Kubernetes

---

## 2. Structure du projet

frontend-backend-kubernetes/
├── backend/ # API Node.js
├── frontend/ # Application frontend
└── kubernetes/ # Manifests Kubernetes

yaml
Copier le code

---

## 3. Prérequis

- Docker
- Kubernetes (Docker Desktop avec Kubernetes activé)
- kubectl
- Node.js (uniquement pour développement local backend)

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

Des commandes utiles :

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
npm start
```

Des commandes utiles :
```bash
npm run lint   
npm run lint:fix # fixer des erreurs de lint  
npm run type-check 

```


---

### Docker

#### Build des images

Depuis la racine du projet :

```bash
docker build -t backend:1.0 ./backend
docker build -t frontend:1.0 ./frontend
```

#### Lancer les conteneurs (test simple)

```bash
docker run -p 5050:5050 backend:1.0
docker run -p 8080:80 frontend:1.0
```

* **Frontend accessible sur :** `http://localhost:8080`

---

### Kubernetes (Recommandé)

#### Vérifier le cluster

Assurez-vous que le nœud est en état `Ready` :

```bash
kubectl get nodes
```

#### Déployer la stack complète

Depuis la racine du projet :

```bash
kubectl apply -f kubernetes/mongodb-deployment.yml
kubectl apply -f kubernetes/backend-deployment.yml
kubectl apply -f kubernetes/backend-service.yml
kubectl apply -f kubernetes/frontend-deployment.yml
kubectl apply -f kubernetes/frontend-service.yml
```

### Vérifications

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

### Accéder au frontend

1. Récupérer le **NodePort** :

   ```bash
   kubectl get svc frontend
   ```

2. Ouvrir dans un navigateur :
   `http://localhost:<NODE_PORT>`

---

### Logs et Debug

### Logs d’un pod

```bash
kubectl logs backend
kubectl logs frontend
kubectl logs mongodb
```

### Détails d’un pod

```bash
kubectl describe pod backend
```

---

## 5. Développement à poursuivre

* Implémentation des routes backend
* Utilisation complète de MongoDB (models, CRUD)
* Enrichissement du frontend
* Gestion des erreurs
* Scaling (replicas Kubernetes)
