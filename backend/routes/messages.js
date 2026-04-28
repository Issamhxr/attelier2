// routes/messages.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

// ⚠️ Routes statiques avant /:id
router.get('/contacts',       ctrl.getContacts);
router.get('/sent',           ctrl.getSentMessages);
router.get('/unread-count',   ctrl.getUnreadCount);

router.get('/',               ctrl.getMessages);
router.post('/',              ctrl.sendMessage);

router.get('/:id',            ctrl.getMessage);
router.post('/:id/reply',     ctrl.replyMessage);
router.patch('/:id/star',     ctrl.toggleStar);
router.patch('/:id/read',     ctrl.markAsRead);
router.delete('/:id',         ctrl.deleteMessage);

module.exports = router;