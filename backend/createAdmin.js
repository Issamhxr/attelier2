require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.create({
    nom: 'Admin',
    prenom: 'School',
    email: 'admin@schoolcore.com',
    password: 'Admin123!',
    role: 'admin',
    actif: true
  });
  console.log('✅ Admin créé !');
  process.exit();
});