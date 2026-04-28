# 🎓 Backend - École des Langues

API REST complète avec Node.js, Express et MongoDB.

---

## 📦 Installation

```bash
# 1. Cloner / télécharger le projet
cd school-backend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec tes valeurs

# 4. Démarrer le serveur
npm run dev       # Mode développement (avec nodemon)
npm start         # Mode production
```

---

## 🔐 Authentification

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/auth/register` | Créer un compte | Public |
| POST | `/api/auth/login` | Se connecter | Public |
| GET  | `/api/auth/me` | Mon profil | Connecté |
| PUT  | `/api/auth/change-password` | Changer mot de passe | Connecté |

### Exemple de connexion :
```json
POST /api/auth/login
{
  "email": "admin@ecole.dz",
  "password": "123456"
}
```
Réponse :
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "nom": "Admin", "role": "admin" }
}
```

> ⚠️ Pour les routes protégées, ajouter dans le header :
> `Authorization: Bearer <token>`

---

## 👨‍🎓 Étudiants

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/etudiants` | Liste des étudiants | Admin, Professeur |
| GET | `/api/etudiants/:id` | Un étudiant | Connecté |
| PUT | `/api/etudiants/:id` | Modifier | Connecté |
| DELETE | `/api/etudiants/:id` | Désactiver | Admin |

---

## 📚 Cours

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/cours` | Liste des cours | Connecté |
| GET | `/api/cours?langue=Anglais&niveau=Débutant` | Filtrer | Connecté |
| GET | `/api/cours/:id` | Un cours | Connecté |
| POST | `/api/cours` | Créer un cours | Admin |
| PUT | `/api/cours/:id` | Modifier | Admin |
| DELETE | `/api/cours/:id` | Désactiver | Admin |
| POST | `/api/cours/:id/inscrire/:etudiantId` | Inscrire étudiant | Admin |

### Exemple de création de cours :
```json
POST /api/cours
{
  "nom": "Anglais Débutant A1",
  "langue": "Anglais",
  "niveau": "Débutant",
  "duree": 60,
  "prix": 5000,
  "capaciteMax": 15
}
```

---

## 👨‍🏫 Professeurs

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/professeurs` | Liste | Admin |
| GET | `/api/professeurs/:id` | Un professeur | Connecté |
| PUT | `/api/professeurs/:id` | Modifier | Admin, Professeur |

---

## 💰 Paiements

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/paiements` | Liste | Admin |
| GET | `/api/paiements/stats` | Statistiques financières | Admin |
| POST | `/api/paiements` | Créer paiement | Admin |
| PUT | `/api/paiements/:id` | Mettre à jour statut | Admin |

### Exemple de paiement :
```json
POST /api/paiements
{
  "etudiant": "ID_ETUDIANT",
  "cours": "ID_COURS",
  "montant": 5000,
  "methode": "Espèces"
}
```

---

## 📊 Notes & Évaluations

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/notes` | Liste | Connecté |
| GET | `/api/notes?etudiantId=X&coursId=Y` | Filtrer | Connecté |
| POST | `/api/notes` | Ajouter note | Admin, Professeur |
| PUT | `/api/notes/:id` | Modifier | Admin, Professeur |
| GET | `/api/notes/moyenne/:etudiantId/:coursId` | Moyenne | Connecté |

---

## 🗓️ Emploi du Temps

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/emplois` | Tous les créneaux | Connecté |
| GET | `/api/emplois?jour=Lundi` | Filtrer par jour | Connecté |
| POST | `/api/emplois` | Créer créneau | Admin |
| PUT | `/api/emplois/:id` | Modifier | Admin |
| DELETE | `/api/emplois/:id` | Supprimer | Admin |

---

## 🏗️ Structure du Projet

```
school-backend/
├── config/
│   └── db.js              # Connexion MongoDB
├── controllers/
│   ├── authController.js
│   ├── etudiantController.js
│   ├── coursController.js
│   ├── professeurController.js
│   ├── paiementController.js
│   ├── noteController.js
│   └── emploiController.js
├── middleware/
│   └── auth.js            # JWT + Rôles
├── models/
│   ├── User.js
│   ├── Etudiant.js
│   ├── Professeur.js
│   ├── Cours.js
│   ├── Paiement.js
│   ├── Note.js
│   └── EmploiDuTemps.js
├── routes/
│   ├── auth.js
│   ├── etudiants.js
│   ├── cours.js
│   ├── professeurs.js
│   ├── paiements.js
│   ├── notes.js
│   └── emplois.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## 👥 Rôles & Permissions

| Rôle | Description |
|------|-------------|
| `admin` | Accès complet |
| `professeur` | Gérer ses cours, ajouter notes |
| `etudiant` | Voir ses cours, ses notes |

---

## 🛠️ Technologies

- **Node.js** + **Express.js** — Serveur web
- **MongoDB** + **Mongoose** — Base de données
- **JWT** — Authentification
- **bcryptjs** — Hachage des mots de passe
