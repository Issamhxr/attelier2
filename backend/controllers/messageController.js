const Message = require('../models/Message');
const User    = require('../models/User');

function formatMessageTime(date) {
  const d = new Date(date), now = new Date(), diff = now - d;
  if (diff < 86400000) return d.toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' });
  if (diff < 172800000) return 'Hier';
  return d.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' });
}
function initials(name) {
  return (name || '??').split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();
}

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id })
      .populate('sender', 'nom prenom role')
      .sort({ createdAt: -1 }).lean();

    const formatted = messages.map(m => ({
      _id: m._id, id: m._id,
      from: `${m.sender?.prenom || ''} ${m.sender?.nom || ''}`.trim() || 'Inconnu',
      sender: m.sender, subject: m.subject, body: m.body,
      preview: (m.body || '').slice(0, 80) + '…',
      tag: m.tag || 'sys', read: m.read, starred: m.starred || false,
      time: formatMessageTime(m.createdAt),
      avatar: initials(`${m.sender?.prenom || ''} ${m.sender?.nom || ''}`),
    }));
    return res.json({ success: true, messages: formatted });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getSentMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .populate('recipient', 'nom prenom role')
      .sort({ createdAt: -1 }).lean();
    return res.json({ success: true, messages });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ recipient: req.user.id, read: false });
    return res.json({ success: true, count });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'nom prenom role email')
      .populate('recipient', 'nom prenom role email');
    if (!message) return res.status(404).json({ success: false, message: 'Message introuvable.' });

    const recipientId = message.recipient?._id?.toString() || message.recipient?.toString();
    const senderId    = message.sender?._id?.toString()    || message.sender?.toString();
    if (recipientId !== req.user.id && senderId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Accès refusé.' });
    }
    if (recipientId === req.user.id && !message.read) { message.read = true; await message.save(); }
    return res.json({ success: true, message })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const recipientId = req.body.to || req.body.recipientId;
    const { subject, body, tag } = req.body;
    if (!recipientId || !subject || !body) {
      return res.status(400).json({ success: false, message: 'Destinataire, sujet et corps requis.' });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ success: false, message: 'Destinataire introuvable.' });

    const message = await Message.create({
      sender: req.user.id, recipient: recipientId, subject, body, tag: tag || 'sys', read: false, starred: false,
    });
    await message.populate('sender', 'nom prenom role');
    await message.populate('recipient', 'nom prenom role');
    return res.status(201).json({ success: true, message });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.replyMessage = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ success: false, message: 'Le corps de la réponse est requis.' });
    const original = await Message.findById(req.params.id);
    if (!original) return res.status(404).json({ success: false, message: 'Message original introuvable.' });

    const reply = await Message.create({
      sender: req.user.id, recipient: original.sender,
      subject: original.subject.startsWith('Re:') ? original.subject : `Re: ${original.subject}`,
      body, tag: original.tag || 'sys', read: false, starred: false,
    });
    await reply.populate('sender', 'nom prenom role');
    await reply.populate('recipient', 'nom prenom role');
    return res.status(201).json({ success: true, message: reply });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.toggleStar = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    message.starred = !message.starred;
    await message.save();
    return res.json({ success: true, starred: message.starred });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    return res.json({ success: true, message });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    const isOwner = message.sender.toString() === req.user.id || message.recipient.toString() === req.user.id;
    if (!isOwner) return res.status(403).json({ success: false, message: 'Accès refusé.' });
    await message.deleteOne();
    return res.json({ success: true, message: 'Message supprimé.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await User.find({ _id: { $ne: req.user.id }, actif: true })
      .select('_id nom prenom email role').sort({ nom: 1 }).lean();
    return res.json({ success: true, contacts });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};