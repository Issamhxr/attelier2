const Notification = require('../models/Notification');
const User         = require('../models/User');

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Hier';
  if (d < 7)  return `Il y a ${d} jours`;
  return new Date(date).toLocaleDateString('fr-DZ');
}

exports.getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifs = await Notification.find({
      $or: [
        { recipients: { $size: 0 } },
        { recipients: userId },
      ],
    }).sort({ createdAt: -1 }).limit(100).lean();

    const formatted = notifs.map(n => ({
      id: n._id, type: n.type, icon: n.icon || '🔔', title: n.title, msg: n.msg,
      tag: n.tag || n.type,
      read: n.recipients?.length > 0
        ? (n.readBy || []).some(id => id.toString() === userId)
        : n.read,
      targets: n.targets,
      time: timeAgo(n.createdAt), createdAt: n.createdAt,
    }));
    return res.json({ success: true, notifications: formatted });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, msg, type, targets, recipientRole, recipientIds } = req.body;
    if (!title || !msg) return res.status(400).json({ success: false, message: 'Titre et message requis.' });

    const iconMap = { system: '🔔', absence: '📋', alert: '⚠️', payment: '💳' };
    let recipients = [];

    if (recipientIds && recipientIds.length > 0) {
      recipients = recipientIds;
    } else if (recipientRole) {
      const users = await User.find({ role: recipientRole, actif: true }).select('_id').lean();
      recipients = users.map(u => u._id);
    } else if (targets && targets.length > 0) {
      for (const target of targets) {
        const t = target.toLowerCase();
        let query = { actif: true };
        if (t.includes('étudiant') || t.includes('etudiant')) query.role = 'etudiant';
        else if (t.includes('enseignant') || t.includes('professeur')) query.role = 'professeur';
        else if (t.includes('parent')) query.role = 'parent';
        else if (t.includes('secrétaire') || t.includes('secretaire')) query.role = 'secretaire';
        const users = await User.find(query).select('_id').lean();
        recipients.push(...users.map(u => u._id));
      }
      recipients = [...new Map(recipients.map(id => [id.toString(), id])).values()];
    }

    const notif = await Notification.create({
      title, msg, type: type || 'system', icon: iconMap[type] || '🔔',
      tag: type || 'system', targets: targets || [], recipients,
      createdBy: req.user.id, read: false, readBy: [],
    });

    return res.status(201).json({
      success: true,
      notification: { id: notif._id, title: notif.title, msg: notif.msg, type: notif.type, recipients: recipients.length, time: "À l'instant" },
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.markRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ success: false, message: 'Notification introuvable.' });
    if (notif.recipients.length > 0) {
      await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: req.user.id } });
    } else {
      await Notification.findByIdAndUpdate(req.params.id, { read: true });
    }
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.markAllRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ recipients: { $size: 0 }, read: false }, { read: true });
    await Notification.updateMany({ recipients: userId }, { $addToSet: { readBy: userId } });
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteOne = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteAll = async (req, res) => {
  try {
    await Notification.deleteMany({});
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({
      $or: [
        { recipients: { $size: 0 }, read: false },
        { recipients: userId, readBy: { $ne: userId } },
      ],
    });
    return res.json({ success: true, count });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};