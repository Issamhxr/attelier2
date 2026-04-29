const Payment = require('../models/Payment');
const User    = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const [agg, monthly] = await Promise.all([
      Payment.aggregate([{
        $group: {
          _id: null, total: { $sum: '$amount' }, collected: { $sum: '$paid' },
          paidCount:    { $sum: { $cond: [{ $eq: ['$status', 'paid'] },    1, 0] } },
          partialCount: { $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] } },
          pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          overdueCount: { $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] } },
        },
      }]),
      Payment.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, collected: { $sum: '$paid' }, total: { $sum: '$amount' } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    const s = agg[0] || {};
    return res.json({
      success: true, stats: {
        total: s.total || 0, collected: s.collected || 0, pending: (s.total || 0) - (s.collected || 0),
        counts: { paid: s.paidCount || 0, partial: s.partialCount || 0, pending: s.pendingCount || 0, overdue: s.overdueCount || 0 },
        monthly,
      },
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getPayments = async (req, res) => {
  try {
    const { status, search } = req.query;
    await Payment.updateMany({ status: 'pending', due: { $lt: new Date() }, paid: 0 }, { $set: { status: 'overdue' } });
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    let payments = await Payment.find(filter)
      .populate('student', 'nom prenom email language level section')
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      payments = payments.filter(p => {
        const name = `${p.student?.prenom || ''} ${p.student?.nom || ''}`.toLowerCase();
        return name.includes(q) || (p.invoiceId || '').toLowerCase().includes(q);
      });
    }

    const formatted = payments.map(p => ({
      id: p._id, invoiceId: p.invoiceId,
      student: `${p.student?.prenom || ''} ${p.student?.nom || ''}`.trim() || p.studentName || '—',
      studentId: p.student?._id, section: p.student?.section || p.section || '—',
      lang: p.language, level: p.level, amount: p.amount, paid: p.paid,
      remaining: p.amount - p.paid, due: p.due, status: p.status, method: p.method,
    }));
    return res.json({ success: true, payments: formatted });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.createPayment = async (req, res) => {
  try {
    const { studentId, language, level, amount, due, method } = req.body;
    if (!amount || !due) return res.status(400).json({ success: false, message: 'Montant et date obligatoires.' });
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return res.status(400).json({ success: false, message: 'Montant invalide.' });

    let student = null;
    if (studentId) { student = await User.findById(studentId); if (!student) return res.status(404).json({ success: false, message: 'Étudiant introuvable.' }); }

    const payment = await Payment.create({
      student: studentId || null,
      language: language || student?.language || '',
      level: level || student?.level || '',
      amount: parsedAmount, paid: parsedAmount,
      due: new Date(due), method: method || 'Espèces', status: 'paid',
    });
    return res.status(201).json({ success: true, message: 'Facture créée.', payment });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.registerPayment = async (req, res) => {
  try {
    const { amount, method } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Facture introuvable.' });
    if (payment.status === 'paid') return res.status(400).json({ success: false, message: 'Cette facture est déjà soldée.' });
    const versement = amount ? parseFloat(amount) : payment.amount - payment.paid;
    if (isNaN(versement) || versement <= 0) return res.status(400).json({ success: false, message: 'Montant invalide.' });
    payment.paid   = Math.min(payment.paid + versement, payment.amount);
    payment.method = method || payment.method;
    await payment.save();
    return res.json({ success: true, message: 'Paiement enregistré.', payment });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Facture introuvable.' });
    return res.json({ success: true, message: 'Facture supprimée.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};