import React, { useState, useEffect, useMemo } from "react";
import "../../styles/Dashboard.css";
import "../../styles/DP.css";
import { useNotifications } from "../../hooks/useNotifications";
import { useParentData } from '../../hooks/useParentData';
import { useSocket } from "../../hooks/useSocket";

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const CHILD = {
  name: "Bouchekrit Rami",
  parent: "Mohammed Bouchekrit",
  level: "C1",
  language: "English",
  since: "Sep 2025",
};

const MARKS = [
  {
    subject: "English C1",
    icon: "🇬🇧",
    score: 16,
    max: 20,
    status: "Good",
    date: "2026-04-01",
  },
  {
    subject: "French B1",
    icon: "🇫🇷",
    score: 14,
    max: 20,
    status: "Fair",
    date: "2026-04-02",
  },
  {
    subject: "Spanish A1",
    icon: "🇪🇸",
    score: 14,
    max: 20,
    status: "Fair",
    date: "2026-04-02",
  },
  {
    subject: "Grammar",
    icon: "📝",
    score: 18,
    max: 20,
    status: "Excellent",
    date: "2026-03-28",
  },
  {
    subject: "Oral Exam",
    icon: "🎤",
    score: 15,
    max: 20,
    status: "Good",
    date: "2026-03-20",
  },
];

const ABSENCES = [
  {
    id: 1,
    subject: "English C1",
    time: "08:00 - 09:00",
    session: "Morning",
    date: "2026-04-14",
    status: "present",
    justified: true,
  },
  {
    id: 2,
    subject: "French B1",
    time: "09:00 - 10:00",
    session: "Morning",
    date: "2026-04-14",
    status: "absent",
    justified: false,
  },
  {
    id: 3,
    subject: "Spanish A1",
    time: "10:30 - 11:30",
    session: "Morning",
    date: "2026-04-14",
    status: "present",
    justified: true,
  },
  {
    id: 4,
    subject: "English C1",
    time: "13:00 - 14:00",
    session: "Evening",
    date: "2026-04-14",
    status: "absent",
    justified: false,
  },
  {
    id: 5,
    subject: "Grammar",
    time: "08:00 - 09:00",
    session: "Morning",
    date: "2026-04-10",
    status: "present",
    justified: true,
  },
  {
    id: 6,
    subject: "Oral Exam",
    time: "10:30 - 11:30",
    session: "Morning",
    date: "2026-04-10",
    status: "present",
    justified: true,
  },
  {
    id: 7,
    subject: "French B1",
    time: "14:00 - 15:00",
    session: "Evening",
    date: "2026-04-07",
    status: "absent",
    justified: true,
  },
  {
    id: 8,
    subject: "Spanish A1",
    time: "08:00 - 09:00",
    session: "Morning",
    date: "2026-04-03",
    status: "present",
    justified: true,
  },
];

const TIMETABLE = {
  Monday: [
    {
      time: "08:00 - 09:00",
      subject: "B1 Grammar",
      room: "Room 101",
      level: "B1",
      status: "active",
    },
    {
      time: "09:00 - 10:00",
      subject: "C2 Debate",
      room: "Room 104",
      level: "C2",
      status: "active",
    },
    {
      time: "10:00 - 10:30",
      subject: "Break",
      room: "",
      level: "",
      status: "break",
    },
    {
      time: "10:30 - 12:00",
      subject: "C1 Project",
      room: "Room 103",
      level: "C1",
      status: "review",
    },
    {
      time: "12:00 - 13:00",
      subject: "A1 Reading",
      room: "Room 109",
      level: "A1",
      status: "upcoming",
    },
    {
      time: "13:00 - 14:00",
      subject: "Lunch Break",
      room: "",
      level: "",
      status: "break",
    },
  ],
  Tuesday: [
    {
      time: "08:00 - 09:00",
      subject: "B2 Speaking",
      room: "Room 102",
      level: "B2",
      status: "active",
    },
    {
      time: "09:00 - 10:00",
      subject: "C1 Reading",
      room: "Room 103",
      level: "C1",
      status: "active",
    },
    {
      time: "10:00 - 10:30",
      subject: "Break",
      room: "",
      level: "",
      status: "break",
    },
    {
      time: "10:30 - 12:00",
      subject: "C2 Presentation",
      room: "Room 104",
      level: "C2",
      status: "review",
    },
    {
      time: "12:00 - 13:00",
      subject: "A2 Pairwork",
      room: "Room 110",
      level: "A2",
      status: "upcoming",
    },
    {
      time: "13:00 - 14:00",
      subject: "Lunch Break",
      room: "",
      level: "",
      status: "break",
    },
  ],
  Wednesday: [
    {
      time: "08:00 - 09:00",
      subject: "C1 Writing",
      room: "Room 103",
      level: "C1",
      status: "active",
    },
    {
      time: "09:00 - 10:00",
      subject: "A2 Vocabulary",
      room: "Room 110",
      level: "A2",
      status: "active",
    },
    {
      time: "10:00 - 10:30",
      subject: "Break",
      room: "",
      level: "",
      status: "break",
    },
    {
      time: "10:30 - 12:00",
      subject: "A1 Practice",
      room: "Room 109",
      level: "A1",
      status: "active",
    },
    {
      time: "12:00 - 13:00",
      subject: "B1 Conversation",
      room: "Room 101",
      level: "B1",
      status: "upcoming",
    },
    {
      time: "13:00 - 14:00",
      subject: "Lunch Break",
      room: "",
      level: "",
      status: "break",
    },
  ],
  Thursday: [
    {
      time: "08:00 - 09:00",
      subject: "C2 Exam Prep",
      room: "Room 104",
      level: "C2",
      status: "active",
    },
    {
      time: "09:00 - 10:00",
      subject: "A1 Phonics",
      room: "Room 109",
      level: "A1",
      status: "active",
    },
    {
      time: "10:00 - 10:30",
      subject: "Break",
      room: "",
      level: "",
      status: "break",
    },
    {
      time: "10:30 - 12:00",
      subject: "A2 Grammar",
      room: "Room 110",
      level: "A2",
      status: "review",
    },
    {
      time: "12:00 - 13:00",
      subject: "B2 Writing",
      room: "Room 102",
      level: "B2",
      status: "upcoming",
    },
    {
      time: "13:00 - 14:00",
      subject: "Lunch Break",
      room: "",
      level: "",
      status: "break",
    },
  ],
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday"];

/* ══════════════════════════════════════════════════════════════
   HELPERS  (same pattern as Dashboard.jsx)
══════════════════════════════════════════════════════════════ */
const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const levelClass = (lvl, prefix = "pt") => {
  if (!lvl) return "";
  const c = lvl[0].toLowerCase();
  return c === "a"
    ? `${prefix}-lv-a`
    : c === "b"
      ? `${prefix}-lv-b`
      : `${prefix}-lv-c`;
};
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const gradeClass = (score, max) => {
  const pct = (score / max) * 100;
  if (pct >= 85) return "pm-grade-excellent";
  if (pct >= 70) return "pm-grade-good";
  if (pct >= 55) return "pm-grade-fair";
  return "pm-grade-fail";
};

const barColor = (score, max) => {
  const pct = (score / max) * 100;
  if (pct >= 85) return "var(--db-green)";
  if (pct >= 70) return "var(--db-blue)";
  if (pct >= 55) return "#B45309";
  return "var(--db-red)";
};

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(e * target * 10) / 10);
      if (p < 1) requestAnimationFrame(step);
    };
    const r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [target, duration]);
  return value;
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD  (same as Dashboard.jsx StatCard)
══════════════════════════════════════════════════════════════ */
function StatCard({ icon, label, value, delta, icBg, icColor, deltaColor }) {
  return (
    <div className="db-stat">
      <div
        className="db-stat-ic"
        style={icBg ? { background: icBg, color: icColor } : {}}
      >
        {icon}
      </div>
      <div className="db-stat-body">
        <span className="db-stat-lbl">{label}</span>
        <strong className="db-stat-val">{value}</strong>
        <span
          className="db-stat-dl"
          style={deltaColor ? { color: deltaColor } : {}}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MARKS PAGE
══════════════════════════════════════════════════════════════ */
// APRÈS
function MarksPage({ notes }) {
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Convertir notes backend → format MARKS
  const MARKS = (notes || []).map(n => ({
    subject: n.cours?.langue || n.cours?.nom || 'Matière',
    icon:    (n.cours?.langue||'').toLowerCase().includes('english') ? '🇬🇧'
           : (n.cours?.langue||'').toLowerCase().includes('french')  ? '🇫🇷'
           : (n.cours?.langue||'').toLowerCase().includes('spanish') ? '🇪🇸' : '📝',
    score:   n.note,
    max:     n.noteMax || 20,
    status:  n.note >= 17 ? 'Excellent' : n.note >= 14 ? 'Good' : n.note >= 10 ? 'Fair' : 'Fail',
    date:    n.dateEvaluation || n.createdAt,
  }));

  // Si aucune note disponible
  if (!MARKS.length) return (
    <div className="db-panel" style={{ padding:24, textAlign:'center', color:'var(--db-text3)' }}>
      Aucune note disponible pour le moment.
    </div>
  );

  const avg = Math.round(
    MARKS.reduce((s, m) => s + (m.score / m.max) * 100, 0) / MARKS.length,
  );
  const best = MARKS.reduce((a, b) =>
    b.score / b.max > a.score / a.max ? b : a,
  );
  const needsWork = MARKS.reduce((a, b) =>
    b.score / b.max < a.score / a.max ? b : a,
  );

  return (
    <div className="pm-page">
      <div className="pm-topbar">
        <div>
          <div className="pm-topbar-title">Student Marks</div>
          <span className="pm-topbar-sub">
            Academic performance — Spring 2026
          </span>
        </div>
        <div className="pm-topbar-right">
          <button className="pm-btn-export">
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary mini cards */}
      <div className="pm-summary-row">
        <div className="pm-mini pm-mini-accent">
          <strong className="pm-mini-val">{avg}%</strong>
          <span className="pm-mini-lbl">Average score</span>
        </div>
        <div className="pm-mini pm-mini-green">
          <strong className="pm-mini-val">{MARKS.length}</strong>
          <span className="pm-mini-lbl">Subjects graded</span>
        </div>
        <div className="pm-mini pm-mini-amber">
          <strong className="pm-mini-val">{best.subject.split(" ")[0]}</strong>
          <span className="pm-mini-lbl">Best subject</span>
        </div>
        <div className="pm-mini pm-mini-red">
          <strong className="pm-mini-val">
            {needsWork.subject.split(" ")[0]}
          </strong>
          <span className="pm-mini-lbl">Needs improvement</span>
        </div>
      </div>

      {/* Marks table + radar */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 12 }}
      >
        <div className="db-panel">
          <div className="db-ph">
            <div>
              <span className="db-pt">Grade details</span>
              <span className="db-ps">All subjects · Spring 2026</span>
            </div>
            <span className="db-chip">{MARKS.length} exams</span>
          </div>
          <div className="pm-table-wrap">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Progress</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {MARKS.map((m) => (
                  <tr key={m.subject}>
                    <td>
                      <div className="pm-subj-cell">
                        <div className="pm-subj-icon">{m.icon}</div>
                        {m.subject}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {m.score} / {m.max}
                    </td>
                    <td>
                      <span
                        className={`pm-grade ${gradeClass(m.score, m.max)}`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div className="pm-bar-wrap">
                        <div className="pm-bar-track">
                          <div
                            className="pm-bar-fill"
                            style={{
                              width: barVisible
                                ? `${(m.score / m.max) * 100}%`
                                : "0%",
                              background: barColor(m.score, m.max),
                            }}
                          />
                        </div>
                        <span className="pm-bar-pct">
                          {Math.round((m.score / m.max) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ color: "var(--db-text2)" }}>
                      {formatDate(m.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Radar / performance chart */}
        <div className="db-panel">
          <div className="db-ph">
            <span className="db-pt">Performance overview</span>
          </div>
          <div className="pm-radar-wrap">
            {MARKS.map((m) => (
              <div className="pm-radar-row" key={m.subject}>
                <span className="pm-radar-lbl" title={m.subject}>
                  {m.subject}
                </span>
                <div className="pm-radar-track">
                  <div
                    className="pm-radar-fill"
                    style={{
                      width: barVisible ? `${(m.score / m.max) * 100}%` : "0%",
                      background: barColor(m.score, m.max),
                    }}
                  />
                </div>
                <span className="pm-radar-val">
                  {m.score}/{m.max}
                </span>
              </div>
            ))}
          </div>
          {/* Global avg progress */}
          <div className="db-avg-row" style={{ marginTop: 18 }}>
            <span className="db-avg-lbl">Global avg</span>
            <div className="db-avg-track">
              <div
                className="db-avg-fill"
                style={{ width: barVisible ? `${avg}%` : "0%" }}
              />
            </div>
            <span className="db-avg-val">{avg}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ABSENCES PAGE
══════════════════════════════════════════════════════════════ */
function AbsencesPage({ absences: absencesData }) {
  const ABSENCES = (absencesData || []).map((a, i) => ({
    id:        a._id || i,
    subject:   a.language || '—',
    time:      a.session  || '—',
    session:   a.session  || 'Morning',
    date:      a.date,
    status:    a.justified ? 'present' : 'absent',
    justified: a.justified,
  }));

  const present   = ABSENCES.filter(a => a.status === 'present').length;
  const absent    = ABSENCES.filter(a => a.status === 'absent').length;
  const justified = ABSENCES.filter(a => a.status === 'absent' && a.justified).length;
  const rate      = ABSENCES.length > 0 ? Math.round((present / ABSENCES.length) * 100) : 100;

  // Calendrier dynamique basé sur le mois courant
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const firstOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const rec = ABSENCES.find(a => {
      const aDate = new Date(a.date).toISOString().split('T')[0];
      return aDate === dateStr;
    });
    const dayOfWeek = new Date(year, month, d).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFuture  = new Date(year, month, d) > now;
    return { d, dateStr, rec, isWeekend, isFuture };
  });

  const cells = [...Array(firstOffset).fill(null), ...monthDays];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const cellClass = (cell) => {
    if (!cell) return 'pa-heatmap-cell pa-cell-empty';
    if (cell.isFuture)  return 'pa-heatmap-cell pa-cell-future';
    if (cell.isWeekend) return 'pa-heatmap-cell pa-cell-empty';
    if (!cell.rec)      return 'pa-heatmap-cell';
    return cell.rec.status === 'present'
      ? 'pa-heatmap-cell pa-cell-present'
      : 'pa-heatmap-cell pa-cell-absent';
  };

  const monthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="pa-page">
      <div className="pa-topbar">
        <div>
          <div className="pa-topbar-title">Student Absences</div>
          <span className="pa-topbar-sub">Attendance records — {monthName}</span>
        </div>
      </div>

      <div className="pa-summary-row">
        <div className="pa-mini pa-mini-green">
          <strong className="pa-mini-val">{present}</strong>
          <span className="pa-mini-lbl">Sessions attended</span>
        </div>
        <div className="pa-mini pa-mini-red">
          <strong className="pa-mini-val">{absent}</strong>
          <span className="pa-mini-lbl">Sessions missed</span>
        </div>
        <div className="pa-mini pa-mini-amber">
          <strong className="pa-mini-val">{justified}</strong>
          <span className="pa-mini-lbl">Justified absences</span>
        </div>
        <div className="pa-mini">
          <strong className="pa-mini-val">{rate}%</strong>
          <span className="pa-mini-lbl">Attendance rate</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', gap:12 }}>
        <div className="db-panel">
          <div className="db-ph">
            <div>
              <span className="db-pt">Session records</span>
              <span className="db-ps">{ABSENCES.length} sessions logged</span>
            </div>
          </div>
          {ABSENCES.length === 0 ? (
            <div style={{ padding:24, textAlign:'center', color:'var(--db-text3)' }}>
              Aucune absence enregistrée.
            </div>
          ) : (
            <div className="pa-table-wrap">
              <table className="pa-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Session</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ABSENCES.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight:500 }}>{a.subject}</td>
                      <td>
                        <span className={`pa-session pa-sess-${(a.session||'morning').toLowerCase()}`}>
                          {a.session}
                        </span>
                      </td>
                      <td style={{ color:'var(--db-text2)' }}>{formatDate(a.date)}</td>
                      <td>
                        <span className={`pa-status ${a.status === 'present' ? 'pa-present' : a.justified ? 'pa-justified' : 'pa-absent'}`}>
                          <span className="pa-dot" />
                          {a.status === 'present' ? 'Attended' : a.justified ? 'Justified' : 'Missed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="db-panel">
          <div className="db-ph">
            <span className="db-pt">{monthName}</span>
          </div>
          <div style={{ display:'flex', gap:4, marginBottom:6 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} style={{ width:28, textAlign:'center', fontSize:10, color:'var(--db-text3)', fontWeight:500 }}>
                {d}
              </div>
            ))}
          </div>
          <div className="pa-heatmap">
            {weeks.map((week, wi) => (
              <div className="pa-heatmap-week" key={wi}>
                {week.map((cell, ci) =>
                  !cell ? (
                    <div key={ci} style={{ width:28, height:28 }} />
                  ) : (
                    <div key={ci} className={cellClass(cell)} title={cell.dateStr}>
                      {cell.d}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
          <div className="pa-heatmap-legend">
            <div className="pa-legend-item">
              <div className="pa-legend-swatch" style={{ background:'var(--db-green-bg)', border:'1px solid var(--db-green-mid)' }} />
              Attended
            </div>
            <div className="pa-legend-item">
              <div className="pa-legend-swatch" style={{ background:'var(--db-red-bg)', border:'1px solid #D9A4A4' }} />
              Missed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   TIMETABLE PAGE
══════════════════════════════════════════════════════════════ */
function TimetablePage({ emplois }) {
  const FR_TO_EN = {0:'Sunday',1:'Monday',2:'Tuesday',3:'Wednesday',4:'Thursday',5:'Friday',6:'Saturday'};
  const EN_TO_NUM = {Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};
  const todayName = FR_TO_EN[new Date().getDay()] || 'Monday';
  const [activeDay, setActiveDay] = useState(DAYS.includes(todayName) ? todayName : 'Monday');

  const sessions = (emplois || [])
    .filter(e => e.dayOfWeek === EN_TO_NUM[activeDay])
    .map(e => ({
      time:    `${e.startTime} - ${e.endTime}`,
      subject: e.subject || '—',
      room:    e.room    || '—',
      level:   e.section || '',
      status:  'upcoming',
    }));

  const lessons   = sessions.filter(s => s.status !== 'break');
  const nextBreak = sessions.find(s => s.status === 'break');

  const statusClass = (s) => {
    if (s === "break") return "pt-status-break";
    if (s === "active") return "pt-status-active";
    if (s === "review") return "pt-status-review";
    if (s === "upcoming") return "pt-status-upcoming";
    return "";
  };
  const statusLabel = (s) => {
    if (s === "break") return "Break";
    if (s === "active") return "Active";
    if (s === "review") return "In review";
    if (s === "upcoming") return "Upcoming";
    return s;
  };

  return (
    <div className="pt-page">
      <div className="pt-topbar">
        <div>
          <div className="pt-topbar-title">Weekly Timetable</div>
          <span className="pt-topbar-sub">Course schedule — Spring 2026</span>
        </div>
      </div>

      {/* Day selector */}
      <div className="db-panel" style={{ padding: "0 16px" }}>
        <div className="pt-day-tabs">
          {DAYS.map((day) => (
            <button
              key={day}
              className={`pt-day-tab${activeDay === day ? " pt-day-tab-active" : ""}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
              {day === (DAYS.includes(todayName) ? todayName : "") && (
                <span className="pt-today-badge">Today</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="pt-summary-row">
        <div className="pt-mini">
          <strong className="pt-mini-val">{lessons.length}</strong>
          <span className="pt-mini-lbl">Sessions today</span>
        </div>
        <div className="pt-mini">
          <strong className="pt-mini-val">
            {lessons.filter((s) => s.status === "active").length}
          </strong>
          <span className="pt-mini-lbl">Active now</span>
        </div>
        <div className="pt-mini">
          <strong className="pt-mini-val">
            {nextBreak ? nextBreak.time : "—"}
          </strong>
          <span className="pt-mini-lbl">Next break</span>
        </div>
      </div>

      {/* Session cards */}
      <div className="db-panel">
        <div className="db-ph">
          <div>
            <span className="db-pt">{activeDay}'s schedule</span>
            <span className="db-ps">
              {lessons.length} lessons ·{" "}
              {sessions.filter((s) => s.status === "break").length} breaks
            </span>
          </div>
        </div>
        <div className="pt-sessions">
          {sessions.map((s, i) =>
            s.status === "break" ? (
              <div className="pt-session-break" key={i}>
                ☕ {s.subject} &nbsp;·&nbsp; {s.time}
              </div>
            ) : (
              <div className="pt-session-card" key={i}>
                <div
                  className={`pt-session-time${s.status === "active" ? " pt-session-time-active" : ""}`}
                >
                  {s.time.split(" - ").map((t, ti) => (
                    <span key={ti}>{t}</span>
                  ))}
                </div>
                <div className="pt-session-body">
                  <div className="pt-session-title">{s.subject}</div>
                  <div className="pt-session-meta">{s.room}</div>
                </div>
                <div className="pt-session-right">
                  <span
                    className={`pt-session-status ${statusClass(s.status)}`}
                  >
                    {statusLabel(s.status)}
                  </span>
                  {s.level && (
                    <span className={`pt-session-level ${levelClass(s.level)}`}>
                      {s.level}
                    </span>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOME PAGE (Parent Dashboard)
══════════════════════════════════════════════════════════════ */
// APRÈS
function HomePage({ navigate, childData, notes, absences, emplois }) {
  const [barVisible, setBarVisible] = useState(false);

  const toPercent = (note, max) => Math.round((note / (max || 20)) * 100);
  const avgMarkReal = notes?.length
    ? Math.round(notes.reduce((s, n) => s + toPercent(n.note, n.noteMax), 0) / notes.length)
    : 0;
  const missedCount  = (absences || []).length;
  const absenceRate  = missedCount;

  const avgMark = useCountUp(avgMarkReal);
  const sessions = useCountUp((absences || []).length);
  const missed   = useCountUp(missedCount);
  const absent   = useCountUp(absenceRate);

  useEffect(() => {
    const t = setTimeout(() => setBarVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

// APRÈS
const nextSessions = (emplois || []).slice(0, 3).map(e => ({
  subject: e.subject || '—',
  time:    `${e.startTime} - ${e.endTime}`,
  day:     ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][e.dayOfWeek] || '—',
  room:    e.room || '—',
}));

  const quickLinks = [
    {
      label: "View Timetable",
      desc: "Weekly course schedule",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      section: "Timetable",
    },
    {
      label: "Check Marks",
      desc: "Academic performance",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      section: "Marks",
    },
    {
      label: "View Absences",
      desc: "Attendance records",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="17" y1="11" x2="23" y2="11" />
        </svg>
      ),
      section: "Absences",
    },
    {
      label: "Contact School",
      desc: "Send a message",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      section: "Home",
    },
  ];

  return (
    <div className="pd-home">
      {/* Welcome banner */}
      <div className="pd-welcome">
        <div className="pd-welcome-avatar">{initials(childData?.parent || 'Parent')}</div>
        <div className="pd-welcome-body">
<div className="pd-welcome-title">Welcome back, {(childData?.parent || 'Parent').split(" ")[0]}!</div>
          <div className="pd-welcome-sub">
           Monitoring: {childData?.name} · {childData?.language} {childData?.level} · Since {childData?.since}
          </div>
        </div>
        <div className="pd-welcome-chip">Spring 2026</div>
      </div>

      {/* Stat cards — same component as Dashboard */}
      <div className="pd-stats">
<StatCard
  icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>}
  label="Average Mark"
  value={`${Math.round(avgMark)}%`}
  delta={notes?.length ? `${notes.length} évaluations` : 'Aucune note'}
  icBg="var(--db-blue-lt)"
  icColor="var(--db-blue)"
  deltaColor="var(--db-green)"
/>
        <StatCard
  icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
  label="Sessions Attended"
  value={Math.round(sessions)}
  delta={`Section : ${childData?.section || '—'}`}
  icBg="var(--db-green-bg)"
  icColor="var(--db-green)"
  deltaColor="var(--db-green)"
/>
        <StatCard
  icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" y1="11" x2="23" y2="11" /></svg>}
  label="Missed Sessions"
  value={Math.round(missed)}
  delta={`Langue : ${childData?.language || '—'}`}
  icBg="var(--db-red-bg)"
  icColor="var(--db-red)"
  deltaColor="var(--db-red)"
/>
        <StatCard
  icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
  label="Absence Rate"
  value={`${Math.round(absent)}%`}
  delta={absenceRate > 5 ? '⚠ Absences élevées' : 'Situation normale'}
  icBg="var(--db-amber-bg)"
  icColor="var(--db-amber)"
  deltaColor="var(--db-green)"
/>
      </div>

      {/* Mid: quick links + next sessions */}
      <div className="pd-home-mid">
        {/* Quick links grid */}
        <div className="db-panel">
          <div className="db-ph">
            <span className="db-pt">Quick access</span>
          </div>
          <div className="pd-links">
            {quickLinks.map((l) => (
              <div
                className="pd-link"
                key={l.label}
                onClick={() => navigate(l.section)}
              >
                <div className="pd-link-ic">{l.icon}</div>
                <div className="pd-link-body">
                  <div className="pd-link-lbl">{l.label}</div>
                  <div className="pd-link-desc">{l.desc}</div>
                </div>
                <span className="pd-link-arr">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="pd-next">
          <div className="pd-next-header">
            <div>
              <div className="pd-next-title">Upcoming sessions</div>
              <div className="pd-next-sub">Next 3 scheduled</div>
            </div>
            <span className="db-chip">This week</span>
          </div>
          {nextSessions.map((s, i) => (
            <div className="pd-next-row" key={i}>
              <div className="pd-next-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="pd-next-info">
                <div className="pd-next-name">{s.subject}</div>
                <div className="pd-next-time">
                  {s.day} · {s.time} · {s.room}
                </div>
              </div>
            </div>
          ))}

          {/* Mini marks chart */}
          <div
            style={{
              borderTop: "var(--db-border)",
              paddingTop: 12,
              marginTop: 4,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--db-text2)",
                marginBottom: 10,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Last marks
            </div>

{(notes || []).slice(0, 3).map((n, i) => (
  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
    <span style={{ fontSize:11, color:"var(--db-text2)", width:90, flexShrink:0,
      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
      {n.cours?.langue || n.cours?.nom || 'Matière'}
    </span>
    <div style={{ flex:1, height:5, background:"var(--db-bg)", borderRadius:3, overflow:"hidden" }}>
      <div style={{ height:5, borderRadius:3,
        width: barVisible ? `${Math.round((n.note/(n.noteMax||20))*100)}%` : "0%",
        background: barColor(n.note, n.noteMax || 20),
        transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
    <span style={{ fontSize:11, fontWeight:500, color:"var(--db-text)", minWidth:36, textAlign:"right" }}>
      {n.note}/{n.noteMax || 20}
    </span>
  </div>
))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NAV ITEMS
══════════════════════════════════════════════════════════════ */
const navItems = [
  {
    label: "Home",
    section: "main",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Timetable",
    section: "main",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Marks",
    section: "main",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    label: "Absences",
    section: "main",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="17" y1="11" x2="23" y2="11" />
      </svg>
    ),
  },
];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const ParentDashboard = () => {
  const [activeNav, setActiveNav] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  const {
    notifications,
    unreadCount: notifUnreadCount,
    markRead,
  } = useNotifications(currentUserId);

  const { child, absences, notes, emplois, loading, error, reload } = useParentData();

  // ✅ Temps réel — mise à jour sans refresh
useSocket(currentUserId, (event, data) => {
  switch (event) {
    case 'absence:marked':
      reload(); // recharge les absences de l'enfant
      break;

    case 'note:added':
      reload(); // recharge les notes
      break;

    case 'notification:new':
      // useNotifications gère déjà ça via refresh
      break;

    default:
      break;
  }
});

  if (loading) return <div className="db-loading">Chargement…</div>;
  if (error)   return <div className="db-error">Erreur : {error}</div>;

  const CHILD_REAL = {
    name:     child ? `${child.prenom} ${child.nom}` : '—',
    parent:   `${localStorage.getItem('prenom') || 'Parent'} ${localStorage.getItem('nom') || ''}`.trim() || 'Parent',
    level:    child?.level    || '—',
    language: child?.language || '—',
    since:    child?.dateInscription
      ? new Date(child.dateInscription).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      : '—',
    section:  child?.section  || 'Non assignée',
  };

  const renderContent = () => {
    switch (activeNav) {
      case "Timetable":
        return <TimetablePage emplois={emplois} />;
      case "Marks":
        return <MarksPage notes={notes} />;
      case "Absences":
        return <AbsencesPage absences={absences} />;
      case "Notifications":
        return (
          <div className="pd-home">
            <div className="db-panel">
              {notifications.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
                  Aucune notification
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: "flex", gap: 12, padding: "14px 16px",
                      borderBottom: "1px solid var(--db-border)",
                      cursor: "pointer",
                      background: n.read ? "transparent" : "#E6F1FB",
                      borderLeft: n.read ? "3px solid transparent" : "3px solid #185FA5",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: "#666", margin: "2px 0" }}>{n.msg}</div>
                      <div style={{ fontSize: 11, color: "#999" }}>{n.time}</div>
                    </div>
                    {!n.read && (
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#185FA5", alignSelf: "center",
                      }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return (
          <HomePage
            navigate={setActiveNav}
            childData={CHILD_REAL}
            notes={notes}
            absences={absences}
            emplois={emplois}
          />)
  }
};

  const headerSub = {
    Home: "Child marks progression and absence overview",
    Timetable: "Weekly course schedule",
    Marks: "Neutral overview of subject grades",
    Absences: "View student absence records",
  };

  return (
    <div className={`db-layout${collapsed ? " db-collapsed" : ""}`}>
      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        <div className="db-logo">
          <div className="db-logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          {!collapsed && (
            <div className="db-logo-text">
              <h2>Parent</h2>
              <span>Portal</span>
            </div>
          )}
        </div>
        <button className="db-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "›" : "‹"}
        </button>

        <nav className="db-nav">
          {!collapsed && <span className="db-nav-label">Navigation</span>}
          {navItems.map((n) => (
            <button
              key={n.label}
              className={`db-nav-item${activeNav === n.label ? " db-nav-active" : ""}`}
              onClick={() => setActiveNav(n.label)}
            >
              <span className="db-nav-icon">{n.icon}</span>
              {!collapsed && <span className="db-nav-text">{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* Profile bottom */}
        <div className="db-sidebar-bottom">
          {!collapsed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 9px",
                marginBottom: 6,
              }}
            >
              <div
                className="db-avatar"
                style={{ width: 30, height: 30, fontSize: 11 }}
              >
               {initials(CHILD_REAL.parent)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--db-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                 {CHILD_REAL.parent}
                </div>
                <div style={{ fontSize: 10, color: "var(--db-text2)" }}>
                  Parent
                </div>
              </div>
            </div>
          )}
          <button
            className="db-nav-item db-nav-danger"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("nom");
              localStorage.removeItem("prenom");
              window.location.href = "/login";
            }}
          >
            <span className="db-nav-icon">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            {!collapsed && <span className="db-nav-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-header-title">{activeNav}</div>
            <span className="db-header-sub">{headerSub[activeNav]}</span>
          </div>
          <div className="db-header-right">
            <button
              className="db-icon-btn"
              onClick={() => setActiveNav("Notifications")}
            >
              <svg
                viewBox="0 0 24 24"
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {notifUnreadCount > 0 && <span className="db-badge" />}
            </button>
            <button className="db-icon-btn">
              <svg
                viewBox="0 0 24 24"
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </button>
            <div className="db-profile" style={{ cursor:'pointer' }} onClick={() => setActiveNav('Profile')}>
              <div className="db-avatar">{initials(CHILD_REAL.parent)}</div>
              <div>
                <span className="db-pname">{(CHILD_REAL.parent || 'Parent').split(" ")[0]} </span>
                <span className="db-prole">Parent</span>
              </div>
            </div>
          </div>
        </header>
        <main className="db-content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default ParentDashboard;
