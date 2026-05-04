import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import "../../styles/DT.css";
import { useNotifications } from "../../hooks/useNotifications";
import { useSocket } from "../../hooks/useSocket";

const BASE = "http://localhost:5000/api";
const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

function nextLevel(current) {
  const idx = LEVEL_ORDER.indexOf(current);
  if (idx === -1 || idx >= LEVEL_ORDER.length - 1) return null;
  return LEVEL_ORDER[idx + 1];
}

const TIMETABLE_FALLBACK = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

const navItems = [
  { label: "Home", section: "main", icon: "home" },
  { label: "Profile", section: "main", icon: "profile" },
  { label: "Timetable", section: "main", icon: "calendar" },
  { label: "Students", section: "main", icon: "students" },
  { label: "Courses", section: "main", icon: "courses" },
  { label: "Exams", section: "main", icon: "star" },
  { label: "Grades", section: "main", icon: "trend" },
  { label: "Notifications", section: "manage", icon: "bell" },
  { label: "Messages", section: "manage", icon: "mail" },
];

/* ══════════════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════════════ */
const Icon = ({ name, size = 16 }) => {
  const s = { width: size, height: size };
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const icons = {
    home: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    profile: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    students: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    courses: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    logout: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    ),
    send: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    eye: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    trend: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    camera: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    more: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    ),
  };
  return icons[name] || null;
};

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ✅ FIX — hors composant pour éviter recréation à chaque render
function parseSectionTime(timeStr) {
  const results = [];
  const DAY_MAP = {
    Mon: 0,
    Lun: 0,
    Monday: 0,
    Tue: 1,
    Mar: 1,
    Tuesday: 1,
    Wed: 2,
    Mer: 2,
    Wednesday: 2,
    Thu: 3,
    Jeu: 3,
    Thursday: 3,
    Fri: 4,
    Ven: 4,
    Friday: 4,
    Sat: 5,
    Sam: 5,
    Saturday: 5,
    Sun: 6,
    Dim: 6,
    Sunday: 6,
  };
  const NUM_TO_KEY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeMatch = timeStr.match(
    /(\d{1,2}[h:]\d{2})\s*[–\-]\s*(\d{1,2}[h:]\d{2})/,
  );
  if (!timeMatch) return results;
  const start = timeMatch[1].replace("h", ":");
  const end = timeMatch[2].replace("h", ":");
  const dayPart = timeStr.split(/\s+\d/)[0];
  const rawDays = dayPart.split(/[/,\s]+/).filter(Boolean);
  rawDays.forEach((d) => {
    const idx = DAY_MAP[d];
    if (idx !== undefined) results.push({ day: NUM_TO_KEY[idx], start, end });
  });
  return results;
}

function colorForLanguage(str = "") {
  const s = str.toLowerCase();
  if (s.includes("english")) return "blue";
  if (s.includes("french")) return "green";
  if (s.includes("spanish")) return "amber";
  if (s.includes("arabic")) return "green";
  if (s.includes("german")) return "blue";
  if (s.includes("mandarin")) return "red";
  return "blue";
}

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [target, duration]);
  return value.toLocaleString();
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════ */
function StatCard({ icon, label, value, sub, color, warn }) {
  return (
    <div className={`tc-stat tc-stat--${color}`}>
      <div className="tc-stat-ic">
        <Icon name={icon} size={18} />
      </div>
      <div className="tc-stat-body">
        <span className="tc-stat-lbl">{label}</span>
        <strong className="tc-stat-val">{value}</strong>
        {sub && (
          <span className={warn ? "tc-stat-sub--warn" : "tc-stat-sub"}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
function HomePage({ students, messages, onNavigate, courses, timetable }) {
  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.filter((s) => !s.present).length;
  const unreadCount = messages.filter((m) => m.unread).length;
  const totalStudents = useCountUp(students.length);
  const totalCourses = useCountUp(courses?.length || 0);
  const todayKey = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date().getDay()
  ];
  const todayClasses = (timetable || {})[todayKey] || [];
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p>Manage your students, courses, and attendance</p>
        </div>
      </div>
      <div className="tc-stats">
        <StatCard
          color="blue"
          icon="students"
          label="Total Students"
          value={totalStudents}
          sub="+5 this month"
        />
        <StatCard
          color="green"
          icon="courses"
          label="My Courses"
          value={totalCourses}
          sub="assigned sections"
        />
        <StatCard
          color="amber"
          icon="students"
          label="Absences Today"
          value={absentCount}
          sub={`${presentCount} present`}
        />
        <StatCard
          color="blue"
          icon="mail"
          label="Unread Messages"
          value={unreadCount}
          sub={`${unreadCount} unread`}
        />
      </div>
      <div className="tc-home-grid">
        {/* Today Schedule */}
        <div className="tc-panel">
          <div className="tc-panel-header">
            <div>
              <span className="tc-panel-title">Today's Schedule</span>
              <span className="tc-panel-sub">{todayLabel}</span>
            </div>
            <button
              className="tc-btn-link"
              onClick={() => onNavigate("Timetable")}
            >
              View all →
            </button>
          </div>
          {todayClasses.length === 0 ? (
            <div className="tc-empty-state">
              <span>No classes today 🎉</span>
            </div>
          ) : (
            todayClasses.map((c, i) => (
              <div
                key={i}
                className={`tc-schedule-item tc-schedule-item--${c.color}`}
              >
                <div className="tc-schedule-time">{c.time}</div>
                <div className="tc-schedule-body">
                  <span className="tc-schedule-name">{c.subject}</span>
                  <span className="tc-schedule-meta">
                    {c.room} · {c.students} students
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        {/* My Groups */}
        <div className="tc-panel">
          <div className="tc-panel-header">
            <div>
              <span className="tc-panel-title">My Groups</span>
              <span className="tc-panel-sub">
                {courses.length} active course{courses.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button
              className="tc-btn-link"
              onClick={() => onNavigate("Courses")}
            >
              View all →
            </button>
          </div>
          {courses.length === 0 ? (
            <div className="tc-empty-state">
              <span>No sections assigned yet 📚</span>
            </div>
          ) : (
            courses.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className={`tc-schedule-item tc-schedule-item--${c.color || "blue"}`}
              >
                <div className="tc-schedule-time">{c.sessions || "—"}</div>
                <div className="tc-schedule-body">
                  <span className="tc-schedule-name">{c.name}</span>
                  <span className="tc-schedule-meta">
                    {c.room || "—"} · {c.students ?? 0} students
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Recent Messages */}
        <div className="tc-panel">
          <div className="tc-panel-header">
            <div>
              <span className="tc-panel-title">Recent Messages</span>
              <span className="tc-panel-sub">{unreadCount} unread</span>
            </div>
            <button
              className="tc-btn-link"
              onClick={() => onNavigate("Messages")}
            >
              View all →
            </button>
          </div>
          {messages.slice(0, 4).map((m) => (
            <div
              key={m.id}
              className={`tc-msg-preview${m.unread ? " tc-msg-preview--unread" : ""}`}
            >
              <div className="tc-mini-av tc-mini-av--blue">
                {m.avatar.slice(0, 2)}
              </div>
              <div className="tc-msg-preview-body">
                <div className="tc-msg-preview-top">
                  <span className="tc-msg-preview-from">{m.from}</span>
                  <span className="tc-msg-preview-time">{m.time}</span>
                </div>
                <span className="tc-msg-preview-subject">{m.subject}</span>
              </div>
              {m.unread && <span className="tc-unread-dot" />}
            </div>
          ))}
        </div>
        {/* Attendance Summary */}
        <div className="tc-panel">
          <div className="tc-panel-header">
            <div>
              <span className="tc-panel-title">Attendance Summary</span>
              <span className="tc-panel-sub">Today's class</span>
            </div>
            <button
              className="tc-btn-link"
              onClick={() => onNavigate("Students")}
            >
              View all →
            </button>
          </div>
          <div className="tc-att-summary">
            <div className="tc-att-donut-wrap">
              <svg width="90" height="90" viewBox="0 0 90 90">
                {(() => {
                  const r = 32,
                    cx = 45,
                    cy = 45,
                    sw = 14,
                    C = 2 * Math.PI * r;
                  const total = presentCount + absentCount || 1;
                  const pPct = presentCount / total;
                  return (
                    <>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke="#EAF3DE"
                        strokeWidth={sw}
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke="#2D7A3A"
                        strokeWidth={sw}
                        strokeDasharray={`${pPct * C} ${C}`}
                        style={{
                          transform: "rotate(-90deg)",
                          transformOrigin: `${cx}px ${cy}px`,
                        }}
                      />
                      <text
                        x={cx}
                        y={cy - 3}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="600"
                        fill="#111827"
                      >
                        {Math.round(pPct * 100)}%
                      </text>
                      <text
                        x={cx}
                        y={cy + 12}
                        textAnchor="middle"
                        fontSize="8"
                        fill="#9BA5B5"
                      >
                        present
                      </text>
                    </>
                  );
                })()}
              </svg>
              <div className="tc-att-legend">
                <div className="tc-att-leg-row">
                  <span className="tc-att-dot tc-att-dot--green" />
                  <span>Present</span>
                  <strong>{presentCount}</strong>
                </div>
                <div className="tc-att-leg-row">
                  <span className="tc-att-dot tc-att-dot--amber" />
                  <span>Absent</span>
                  <strong>{absentCount}</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="tc-att-list">
            {students.slice(0, 4).map((s) => (
              <div key={s.id} className="tc-att-row">
                <div className="tc-mini-av tc-mini-av--blue">
                  {initials(s.name)}
                </div>
                <span className="tc-att-name">{s.name}</span>
                <span
                  className={`tc-status ${s.present ? "tc-status--present" : "tc-status--absent"}`}
                >
                  <span className="tc-dot" />
                  {s.present ? "Present" : "Absent"}
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
   PROFILE PAGE
══════════════════════════════════════════════════════════════ */
function ProfilePage({ students = [], courses = [] }) {
  const TOKEN = localStorage.getItem("token");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${TOKEN}` }),
    [TOKEN],
  );
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const [profile, setProfile] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    bio: "",
    languages: [],
    levels: [],
    experience: "",
    education: "",
  });
  const set = (key, val) => setProfile((p) => ({ ...p, [key]: val }));

  const [avatarSrc, setAvatarSrc] = useState(
    () => localStorage.getItem("profilePhoto") || null,
  );

  useEffect(() => {
    fetch(`${BASE}/users/me`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        const u = data.user;
        setProfile({
          fname: u.prenom || "",
          lname: u.nom || "",
          email: u.email || "",
          phone: u.telephone || "",
          dob: u.dateNaissance
            ? new Date(u.dateNaissance).toISOString().split("T")[0]
            : "",
          address: u.adresse || "",
          bio: u.notes || "",
          languages: u.specialty ? u.specialty.split(" / ") : [],
          levels: u.classes || [],
          experience: u.experience || "",
          education: u.education || "",
        });
        if (u.avatar) setAvatarSrc(`http://localhost:5000${u.avatar}`);
        else {
          const l = localStorage.getItem("profilePhoto");
          if (l) setAvatarSrc(l);
        }
      });
  }, [headers]);

const handlePhotoChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setPhotoUploading(true);

  const reader = new FileReader();
  reader.onload = (ev) => {
    setAvatarSrc(ev.target.result);
    localStorage.setItem("profilePhoto", ev.target.result);
  };
  reader.readAsDataURL(file);

  try {
    const fd = new FormData();
    fd.append("avatar", file);
    const res = await fetch(`${BASE}/users/upload-avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: fd,
    });
    const uploadData = await res.json();
    if (uploadData.success && uploadData.avatarUrl) {
      const full = `http://localhost:5000${uploadData.avatarUrl}`;
      setAvatarSrc(full);
      localStorage.setItem("profilePhoto", full);
    }
  } catch (err) {
    console.warn("Photo upload failed:", err);
  } finally {
    setPhotoUploading(false);
  }
};
  const handleSave = async () => {
    await fetch(`${BASE}/users/me`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        fname: profile.fname,
        lname: profile.lname,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        address: profile.address,
      }),
    });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  // ✅ FIX — Password change fonctionnel
  const handlePasswordChange = async () => {
    setPwError("");
    setPwOk(false);
    if (!pwForm.current || !pwForm.next) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError("Minimum 8 characters.");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    try {
const res = await fetch(`${BASE}/users/change-password`, {
  method: "PATCH",
  headers: { ...headers, "Content-Type": "application/json" },
  body: JSON.stringify({ currentPwd: pwForm.current, newPwd: pwForm.next }),
});
      const data = await res.json();
      if (data.success) {
        setPwOk(true);
        setPwForm({ current: "", next: "", confirm: "" });
        setTimeout(() => setPwOk(false), 3000);
      } else setPwError(data.message || "Incorrect current password.");
    } catch {
      setPwError("Server error. Please try again.");
    }
  };

  const displayInitials =
    `${profile.fname?.[0] || ""}${profile.lname?.[0] || ""}`.toUpperCase() ||
    "??";

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal and professional information</p>
        </div>
        <button
          className={`tc-btn-primary${editing ? " tc-btn-cancel" : ""}`}
          onClick={() => (editing ? handleSave() : setEditing(true))}
        >
          <Icon name={editing ? "check" : "edit"} size={13} />
          {editing ? "Save changes" : "Edit profile"}
        </button>
      </div>
      {saved && (
        <div className="tc-toast">
          <Icon name="check" size={15} />
          Profile saved successfully!
        </div>
      )}

      <div className="tc-profile-page-grid">
        <div className="tc-panel tc-profile-card">
          <div className="tc-profile-avatar-wrap">
            <div
              className="tc-profile-big-av"
              style={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                background: avatarSrc ? "transparent" : undefined,
              }}
              onClick={() => fileInputRef.current?.click()}
              title="Click to change photo"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                    display: "block",
                  }}
                />
              ) : (
                displayInitials
              )}
              <div
                className="tc-av-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  borderRadius: "inherit",
                  color: "#fff",
                  fontSize: 11,
                  gap: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <Icon name="camera" size={18} />
                <span>{photoUploading ? "Uploading…" : "Change photo"}</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
            <button
              className="tc-btn-upload-av"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoUploading}
              style={{ marginTop: 8 }}
            >
              <Icon name="camera" size={12} />
              {photoUploading ? "Uploading…" : "Change photo"}
            </button>
          </div>
          <strong className="tc-profile-fullname">
            {profile.fname} {profile.lname}
          </strong>
          <span className="tc-profile-role-badge">Teacher</span>
          <span className="tc-profile-email">{profile.email}</span>
          <div className="tc-profile-stats-row">
            <div className="tc-profile-stat">
              <strong>{students.length}</strong>
              <span>Students</span>
            </div>
            <div className="tc-profile-stat">
              <strong>{courses.length}</strong>
              <span>Courses</span>
            </div>
            <div className="tc-profile-stat">
              <strong>{profile.experience || "—"}</strong>
              <span>Experience</span>
            </div>
          </div>
          <div className="tc-profile-langs">
            <span className="tc-profile-sec-label">Languages taught</span>
            <div className="tc-chip-row">
              {profile.languages.map((l) => (
                <span key={l} className="tc-chip tc-chip--blue">
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="tc-profile-langs">
            <span className="tc-profile-sec-label">Levels</span>
            <div className="tc-chip-row">
              {profile.levels.map((lv) => (
                <span
                  key={lv}
                  className={`tc-chip tc-chip--lv tc-chip--${lv[0].toLowerCase()}`}
                >
                  {lv}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="tc-panel tc-profile-fields">
          <span className="tc-section-label">Personal information</span>
          <div className="tc-form-grid2">
            {[
              ["First name", "fname", profile.fname],
              ["Last name", "lname", profile.lname],
            ].map(([label, key, val]) => (
              <div key={key} className="tc-field">
                <label>{label}</label>
                {editing ? (
                  <input
                    value={val}
                    onChange={(e) => set(key, e.target.value)}
                  />
                ) : (
                  <div className="tc-field-view">{val}</div>
                )}
              </div>
            ))}
          </div>
          {[
            ["Email", "email", "email", profile.email],
            ["Phone", "phone", "tel", profile.phone],
            ["Date of birth", "dob", "date", profile.dob],
            ["Address", "address", "text", profile.address],
          ].map(([label, key, type, val]) => (
            <div key={key} className="tc-field">
              <label>{label}</label>
              {editing ? (
                <input
                  type={type}
                  value={val}
                  onChange={(e) => set(key, e.target.value)}
                />
              ) : (
                <div className="tc-field-view">{val}</div>
              )}
            </div>
          ))}
          <span className="tc-section-label" style={{ marginTop: 8 }}>
            Professional information
          </span>
          {[
            ["Experience", "experience", "text", profile.experience],
            ["Education", "education", "text", profile.education],
          ].map(([label, key, type, val]) => (
            <div key={key} className="tc-field">
              <label>{label}</label>
              {editing ? (
                <input
                  type={type}
                  value={val}
                  onChange={(e) => set(key, e.target.value)}
                />
              ) : (
                <div className="tc-field-view">{val}</div>
              )}
            </div>
          ))}
          <div className="tc-field">
            <label>Bio</label>
            {editing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={4}
              />
            ) : (
              <div className="tc-field-view tc-field-view--bio">
                {profile.bio}
              </div>
            )}
          </div>
          {editing && (
            <div className="tc-field-actions">
              <button
                className="tc-btn-ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button className="tc-btn-primary" onClick={handleSave}>
                <Icon name="check" size={13} />
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ FIX — Security fonctionnelle */}
      <div className="tc-panel">
        <span
          className="tc-section-label"
          style={{ marginBottom: 14, display: "block" }}
        >
          Security
        </span>
        {pwError && (
          <div
            style={{
              color: "#C0352A",
              fontSize: 13,
              marginBottom: 10,
              padding: "8px 12px",
              background: "#FCEBEB",
              borderRadius: 8,
            }}
          >
            {pwError}
          </div>
        )}
        {pwOk && (
          <div
            style={{
              color: "#2D7A3A",
              fontSize: 13,
              marginBottom: 10,
              padding: "8px 12px",
              background: "#EAF3DE",
              borderRadius: 8,
            }}
          >
            ✅ Password updated successfully!
          </div>
        )}
        <div className="tc-security-row">
          <div className="tc-field">
            <label>Current password</label>
            <input
              type="password"
              placeholder="Your current password"
              value={pwForm.current}
              onChange={(e) =>
                setPwForm((p) => ({ ...p, current: e.target.value }))
              }
            />
          </div>
          <div className="tc-field">
            <label>New password</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={pwForm.next}
              onChange={(e) =>
                setPwForm((p) => ({ ...p, next: e.target.value }))
              }
            />
          </div>
          <div className="tc-field">
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Repeat new password"
              value={pwForm.confirm}
              onChange={(e) =>
                setPwForm((p) => ({ ...p, confirm: e.target.value }))
              }
            />
          </div>
          <div
            className="tc-field-actions"
            style={{ marginTop: 4, gridColumn: "1/-1" }}
          >
            <button className="tc-btn-primary" onClick={handlePasswordChange}>
              <Icon name="lock" size={13} />
              Update password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TIMETABLE PAGE
══════════════════════════════════════════════════════════════ */
function TimetablePage({ timetable: timetableProp = {} }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [activeDay, setActiveDay] = useState(
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()] ||
      "Mon",
  );
  const TT =
    Object.keys(timetableProp).length > 0 ? timetableProp : TIMETABLE_FALLBACK;
  const totalWeekClasses = Object.values(TT).reduce(
    (acc, arr) => acc + arr.length,
    0,
  );
  const totalStudents = Object.values(TT)
    .flat()
    .reduce((acc, c) => acc + (c.students || 0), 0);
  const teachingHours = (totalWeekClasses * 1.5).toFixed(0);

  // ✅ FIX — Export timetable fonctionnel
  const handleExport = () => {
    const lines = ["TIMETABLE EXPORT", "==================", ""];
    days.forEach((d) => {
      lines.push(`--- ${d} ---`);
      const classes = TT[d] || [];
      if (!classes.length) {
        lines.push("  No classes");
      } else
        classes.forEach((c) =>
          lines.push(
            `  ${c.time}  |  ${c.subject}  |  ${c.room}  |  ${c.students} students`,
          ),
        );
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timetable.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>Timetable</h1>
          <p>Spring Semester 2026 — weekly schedule</p>
        </div>
        {/* ✅ FIX — onClick ajouté */}
        <button className="tc-btn-primary" onClick={handleExport}>
          <Icon name="download" size={13} />
          Export
        </button>
      </div>
      <div
        className="tc-stats"
        style={{ gridTemplateColumns: "repeat(3,1fr)" }}
      >
        <StatCard
          color="blue"
          icon="calendar"
          label="Classes/Week"
          value={totalWeekClasses}
          sub="across 6 days"
        />
        <StatCard
          color="green"
          icon="students"
          label="Students reached"
          value={totalStudents}
          sub="total enrolments"
        />
        <StatCard
          color="amber"
          icon="trend"
          label="Teaching hours"
          value={`${teachingHours}h`}
          sub="per week"
        />
      </div>
      <div className="tc-panel">
        <div className="tc-panel-header">
          <div>
            <span className="tc-panel-title">Daily Schedule</span>
            <span className="tc-panel-sub">
              Click a day to view its classes
            </span>
          </div>
        </div>
        <div className="tc-day-tabs">
          {days.map((d) => (
            <button
              key={d}
              className={`tc-day-tab${activeDay === d ? " tc-day-tab--active" : ""}${(TT[d]?.length || 0) === 0 ? " tc-day-tab--empty" : ""}`}
              onClick={() => setActiveDay(d)}
            >
              <span className="tc-day-tab-name">{d}</span>
              <span className="tc-day-tab-count">
                {TT[d]?.length || 0} class
                {(TT[d]?.length || 0) !== 1 ? "es" : ""}
              </span>
            </button>
          ))}
        </div>
        <div className="tc-tt-list">
          {(TT[activeDay]?.length || 0) === 0 ? (
            <div className="tc-empty-state">No classes on {activeDay} 🗓️</div>
          ) : (
            (TT[activeDay] || []).map((c, i) => (
              <div key={i} className={`tc-tt-item tc-tt-item--${c.color}`}>
                <div className="tc-tt-time-col">
                  <span className="tc-tt-time">{c.time}</span>
                  <span className="tc-tt-duration">90 min</span>
                </div>
                <div className={`tc-tt-bar tc-tt-bar--${c.color}`} />
                <div className="tc-tt-body">
                  <span className="tc-tt-name">{c.subject}</span>
                  <div className="tc-tt-meta">
                    <span>
                      <Icon name="book" size={11} />
                      {c.room}
                    </span>
                    <span>
                      <Icon name="students" size={11} />
                      {c.students} students
                    </span>
                  </div>
                </div>
                <span className={`tc-tt-badge tc-tt-badge--${c.color}`}>
                  {c.subject.split(" ").pop()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="tc-panel">
        <span
          className="tc-panel-title"
          style={{ marginBottom: 14, display: "block" }}
        >
          Weekly overview
        </span>
        <div className="tc-week-grid">
          {days.map((d) => (
            <div
              key={d}
              className={`tc-week-col${d === activeDay ? " tc-week-col--active" : ""}`}
              onClick={() => setActiveDay(d)}
            >
              <div className="tc-week-col-header">
                {d}
                <span>{TT[d]?.length || 0}</span>
              </div>
              {(TT[d] || []).map((c, i) => (
                <div
                  key={i}
                  className={`tc-week-cell tc-week-cell--${c.color}`}
                >
                  {c.subject}
                </div>
              ))}
              {(TT[d]?.length || 0) === 0 && (
                <div className="tc-week-cell tc-week-cell--empty">—</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STUDENTS PAGE
══════════════════════════════════════════════════════════════ */
 function StudentsPage({ students, setStudents }) {
  const TOKEN = localStorage.getItem("token");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${TOKEN}` }),
    [TOKEN],
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("attendance");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingNote, setEditingNote] = useState(null);


  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",

    date: "",
    language: "",
    level: "",
    present: true,
  });

  // ✅ FIX — Notes persistées localStorage + API
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("students_notes") || "{}");
    } catch {
      return {};
    }
  });



  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };


  const filtered = useMemo(
    () =>
      students.filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
          s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
        const matchStatus =
          statusFilter === "All"
            ? true
            : statusFilter === "Present"
              ? s.present
              : !s.present;
        return matchSearch && matchStatus;
      }),
    [search, statusFilter, students],
  );

  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.filter((s) => !s.present).length;


  const addStudent = () => {
    if (!newStudent.name || !newStudent.email) return;
    setStudents((prev) => [...prev, { ...newStudent, id: Date.now() }]);
    setNewStudent({
      name: "",
      email: "",
      phone: "",

      date: "",
      language: "",
      level: "",
      present: true,
    });
    setShowModal(false);
    showToast("Student added successfully!");
  };

  const deleteStudent = (id, e) => {
    e.stopPropagation();
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selected === id) setSelected(null);
    showToast("Student removed.");
  };

const togglePresence = (id, e) => {
  e.stopPropagation();
  const student = students.find(s => s.id === id);
  if (!student) return;

  if (student.present) {
    // ✅ Optimistic update immédiat
    setStudents(prev => prev.map(s => s.id === id ? { ...s, present: false } : s));

    fetch(`${BASE}/absences`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: id,
        name:      student.name,
        language:  student.language,
        level:     student.level,
        date:      new Date().toISOString(),
        session:   'Morning',
        reason:    'Unknown',
        justified: false,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.success) {
          setStudents(prev => prev.map(s => s.id === id ? { ...s, present: true } : s));
          showToast('Erreur lors de l\'enregistrement.');
        } else {
          showToast('Absence enregistrée.');
        }
      })
      .catch(() => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, present: true } : s));
        showToast('Erreur réseau.');
      });

  } else {
    // ✅ Optimistic update immédiat
    setStudents(prev => prev.map(s => s.id === id ? { ...s, present: true } : s));

    fetch(`${BASE}/absences/today/${id}`, {
      method: 'DELETE',
      headers,
    })
      .then(r => r.json())
      .then(data => {
        if (!data.success || data.deleted === 0) {
          // ✅ Rollback si rien supprimé
          setStudents(prev => prev.map(s => s.id === id ? { ...s, present: false } : s));
          showToast('Absence introuvable en base.');
        } else {
          showToast('Marqué comme présent.');
        }
      })
      .catch(() => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, present: false } : s));
        showToast('Erreur réseau.');
      });
  }
};
  // ✅ FIX — Notes unifiées avec /api/notes/teacher
  const saveNote = (studentId, noteText, grade) => {
    const updated = { ...notes, [studentId]: { note: noteText, grade } };
    setNotes(updated);
    localStorage.setItem("students_notes", JSON.stringify(updated));
    fetch(`${BASE}/notes/teacher`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        etudiantId: studentId,
        typeEvaluation: "Written",
        note: parseFloat(grade) || 0,
        noteMax: 20,
        commentaire: noteText,
      }),
    }).catch((err) => console.warn("Note API error:", err));
    setEditingNote(null);
    showToast("Note saved.");
  };




  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>Students</h1>
   <p>Attendance · Notes</p>
        </div>
      </div>
      <div
        className="tc-stats"
    style={{ gridTemplateColumns: "repeat(3,1fr)" }}
      >
        <StatCard
          color="blue"
          icon="students"
          label="Total Enrolled"
          value={students.length}
          sub="+5 this month"
        />
        <StatCard
          color="green"
          icon="check"
          label="Present Today"
          value={presentCount}
          sub={`${students.length ? Math.round((presentCount / students.length) * 100) : 0}% rate`}
        />
        <StatCard
          color="amber"
          icon="bell"
          label="Absent Today"
          value={absentCount}
          sub="needs follow-up"
        />

      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          ["attendance", "Attendance"],
        
          ["notes", "Notes"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "7px 18px",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
              border: activeTab === key ? "none" : "1px solid #d1d5db",
              background: activeTab === key ? "#185FA5" : "transparent",
              color: activeTab === key ? "#fff" : "#6b7280",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tc-panel">
        <div className="tc-toolbar">
          <div className="tc-toolbar-left">
            {activeTab === "attendance" && (
              <button
                className="tc-btn-primary"
                onClick={() => setShowModal(true)}
              >
                <Icon name="plus" size={13} />
                Add student
              </button>
            )}
          </div>
          <div className="tc-toolbar-right">
            <div className="tc-search-inline">
              <Icon name="search" size={12} />
              <input
                type="search"
                placeholder="Search students…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {activeTab === "attendance" && (
              <select
                className="tc-select"
                value={statusFilter}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>All</option>
                <option>Present</option>
                <option>Absent</option>
              </select>
            )}
          </div>
        </div>

        {activeTab === "attendance" && (
          <div className="tc-table-wrap">
            <table className="tc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Language / Level</th>
                  <th>Session</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="tc-empty">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr
                      key={s.id}
                      className={selected === s.id ? "tc-row-selected" : ""}
                      onClick={() =>
                        setSelected(selected === s.id ? null : s.id)
                      }
                    >
                      <td className="tc-td-id">#{String(s.id).slice(-4)}</td>
                      <td>
                        <div className="tc-student-cell">
                          <div className="tc-mini-av tc-mini-av--blue">
                            {initials(s.name)}
                          </div>
                          <div className="tc-student-info">
                            <strong>{s.name}</strong>
                            <span>{s.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="tc-lang-cell">
                          {s.language} ·{" "}
                          <span
                            className={`tc-lvl-badge tc-lvl-badge--${(s.level?.[0] || "a").toLowerCase()}`}
                          >
                            {s.level}
                          </span>
                        </span>
                      </td>
                      <td className="tc-date">{s.section || "—"}</td>
                      <td>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                          onClick={(e) => togglePresence(s.id, e)}
                        >
                          <span
                            className={`tc-status ${s.present ? "tc-status--present" : "tc-status--absent"}`}
                          >
                            <span className="tc-dot" />
                            {s.present ? "Present" : "Absent"}
                          </span>
                        </button>
                      </td>
                      <td>
                        <div className="tc-actions">
                          <button
                            className="tc-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(selected === s.id ? null : s.id);
                            }}
                          >
                            <Icon name="eye" size={14} />
                          </button>
                          <button
                            className="tc-action-btn"
                            onClick={(e) => deleteStudent(s.id, e)}
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

       

        {activeTab === "notes" && (
          <div className="tc-table-wrap">
            <table className="tc-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Level</th>
                  <th>Grade /20</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="tc-empty">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const n = notes[s.id] || { note: "", grade: "" };
                    const gn = parseFloat(n.grade);
                    const gc = isNaN(gn)
                      ? "#6b7280"
                      : gn >= 14
                        ? "#2D7A3A"
                        : gn >= 10
                          ? "#B86A00"
                          : "#C0352A";
                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="tc-student-cell">
                            <div className="tc-mini-av tc-mini-av--blue">
                              {initials(s.name)}
                            </div>
                            <div className="tc-student-info">
                              <strong>{s.name}</strong>
                              <span>{s.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`tc-lvl-badge tc-lvl-badge--${(s.level?.[0] || "a").toLowerCase()}`}
                          >
                            {s.level}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: 16, color: gc }}>
                            {n.grade !== "" ? `${n.grade}/20` : "—"}
                          </strong>
                        </td>
                        <td
                          style={{
                            maxWidth: 200,
                            color: "#6b7280",
                            fontSize: 12,
                          }}
                        >
                          {n.note || (
                            <span style={{ fontStyle: "italic" }}>
                              No note yet
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="tc-action-btn"
                            onClick={() => setEditingNote(s.id)}
                          >
                            <Icon name="edit" size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && (
        <div className="tc-toast">
          <Icon name="check" size={15} />
          {toast}
        </div>
      )}

      {/* Modal Add Student */}
      {showModal && (
        <div className="tc-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tc-modal-header">
              <h3>Add New Student</h3>
              <button
                className="tc-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="tc-modal-body">
              <div className="tc-form-grid2">
                <div className="tc-field">
                  <label>Full Name *</label>
                  <input
                    placeholder="e.g. Mohammed Kaci"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                  />
                </div>
                <div className="tc-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="tc-form-grid2">
                <div className="tc-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                  />
                </div>

              </div>
              <div className="tc-form-grid2">
                <div className="tc-field">
                  <label>Language</label>
                  <select
                    className="tc-select"
                    style={{ width: "100%" }}
                    value={newStudent.language}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, language: e.target.value })
                    }
                  >
                    <option value="">Select…</option>
                    {[
                      "English",
                      "French",
                      "Spanish",
                      "German",
                      "Mandarin",
                      "Arabic",
                    ].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="tc-field">
                  <label>Level</label>
                  <select
                    className="tc-select"
                    style={{ width: "100%" }}
                    value={newStudent.level}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, level: e.target.value })
                    }
                  >
                    <option value="">Select…</option>
                    {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="tc-field">
                <label>Enrolment Date</label>
                <input
                  type="text"
                  placeholder="29 Apr 2026"
                  value={newStudent.date}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="tc-modal-footer">
              <button
                className="tc-btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="tc-btn-primary" onClick={addStudent}>
                <Icon name="plus" size={13} />
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Modal Edit Note */}
      {editingNote &&
        (() => {
          const s = students.find((x) => x.id === editingNote);
          if (!s) return null;
          const existing = notes[editingNote] || { note: "", grade: "" };
          let ln = { ...existing };
          return (
            <div
              className="tc-modal-overlay"
              onClick={() => setEditingNote(null)}
            >
              <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
                <div className="tc-modal-header">
                  <h3>Note — {s.name}</h3>
                  <button
                    className="tc-modal-close"
                    onClick={() => setEditingNote(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="tc-modal-body">
                  <div className="tc-form-grid2">
                    <div className="tc-field">
                      <label>Grade /20</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        defaultValue={ln.grade}
                        onChange={(e) => {
                          ln.grade = e.target.value;
                        }}
                        placeholder="ex: 15.5"
                      />
                    </div>
                    <div className="tc-field">
                      <label>Subject / Exam</label>
                      <input
                        defaultValue={ln.subject || ""}
                        onChange={(e) => {
                          ln.subject = e.target.value;
                        }}
                        placeholder="ex: Mid-term Exam"
                      />
                    </div>
                  </div>
                  <div className="tc-field">
                    <label>Comment</label>
                    <textarea
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        fontSize: 13,
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                      defaultValue={ln.note}
                      onChange={(e) => {
                        ln.note = e.target.value;
                      }}
                      placeholder="Optional comment…"
                    />
                  </div>
                </div>
                <div className="tc-modal-footer">
                  <button
                    className="tc-btn-ghost"
                    onClick={() => setEditingNote(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="tc-btn-primary"
                    onClick={() => saveNote(editingNote, ln.note, ln.grade)}
                  >
                    <Icon name="check" size={13} />
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COURSES PAGE
══════════════════════════════════════════════════════════════ */
function CoursesPage({ courses }) {
  const TOKEN = localStorage.getItem("token");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${TOKEN}` }),
    [TOKEN],
  );
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [sectionStudents, setSectionStudents] = useState({});
  const [loadingStudents, setLoadingStudents] = useState({});

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const loadSectionStudents = async (sectionId) => {
    if (sectionStudents[sectionId]) return;
    setLoadingStudents((prev) => ({ ...prev, [sectionId]: true }));
    try {
      const r = await fetch(`${BASE}/teacher/sections/${sectionId}/students`, {
        headers,
      });
      const d = await r.json();
      if (d.success)
        setSectionStudents((prev) => ({
          ...prev,
          [sectionId]: d.students || [],
        }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  const toggleSection = (id) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      loadSectionStudents(id);
    }
  };

  const levelCls = (lvl) => {
    const c = (lvl?.[0] || "a").toLowerCase();
    return c === "a"
      ? "tc-lvl-badge--a"
      : c === "b"
        ? "tc-lvl-badge--b"
        : "tc-lvl-badge--c";
  };

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>My Courses</h1>
          <p>
            Sections assigned to you · {courses.length} section
            {courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="tc-search-inline">
          <Icon name="search" size={12} />
          <input
            type="search"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {courses.length === 0 ? (
        <div
          className="tc-panel"
          style={{ textAlign: "center", padding: "3rem 1rem" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
          <strong style={{ fontSize: 16 }}>No sections assigned yet</strong>
          <p style={{ color: "var(--tc-text3)", marginTop: 6, fontSize: 13 }}>
            Contact your administrator or secretary to be assigned to a section.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((c) => (
            <div
              key={c.id}
              className="tc-panel"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div
                onClick={() => toggleSection(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 20px",
                  cursor: "pointer",
                  background:
                    expanded === c.id
                      ? "var(--tc-bg-hover,#f8fafc)"
                      : "transparent",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: `var(--tc-${c.color || "blue"}-bg,#E6F1FB)`,
                    color: `var(--tc-${c.color || "blue"},#185FA5)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="courses" size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--tc-text3)",
                      marginTop: 2,
                    }}
                  >
                    {c.language} · {c.level} · {c.sessions} · {c.room}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: "#E6F1FB",
                      color: "#185FA5",
                    }}
                  >
                    {c.students} students
                  </span>
                  <span style={{ fontSize: 18, color: "var(--tc-text3)" }}>
                    {expanded === c.id ? "▾" : "▸"}
                  </span>
                </div>
              </div>
              {expanded === c.id && (
                <div
                  style={{
                    borderTop: "1px solid var(--tc-border,#e5e7eb)",
                    padding: "12px 20px",
                  }}
                >
                  {loadingStudents[c.id] ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "1rem",
                        color: "var(--tc-text3)",
                        fontSize: 13,
                      }}
                    >
                      Loading…
                    </div>
                  ) : (sectionStudents[c.id] || []).length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "1rem",
                        color: "var(--tc-text3)",
                        fontSize: 13,
                      }}
                    >
                      No students enrolled yet.
                    </div>
                  ) : (
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid var(--tc-border,#e5e7eb)",
                          }}
                        >
                          {[
                            "Name",
                            "Email",
                            "Phone",
                            "Level",
                            "Absences",
                            "Status",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                textAlign: "left",
                                padding: "6px 8px",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "var(--tc-text3)",
                                textTransform: "uppercase",
                                letterSpacing: ".04em",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(sectionStudents[c.id] || []).map((s) => {
                          const name =
                            `${s.prenom || ""} ${s.nom || ""}`.trim() ||
                            s.email;
                          return (
                            <tr
                              key={s._id}
                              style={{
                                borderBottom:
                                  "1px solid var(--tc-border,#e5e7eb)",
                              }}
                            >
                              <td style={{ padding: "8px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: "50%",
                                      background:
                                        "linear-gradient(135deg,#185FA5,#1A6CC4)",
                                      color: "#fff",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 10,
                                      fontWeight: 700,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {initials(name)}
                                  </div>
                                  <strong>{name}</strong>
                                </div>
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  color: "var(--tc-text3)",
                                }}
                              >
                                {s.email || "—"}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  color: "var(--tc-text3)",
                                }}
                              >
                                {s.telephone || "—"}
                              </td>
                              <td style={{ padding: "8px" }}>
                                <span
                                  className={`tc-lvl-badge ${levelCls(s.level)}`}
                                >
                                  {s.level || "—"}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  fontWeight: 600,
                                  color:
                                    (s.absences || 0) >= 8
                                      ? "#C0352A"
                                      : (s.absences || 0) >= 4
                                        ? "#7A4A0A"
                                        : "#2D7A3A",
                                }}
                              >
                                {s.absences || 0}
                              </td>
                              <td style={{ padding: "8px" }}>
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: "2px 8px",
                                    borderRadius: 20,
                                    background: s.actif ? "#EAF3DE" : "#FAEEDA",
                                    color: s.actif ? "#2D7A3A" : "#633806",
                                  }}
                                >
                                  {s.actif ? "Active" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MESSAGES PAGE
══════════════════════════════════════════════════════════════ */
function MessagesPage({ messages, setMessages }) {
  const TOKEN = localStorage.getItem("token");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${TOKEN}` }),
    [TOKEN],
  );

  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);
  const [compose, setCompose] = useState(false);
  const [newMsg, setNewMsg] = useState({ to: "", subject: "", body: "" });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
  const unread = messages.filter((m) => m.unread).length;

  const filtered = useMemo(
    () =>
      messages.filter((m) => {
        if (filter === "Unread" && !m.unread) return false;
        if (filter === "Starred" && !m.starred) return false;
        const q = search.toLowerCase();
        return (
          !q ||
          m.from.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q)
        );
      }),
    [messages, filter, search],
  );

  const openMsg = (m) => {
    setSelected(m);
    setMessages((ms) =>
      ms.map((x) => (x.id === m.id ? { ...x, unread: false } : x)),
    );
    // ✅ FIX — Marque comme lu en API
    fetch(`${BASE}/messages/${m.id}/read`, { method: "PUT", headers }).catch(
      () => {},
    );
    setReply("");
    setSent(false);
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    try {
      const res = await fetch(`${BASE}/messages`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selected.from,
          subject: `Re: ${selected.subject}`,
          body: reply,
        }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setSent(true);
        setReply("");
        showToast(`Reply sent to ${selected.from}`);
        setTimeout(() => setSent(false), 2500);
      } else {
        showToast("Failed to send reply.");
      }
    } catch {
      showToast("Network error.");
    }
  };

  // ✅ FIX — sendCompose avec vraie API
  const sendCompose = async () => {
    if (!newMsg.to || !newMsg.subject) {
      showToast("Please fill in To and Subject.");
      return;
    }
    try {
      const res = await fetch(`${BASE}/messages`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setCompose(false);
        setNewMsg({ to: "", subject: "", body: "" });
        showToast("Message sent!");
      } else {
        showToast("Failed to send message.");
      }
    } catch {
      showToast("Network error.");
    }
  };

  const toggleStar = (id, e) => {
    e && e.stopPropagation();
    setMessages((ms) =>
      ms.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    );
  };
  const deleteMsg = (id, e) => {
    e && e.stopPropagation();
    setMessages((ms) => ms.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    fetch(`${BASE}/messages/${id}`, { method: "DELETE", headers }).catch(
      () => {},
    );
    showToast("Message deleted.");
  };
  const markAllRead = () => {
    setMessages((ms) => ms.map((m) => ({ ...m, unread: false })));
    fetch(`${BASE}/messages/read-all`, { method: "PUT", headers }).catch(
      () => {},
    );
    showToast("All messages marked as read.");
  };

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>Messages</h1>
          <p>
            {unread} unread message{unread !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {unread > 0 && (
            <button className="tc-btn-ghost" onClick={markAllRead}>
              <Icon name="check" size={13} />
              Mark all read
            </button>
          )}
          <button className="tc-btn-primary" onClick={() => setCompose(true)}>
            <Icon name="plus" size={13} />
            Compose
          </button>
        </div>
      </div>
      <div className="tc-msg-layout">
        <div className="tc-msg-sidebar">
          <div className="tc-msg-filters">
            {["All", "Unread", "Starred"].map((f) => (
              <button
                key={f}
                className={`tc-msg-filter-btn${filter === f ? " tc-msg-filter-btn--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
                {f === "Unread" && unread > 0 && (
                  <span className="tc-msg-filter-count">{unread}</span>
                )}
              </button>
            ))}
          </div>
          <div className="tc-msg-search">
            <Icon name="search" size={12} />
            <input
              type="text"
              placeholder="Search messages…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="tc-msg-list">
            {filtered.length === 0 ? (
              <div className="tc-empty-state" style={{ padding: "32px 16px" }}>
                No messages found.
              </div>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  className={`tc-msg-item${selected?.id === m.id ? " tc-msg-item--active" : ""}${m.unread ? " tc-msg-item--unread" : ""}`}
                  onClick={() => openMsg(m)}
                >
                  <div className="tc-msg-item-top">
                    <div className="tc-mini-av tc-mini-av--blue">
                      {m.avatar.slice(0, 2)}
                    </div>
                    <div className="tc-msg-item-info">
                      <div className="tc-msg-item-row1">
                        <span className="tc-msg-item-from">{m.from}</span>
                        <span className="tc-msg-item-time">{m.time}</span>
                      </div>
                      <span className="tc-msg-item-subject">{m.subject}</span>
                      <span className="tc-msg-item-preview">
                        {m.body.slice(0, 60)}…
                      </span>
                    </div>
                  </div>
                  <div className="tc-msg-item-actions">
                    <button
                      className={`tc-msg-star${m.starred ? " tc-msg-star--active" : ""}`}
                      onClick={(e) => toggleStar(m.id, e)}
                    >
                      ★
                    </button>
                    <button
                      className="tc-msg-del"
                      onClick={(e) => deleteMsg(m.id, e)}
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="tc-msg-content">
          {!selected ? (
            <div className="tc-msg-empty">
              <Icon name="mail" size={32} />
              <span>Select a message to read</span>
            </div>
          ) : (
            <>
              <div className="tc-msg-view-header">
                <div className="tc-msg-view-from">
                  <div className="tc-mini-av tc-mini-av--blue tc-mini-av--lg">
                    {selected.avatar.slice(0, 2)}
                  </div>
                  <div>
                    <strong>{selected.from}</strong>
                    <span>
                      {selected.role} · {selected.date}
                    </span>
                  </div>
                </div>
                <div className="tc-msg-view-subject">{selected.subject}</div>
                <button
                  className={`tc-msg-star tc-msg-star--lg${selected.starred ? " tc-msg-star--active" : ""}`}
                  onClick={(e) => toggleStar(selected.id, e)}
                >
                  ★
                </button>
                <button
                  className="tc-msg-del"
                  style={{ marginLeft: 6 }}
                  onClick={(e) => deleteMsg(selected.id, e)}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
              <div className="tc-msg-view-body">{selected.body}</div>
              <div className="tc-msg-reply">
                <span className="tc-msg-reply-label">
                  Reply to {selected.from}
                </span>
                <textarea
                  className="tc-msg-reply-input"
                  placeholder="Write your reply…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                />
                {sent && (
                  <div className="tc-toast tc-toast--inline">
                    <Icon name="check" size={13} />
                    Reply sent!
                  </div>
                )}
                <div className="tc-msg-reply-footer">
                  <button className="tc-btn-ghost" onClick={() => setReply("")}>
                    Clear
                  </button>
                  <button className="tc-btn-primary" onClick={sendReply}>
                    <Icon name="send" size={13} />
                    Send reply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {toast && (
        <div className="tc-toast">
          <Icon name="check" size={15} />
          {toast}
        </div>
      )}
      {compose && (
        <div className="tc-modal-overlay" onClick={() => setCompose(false)}>
          <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tc-modal-header">
              <h3>New Message</h3>
              <button
                className="tc-modal-close"
                onClick={() => setCompose(false)}
              >
                ✕
              </button>
            </div>
            <div className="tc-modal-body">
              <div className="tc-field">
                <label>To</label>
                <input
                  placeholder="Recipient name or email"
                  value={newMsg.to}
                  onChange={(e) => setNewMsg({ ...newMsg, to: e.target.value })}
                />
              </div>
              <div className="tc-field">
                <label>Subject</label>
                <input
                  placeholder="Message subject"
                  value={newMsg.subject}
                  onChange={(e) =>
                    setNewMsg({ ...newMsg, subject: e.target.value })
                  }
                />
              </div>
              <div className="tc-field">
                <label>Message</label>
                <textarea
                  rows={5}
                  placeholder="Write your message…"
                  value={newMsg.body}
                  style={{
                    padding: "9px 12px",
                    border: "var(--tc-border2)",
                    borderRadius: "var(--tc-r)",
                    background: "var(--tc-bg)",
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    resize: "vertical",
                    width: "100%",
                  }}
                  onChange={(e) =>
                    setNewMsg({ ...newMsg, body: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="tc-modal-footer">
              <button
                className="tc-btn-ghost"
                onClick={() => setCompose(false)}
              >
                Cancel
              </button>
              <button className="tc-btn-primary" onClick={sendCompose}>
                <Icon name="send" size={13} />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXAMS PAGE
══════════════════════════════════════════════════════════════ */
function ExamsPage({ courses }) {
  const TOKEN = localStorage.getItem("token");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${TOKEN}` }),
    [TOKEN],
  );

  // ✅ FIX — Persistance localStorage
  const [exams, setExams] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("exams_cache") || "[]");
    } catch {
      return [];
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

 const EXAM_TYPES = ["Written", "Oral", "Listening", "Speaking"];
  const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const [form, setForm] = useState({
    subject: "",
    section: "",
    level: "",
    type: "Written",
    date: "",
    time: "",
    duration: "90",
    room: "",
    description: "",
    maxScore: "20",
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    fetch(`${BASE}/teacher/exams`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setExams(data.exams || []);
          localStorage.setItem("exams_cache", JSON.stringify(data.exams || []));
        }
      })
      .catch(() => {});
  }, [headers]);

  const addExam = async () => {
    if (!form.subject || !form.date || !form.section) {
      showToast("Please fill in Title, Section and Date.");
      return;
    }
    let newExam = {
      ...form,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch(`${BASE}/teacher/exams`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) newExam = data.exam;
    } catch {}
    const updated = [newExam, ...exams];
    setExams(updated);
    localStorage.setItem("exams_cache", JSON.stringify(updated));
    setShowModal(false);
    setForm({
      subject: "",
      section: "",
      level: "",
      type: "Written",
      date: "",
      time: "",
      duration: "90",
      room: "",
      description: "",
      maxScore: "20",
    });
    showToast("Exam scheduled successfully!");
  };

  const deleteExam = (exam) => {
    const id = exam._id || exam.id;
    const updated = exams.filter((e) => (e._id || e.id) !== id);
    setExams(updated);
    localStorage.setItem("exams_cache", JSON.stringify(updated));
    fetch(`${BASE}/teacher/exams/${id}`, { method: "DELETE", headers }).catch(
      () => {},
    );
    showToast("Exam deleted.");
  };

  const filtered = exams.filter(
    (e) =>
      (e.subject || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.section || "").toLowerCase().includes(search.toLowerCase()),
  );
  const now = new Date();
  const upcoming = filtered.filter((e) => new Date(e.date) >= now);
  const past = filtered.filter((e) => new Date(e.date) < now);

  const TYPE_COLOR = {
    Written: "blue",
    Oral: "green",
    Listening: "amber",
    Speaking: "green",
    Mixed: "blue",
  };
  const colorMap = { blue: "#185FA5", green: "#3B6D11", amber: "#854F0B" };
  const bgMap = { blue: "#E6F1FB", green: "#EAF3DE", amber: "#FAEEDA" };

  const ExamCard = ({ exam }) => {
    const tc = TYPE_COLOR[exam.type] || "blue";
    const isUpcoming = new Date(exam.date) >= now;
    return (
      <div
        style={{
          background: "var(--tc-bg,#fff)",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          borderLeft: `4px solid ${colorMap[tc]}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{exam.subject}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
              {exam.section} · {exam.level}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: 20,
                background: bgMap[tc],
                color: colorMap[tc],
              }}
            >
              {exam.type}
            </span>
            <button
              onClick={() => deleteExam(exam)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                padding: 4,
              }}
            >
              <Icon name="trash" size={14} />
            </button>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 8,
            fontSize: 12,
          }}
        >
          {[
            [
              "📅 Date",
              exam.date
                ? new Date(exam.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—",
            ],
            ["🕐 Time", exam.time || "—"],
            ["⏱ Duration", exam.duration ? `${exam.duration} min` : "—"],
            ["🏫 Room", exam.room || "—"],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{
                background: "#f9fafb",
                borderRadius: 8,
                padding: "6px 10px",
              }}
            >
              <div style={{ color: "#9ca3af", fontSize: 11 }}>{label}</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{val}</div>
            </div>
          ))}
        </div>
        {exam.description && (
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              fontStyle: "italic",
              borderTop: "1px solid #f3f4f6",
              paddingTop: 8,
            }}
          >
            {exam.description}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#6b7280" }}>
            Max score:{" "}
            <strong style={{ color: "#185FA5" }}>
              {exam.maxScore || 20}/20
            </strong>
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: 20,
              background: isUpcoming ? "#EAF3DE" : "#f3f4f6",
              color: isUpcoming ? "#2D7A3A" : "#9ca3af",
            }}
          >
            {isUpcoming ? "Upcoming" : "Completed"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>Exams</h1>
          <p>Schedule and manage your exams</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="tc-search-inline">
            <Icon name="search" size={12} />
            <input
              type="search"
              placeholder="Search exams…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="tc-btn-primary" onClick={() => setShowModal(true)}>
            <Icon name="plus" size={13} />
            New Exam
          </button>
        </div>
      </div>
      <div
        className="tc-stats"
        style={{ gridTemplateColumns: "repeat(3,1fr)" }}
      >
        <StatCard
          color="blue"
          icon="calendar"
          label="Total Exams"
          value={exams.length}
          sub="this semester"
        />
        <StatCard
          color="green"
          icon="star"
          label="Upcoming"
          value={upcoming.length}
          sub="scheduled"
        />
        <StatCard
          color="amber"
          icon="check"
          label="Completed"
          value={past.length}
          sub="done"
        />
      </div>
      {upcoming.length > 0 && (
        <div className="tc-panel">
          <div className="tc-panel-header">
            <span className="tc-panel-title">Upcoming Exams</span>
            <span className="tc-panel-sub">{upcoming.length} scheduled</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 12,
              marginTop: 12,
            }}
          >
            {upcoming.map((e) => (
              <ExamCard key={e._id || e.id} exam={e} />
            ))}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div className="tc-panel">
          <div className="tc-panel-header">
            <span className="tc-panel-title">Past Exams</span>
            <span className="tc-panel-sub">{past.length} completed</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 12,
              marginTop: 12,
              opacity: 0.75,
            }}
          >
            {past.map((e) => (
              <ExamCard key={e._id || e.id} exam={e} />
            ))}
          </div>
        </div>
      )}
      {exams.length === 0 && (
        <div
          className="tc-panel"
          style={{ textAlign: "center", padding: "3rem 1rem" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
          <strong style={{ fontSize: 16 }}>No exams scheduled yet</strong>
          <p style={{ color: "var(--tc-text3)", marginTop: 6, fontSize: 13 }}>
            Click "New Exam" to schedule your first exam.
          </p>
        </div>
      )}
      {toast && (
        <div className="tc-toast">
          <Icon name="check" size={15} />
          {toast}
        </div>
      )}
      {showModal && (
        <div className="tc-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="tc-modal"
            style={{ maxWidth: 560 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tc-modal-header">
              <h3>Schedule New Exam</h3>
              <button
                className="tc-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="tc-modal-body">
              <div className="tc-field" style={{ marginBottom: 12 }}>
                <label>Exam Title *</label>
                <input
                  placeholder="e.g. Mid-term Speaking Test"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                />
              </div>
              <div className="tc-form-grid2">
                <div className="tc-field">
                  <label>Section *</label>
                  <select
                    className="tc-select"
                    style={{ width: "100%" }}
                    value={form.section}
                    onChange={(e) => set("section", e.target.value)}
                  >
                    <option value="">Select section…</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__custom__">Other…</option>
                  </select>
                  {form.section === "__custom__" && (
                    <input
                      style={{ marginTop: 6 }}
                      placeholder="Section name"
                      onChange={(e) => set("section", e.target.value)}
                    />
                  )}
                </div>
                <div className="tc-field">
                  <label>Level</label>
                  <select
                    className="tc-select"
                    style={{ width: "100%" }}
                    value={form.level}
                    onChange={(e) => set("level", e.target.value)}
                  >
                    <option value="">Select…</option>
                    {LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="tc-form-grid2">
                <div className="tc-field">
                  <label>Exam Type</label>
                  <select
                    className="tc-select"
                    style={{ width: "100%" }}
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                  >
                    {EXAM_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="tc-field">
                  <label>Max Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.maxScore}
                    onChange={(e) => set("maxScore", e.target.value)}
                    placeholder="20"
                  />
                </div>
              </div>
              <div className="tc-form-grid2">
                <div className="tc-field">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </div>
                <div className="tc-field">
                  <label>Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => set("time", e.target.value)}
                  />
                </div>
              </div>
              <div className="tc-form-grid2">
                <div className="tc-field">
                  <label>Duration (min)</label>
                  <input
                    type="number"
                    min="15"
                    max="300"
                    step="15"
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  />
                </div>
                <div className="tc-field">
                  <label>Room</label>
                  <input
                    placeholder="e.g. Room 204"
                    value={form.room}
                    onChange={(e) => set("room", e.target.value)}
                  />
                </div>
              </div>
              <div className="tc-field">
                <label>Instructions / Description</label>
                <textarea
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                  placeholder="Topics covered, materials allowed…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
            </div>
            <div className="tc-modal-footer">
              <button
                className="tc-btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="tc-btn-primary" onClick={addExam}>
                <Icon name="calendar" size={13} />
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   GRADES PAGE
══════════════════════════════════════════════════════════════ */
function GradesPage({ students, setStudents, courses }) {
  const TOKEN = localStorage.getItem("token");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${TOKEN}` }),
    [TOKEN],
  );

  const [grades, setGrades] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("grades_cache") || "{}");
    } catch {
      return {};
    }
  });
  const [selectedSection, setSelectedSection] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState({});
  const [loading, setLoading] = useState(false);

const EXAM_TYPES = ["Written", "Oral", "Listening", "Speaking"];
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const scoreToLevel = (avg) => {
    if (avg >= 18) return "C2";
    if (avg >= 16) return "C1";
    if (avg >= 14) return "B2";
    if (avg >= 12) return "B1";
    if (avg >= 10) return "A2";
    return "A1";
  };

  const LEVEL_STYLE = {
    C2: { color: "#27500A", bg: "#C0DD97" },
    C1: { color: "#3B6D11", bg: "#EAF3DE" },
    B2: { color: "#0C447C", bg: "#B5D4F4" },
    B1: { color: "#185FA5", bg: "#E6F1FB" },
    A2: { color: "#633806", bg: "#FAEEDA" },
    A1: { color: "#A32D2D", bg: "#FCEBEB" },
  };

  useEffect(() => {
    if (!courses.length) return;
    let cancelled = false;
    const loadGrades = async () => {
      setLoading(true);
      const merged = {};
      for (const course of courses) {
        try {
          const r = await fetch(`${BASE}/notes/teacher/section/${course.id}`, {
            headers,
          });
          const data = await r.json();
          if (data.success && data.grades) {
            Object.entries(data.grades).forEach(([sid, g]) => {
              merged[sid] = { ...(merged[sid] || {}), ...g };
            });
          }
        } catch (err) {
          console.warn("Load grades error:", err);
        }
      }
      if (!cancelled) {
        setGrades((prev) => {
          const final = { ...prev, ...merged };
          localStorage.setItem("grades_cache", JSON.stringify(final));
          return final;
        });
        setLoading(false);
      }
    };
    loadGrades();
    return () => {
      cancelled = true;
    };
  }, [courses, headers]);

  const calcAverage = (studentId) => {
    const g = grades[studentId] || {};
    const vals = EXAM_TYPES.map((t) => parseFloat(g[t])).filter(
      (v) => !isNaN(v) && v >= 0,
    );
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

 const setGrade = (studentId, type, value) => {
  const num = parseFloat(value);
  if (value !== "" && (isNaN(num) || num < 0 || num > 20)) return; // bloque > 20
  setGrades(prev => {
    const updated = {
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), [type]: value },
    };
    localStorage.setItem("grades_cache", JSON.stringify(updated));
    return updated;
  });
};
  const getCourseIdForStudent = (student) =>
    courses.find((c) => c.name === student.section)?.id || null;

  const saveStudentGrades = async (student) => {
  const g = grades[student.id] || {};
  const avg = calcAverage(student.id);
  if (avg === null) {
    showToast("Enter at least one grade first.");
    return;
  }
  const coursId = getCourseIdForStudent(student);
  if (!coursId) {
    showToast("Section not found for this student.");
    return;
  }
  setSaving((prev) => ({ ...prev, [student.id]: true }));
  try {
    for (const type of EXAM_TYPES) {
      const val = parseFloat(g[type]);
      if (isNaN(val)) continue;
      await fetch(`${BASE}/notes/teacher`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          etudiantId: student.id,
          coursId,
          typeEvaluation: type,
          note: val,
          noteMax: 20,
          commentaire: `${type} — saved by teacher`,
        }),
      });
    }

    // ── Progression de niveau (un seul cran à la fois) ──
    const currentLevel = student.level;
    const suggestedLevel = scoreToLevel(avg);
    const suggestedIdx = LEVEL_ORDER.indexOf(suggestedLevel);
    const currentIdx = LEVEL_ORDER.indexOf(currentLevel);
    const allowed = nextLevel(currentLevel);

    if (suggestedIdx > currentIdx && allowed) {
      await fetch(`${BASE}/users/${student.id}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ level: allowed }),
      }).catch(() => {});

      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, level: allowed } : s
        )
      );
      showToast(`✅ ${student.name} promoted to ${allowed}`);
    } else {
      showToast(`✅ Grades saved for ${student.name} — Level: ${scoreToLevel(avg)}`);
    }

  } catch (err) {
    console.error(err);
    showToast("Error saving grades.");
  } finally {
    setSaving((prev) => ({ ...prev, [student.id]: false }));
  }
};
  const saveAllGrades = async () => {
    const list = filteredStudents.filter((s) => calcAverage(s.id) !== null);
    if (!list.length) {
      showToast("No grades to save.");
      return;
    }
    for (const s of list) await saveStudentGrades(s);
    showToast(`✅ All grades saved (${list.length} students)`);
  };

  const filteredStudents = students.filter((s) => {
    const matchSection =
      selectedSection === "all" || s.section === selectedSection;
    const matchSearch =
      !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchSection && matchSearch;
  });

  const studentsWithAvg = filteredStudents.filter(
    (s) => calcAverage(s.id) !== null,
  );
  const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
  studentsWithAvg.forEach((s) => {
    levelCounts[scoreToLevel(calcAverage(s.id))]++;
  });
  const sections = [
    "all",
    ...new Set(students.map((s) => s.section).filter(Boolean)),
  ];

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>Grades</h1>
          <p>
            Enter grades by exam type — CECRL level calculated automatically
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="tc-search-inline">
            <Icon name="search" size={12} />
            <input
              type="search"
              placeholder="Search student…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="tc-btn-primary" onClick={saveAllGrades}>
            <Icon name="check" size={13} /> Save all
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {Object.entries(levelCounts).map(([lvl, count]) => (
          <div
            key={lvl}
            style={{
              textAlign: "center",
              padding: "12px 8px",
              borderRadius: 10,
              background: LEVEL_STYLE[lvl].bg,
              border: `1px solid ${LEVEL_STYLE[lvl].color}33`,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: LEVEL_STYLE[lvl].color,
              }}
            >
              {count}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: LEVEL_STYLE[lvl].color,
              }}
            >
              {lvl}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}
      >
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSection(s)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: selectedSection === s ? "none" : "1px solid #d1d5db",
              background: selectedSection === s ? "#185FA5" : "transparent",
              color: selectedSection === s ? "#fff" : "#6b7280",
            }}
          >
            {s === "all" ? "All sections" : s}
          </button>
        ))}
      </div>
     
      <div className="tc-panel" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}
          >
            Loading grades…
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tc-table" style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={{ minWidth: 180 }}>Student</th>
                  <th style={{ minWidth: 60 }}>Level</th>
                  {EXAM_TYPES.map((t) => (
                    <th key={t} style={{ minWidth: 100, textAlign: "center" }}>
                      {t} /20
                    </th>
                  ))}
                  <th style={{ minWidth: 90, textAlign: "center" }}>Average</th>
                  <th style={{ minWidth: 80, textAlign: "center" }}>CECRL</th>
                  <th style={{ minWidth: 80, textAlign: "center" }}>Save</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={EXAM_TYPES.length + 5} className="tc-empty">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const avg = calcAverage(s.id);
                    const level = avg !== null ? scoreToLevel(avg) : null;
                    const ls = level ? LEVEL_STYLE[level] : null;
                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="tc-student-cell">
                            <div className="tc-mini-av tc-mini-av--blue">
                              {initials(s.name)}
                            </div>
                            <div className="tc-student-info">
                              <strong>{s.name}</strong>
                              <span>{s.section || "—"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`tc-lvl-badge tc-lvl-badge--${(s.level?.[0] || "a").toLowerCase()}`}
                          >
                            {s.level || "—"}
                          </span>
                        </td>
                        {EXAM_TYPES.map((type) => (
                          <td
                            key={type}
                            style={{ textAlign: "center", padding: "6px 8px" }}
                          >
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={grades[s.id]?.[type] ?? ""}
                              onChange={(e) =>
                                setGrade(s.id, type, e.target.value)
                              }
                                onBlur={(e) => {           // ← ajouter ce bloc
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v > 20) setGrade(s.id, type, "20");
  }}
                              style={{
                                width: 70,
                                padding: "5px 8px",
                                textAlign: "center",
                                border: "1px solid #d1d5db",
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 500,
                                background:
                                  grades[s.id]?.[type] !== undefined &&
                                  grades[s.id]?.[type] !== ""
                                    ? "#E6F1FB"
                                    : "#fff",
                              }}
                              placeholder="—"
                            />
                          </td>
                        ))}
                        <td style={{ textAlign: "center" }}>
                          {avg !== null ? (
                            <strong
                              style={{
                                fontSize: 15,
                                color: avg >= 10 ? "#2D7A3A" : "#C0352A",
                              }}
                            >
                              {avg.toFixed(1)}/20
                            </strong>
                          ) : (
                            <span style={{ color: "#9ca3af" }}>—</span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {level ? (
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                padding: "4px 12px",
                                borderRadius: 20,
                                background: ls.bg,
                                color: ls.color,
                                border: `1px solid ${ls.color}44`,
                                display: "inline-block",
                              }}
                            >
                              {level}
                            </span>
                          ) : (
                            <span style={{ color: "#9ca3af", fontSize: 12 }}>
                              —
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => saveStudentGrades(s)}
                            disabled={saving[s.id] || avg === null}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 500,
                              border: "none",
                              cursor: avg === null ? "not-allowed" : "pointer",
                              background: avg === null ? "#f3f4f6" : "#185FA5",
                              color: avg === null ? "#9ca3af" : "#fff",
                              opacity: saving[s.id] ? 0.6 : 1,
                            }}
                          >
                            {saving[s.id] ? (
                              "…"
                            ) : (
                              <>
                                <Icon name="check" size={12} /> Save
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {studentsWithAvg.length > 0 && (
        <div className="tc-panel" style={{ marginTop: 16 }}>
          <div className="tc-panel-header">
            <span className="tc-panel-title">Class Summary</span>
            <span className="tc-panel-sub">
              {studentsWithAvg.length} student(s) graded
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 12,
            }}
          >
            {filteredStudents
              .filter((s) => calcAverage(s.id) !== null)
              .map((s) => {
                const avg = calcAverage(s.id);
                const lvl = scoreToLevel(avg);
                const ls = LEVEL_STYLE[lvl];
                const pct = Math.round((avg / 20) * 100);
                return (
                  <div
                    key={s.id}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      className="tc-mini-av tc-mini-av--blue"
                      style={{ flexShrink: 0 }}
                    >
                      {initials(s.name)}
                    </div>
                    <span
                      style={{ minWidth: 140, fontSize: 13, fontWeight: 500 }}
                    >
                      {s.name}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: "#f3f4f6",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          borderRadius: 4,
                          background:
                            avg >= 14
                              ? "#2D7A3A"
                              : avg >= 10
                                ? "#185FA5"
                                : "#C0352A",
                          transition: "width 0.6s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        minWidth: 50,
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {avg.toFixed(1)}/20
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "2px 10px",
                        borderRadius: 20,
                        background: ls.bg,
                        color: ls.color,
                        minWidth: 36,
                        textAlign: "center",
                      }}
                    >
                      {lvl}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {toast && (
        <div className="tc-toast">
          <Icon name="check" size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function TeacherDashboard() {
  const [activeNav, setActiveNav] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [timetable, setTimetable] = useState({});

  const TOKEN = localStorage.getItem("token");

  // ✅ FIX — headers mémorisé pour éviter recréation à chaque render
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${TOKEN}` }),
    [TOKEN],
  );

  const currentUserId = useMemo(() => {
    try {
      const payload = JSON.parse(atob(TOKEN.split(".")[1]));
      return payload.id || payload._id || payload.userId;
    } catch {
      return null;
    }
  }, [TOKEN]);

  const {
    notifications,
    unreadCount: notifUnreadCount,
    markRead,
  } = useNotifications(currentUserId);

  // ✅ FIX — loadTeacherSectionsAndStudents mémorisé pour useSocket
  const loadTeacherSectionsAndStudents = useCallback(async () => {
    try {
      const r = await fetch(`${BASE}/teacher/sections`, { headers });
      const data = await r.json();
      if (!data.success) return;
      setCourses(
        data.sections.map((c) => ({
          id: c._id,
          name: c.name,
          teacher: c.teacher || "—",
          students: c.studentIds?.length ?? 0,
          studentIds: c.studentIds || [],
          sessions: c.time || "—",
          room: c.room || "—",
          language: c.language || "",
          level: c.level || "",
          color: colorForLanguage(c.language || c.name),
          progress: 0,
        })),
      );
      const allStudents = [];
      for (const section of data.sections) {
        try {
          const sr = await fetch(
            `${BASE}/teacher/sections/${section._id}/students`,
            { headers },
          );
          const sd = await sr.json();
          if (sd.success) {
            (sd.students || []).forEach((s) => {
              if (!allStudents.find((x) => x.id === s._id)) {
                allStudents.push({
                  id: s._id,
                  name: `${s.prenom || ""} ${s.nom || ""}`.trim() || s.email,
                  email: s.email,
             
                  date: new Date(s.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                  present: true,
                  level: s.level || "A1",
                  language: s.language || "—",
                  phone: s.telephone || "—",
                  section: section.name,
                  sessions: section.time || "—", 
                  absences: s.absences || 0,
                });
              }
            });
          }
        } catch (err) {
          console.error(err);
        }
      }





try {
  const absRes  = await fetch(`${BASE}/absences`, { headers });
  const absData = await absRes.json();

  if (absData.success) {
    const now = new Date();
    const todayY = now.getFullYear();
    const todayM = now.getMonth();
    const todayD = now.getDate();

    const absentIds = new Set(
      (absData.absences || [])
        .filter(a => {
          const d = new Date(a.date);
          return (
            d.getFullYear() === todayY &&
            d.getMonth()    === todayM &&
            d.getDate()     === todayD
          );
        })
        .map(a => String(a.studentId || ''))
        .filter(Boolean)
    );

    setStudents(allStudents.map(s => ({
      ...s,
      present: !absentIds.has(String(s.id)),
    })));
  } else {
    setStudents(allStudents);
  }
} catch {
  setStudents(allStudents);
}

    } catch (err) {
      console.error("Sections/Students error:", err);
    }
  }, [headers]);

  // ✅ FIX — Socket avec bonne référence de fonction
const socketHandler = useCallback((event, data) => {
  switch (event) {
    case 'absence:marked':
      if (data.absent !== undefined) {
        setStudents(prev =>
          prev.map(s =>
            String(s.id) === String(data.studentId)
              ? { ...s, present: !data.absent }
              : s
          )
        );
      }
      break;
    case 'section:updated':
    case 'section:assigned':
      loadTeacherSectionsAndStudents();
      break;
    default:
      break;
  }
}, [loadTeacherSectionsAndStudents]);

useSocket(currentUserId, socketHandler);
  const loadProfile = useCallback(() => {
    fetch(`${BASE}/users/me`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.user);
          if (data.user.avatar)
            localStorage.setItem(
              "profilePhoto",
              `http://localhost:5000${data.user.avatar}`,
            );
        }
      })
      .catch((err) => console.error("Profile error:", err));
  }, [headers]);

  const loadMessages = useCallback(() => {
    fetch(`${BASE}/messages`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setMessages(
            (data.messages || []).map((m) => ({
              id: m._id,
              from: m.senderName || m.expediteur || m.from || "Unknown",
              avatar: (m.senderName || m.expediteur || "?")
                .slice(0, 2)
                .toUpperCase(),
              role: m.senderRole || "User",
              time: new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              date: new Date(m.createdAt).toLocaleDateString(),
              subject: m.subject || m.objet || "(no subject)",
              body: m.body || m.contenu || m.content || "",
              unread: m.lu === false || m.read === false || !m.read,
              starred: m.starred || false,
            })),
          );
        }
      })
      .catch((err) => console.error("Messages error:", err));
  }, [headers]);

  const loadTimetable = useCallback(async () => {
    try {
      const secRes = await fetch(`${BASE}/teacher/sections`, { headers });
      const secData = await secRes.json();
      if (!secData.success || !secData.sections?.length) return;
      const tt = {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
      };
      const NUM_TO_DAY = {
        0: "Mon",
        1: "Tue",
        2: "Wed",
        3: "Thu",
        4: "Fri",
        5: "Sat",
        6: "Sun",
      };
      const ALT_TO_DAY = {
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
        7: "Sun",
      };
      for (const section of secData.sections) {
        try {
          const empRes = await fetch(
            `${BASE}/emplois?sectionId=${section._id}`,
            { headers },
          );
          const empData = await empRes.json();
          if (empData.success && empData.data?.length) {
            empData.data.forEach((e) => {
              const day = NUM_TO_DAY[e.dayOfWeek] ?? ALT_TO_DAY[e.dayOfWeek];
              if (!day) return;
              tt[day].push({
                time: `${e.startTime}–${e.endTime}`,
                subject: e.subject || section.name,
                room: e.room || section.room || "—",
                students: section.studentIds?.length ?? 0,
                color: colorForLanguage(section.language || ""),
                sectionId: section._id,
              });
            });
          } else if (section.time && section.time !== "—") {
            parseSectionTime(section.time).forEach(({ day, start, end }) => {
              if (!tt[day]) return;
              tt[day].push({
                time: `${start}–${end}`,
                subject: section.name,
                room: section.room || "—",
                students: section.studentIds?.length ?? 0,
                color: colorForLanguage(section.language || ""),
                sectionId: section._id,
              });
            });
          }
        } catch {
          if (section.time && section.time !== "—") {
            parseSectionTime(section.time).forEach(({ day, start, end }) => {
              if (!tt[day]) return;
              tt[day].push({
                time: `${start}–${end}`,
                subject: section.name,
                room: section.room || "—",
                students: section.studentIds?.length ?? 0,
                color: colorForLanguage(section.language || ""),
                sectionId: section._id,
              });
            });
          }
        }
      }
      setTimetable(tt);
    } catch (err) {
      console.error("Timetable error:", err);
    }
  }, [headers]);

  useEffect(() => {
    const init = async () => {
      await loadProfile();
      await loadTeacherSectionsAndStudents();
      loadMessages();
      loadTimetable();
    };
    init();
  }, [
    loadProfile,
    loadTeacherSectionsAndStudents,
    loadMessages,
    loadTimetable,
  ]);

  const unreadCount = messages.filter((m) => m.unread).length;
  const displayInitials = profile
    ? `${profile.prenom?.[0] || ""}${profile.nom?.[0] || ""}`.toUpperCase()
    : "??";
  const savedPhoto = localStorage.getItem("profilePhoto");

  // ✅ FIX — Search bar connectée à la navigation
  const handleGlobalSearch = (q) => {
    setSearch(q);
    if (q.length > 1) setActiveNav("Students");
  };

  const renderPage = () => {
    switch (activeNav) {
      case "Home":
        return (
          <HomePage
            students={students}
            messages={messages}
            onNavigate={setActiveNav}
            timetable={timetable}
            courses={courses}
          />
        );
      case "Profile":
        return <ProfilePage students={students} courses={courses} />;
      case "Timetable":
        return <TimetablePage timetable={timetable} />;
      case "Students":
        return <StudentsPage students={students} setStudents={setStudents} />;
      case "Courses":
        return <CoursesPage courses={courses} />;
      case "Exams":
        return <ExamsPage courses={courses} />;
case "Grades":
  return <GradesPage students={students} setStudents={setStudents} courses={courses} />;
      case "Messages":
        return <MessagesPage messages={messages} setMessages={setMessages} />;
      case "Notifications":
        return (
          <div className="tc-page">
            <div className="tc-page-header">
              <div>
                <h1>Notifications</h1>
                <p>{notifUnreadCount} unread</p>
              </div>
            </div>
            <div className="tc-panel">
              {notifications.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "var(--tc-text3)",
                  }}
                >
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "14px 16px",
                      borderBottom: "1px solid var(--tc-border)",
                      cursor: "pointer",
                      background: n.read ? "transparent" : "#E6F1FB",
                      borderLeft: n.read
                        ? "3px solid transparent"
                        : "3px solid #185FA5",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {n.title}
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#666", margin: "2px 0" }}
                      >
                        {n.msg}
                      </div>
                      <div style={{ fontSize: 11, color: "#999" }}>
                        {n.time}
                      </div>
                    </div>
                    {!n.read && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#185FA5",
                          alignSelf: "center",
                          flexShrink: 0,
                        }}
                      />
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
            students={students}
            messages={messages}
            onNavigate={setActiveNav}
            timetable={timetable}
            courses={courses}
          />
        );
    }
  };

  return (
    <div className={`tc-layout${collapsed ? " tc-collapsed" : ""}`}>
      <aside className="tc-sidebar">
        <div className="tc-logo">
          <div className="tc-logo-icon">
            <Icon name="book" size={16} />
          </div>
          {!collapsed && (
            <div className="tc-logo-text">
              <h2>Language</h2>
              <span>School</span>
            </div>
          )}
        </div>
        <button
          className="tc-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title="Toggle sidebar"
        >
          {collapsed ? "›" : "‹"}
        </button>
        {!collapsed && (
          <div className="tc-profile">
            <div
              className="tc-avatar tc-avatar--lg"
              style={{ overflow: "hidden", padding: 0 }}
            >
              {savedPhoto ? (
                <img
                  src={savedPhoto}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                  }}
                />
              ) : (
                displayInitials
              )}
            </div>
            <div className="tc-profile-info">
              <strong>
                {profile ? `${profile.prenom} ${profile.nom}` : "Teacher"}
              </strong>
              <span>Teacher</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="tc-profile tc-profile--mini">
            <div
              className="tc-avatar tc-avatar--sm"
              style={{ overflow: "hidden", padding: 0 }}
            >
              {savedPhoto ? (
                <img
                  src={savedPhoto}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                  }}
                />
              ) : (
                displayInitials
              )}
            </div>
          </div>
        )}
        <nav className="tc-nav">
          {["main", "manage"].map((section) => (
            <React.Fragment key={section}>
              {!collapsed && (
                <span
                  className="tc-nav-label"
                  style={section === "manage" ? { marginTop: 10 } : {}}
                >
                  {section === "main" ? "Principal" : "Gestion"}
                </span>
              )}
              {navItems
                .filter((n) => n.section === section)
                .map((n) => (
                  <button
                    key={n.label}
                    className={`tc-nav-item${activeNav === n.label ? " tc-nav-active" : ""}`}
                    onClick={() => setActiveNav(n.label)}
                  >
                    <span className="tc-nav-icon">
                      <Icon name={n.icon} size={16} />
                    </span>
                    {!collapsed && (
                      <span className="tc-nav-text">
                        {n.label}
                        {n.label === "Messages" && unreadCount > 0 && (
                          <span className="tc-notif-badge">{unreadCount}</span>
                        )}
                        {n.label === "Notifications" &&
                          notifUnreadCount > 0 && (
                            <span className="tc-notif-badge">
                              {notifUnreadCount}
                            </span>
                          )}
                      </span>
                    )}
                    {collapsed && n.label === "Messages" && unreadCount > 0 && (
                      <span className="tc-notif-dot-collapsed" />
                    )}
                  </button>
                ))}
            </React.Fragment>
          ))}
        </nav>
        <div className="tc-sidebar-bottom">
          <button
            className="tc-nav-item tc-nav-danger"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("nom");
              localStorage.removeItem("prenom");
              localStorage.removeItem("profilePhoto");
              localStorage.removeItem("grades_cache");
              localStorage.removeItem("exams_cache");
              localStorage.removeItem("students_notes");
             
              window.location.href = "/login";
            }}
          >
            <span className="tc-nav-icon">
              <Icon name="logout" size={16} />
            </span>
            {!collapsed && <span className="tc-nav-text">Log out</span>}
          </button>
        </div>
      </aside>

      <div className="tc-main">
        <header className="tc-header">
          <div className="tc-header-left">
            <div className="tc-header-title">{activeNav}</div>
            <span className="tc-header-sub">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · Spring Semester
            </span>
          </div>
          {/* ✅ FIX — Search bar connectée */}
          <div className="tc-search">
            <Icon name="search" size={13} />
            <input
              type="text"
              placeholder="Search students…"
              value={search}
              onChange={(e) => handleGlobalSearch(e.target.value)}
            />
          </div>
          <div className="tc-header-right">
            <button
              className="tc-icon-btn"
              title="Messages"
              onClick={() => setActiveNav("Messages")}
              style={{ position: "relative" }}
            >
              <Icon name="mail" size={17} />
              {unreadCount > 0 && (
                <span className="tc-badge-count">{unreadCount}</span>
              )}
            </button>
            <button
              className="tc-icon-btn"
              title="Notifications"
              onClick={() => setActiveNav("Notifications")}
              style={{ position: "relative" }}
            >
              <Icon name="bell" size={17} />
              {notifUnreadCount > 0 && (
                <span className="tc-badge-count">{notifUnreadCount}</span>
              )}
            </button>
            <div
              className="tc-profile-pill"
              onClick={() => setActiveNav("Profile")}
            >
              <div
                className="tc-avatar tc-avatar--sm"
                style={{ overflow: "hidden", padding: 0 }}
              >
                {savedPhoto ? (
                  <img
                    src={savedPhoto}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "inherit",
                    }}
                  />
                ) : (
                  displayInitials
                )}
              </div>
              <div>
                <span className="tc-pname">
                  {profile
                    ? `${profile.prenom} ${profile.nom?.[0] || ""}.`
                    : "Teacher"}
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="tc-content">{renderPage()}</main>
      </div>
    </div>
  );
}
