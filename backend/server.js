const express      = require('express');
const dotenv       = require('dotenv');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit    = require('express-rate-limit');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

/* ══════════════════════════════════════════
   SECURITY MIDDLEWARE
══════════════════════════════════════════ */
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

/* ══════════════════════════════════════════
   RATE LIMITING
══════════════════════════════════════════ */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact limiter — prevent spam
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many contact requests. Please try again in 1 hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

/* ══════════════════════════════════════════
   BODY PARSER, COOKIE PARSER & LOGGER
══════════════════════════════════════════ */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

/* ══════════════════════════════════════════
   HEALTH CHECK
══════════════════════════════════════════ */
app.get('/', (req, res) => {
  res.json({
    success:   true,
    message:   '🎓 Language School API — Server online!',
    version:   '2.0.0',
    env:       process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'OK', uptime: process.uptime() });
});

/* ══════════════════════════════════════════
   ROUTES
══════════════════════════════════════════ */
app.use('/api/auth',          authLimiter,    require('./routes/auth'));
app.use('/api/contact',       contactLimiter, require('./routes/contact'));  // ← NEW
app.use('/api/users',                         require('./routes/users'));

const { protect }        = require('./middleware/auth');
const { getGlobalStats } = require('./controllers/userController');
app.get('/api/stats', protect, getGlobalStats);

app.use('/api/secretaire',    require('./routes/secretaire'));
app.use('/api/sections',      require('./routes/sections'));
app.use('/api/payments',      require('./routes/payments'));
app.use('/api/absences',      require('./routes/absences'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/cours',         require('./routes/cours'));
app.use('/api/emplois',       require('./routes/emplois'));
app.use('/api/notes',         require('./routes/notes'));
app.use('/api/messages',      require('./routes/messages'));
app.use('/api/teacher',       require('./routes/teacher'));
app.use('/api/parents',       require('./routes/parents'));
app.use('/api/professeurs',   require('./routes/professeurs'));
app.use('/api/etudiants',     require('./routes/etudiants'));
app.use('/api/registrations', require('./routes/registrations'));

/* ══════════════════════════════════════════
   404 & ERROR HANDLER
══════════════════════════════════════════ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

/* ══════════════════════════════════════════
   START SERVER
══════════════════════════════════════════ */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server started on port ${PORT}`);
  console.log(`📌 Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📋 Available routes:`);
  [
    'POST   /api/auth/login',
    'POST   /api/auth/register',
    'POST   /api/auth/refresh-token',
    'POST   /api/auth/logout',
    'POST   /api/auth/forgot-password',
    'POST   /api/auth/reset-password/:token',
    'GET    /api/auth/verify-email/:token',
    'GET    /api/auth/me',
    'PUT    /api/auth/update-profile',
    'PUT    /api/auth/change-password',
    'POST   /api/contact',                    // ← NEW
    'GET    /api/users',
    'GET    /api/health',
  ].forEach(r => console.log(`   ${r}`));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} already in use.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received — graceful shutdown...');
  server.close(() => { console.log('✅ Server stopped.'); process.exit(0); });
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = server;