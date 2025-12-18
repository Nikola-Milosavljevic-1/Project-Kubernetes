# Frontend / Backend – Kubernetes Project

Ce projet fournit une **initialisation complète** d’une application
frontend / backend conteneurisée et orchestrée avec Kubernetes.

L’objectif est de fournir une **base technique fonctionnelle**
afin que l’équipe puisse développer les fonctionnalités métier.

---

## Architecture

Frontend → Backend API → MongoDB
(orchestré avec Kubernetes)

yaml

- Frontend : HTML / JavaScript (servi par Nginx)
- Backend : API Node.js (Express)
- Database : MongoDB
- Orchestration : Kubernetes

---

## Structure du projet

frontend-backend-kubernetes/
├── backend/ # API Node.js
├── frontend/ # Application frontend
└── kubernetes/ # Manifests Kubernetes

yaml
Copier le code

---

## Prérequis

- Docker
- Kubernetes (Docker Desktop avec Kubernetes activé)
- kubectl
- Node.js (uniquement pour développement local backend)

---

## Développement local (sans Docker)

### Backend

```bash
cd backend
npm install
npm start
API disponible sur : http://localhost:3000


Copier le code
http://localhost:3000
Endpoint de test :GET /api/health

bash
Copier le code
GET /api/health
Frontend
bash
Copier le code
cd frontend
Ouvrir simplement index.html dans un navigateur.

⚠️ La communication frontend ↔ backend n’est pas active en local
sans Docker/Kubernetes.

Docker
Build des images
Depuis la racine du projet :

bash
Copier le code
docker build -t backend:1.0 ./backend
docker build -t frontend:1.0 ./frontend
Lancer les conteneurs (test simple)
bash
Copier le code
docker run -p 3000:3000 backend:1.0
docker run -p 8080:80 frontend:1.0
Frontend accessible sur :

arduino
Copier le code
http://localhost:8080
Kubernetes (recommandé)
Vérifier le cluster
bash
Copier le code
kubectl get nodes
Le node doit être en état Ready.

Déployer la stack complète
Depuis la racine du projet :

bash
Copier le code
kubectl apply -f kubernetes/mongodb-deployment.yml
kubectl apply -f kubernetes/backend-deployment.yml
kubectl apply -f kubernetes/backend-service.yml
kubectl apply -f kubernetes/frontend-deployment.yml
kubectl apply -f kubernetes/frontend-service.yml
Vérifier l’état des pods
bash
Copier le code
kubectl get pods
Résultat attendu :

sql
Copier le code
frontend-xxxxx   1/1 Running
backend-xxxxx    1/1 Running
mongodb-xxxxx    1/1 Running
Vérifier les services
bash
Copier le code
kubectl get svc
Accéder au frontend
Récupérer le NodePort :

bash
Copier le code
kubectl get svc frontend
Puis ouvrir dans un navigateur :


Copier le code
http://localhost:<NODE_PORT>
Logs et debug
Logs d’un pod
bash
Copier le code
kubectl logs backend
kubectl logs frontend
kubectl logs mongodb
Détails d’un pod
bash
Copier le code
kubectl describe pod backend
Développement à poursuivre
implémentation des routes backend

utilisation complète de MongoDB (models, CRUD)

enrichissement du frontend

gestion des erreurs

scaling (replicas Kubernetes)