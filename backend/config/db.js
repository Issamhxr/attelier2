const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`📦 Base de données  : ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB :', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB déconnecté — tentative de reconnexion...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnecté.');
    });

  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;