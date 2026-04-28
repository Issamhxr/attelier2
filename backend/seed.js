// seed.js — Données de test complètes
require('dotenv').config();
const mongoose = require('mongoose');

const User         = require('./models/User');
const Etudiant     = require('./models/Etudiant');
const Professeur   = require('./models/Professeur');
const Parent       = require('./models/Parent');
const Cours        = require('./models/Cours');
const Section      = require('./models/Section');
const Absence      = require('./models/Absence');
const Payment      = require('./models/Payment');
const Notification = require('./models/Notification');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connecté');

  // Nettoyer
  await Promise.all([
    User.deleteMany(),
    Etudiant.deleteMany(),
    Professeur.deleteMany(),
    Parent.deleteMany(),
    Cours.deleteMany(),
    Section.deleteMany(),
    Absence.deleteMany(),
    Payment.deleteMany(),
    Notification.deleteMany(),
  ]);
  console.log('🗑️  Base de données vidée');

  // ── Admin ──
  const admin = await User.create({
    nom: 'Admin', prenom: 'School',
    email: 'admin@schoolcore.com',
    password: 'Admin123!',
    role: 'admin', actif: true,
  });

  // ── Secrétaire ──
  const sec = await User.create({
    nom: 'Secrétaire', prenom: 'Test',
    email: 'secretaire@schoolcore.com',
    password: 'Secret123!',
    role: 'secretaire', actif: true,
    department: 'Administration',
  });

  // ── Professeurs ──
  const profUser1 = await User.create({
    nom: 'Benali', prenom: 'Karim',
    email: 'karim@schoolcore.com',
    password: 'Prof123!',
    role: 'professeur', telephone: '0551111111',
    specialty: 'English', hours: 18, actif: true,
  });
  const professeur1 = await Professeur.create({
    user: profUser1._id,
    specialites: ['English', 'French'],
    anneesExperience: 5,
    bio: 'Professeur certifié IELTS',
  });

  const profUser2 = await User.create({
    nom: 'Meziane', prenom: 'Sara',
    email: 'sara.prof@schoolcore.com',
    password: 'Prof123!',
    role: 'professeur', telephone: '0552222222',
    specialty: 'French', hours: 16, actif: true,
  });
  const professeur2 = await Professeur.create({
    user: profUser2._id,
    specialites: ['French'],
    anneesExperience: 3,
  });

  // ── Sections ──
  const sectionA = await Section.create({
    name: 'Section A', language: 'English', level: 'B2',
    teacherId: profUser1._id, teacherName: 'Karim Benali',
    teacher: 'Karim Benali',
    time: 'Lun/Mer 09h00–10h30',
    room: 'A101', capacity: 12, studentsCount: 0, actif: true,
  });

  const sectionB = await Section.create({
    name: 'Section B', language: 'French', level: 'A1',
    teacherId: profUser2._id, teacherName: 'Sara Meziane',
    teacher: 'Sara Meziane',
    time: 'Mar/Jeu 11h00–12h30',
    room: 'B102', capacity: 12, studentsCount: 0, actif: true,
  });

  // ── Cours ──
  const cours1 = await Cours.create({
    nom: 'English B2', langue: 'Anglais', niveau: 'Avancé',
    description: 'Cours d\'anglais niveau B2',
    duree: 90, prix: 4500, capaciteMax: 12,
    professeur: professeur1._id, actif: true,
  });

  // ── Étudiants ──
  const etu1 = await User.create({
    nom: 'Boumalek', prenom: 'Abdellah',
    email: 'abdellah@gmail.com',
    password: 'Etudiant123!',
    role: 'etudiant', telephone: '0661001001',
    language: 'English', level: 'B2',
    section: 'Section A', actif: true,
  });
  await Etudiant.create({ user: etu1._id, niveauActuel: 'Avancé' });

  const etu2 = await User.create({
    nom: 'Djebali', prenom: 'Rania',
    email: 'rania@gmail.com',
    password: 'Etudiant123!',
    role: 'etudiant', telephone: '0661002002',
    language: 'French', level: 'A1',
    section: 'Section B', actif: true,
  });
  await Etudiant.create({ user: etu2._id, niveauActuel: 'Débutant' });

  // Étudiant en attente
  const etu3 = await User.create({
    nom: 'Kaci', prenom: 'Sofiane',
    email: 'sofiane@gmail.com',
    password: 'Etudiant123!',
    role: 'etudiant', telephone: '0661003003',
    language: 'English', level: 'B2',
    actif: false, // En attente
  });

  // ── Parent ──
  const parentUser = await User.create({
    nom: 'Boumalek', prenom: 'Mohammed',
    email: 'parent@gmail.com',
    password: 'Parent123!',
    role: 'parent', telephone: '0550001001',
    actif: true, relation: 'Père',
    linkedStudent: etu1._id,
  });
  await Parent.create({
    user: parentUser._id,
    enfants: [etu1._id],
    relation: 'Père',
  });

  // ── Absences ──
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 5);

  await Absence.create({
    student: etu1._id, language: 'English', level: 'B2',
    date: lastWeek, session: 'Morning',
    reason: 'Sick', justified: true,
  });
  await Absence.create({
    student: etu2._id, language: 'French', level: 'A1',
    date: today, session: 'Morning',
    reason: 'Unknown', justified: false,
  });

  // Mettre à jour le compteur absences
  await User.findByIdAndUpdate(etu1._id, { absences: 1 });
  await User.findByIdAndUpdate(etu2._id, { absences: 1 });

  // ── Paiements ──
  await Payment.create({
    student: etu1._id, language: 'English', level: 'B2',
    amount: 4500, paid: 4500,
    due: new Date(today.getFullYear(), today.getMonth(), 10),
    method: 'Espèces', status: 'paid',
  });
  await Payment.create({
    student: etu2._id, language: 'French', level: 'A1',
    amount: 3800, paid: 0,
    due: new Date(today.getFullYear(), today.getMonth() - 1, 15),
    method: '—', status: 'overdue',
  });

  // ── Notifications ──
  await Notification.create({
    type: 'payment', icon: '💳',
    title: 'Paiement reçu',
    msg: 'Abdellah Boumalek a payé 4 500 DA pour English B2.',
    tag: 'payment', read: false,
  });
  await Notification.create({
    type: 'absence', icon: '📋',
    title: 'Absence non justifiée',
    msg: 'Rania Djebali est absente (French A1 — Matin).',
    tag: 'absence', read: false,
  });
  await Notification.create({
    type: 'system', icon: '🔔',
    title: 'Bienvenue',
    msg: 'Système initialisé avec succès.',
    tag: 'system', read: true,
  });

  console.log('\n✅ Données de test créées !');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin       : admin@schoolcore.com     / Admin123!');
  console.log('🔑 Secrétaire  : secretaire@schoolcore.com / Secret123!');
  console.log('👨‍🏫 Professeur 1 : karim@schoolcore.com     / Prof123!');
  console.log('👨‍🏫 Professeur 2 : sara.prof@schoolcore.com / Prof123!');
  console.log('👨‍🎓 Étudiant 1  : abdellah@gmail.com        / Etudiant123!');
  console.log('👨‍🎓 Étudiant 2  : rania@gmail.com            / Etudiant123!');
  console.log('👨‍🎓 En attente  : sofiane@gmail.com           / Etudiant123!');
  console.log('👪 Parent       : parent@gmail.com           / Parent123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Erreur seed:', err.message);
  process.exit(1);
});