import React, { useState, useEffect } from "react";
import "../../styles/DS.css";
import { useDashboardData } from '../../hooks/useDashboardData';
import { useSocket } from "../../hooks/useSocket";
import { useNotifications } from "../../hooks/useNotifications";
import {
  createExam, deleteExam,
  fetchTodos, createTodo, updateTodo, deleteTodo,
  fetchNotifications, markNotifRead, markAllNotifsRead,
  deleteNotif, deleteAllNotifs,
} from '../../api/api';

/* ═══════════════════════════════════════════
   CONSTANTS
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

const NAV_ITEMS = [
  { label: "Home",       section: "main",   icon: "grid"     },
  { label: "Grades",     section: "main",   icon: "grades"   },
  { label: "Exams",      section: "main",   icon: "exam"     },
  { label: "Schedule",   section: "main",   icon: "calendar" },
  { label: "To-Do",      section: "manage", icon: "todo"     },
  { label: "Notifications", section: "manage", icon: "bell"  },
  { label: "Messages",   section: "manage", icon: "mail"     },
  { label: "Settings",   section: "manage", icon: "settings" },
];

const DAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_FR = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

/* ═══════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════ */
const Icon = ({ name, size = 16 }) => {
  const s = { width: size, height: size };
  const p = { fill:"none", stroke:"currentColor", strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round" };
  const icons = {
    grid:     <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    grades:   <svg viewBox="0 0 24 24" style={s} {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    exam:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    calendar: <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    todo:     <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    bell:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    mail:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    settings: <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    logout:   <svg viewBox="0 0 24 24" style={s} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus:     <svg viewBox="0 0 24 24" style={s} {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
    check:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    trend:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    book:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    search:   <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    star:     <svg viewBox="0 0 24 24" style={s} {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    reply:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
    send:     <svg viewBox="0 0 24 24" style={s} {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    arrowLeft:<svg viewBox="0 0 24 24" style={s} {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    level:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    lock:     <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    eyeOff:   <svg viewBox="0 0 24 24" style={s} {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    user:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[name] || null;
};

/* ═══════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════ */
function ProgressRing({ pct, color, size = 52 }) {
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <div style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}/>
      </svg>
      <span style={{ fontSize: size < 50 ? 10 : 11, fontWeight: 700, color }}>{pct}%</span>
    </div>
  );
}

function CECRLBadge({ level, size = "md" }) {
  const c = CECRL_COLORS[level] || { color: "#666", bg: "#eee" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: c.bg, color: c.color, borderRadius: 999,
      padding: size === "lg" ? "5px 14px" : "3px 10px",
      fontSize: size === "lg" ? 14 : 12,
      fontWeight: 700, letterSpacing: "0.05em",
      border: `1px solid ${c.color}33`,
    }}>{level}</span>
  );
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }}/>
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 36, textAlign: "right" }}>{score}%</span>
    </div>
  );
}

function StatCard({ icon, label, value, delta, warn, color }) {
  return (
    <div className="db-stat">
      <div className="db-stat-ic" style={color ? { background: `${color}15`, color } : {}}>
        <Icon name={icon} size={18}/>
      </div>
      <div className="db-stat-body">
        <span className="db-stat-lbl">{label}</span>
        <strong className="db-stat-val" style={color ? { color } : {}}>{value}</strong>
        <span className={`db-stat-dl${warn ? " db-stat-warn" : ""}`}>{delta}</span>
      </div>
    </div>
  );
}

function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr) - now) / 86400000);
}

/* ═══════════════════════════════════════════
   HOME VIEW
═══════════════════════════════════════════ */
function HomeView({ absences, emplois, user, announcements, conges }) {
  const [offset, setOffset] = useState(0);
  const [tooltip, setTooltip] = useState(null);

  const d = new Date(); d.setDate(d.getDate() + offset);
  const dayIdx = d.getDay();
  const dayFr  = DAYS_FR[dayIdx];
  const label  = offset === 0 ? "Today" : offset === -1 ? "Yesterday" : offset === 1 ? "Tomorrow" : DAYS_EN[dayIdx];

  // Filter schedule for today
  const rows = (emplois || []).filter(e =>
    e.jourSemaine === dayFr || e.dayOfWeek === dayIdx
  );

  // Absences grouped by language
  const absByLang = {};
  (absences || []).forEach(a => {
    const lang = a.language || "Other";
    absByLang[lang] = (absByLang[lang] || 0) + 1;
  });

  const totalAbsences  = (absences || []).length;
  const mainLang       = user?.language || "";
  const mainAbsCount   = absByLang[mainLang] || 0;

  // Weekly absence chart (last 5 working days)
  const WEEK_SHORT = ["Mon","Tue","Wed","Thu","Fri"];
  const today = new Date(); today.setHours(0,0,0,0);
  const currentDay = today.getDay() === 0 ? 7 : today.getDay();
  const weekData = WEEK_SHORT.map((day, i) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - (currentDay - 1) + i);
    const dayStr = dayDate.toISOString().split("T")[0];
    const count = (absences || []).filter(a =>
      new Date(a.date).toISOString().split("T")[0] === dayStr
    ).length;
    return { day, count };
  });

  const MAX_H = 100;
  const MAX_ABS = 5;

  return (
    <>
      {/* Welcome banner */}
      <div style={{
        background: "linear-gradient(135deg, #1A6CC4 0%, #0C447C 100%)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 4,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: "#fff", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>
            {new Date().toLocaleDateString("en-US", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-head, 'Sora', sans-serif)" }}>
            Welcome back, {user?.prenom || user?.firstName || "Student"} {user?.nom || user?.lastName || ""} 👋
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            {user?.language ? `${user.language} · ` : ""}{user?.level ? `Level ${user.level} · ` : ""}{user?.section ? `Section ${user.section}` : "No section assigned"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { lbl: "Language", val: user?.language || "—" },
            { lbl: "Level",    val: user?.level    || "—" },
            { lbl: "Section",  val: user?.section  || "—" },
          ].map(item => (
            <div key={item.lbl} style={{ textAlign: "center", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 18px" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{item.val}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{item.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="db-stats">
        <StatCard icon="book"     label={`Absences — ${mainLang || "Main language"}`} value={String(mainAbsCount)}
          delta={mainAbsCount > 3 ? "⚠ Too many absences" : "Normal attendance"}
          warn={mainAbsCount > 3} color={mainAbsCount > 3 ? "#A32D2D" : "#2D7A3A"}/>
        <StatCard icon="level"    label="CECRL Level" value={user?.level || "—"}
          delta="Assigned by your teacher"/>
        <StatCard icon="calendar" label="Classes today" value={`${rows.length} class${rows.length !== 1 ? "es" : ""}`}
          delta={DAYS_EN[dayIdx]}/>
        <StatCard icon="trend"    label="Total absences" value={String(totalAbsences)}
          delta={`Section: ${user?.section || "Not assigned"}`}
          warn={totalAbsences > 5} color={totalAbsences > 5 ? "#A32D2D" : undefined}/>
      </div>

      <div className="db-mid">
        {/* Attendance by language */}
        <div className="db-panel">
          <div className="db-ph">
            <div><span className="db-pt">Attendance by Language</span><span className="db-ps">Current semester</span></div>
            <span className="db-chip">This semester</span>
          </div>
          <div className="db-subjects-grid">
            {Object.keys(absByLang).length === 0 ? (
              <div style={{ color: "var(--db-text3)", fontSize: 13, padding: "12px 0" }}>No absences recorded</div>
            ) : Object.entries(absByLang).map(([lang, count]) => {
              const LANG_META = {
                English: { icon: "🌐", color: "#185FA5" },
                French:  { icon: "🇫🇷", color: "#3B6D11" },
                Spanish: { icon: "🌍", color: "#A32D2D" },
                German:  { icon: "🇩🇪", color: "#633806" },
                Arabe:   { icon: "🇩🇿", color: "#7C3AED" },
              };
              const meta = LANG_META[lang] || { icon: "📚", color: "#555" };
              const pct  = Math.min(Math.round((count / 30) * 100), 100);
              return (
                <div className="db-subj-card" key={lang}>
                  <div className="db-subj-icon">{meta.icon}</div>
                  <div className="db-subj-name">{lang}</div>
                  <div className="db-subj-count">{count} abs.</div>
                  <ProgressRing pct={pct} color={meta.color}/>
                  <div className="db-subj-meta">Current semester</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="db-mid-right">
          {/* Announcements */}
          <div className="db-panel">
            <div className="db-ph"><span className="db-pt">Announcements</span></div>
            {(announcements || []).length === 0
              ? <div style={{ color:"var(--db-text3)", fontSize:13, padding:"8px 0" }}>No announcements</div>
              : (announcements || []).map((a, i) => (
                <div className="db-announce-item" key={i}>
                  <span className={`db-announce-tag ${a.tagClass || "db-tag-blue"}`}>{a.tag}</span>
                  <p className="db-announce-text">{a.text || a.message || a.content}</p>
                  <div className="db-announce-time">{new Date(a.createdAt).toLocaleDateString("en-US")}</div>
                </div>
              ))}
          </div>

          {/* Absent teachers */}
          <div className="db-panel">
            <div className="db-ph"><span className="db-pt">Absent Teachers</span></div>
            {(conges || []).length === 0
              ? <div style={{ color:"var(--db-text3)", fontSize:13, padding:"8px 0" }}>No teachers absent today</div>
              : (conges || []).map((c, i) => {
                const nom    = c.professeur?.nom    || "";
                const prenom = c.professeur?.prenom || "";
                const initials = `${prenom[0]||""}${nom[0]||""}`.toUpperCase() || "??";
                const BG = ["#e6f1fb","#eaf3de","#faeeda","#fcebeb"];
                const TX = ["#185FA5","#3B6D11","#854f0b","#A32D2D"];
                return (
                  <div className="db-teacher-item" key={i}>
                    <div className="db-teacher-av" style={{ background:BG[i%4], color:TX[i%4] }}>{initials}</div>
                    <div>
                      <div className="db-teacher-name">{prenom} {nom}</div>
                      <div className="db-teacher-leave">{c.type}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="db-bot">
        {/* Schedule */}
        <div className="db-panel">
          <div className="db-ph">
            <div>
              <span className="db-pt">Class Schedule</span>
              <span className="db-ps">{label} — {DAYS_EN[dayIdx]}</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button className="db-arr-btn" onClick={() => setOffset(o => o-1)}>‹</button>
              <button className="db-arr-btn" onClick={() => setOffset(0)}>Today</button>
              <button className="db-arr-btn" onClick={() => setOffset(o => o+1)}>›</button>
            </div>
          </div>
          <table className="db-table">
            <thead><tr><th>Time</th><th>Room</th><th>Subject</th><th>Status</th></tr></thead>
            <tbody>
              {rows.length === 0
                ? <tr><td colSpan={4} className="db-empty-row">No classes scheduled</td></tr>
                : rows.map((r, i) => {
                  const now = new Date();
                  const [hF, mF] = (r.endTime || r.heureFin || "23:59").split(":").map(Number);
                  const fin = new Date(); fin.setHours(hF, mF, 0, 0);
                  const done = fin < now;
                  return (
                    <tr key={i}>
                      <td>{r.startTime || r.heureDebut || "—"}–{r.endTime || r.heureFin || "—"}</td>
                      <td>{r.room || r.salle || "—"}</td>
                      <td>{r.subject || r.matiere || "—"}</td>
                      <td><span className={`db-status ${done ? "db-st-active" : "db-st-pending"}`}><span className="db-dot"/>{done ? "Done" : "Upcoming"}</span></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Weekly chart */}
        <div className="db-panel">
          <div className="db-ph">
            <div><span className="db-pt">Weekly Absences</span><span className="db-ps">This week</span></div>
          </div>
          <div className="db-bar-wrap" style={{ position:"relative" }}>
            {weekData.map((d) => {
              const h = d.count === 0 ? 4 : Math.round((Math.min(d.count, MAX_ABS) / MAX_ABS) * MAX_H);
              return (
                <div className="db-bar-group" key={d.day}>
                  <div className="db-bar-row" style={{ height: MAX_H }}>
                    <div className="db-bar db-bar-blue"
                      style={{ height: h, background: d.count > 2 ? "#A32D2D" : "#185FA5" }}
                      onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, day: d.day, count: d.count })}
                      onMouseLeave={() => setTooltip(null)}/>
                  </div>
                  <span className="db-bar-label">{d.day}</span>
                </div>
              );
            })}
            {tooltip && (
              <div className="db-chart-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}>
                <strong>{tooltip.day}</strong> — {tooltip.count} absence(s)
              </div>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:12 }}>
            <span className="db-avg-lbl">Total absences</span>
            <div className="db-avg-track" style={{ flex:1 }}>
              <div className="db-avg-fill" style={{ width:`${Math.min((totalAbsences/30)*100, 100)}%` }}/>
            </div>
            <span className="db-avg-val">{totalAbsences} abs.</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   GRADES VIEW
═══════════════════════════════════════════ */
function GradesView({ notes, user }) {
  const [expanded, setExpanded] = useState(null);

  const toPercent = (note, max) => Math.round((note / (max || 20)) * 100);

  // Group by language
  const byLang = {};
  (notes || []).forEach(n => {
    const lang = n.cours?.langue || n.cours?.nom || n.language || "Unknown";
    if (!byLang[lang]) byLang[lang] = [];
    byLang[lang].push(n);
  });

  const evals = Object.entries(byLang).map(([lang, langNotes]) => {
    const avg = langNotes.reduce((s, n) => s + toPercent(n.note, n.noteMax), 0) / langNotes.length;
    return {
      subject: lang,
      icon: lang.toLowerCase().includes("english") ? "🌐"
          : lang.toLowerCase().includes("french")  ? "🇫🇷"
          : lang.toLowerCase().includes("spanish") ? "🌍"
          : lang.toLowerCase().includes("german")  ? "🇩🇪"
          : lang.toLowerCase().includes("arabe")   ? "🇩🇿" : "📚",
      avgPercent: Math.round(avg),
      notes: langNotes,
    };
  });

  if (!evals.length) {
    return (
      <div className="db-panel" style={{ padding:32, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
        <div style={{ fontSize:16, fontWeight:600, color:"var(--db-text)", marginBottom:6 }}>No grades yet</div>
        <div style={{ fontSize:13, color:"var(--db-text3)" }}>
          Your grades will appear here once your teachers have entered them.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Read-only banner */}
      <div style={{
        display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
        background:"linear-gradient(135deg,#EBF4FF,#F0F7FF)",
        border:"1px solid #A8CEFA", borderRadius:10, fontSize:12.5, color:"#0D4F94", fontWeight:500,
      }}>
        <Icon name="eyeOff" size={15}/>
        CECRL levels are calculated and assigned by your teachers. No modifications are possible from this portal.
      </div>

      {/* Level summary cards */}
      <div className="db-level-summary">
        {evals.map(ev => {
          const level = scoreToLevel(ev.avgPercent);
          const c = CECRL_COLORS[level];
          return (
            <div className="db-level-card" key={ev.subject} style={{ borderTop:`3px solid ${c.color}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:24 }}>{ev.icon}</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--db-text)" }}>{ev.subject}</div>
                  <div style={{ fontSize:11, color:"var(--db-text2)" }}>{ev.notes.length} evaluation(s) · Spring 2026</div>
                </div>
                <div style={{ marginLeft:"auto" }}><CECRLBadge level={level} size="lg"/></div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, height:8, background:"rgba(0,0,0,0.07)", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${ev.avgPercent}%`, height:"100%",
                    background:`linear-gradient(90deg,${c.color},${c.color}bb)`,
                    borderRadius:4, transition:"width 1.2s" }}/>
                </div>
                <span style={{ fontSize:15, fontWeight:700, color:c.color, minWidth:44 }}>{ev.avgPercent}%</span>
              </div>
              <div style={{ fontSize:11, color:"var(--db-text3)", marginTop:7 }}>Average of {ev.notes.length} grade(s)</div>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className="db-panel">
        <div className="db-ph">
          <div>
            <span className="db-pt">Grade Details</span>
            <span className="db-ps">Score (%) → CECRL Level — Assigned by teachers</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span className="db-chip">Spring 2026</span>
            <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:"var(--db-text3)",
              padding:"3px 8px", background:"var(--db-bg)", borderRadius:20, border:"var(--db-border)" }}>
              <Icon name="lock" size={11}/> Read-only
            </span>
          </div>
        </div>

        {/* CECRL legend */}
        <div className="db-cecrl-legend">
          {CECRL_LEVELS.map(l => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <CECRLBadge level={l}/>
              <span style={{ fontSize:11, color:"var(--db-text3)" }}>
                {l==="A1"?"0–34%":l==="A2"?"35–49%":l==="B1"?"50–63%":l==="B2"?"64–77%":l==="C1"?"78–89%":"90–100%"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:14 }}>
          {evals.map((ev, idx) => {
            const level = scoreToLevel(ev.avgPercent);
            const c = CECRL_COLORS[level];
            const isExp = expanded === idx;

            return (
              <div key={ev.subject} className="db-eval-block">
                <div className="db-eval-header" onClick={() => setExpanded(isExp ? null : idx)}>
                  <span style={{ fontSize:20 }}>{ev.icon}</span>
                  <span style={{ flex:1, fontSize:14, fontWeight:500, color:"var(--db-text)" }}>{ev.subject}</span>
                  <ScoreBar score={ev.avgPercent} color={c.color}/>
                  <CECRLBadge level={level}/>
                  <span style={{ color:"var(--db-text3)", fontSize:13, marginLeft:6,
                    display:"inline-block", transform:isExp?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}>▾</span>
                </div>

                {isExp && (
                  <div className="db-eval-skills">
                    {ev.notes.map((n, ni) => {
                      const pct = Math.round((n.note / (n.noteMax || 20)) * 100);
                      const skillLevel = scoreToLevel(pct);
                      const sc = CECRL_COLORS[skillLevel];
                      return (
                        <div key={ni} className="db-eval-skill-row">
                          <span style={{ fontSize:12, color:"var(--db-text2)", minWidth:170 }}>
                            {n.competence || n.type || `Evaluation ${ni+1}`}
                          </span>
                          <ScoreBar score={pct} color={sc.color}/>
                          <CECRLBadge level={skillLevel}/>
                        </div>
                      );
                    })}
                    <div style={{ marginTop:6, padding:"8px 12px", background:"var(--db-bg)",
                      borderRadius:8, fontSize:11.5, color:"var(--db-text3)",
                      display:"flex", alignItems:"center", gap:6, borderLeft:`3px solid ${c.color}55` }}>
                      <Icon name="lock" size={11}/>
                      Grades are entered by your teachers and cannot be modified by students.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="db-grades-footer">
          <span>Formula: average of all grades → CECRL level</span>
          <span>Levels: A1 · A2 · B1 · B2 · C1 · C2</span>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   EXAMS VIEW
═══════════════════════════════════════════ */
function ExamsView({ exams: initExams }) {
  const [exams, setExams] = useState(initExams || []);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ subject:"", date:"", room:"", type:"Final Exam" });

  useEffect(() => { setExams(initExams || []); }, [initExams]);

  const addExam = async () => {
    if (!form.subject || !form.date) return;
    try {
      const res = await createExam(form);
      setExams(e => [...e, res.data || res]);
    setForm({ subject:"", section:"", level:"", type:"Évaluation finale", date:"", time:"", duration:"90", room:"", description:"", maxScore:"20" });
      setShowAdd(false);
    } catch (err) { console.error(err); }
  };

  const removeExam = async (id) => {
    try {
      await deleteExam(id);
      setExams(e => e.filter(x => (x._id || x.id) !== id));
    } catch (err) { console.error(err); }
  };

  const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = sorted.filter(e => daysUntil(e.date) >= 0);

  return (
    <>
      {/* Exam countdown cards */}
      {upcoming.length > 0 && (
        <div className="db-exam-grid">
          {upcoming.slice(0, 3).map(e => {
            const days = daysUntil(e.date);
            const urgent = days <= 7;
            return (
              <div className={`db-exam-card ${urgent ? "db-exam-urgent" : ""}`} key={e._id || e.id}>
                <div className="db-exam-days">{days === 0 ? "Today!" : days}</div>
                {days !== 0 && <div className="db-exam-dayslbl">days remaining</div>}
                <div className="db-exam-subj">{e.subject}</div>
                <div className="db-exam-meta">
                  {new Date(e.date).toLocaleDateString("en-US", { day:"numeric", month:"short" })} · {e.room || "TBD"}
                </div>
                <span className="db-exam-type">{e.type}</span>
              </div>
            );
          })}
        </div>
      )}

      {exams.length === 0 && !showAdd && (
        <div className="db-panel" style={{ textAlign:"center", padding:32 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📅</div>
          <div style={{ fontSize:16, fontWeight:600, color:"var(--db-text)", marginBottom:6 }}>No exams scheduled</div>
          <div style={{ fontSize:13, color:"var(--db-text3)", marginBottom:16 }}>
            Your exams will appear here once they are added by your teachers, or you can add your own reminders.
          </div>
          <button className="db-add-btn" onClick={() => setShowAdd(true)}>
            <Icon name="plus" size={14}/> Add exam reminder
          </button>
        </div>
      )}

      <div className="db-panel">
        <div className="db-ph">
          <div>
            <span className="db-pt">Exam Calendar</span>
            <span className="db-ps">All upcoming evaluations</span>
          </div>
          <button className="db-add-btn" onClick={() => setShowAdd(s => !s)}>
            <Icon name="plus" size={14}/> Add
          </button>
        </div>

        {showAdd && (
          <div className="db-add-form">
            <input className="db-form-input" placeholder="Subject (e.g. English)"
              value={form.subject} onChange={e => setForm(f => ({ ...f, subject:e.target.value }))}/>
            <input className="db-form-input" type="date"
              value={form.date} onChange={e => setForm(f => ({ ...f, date:e.target.value }))}/>
            <input className="db-form-input" placeholder="Room"
              value={form.room} onChange={e => setForm(f => ({ ...f, room:e.target.value }))}/>
            <select className="db-form-input" value={form.type}
              onChange={e => setForm(f => ({ ...f, type:e.target.value }))}>
              <option>Final Exam</option>
              <option>Midterm Exam</option>
              <option>Oral Quiz</option>
              <option>Dictation</option>
              <option>Written Test</option>
            </select>
            <button className="db-save-btn" onClick={addExam}>Add</button>
            <button className="db-cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        )}

        <table className="db-table">
          <thead>
            <tr><th>Subject</th><th>Date</th><th>Room</th><th>Type</th><th>Countdown</th><th></th></tr>
          </thead>
          <tbody>
            {sorted.length === 0
              ? <tr><td colSpan={6} className="db-empty-row">No exams added yet</td></tr>
              : sorted.map(e => {
                const days = daysUntil(e.date);
                const passed = days < 0;
                return (
                  <tr key={e._id || e.id}>
                    <td><strong>{e.subject}</strong></td>
                    <td>{new Date(e.date).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })}</td>
                    <td>{e.room || "TBD"}</td>
                    <td><span className="db-type-badge">{e.type}</span></td>
                    <td>
                      {passed
                        ? <span className="db-status db-st-done"><span className="db-dot"/>Done</span>
                        : <span className={`db-days-badge ${days <= 7 ? "db-days-urgent" : ""}`}>
                            {days === 0 ? "Today!" : `${days}d`}
                          </span>}
                    </td>
                    <td>
                      <button className="db-icon-row-btn" onClick={() => removeExam(e._id || e.id)}>
                        <Icon name="trash" size={13}/>
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

/* ═══════════════════════════════════════════
   SCHEDULE VIEW
═══════════════════════════════════════════ */
function ScheduleView({ emplois }) {
  const [offset, setOffset] = useState(0);

  const d = new Date(); d.setDate(d.getDate() + offset);
  const dayIdx = d.getDay();
  const dayFr  = DAYS_FR[dayIdx];
  const label  = offset === 0 ? "Today" : offset === -1 ? "Yesterday" : offset === 1 ? "Tomorrow" : DAYS_EN[dayIdx];

  const rows = (emplois || []).filter(e =>
    e.jourSemaine === dayFr || e.dayOfWeek === dayIdx
  );

  // Weekly overview
  const weekRows = DAYS_EN.slice(1, 6).map((day, i) => {
    const frDay = DAYS_FR[i + 1];
    const count = (emplois || []).filter(e => e.jourSemaine === frDay || e.dayOfWeek === (i + 1)).length;
    return { day, frDay, count, idx: i + 1 };
  });

  return (
    <>
      {/* Weekly overview */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:4 }}>
        {weekRows.map(w => (
          <div key={w.day} className="db-panel" style={{
            textAlign:"center", padding:"14px 10px", cursor:"pointer",
            borderTop: w.idx === dayIdx ? "3px solid #1A6CC4" : "3px solid transparent",
          }} onClick={() => setOffset(w.idx - new Date().getDay())}>
            <div style={{ fontSize:11, color:"var(--db-text3)", marginBottom:4 }}>{w.day}</div>
            <div style={{ fontSize:22, fontWeight:700, color: w.idx === dayIdx ? "#1A6CC4" : "var(--db-text)" }}>{w.count}</div>
            <div style={{ fontSize:10, color:"var(--db-text3)" }}>class{w.count !== 1 ? "es" : ""}</div>
          </div>
        ))}
      </div>

      <div className="db-panel">
        <div className="db-ph">
          <div>
            <span className="db-pt">Class Schedule</span>
            <span className="db-ps">{label} — {DAYS_EN[dayIdx]}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button className="db-arr-btn" onClick={() => setOffset(o => o-1)}>‹ Prev</button>
            <button className="db-arr-btn" onClick={() => setOffset(0)}>Today</button>
            <button className="db-arr-btn" onClick={() => setOffset(o => o+1)}>Next ›</button>
          </div>
        </div>

        {rows.length === 0
          ? <div className="db-empty-state">No classes scheduled for {DAYS_EN[dayIdx]}</div>
          : rows.map((r, i) => {
            const now = new Date();
            const [hF, mF] = (r.endTime || r.heureFin || "23:59").split(":").map(Number);
            const fin = new Date(); fin.setHours(hF, mF, 0, 0);
            const done = fin < now;
            const [hS, mS] = (r.startTime || r.heureDebut || "00:00").split(":").map(Number);
            const start = new Date(); start.setHours(hS, mS, 0, 0);
            const active = !done && start <= now;

            return (
              <div className="db-tt-row" key={i} style={{
                borderLeft: active ? "3px solid #1A6CC4" : done ? "3px solid var(--db-border)" : "3px solid transparent",
              }}>
                <div className="db-tt-time">{r.startTime || r.heureDebut || "—"}–{r.endTime || r.heureFin || "—"}</div>
                <div className="db-tt-body">
                  <div className="db-tt-subj">{r.subject || r.matiere || "—"}</div>
                  <div className="db-tt-room">Room {r.room || r.salle || "—"} · {r.teacher || r.enseignant || ""}</div>
                </div>
                <span className={`db-status ${done ? "db-st-active" : active ? "db-st-ok" : "db-st-pending"}`}>
                  <span className="db-dot"/>
                  {done ? "Done" : active ? "In progress" : "Upcoming"}
                </span>
              </div>
            );
          })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   TODO VIEW
═══════════════════════════════════════════ */
function TodoView() {
  const [todos, setTodos]       = useState([]);
  const [input, setInput]       = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchTodos().then(res => setTodos(res.data || res.todos || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await createTodo({ text: input.trim(), priority });
      setTodos(t => [res.data || res, ...t]);
      setInput("");
    } catch (err) { console.error(err); }
  };

  const toggle = async (id) => {
    const todo = todos.find(t => t._id === id);
    try {
      const res = await updateTodo(id, { done: !todo.done });
      setTodos(t => t.map(x => x._id === id ? (res.data || res) : x));
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(t => t.filter(x => x._id !== id));
    } catch (err) { console.error(err); }
  };

  const filtered = todos.filter(t =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );

  const PRIO_COLORS = {
    high:   { color:"#A32D2D", bg:"#FCEBEB" },
    medium: { color:"#633806", bg:"#FAEEDA" },
    low:    { color:"#3B6D11", bg:"#EAF3DE" },
  };

  const done = todos.filter(t => t.done).length;

  if (loading) return <div className="db-empty-state">Loading tasks…</div>;

  return (
    <>
      <div className="db-todo-header">
        <div className="db-todo-progress-info">
          <span>{done} of {todos.length} tasks completed</span>
          <span>{Math.round((done / (todos.length || 1)) * 100)}%</span>
        </div>
        <div className="db-avg-track" style={{ height:7, background:"rgba(255,255,255,0.2)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ width:`${Math.round((done/(todos.length||1))*100)}%`, height:"100%",
            background:"#fff", borderRadius:4, transition:"width 0.6s" }}/>
        </div>
      </div>

      <div className="db-panel">
        <div className="db-todo-add">
          <input className="db-todo-input" placeholder="Add a task…" value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTodo()}/>
          <select className="db-prio-select" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button className="db-save-btn" onClick={addTodo}>
            <Icon name="plus" size={14}/> Add
          </button>
        </div>

        <div className="db-todo-filters">
          {[["all","All"],["active","Active"],["done","Done"]].map(([f, lbl]) => (
            <button key={f} className={`db-filter-btn ${filter===f?"active":""}`} onClick={() => setFilter(f)}>
              {lbl}
              <span className="db-filter-count">
                {f==="all"?todos.length:f==="active"?todos.filter(t=>!t.done).length:todos.filter(t=>t.done).length}
              </span>
            </button>
          ))}
        </div>

        <div className="db-todo-list">
          {filtered.length === 0 && <div className="db-empty-state">No tasks here</div>}
          {filtered.map(t => (
            <div className={`db-todo-item ${t.done?"db-todo-done":""}`} key={t._id}>
              <button className="db-check-btn" onClick={() => toggle(t._id)}>
                {t.done && <Icon name="check" size={12}/>}
              </button>
              <span className="db-todo-text">{t.text}</span>
              <span className="db-prio-badge" style={{ background:PRIO_COLORS[t.priority]?.bg, color:PRIO_COLORS[t.priority]?.color }}>
                {t.priority}
              </span>
              <button className="db-icon-row-btn" onClick={() => remove(t._id)}>
                <Icon name="trash" size={13}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   NOTIFICATIONS VIEW
═══════════════════════════════════════════ */
function NotificationsView({ notifications, markRead, markAllRead, deleteOne, deleteAll }) {
  const [tab, setTab]     = useState("All");
  const [toast, setToast] = useState(null);

  const tabs = [
    { label:"All",      key:"All"     },
    { label:"Exams",    key:"exam"    },
    { label:"Grades",   key:"grade"   },
    { label:"Absences", key:"absence" },
    { label:"System",   key:"system"  },
  ];

  const filtered = tab === "All" ? notifications : notifications.filter(n => n.type === tab);
  const unread   = notifications.filter(n => !n.read).length;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const icCls  = { exam:"nt-ic-exam", grade:"nt-ic-grade", absence:"nt-ic-absence", system:"nt-ic-system" };
  const tagCls = { exam:"nt-tag-exam", grade:"nt-tag-grade", absence:"nt-tag-absence", system:"nt-tag-system" };

  return (
    <div className="nt-page">
      <div className="nt-topbar">
        <div>
          <div className="nt-title">Notifications</div>
          <span className="nt-sub">Stay informed about your grades, exams and announcements</span>
        </div>
        <div className="nt-topbar-right">
          {unread > 0 && (
            <button className="nt-btn nt-btn-ghost" onClick={async () => { await markAllRead(); showToast("All notifications marked as read."); }}>
              <Icon name="check" size={13}/> Mark all read ({unread})
            </button>
          )}
          {notifications.length > 0 && (
            <button className="nt-btn nt-btn-danger" onClick={async () => { await deleteAll(); showToast("All notifications cleared."); }}>
              <Icon name="trash" size={13}/> Clear all
            </button>
          )}
        </div>
      </div>

      <div className="db-panel" style={{ padding:0 }}>
        <div style={{ padding:"0 18px" }}>
          <div className="nt-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`nt-tab${tab===t.key?" nt-tab-active":""}`} onClick={() => setTab(t.key)}>
                {t.label}
                <span className="nt-tab-n">{t.key==="All"?notifications.length:notifications.filter(n=>n.type===t.key).length}</span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0
          ? <div className="nt-empty"><div className="nt-empty-ic"><Icon name="bell" size={20}/></div><span className="nt-empty-t">No notifications</span><span className="nt-empty-s">You're all caught up!</span></div>
          : <div className="nt-list">
              {filtered.map(n => (
                <div key={n.id} className={`nt-item${!n.read?" nt-item-unread":""}`} onClick={() => markRead(n.id)}>
                  <div className={`nt-item-ic ${icCls[n.type]||"nt-ic-system"}`}>{n.icon}</div>
                  <div className="nt-item-body">
                    <div className="nt-item-head"><span className="nt-item-title">{n.title}</span>{!n.read && <span className="nt-item-unread-dot"/>}</div>
                    <div className="nt-item-msg">{n.msg}</div>
                    <div className="nt-item-footer"><span className="nt-item-time">{n.time}</span><span className={`nt-item-tag ${tagCls[n.tag]||"nt-tag-system"}`}>{n.tag}</span></div>
                  </div>
                  <button className="nt-item-del" onClick={e => { e.stopPropagation(); deleteOne(n.id); }}>
                    <Icon name="trash" size={13}/>
                  </button>
                </div>
              ))}
            </div>}
      </div>
      {toast && <div className="nt-toast"><Icon name="check" size={14}/>{toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MESSAGES VIEW
═══════════════════════════════════════════ */
function MessagesView({ emails, setEmails }) {
  const [selected, setSelected] = useState(null);
  const [tab, setTab]           = useState("All");
  const [search, setSearch]     = useState("");
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const tabs = [
    { label:"All", key:"All" }, { label:"Exams", key:"exam" },
    { label:"Grades", key:"grade" }, { label:"Absences", key:"absence" }, { label:"Other", key:"system" },
  ];

  const filtered = emails.filter(e => {
    const matchTab = tab === "All" || e.tag === tab;
    const matchSearch = !search || e.from?.toLowerCase().includes(search.toLowerCase()) || e.subject?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const unread = emails.filter(e => !e.read).length;
  const sendReply = async () => {
  if (!replyText.trim() || !selected) return;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/secretaire/messages/${selected.id}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ body: replyText })
    });
    const data = await res.json();
    if (data.success) {
      setReplyText("");
      setShowReply(false);
      showToast(`Reply sent to ${selected.from}.`);
    }
  } catch (err) { console.error(err); }
};

const openEmail = async (email) => {
  setSelected(email); setShowReply(false); setReplyText("");
  if (!email.read) {
    setEmails(es => es.map(e => e.id===email.id ? {...e, read:true} : e));
    // ✅ Ajouter l'appel API
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/secretaire/messages/${email.id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) { console.error(err); }
  }
};

  const tagColors = {
    exam:    { bg:"#E6F1FB", color:"#185FA5" },
    grade:   { bg:"#EAF3DE", color:"#3B6D11" },
    absence: { bg:"#FCEBEB", color:"#A32D2D" },
    system:  { bg:"#FAEEDA", color:"#633806" },
  };

  return (
    <div className="inbox-layout">
      <div className="inbox-list-pane">
        <div className="inbox-toolbar">
          <div className="db-search" style={{ flex:1 }}>
            <Icon name="search" size={13}/>
            <input type="text" placeholder="Search messages…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          {unread > 0 && <span className="inbox-unread-badge">{unread} unread</span>}
        </div>
        <div className="inbox-tabs">
          {tabs.map(t => (
            <button key={t.key} className={`inbox-tab${tab===t.key?" inbox-tab-active":""}`} onClick={() => setTab(t.key)}>
              {t.label}<span className="inbox-tab-n">{t.key==="All"?emails.length:emails.filter(e=>e.tag===t.key).length}</span>
            </button>
          ))}
        </div>
        <div className="inbox-messages">
          {filtered.length === 0 && <div className="db-empty-state" style={{ padding:"2rem" }}>No messages</div>}
          {filtered.map(email => (
            <div key={email.id}
              className={`inbox-msg${selected?.id===email.id?" inbox-msg-selected":""}${!email.read?" inbox-msg-unread":""}`}
              onClick={() => openEmail(email)}>
              <div className="inbox-msg-top">
                <div className="inbox-avatar">{email.avatar}</div>
                <div className="inbox-msg-meta">
                  <div className="inbox-msg-row1"><span className="inbox-from">{email.from}</span><span className="inbox-time">{email.time}</span></div>
                  <div className="inbox-subject">{email.subject}</div>
                  <div className="inbox-preview">{email.preview}</div>
                </div>
                <button className={`inbox-star${email.starred?" inbox-star-active":""}`}
                  onClick={e => { e.stopPropagation(); setEmails(es => es.map(x => x.id===email.id ? {...x,starred:!x.starred} : x)); }}>
                  <Icon name="star" size={13}/>
                </button>
              </div>
              <div className="inbox-msg-footer">
                <span className="inbox-tag-badge" style={{ background:tagColors[email.tag]?.bg, color:tagColors[email.tag]?.color }}>{email.tag}</span>
                {!email.read && <span className="inbox-unread-dot"/>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="inbox-detail-pane">
        {selected ? (
          <>
            <div className="inbox-detail-header">
              <button className="db-arr-btn" onClick={() => setSelected(null)} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Icon name="arrowLeft" size={14}/> Back
              </button>
              <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                <button className="db-edit-btn" onClick={() => setShowReply(s => !s)}>
                  <Icon name="reply" size={13}/> Reply
                </button>
                <button className="db-icon-row-btn" onClick={() => { setEmails(es => es.filter(e => e.id!==selected.id)); setSelected(null); showToast("Message deleted."); }}>
                  <Icon name="trash" size={13}/>
                </button>
              </div>
            </div>
            <div className="inbox-detail-subject">{selected.subject}</div>
            <div className="inbox-detail-from">
              <div className="inbox-avatar">{selected.avatar}</div>
              <div>
                <div className="inbox-from" style={{ fontSize:13 }}>{selected.from}</div>
                <div style={{ fontSize:11, color:"var(--db-text3)" }}>To: You · {selected.time}</div>
              </div>
              <span className="inbox-tag-badge" style={{ marginLeft:"auto", background:tagColors[selected.tag]?.bg, color:tagColors[selected.tag]?.color }}>{selected.tag}</span>
            </div>
            <div className="inbox-detail-body">
              {(selected.body || "").split("\n").map((line, i) => <p key={i} style={{ margin:"2px 0", minHeight:14 }}>{line}</p>)}
            </div>
            {showReply && (
              <div className="inbox-reply-box">
                <div className="inbox-reply-label">Reply to {selected.from}</div>
                <textarea className="inbox-reply-textarea" placeholder="Write your reply…"
                  value={replyText} onChange={e => setReplyText(e.target.value)} rows={4}/>
                <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
                  <button className="db-cancel-btn" onClick={() => setShowReply(false)}>Cancel</button>
                  <button className="db-save-btn" onClick={() => { setReplyText(""); setShowReply(false); showToast(`Reply sent to ${selected.from}.`); }}>
                    <Icon name="send" size={13}/> Send
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="inbox-empty-detail">
            <Icon name="mail" size={32}/>
            <span>Select a message to read it</span>
          </div>
        )}
      </div>
      {toast && <div className="nt-toast"><Icon name="check" size={14}/>{toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS VIEW
═══════════════════════════════════════════ */
function SettingsView({ user }) {
  const [active, setActive]     = useState("Profile");
  const [savedToast, setSaved]  = useState(false);
  const [profile, setProfile]   = useState({
    fname: user?.prenom || "", lname: user?.nom || "",
    email: user?.email  || "", phone: user?.telephone || "",
    id:    user?._id?.toString().slice(-8) || "",
  });
  const [notifPrefs, setNotifPrefs] = useState({ emailGrades:true, emailExams:true, emailSystem:false, pushGrades:true, pushExams:true, pushSystem:true });
  const [security, setSecurity]     = useState({ currentPwd:"", newPwd:"", confirmPwd:"" });
  const [secErrors, setSecErrors]   = useState({});

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const Toggle = ({ value, onChange }) => (
    <label className="st-toggle">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)}/>
      <span className="st-toggle-slider"/>
    </label>
  );

  const sections   = ["Profile", "Notifications", "Security"];
  const navIcons   = { Profile:<Icon name="user" size={14}/>, Notifications:<Icon name="bell" size={14}/>, Security:<Icon name="lock" size={14}/> };

  const validatePwd = () => {
    const e = {};
    if (!security.currentPwd)           e.currentPwd = true;
    if (security.newPwd.length < 8)     e.newPwd = true;
    if (security.newPwd !== security.confirmPwd) e.confirmPwd = true;
    setSecErrors(e);
    return Object.keys(e).length === 0;
  };

  const renderSection = () => {
    if (active === "Profile") return (
      <div className="st-section">
        <span className="st-section-title">Personal Information</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[["First Name","fname",profile.fname],["Last Name","lname",profile.lname]].map(([lbl,k,v]) => (
            <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
              <input className="st-input" value={v} onChange={e => setProfile(p => ({...p,[k]:e.target.value}))}/>
            </div>
          ))}
        </div>
        {[["Email","email","email",profile.email],["Phone","phone","tel",profile.phone],["Student ID","id","text",profile.id]].map(([lbl,k,t,v]) => (
          <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
            <input className="st-input" type={t} value={v} readOnly={k==="id"}
              style={{ opacity:k==="id"?0.6:1 }}
              onChange={e => k!=="id" && setProfile(p => ({...p,[k]:e.target.value}))}/>
          </div>
        ))}
        <div className="st-save-row">
          <button className="st-btn-cancel">Reset</button>
          <button className="st-btn-save" onClick={showSaved}>Save changes</button>
        </div>
      </div>
    );

    if (active === "Notifications") return (
      <div className="st-section">
        <span className="st-section-title">Notification Preferences</span>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <span style={{ fontSize:12, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Email notifications</span>
          {[["CECRL Grades","emailGrades"],["Exams & reminders","emailExams"],["System","emailSystem"]].map(([lbl,k]) => (
            <div key={k} className="st-row">
              <span className="st-field-label">{lbl}</span>
              <div className="st-toggle-wrap">
                <Toggle value={notifPrefs[k]} onChange={v => setNotifPrefs(p => ({...p,[k]:v}))}/>
                <span className="st-toggle-label">{notifPrefs[k]?"Enabled":"Disabled"}</span>
              </div>
            </div>
          ))}
          <div style={{ borderTop:"var(--db-border)", paddingTop:14 }}>
            <span style={{ fontSize:12, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Push notifications</span>
          </div>
          {[["Grades","pushGrades"],["Exams","pushExams"],["System","pushSystem"]].map(([lbl,k]) => (
            <div key={k} className="st-row">
              <span className="st-field-label">{lbl}</span>
              <div className="st-toggle-wrap">
                <Toggle value={notifPrefs[k]} onChange={v => setNotifPrefs(p => ({...p,[k]:v}))}/>
                <span className="st-toggle-label">{notifPrefs[k]?"Enabled":"Disabled"}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="st-save-row"><button className="st-btn-save" onClick={showSaved}>Save</button></div>
      </div>
    );

    if (active === "Security") return (
      <div className="st-section">
        <span className="st-section-title">Account Security</span>
        {[["Current password","currentPwd","Your current password"],["New password","newPwd","Minimum 8 characters"],["Confirm new password","confirmPwd","Repeat new password"]].map(([lbl,k,ph]) => (
          <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
            <input type="password" className="st-input" placeholder={ph} value={security[k]}
              style={{ borderColor:secErrors[k]?"var(--db-red)":undefined }}
              onChange={e => { setSecurity(s => ({...s,[k]:e.target.value})); setSecErrors(er => ({...er,[k]:false})); }}/>
            {secErrors[k] && <span style={{ fontSize:11, color:"var(--db-red)" }}>
              {k==="confirmPwd"?"Passwords don't match":k==="newPwd"?"Minimum 8 characters":"Required"}
            </span>}
          </div>
        ))}
        <button className="st-btn-save" style={{ alignSelf:"flex-start" }}
          onClick={() => { if (validatePwd()) showSaved(); }}>Update password</button>
      </div>
    );
  };

  return (
    <div className="st-page">
      <div className="st-nav">
        {sections.map(s => (
          <button key={s} className={`st-nav-item${active===s?" st-nav-active":""}`} onClick={() => setActive(s)}>
            {navIcons[s]}{s}
          </button>
        ))}
      </div>
      <div className="st-content">{renderSection()}</div>
      {savedToast && <div className="st-saved-toast"><Icon name="check" size={14}/>Changes saved!</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
const Dashboard = () => {
  const [activeNav, setActiveNav] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);

  const {
    user, absences, emplois, notes, messages, setMessages,
    exams, announcements, conges, loading, error, reload,
  } = useDashboardData();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchNotifications()
      .then(d => {
        const notifs = d.notifications || d.data?.notifications || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      })
      .catch(() => {});
  }, []);
 useSocket(currentUserId, (event, data) => {
  switch (event) {
    case 'absence:marked':
      reload(); // recharge les absences depuis l'API
      break;

    case 'note:added':
      reload(); // recharge les notes
      break;

    case 'exam:added':
      reload();
      break;

    case 'notification:new':
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(c => c + 1);
      break;

    case 'message:new':
      setMessages(prev => [{
        id: data.id,
        from: data.from || 'Administration',
        avatar: '?',
        subject: data.subject,
        preview: data.preview,
        body: '',
        tag: data.tag || 'system',
        read: false,
        starred: false,
        time: new Date().toLocaleDateString('en-US'),
      }, ...prev]);
      break;

    default:
      break;
  }
});
  const markRead = async (id) => {
    await markNotifRead(id);
    setNotifications(ns => ns.map(n => n.id===id ? {...n,read:true} : n));
    setUnreadCount(c => Math.max(0, c-1));
  };
  const markAllRead = async () => {
    await markAllNotifsRead();
    setNotifications(ns => ns.map(n => ({...n,read:true})));
    setUnreadCount(0);
  };
  const deleteOne = async (id) => {
    await deleteNotif(id);
    setNotifications(ns => ns.filter(n => n.id!==id));
  };
  const deleteAll = async () => {
    await deleteAllNotifs();
    setNotifications([]); setUnreadCount(0);
  };

  const unreadMail = (messages || []).filter(e => !e.read).length;

  const fullName = user ? `${user.prenom || user.firstName || ""} ${user.nom || user.lastName || ""}`.trim() : "Student";
  const initials = user ? `${(user.prenom||user.firstName||"")[0]||""}${(user.nom||user.lastName||"")[0]||""}`.toUpperCase() : "S";

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh",
      flexDirection:"column", gap:16, background:"var(--db-surface, #F4F6FA)" }}>
      <div style={{ width:40, height:40, border:"3px solid #1A6CC4", borderTopColor:"transparent",
        borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <div style={{ fontSize:14, color:"var(--db-text2, #666)" }}>Loading your dashboard…</div>
    </div>
  );

  if (error) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh",
      flexDirection:"column", gap:12, background:"var(--db-surface, #F4F6FA)" }}>
      <div style={{ fontSize:40 }}>⚠️</div>
      <div style={{ fontSize:16, fontWeight:600, color:"#A32D2D" }}>Failed to load dashboard</div>
      <div style={{ fontSize:13, color:"var(--db-text2, #666)" }}>{error}</div>
      <button style={{ marginTop:8, padding:"8px 20px", background:"#1A6CC4", color:"#fff",
        border:"none", borderRadius:8, cursor:"pointer", fontSize:13 }}
        onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  const renderView = () => {
    switch (activeNav) {
      case "Grades":        return <GradesView notes={notes} user={user}/>;
      case "Exams":         return <ExamsView exams={exams}/>;
      case "Schedule":      return <ScheduleView emplois={emplois}/>;
      case "To-Do":         return <TodoView/>;
      case "Notifications": return <NotificationsView notifications={notifications} markRead={markRead} markAllRead={markAllRead} deleteOne={deleteOne} deleteAll={deleteAll}/>;
      case "Messages":      return <MessagesView emails={messages || []} setEmails={setMessages}/>;
      case "Settings":      return <SettingsView user={user}/>;
      default:              return <HomeView absences={absences} emplois={emplois} user={user} announcements={announcements} conges={conges}/>;
    }
  };

  return (
    <div className={`db-layout${collapsed?" db-collapsed":""}`}>
      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        <div className="db-logo">
          <div className="db-logo-icon"><Icon name="book" size={16}/></div>
          {!collapsed && <div className="db-logo-text"><h2>UMS</h2><span>Student Portal</span></div>}
        </div>
        <button className="db-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "›" : "‹"}
        </button>

        {!collapsed && (
          <div className="db-sidebar-profile">
            <div className="db-sidebar-av">{initials}</div>
            <div>
              <div className="db-sidebar-name">{fullName}</div>
              <div className="db-sidebar-meta">
                <span>{user?._id?.toString().slice(-6) || "—"}</span>
                <span className="db-sidebar-dot">·</span>
                <span>{user?.language || "—"}</span>
              </div>
            </div>
          </div>
        )}

        <nav className="db-nav">
          {["main","manage"].map(section => (
            <React.Fragment key={section}>
              {!collapsed && (
                <span className="db-nav-label" style={section==="manage"?{marginTop:10}:{}}>
                  {section === "main" ? "Main" : "Account"}
                </span>
              )}
              {NAV_ITEMS.filter(n => n.section === section).map(n => (
                <button key={n.label}
                  className={`db-nav-item${activeNav===n.label?" db-nav-active":""}`}
                  onClick={() => setActiveNav(n.label)}>
                  <span className="db-nav-icon"><Icon name={n.icon} size={16}/></span>
                  {!collapsed && (
                    <span className="db-nav-text">
                      {n.label}
                      {n.label==="Notifications" && unreadCount > 0 && <span className="db-notif-badge">{unreadCount}</span>}
                      {n.label==="Messages" && unreadMail > 0 && <span className="db-notif-badge">{unreadMail}</span>}
                    </span>
                  )}
                  {collapsed && n.label==="Notifications" && unreadCount > 0 && <span className="db-notif-dot-collapsed"/>}
                  {collapsed && n.label==="Messages" && unreadMail > 0 && <span className="db-notif-dot-collapsed"/>}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          <button className="tc-nav-item tc-nav-danger" onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}>
            <span className="db-nav-icon"><Icon name="logout" size={16}/></span>
            {!collapsed && <span className="db-nav-text">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-header-title">{activeNav}</div>
            <span className="db-header-sub">
              {new Date().toLocaleDateString("en-US", { weekday:"long", day:"numeric", month:"long", year:"numeric" })} · Spring Semester
            </span>
          </div>
          <div className="db-search">
            <Icon name="search" size={13}/>
            <input type="text" placeholder="Search classes, grades…"/>
          </div>
          <div className="db-header-right">
            <button className="db-icon-btn" title="Messages" onClick={() => setActiveNav("Messages")} style={{ position:"relative" }}>
              <Icon name="mail" size={17}/>
              {unreadMail > 0 && <span className="db-badge"/>}
            </button>
            <button className="db-icon-btn" title="Notifications" onClick={() => setActiveNav("Notifications")} style={{ position:"relative" }}>
              <Icon name="bell" size={17}/>
              {unreadCount > 0 && <span className="db-badge"/>}
            </button>
            <div className="db-profile" onClick={() => setActiveNav("Settings")} style={{ cursor:"pointer" }}>
              <div className="db-avatar">{initials}</div>
              <div>
                <span className="db-pname">{user?.prenom || user?.firstName || "Student"}</span>
                <span className="db-prole">Student</span>
              </div>
            </div>
          </div>
        </header>

        <main className="db-content">{renderView()}</main>
      </div>
    </div>
  );
};

export default Dashboard;