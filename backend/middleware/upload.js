const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const UPLOAD_DIR = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sub = file.mimetype.startsWith('image/') ? 'images' : 'documents';
    const dir = path.join(UPLOAD_DIR, sub);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext    = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

const fileFilter = (allowedTypes) => (req, file, cb) => {
  const allowed = allowedTypes || [
    'image/jpeg','image/png','image/gif','image/webp',
    'application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error(`Type de fichier non autorisé : ${file.mimetype}`), false);
};

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;

exports.uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter(['image/jpeg','image/png','image/webp']),
}).single('avatar');

exports.uploadDocument = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter(),
}).single('document');

exports.uploadMultiple = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter(),
}).array('files', 5);

exports.handleUploadError = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, message: `Fichier trop volumineux. Maximum : ${Math.round(MAX_SIZE / 1024 / 1024)}MB` });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: err.message });
  });
};