# Dentolio - Logiciel de Gestion de Cabinet Dentaire (MERN Stack)

Logiciel complet de gestion de cabinet dentaire inspiré de la démonstration Dentolio.

## ⚡ Démarrage Rapide

### Méthode 1 : En un seul clic (Recommandé sous Windows)
Double-cliquez simplement sur le fichier :
👉 **`demarrer_dentolio.bat`**

Ce script va automatiquement :
1. Vérifier que MongoDB est en cours d'exécution.
2. Démarrer le serveur API Backend (Port 5000).
3. Démarrer l'interface Frontend React (Port 3000).
4. Ouvrir votre navigateur sur **http://localhost:3000**.

---

### Méthode 2 : Manuellement via deux terminaux

#### 1. Démarrer le Backend (Terminal 1)
```bash
cd backend
npm install       # (si première installation)
npm run seed      # (pour injecter les données démo : Najlae Amrani, Nadir Alaoui...)
node server.js
```
> Le serveur démarre sur : **http://localhost:5000**

#### 2. Démarrer le Frontend (Terminal 2)
```bash
cd frontend
npm install       # (si première installation)
npm run dev
```
> L'interface démarre sur : **http://localhost:3000**

---

## 📄 Guide Complet en PDF

Le guide complet détaillé pas-à-pas pour refaire le projet de zéro est disponible dans le fichier :
- **`Guide_Complet_Projet_Dentaire_MERN_Dentolio.pdf`**
