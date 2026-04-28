const nodemailer = require('nodemailer');

const ROLE_LABELS = {
  etudiant:   'Student',
  professeur: 'Teacher',
  secretaire: 'Secretary',
  parent:     'Parent',
  admin:      'Administrator',
};

/* ══════════════════════════════════════════
   CREATE TRANSPORTER
══════════════════════════════════════════ */
function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/* ══════════════════════════════════════════
   BASE EMAIL TEMPLATE
══════════════════════════════════════════ */
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A6CC4,#0D4F94);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:1px;">📚 Language School</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Language School — All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

/* ══════════════════════════════════════════
   GENERIC sendEmail (used by authController)
══════════════════════════════════════════ */
exports.sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n📧 [DEV MODE — Email not sent]`);
    console.log(`   To      : ${to}`);
    console.log(`   Subject : ${subject}`);
    console.log(`   (Configure SMTP_USER and SMTP_PASS in .env to send real emails)\n`);
    return;
  }

  const info = await transporter.sendMail({
    from:    `"${process.env.FROM_NAME || 'Language School'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`✅ Email sent to ${to} — Message ID: ${info.messageId}`);
};

/* ══════════════════════════════════════════
   WELCOME EMAIL
══════════════════════════════════════════ */
exports.sendWelcomeEmail = async ({ to, name, role, tempPassword }) => {
  const subject = 'Welcome — Your Language School Account';
  const html = baseTemplate(`
    <h2 style="color:#1a1a1a;margin-top:0;">Welcome, ${name}!</h2>
    <p style="color:#4b5563;">Your <strong style="color:#1A6CC4;">${ROLE_LABELS[role] || role}</strong> account has been created.</p>
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Your temporary password:</p>
      <p style="margin:0;font-size:24px;font-weight:bold;color:#1A6CC4;letter-spacing:3px;">${tempPassword}</p>
    </div>
    <p style="color:#ef4444;font-size:14px;">⚠️ Please change this password after your first login.</p>
  `);

  await exports.sendEmail({ to, subject, html });
};

/* ══════════════════════════════════════════
   FORGOT PASSWORD EMAIL
══════════════════════════════════════════ */
exports.sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const subject = 'Password Reset — Language School';
  const html = baseTemplate(`
    <h2 style="color:#1a1a1a;margin-top:0;">Password Reset Request</h2>
    <p style="color:#4b5563;">Hello <strong>${name}</strong>,</p>
    <p style="color:#4b5563;">You requested a password reset. Click the button below — this link is valid for <strong>1 hour</strong>.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}"
         style="display:inline-block;padding:14px 32px;background:#1A6CC4;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
        Reset My Password
      </a>
    </div>
    <p style="color:#6b7280;font-size:13px;">Or copy this link into your browser:</p>
    <p style="color:#1A6CC4;font-size:12px;word-break:break-all;">${resetUrl}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="color:#9ca3af;font-size:12px;">If you did not request this, you can safely ignore this email. Your password will not change.</p>
  `);

  await exports.sendEmail({ to, subject, html });
};

/* ══════════════════════════════════════════
   CONTACT ADMIN EMAIL (sent to admin)
══════════════════════════════════════════ */
exports.sendContactAdminEmail = async ({ adminEmail, senderName, senderEmail, message }) => {
  const subject = `New Access Request — ${senderName}`;
  const html = baseTemplate(`
    <h2 style="color:#1a1a1a;margin-top:0;">New Access Request</h2>
    <p style="color:#4b5563;">Someone has requested access to Language School:</p>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:24px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;">Full name:</td>
          <td style="padding:8px 0;color:#1a1a1a;font-weight:bold;">${senderName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;">Email:</td>
          <td style="padding:8px 0;"><a href="mailto:${senderEmail}" style="color:#1A6CC4;">${senderEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">Message:</td>
          <td style="padding:8px 0;color:#1a1a1a;">${message.replace(/\n/g, '<br>')}</td>
        </tr>
      </table>
    </div>
    <p style="color:#4b5563;font-size:14px;">You can reply directly to this email to contact the applicant.</p>
  `);

  await exports.sendEmail({ to: adminEmail, subject, html, replyTo: senderEmail });
};

/* ══════════════════════════════════════════
   CONTACT ADMIN CONFIRMATION (sent to sender)
══════════════════════════════════════════ */
exports.sendContactConfirmationEmail = async ({ to, name }) => {
  const subject = 'Request Received — Language School';
  const html = baseTemplate(`
    <h2 style="color:#1a1a1a;margin-top:0;">Request Received ✅</h2>
    <p style="color:#4b5563;">Hello <strong>${name}</strong>,</p>
    <p style="color:#4b5563;">Your access request has been received and will be reviewed by the administrator shortly.</p>
    <p style="color:#4b5563;">You will be contacted at this email address once your account is created.</p>
    <p style="color:#9ca3af;font-size:13px;margin-top:32px;">If you have any urgent questions, please contact the school directly.</p>
  `);

  await exports.sendEmail({ to, subject, html });
};

/* ══════════════════════════════════════════
   ABSENCE ALERT
══════════════════════════════════════════ */
exports.sendAbsenceAlert = async ({ studentEmail, studentName, date, session, language }) => {
  const subject = 'Absence Recorded — Language School';
  const html = baseTemplate(`
    <h2 style="color:#C0352A;margin-top:0;">⚠️ Absence Recorded</h2>
    <p style="color:#4b5563;">Dear <strong>${studentName}</strong>,</p>
    <p style="color:#4b5563;">An absence has been recorded for you:</p>
    <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:8px;padding:20px;margin:24px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;width:100px;">Date:</td>
          <td style="padding:6px 0;color:#1a1a1a;font-weight:bold;">${new Date(date).toLocaleDateString('en-GB')}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Session:</td>
          <td style="padding:6px 0;color:#1a1a1a;">${session}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Course:</td>
          <td style="padding:6px 0;color:#1a1a1a;">${language}</td>
        </tr>
      </table>
    </div>
    <p style="color:#6b7280;font-size:13px;">If this absence is justified, please contact the school secretary.</p>
  `);

  await exports.sendEmail({ to: studentEmail, subject, html });
};