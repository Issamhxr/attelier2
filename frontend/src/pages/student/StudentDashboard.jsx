import React, { useState, useEffect } from "react";
import "../../styles/DS.css";

/* ═══════════════════════════════════════════
   CECRL LEVELS
═══════════════════════════════════════════ */
const CECRL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const CECRL_COLORS = {
  A1: { color: "#A32D2D", bg: "#FCEBEB" },
  A2: { color: "#633806", bg: "#FAEEDA" },
  B1: { color: "#185FA5", bg: "#E6F1FB" },
  B2: { color: "#0C447C", bg: "#B5D4F4" },
  C1: { color: "#3B6D11", bg: "#EAF3DE" },
  C2: { color: "#27500A", bg: "#C0DD97" },
};

function scoreToLevel(score) {
  if (score >= 90) return "C2";
  if (score >= 78) return "C1";
  if (score >= 64) return "B2";
  if (score >= 50) return "B1";
  if (score >= 35) return "A2";
  return "A1";
}

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const SUBJECTS = [
  { icon: "🌐", name: "English",  present: 12, total: 14, pct: 86, color: "#185FA5" },
  { icon: "🇫🇷", name: "French",   present: 27, total: 29, pct: 93, color: "#3B6D11" },
  { icon: "🌍", name: "Spanish",  present: 1,  total: 30, pct: 1,  color: "#A32D2D" },
];

const WEEKLY = [
  { day: "Mon", present: 12, total: 14 },
  { day: "Tue", present: 10, total: 14 },
  { day: "Wed", present: 13, total: 14 },
  { day: "Thu", present: 11, total: 14 },
  { day: "Fri", present: 12, total: 14 },
];

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const TIMETABLE = {
  0: [],
  1: [
    { time: "08:00–09:30", room: "A101", subj: "English",  status: "done"     },
    { time: "10:00–11:30", room: "B204", subj: "French",   status: "done"     },
    { time: "14:00–15:30", room: "C302", subj: "French",   status: "upcoming" },
  ],
  2: [
    { time: "09:00–10:30", room: "A203", subj: "Spanish",  status: "done"     },
    { time: "11:00–12:30", room: "B101", subj: "English",  status: "upcoming" },
  ],
  3: [
    { time: "08:00–09:30", room: "A101", subj: "French",   status: "done"     },
    { time: "10:00–11:30", room: "C201", subj: "English",  status: "done"     },
  ],
  4: [
    { time: "09:00–10:30", room: "B302", subj: "French",   status: "done"     },
    { time: "11:00–12:30", room: "A104", subj: "Spanish",  status: "upcoming" },
    { time: "14:00–15:30", room: "C101", subj: "English",  status: "upcoming" },
  ],
  5: [
    { time: "08:00–09:30", room: "A201", subj: "English",  status: "done"     },
    { time: "10:00–11:30", room: "B103", subj: "French",   status: "done"     },
  ],
  6: [],
};

/* Évaluations : score % par compétence → niveau CECRL calculé automatiquement */
const INIT_EVALUATIONS = [
  {
    subject: "English",
    icon: "🌐",
    skills: {
      oral_expression:       { label: "Expression orale",     score: 72 },
      written_expression:    { label: "Expression écrite",    score: 68 },
      oral_comprehension:    { label: "Compréhension orale",  score: 75 },
      written_comprehension: { label: "Compréhension écrite", score: 80 },
    },
    coef: 3,
  },
  {
    subject: "French",
    icon: "🇫🇷",
    skills: {
      oral_expression:       { label: "Expression orale",     score: 85 },
      written_expression:    { label: "Expression écrite",    score: 78 },
      oral_comprehension:    { label: "Compréhension orale",  score: 90 },
      written_comprehension: { label: "Compréhension écrite", score: 83 },
    },
    coef: 3,
  },
  {
    subject: "Spanish",
    icon: "🌍",
    skills: {
      oral_expression:       { label: "Expression orale",     score: 20 },
      written_expression:    { label: "Expression écrite",    score: 18 },
      oral_comprehension:    { label: "Compréhension orale",  score: 22 },
      written_comprehension: { label: "Compréhension écrite", score: 15 },
    },
    coef: 3,
  },
];

function calcOverallScore(skills) {
  const vals = Object.values(skills).map(s => s.score);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

const INIT_EXAMS = [
  { subject: "English",  date: "2026-05-18", room: "B204", type: "Évaluation finale" },
  { subject: "French",   date: "2026-05-22", room: "C101", type: "Évaluation finale" },
  { subject: "Spanish",  date: "2026-05-28", room: "A103", type: "Évaluation finale" },
];

const INIT_TODOS = [
  { id: 1, text: "Réviser le vocabulaire B2 — English",        done: false, priority: "high"   },
  { id: 2, text: "Rendre dissertation French (vendredi)",       done: false, priority: "high"   },
  { id: 3, text: "Flashcards vocabulaire Spanish",              done: true,  priority: "medium" },
  { id: 4, text: "Exercices expression orale French",           done: false, priority: "medium" },
  { id: 5, text: "Compréhension écrite English — worksheet",    done: true,  priority: "low"    },
];

const ANNOUNCEMENTS = [
  { tag: "Académique",  tagClass: "db-tag-blue",  text: "Stage d'été avec projets en immersion linguistique.",  time: "2 min ago"  },
  { tag: "Activités",   tagClass: "db-tag-green", text: "Opportunité d'échange international — candidatures.",  time: "10 min ago" },
  { tag: "Évaluation",  tagClass: "db-tag-red",   text: "Instructions pour les évaluations CECRL du mois.",    time: "Yesterday"  },
];

const TEACHERS_ON_LEAVE = [
  { initials: "AB", name: "Abdellah Boumalek",  leave: "Full Day", bg: "#e6f1fb", color: "#185FA5" },
  { initials: "YB", name: "Youcef Boudjit",     leave: "Half Day", bg: "#eaf3de", color: "#3B6D11" },
  { initials: "MB", name: "Mohammed Bouchemot", leave: "Full Day", bg: "#faeeda", color: "#854f0b" },
];

const INIT_NOTIFICATIONS = [
  { id: 1, type: "exam",    icon: "📋", title: "Rappel évaluation",          msg: "Évaluation finale English le 18 mai en salle B204.",                    time: "5 min ago",  tag: "exam",    read: false },
  { id: 2, type: "grade",   icon: "📊", title: "Nouveau niveau publié",       msg: "Votre niveau French vient d'être mis à jour : B2.",                      time: "1h ago",     tag: "grade",   read: false },
  { id: 3, type: "absence", icon: "⚠️", title: "Alerte présence",             msg: "Votre présence en Spanish est critique (1/30). Intervention requise.",   time: "2h ago",     tag: "absence", read: false },
  { id: 4, type: "system",  icon: "🔔", title: "Mise à jour emploi du temps", msg: "Le cours French du jeudi a été déplacé en salle B401.",                  time: "Yesterday",  tag: "system",  read: true  },
  { id: 5, type: "grade",   icon: "📊", title: "Progression détectée",        msg: "Votre score en compréhension orale French : 90% → niveau C1.",           time: "2 days ago", tag: "grade",   read: true  },
  { id: 6, type: "system",  icon: "🔔", title: "Nouvelle annonce",            msg: "Candidatures au stage d'été ouvertes. Date limite : 1er mai.",            time: "3 days ago", tag: "system",  read: true  },
];

const INIT_EMAILS = [
  { id: 1, from: "Prof. Boumalek",     avatar: "AB", subject: "Feedback — Expression écrite English",         preview: "Bonjour Abdou, j'ai relu votre production et voici mes observations...", time: "10:32",    read: false, starred: true,  tag: "grade",   body: "Bonjour Abdou,\n\nJ'ai relu votre dernière production écrite en anglais. L'argumentation est claire et votre vocabulaire est riche.\n\nQuelques imprécisions grammaticales dans le 3e paragraphe — retravailler la voix passive.\n\nVotre score en expression écrite : 68% → Niveau B2.\n\nCordialement,\nProf. Boumalek" },
  { id: 2, from: "Administration",     avatar: "AD", subject: "Calendrier des évaluations — Mai 2026",        preview: "Veuillez trouver ci-dessous le calendrier des évaluations CECRL...",        time: "09:15",    read: false, starred: false, tag: "exam",    body: "Chers étudiants,\n\nVoici le calendrier des évaluations CECRL du semestre de printemps 2026 :\n\n• English — 18 mai, Salle B204\n• French — 22 mai, Salle C101\n• Spanish — 28 mai, Salle A103\n\nMerci d'arriver 15 minutes à l'avance avec votre carte étudiante.\n\nCordialement,\nL'Administration" },
  { id: 3, from: "Prof. Boudjit",      avatar: "YB", subject: "Avertissement présence — Spanish",             preview: "Ceci est un avertissement officiel concernant vos absences en Spanish...",   time: "Yesterday",read: true,  starred: false, tag: "absence", body: "Cher Abdou Bouchekrit,\n\nCeci est un avertissement officiel. Votre présence en Spanish est de 1 séance sur 30 (3,33%), bien en-dessous du minimum requis de 75%.\n\nSi la situation ne s'améliore pas, vous serez exclu des évaluations finales.\n\nMerci de me contacter pendant les heures de bureau.\n\nCordialement,\nProf. Boudjit" },
  { id: 4, from: "Prof. Bouchemot",    avatar: "MB", subject: "Exercice expression orale — délai prolongé",   preview: "Le délai pour l'exercice d'expression orale est prolongé d'une semaine...", time: "Mon",      read: true,  starred: true,  tag: "system",  body: "Bonjour à tous,\n\nBonne nouvelle — le délai pour l'exercice d'expression orale est prolongé d'une semaine. Nouvelle date limite : vendredi 25 avril à 23h59.\n\nSoumission via le portail en ligne uniquement.\n\nBonne continuation,\nProf. Bouchemot" },
  { id: 5, from: "Services Étudiants", avatar: "SS", subject: "Opportunité de stage linguistique",            preview: "Un nouveau stage d'immersion linguistique est disponible pour les étudiants...", time: "Sun",   read: true,  starred: false, tag: "system",  body: "Chers étudiants,\n\nUn nouveau stage d'été en immersion linguistique est disponible.\n\nEntreprise : Tech Solutions Algérie\nDurée : 2 mois (Juillet–Août)\nDomaine : Communication internationale\nDate limite : 15 mai 2026\n\nEnvoyez CV et lettre de motivation à stages@ums.dz.\n\nBonne chance !\nServices Étudiants" },
  { id: 6, from: "Prof. Boumalek",     avatar: "AB", subject: "Cours English annulé — Mercredi",              preview: "Le cours English de mercredi est annulé en raison d'une réunion pédagogique...", time: "Apr 14", read: true, starred: false, tag: "system",  body: "Chers étudiants,\n\nLe cours English de ce mercredi (15 avril) est annulé en raison d'une réunion pédagogique.\n\nLa séance sera reprogrammée. Je vous enverrai la nouvelle date prochainement.\n\nToutes mes excuses pour la gêne occasionnée.\n\nProf. Boumalek" },
];

const NAV_ITEMS = [
  { label: "Home",            section: "main",   icon: "grid"     },
  { label: "Évaluations",     section: "main",   icon: "grades"   },
  { label: "Examens",         section: "main",   icon: "exam"     },
  { label: "Emploi du temps", section: "main",   icon: "calendar" },
  { label: "To-Do",           section: "manage", icon: "todo"     },
  { label: "Notifications",   section: "manage", icon: "bell"     },
  { label: "Messagerie",      section: "manage", icon: "mail"     },
  { label: "Mot de passe",    section: "manage", icon: "lock"     },
  { label: "Paramètres",      section: "manage", icon: "settings" },
];

/* ═══════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════ */
const Icon = ({ name, size = 16 }) => {
  const s = { width: size, height: size };
  const p = { fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid:     <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    grades:   <svg viewBox="0 0 24 24" style={s} {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    exam:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    calendar: <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    todo:     <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    bell:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    mail:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:     <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    settings: <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    logout:   <svg viewBox="0 0 24 24" style={s} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus:     <svg viewBox="0 0 24 24" style={s} {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    check:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    trend:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    book:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    search:   <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    star:     <svg viewBox="0 0 24 24" style={s} {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    reply:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
    send:     <svg viewBox="0 0 24 24" style={s} {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    arrowLeft:<svg viewBox="0 0 24 24" style={s} {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    level:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    eyeOff:   <svg viewBox="0 0 24 24" style={s} {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  };
  return icons[name] || null;
};

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useCountUp(target, duration = 1200, suffix = "") {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let st = null;
    const step = (ts) => {
      if (!st) st = ts;
      const p = Math.min((ts - st) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target * 10) / 10);
      if (p < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return suffix === "%" ? value.toFixed(1) + "%" : value.toLocaleString();
}

function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target - now) / 86400000);
}

/* ═══════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════ */
function ProgressRing({ pct, color, size = 52 }) {
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <div className="db-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}/>
      </svg>
      <div className="db-ring-label" style={{ fontSize: size < 50 ? 10 : 11 }}>{pct}%</div>
    </div>
  );
}

function StatCard({ icon, label, value, delta, warn }) {
  return (
    <div className="db-stat">
      <div className="db-stat-ic"><Icon name={icon} size={18} /></div>
      <div className="db-stat-body">
        <span className="db-stat-lbl">{label}</span>
        <strong className="db-stat-val">{value}</strong>
        <span className={`db-stat-dl${warn ? " db-stat-warn" : ""}`}>{delta}</span>
      </div>
    </div>
  );
}

function CECRLBadge({ level, size = "md" }) {
  const c = CECRL_COLORS[level] || { color: "#666", bg: "#eee" };
  const padding = size === "lg" ? "5px 14px" : "3px 10px";
  const fontSize = size === "lg" ? 14 : 12;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: c.bg, color: c.color,
      borderRadius: 999, padding, fontSize, fontWeight: 700, letterSpacing: "0.05em",
      border: `1px solid ${c.color}33`,
    }}>
      {level}
    </span>
  );
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 36, textAlign: "right" }}>{score}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VIEWS
═══════════════════════════════════════════ */

/* ── HOME ── */
function HomeView() {
  const avgOverall = Math.round(SUBJECTS.reduce((s, x) => s + x.pct, 0) / SUBJECTS.length);
  const [offset, setOffset] = useState(0);

  const engVal     = useCountUp(86, 1200, "%");
  const frVal      = useCountUp(93, 1200, "%");
  const esVal      = useCountUp(1,  1200, "%");
  const overallVal = useCountUp(avgOverall, 1200, "%");

  const d = new Date(); d.setDate(d.getDate() + offset);
  const dayIdx = d.getDay();
  const label = offset === 0 ? "Aujourd'hui" : offset === -1 ? "Hier" : offset === 1 ? "Demain" : DAYS[dayIdx];
  const rows = TIMETABLE[dayIdx] || [];

  const [tooltip, setTooltip] = useState(null);
  const MAX_H = 110;

  return (
    <>
      <div className="db-stats">
        <StatCard icon="book"  label="Présence English"  value={engVal}     delta="12 / 14 cours" />
        <StatCard icon="book"  label="Présence French"   value={frVal}      delta="27 / 29 cours" />
        <StatCard icon="book"  label="Présence Spanish"  value={esVal}      delta="⚠ Seulement 1 / 30" warn />
        <StatCard icon="trend" label="Présence globale"  value={overallVal} delta="+2.1% vs semaine passée" />
      </div>

      <div className="db-mid">
        <div className="db-panel">
          <div className="db-ph">
            <div><span className="db-pt">Présence par langue</span><span className="db-ps">Semestre en cours</span></div>
            <span className="db-chip">Ce semestre</span>
          </div>
          <div className="db-subjects-grid">
            {SUBJECTS.map(s => (
              <div className="db-subj-card" key={s.name}>
                <div className="db-subj-icon">{s.icon}</div>
                <div className="db-subj-name">{s.name}</div>
                <div className="db-subj-count">{s.present}/{s.total}</div>
                <ProgressRing pct={s.pct} color={s.color} />
                <div className="db-subj-meta">Semestre actuel</div>
              </div>
            ))}
          </div>
        </div>

        <div className="db-mid-right">
          <div className="db-panel">
            <div className="db-ph"><span className="db-pt">Annonces</span></div>
            {ANNOUNCEMENTS.map((a, i) => (
              <div className="db-announce-item" key={i}>
                <span className={`db-announce-tag ${a.tagClass}`}>{a.tag}</span>
                <p className="db-announce-text">{a.text}</p>
                <div className="db-announce-time">{a.time}</div>
              </div>
            ))}
          </div>
          <div className="db-panel">
            <div className="db-ph"><span className="db-pt">Enseignants absents</span></div>
            {TEACHERS_ON_LEAVE.map((t, i) => (
              <div className="db-teacher-item" key={i}>
                <div className="db-teacher-av" style={{ background: t.bg, color: t.color }}>{t.initials}</div>
                <div>
                  <div className="db-teacher-name">{t.name}</div>
                  <div className="db-teacher-leave">{t.leave}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="db-bot">
        <div className="db-panel">
          <div className="db-ph">
            <div><span className="db-pt">Emploi du temps</span><span className="db-ps">{label} — {DAYS[dayIdx]}</span></div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="db-arr-btn" onClick={() => setOffset(o => o - 1)}>‹</button>
              <button className="db-arr-btn" onClick={() => setOffset(0)}>Aujourd'hui</button>
              <button className="db-arr-btn" onClick={() => setOffset(o => o + 1)}>›</button>
            </div>
          </div>
          <table className="db-table">
            <thead><tr><th>Heure</th><th>Salle</th><th>Langue</th><th>Statut</th></tr></thead>
            <tbody>
              {rows.length === 0
                ? <tr><td colSpan={4} className="db-empty-row">Aucun cours prévu</td></tr>
                : rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.time}</td><td>{r.room}</td><td>{r.subj}</td>
                    <td><span className={`db-status ${r.status === "done" ? "db-st-active" : "db-st-pending"}`}><span className="db-dot" />{r.status === "done" ? "Terminé" : "À venir"}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="db-panel">
          <div className="db-ph"><div><span className="db-pt">Présence hebdomadaire</span><span className="db-ps">% présence par jour</span></div></div>
          <div className="db-bar-wrap" style={{ position: "relative" }}>
            {WEEKLY.map(d => {
              const pct = Math.round((d.present / d.total) * 100);
              const h = Math.round((pct / 100) * MAX_H);
              return (
                <div className="db-bar-group" key={d.day}>
                  <div className="db-bar-row" style={{ height: MAX_H }}>
                    <div className="db-bar db-bar-blue" style={{ height: h }}
                      onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, day: d.day, pct })}
                      onMouseLeave={() => setTooltip(null)} />
                  </div>
                  <span className="db-bar-label">{d.day}</span>
                </div>
              );
            })}
            {tooltip && (
              <div className="db-chart-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}>
                <strong>{tooltip.day}</strong>{tooltip.pct}% présent
              </div>
            )}
          </div>
          <div className="db-avg-row">
            <span className="db-avg-lbl">Moy. hebdo</span>
            <div className="db-avg-track"><div className="db-avg-fill" style={{ width: `${avgOverall}%` }} /></div>
            <span className="db-avg-val">{avgOverall}%</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── ÉVALUATIONS (lecture seule pour l'étudiant) ── */
function EvaluationsView() {
  const evals = INIT_EVALUATIONS; // lecture seule — pas de useState modifiable
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      {/* Bandeau lecture seule */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        background: "linear-gradient(135deg, #EBF4FF, #F0F7FF)",
        border: "1px solid #A8CEFA",
        borderRadius: 10,
        fontSize: 12.5,
        color: "#0D4F94",
        fontWeight: 500,
      }}>
        <Icon name="eyeOff" size={15} />
        Les niveaux CECRL sont calculés et attribués par vos enseignants. Aucune modification n'est possible depuis ce portail.
      </div>

      {/* Résumé niveaux */}
      <div className="db-level-summary">
        {evals.map((ev) => {
          const overall = calcOverallScore(ev.skills);
          const level = scoreToLevel(overall);
          const c = CECRL_COLORS[level];
          return (
            <div className="db-level-card" key={ev.subject} style={{ borderTop: `3px solid ${c.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{ev.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--db-text)", fontFamily: "var(--font-head)" }}>{ev.subject}</div>
                  <div style={{ fontSize: 11, color: "var(--db-text2)" }}>Score global · Printemps 2026</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <CECRLBadge level={level} size="lg" />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 8, background: "rgba(0,0,0,0.07)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${overall}%`, height: "100%", background: `linear-gradient(90deg, ${c.color}, ${c.color}bb)`, borderRadius: 4, transition: "width 1.2s" }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: c.color, minWidth: 44, fontFamily: "var(--font-head)" }}>{overall}%</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--db-text3)", marginTop: 7 }}>
                Score moyen des 4 compétences
              </div>
            </div>
          );
        })}
      </div>

      {/* Détail par compétence */}
      <div className="db-panel">
        <div className="db-ph">
          <div>
            <span className="db-pt">Détail par compétence</span>
            <span className="db-ps">Score (%) → Niveau CECRL — Attribué par l'enseignant</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="db-chip">Printemps 2026</span>
            {/* Badge lecture seule compact */}
            <span className="db-readonly-badge">
              <Icon name="lock" size={11} /> Lecture seule
            </span>
          </div>
        </div>

        {/* Légende CECRL */}
        <div className="db-cecrl-legend">
          {CECRL_LEVELS.map(l => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CECRLBadge level={l} />
              <span style={{ fontSize: 11, color: "var(--db-text3)" }}>
                {l === "A1" ? "0–34%" : l === "A2" ? "35–49%" : l === "B1" ? "50–63%" : l === "B2" ? "64–77%" : l === "C1" ? "78–89%" : "90–100%"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
          {evals.map((ev, idx) => {
            const overall = calcOverallScore(ev.skills);
            const level = scoreToLevel(overall);
            const c = CECRL_COLORS[level];
            const isExpanded = expanded === idx;

            return (
              <div key={ev.subject} className="db-eval-block">
                {/* Header cliquable pour dérouler — lecture seule */}
                <div
                  className="db-eval-header"
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                >
                  <span style={{ fontSize: 20 }}>{ev.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--db-text)", fontFamily: "var(--font-head)" }}>{ev.subject}</span>
                  <ScoreBar score={overall} color={c.color} />
                  <CECRLBadge level={level} />
                  {/* Chevron expand/collapse */}
                  <span style={{ color: "var(--db-text3)", fontSize: 13, marginLeft: 6, transition: "transform 0.2s", display: "inline-block", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </div>

                {isExpanded && (
                  <div className="db-eval-skills">
                    {Object.entries(ev.skills).map(([key, skill]) => {
                      const skillLevel = scoreToLevel(skill.score);
                      const sc = CECRL_COLORS[skillLevel];
                      return (
                        <div key={key} className="db-eval-skill-row">
                          <span style={{ fontSize: 12, color: "var(--db-text2)", minWidth: 170 }}>{skill.label}</span>
                          <ScoreBar score={skill.score} color={sc.color} />
                          <CECRLBadge level={skillLevel} />
                        </div>
                      );
                    })}
                    {/* Note enseignant */}
                    <div style={{
                      marginTop: 6,
                      padding: "8px 12px",
                      background: "var(--db-bg)",
                      borderRadius: 8,
                      fontSize: 11.5,
                      color: "var(--db-text3)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      borderLeft: `3px solid ${c.color}55`,
                    }}>
                      <Icon name="lock" size={11} />
                      Les scores sont saisis par vos enseignants et ne peuvent pas être modifiés par l'étudiant.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="db-grades-footer">
          <span>Formule : moyenne des 4 compétences → niveau CECRL</span>
          <span>Niveaux : A1 · A2 · B1 · B2 · C1 · C2</span>
        </div>
      </div>
    </>
  );
}

/* ── EXAMENS ── */
function ExamsView() {
  const [exams, setExams] = useState(INIT_EXAMS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ subject: "", date: "", room: "", type: "Évaluation finale" });

  const addExam = () => {
    if (!form.subject || !form.date) return;
    setExams(e => [...e, { ...form }]);
    setForm({ subject: "", date: "", room: "", type: "Évaluation finale" });
    setShowAdd(false);
  };

  const removeExam = (i) => setExams(e => e.filter((_, idx) => idx !== i));
  const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <div className="db-exam-grid">
        {sorted.slice(0, 3).map((e, i) => {
          const days = daysUntil(e.date);
          const urgent = days <= 7;
          const passed = days < 0;
          return (
            <div className={`db-exam-card ${urgent && !passed ? "db-exam-urgent" : ""} ${passed ? "db-exam-passed" : ""}`} key={i}>
              <div className="db-exam-days">{passed ? "Passé" : days === 0 ? "Auj!" : days}</div>
              {!passed && days !== 0 && <div className="db-exam-dayslbl">jours restants</div>}
              <div className="db-exam-subj">{e.subject}</div>
              <div className="db-exam-meta">{new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · {e.room}</div>
              <span className="db-exam-type">{e.type}</span>
            </div>
          );
        })}
      </div>

      <div className="db-panel">
        <div className="db-ph">
          <div><span className="db-pt">Calendrier des évaluations</span><span className="db-ps">Toutes les évaluations à venir</span></div>
          <button className="db-add-btn" onClick={() => setShowAdd(s => !s)}>
            <Icon name="plus" size={14} /> Ajouter
          </button>
        </div>

        {showAdd && (
          <div className="db-add-form">
            <input className="db-form-input" placeholder="Langue (ex: English)" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
            <input className="db-form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <input className="db-form-input" placeholder="Salle" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} />
            <select className="db-form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option>Évaluation finale</option>
              <option>Évaluation intermédiaire</option>
              <option>Quiz oral</option>
              <option>Dictée</option>
            </select>
            <button className="db-save-btn" onClick={addExam}>Ajouter</button>
            <button className="db-cancel-btn" onClick={() => setShowAdd(false)}>Annuler</button>
          </div>
        )}

        <table className="db-table">
          <thead><tr><th>Langue</th><th>Date</th><th>Salle</th><th>Type</th><th>Délai</th><th></th></tr></thead>
          <tbody>
            {sorted.map((e, i) => {
              const days = daysUntil(e.date);
              const passed = days < 0;
              return (
                <tr key={i}>
                  <td><strong>{e.subject}</strong></td>
                  <td>{new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td>{e.room}</td>
                  <td><span className="db-type-badge">{e.type}</span></td>
                  <td>
                    {passed
                      ? <span className="db-status db-st-done"><span className="db-dot" />Passé</span>
                      : <span className={`db-days-badge ${days <= 7 ? "db-days-urgent" : ""}`}>{days === 0 ? "Auj!" : `${days}j`}</span>
                    }
                  </td>
                  <td>
                    <button className="db-icon-row-btn" onClick={() => removeExam(exams.indexOf(e))} title="Supprimer">
                      <Icon name="trash" size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── EMPLOI DU TEMPS ── */
function TimetableView() {
  const [offset, setOffset] = useState(0);
  const d = new Date(); d.setDate(d.getDate() + offset);
  const dayIdx = d.getDay();
  const label = offset === 0 ? "Aujourd'hui" : offset === -1 ? "Hier" : offset === 1 ? "Demain" : DAYS[dayIdx];
  const rows = TIMETABLE[dayIdx] || [];

  return (
    <div className="db-panel">
      <div className="db-ph">
        <div><span className="db-pt">Emploi du temps</span><span className="db-ps">{label} — {DAYS[dayIdx]}</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="db-arr-btn" onClick={() => setOffset(o => o - 1)}>‹ Préc.</button>
          <button className="db-arr-btn" onClick={() => setOffset(0)}>Aujourd'hui</button>
          <button className="db-arr-btn" onClick={() => setOffset(o => o + 1)}>Suiv. ›</button>
        </div>
      </div>
      {rows.length === 0
        ? <div className="db-empty-state">Aucun cours prévu pour {DAYS[dayIdx]}</div>
        : rows.map((r, i) => (
          <div className="db-tt-row" key={i}>
            <div className="db-tt-time">{r.time}</div>
            <div className="db-tt-body">
              <div className="db-tt-subj">{r.subj}</div>
              <div className="db-tt-room">Salle {r.room}</div>
            </div>
            <span className={`db-status ${r.status === "done" ? "db-st-active" : "db-st-pending"}`}>
              <span className="db-dot" />{r.status === "done" ? "Terminé" : "À venir"}
            </span>
          </div>
        ))
      }
    </div>
  );
}

/* ── TODO ── */
function TodoView() {
  const [todos, setTodos] = useState(INIT_TODOS);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(t => [...t, { id: Date.now(), text: input.trim(), done: false, priority }]);
    setInput("");
  };

  const toggle = (id) => setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const remove = (id) => setTodos(t => t.filter(x => x.id !== id));
  const filtered = todos.filter(t => filter === "all" ? true : filter === "active" ? !t.done : t.done);
  const priorityColors = {
    high:   { color: "#A32D2D", bg: "#FCEBEB" },
    medium: { color: "#633806", bg: "#FAEEDA" },
    low:    { color: "#3B6D11", bg: "#EAF3DE" },
  };
  const done = todos.filter(t => t.done).length;

  return (
    <>
      <div className="db-todo-header">
        <div className="db-todo-progress-info">
          <span>{done} sur {todos.length} tâches complétées</span>
          <span>{Math.round((done / todos.length) * 100) || 0}%</span>
        </div>
        <div className="db-avg-track" style={{ height: 7, background: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${Math.round((done / todos.length) * 100) || 0}%`, height: "100%", background: "#fff", borderRadius: 4, transition: "width 0.6s" }} />
        </div>
      </div>
      <div className="db-panel">
        <div className="db-todo-add">
          <input className="db-todo-input" placeholder="Ajouter une tâche…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTodo()} />
          <select className="db-prio-select" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
          <button className="db-save-btn" onClick={addTodo}><Icon name="plus" size={14} /> Ajouter</button>
        </div>
        <div className="db-todo-filters">
          {[["all","Tout"],["active","En cours"],["done","Terminé"]].map(([f, lbl]) => (
            <button key={f} className={`db-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {lbl}
              <span className="db-filter-count">
                {f === "all" ? todos.length : f === "active" ? todos.filter(t => !t.done).length : todos.filter(t => t.done).length}
              </span>
            </button>
          ))}
        </div>
        <div className="db-todo-list">
          {filtered.length === 0 && <div className="db-empty-state">Aucune tâche ici</div>}
          {filtered.map(t => (
            <div className={`db-todo-item ${t.done ? "db-todo-done" : ""}`} key={t.id}>
              <button className="db-check-btn" onClick={() => toggle(t.id)}>{t.done && <Icon name="check" size={12} />}</button>
              <span className="db-todo-text">{t.text}</span>
              <span className="db-prio-badge" style={{ background: priorityColors[t.priority].bg, color: priorityColors[t.priority].color }}>{t.priority}</span>
              <button className="db-icon-row-btn" onClick={() => remove(t.id)}><Icon name="trash" size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── NOTIFICATIONS ── */
function NotificationsView({ notifications, setNotifications }) {
  const [tab, setTab] = useState("All");
  const [toast, setToast] = useState(null);
  const tabs = [
    { label: "Tout",     key: "All"     },
    { label: "Examens",  key: "exam"    },
    { label: "Niveaux",  key: "grade"   },
    { label: "Absences", key: "absence" },
    { label: "Système",  key: "system"  },
  ];
  const filtered = tab === "All" ? notifications : notifications.filter(n => n.type === tab);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };
  const markAllRead = () => { setNotifications(ns => ns.map(n => ({ ...n, read: true }))); showToast("Toutes les notifications marquées comme lues."); };
  const deleteNotif = (id, e) => { e.stopPropagation(); setNotifications(ns => ns.filter(n => n.id !== id)); };
  const toggleRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: !n.read } : n));
  const clearAll = () => { setNotifications([]); showToast("Toutes les notifications supprimées."); };
  const unread = notifications.filter(n => !n.read).length;
  const icCls = { exam: "nt-ic-exam", grade: "nt-ic-grade", absence: "nt-ic-absence", system: "nt-ic-system" };
  const tagCls = { exam: "nt-tag-exam", grade: "nt-tag-grade", absence: "nt-tag-absence", system: "nt-tag-system" };

  return (
    <div className="nt-page">
      <div className="nt-topbar">
        <div>
          <div className="nt-title">Notifications</div>
          <span className="nt-sub">Restez informé de vos évaluations, niveaux et annonces</span>
        </div>
        <div className="nt-topbar-right">
          {unread > 0 && <button className="nt-btn nt-btn-ghost" onClick={markAllRead}><Icon name="check" size={13} />Tout marquer lu ({unread})</button>}
          {notifications.length > 0 && <button className="nt-btn nt-btn-danger" onClick={clearAll}><Icon name="trash" size={13} />Tout effacer</button>}
        </div>
      </div>
      <div className="db-panel" style={{ padding: 0 }}>
        <div style={{ padding: "0 18px" }}>
          <div className="nt-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`nt-tab${tab === t.key ? " nt-tab-active" : ""}`} onClick={() => setTab(t.key)}>
                {t.label}
                <span className="nt-tab-n">{t.key === "All" ? notifications.length : notifications.filter(n => n.type === t.key).length}</span>
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0
          ? <div className="nt-empty"><div className="nt-empty-ic"><Icon name="bell" size={20} /></div><span className="nt-empty-t">Aucune notification</span><span className="nt-empty-s">Vous êtes à jour !</span></div>
          : <div className="nt-list">
              {filtered.map(n => (
                <div key={n.id} className={`nt-item${!n.read ? " nt-item-unread" : ""}`} onClick={() => toggleRead(n.id)}>
                  <div className={`nt-item-ic ${icCls[n.type] || "nt-ic-system"}`}>{n.icon}</div>
                  <div className="nt-item-body">
                    <div className="nt-item-head">
                      <span className="nt-item-title">{n.title}</span>
                      {!n.read && <span className="nt-item-unread-dot" />}
                    </div>
                    <div className="nt-item-msg">{n.msg}</div>
                    <div className="nt-item-footer">
                      <span className="nt-item-time">{n.time}</span>
                      <span className={`nt-item-tag ${tagCls[n.tag] || "nt-tag-system"}`}>{n.tag}</span>
                    </div>
                  </div>
                  <button className="nt-item-del" title="Supprimer" onClick={e => deleteNotif(n.id, e)}><Icon name="trash" size={13} /></button>
                </div>
              ))}
            </div>
        }
      </div>
      {toast && <div className="nt-toast"><Icon name="check" size={14} />{toast}</div>}
    </div>
  );
}

/* ── MESSAGERIE ── */
function InboxView({ emails, setEmails }) {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const tabs = [
    { label: "Tout",     key: "All"     },
    { label: "Examens",  key: "exam"    },
    { label: "Niveaux",  key: "grade"   },
    { label: "Absences", key: "absence" },
    { label: "Autres",   key: "system"  },
  ];
  const filtered = emails.filter(e => {
    const matchTab = tab === "All" || e.tag === tab;
    const matchSearch = !search || e.from.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });
  const unread = emails.filter(e => !e.read).length;
  const openEmail = (email) => {
    setSelected(email); setShowReply(false); setReplyText("");
    if (!email.read) setEmails(es => es.map(e => e.id === email.id ? { ...e, read: true } : e));
  };
  const toggleStar = (id, ev) => { ev.stopPropagation(); setEmails(es => es.map(e => e.id === id ? { ...e, starred: !e.starred } : e)); };
  const deleteEmail = (id) => { setEmails(es => es.filter(e => e.id !== id)); setSelected(null); showToast("Message supprimé."); };
  const sendReply = () => { if (!replyText.trim()) return; setReplyText(""); setShowReply(false); showToast(`Réponse envoyée à ${selected.from}.`); };
  const tagColors = { exam: { bg: "#E6F1FB", color: "#185FA5" }, grade: { bg: "#EAF3DE", color: "#3B6D11" }, absence: { bg: "#FCEBEB", color: "#A32D2D" }, system: { bg: "#FAEEDA", color: "#633806" } };

  return (
    <div className="inbox-layout">
      <div className="inbox-list-pane">
        <div className="inbox-toolbar">
          <div className="db-search" style={{ flex: 1 }}>
            <Icon name="search" size={13} />
            <input type="text" placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {unread > 0 && <span className="inbox-unread-badge">{unread} non lus</span>}
        </div>
        <div className="inbox-tabs">
          {tabs.map(t => (
            <button key={t.key} className={`inbox-tab${tab === t.key ? " inbox-tab-active" : ""}`} onClick={() => setTab(t.key)}>
              {t.label}
              <span className="inbox-tab-n">{t.key === "All" ? emails.length : emails.filter(e => e.tag === t.key).length}</span>
            </button>
          ))}
        </div>
        <div className="inbox-messages">
          {filtered.length === 0 && <div className="db-empty-state" style={{ padding: "2rem" }}>Aucun message</div>}
          {filtered.map(email => (
            <div key={email.id} className={`inbox-msg${selected?.id === email.id ? " inbox-msg-selected" : ""}${!email.read ? " inbox-msg-unread" : ""}`} onClick={() => openEmail(email)}>
              <div className="inbox-msg-top">
                <div className="inbox-avatar">{email.avatar}</div>
                <div className="inbox-msg-meta">
                  <div className="inbox-msg-row1">
                    <span className="inbox-from">{email.from}</span>
                    <span className="inbox-time">{email.time}</span>
                  </div>
                  <div className="inbox-subject">{email.subject}</div>
                  <div className="inbox-preview">{email.preview}</div>
                </div>
                <button className={`inbox-star${email.starred ? " inbox-star-active" : ""}`} onClick={e => toggleStar(email.id, e)}>
                  <Icon name="star" size={13} />
                </button>
              </div>
              <div className="inbox-msg-footer">
                <span className="inbox-tag-badge" style={{ background: tagColors[email.tag]?.bg, color: tagColors[email.tag]?.color }}>{email.tag}</span>
                {!email.read && <span className="inbox-unread-dot" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="inbox-detail-pane">
        {selected ? (
          <>
            <div className="inbox-detail-header">
              <button className="db-arr-btn" onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Icon name="arrowLeft" size={14} /> Retour
              </button>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                <button className="db-edit-btn" onClick={() => setShowReply(s => !s)}><Icon name="reply" size={13} /> Répondre</button>
                <button className="db-icon-row-btn" onClick={() => deleteEmail(selected.id)}><Icon name="trash" size={13} /></button>
              </div>
            </div>
            <div className="inbox-detail-subject">{selected.subject}</div>
            <div className="inbox-detail-from">
              <div className="inbox-avatar">{selected.avatar}</div>
              <div>
                <div className="inbox-from" style={{ fontSize: 13 }}>{selected.from}</div>
                <div style={{ fontSize: 11, color: "var(--db-text3)" }}>À : Abdou Bouchekrit · {selected.time}</div>
              </div>
              <span className="inbox-tag-badge" style={{ marginLeft: "auto", background: tagColors[selected.tag]?.bg, color: tagColors[selected.tag]?.color }}>{selected.tag}</span>
            </div>
            <div className="inbox-detail-body">
              {selected.body.split("\n").map((line, i) => <p key={i} style={{ margin: "2px 0", minHeight: 14 }}>{line}</p>)}
            </div>
            {showReply && (
              <div className="inbox-reply-box">
                <div className="inbox-reply-label">Répondre à {selected.from}</div>
                <textarea className="inbox-reply-textarea" placeholder="Écrivez votre réponse…" value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                  <button className="db-cancel-btn" onClick={() => setShowReply(false)}>Annuler</button>
                  <button className="db-save-btn" onClick={sendReply}><Icon name="send" size={13} /> Envoyer</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="inbox-empty-detail">
            <Icon name="mail" size={32} />
            <span>Sélectionnez un message pour le lire</span>
          </div>
        )}
      </div>
      {toast && <div className="nt-toast"><Icon name="check" size={14} />{toast}</div>}
    </div>
  );
}

/* ── PARAMÈTRES ── */
function SettingsView() {
  const [active, setActive] = useState("Profil");
  const [savedToast, setSavedToast] = useState(false);
  const [profile, setProfile] = useState({ fname: "Abdou", lname: "Bouchekrit", email: "abdou.bouchekrit@ums.dz", phone: "+213 5 00 00 00 00", id: "12102030" });
  const [notifPrefs, setNotifPrefs] = useState({ emailGrades: true, emailExams: true, emailSystem: false, pushGrades: true, pushExams: true, pushSystem: true });
  const [security, setSecurity] = useState({ currentPwd: "", newPwd: "", confirmPwd: "" });
  const [secErrors, setSecErrors] = useState({});

  const showSaved = () => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2500); };

  const Toggle = ({ value, onChange }) => (
    <label className="st-toggle"><input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} /><span className="st-toggle-slider" /></label>
  );

  const sections = ["Profil", "Notifications", "Sécurité"];
  const navIcons = { Profil: <Icon name="settings" size={14} />, Notifications: <Icon name="bell" size={14} />, Sécurité: <Icon name="lock" size={14} /> };

  const validatePassword = () => {
    const e = {};
    if (!security.currentPwd) e.currentPwd = true;
    if (security.newPwd.length < 8) e.newPwd = true;
    if (security.newPwd !== security.confirmPwd) e.confirmPwd = true;
    setSecErrors(e);
    return Object.keys(e).length === 0;
  };

  const renderSection = () => {
    if (active === "Profil") return (
      <div className="st-section">
        <span className="st-section-title">Informations personnelles</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Prénom", "fname", profile.fname], ["Nom", "lname", profile.lname]].map(([label, key, val]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
              <input className="st-input" value={val} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
        {[["Email", "email", "email", profile.email], ["Téléphone", "phone", "tel", profile.phone], ["N° étudiant", "id", "text", profile.id]].map(([label, key, type, val]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
            <input className="st-input" type={type} value={val} style={{ maxWidth: "100%" }} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
          </div>
        ))}
        <div className="st-save-row">
          <button className="st-btn-cancel">Réinitialiser</button>
          <button className="st-btn-save" onClick={showSaved}>Enregistrer</button>
        </div>
      </div>
    );
    if (active === "Notifications") return (
      <div className="st-section">
        <span className="st-section-title">Préférences de notifications</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--db-text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Notifications par email</span>
          {[["Niveaux CECRL", "emailGrades"], ["Examens & rappels", "emailExams"], ["Système", "emailSystem"]].map(([label, key]) => (
            <div key={key} className="st-row">
              <div><span className="st-field-label">{label}</span></div>
              <div className="st-toggle-wrap"><Toggle value={notifPrefs[key]} onChange={v => setNotifPrefs(p => ({ ...p, [key]: v }))} /><span className="st-toggle-label">{notifPrefs[key] ? "Activé" : "Désactivé"}</span></div>
            </div>
          ))}
          <div style={{ borderTop: "var(--db-border)", paddingTop: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--db-text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Notifications push</span>
          </div>
          {[["Niveaux", "pushGrades"], ["Examens", "pushExams"], ["Système", "pushSystem"]].map(([label, key]) => (
            <div key={key} className="st-row">
              <div><span className="st-field-label">{label}</span></div>
              <div className="st-toggle-wrap"><Toggle value={notifPrefs[key]} onChange={v => setNotifPrefs(p => ({ ...p, [key]: v }))} /><span className="st-toggle-label">{notifPrefs[key] ? "Activé" : "Désactivé"}</span></div>
            </div>
          ))}
        </div>
        <div className="st-save-row"><button className="st-btn-save" onClick={showSaved}>Enregistrer</button></div>
      </div>
    );
    if (active === "Sécurité") return (
      <div className="st-section">
        <span className="st-section-title">Sécurité du compte</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[["Mot de passe actuel", "currentPwd", "Votre mot de passe actuel"], ["Nouveau mot de passe", "newPwd", "Minimum 8 caractères"], ["Confirmer le nouveau", "confirmPwd", "Répéter le nouveau mot de passe"]].map(([label, key, placeholder]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
              <input type="password" className="st-input" placeholder={placeholder} value={security[key]}
                style={{ maxWidth: "100%", borderColor: secErrors[key] ? "var(--db-red)" : undefined }}
                onChange={e => { setSecurity(s => ({ ...s, [key]: e.target.value })); setSecErrors(er => ({ ...er, [key]: false })); }} />
              {secErrors[key] && <span style={{ fontSize: 11, color: "var(--db-red)" }}>{key === "confirmPwd" ? "Les mots de passe ne correspondent pas" : key === "newPwd" ? "Minimum 8 caractères" : "Requis"}</span>}
            </div>
          ))}
          <button className="st-btn-save" style={{ alignSelf: "flex-start" }} onClick={() => { if (validatePassword()) showSaved(); }}>Mettre à jour</button>
        </div>
      </div>
    );
  };

  return (
    <div className="st-page">
      <div className="st-nav">
        {sections.map(s => (
          <button key={s} className={`st-nav-item${active === s ? " st-nav-active" : ""}`} onClick={() => setActive(s)}>
            {navIcons[s]}{s}
          </button>
        ))}
      </div>
      <div className="st-content">{renderSection()}</div>
      {savedToast && <div className="st-saved-toast"><Icon name="check" size={14} />Modifications enregistrées !</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
const Dashboard = () => {
  const [activeNav, setActiveNav] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);
  const [emails, setEmails] = useState(INIT_EMAILS);

  const unreadNotif = notifications.filter(n => !n.read).length;
  const unreadMail  = emails.filter(e => !e.read).length;

  const renderView = () => {
    switch (activeNav) {
      case "Évaluations":     return <EvaluationsView />;
      case "Examens":         return <ExamsView />;
      case "Emploi du temps": return <TimetableView />;
      case "To-Do":           return <TodoView />;
      case "Notifications":   return <NotificationsView notifications={notifications} setNotifications={setNotifications} />;
      case "Messagerie":      return <InboxView emails={emails} setEmails={setEmails} />;
      case "Paramètres":
      case "Mot de passe":    return <SettingsView />;
      default:                return <HomeView />;
    }
  };

  return (
    <div className={`db-layout${collapsed ? " db-collapsed" : ""}`}>
      <aside className="db-sidebar">
        <div className="db-logo">
          <div className="db-logo-icon"><Icon name="book" size={16} /></div>
          {!collapsed && <div className="db-logo-text"><h2>UMS</h2><span>Portail Étudiant</span></div>}
        </div>
        <button className="db-toggle" onClick={() => setCollapsed(!collapsed)}>{collapsed ? "›" : "‹"}</button>

        {!collapsed && (
          <div className="db-sidebar-profile">
            <div className="db-sidebar-av">AB</div>
            <div>
              <div className="db-sidebar-name">Abdou Bouchekrit</div>
              <div className="db-sidebar-meta"><span>12102030</span><span className="db-sidebar-dot">·</span><span>EN · FR · ES</span></div>
            </div>
          </div>
        )}

        <nav className="db-nav">
          {["main", "manage"].map(section => (
            <React.Fragment key={section}>
              {!collapsed && <span className="db-nav-label" style={section === "manage" ? { marginTop: 10 } : {}}>{section === "main" ? "Principal" : "Compte"}</span>}
              {NAV_ITEMS.filter(n => n.section === section).map(n => (
                <button key={n.label} className={`db-nav-item${activeNav === n.label ? " db-nav-active" : ""}`} onClick={() => setActiveNav(n.label)}>
                  <span className="db-nav-icon"><Icon name={n.icon} size={16} /></span>
                  {!collapsed && (
                    <span className="db-nav-text">
                      {n.label}
                      {n.label === "Notifications" && unreadNotif > 0 && <span className="db-notif-badge">{unreadNotif}</span>}
                      {n.label === "Messagerie" && unreadMail > 0 && <span className="db-notif-badge">{unreadMail}</span>}
                    </span>
                  )}
                  {collapsed && n.label === "Notifications" && unreadNotif > 0 && <span className="db-notif-dot-collapsed" />}
                  {collapsed && n.label === "Messagerie" && unreadMail > 0 && <span className="db-notif-dot-collapsed" />}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
        <button className="tc-nav-item tc-nav-danger" onClick={() => {
  localStorage.removeItem("token");
  localStorage.removeItem("nom");
  localStorage.removeItem("prenom");
  window.location.href = "/login";
}}>
            <span className="db-nav-icon"><Icon name="logout" size={16} /></span>
            {!collapsed && <span className="db-nav-text">Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-header-title">{activeNav}</div>
            <span className="db-header-sub">20 Avril 2026 · Semestre Printemps</span>
          </div>
          <div className="db-search">
            <Icon name="search" size={13} />
            <input type="text" placeholder="Rechercher cours, niveaux…" />
          </div>
          <div className="db-header-right">
            <button className="db-icon-btn" title="Messagerie" onClick={() => setActiveNav("Messagerie")} style={{ position: "relative" }}>
              <Icon name="mail" size={17} />
              {unreadMail > 0 && <span className="db-badge" />}
            </button>
            <button className="db-icon-btn" title="Notifications" onClick={() => setActiveNav("Notifications")} style={{ position: "relative" }}>
              <Icon name="bell" size={17} />
              {unreadNotif > 0 && <span className="db-badge" />}
            </button>
            <div className="db-profile" onClick={() => setActiveNav("Paramètres")}>
              <div className="db-avatar">AB</div>
              <div><span className="db-pname">Abdou</span><span className="db-prole">Étudiant</span></div>
            </div>
          </div>
        </header>
        <main className="db-content">{renderView()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
