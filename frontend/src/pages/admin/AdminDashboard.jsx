import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import "../../styles/Dashboard.css";
import { useNotifications } from "../../hooks/useNotifications";
import { useSocket } from "../../hooks/useSocket";

/* ══════════════════════════════════════════════════════════════
   HELPERS TOKEN
══════════════════════════════════════════════════════════════ */
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Vérifier expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return null;
    }
    return payload.id || payload._id || payload.userId;
  } catch {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }
}

const API = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  }).then((res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return res.json();
  });
}

/* ══════════════════════════════════════════════════════════════
   ICON COMPONENT
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
    grid: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    teacher: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    building: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    credit: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    file: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    logout: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    trend: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    useradd: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
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
    lock: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    refresh: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    briefcase: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };
  return icons[name] || null;
};

/* ══════════════════════════════════════════════════════════════
   CONFIRMATION DIALOG
══════════════════════════════════════════════════════════════ */
function ConfirmDialog({ message, onConfirm, onCancel, danger = true }) {
  return (
    <div className="vp-overlay" onClick={onCancel}>
      <div
        className="vp-modal"
        style={{ maxWidth: 380 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vp-modal-top">
          <div className="vp-modal-head">
            <span
              style={{ fontSize: 14, fontWeight: 600, color: "var(--db-text)" }}
            >
              {danger ? "⚠️ Confirm deletion" : "Confirm"}
            </span>
          </div>
        </div>
        <div className="vp-modal-body">
          <p style={{ fontSize: 13, color: "var(--db-text2)", margin: 0 }}>
            {message}
          </p>
        </div>
        <div className="vp-modal-foot">
          <button className="vp-modal-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: "var(--db-r)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: danger ? "#A32D2D" : "#185FA5",
              color: "#fff",
              border: "none",
            }}
            onClick={onConfirm}
          >
            {danger ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   RECORD PAYMENT MODAL
══════════════════════════════════════════════════════════════ */
function RecordPaymentModal({ payment, onClose, onSaved }) {
  const [amount, setAmount] = useState(
    String(payment.amount - payment.paid || 0),
  );
  const [method, setMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const val = Number(amount);
    if (!val || val <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (val > payment.amount - payment.paid) {
      setError(`Maximum: ${payment.amount - payment.paid} DA`);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch(`/payments/${payment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ paid: payment.paid + val, method }),
      });
      if (data.success) {
        onSaved(data.payment);
        onClose();
      } else setError(data.message || "Error");
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const METHODS = ["Cash", "CCP", "Transfer", "Card"];

  return (
    <div className="vp-overlay" onClick={onClose}>
      <div
        className="vp-modal"
        style={{ maxWidth: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vp-modal-top">
          <div className="vp-modal-head">
            <div>
              <span className="vp-modal-id">{payment.id}</span>
              <span className="vp-modal-name">{payment.student}</span>
            </div>
            <button className="vp-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <div className="vp-modal-body">
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "var(--db-text2)" }}>
              Balance due:{" "}
              <strong style={{ color: "#A32D2D" }}>
                {(payment.amount - payment.paid).toLocaleString()} DA
              </strong>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text)",
                }}
              >
                Amount (DA) *
              </label>
              <input
                type="number"
                min="1"
                max={payment.amount - payment.paid}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                style={{
                  border: "var(--db-border2)",
                  borderRadius: "var(--db-r)",
                  padding: "8px 12px",
                  fontSize: 13,
                  background: "var(--db-bg)",
                  color: "var(--db-text)",
                  outline: "none",
                  borderColor: error ? "#A32D2D" : undefined,
                }}
              />
              {error && (
                <span style={{ fontSize: 11, color: "#A32D2D" }}>{error}</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text)",
                }}
              >
                Payment method
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "var(--db-r)",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: method === m ? 600 : 400,
                      background: method === m ? "#E6F1FB" : "var(--db-bg)",
                      color: method === m ? "#185FA5" : "var(--db-text2)",
                      border:
                        method === m
                          ? "1.5px solid #185FA5"
                          : "var(--db-border2)",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="vp-modal-foot">
          <button className="vp-modal-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="vp-modal-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "Saving…"
            ) : (
              <>
                <Icon name="check" size={13} /> Record payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DATA (fallback statique)
══════════════════════════════════════════════════════════════ */
const FALLBACK_ATTENDANCE = [
  { day: "Mon", students: 94, teachers: 88 },
  { day: "Tue", students: 88, teachers: 85 },
  { day: "Wed", students: 90, teachers: 87 },
  { day: "Thu", students: 91, teachers: 89 },
  { day: "Fri", students: 87, teachers: 84 },
];

const FALLBACK_REVENUE = [
  { m: "Oct", v: 182000 },
  { m: "Nov", v: 195000 },
  { m: "Dec", v: 171000 },
  { m: "Jan", v: 208000 },
  { m: "Feb", v: 224000 },
  { m: "Mar", v: 237000 },
  { m: "Apr", v: 148000 },
];

const NAV_ITEMS = [
  { label: "Dashboard",      section: "main",   icon: "grid",     badge: null },
  { label: "Students",       section: "main",   icon: "users",    badge: null },
  { label: "Teachers",       section: "main",   icon: "teacher",  badge: null },
  { label: "Classes",        section: "main",   icon: "building", badge: null }, // ← était "Sections"
  { label: "Notifications",  section: "manage", icon: "bell",     badge: "notif" },
  { label: "Payments",       section: "manage", icon: "credit",   badge: null },
  { label: "Absences",       section: "manage", icon: "file",     badge: null },
  { label: "Settings",       section: "manage", icon: "settings", badge: null },
];

const VA_LANGUAGES = [
  "All",
  "English",
  "French",
  "Spanish",
  "German",
  "Arabic",
  "Mandarin",
];
const VA_SESSIONS = ["All", "Morning", "Evening", "Weekend"];
const VA_REASONS = ["All", "Sick", "Personal", "Travel", "Unknown"];
const VP_FILTERS = ["All", "Paid", "Partial", "Pending", "Overdue"];
const VP_STATUS = {
  paid: { cls: "vp-st-paid", label: "Paid", dot: "#27500A", prog: "#3B6D11" },
  partial: {
    cls: "vp-st-partial",
    label: "Partial",
    dot: "#0C447C",
    prog: "#185FA5",
  },
  pending: {
    cls: "vp-st-pending",
    label: "Pending",
    dot: "#633806",
    prog: "#B5D4F4",
  },
  overdue: {
    cls: "vp-st-overdue",
    label: "Overdue",
    dot: "#A32D2D",
    prog: "#A32D2D",
  },
};
const ACCENT_COLORS = [
  "#185FA5",
  "#3B6D11",
  "#7C3AED",
  "#B45309",
  "#0F766E",
  "#BE185D",
  "#C2410C",
  "#374151",
];
const AU_LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "German",
  "Arabic",
  "Mandarin",
];
const AU_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const AU_SCHEDULES = ["Morning", "Evening", "Weekend"];
const AU_PERMISSIONS = [
  "Student management",
  "Payment management",
  "Absence management",
  "View reports",
  "Edit schedule",
];
const ROLES = [
  {
    id: "etudiant",
    label: "Student",
    icon: "users",
    color: "#185FA5",
    bg: "#E6F1FB",
    desc: "Learner enrolled in a course",
  },
  {
    id: "professeur",
    label: "Teacher",
    icon: "teacher",
    color: "#3B6D11",
    bg: "#EAF3DE",
    desc: "Language instructor",
  },
  {
    id: "secretaire",
    label: "Secretary",
    icon: "briefcase",
    color: "#7C3AED",
    bg: "#F3F0FF",
    desc: "Administrative staff",
  },
  {
    id: "parent",
    label: "Parent",
    icon: "heart",
    color: "#BE185D",
    bg: "#FDF2F8",
    desc: "Parent or guardian of a student",
  },
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const initials = (name) =>
  !name
    ? "??"
    : name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase();
const levelCls = (lvl) => {
  const c = (lvl?.[0] || "a").toLowerCase();
  return c === "a" ? "db-lv-a" : c === "b" ? "db-lv-b" : "db-lv-c";
};
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const fmtDA = (n) => (n || 0).toLocaleString("en-US") + " DA";
const pct = (d) => (d.amount ? Math.round((d.paid / d.amount) * 100) : 0);

/* ══════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════ */
function useCountUp(target, duration = 1200, suffix = "") {
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
  return suffix === "%" ? value.toFixed(1) + "%" : value.toLocaleString();
}

function useCountUpDA(target, dur = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [target, dur]);
  return val.toLocaleString("en-US") + " DA";
}

/* ══════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════ */
function Toast({ msg, color = "#2D7A3A" }) {
  return (
    <div
      className="st-saved-toast"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
    >
      <Icon name="check" size={14} /> {msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════ */
function StatCard({ icon, label, value, delta, icBg, icColor, deltaColor }) {
  return (
    <div className="db-stat" style={{ borderTopColor: icColor || "#1A6CC4" }}>
      <div
        className="db-stat-ic"
        style={icBg ? { background: icBg, color: icColor } : {}}
      >
        <Icon name={icon} size={18} />
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
   CHARTS
══════════════════════════════════════════════════════════════ */
function LineChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 560,
    H = 190,
    PAD = { t: 15, r: 12, b: 28, l: 32 };
  const cw = W - PAD.l - PAD.r,
    ch = H - PAD.t - PAD.b;
  const MIN = 80,
    MAX = 100;
  const xs = data.map((_, i) => PAD.l + i * (cw / (data.length - 1)));
  const ys = (v) => PAD.t + ch - ((v - MIN) / (MAX - MIN)) * ch;
  const pathD = (key) =>
    data
      .map((d, i) => `${i === 0 ? "M" : "L"}${xs[i]},${ys(d[key])}`)
      .join(" ");
  const areaD = (key) => {
    const last = xs[xs.length - 1];
    return pathD(key) + ` L${last},${H - PAD.b} L${PAD.l},${H - PAD.b} Z`;
  };

  return (
    <div className="db-line-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="db-line-svg"
      >
        <defs>
          <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#185FA5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#185FA5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#97C459" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#97C459" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[82, 86, 90, 94, 98].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              y1={ys(v)}
              x2={W - PAD.r}
              y2={ys(v)}
              stroke="rgba(0,0,0,0.07)"
              strokeWidth="0.8"
              strokeDasharray="4 3"
            />
            <text
              x={PAD.l - 5}
              y={ys(v) + 4}
              fontSize="10"
              fill="var(--db-text3)"
              textAnchor="end"
            >
              {v}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text
            key={d.day}
            x={xs[i]}
            y={H - 5}
            fontSize="10"
            fill="var(--db-text2)"
            textAnchor="middle"
          >
            {d.day}
          </text>
        ))}
        <path d={areaD("teachers")} fill="url(#gt)" />
        <path d={areaD("students")} fill="url(#gs)" />
        <path
          d={pathD("teachers")}
          fill="none"
          stroke="#97C459"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={pathD("students")}
          fill="none"
          stroke="#185FA5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <g key={d.day}>
            <circle
              cx={xs[i]}
              cy={ys(d.students)}
              r="4"
              fill="#fff"
              stroke="#185FA5"
              strokeWidth="2.5"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  label: d.day,
                  key: "students",
                  val: d.students,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            />
            <circle
              cx={xs[i]}
              cy={ys(d.teachers)}
              r="4"
              fill="#fff"
              stroke="#97C459"
              strokeWidth="2.5"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  label: d.day,
                  key: "teachers",
                  val: d.teachers,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}
      </svg>
      {tooltip && (
        <div
          className="db-chart-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <strong>
            {tooltip.key === "students" ? "Students" : "Teachers"}
          </strong>
          {tooltip.label}: {tooltip.val}%
        </div>
      )}
    </div>
  );
}

function RevenueChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 560,
    H = 148,
    PAD = { t: 12, r: 10, b: 28, l: 42 };
  const cw = W - PAD.l - PAD.r,
    ch = H - PAD.t - PAD.b;
  const minV = 140000,
    maxV = Math.max(...data.map((d) => d.v));
  const xs = data.map((_, i) => PAD.l + i * (cw / (data.length - 1)));
  const yv = (v) => PAD.t + ch - ((v - minV) / (maxV - minV)) * ch;
  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${xs[i]},${yv(d.v)}`)
    .join(" ");
  const areaD =
    pathD + ` L${xs[xs.length - 1]},${H - PAD.b} L${PAD.l},${H - PAD.b} Z`;

  return (
    <div className="vp-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="db-line-svg"
        style={{ width: "100%", height: H }}
      >
        <defs>
          <linearGradient id="vp-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#185FA5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#185FA5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[160000, 190000, 220000].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              y1={yv(v)}
              x2={W - PAD.r}
              y2={yv(v)}
              stroke="rgba(0,0,0,0.07)"
              strokeWidth="0.8"
              strokeDasharray="4 3"
            />
            <text
              x={PAD.l - 5}
              y={yv(v) + 4}
              fontSize="10"
              fill="var(--db-text2,#666)"
              textAnchor="end"
            >
              {Math.round(v / 1000)}k
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text
            key={d.m}
            x={xs[i]}
            y={H - 5}
            fontSize="10"
            fill="var(--db-text2,#666)"
            textAnchor="middle"
          >
            {d.m}
          </text>
        ))}
        <path d={areaD} fill="url(#vp-area)" />
        <path
          d={pathD}
          fill="none"
          stroke="#185FA5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle
            key={d.m}
            cx={xs[i]}
            cy={yv(d.v)}
            r="4"
            fill={i === data.length - 1 ? "#185FA5" : "#fff"}
            stroke="#185FA5"
            strokeWidth="2.5"
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) =>
              setTooltip({ x: e.clientX, y: e.clientY, ...d })
            }
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>
      {tooltip && (
        <div
          className="db-chart-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 44 }}
        >
          <strong>{tooltip.m} 2026</strong>
          {fmtDA(tooltip.v)}
        </div>
      )}
    </div>
  );
}

function Donut({ counts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const slices = [
    { key: "paid", color: "#3B6D11", label: "Paid" },
    { key: "partial", color: "#185FA5", label: "Partial" },
    { key: "pending", color: "#854F0B", label: "Pending" },
    { key: "overdue", color: "#A32D2D", label: "Overdue" },
  ];
  const R = 50,
    cx = 60,
    cy = 60,
    sw = 18,
    r = R - sw / 2,
    C = 2 * Math.PI * r;
  let cum = 0;
  return (
    <div className="vp-donut-wrap">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        style={{ flexShrink: 0 }}
      >
        {slices.map((s) => {
          const frac = counts[s.key] / total,
            dash = frac * C,
            offset = C - cum * C;
          cum += frac;
          return (
            <circle
              key={s.key}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={sw}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={offset}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: `${cx}px ${cy}px`,
              }}
            />
          );
        })}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fontSize="17"
          fontWeight="600"
          fill="var(--db-text,#1a1a1a)"
        >
          {Math.round((counts.paid / total) * 100)}%
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="9"
          fill="var(--db-text2,#666)"
        >
          collected
        </text>
      </svg>
      <div className="vp-donut-legend">
        {slices.map((s) => (
          <div className="vp-donut-row" key={s.key}>
            <div className="vp-donut-dot" style={{ background: s.color }} />
            <span className="vp-donut-lbl">{s.label}</span>
            <span className="vp-donut-n">{counts[s.key]}</span>
            <span className="vp-donut-pct">
              {Math.round((counts[s.key] / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADD USER MODAL
══════════════════════════════════════════════════════════════ */
const initialUserForm = {
  role: "",
  fname: "",
  lname: "",
  email: "",
  phone: "",
  dob: "",
  language: "",
  level: "",
  schedule: "",
  notes: "",
  specialty: "",
  hours: "",
  department: "",
  permissions: [],
  linkedStudent: "",
};

function AddUser({ onClose, onSaved, students, defaultRole = "" }) {
  const [form, setForm] = useState({ ...initialUserForm, role: defaultRole });
  const [errors, setErrors] = useState({});
  // FIX: si defaultRole fourni, on commence à l'étape 2 (role déjà sélectionné)
  const [step, setStep] = useState(defaultRole ? 2 : 1);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: false }));
  };
  const togglePerm = (p) =>
    set(
      "permissions",
      form.permissions.includes(p)
        ? form.permissions.filter((x) => x !== p)
        : [...form.permissions, p],
    );

  const roleConfig = ROLES.find((r) => r.id === form.role);
  const lvCls = (lvl) => {
    if (!lvl) return "";
    const c = lvl[0].toLowerCase();
    return c === "a" ? "as-lv-a" : c === "b" ? "as-lv-b" : "as-lv-c";
  };
  const stepLabels = ["Role", "Info", "Details", "Confirm"];

  const validate = () => {
    const e = {};
    if (step === 1 && !form.role) e.role = true;
    if (step === 2) {
      if (!form.fname.trim()) e.fname = true;
      if (!form.lname.trim()) e.lname = true;
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
        e.email = true;
    }
    if (step === 3) {
      if (form.role === "professeur" && !form.specialty.trim())
        e.specialty = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validate()) return;
    if (step === 2) {
      try {
        const data = await apiFetch("/users/validate-step", {
          method: "POST",
          body: JSON.stringify({ step: 2, email: form.email }),
        });
        if (!data.success) {
          setErrors((e) => ({ ...e, email: true }));
          return;
        }
      } catch {
        /* offline — continuer quand même */
      }
    }// Skip Details step for students
    if (form.role === "etudiant") {
      setStep(4);
      return;
    }
    setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setSaved(true);
    try {
      const data = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!data.success) {
        setSaved(false);
        setErrors({ email: data.message });
        return;
      }
      setTimeout(() => {
        setSaved(false);
        if (onSaved) onSaved(data.user);
        if (onClose) onClose();
      }, 1800);
    } catch (err) {
      console.error("Submit error:", err);
      setSaved(false);
    }
  };

  const ini = `${form.fname?.[0] ?? "?"}${form.lname?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="au-overlay">
      <div className="au-modal">
        <div className="au-header">
          <div>
            <span className="au-title">Add a user</span>
            <span className="au-subtitle">
              Create a new account for your institution
            </span>
          </div>
          {onClose && (
            <button className="au-close" onClick={onClose}>
              <Icon name="close" size={14} />
            </button>
          )}
        </div>

        {/* Stepper */}
        <div className="au-stepper">
          {stepLabels.map((label, i) => {
            const n = i + 1,
              done = step > n,
              active = step === n,
              disabled = !form.role && n > 1;
            return (
              <React.Fragment key={label}>
                <div
                  className={`au-step${active ? " au-step-active" : ""}${done ? " au-step-done" : ""}${disabled ? " au-step-disabled" : ""}`}
                >
                  <div className="au-step-circle">
                    {done ? <Icon name="check" size={11} /> : n}
                  </div>
                  <span className="au-step-label">{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`au-step-line${done ? " au-step-line-done" : ""}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1 — Role */}
        {step === 1 && (
          <div className="au-body">
            <p className="au-body-hint">Choose the type of account to create</p>
            <div className="au-role-grid">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  className={`au-role-card${form.role === r.id ? " au-role-active" : ""}${errors.role ? " au-role-err" : ""}`}
                  style={
                    form.role === r.id
                      ? { borderColor: r.color, background: r.bg }
                      : {}
                  }
                  onClick={() => set("role", r.id)}
                >
                  <div
                    className="au-role-icon"
                    style={{ background: r.bg, color: r.color }}
                  >
                    <Icon name={r.icon} size={20} />
                  </div>
                  <span
                    className="au-role-label"
                    style={form.role === r.id ? { color: r.color } : {}}
                  >
                    {r.label}
                  </span>
                  <span className="au-role-desc">{r.desc}</span>
                  {form.role === r.id && (
                    <div
                      className="au-role-check"
                      style={{ background: r.color }}
                    >
                      <Icon name="check" size={10} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {errors.role && (
              <span className="au-errmsg" style={{ textAlign: "center" }}>
                Please select a role
              </span>
            )}
          </div>
        )}

        {/* Step 2 — Info */}
        {step === 2 && (
          <div className="au-body">
            {roleConfig && (
              <div
                className="au-role-badge"
                style={{
                  background: roleConfig.bg,
                  color: roleConfig.color,
                  borderColor: `${roleConfig.color}30`,
                }}
              >
                <Icon name={roleConfig.icon} size={13} /> {roleConfig.label}
              </div>
            )}
            <div className="au-row">
              <div className="au-field">
                <label>
                  First name <span className="au-req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Mohammed"
                  className={errors.fname ? "au-err" : ""}
                  value={form.fname}
                  onChange={(e) => set("fname", e.target.value)}
                />
                {errors.fname && <span className="au-errmsg">Required</span>}
              </div>
              <div className="au-field">
                <label>
                  Last name <span className="au-req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Kaci"
                  className={errors.lname ? "au-err" : ""}
                  value={form.lname}
                  onChange={(e) => set("lname", e.target.value)}
                />
                {errors.lname && <span className="au-errmsg">Required</span>}
              </div>
            </div>
            <div className="au-field">
              <label>
                Email address <span className="au-req">*</span>
              </label>
              <input
                type="email"
                placeholder="user@school.dz"
                className={errors.email ? "au-err" : ""}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
              {errors.email && (
                <span className="au-errmsg">
                  {typeof errors.email === "string"
                    ? errors.email
                    : "Valid email required"}
                </span>
              )}
            </div>
            <div className="au-row">
              <div className="au-field">
                <label>
                  Phone <span className="au-optional">(optional)</span>
                </label>
<input
  type="tel"
  placeholder="0600000000"
  maxLength={10}
  value={form.phone}
  onChange={(e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    set("phone", val);
  }}
/>
              </div>
              <div className="au-field">
                <label>
                  Date of birth <span className="au-optional">(optional)</span>
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => set("dob", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Details */}
        {step === 3 && (
          <div className="au-body">
            {form.role === "etudiant" && (
              <>
                <div className="au-field">
                  <label>
                    Language <span className="au-req">*</span>
                  </label>
                  <div className="au-chips">
                    {AU_LANGUAGES.map((l) => (
                      <button
                        key={l}
                        className={`au-chip${form.language === l ? " au-chip-active" : ""}${errors.language ? " au-chip-err" : ""}`}
                        onClick={() => set("language", l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  {errors.language && (
                    <span className="au-errmsg">Select a language</span>
                  )}
                </div>
                <div className="au-field">
                  <label>
                    Level <span className="au-req">*</span>
                  </label>
                  <div className="au-chips">
                    {AU_LEVELS.map((lv) => (
                      <button
                        key={lv}
                        className={`au-chip au-chip-lv${form.level === lv ? " au-chip-lv-active " + lvCls(lv) : ""}${errors.level ? " au-chip-err" : ""}`}
                        onClick={() => set("level", lv)}
                      >
                        {lv}
                      </button>
                    ))}
                  </div>
                  {errors.level && (
                    <span className="au-errmsg">Select a level</span>
                  )}
                </div>
                <div className="au-field">
                  <label>
                    Schedule <span className="au-req">*</span>
                  </label>
                  <div className="au-chips">
                    {AU_SCHEDULES.map((s) => (
                      <button
                        key={s}
                        className={`au-chip${form.schedule === s ? " au-chip-active" : ""}${errors.schedule ? " au-chip-err" : ""}`}
                        onClick={() => set("schedule", s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.schedule && (
                    <span className="au-errmsg">Select a schedule</span>
                  )}
                </div>
                <div className="au-field">
                  <label>
                    Notes <span className="au-optional">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Additional information…"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </div>
              </>
            )}
            {form.role === "professeur" && (
              <>
                <div className="au-field">
                  <label>
                    Specialty <span className="au-req">*</span>
                  </label>
                  <div className="au-chips">
                    {AU_LANGUAGES.map((l) => (
                      <button
                        key={l}
                        className={`au-chip${form.specialty.includes(l) ? " au-chip-active" : ""}`}
                        onClick={() => {
                          const parts = form.specialty
                            ? form.specialty.split(" / ")
                            : [];
                          const next = parts.includes(l)
                            ? parts.filter((x) => x !== l)
                            : [...parts, l];
                          set("specialty", next.join(" / "));
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  {errors.specialty && (
                    <span className="au-errmsg">
                      Select at least one specialty
                    </span>
                  )}
                </div>

                <div className="au-field">
                  <label>
                    Notes <span className="au-optional">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Experience, remarks…"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </div>
              </>
            )}
            {form.role === "secretaire" && (
              <>
                <div className="au-field">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="General Administration"
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                  />
                </div>
                <div className="au-field">
                  <label>Access permissions</label>
                  <div className="au-perm-list">
                    {AU_PERMISSIONS.map((p) => (
                      <label
                        key={p}
                        className={`au-perm-item${form.permissions.includes(p) ? " au-perm-active" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(p)}
                          onChange={() => togglePerm(p)}
                          style={{ display: "none" }}
                        />
                        <div className="au-perm-check">
                          {form.permissions.includes(p) && (
                            <Icon name="check" size={10} />
                          )}
                        </div>
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="au-field">
                  <label>
                    Notes <span className="au-optional">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Additional information…"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </div>
              </>
            )}
            {form.role === "parent" && (
              <>
                <div className="au-field">
                  <label>
                    Linked student{" "}
                    <span className="au-optional">(optional)</span>
                  </label>
                  <select
                    value={form.linkedStudent}
                    onChange={(e) => set("linkedStudent", e.target.value)}
                    className="au-select"
                  >
                    <option value="">— Select a student —</option>
                    {(students || []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {s.language} {s.level}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="au-field">
                  <label>Relationship</label>
                  <div className="au-chips">
                    {[
                      "Father",
                      "Mother",
                      "Guardian (M)",
                      "Guardian (F)",
                      "Other",
                    ].map((r) => (
                      <button
                        key={r}
                        className={`au-chip${form.notes === r ? " au-chip-active" : ""}`}
                        onClick={() => set("notes", r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="au-field">
                  <label>
                    Remarks <span className="au-optional">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Additional information…"
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4 — Confirm */}
        {step === 4 && (
          <div className="au-body au-confirm">
            {saved ? (
              <div className="au-success">
                <div
                  className="au-success-icon"
                  style={{
                    background: roleConfig?.bg,
                    color: roleConfig?.color,
                  }}
                >
                  <Icon name="check" size={28} />
                </div>
                <span className="au-success-title">Account created!</span>
                <span className="au-success-sub">
                  The account has been successfully saved.
                </span>
              </div>
            ) : (
              <>
                <div
                  className="au-preview-avatar"
                  style={
                    roleConfig
                      ? {
                          background: `linear-gradient(135deg,${roleConfig.color},${roleConfig.color}99)`,
                        }
                      : {}
                  }
                >
                  {ini}
                </div>
                <span className="au-preview-name">
                  {form.fname} {form.lname}
                </span>
                <span className="au-preview-email">{form.email}</span>
                {roleConfig && (
                  <div
                    className="au-preview-role-badge"
                    style={{
                      background: roleConfig.bg,
                      color: roleConfig.color,
                    }}
                  >
                    <Icon name={roleConfig.icon} size={12} /> {roleConfig.label}
                  </div>
                )}
                <div className="au-preview-grid">
                  {form.phone && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Phone</span>
                      <span className="au-preview-val">{form.phone}</span>
                    </div>
                  )}
                  {form.role === "etudiant" && form.language && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Language</span>
                      <span className="au-preview-val">{form.language}</span>
                    </div>
                  )}
                  {form.role === "etudiant" && form.level && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Level</span>
                      <span className={`au-lvl ${lvCls(form.level)}`}>
                        {form.level}
                      </span>
                    </div>
                  )}
                  {form.role === "etudiant" && form.schedule && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Schedule</span>
                      <span className="au-preview-val">{form.schedule}</span>
                    </div>
                  )}
                  {form.role === "professeur" && form.specialty && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Specialty</span>
                      <span className="au-preview-val">{form.specialty}</span>
                    </div>
                  )}

                  {form.role === "secretaire" && form.department && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Department</span>
                      <span className="au-preview-val">{form.department}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {!saved && (
          <div className="au-footer">
            {step > 1 ? (
              <button className="au-btn-back" onClick={prev}>
                ← Back
              </button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <button
                className="au-btn-next"
                onClick={next}
                style={
                  roleConfig
                    ? {
                        background: `linear-gradient(135deg,${roleConfig.color},${roleConfig.color}cc)`,
                      }
                    : {}
                }
              >
                {" "}
                Continue →
              </button>
            ) : (
              <button
                className="au-btn-submit"
                onClick={handleSubmit}
                style={
                  roleConfig
                    ? {
                        background: `linear-gradient(135deg,${roleConfig.color},${roleConfig.color}cc)`,
                      }
                    : {}
                }
              >
                <Icon name="check" size={14} /> Create account
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STUDENTS PAGE — avec confirmation suppression
══════════════════════════════════════════════════════════════ */
function StudentsPage({ students, setStudents, onAdd }) {
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("active");
  const [archived, setArchived] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);
  const [profileStudentId, setProfileStudentId] = useState(null); // ✅ ici

  const loadArchived = useCallback(async () => {
    setArchivedLoading(true);
    try {
      const data = await apiFetch("/users/archived?role=etudiant");
      if (data.success) {
        setArchived(
          data.users.map((s) => ({
            id: s._id,
            name: `${s.prenom || ""} ${s.nom || ""}`.trim() || s.email,
            language: s.language || "—",
            level: s.level || "A1",
            email: s.email,
            phone: s.telephone || "—",
            date: new Date(s.createdAt).toLocaleDateString("en-US"),
          }))
        );
      }
    } finally {
      setArchivedLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "archived") loadArchived();
  }, [tab, loadArchived]);

  const restoreStudent = async (id) => {
    try {
      const data = await apiFetch(`/users/${id}/restore`, { method: "PATCH" });
      if (data.success) setArchived((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(
    () =>
      students.filter((s) => {
        if (
          search &&
          !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.language.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (filterLang !== "All" && s.language !== filterLang) return false;
        if (filterStatus !== "All" && s.status !== filterStatus.toLowerCase())
          return false;
        if (filterLevel !== "All" && s.level[0] !== filterLevel) return false;
        return true;
      }),
    [students, search, filterLang, filterStatus, filterLevel],
  );

  const archiveStudent = async (id) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/users/${id}/archive`, { method: "PATCH" });
      if (data.success) setStudents((ss) => ss.filter((s) => s.id !== id));
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  };

  return (
    <div className="sp-page">
      {/* ✅ Modal profil */}
{profileStudentId && (
  <StudentProfileModal
    studentId={profileStudentId}
    onClose={() => setProfileStudentId(null)}
    onArchived={(id) => {
      setStudents((ss) => ss.filter((s) => s.id !== id));
      setProfileStudentId(null);
    }}
  />
)}

      {confirm && (
        <ConfirmDialog
          message={`Archive ${confirm.name}? This action can be undone by an admin.`}
          onConfirm={() => archiveStudent(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="sp-topbar">
        <div>
          <div className="sp-topbar-title">Student Management</div>
          <span className="sp-topbar-sub">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""} · Spring semester 2026
          </span>
        </div>
        <button className="db-btn-primary" onClick={onAdd}>
          <Icon name="useradd" size={13} /> Add a student
        </button>
      </div>

      <div className="sp-filters">
        <div className="sp-search">
          <Icon name="search" size={13} />
          <input
            placeholder="Search a student…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sp-filter-group">
          <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)}>
            {["All","English","French","Spanish","German","Arabic","Mandarin"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Pending</option>
          </select>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
            <option>All</option>
            <option value="A">Level A</option>
            <option value="B">Level B</option>
            <option value="C">Level C</option>
          </select>
        </div>
        <div className="sp-view-toggle" style={{ marginLeft: "auto" }}>
          <button
            className={`sp-view-btn${viewMode === "table" ? " active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <Icon name="grid" size={13} />
          </button>
          <button
            className={`sp-view-btn${viewMode === "cards" ? " active" : ""}`}
            onClick={() => setViewMode("cards")}
          >
            <Icon name="users" size={13} />
          </button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="sp-card-grid">
          {filtered.map((s) => (
            // ✅ carte cliquable → ouvre le profil
            <div
              className="sp-card"
              key={s.id}
              style={{ cursor: "pointer" }}
              onClick={() => setProfileStudentId(s.id)}
            >
              <div className="sp-card-top">
                <div className="sp-avatar">{initials(s.name)}</div>
                <div className="sp-card-info">
                  <div className="sp-card-name">{s.name}</div>
                  <span className="sp-card-lang">{s.language} · {s.section}</span>
                  <span className="sp-card-date">Enrolled on {s.date}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <span className={`db-lvl ${levelCls(s.level)}`}>{s.level}</span>
                  <span
                    className={`db-status ${s.status === "active" ? "db-st-active" : "db-st-pending"}`}
                    style={{ fontSize: 10.5 }}
                  >
                    <span className="db-dot" />
                    {s.status === "active" ? "Active" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="sp-card-meta">
                <span style={{ fontSize: 12, color: "var(--db-text2)" }}>
                  📵 {s.absences} absences
                </span>
                <span style={{ fontSize: 12, color: "var(--db-text3)", marginLeft: "auto" }}>
                  {s.phone}
                </span>
              </div>
              <div className="sp-card-prog">
                <div className="sp-prog-label">
                  <span>Attendance</span>
                  <span>{Math.max(0, 100 - s.absences * 5)}%</span>
                </div>
                <div className="sp-prog-track">
                  <div
                    className="sp-prog-fill"
                    style={{ width: `${Math.max(0, 100 - s.absences * 5)}%` }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                {/* ✅ stopPropagation pour ne pas ouvrir le profil */}
                <button
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--db-text3)", padding: "4px", borderRadius: "6px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm({ id: s.id, name: s.name });
                  }}
                >
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="db-panel">
          <table className="db-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Language</th>
                <th>Level</th>
                <th>Section</th>
                <th>Absences</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--db-text3)", fontSize: 13 }}>
                    No students found.
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                // ✅ ligne cliquable → ouvre le profil
                <tr
                  key={s.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setProfileStudentId(s.id)}
                >
                  <td>
                    <div className="db-s-cell">
                      <div className="db-mini-av">{initials(s.name)}</div>
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td>{s.language}</td>
                  <td>
                    <span className={`db-lvl ${levelCls(s.level)}`}>{s.level}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--db-text2)" }}>{s.section}</td>
                  <td>
                    <span style={{
                      fontSize: 13, fontWeight: 600,
                      color: s.absences >= 8 ? "#C0352A" : s.absences >= 4 ? "#7A4A0A" : "#2D7A3A",
                    }}>
                      {s.absences}
                    </span>
                  </td>
                  <td>
                    <span className={`db-status ${s.status === "active" ? "db-st-active" : "db-st-pending"}`}>
                      <span className="db-dot" />
                      {s.status === "active" ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="db-date-cell">{s.date}</td>
                  <td>
                    {/* ✅ stopPropagation pour ne pas ouvrir le profil */}
                    <button
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--db-text3)", padding: "5px",
                        borderRadius: "7px", transition: "all 0.2s",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirm({ id: s.id, name: s.name });
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#C0352A";
                        e.currentTarget.style.background = "var(--db-red-bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--db-text3)";
                        e.currentTarget.style.background = "none";
                      }}
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   TEACHER PROFILE MODAL
══════════════════════════════════════════════════════════════ */
function TeacherProfileModal({ teacherId, onClose, onArchived }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!teacherId) return;
    setLoading(true);
    apiFetch(`/teachers/${teacherId}/profile`)
      .then(data => { if (data?.success) setTeacher(data.teacher); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [teacherId]);

  const handleArchive = async () => {
    const data = await apiFetch(`/users/${teacherId}/archive`, { method: "PATCH" });
    if (data?.success) { if (onArchived) onArchived(teacherId); onClose(); }
  };

  const ini = name =>
    (name || "??").split(" ").map(n => n[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
  const lvCls = lvl => {
    const c = (lvl?.[0] || "a").toLowerCase();
    return c === "a" ? "db-lv-a" : c === "b" ? "db-lv-b" : "db-lv-c";
  };
  const fmtDate = d =>
    d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const LANG_COLORS = {
    English: "#185FA5", French: "#3B6D11", Spanish: "#C2410C",
    German: "#633806", Mandarin: "#A32D2D", Arabic: "#7C3AED",
  };

  const TABS = [
    { key: "info", label: "Info" },
    { key: "sections", label: "Classes" },
  ];

  const overlayStyle = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    zIndex: 300, display: "flex", alignItems: "center",
    justifyContent: "center", padding: "16px",
  };
  const modalStyle = {
    background: "var(--db-card, #fff)", borderRadius: "var(--db-r, 12px)",
    boxShadow: "0 16px 48px rgba(0,0,0,0.18)", width: "100%",
    maxWidth: 520, maxHeight: "90vh", overflow: "hidden",
    display: "flex", flexDirection: "column",
  };

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ padding: "20px 20px 0", borderBottom: "1px solid var(--db-border, #e5e7eb)" }}>
          {loading ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "var(--db-text3)", fontSize: 13 }}>
              Loading…
            </div>
          ) : teacher ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                {/* Avatar */}
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "linear-gradient(135deg, #3B6D11, #2D5A0A)",
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0,
                }}>
                  {ini(teacher.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--db-text, #111)", marginBottom: 4 }}>
                    {teacher.name}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    {teacher.specialty && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px",
                        borderRadius: 20, background: "#EAF3DE", color: "#27500A",
                      }}>
                        {teacher.specialty}
                      </span>
                    )}
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                      background: teacher.status === "active" ? "#EAF3DE" : "#FAEEDA",
                      color: teacher.status === "active" ? "#3B6D11" : "#633806",
                    }}>
                      <span style={{
                        display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                        marginRight: 4, verticalAlign: "middle",
                        background: teacher.status === "active" ? "#3B6D11" : "#B45309",
                      }} />
                      {teacher.status === "active" ? "Active" : "Inactive"}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--db-text3)", marginLeft: 2 }}>
                      {teacher.studentCount} students supervised
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setConfirm(true)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--db-text3)", padding: 6, borderRadius: 8, flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#C0352A"; e.currentTarget.style.background = "var(--db-red-bg, #FCEBEB)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--db-text3)"; e.currentTarget.style.background = "none"; }}
                >
                  <Icon name="trash" size={15} />
                </button>
                <button
                  onClick={onClose}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--db-text3)", fontSize: 18, lineHeight: 1, padding: 4, flexShrink: 0 }}
                >✕</button>
              </div>
              {/* Tabs */}
              <div style={{ display: "flex" }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                    padding: "8px 16px", fontSize: 13,
                    fontWeight: activeTab === t.key ? 600 : 400,
                    color: activeTab === t.key ? "#3B6D11" : "var(--db-text2)",
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: activeTab === t.key ? "2px solid #3B6D11" : "2px solid transparent",
                  }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: "16px 0", textAlign: "center", color: "var(--db-text3)", fontSize: 13 }}>
              Teacher not found.
            </div>
          )}
        </div>

        {/* Body */}
        {!loading && teacher && (
          <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1 }}>
            {/* Info tab */}
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Email",      teacher.email    || "—"],
                  ["Phone",      teacher.phone    || "—"],
                  ["Specialty",  teacher.specialty|| "—"],
                  ["Students",   `${teacher.studentCount} supervised`],
                  ["Classes",    `${teacher.sections?.length || 0} section(s)`],
                  ["Joined",     fmtDate(teacher.createdAt)],
                  ["Notes",      teacher.notes    || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "9px 12px",
                    background: "var(--db-bg, #f9fafb)",
                    borderRadius: "var(--db-r, 8px)",
                  }}>
                    <span style={{ fontSize: 12, color: "var(--db-text3)", minWidth: 90, fontWeight: 500 }}>
                      {label}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--db-text, #111)" }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Sections tab */}
            {activeTab === "sections" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(!teacher.sections || teacher.sections.length === 0) ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--db-text3)", fontSize: 13 }}>
                    No classes assigned yet.
                  </div>
                ) : teacher.sections.map(sec => {
                  const langColor = LANG_COLORS[sec.language] || "#185FA5";
                  const pct = Math.min(100, Math.round((sec.students / sec.capacity) * 100));
                  return (
                    <div key={sec.id} style={{
                      padding: "12px 14px",
                      background: "var(--db-bg, #f9fafb)",
                      border: "1px solid var(--db-border, #e5e7eb)",
                      borderLeft: `3px solid ${langColor}`,
                      borderRadius: "var(--db-r, 8px)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--db-text)" }}>{sec.name}</span>
                        <span className={`db-lvl ${lvCls(sec.level)}`}>{sec.level}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "2px 7px",
                          borderRadius: 20, marginLeft: "auto",
                          background: sec.students >= sec.capacity ? "#FCEBEB" : "#f3f4f6",
                          color: sec.students >= sec.capacity ? "#A32D2D" : "var(--db-text3)",
                        }}>
                          {sec.students >= sec.capacity ? "FULL" : `${sec.capacity - sec.students} seats open`}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ flex: 1, height: 5, background: "var(--db-border, #e5e7eb)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${pct}%`,
                            background: sec.students >= sec.capacity ? "#A32D2D" : langColor,
                            borderRadius: 99, transition: "width 0.4s",
                          }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--db-text2)", minWidth: 36, textAlign: "right" }}>
                          {sec.students}/{sec.capacity}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        {[
                          ["Language", sec.language],
                          ["Schedule", sec.time],
                          ["Room",     sec.room],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <span style={{ fontSize: 10, color: "var(--db-text3)", textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</span>
                            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{v || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!loading && teacher && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--db-border, #e5e7eb)", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{
              padding: "7px 18px", borderRadius: "var(--db-r, 8px)", fontSize: 13,
              fontWeight: 500, cursor: "pointer",
              background: "var(--db-bg, #f3f4f6)", color: "var(--db-text2)",
              border: "1px solid var(--db-border, #e5e7eb)",
            }}>Close</button>
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          message={`Archive ${teacher?.name}? Their classes will need to be reassigned.`}
          onConfirm={handleArchive}
          onCancel={() => setConfirm(false)}
          danger={true}
        />
      )}
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   TEACHERS PAGE — avec confirmation suppression
══════════════════════════════════════════════════════════════ */
function TeachersPage({ teachers, setTeachers, onAdd }) {
  const [confirm, setConfirm] = useState(null);
  const [profileTeacherId, setProfileTeacherId] = useState(null); // ← AJOUTER

  const archiveTeacher = async (id) => {
    try {
      const data = await apiFetch(`/users/${id}/archive`, { method: "PATCH" });
      if (data.success) setTeachers((ts) => ts.filter((x) => x.id !== id));
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="tp-page">

      {/* ← AJOUTER : modal profil enseignant */}
      {profileTeacherId && (
        <TeacherProfileModal
          teacherId={profileTeacherId}
          onClose={() => setProfileTeacherId(null)}
          onArchived={(id) => {
            setTeachers((ts) => ts.filter((t) => t.id !== id));
            setProfileTeacherId(null);
          }}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={`Archive teacher ${confirm.name}? Their classes will need to be reassigned.`}
          onConfirm={() => archiveTeacher(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontFamily:"var(--font-head)", fontSize:17, fontWeight:600, color:"var(--db-text)" }}>
            Teacher Management
          </div>
          <span style={{ fontSize:12, color:"var(--db-text2)" }}>
            {teachers.length} teachers · {teachers.reduce((a, t) => a + t.students, 0)} students supervised
          </span>
        </div>
        <button className="db-btn-primary" onClick={onAdd}>
          <Icon name="useradd" size={13} /> Add a teacher
        </button>
      </div>

      <div className="db-panel">
        <table className="db-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialty</th>
              <th>Joined</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign:"center", padding:"2rem", color:"var(--db-text3)", fontSize:13 }}>
                  No teachers registered.
                </td>
              </tr>
            )}
{teachers.map((t) => (
  <tr
    key={t.id}
    style={{ cursor: "pointer" }}
    onClick={() => setProfileTeacherId(t.id)}
  >
    <td>
      <div className="db-s-cell">
        <div className="db-mini-av">{initials(t.name)}</div>
        <strong>{t.name}</strong>
      </div>
    </td>
    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.email || "—"}</td>
    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.phone || "—"}</td>
    <td style={{ fontSize:12 }}>{t.specialty || "—"}</td>
    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.joined || "—"}</td>
    <td>
      <span className={`db-status ${t.rating !== "—" ? "db-st-active" : "db-st-pending"}`}>
        <span className="db-dot" />
        Active
      </span>
    </td>
    <td>
      <button
        style={{ background:"none", border:"none", cursor:"pointer", color:"var(--db-text3)", padding:"5px", borderRadius:"7px", transition:"all 0.2s" }}
        onClick={(e) => {
          e.stopPropagation();
          setConfirm({ id: t.id, name: t.name });
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color="#C0352A"; e.currentTarget.style.background="var(--db-red-bg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color="var(--db-text3)"; e.currentTarget.style.background="none"; }}
      >
        <Icon name="trash" size={13}/>
      </button>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   CLASSES PAGE — inchangé (déjà correct) + confirmation suppression
══════════════════════════════════════════════════════════════ */
 function ClassesPage({ sections = [], setSections, loadSections }) {
  const [showAdd, setShowAdd] = useState(false);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [expandedLang, setExpandedLang] = useState(null);
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [enrollModal, setEnrollModal] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [studentsModal, setStudentsModal] = useState(null); // section object
  const [sectionStudents, setSectionStudents] = useState([]);
  const [sectionStudentsLoading, setSectionStudentsLoading] = useState(false);

  const openStudentsModal = async (section) => {
    setStudentsModal(section);
    setSectionStudents([]);
    setSectionStudentsLoading(true);
    try {
      const data = await apiFetch(`/sections/${section.id}/students`);
      if (data.success) {
        setSectionStudents(data.students || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSectionStudentsLoading(false);
    }
  };
  

  const [form, setForm] = useState({
    name: "",
    language: "English",
    level: "A1",
    teacher: "",
    teacherId: "",
    time: "",
    room: "",
    capacity: 12,
  });

  useEffect(() => {
    apiFetch("/users/role/professeur").then((data) => {
      if (data.success)
        setAvailableTeachers(
          data.users
            .filter((u) => u.actif !== false)
            .map((u) => ({
              id: u._id,
              name: `${u.prenom || ""} ${u.nom || ""}`.trim(),
              specialty: u.specialty || "—",
            })),
        );
    });
    apiFetch("/users/students").then((data) => {
      if (data.success)
        setAllStudents(
          data.students.map((s) => ({
            id: s._id,
            name: `${s.prenom || ""} ${s.nom || ""}`.trim() || s.email,
            language: s.language || "—",
            level: s.level || "—",
            sections: s.sections || [],
          })),
        );
    });
  }, []);

  const usedRooms = sections.map((c) => ({ room: c.room, time: c.time }));
  const usedByTeacher = {};
  sections.forEach((c) => {
    if (c.teacherId && c.time) {
      if (!usedByTeacher[c.teacherId]) usedByTeacher[c.teacherId] = [];
      usedByTeacher[c.teacherId].push(c.time);
    }
  });
  const isRoomBusy = (room, time) =>
    usedRooms.some((u) => u.room === room && u.time === time);
  const isTeacherBusy = (tid, time) =>
    (usedByTeacher[tid] || []).includes(time);

  const showToast = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 2800);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.teacherId) e.teacher = "Select a teacher";
    if (!form.time) e.time = "Select a time slot";
    if (!form.room) e.room = "Select a room";
    if (form.room && form.time && isRoomBusy(form.room, form.time))
      e.room = `Room ${form.room} is already booked`;
    if (form.teacherId && form.time && isTeacherBusy(form.teacherId, form.time))
      e.teacher = "Teacher already has a class at this time";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const addClass = async () => {
    if (!validate()) return;
    const teacher = availableTeachers.find((t) => t.id === form.teacherId);
    const data = await apiFetch("/sections", {
      method: "POST",
      body: JSON.stringify({ ...form, teacher: teacher?.name || form.teacher }),
    });
    if (data.success) {
      loadSections();
      setForm({
        name: "",
        language: "English",
        level: "A1",
        teacher: "",
        teacherId: "",
        time: "",
        room: "",
        capacity: 12,
      });
      setFormErrors({});
      setShowAdd(false);
      showToast("Section created!");
    } else showToast(data.message, true);
  };

  const deleteClass = async (id) => {
    const data = await apiFetch(`/sections/${id}`, { method: "DELETE" });
    if (data.success) {
      loadSections();
      showToast("Section deleted.");
    }
    setConfirm(null);
  };

const enrollStudent = async () => {
  if (!enrollStudentId) {
    setEnrollError("Select a student");
    return;
  }
  const targetSection = enrollModal;
  const alreadySameLangLevel = sections.find(
    (s) =>
      s.language === targetSection.language &&
      s.level === targetSection.level &&
      (allStudents.find((st) => st.id === enrollStudentId)?.sections || []).includes(s.id),
  );
  if (alreadySameLangLevel) {
    setEnrollError(`Already enrolled in ${targetSection.language} ${targetSection.level} (${alreadySameLangLevel.name})`);
    return;
  }

  const data = await apiFetch(`/sections/${targetSection.id}/enroll`, {
    method: "POST",
    body: JSON.stringify({ studentId: enrollStudentId }),
  });

  if (data.success) {
    // Recharger les sections depuis le serveur au lieu d'incrémenter manuellement
    loadSections();
    
    setAllStudents((prev) =>
      prev.map((st) =>
        st.id === enrollStudentId
          ? { ...st, sections: [...(st.sections || []), targetSection.id] }
          : st,
      ),
    );
    setEnrollModal(null);
    setEnrollStudentId("");
    setEnrollError("");
    showToast(`Student enrolled in ${targetSection.name}!`);
  } else {
    setEnrollError(data.message || "Enrollment failed");
  }
};

  const LANGUAGES = [
    "English",
    "French",
    "Spanish",
    "German",
    "Mandarin",
    "Arabic",
  ];
  const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const TIME_SLOTS = [
    "Mon/Wed 08:00–09:30",
    "Mon/Wed 09:45–11:15",
    "Mon/Wed 14:00–15:30",
    "Tue/Thu 08:00–09:30",
    "Tue/Thu 09:45–11:15",
    "Tue/Thu 14:00–15:30",
    "Wed/Fri 08:00–09:30",
    "Wed/Fri 10:00–11:30",
    "Fri 14:00–15:00",
    "Sat 09:00–10:30",
    "Sat 11:00–12:30",
  ];
  const ROOMS = [
    "A101",
    "A102",
    "A103",
    "A104",
    "B101",
    "B202",
    "B203",
    "C301",
    "C302",
    "Hall",
  ];
  const LANG_FLAGS = {
    English: "🇬🇧",
    French: "🇫🇷",
    Spanish: "🇪🇸",
    German: "🇩🇪",
    Mandarin: "🇨🇳",
    Arabic: "🇩🇿",
  };
  const LANG_COLORS = {
    English: "#185FA5",
    French: "#3B6D11",
    Spanish: "#C2410C",
    German: "#633806",
    Mandarin: "#A32D2D",
    Arabic: "#7C3AED",
  };
  const LANG_BG = {
    English: "#E6F1FB",
    French: "#EAF3DE",
    Spanish: "#FEF3DC",
    German: "#FAEEDA",
    Mandarin: "#FCEBEB",
    Arabic: "#F3F0FF",
  };

  const grouped = {};
  LANGUAGES.forEach((lang) => {
    const langSections = sections.filter((s) => s.language === lang);
    if (!langSections.length) return;
    grouped[lang] = {};
    LEVELS.forEach((level) => {
      const ls = langSections.filter((s) => s.level === level);
      if (ls.length) grouped[lang][level] = ls;
    });
  });

  const totalStudents = sections.reduce((a, s) => a + (s.students || 0), 0);
  const totalCapacity = sections.reduce((a, s) => a + (s.capacity || 12), 0);
  const IS = {
    border: "var(--db-border2)",
    borderRadius: "var(--db-r)",
    padding: "8px 12px",
    fontSize: 13,
    background: "var(--db-bg)",
    color: "var(--db-text)",
    outline: "none",
  };

  return (
    <div className="cp-page">
      {confirm && (
        <ConfirmDialog
          message={`Delete section "${confirm.name}"? This is irreversible.`}
          onConfirm={() => deleteClass(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 17,
              fontWeight: 600,
              color: "var(--db-text)",
            }}
          >
          section Management
          </div>
          <span style={{ fontSize: 12, color: "var(--db-text2)" }}>
            {sections.length} sections · {totalStudents}/{totalCapacity}{" "}
            students enrolled
          </span>
        </div>
        <button
          className="db-btn-primary"
          onClick={() => setShowAdd((v) => !v)}
        >
          <Icon name="plus" size={13} /> New section
        </button>
      </div>

      {showAdd && (
        <div
          className="db-panel"
          style={{ borderLeft: "3px solid var(--db-blue)" }}
        >
          <div className="db-pt" style={{ marginBottom: 14 }}>
            New section
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text2)",
                }}
              >
                Section name *
              </span>
              <input
                style={{
                  ...IS,
                  borderColor: formErrors.name ? "#A32D2D" : undefined,
                }}
                placeholder="Section A"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              {formErrors.name && (
                <span style={{ fontSize: 11, color: "#A32D2D" }}>
                  {formErrors.name}
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text2)",
                }}
              >
                Language
              </span>
              <select
                style={IS}
                value={form.language}
                onChange={(e) =>
                  setForm((f) => ({ ...f, language: e.target.value }))
                }
              >
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text2)",
                }}
              >
                Level
              </span>
              <select
                style={IS}
                value={form.level}
                onChange={(e) =>
                  setForm((f) => ({ ...f, level: e.target.value }))
                }
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text2)",
                }}
              >
                Capacity
              </span>
              <input
                type="number"
                min={1}
                max={40}
                style={IS}
                value={form.capacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, capacity: e.target.value }))
                }
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text2)",
                }}
              >
                Teacher *
              </span>
              <select
                style={{
                  ...IS,
                  borderColor: formErrors.teacher ? "#A32D2D" : undefined,
                }}
                value={form.teacherId}
                onChange={(e) => {
                  const t = availableTeachers.find(
                    (x) => x.id === e.target.value,
                  );
                  setForm((f) => ({
                    ...f,
                    teacherId: e.target.value,
                    teacher: t?.name || "",
                  }));
                  setFormErrors((er) => ({ ...er, teacher: undefined }));
                }}
              >
                <option value="">— Select a teacher —</option>
                {availableTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} · {t.specialty}
                    {form.time && isTeacherBusy(t.id, form.time)
                      ? " ⚠ busy"
                      : ""}
                  </option>
                ))}
              </select>
              {formErrors.teacher && (
                <span style={{ fontSize: 11, color: "#A32D2D" }}>
                  {formErrors.teacher}
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text2)",
                }}
              >
                Time Slot *
              </span>
              <select
                style={{
                  ...IS,
                  borderColor: formErrors.time ? "#A32D2D" : undefined,
                }}
                value={form.time}
                onChange={(e) => {
                  setForm((f) => ({ ...f, time: e.target.value, room: "" }));
                  setFormErrors((er) => ({
                    ...er,
                    time: undefined,
                    room: undefined,
                  }));
                }}
              >
                <option value="">— Select a slot —</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                    {form.teacherId && isTeacherBusy(form.teacherId, slot)
                      ? " ⚠ teacher busy"
                      : ""}
                  </option>
                ))}
              </select>
              {formErrors.time && (
                <span style={{ fontSize: 11, color: "#A32D2D" }}>
                  {formErrors.time}
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text2)",
                }}
              >
                Room *
              </span>
              <select
                style={{
                  ...IS,
                  borderColor: formErrors.room ? "#A32D2D" : undefined,
                }}
                value={form.room}
                onChange={(e) => {
                  setForm((f) => ({ ...f, room: e.target.value }));
                  setFormErrors((er) => ({ ...er, room: undefined }));
                }}
              >
                <option value="">— Select a room —</option>
                {ROOMS.map((room) => {
                  const busy = form.time && isRoomBusy(room, form.time);
                  return (
                    <option key={room} value={room} disabled={busy}>
                      {room}
                      {busy ? " — booked" : ""}
                    </option>
                  );
                })}
              </select>
              {formErrors.room && (
                <span style={{ fontSize: 11, color: "#A32D2D" }}>
                  {formErrors.room}
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 14,
            }}
          >
            <button
              className="db-btn-ghost"
              onClick={() => {
                setShowAdd(false);
                setFormErrors({});
              }}
            >
              Cancel
            </button>
            <button className="db-btn-primary" onClick={addClass}>
              <Icon name="check" size={13} /> Create
            </button>
          </div>
        </div>
      )}

      {Object.keys(grouped).length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--db-text3)",
            fontSize: 13,
          }}
        >
          No sections yet. Click "New section" to start.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(grouped).map(([lang, levels]) => {
          const langColor = LANG_COLORS[lang] || "#185FA5",
            langBg = LANG_BG[lang] || "#E6F1FB";
          const langSectionsCount = Object.values(levels).flat().length;
          const langStudents = Object.values(levels)
            .flat()
            .reduce((a, s) => a + (s.students || 0), 0);
          const langCapacity = Object.values(levels)
            .flat()
            .reduce((a, s) => a + (s.capacity || 12), 0);
          const isLangOpen = expandedLang === lang;
          return (
            <div
              key={lang}
              className="db-panel"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div
                onClick={() => setExpandedLang(isLangOpen ? null : lang)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 18px",
                  cursor: "pointer",
                  background: isLangOpen ? langBg : "transparent",
                  borderBottom: isLangOpen
                    ? `1px solid ${langColor}22`
                    : "none",
                  transition: "background 0.2s",
                }}
              >
                <span style={{ fontSize: 22 }}>{LANG_FLAGS[lang] || "🌐"}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: langColor,
                    }}
                  >
                    {lang}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--db-text3)",
                      marginTop: 2,
                    }}
                  >
                    {langSectionsCount} section
                    {langSectionsCount !== 1 ? "s" : ""} · {langStudents}/
                    {langCapacity} students
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {Object.keys(levels).map((lv) => (
                    <span
                      key={lv}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: langBg,
                        color: langColor,
                        border: `1px solid ${langColor}40`,
                      }}
                    >
                      {lv}
                    </span>
                  ))}
                  <span
                    style={{ fontSize: 18, color: langColor, marginLeft: 4 }}
                  >
                    {isLangOpen ? "▾" : "▸"}
                  </span>
                </div>
              </div>
              {isLangOpen && (
                <div style={{ padding: "8px 0" }}>
                  {Object.entries(levels).map(([level, lvlSections]) => {
                    const isLvlOpen = expandedLevel === `${lang}-${level}`;
                    const lvlStudents = lvlSections.reduce(
                      (a, s) => a + (s.students || 0),
                      0,
                    );
                    const lvlCapacity = lvlSections.reduce(
                      (a, s) => a + (s.capacity || 12),
                      0,
                    );
                    return (
                      <div
                        key={level}
                        style={{ borderTop: "1px solid var(--db-border)" }}
                      >
                        <div
                          onClick={() =>
                            setExpandedLevel(
                              isLvlOpen ? null : `${lang}-${level}`,
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 18px 10px 28px",
                            cursor: "pointer",
                            background: isLvlOpen
                              ? "var(--db-bg)"
                              : "transparent",
                          }}
                        >
                          <span
                            className={`db-lvl ${levelCls(level)}`}
                            style={{ minWidth: 32, textAlign: "center" }}
                          >
                            {level}
                          </span>
                          <div style={{ flex: 1 }}>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "var(--db-text)",
                              }}
                            >
                              {lvlSections.length} section
                              {lvlSections.length !== 1 ? "s" : ""}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--db-text3)",
                                marginLeft: 8,
                              }}
                            >
                              {lvlStudents}/{lvlCapacity} students
                            </span>
                          </div>
                          <span
                            style={{ fontSize: 14, color: "var(--db-text3)" }}
                          >
                            {isLvlOpen ? "▾" : "▸"}
                          </span>
                        </div>
                        {isLvlOpen && (
                          <div
                            style={{
                              padding: "6px 18px 12px 42px",
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            {lvlSections.map((section) => {
                              const isFull =
                                  section.students >= section.capacity,
                                isAlmost =
                                  !isFull &&
                                  section.students >= section.capacity * 0.75;
                              const pctFill = Math.min(
                                100,
                                Math.round(
                                  (section.students / section.capacity) * 100,
                                ),
                              );
                              const openSeats =
                                section.capacity - section.students;
                              return (
                                <div
                                  key={section.id || section.name}
                                  style={{
                                    background: "var(--db-bg)",
                                    border: `1px solid ${isFull ? "#A32D2D40" : "var(--db-border)"}`,
                                    borderLeft: `3px solid ${isFull ? "#A32D2D" : isAlmost ? "#B45309" : langColor}`,
                                    borderRadius: "var(--db-r)",
                                    padding: "12px 14px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      justifyContent: "space-between",
                                      gap: 8,
                                    }}
                                  >
                                    <div style={{ flex: 1 }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                          marginBottom: 6,
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontWeight: 600,
                                            fontSize: 13,
                                          }}
                                        >
                                          {section.name}
                                        </span>
                                        {isFull && (
                                          <span
                                            style={{
                                              fontSize: 10,
                                              fontWeight: 600,
                                              padding: "2px 7px",
                                              borderRadius: 20,
                                              background: "#FCEBEB",
                                              color: "#A32D2D",
                                              border: "1px solid #A32D2D40",
                                            }}
                                          >
                                            FULL
                                          </span>
                                        )}
                                        {isAlmost && !isFull && (
                                          <span
                                            style={{
                                              fontSize: 10,
                                              fontWeight: 600,
                                              padding: "2px 7px",
                                              borderRadius: 20,
                                              background: "#FAEEDA",
                                              color: "#633806",
                                              border: "1px solid #B4530940",
                                            }}
                                          >
                                            Almost full
                                          </span>
                                        )}
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                          marginBottom: 8,
                                        }}
                                      >
                                        <div
                                          style={{
                                            flex: 1,
                                            height: 6,
                                            background: "var(--db-border)",
                                            borderRadius: 99,
                                            overflow: "hidden",
                                          }}
                                        >
                                          <div
                                            style={{
                                              height: "100%",
                                              width: `${pctFill}%`,
                                              background: isFull
                                                ? "#A32D2D"
                                                : isAlmost
                                                  ? "#B45309"
                                                  : langColor,
                                              borderRadius: 99,
                                              transition: "width 0.4s",
                                            }}
                                          />
                                        </div>
                                        <span
                                          style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: isFull
                                              ? "#A32D2D"
                                              : "var(--db-text2)",
                                            minWidth: 50,
                                            textAlign: "right",
                                          }}
                                        >
                                          {section.students}/{section.capacity}
                                        </span>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: 14,
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        {[
                                          ["Teacher", section.teacher || "—"],
                                          ["Schedule", section.time || "—"],
                                          ["Room", section.room || "—"],
                                          [
                                            "Open seats",
                                            isFull
                                              ? "0 — full"
                                              : String(openSeats),
                                          ],
                                        ].map(([k, v]) => (
                                          <div
                                            key={k}
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 1,
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: 10,
                                                color: "var(--db-text3)",
                                                textTransform: "uppercase",
                                                letterSpacing: ".04em",
                                              }}
                                            >
                                              {k}
                                            </span>
                                            <span
                                              style={{
                                                fontSize: 12,
                                                fontWeight: 500,
                                                color:
                                                  k === "Open seats" && isFull
                                                    ? "#A32D2D"
                                                    : "var(--db-text)",
                                              }}
                                            >
                                              {v}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6,
                                        alignItems: "flex-end",
                                        flexShrink: 0,
                                      }}
                                    >
                                      <button
                                        className="db-btn-primary"
                                        style={{
                                          fontSize: 11,
                                          padding: "5px 10px",
                                          opacity: isFull ? 0.4 : 1,
                                          cursor: isFull ? "not-allowed" : "pointer",
                                        }}
                                        disabled={isFull}
                                        onClick={() => {
                                          setEnrollModal(section);
                                          setEnrollStudentId("");
                                          setEnrollError("");
                                        }}
                                      >
                                        <Icon name="useradd" size={11} />{" "}
                                        {isFull ? "Full" : "Enroll"}
                                      </button>
                                      <button
                                        style={{
                                          padding: "5px 10px",
                                          borderRadius: "var(--db-r)",
                                          fontSize: 11,
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          background: "#E6F1FB",
                                          color: "#185FA5",
                                          border: "1px solid #185FA540",
                                        }}
                                        onClick={() => openStudentsModal(section)}
                                      >
                                        <Icon name="users" size={11} /> Students ({section.students})
                                      </button>
                                      <button
                                        style={{
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          color: "var(--db-text3)",
                                          padding: "4px",
                                          borderRadius: "6px",
                                        }}
                                        onClick={() =>
                                          setConfirm({
                                            id: section.id,
                                            name: section.name,
                                          })
                                        }
                                      >
                                        <Icon name="trash" size={13} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Modal étudiants par section */}
      {studentsModal && (
        <div
          className="vp-overlay"
          onClick={(e) => e.target === e.currentTarget && setStudentsModal(null)}
        >
          <div className="vp-modal" style={{ maxWidth: 520 }}>
            <div className="vp-modal-top">
              <div className="vp-modal-head">
                <div>
                  <span className="vp-modal-id">{studentsModal.name}</span>
                  <span className="vp-modal-name">
                    {studentsModal.language} · {studentsModal.level} · {studentsModal.students}/{studentsModal.capacity} students
                  </span>
                </div>
                <button className="vp-modal-close" onClick={() => setStudentsModal(null)}>✕</button>
              </div>
              <div style={{ fontSize: 12, color: "var(--db-text2)", paddingTop: 6, display: "flex", gap: 12 }}>
                <span>👤 {studentsModal.teacher}</span>
                <span>📅 {studentsModal.time}</span>
                <span>🚪 {studentsModal.room}</span>
              </div>
            </div>
            <div className="vp-modal-body" style={{ maxHeight: 380, overflowY: "auto" }}>
              {sectionStudentsLoading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--db-text3)", fontSize: 13 }}>Loading…</div>
              ) : sectionStudents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--db-text3)", fontSize: 13 }}>No students enrolled in this section.</div>
              ) : (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Level</th>
                      <th>Phone</th>
                      <th>Absences</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionStudents.map((s) => (
                      <tr key={s._id || s.id}>
                        <td>
                          <div className="db-s-cell">
                            <div className="db-mini-av">
                              {initials(`${s.prenom || ""} ${s.nom || ""}`)}
                            </div>
                            <strong>{`${s.prenom || ""} ${s.nom || ""}`.trim() || s.email}</strong>
                          </div>
                        </td>
                        <td>
                          <span className={`db-lvl ${levelCls(s.level || "A1")}`}>{s.level || "—"}</span>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--db-text2)" }}>{s.telephone || "—"}</td>
                        <td>
                          <span style={{ fontSize: 13, fontWeight: 600, color: (s.absences || 0) >= 8 ? "#C0352A" : (s.absences || 0) >= 4 ? "#7A4A0A" : "#2D7A3A" }}>
                            {s.absences || 0}
                          </span>
                        </td>
                        <td>
                          <span className={`db-status ${s.actif ? "db-st-active" : "db-st-pending"}`}>
                            <span className="db-dot" />
                            {s.actif ? "Active" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="vp-modal-foot">
              <button className="vp-modal-btn-ghost" onClick={() => setStudentsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      

      {toast && (
        <div
          className="st-saved-toast"
          style={{
            background: toast.err
              ? "linear-gradient(135deg,#A32D2D,#A32D2Ddd)"
              : undefined,
          }}
        >
          <Icon name={toast.err ? "warning" : "check"} size={14} /> {toast.msg}
        </div>
      )}

      {enrollModal && (
        <div
          className="vp-overlay"
          onClick={(e) => e.target === e.currentTarget && setEnrollModal(null)}
        >
          <div className="vp-modal" style={{ maxWidth: 440 }}>
            <div className="vp-modal-top">
              <div className="vp-modal-head">
                <div>
                  <span className="vp-modal-id">{enrollModal.name}</span>
                  <span className="vp-modal-name">
                    {enrollModal.language} · {enrollModal.level}
                  </span>
                </div>
                <button
                  className="vp-modal-close"
                  onClick={() => setEnrollModal(null)}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "8px 0",
                  fontSize: 12,
                  color: "var(--db-text2)",
                }}
              >
                <span>📅 {enrollModal.time || "—"}</span>
                <span>🚪 {enrollModal.room || "—"}</span>
                <span>👤 {enrollModal.teacher || "—"}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "var(--db-border)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, (enrollModal.students / enrollModal.capacity) * 100)}%`,
                      background:
                        LANG_COLORS[enrollModal.language] || "#185FA5",
                      borderRadius: 99,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--db-text2)",
                  }}
                >
                  {enrollModal.students}/{enrollModal.capacity} —{" "}
                  {enrollModal.capacity - enrollModal.students} open seat
                  {enrollModal.capacity - enrollModal.students !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="vp-modal-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>
                  Select a student *
                </span>
                <select
                  style={{
                    border: "var(--db-border2)",
                    borderRadius: "var(--db-r)",
                    padding: "8px 12px",
                    fontSize: 13,
                    background: "var(--db-bg)",
                    color: "var(--db-text)",
                    outline: "none",
                    width: "100%",
                    borderColor: enrollError ? "#A32D2D" : undefined,
                  }}
                  value={enrollStudentId}
                  onChange={(e) => {
                    setEnrollStudentId(e.target.value);
                    setEnrollError("");
                  }}
                >
                  <option value="">— Select a student —</option>
                  {allStudents.map((st) => {
                    const alreadyHere = (st.sections || []).includes(
                      enrollModal.id,
                    );
                    const alreadyInLangLevel = sections.find(
                      (s) =>
                        s.language === enrollModal.language &&
                        s.level === enrollModal.level &&
                        (st.sections || []).includes(s.id),
                    );
                    const disabled = alreadyHere || !!alreadyInLangLevel;
                    const label = alreadyHere
                      ? ` (already in ${enrollModal.name})`
                      : alreadyInLangLevel
                        ? ` (already in ${enrollModal.language} ${enrollModal.level})`
                        : "";
                    return (
                      <option
                        key={st.id}
                        value={st.id}
                        disabled={disabled}
                        style={{ color: disabled ? "#A32D2D" : undefined }}
                      >
                        {st.name} · {st.language} {st.level}
                        {label}
                      </option>
                    );
                  })}
                </select>
                {enrollError && (
                  <span style={{ fontSize: 11, color: "#A32D2D" }}>
                    {enrollError}
                  </span>
                )}
                <div
                  style={{
                    marginTop: 6,
                    padding: "8px 10px",
                    background: "#E6F1FB",
                    borderRadius: "var(--db-r)",
                    fontSize: 11,
                    color: "#185FA5",
                  }}
                >
                  ℹ️ A student can be enrolled in multiple languages, but only
                  one section per language/level.
                </div>
              </div>
            </div>
            <div className="vp-modal-foot">
              <button
                className="vp-modal-btn-ghost"
                onClick={() => setEnrollModal(null)}
              >
                Cancel
              </button>
              <button className="vp-modal-btn-primary" onClick={enrollStudent}>
                <Icon name="check" size={13} /> Enroll student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ABSENCES PAGE — avec deleteAbsence et toggleJustified connectés
══════════════════════════════════════════════════════════════ */
function AbsencesPage() {
  const [absences, setAbsences] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    justified: 0,
    unjustified: 0,
    thisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("All");
  const [sessFilter, setSessFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [justified, setJustified] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null);
  const PER_PAGE = 8;

  const loadAbsences = useCallback(async () => {
    setLoading(true);
    try {
      const [absData, statsData] = await Promise.all([
        apiFetch("/absences"),
        apiFetch("/absences/stats"),
      ]);
      if (absData.success) setAbsences(absData.absences);
      if (statsData.success) setStats(statsData.stats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAbsences();
  }, [loadAbsences]);

  const toggleJustified = async (id) => {
    const data = await apiFetch(`/absences/${id}/justify`, { method: "PATCH" });
    if (data.success)
      setAbsences((as) =>
        as.map((a) => (a.id === id ? { ...a, justified: data.justified } : a)),
      );
  };

  const doDeleteAbsence = async (id) => {
    const data = await apiFetch(`/absences/${id}`, { method: "DELETE" });
    if (data.success) {
      setAbsences((as) => as.filter((a) => a.id !== id));
      if (selected === id) setSelected(null);
    }
    setConfirm(null);
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "Student",
      "Language",
      "Level",
      "Date",
      "Session",
      "Reason",
      "Status",
    ];
    const rows = absences.map((a) => [
      a.name,
      a.language,
      a.level,
      formatDate(a.date),
      a.session,
      a.reason,
      a.justified ? "Justified" : "Unjustified",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "absences.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    let rows = absences.filter((a) => {
      const q = search.toLowerCase();
      if (
        q &&
        !a.name.toLowerCase().includes(q) &&
        !a.language.toLowerCase().includes(q)
      )
        return false;
      if (langFilter !== "All" && a.language !== langFilter) return false;
      if (sessFilter !== "All" && a.session !== sessFilter) return false;
      if (reasonFilter !== "All" && a.reason !== reasonFilter) return false;
      if (justified === "Yes" && !a.justified) return false;
      if (justified === "No" && a.justified) return false;
      return true;
    });
    rows.sort((a, b) => {
      let va = a[sortKey],
        vb = b[sortKey];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [
    absences,
    search,
    langFilter,
    sessFilter,
    reasonFilter,
    justified,
    sortKey,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };
  const SortIcon = ({ col }) => (
    <span className={`va-sort-ic${sortKey === col ? " va-sort-active" : ""}`}>
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );
  const resetFilters = () => {
    setSearch("");
    setLangFilter("All");
    setSessFilter("All");
    setReasonFilter("All");
    setJustified("All");
    setPage(1);
  };

  return (
    <div className="va-wrap">
      {confirm && (
        <ConfirmDialog
          message={`Delete absence for ${confirm.name}?`}
          onConfirm={() => doDeleteAbsence(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="va-topbar">
        <div className="va-topbar-left">
          <div className="va-topbar-title">Absence Reports</div>
          <span className="va-topbar-sub">April 2026 · Spring semester</span>
        </div>
        <div className="va-topbar-right">
          <button className="va-btn-export" onClick={loadAbsences}>
            <Icon name="refresh" size={13} /> Refresh
          </button>
          <button className="va-btn-export" onClick={exportCSV}>
            <Icon name="download" size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="va-stats-row">
        <div className="va-mini-stat">
          <strong className="va-mini-val">{stats.total}</strong>
          <span className="va-mini-lbl">Total absences</span>
        </div>
        <div className="va-mini-stat">
          <strong className="va-mini-val">{stats.thisWeek}</strong>
          <span className="va-mini-lbl">This week</span>
        </div>
        <div className="va-mini-stat va-mini-stat-accent">
          <strong className="va-mini-val">{stats.justified}</strong>
          <span className="va-mini-lbl">Justified</span>
        </div>
        <div className="va-mini-stat">
          <strong className="va-mini-val">{stats.unjustified}</strong>
          <span className="va-mini-lbl">Unjustified</span>
        </div>
      </div>

      <div className="va-filters">
        <div className="va-search">
          <Icon name="search" size={13} />
          <input
            type="text"
            placeholder="Search student or language…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="va-filter-group">
          <select
            value={langFilter}
            onChange={(e) => {
              setLangFilter(e.target.value);
              setPage(1);
            }}
          >
            {VA_LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <select
            value={sessFilter}
            onChange={(e) => {
              setSessFilter(e.target.value);
              setPage(1);
            }}
          >
            {VA_SESSIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={reasonFilter}
            onChange={(e) => {
              setReasonFilter(e.target.value);
              setPage(1);
            }}
          >
            {VA_REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select
            value={justified}
            onChange={(e) => {
              setJustified(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All statuses</option>
            <option value="Yes">Justified</option>
            <option value="No">Unjustified</option>
          </select>
        </div>
        {(search ||
          langFilter !== "All" ||
          sessFilter !== "All" ||
          reasonFilter !== "All" ||
          justified !== "All") && (
          <button className="va-btn-reset" onClick={resetFilters}>
            Reset ×
          </button>
        )}
      </div>

      <div className="va-table-wrap">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--db-text3)",
              fontSize: 13,
            }}
          >
            Loading absences…
          </div>
        ) : (
          <table className="va-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")} className="va-th-sort">
                  Student <SortIcon col="name" />
                </th>
                <th
                  onClick={() => toggleSort("language")}
                  className="va-th-sort"
                >
                  Language <SortIcon col="language" />
                </th>
                <th>Level</th>
                <th onClick={() => toggleSort("date")} className="va-th-sort">
                  Date <SortIcon col="date" />
                </th>
                <th>Session</th>
                <th onClick={() => toggleSort("reason")} className="va-th-sort">
                  Reason <SortIcon col="reason" />
                </th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={8} className="va-empty">
                    No absences recorded.
                  </td>
                </tr>
              )}
              {pageData.map((a) => (
                <tr
                  key={a.id}
                  className={selected === a.id ? "va-row-selected" : ""}
                  onClick={() => setSelected(selected === a.id ? null : a.id)}
                >
                  <td>
                    <div className="va-s-cell">
                      <div className="va-avatar">{initials(a.name)}</div>
                      <span className="va-name">{a.name}</span>
                    </div>
                  </td>
                  <td className="va-lang">{a.language}</td>
                  <td>
                    <span
                      className={`va-lvl ${levelCls(a.level).replace("db-", "va-")}`}
                    >
                      {a.level}
                    </span>
                  </td>
                  <td className="va-date">{formatDate(a.date)}</td>
                  <td>
                    <span
                      className={`va-session va-sess-${a.session.toLowerCase()}`}
                    >
                      {a.session}
                    </span>
                  </td>
                  <td className="va-reason">{a.reason}</td>
                  <td>
                    <span
                      className={`va-status ${a.justified ? "va-just" : "va-unjust"}`}
                    >
                      <span className="va-dot" />
                      {a.justified ? "Justified" : "Unjustified"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: 4 }}>
                    <button
                      className="va-btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(selected === a.id ? null : a.id);
                      }}
                    >
                      {selected === a.id ? "−" : "+"}
                    </button>
                    <button
                      className="va-btn-detail"
                      style={{ color: "var(--db-red)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirm({ id: a.id, name: a.name });
                      }}
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected &&
        (() => {
          const a = absences.find((x) => x.id === selected);
          if (!a) return null;
          return (
            <div className="va-detail">
              <div className="va-detail-header">
                <div className="va-detail-avatar">{initials(a.name)}</div>
                <div>
                  <span className="va-detail-name">{a.name}</span>
                  <span className="va-detail-sub">
                    {a.language} · {a.session} session
                  </span>
                </div>
                <span
                  className={`va-status ${a.justified ? "va-just" : "va-unjust"}`}
                  style={{ marginLeft: "auto" }}
                >
                  <span className="va-dot" />
                  {a.justified ? "Justified" : "Unjustified"}
                </span>
              </div>
              <div className="va-detail-grid">
                {[
                  { l: "Date", v: formatDate(a.date) },
                  { l: "Session", v: a.session },
                  { l: "Language", v: a.language },
                  { l: "Level", v: a.level, badge: true },
                  { l: "Reason", v: a.reason },
                ].map((r) => (
                  <div className="va-detail-row" key={r.l}>
                    <span className="va-detail-lbl">{r.l}</span>
                    {r.badge ? (
                      <span
                        className={`va-lvl ${levelCls(r.v).replace("db-", "va-")}`}
                      >
                        {r.v}
                      </span>
                    ) : (
                      <span className="va-detail-val">{r.v}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="va-detail-actions">
                <button
                  className={`va-btn-toggle ${a.justified ? "va-btn-unjustify" : "va-btn-justify"}`}
                  onClick={() => toggleJustified(a.id)}
                >
                  {a.justified ? "Mark as unjustified" : "Mark as justified"}
                </button>
                <button
                  className="va-btn-notify"
                  onClick={async () => {
                    await apiFetch("/notifications", {
                      method: "POST",
                      body: JSON.stringify({
                        title: "Absence notice",
                        msg: `${a.name} — absence on ${formatDate(a.date)} (${a.session}) not justified.`,
                        type: "absence",
                        targets: ["All students"],
                      }),
                    });
                  }}
                >
                  <Icon name="bell" size={12} /> Notify student
                </button>
              </div>
            </div>
          );
        })()}

      <div className="va-pagination">
        <span className="va-pg-info">
          {filtered.length === 0
            ? "0"
            : `${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)}`}{" "}
          of {filtered.length} records
        </span>
        <div className="va-pg-btns">
          <button
            className="va-pg-btn"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            «
          </button>
          <button
            className="va-pg-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span key={`e-${i}`} className="va-pg-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={`va-pg-btn${page === p ? " va-pg-active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ),
            )}
          <button
            className="va-pg-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ›
          </button>
          <button
            className="va-pg-btn"
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAYMENTS PAGE — avec Record Payment fonctionnel
══════════════════════════════════════════════════════════════ */
function PaymentsPage({ payments, setPayments }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [recordModal, setRecordModal] = useState(null);
  const barRef = useRef(null);

  const totalAmount = payments.reduce((a, p) => a + (p.amount || 0), 0);
  const collectedAmount = payments
    .filter((p) => p.status === "paid")
    .reduce((a, p) => a + (p.paid || p.amount || 0), 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending" || p.status === "partial")
    .reduce((a, p) => a + ((p.amount || 0) - (p.paid || 0)), 0);
  const overdueAmount = payments
    .filter((p) => p.status === "overdue")
    .reduce((a, p) => a + (p.amount || 0), 0);

  const total = useCountUpDA(totalAmount);
  const collected = useCountUpDA(collectedAmount);
  const pending = useCountUpDA(pendingAmount);
  const overdue = useCountUpDA(overdueAmount);

  const counts = {
    paid: payments.filter((p) => p.status === "paid").length,
    partial: payments.filter((p) => p.status === "partial").length,
    pending: payments.filter((p) => p.status === "pending").length,
    overdue: payments.filter((p) => p.status === "overdue").length,
  };

  const TAB_KEY = {
    All: null,
    Paid: "paid",
    Partial: "partial",
    Pending: "pending",
    Overdue: "overdue",
  };
  const TAB_CNT = {
    All: payments.length,
    Paid: counts.paid,
    Partial: counts.partial,
    Pending: counts.pending,
    Overdue: counts.overdue,
  };

  const filtered = payments.filter((d) => {
    const fk = TAB_KEY[filter],
      mf = !fk || d.status === fk;
    const q = search.toLowerCase();
    const ms =
      !q ||
      (d.student || "").toLowerCase().includes(q) ||
      (d.id || "").toLowerCase().includes(q) ||
      (d.lang || "").toLowerCase().includes(q);
    return mf && ms;
  });

  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = pct(selected) + "%";
    }, 60);
    return () => clearTimeout(t);
  }, [selected]);

const revenueByMonth = (() => {
  const map = {};
  payments.forEach((p) => {
    const d = new Date(p.due || p.createdAt || Date.now());
    if (isNaN(d)) return;
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    map[key] = (map[key] || 0) + (p.amount || 0);
  });
  const entries = Object.entries(map)
    .sort((a, b) => {
      const da = new Date(a[0]), db = new Date(b[0]);
      return da - db;
    })
    .slice(-7)
    .map(([m, v]) => ({ m: m.split(" ")[0], v }));
  return entries;
})();
const chartData =
  revenueByMonth.length >= 2 ? revenueByMonth : FALLBACK_REVENUE;

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "Invoice",
      "Student",
      "Language",
      "Level",
      "Amount",
      "Paid",
      "Due",
      "Status",
      "Method",
    ];
    const rows = payments.map((p) => [
      p.id,
      p.student,
      p.lang,
      p.level,
      p.amount,
      p.paid,
      p.due,
      p.status,
      p.method,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v || ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPaymentSaved = (updated) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
    );
    setSelected((prev) =>
      prev?.id === updated.id ? { ...prev, ...updated } : prev,
    );
  };

  return (
    <div className="vp-page">
      {recordModal && (
        <RecordPaymentModal
          payment={recordModal}
          onClose={() => setRecordModal(null)}
          onSaved={onPaymentSaved}
        />
      )}

      <div className="db-stats">
        <StatCard
          icon="credit"
          label="Total revenue"
          value={total}
          delta={`${payments.length} invoices`}
          icBg="#E6F1FB"
          icColor="#185FA5"
          deltaColor="#3B6D11"
        />
        <StatCard
          icon="check"
          label="Collected"
          value={collected}
          delta={`${counts.paid} paid`}
          icBg="#EAF3DE"
          icColor="#3B6D11"
          deltaColor="#3B6D11"
        />
        <StatCard
          icon="warning"
          label="Pending"
          value={pending}
          delta={`${counts.pending + counts.partial} students`}
          icBg="#FAEEDA"
          icColor="#633806"
          deltaColor="#633806"
        />
        <StatCard
          icon="warning"
          label="Overdue"
          value={overdue}
          delta={`${counts.overdue} student${counts.overdue !== 1 ? "s" : ""}`}
          icBg="#FCEBEB"
          icColor="#A32D2D"
          deltaColor="#A32D2D"
        />
      </div>

      <div className="vp-mid">
        <div className="db-panel">
          <div className="db-ph">
            <div>
              <span className="db-pt">Monthly Revenue</span>
              <span className="db-ps">Last 7 months · DA</span>
            </div>
            <span className="db-chip">2025–2026</span>
          </div>
          <RevenueChart data={chartData} />
        </div>
        <div className="db-panel">
          <div className="db-ph">
            <span className="db-pt">Payment Status</span>
          </div>
          <Donut counts={counts} />
        </div>
      </div>

      <div className="db-panel">
        <div className="db-ph" style={{ flexWrap: "wrap", gap: 10 }}>
          <div>
            <span className="db-pt">Invoices</span>
            <span className="db-ps">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="vp-controls">
            <div className="vp-search">
              <Icon name="search" size={13} />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="vp-btn-export" onClick={exportCSV}>
              <Icon name="download" size={13} /> Export
            </button>
          </div>
        </div>
        <div className="vp-tabs">
          {VP_FILTERS.map((f) => (
            <button
              key={f}
              className={`vp-tab${filter === f ? " vp-tab-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="vp-tab-n">{TAB_CNT[f]}</span>
            </button>
          ))}
        </div>
        <div className="vp-tbl-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student</th>
                <th className="vp-col-level">Level</th>
                <th>Amount</th>
                <th className="vp-col-paid">Paid</th>
                <th className="vp-col-prog">Progress</th>
                <th>Due date</th>
                <th>Status</th>
                <th className="vp-col-method">Method</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--db-text3)",
                      fontSize: 13,
                    }}
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
              {filtered.map((d) => {
                const s = VP_STATUS[d.status] || VP_STATUS.pending;
                return (
                  <tr
                    key={d.id}
                    className="vp-row"
                    onClick={() => setSelected(d)}
                  >
                    <td>
                      <span className="vp-inv-id">{d.id}</span>
                    </td>
                    <td>
                      <div className="db-s-cell">
                        <div className="db-mini-av">{initials(d.student)}</div>
                        <div>
                          <div className="vp-s-name">{d.student}</div>
                          <div className="vp-s-sub">{d.lang}</div>
                        </div>
                      </div>
                    </td>
                    <td className="vp-col-level">
                      <span
                        className={`db-lvl db-lv-${(d.level?.[0] || "a").toLowerCase()}`}
                      >
                        {d.level}
                      </span>
                    </td>
                    <td>
                      <span className="vp-amount">{fmtDA(d.amount || 0)}</span>
                    </td>
                    <td className="vp-col-paid">
                      <span
                        style={{
                          color: d.paid > 0 ? "#3B6D11" : "var(--db-text3)",
                        }}
                      >
                        {d.paid > 0 ? fmtDA(d.paid) : "—"}
                      </span>
                    </td>
                    <td className="vp-col-prog">
                      <div className="vp-prog">
                        <div className="vp-prog-track">
                          <div
                            className="vp-prog-fill"
                            style={{ width: pct(d) + "%", background: s.prog }}
                          />
                        </div>
                        <span className="vp-prog-pct">{pct(d)}%</span>
                      </div>
                    </td>
                    <td className="db-date-cell">{d.due}</td>
                    <td>
                      <span className={`db-status ${s.cls}`}>
                        <span
                          className="db-dot"
                          style={{ background: s.dot }}
                        />
                        {s.label}
                      </span>
                    </td>
                    <td className="vp-method vp-col-method">{d.method}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div
          className="vp-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="vp-modal">
            <div className="vp-modal-top">
              <div className="vp-modal-head">
                <div>
                  <span className="vp-modal-id">{selected.id}</span>
                  <span className="vp-modal-name">{selected.student}</span>
                </div>
                <button
                  className="vp-modal-close"
                  onClick={() => setSelected(null)}
                >
                  ✕
                </button>
              </div>
              <div className="vp-modal-meta">
                <span
                  className={`db-status ${(VP_STATUS[selected.status] || VP_STATUS.pending).cls}`}
                >
                  <span
                    className="db-dot"
                    style={{
                      background: (
                        VP_STATUS[selected.status] || VP_STATUS.pending
                      ).dot,
                    }}
                  />
                  {(VP_STATUS[selected.status] || VP_STATUS.pending).label}
                </span>
                <span
                  className={`db-lvl db-lv-${(selected.level?.[0] || "a").toLowerCase()}`}
                >
                  {selected.level}
                </span>
                <span style={{ fontSize: 12, color: "var(--db-text2)" }}>
                  {selected.lang}
                </span>
              </div>
            </div>
            <div className="vp-modal-body">
              {[
                ["Language / Level", `${selected.lang} · ${selected.level}`],
                ["Total amount", fmtDA(selected.amount || 0)],
                ["Amount paid", selected.paid > 0 ? fmtDA(selected.paid) : "—"],
                [
                  "Balance due",
                  fmtDA((selected.amount || 0) - (selected.paid || 0)),
                ],
                ["Due date", selected.due],
                ["Method", selected.method],
              ].map(([k, v], i) => (
                <div className="vp-modal-row" key={i}>
                  <span>{k}</span>
                  <strong
                    style={
                      k === "Balance due"
                        ? {
                            color:
                              selected.amount - selected.paid > 0
                                ? "#A32D2D"
                                : "#27500A",
                          }
                        : k === "Amount paid"
                          ? {
                              color:
                                selected.paid > 0
                                  ? "#27500A"
                                  : "var(--db-text3)",
                            }
                          : {}
                    }
                  >
                    {v}
                  </strong>
                </div>
              ))}
            </div>
            <div className="vp-modal-foot">
              <div className="vp-modal-bar-wrap">
                <div className="vp-modal-bar-track">
                  <div
                    className="vp-modal-bar-fill"
                    ref={barRef}
                    style={{ width: 0 }}
                  />
                </div>
                <span className="vp-modal-bar-pct">{pct(selected)}% paid</span>
              </div>
              {selected.amount - selected.paid > 0 && (
                <button
                  className="vp-modal-btn-primary"
                  onClick={() => {
                    setRecordModal(selected);
                    setSelected(null);
                  }}
                >
                  Record a payment
                </button>
              )}
              <button
                className="vp-modal-btn-ghost"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATIONS PAGE — inchangée (déjà correcte)
══════════════════════════════════════════════════════════════ */
const NT_TARGETS = [
  "All students",
  "Level A (Beginners)",
  "Level B (Intermediate)",
  "Level C (Advanced)",
  "English course",
  "French course",
  "Teachers",
  "Parents",
];
const NT_TYPES = ["Informational", "Reminder", "Alert", "Payment reminder"];

function NotificationsPage({
  notifications,
  markRead,
  markAllRead,
  deleteOne,
  deleteAll,
  refresh,
}) {
  const [tab, setTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "Informational",
    targets: [],
  });
  const [formErrors, setFormErrors] = useState({});

  const unread = notifications.filter((n) => !n.read).length;
  const tabs = [
    { label: "All", key: "All" },
    { label: "Payments", key: "payment" },
    { label: "Absences", key: "absence" },
    { label: "System", key: "system" },
    { label: "Alerts", key: "alert" },
  ];
  const filtered =
    tab === "All" ? notifications : notifications.filter((n) => n.type === tab);

  const showToastMsg = (msg, color = "#3B6D11") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };
  const handleMarkAllRead = async () => {
    await markAllRead();
    showToastMsg("All notifications marked as read.");
  };
  const clearAll = async () => {
    await deleteAll();
    showToastMsg("All notifications deleted.");
  };
  const toggleTarget = (t) =>
    setForm((f) => ({
      ...f,
      targets: f.targets.includes(t)
        ? f.targets.filter((x) => x !== t)
        : [...f.targets, t],
    }));

  const sendNotification = async () => {
    const e = {};
    if (!form.title.trim()) e.title = true;
    if (!form.message.trim()) e.message = true;
    if (form.targets.length === 0) e.targets = true;
    setFormErrors(e);
    if (Object.keys(e).length > 0) return;
    const typeMap = {
      Informational: "system",
      Reminder: "system",
      Alert: "alert",
      "Payment reminder": "payment",
    };
    try {
      const data = await apiFetch("/notifications", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          msg: form.message,
          type: typeMap[form.type],
          targets: form.targets,
        }),
      });
      if (data.success) {
        setForm({ title: "", message: "", type: "Informational", targets: [] });
        setShowForm(false);
        setTab("All");
        showToastMsg(`✓ Notification sent to: ${form.targets.join(", ")}`);
        refresh();
      }
    } catch {
      showToastMsg("Connection error", "#A32D2D");
    }
  };

  const tagCls = {
    payment: "nt-tag-payment",
    absence: "nt-tag-absence",
    system: "nt-tag-system",
    alert: "nt-tag-alert",
  };
  const icCls = {
    payment: "nt-ic-success",
    absence: "nt-ic-warn",
    system: "nt-ic-info",
    alert: "nt-ic-danger",
  };

  return (
    <div className="nt-page">
      <div className="nt-topbar">
        <div className="nt-topbar-left">
          <div className="nt-title">Notifications</div>
          <span className="nt-sub">
            Manage and send alerts to your students and teachers
          </span>
        </div>
        <div className="nt-topbar-right">
          {unread > 0 && (
            <button className="nt-btn nt-btn-ghost" onClick={handleMarkAllRead}>
              <Icon name="check" size={13} /> Mark all as read ({unread})
            </button>
          )}
          <button
            className="nt-btn nt-btn-ghost"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? (
              <>Cancel</>
            ) : (
              <>
                <Icon name="plus" size={13} /> New notification
              </>
            )}
          </button>
          {notifications.length > 0 && (
            <button className="nt-btn nt-btn-danger" onClick={clearAll}>
              <Icon name="trash" size={13} /> Clear all
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="nt-send-panel">
          <div className="nt-send-title">✉️ Send a notification</div>
          <div className="nt-form-grid">
            <div className="nt-field">
              <label>
                Title <span style={{ color: "var(--db-blue)" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Payment reminder"
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  setFormErrors((ev) => ({ ...ev, title: false }));
                }}
                style={formErrors.title ? { borderColor: "var(--db-red)" } : {}}
              />
              {formErrors.title && (
                <span style={{ fontSize: 11, color: "var(--db-red)" }}>
                  Title required
                </span>
              )}
            </div>
            <div className="nt-field">
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
              >
                {NT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="nt-field">
            <label>
              Message <span style={{ color: "var(--db-blue)" }}>*</span>
            </label>
            <textarea
              placeholder="Write your message here…"
              value={form.message}
              onChange={(e) => {
                setForm((f) => ({ ...f, message: e.target.value }));
                setFormErrors((ev) => ({ ...ev, message: false }));
              }}
              style={formErrors.message ? { borderColor: "var(--db-red)" } : {}}
            />
            {formErrors.message && (
              <span style={{ fontSize: 11, color: "var(--db-red)" }}>
                Message required
              </span>
            )}
          </div>
          <div className="nt-field">
            <label>
              Recipients <span style={{ color: "var(--db-blue)" }}>*</span>
            </label>
            <div className="nt-target-chips">
              {NT_TARGETS.map((t) => (
                <button
                  key={t}
                  className={`nt-target-chip${form.targets.includes(t) ? " nt-target-chip-active" : ""}`}
                  style={
                    formErrors.targets && !form.targets.includes(t)
                      ? { borderColor: "var(--db-red)" }
                      : {}
                  }
                  onClick={() => toggleTarget(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {formErrors.targets && (
              <span style={{ fontSize: 11, color: "var(--db-red)" }}>
                Select at least one recipient
              </span>
            )}
          </div>
          <div className="nt-send-footer">
            <span
              className="nt-char-count"
              style={form.message.length > 300 ? { color: "#B45309" } : {}}
            >
              {form.message.length}/500
            </span>
            <div className="nt-send-actions">
              <button
                className="nt-btn nt-btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="nt-btn nt-btn-primary"
                onClick={sendNotification}
              >
                <Icon name="send" size={13} /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="db-panel" style={{ padding: 0 }}>
        <div style={{ padding: "0 16px" }}>
          <div className="nt-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`nt-tab${tab === t.key ? " nt-tab-active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                <span className="nt-tab-n">
                  {t.key === "All"
                    ? notifications.length
                    : notifications.filter((n) => n.type === t.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="nt-empty">
            <div className="nt-empty-ic">
              <Icon name="bell" size={20} />
            </div>
            <span className="nt-empty-t">No notifications</span>
            <span className="nt-empty-s">You're all caught up!</span>
          </div>
        ) : (
          <div className="nt-list">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`nt-item${!n.read ? " nt-item-unread" : ""}`}
                onClick={() => !n.read && markRead(n.id)}
              >
                <div
                  className={`nt-item-ic ${icCls[n.type] || "nt-ic-info"}`}
                  style={{ fontSize: 16 }}
                >
                  {n.icon}
                </div>
                <div className="nt-item-body">
                  <div className="nt-item-head">
                    <span className="nt-item-title">{n.title}</span>
                    {!n.read && <span className="nt-item-unread-dot" />}
                  </div>
                  <div className="nt-item-msg">{n.msg}</div>
                  <div className="nt-item-footer">
                    <span className="nt-item-time">{n.time}</span>
                    <span
                      className={`nt-item-tag ${tagCls[n.tag] || "nt-tag-system"}`}
                    >
                      {n.tag}
                    </span>
                  </div>
                </div>
                <button
                  className="nt-item-del"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOne(n.id);
                  }}
                >
                  <Icon name="trash" size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && (
        <div className="nt-toast" style={{ background: toast.color }}>
          <Icon name="check" size={14} /> {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SETTINGS PAGE — avec Danger Zone fonctionnelle
══════════════════════════════════════════════════════════════ */
const ST_SECTIONS = [
  "Profile",
  "School",
  "Appearance",
  "Notifications",
  "Security",
  "Danger",
];
const ACCENT_COLORS_LIST = [
  "#185FA5",
  "#3B6D11",
  "#7C3AED",
  "#B45309",
  "#0F766E",
  "#BE185D",
  "#C2410C",
  "#374151",
];

function SettingsPage() {
  const [active, setActive] = useState("Profile");
  const [savedToast, setSavedToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const [profile, setProfile] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    role: "",
  });
  const [school, setSchool] = useState({
    name: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    maxStudents: "",
  });
  const [appearance, setAppearance] = useState({
    accentColor: "#185FA5",
    dateFormat: "MM/DD/YYYY",
    language: "English",
    timezone: "Africa/Algiers",
  });
  const [notifPrefs, setNotifPrefs] = useState({
    emailAbsence: true,
    emailPayment: true,
    emailSystem: false,
    pushAbsence: true,
    pushPayment: true,
    pushSystem: true,
    weeklyReport: true,
    monthlyReport: false,
  });
  const [security, setSecurity] = useState({
    currentPwd: "",
    newPwd: "",
    confirmPwd: "",
    twoFactor: false,
    sessionTimeout: "30",
  });
  const [secErrors, setSecErrors] = useState({});

  useEffect(() => {
    Promise.all([apiFetch("/users/me"), apiFetch("/settings")])
      .then(([meData, settingsData]) => {
if (meData.success) {
  const u = meData.user;
  setProfile({
    fname:  u.prenom    || "",
    lname:  u.nom       || "",
    email:  u.email     || "",
    phone:  u.telephone || "",
    role:   u.role      || "",
    avatar: u.avatar    || null,  // ✅ ajouter
    uploadLoading: false,          // ✅ ajouter
  });
}
        if (settingsData.success) {
          const s = settingsData.settings;
          setSchool({
            name: s.schoolName || "",
            city: s.city || "",
            address: s.address || "",
            email: s.email || "",
            phone: s.phone || "",
            maxStudents: s.maxStudents || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const showSaved = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };
  const Toggle = ({ value, onChange }) => (
    <label className="st-toggle">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="st-toggle-slider" />
    </label>
  );

  const IS = {
    border: "var(--db-border2)",
    borderRadius: "var(--db-r)",
    padding: "8px 12px",
    fontSize: 13,
    background: "var(--db-bg)",
    color: "var(--db-text)",
    outline: "none",
    fontFamily: "var(--font-body)",
    width: "100%",
    transition: "all 0.2s",
  };

  const navIcons = {
    Profile: <Icon name="user" size={14} />,
    School: <Icon name="building" size={14} />,
    Appearance: <Icon name="eye" size={14} />,
    Notifications: <Icon name="bell" size={14} />,
    Security: <Icon name="lock" size={14} />,
    Danger: <Icon name="warning" size={14} />,
  };

  const saveProfile = async () => {
    const data = await apiFetch("/users/me", {
      method: "PUT",
      body: JSON.stringify({
        fname: profile.fname,
        lname: profile.lname,
        email: profile.email,
        phone: profile.phone,
      }),
    });
    if (data.success) showSaved();
  };
  const saveSchool = async () => {
    const data = await apiFetch("/settings", {
      method: "PUT",
      body: JSON.stringify({
        schoolName: school.name,
        city: school.city,
        address: school.address,
        email: school.email,
        phone: school.phone,
        maxStudents: school.maxStudents,
      }),
    });
    if (data.success) showSaved();
  };

  const exportAllData = async () => {
    const [students, teachers, sections, payments] = await Promise.all([
      apiFetch("/users/students"),
      apiFetch("/users/teachers"),
      apiFetch("/sections"),
      apiFetch("/payments"),
    ]);
    const blob = new Blob(
      [
        JSON.stringify(
          {
            students: students.students || [],
            teachers: teachers.teachers || [],
            sections: sections.sections || [],
            payments: payments.payments || [],
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "langschool-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSection = () => {
    if (loading)
      return (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--db-text3)",
            fontSize: 13,
          }}
        >
          Loading…
        </div>
      );
    switch (active) {
      case "Profile":
  return (
    <div className="st-section">
      <span className="st-section-title">Profile information</span>
      <div className="st-row">
        <div className="st-avatar-row">

          {/* Avatar avec preview */}
          <div style={{ position: "relative", display: "inline-block" }}>
            {profile.avatar ? (
              <img
                src={`http://localhost:5000${profile.avatar}`}
                alt="avatar"
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid var(--db-border)",
                }}
              />
            ) : (
              <div className="st-big-avatar">
                {`${profile.fname?.[0] || ""}${profile.lname?.[0] || ""}`.toUpperCase() || "AD"}
              </div>
            )}
            {profile.uploadLoading && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(0,0,0,0.4)", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11,
              }}>
                …
              </div>
            )}
          </div>

          <div className="st-avatar-actions">
            {/* Input caché */}
            <input
              type="file"
              id="avatar-upload"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                  alert("Maximum 2MB");
                  return;
                }
                setProfile((p) => ({ ...p, uploadLoading: true }));
                const formData = new FormData();
                formData.append("avatar", file);
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch("http://localhost:5000/api/users/upload-avatar", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                  });
                  const data = await res.json();
                  if (data.success) {
                    setProfile((p) => ({ ...p, avatar: data.avatarUrl, uploadLoading: false }));
                    showSaved();
                  } else {
                    alert(data.message || "Upload failed");
                    setProfile((p) => ({ ...p, uploadLoading: false }));
                  }
                } catch {
                  alert("Connection error");
                  setProfile((p) => ({ ...p, uploadLoading: false }));
                }
                e.target.value = "";
              }}
            />

            <button
              className="st-btn-sm st-btn-upload"
              onClick={() => document.getElementById("avatar-upload").click()}
              disabled={profile.uploadLoading}
            >
              {profile.uploadLoading ? "Uploading…" : "Change photo"}
            </button>

            {profile.avatar && (
              <button
                className="st-btn-sm st-btn-remove"
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  const res = await fetch("http://localhost:5000/api/users/remove-avatar", {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  if (data.success) {
                    setProfile((p) => ({ ...p, avatar: null }));
                    showSaved();
                  }
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reste du formulaire — inchangé */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          ["First name", "fname", profile.fname],
          ["Last name",  "lname", profile.lname],
        ].map(([label, key, val]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
            <input
              style={IS} value={val}
              onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      {[
        ["Email", "email", "email", profile.email],
        ["Phone", "phone", "tel",   profile.phone],
        ["Role",  "role",  "text",  profile.role],
      ].map(([label, key, type, val]) => (
        <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
          <input
            style={{ ...IS, opacity: key === "role" ? 0.6 : 1 }}
            type={type} value={val} readOnly={key === "role"}
            onChange={(e) => key !== "role" && setProfile((p) => ({ ...p, [key]: e.target.value }))}
          />
        </div>
      ))}
      <div className="st-save-row">
        <button className="st-btn-cancel" onClick={() => window.location.reload()}>Reset</button>
        <button className="st-btn-save" onClick={saveProfile}>Save changes</button>
      </div>
    </div>
  );
      case "School":
        return (
          <div className="st-section">
            <span className="st-section-title">School settings</span>
            {[
              ["School name", "name", school.name],
              ["City", "city", school.city],
              ["Address", "address", school.address],
              ["Contact email", "email", school.email],
              ["Phone", "phone", school.phone],
              ["Max capacity", "maxStudents", school.maxStudents],
            ].map(([label, key, val]) => (
              <div
                key={key}
                style={{ display: "flex", flexDirection: "column", gap: 5 }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--db-text)",
                  }}
                >
                  {label}
                </span>
                <input
                  style={IS}
                  value={val}
                  onChange={(e) =>
                    setSchool((s) => ({ ...s, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="st-save-row">
              <button
                className="st-btn-cancel"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
              <button className="st-btn-save" onClick={saveSchool}>
                Save
              </button>
            </div>
          </div>
        );
      case "Appearance":
        return (
          <div className="st-section">
            <span className="st-section-title">Appearance & localization</span>
            <div
              className="st-row"
              style={{
                alignItems: "flex-start",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--db-text)",
                }}
              >
                Accent color
              </span>
              <div className="st-colors">
                {ACCENT_COLORS_LIST.map((c) => (
                  <div
                    key={c}
                    className={`st-color-swatch${appearance.accentColor === c ? " st-color-active" : ""}`}
                    style={{ background: c }}
                    onClick={() =>
                      setAppearance((a) => ({ ...a, accentColor: c }))
                    }
                  />
                ))}
              </div>
            </div>
            {[
              [
                "Date format",
                "dateFormat",
                ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
              ],
              ["Language", "language", ["English", "Français", "العربية"]],
              [
                "Timezone",
                "timezone",
                ["Africa/Algiers", "Europe/Paris", "UTC"],
              ],
            ].map(([label, key, opts]) => (
              <div key={key} className="st-row">
                <div>
                  <span className="st-field-label">{label}</span>
                </div>
                <select
                  className="st-select"
                  value={appearance[key]}
                  onChange={(e) =>
                    setAppearance((a) => ({ ...a, [key]: e.target.value }))
                  }
                >
                  {opts.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="st-save-row">
              <button className="st-btn-save" onClick={showSaved}>
                Apply
              </button>
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div className="st-section">
            <span className="st-section-title">Notification preferences</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--db-text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Email notifications
              </span>
              {[
                ["Absences", "emailAbsence"],
                ["Payments", "emailPayment"],
                ["System", "emailSystem"],
              ].map(([label, key]) => (
                <div key={key} className="st-row">
                  <div>
                    <span className="st-field-label">{label}</span>
                    <span className="st-field-sub">Receive email alerts</span>
                  </div>
                  <div className="st-toggle-wrap">
                    <Toggle
                      value={notifPrefs[key]}
                      onChange={(v) =>
                        setNotifPrefs((p) => ({ ...p, [key]: v }))
                      }
                    />
                    <span className="st-toggle-label">
                      {notifPrefs[key] ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "var(--db-border)", paddingTop: 14 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--db-text3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Automatic reports
                </span>
              </div>
              {[
                ["Weekly report", "weeklyReport", "Sent every Monday"],
                ["Monthly report", "monthlyReport", "Sent on the 1st"],
              ].map(([label, key, sub]) => (
                <div key={key} className="st-row">
                  <div>
                    <span className="st-field-label">{label}</span>
                    <span className="st-field-sub">{sub}</span>
                  </div>
                  <div className="st-toggle-wrap">
                    <Toggle
                      value={notifPrefs[key]}
                      onChange={(v) =>
                        setNotifPrefs((p) => ({ ...p, [key]: v }))
                      }
                    />
                    <span className="st-toggle-label">
                      {notifPrefs[key] ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="st-save-row">
              <button className="st-btn-save" onClick={showSaved}>
                Save
              </button>
            </div>
          </div>
        );
      case "Security":
        return (
          <div className="st-section">
            <span className="st-section-title">Account security</span>
            {[
              ["Current password", "currentPwd", "Your current password"],
              ["New password", "newPwd", "Minimum 8 characters"],
              ["Confirm", "confirmPwd", "Re-enter new password"],
            ].map(([label, key, ph]) => (
              <div
                key={key}
                style={{ display: "flex", flexDirection: "column", gap: 5 }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--db-text)",
                  }}
                >
                  {label}
                </span>
                <input
                  type="password"
                  style={{
                    ...IS,
                    borderColor: secErrors[key] ? "var(--db-red)" : undefined,
                  }}
                  placeholder={ph}
                  value={security[key]}
                  onChange={(e) => {
                    setSecurity((s) => ({ ...s, [key]: e.target.value }));
                    setSecErrors((er) => ({ ...er, [key]: false }));
                  }}
                />
                {secErrors[key] && (
                  <span style={{ fontSize: 11, color: "var(--db-red)" }}>
                    {key === "confirmPwd"
                      ? "Passwords do not match"
                      : key === "newPwd"
                        ? "Minimum 8 characters"
                        : "Required"}
                  </span>
                )}
              </div>
            ))}
            <button
              className="st-btn-save"
              style={{ alignSelf: "flex-start" }}
              onClick={async () => {
                const e = {};
                if (!security.currentPwd) e.currentPwd = true;
                if (security.newPwd.length < 8) e.newPwd = true;
                if (security.newPwd !== security.confirmPwd)
                  e.confirmPwd = true;
                setSecErrors(e);
                if (Object.keys(e).length) return;
                const data = await apiFetch("/users/change-password", {
                  method: "PATCH",
                  body: JSON.stringify({
                    currentPwd: security.currentPwd,
                    newPwd: security.newPwd,
                  }),
                });
                if (!data.success) {
                  setSecErrors({ currentPwd: true });
                  return;
                }
                setSecurity({
                  currentPwd: "",
                  newPwd: "",
                  confirmPwd: "",
                  twoFactor: security.twoFactor,
                  sessionTimeout: security.sessionTimeout,
                });
                showSaved();
              }}
            >
              Update password
            </button>
            <div
              style={{
                borderTop: "var(--db-border)",
                paddingTop: 18,
                marginTop: 4,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div className="st-row">
                <div>
                  <span className="st-field-label">
                    Two-factor authentication
                  </span>
                  <span className="st-field-sub">
                    Add an extra layer of security
                  </span>
                </div>
                <div className="st-toggle-wrap">
                  <Toggle
                    value={security.twoFactor}
                    onChange={(v) =>
                      setSecurity((s) => ({ ...s, twoFactor: v }))
                    }
                  />
                  <span className="st-toggle-label">
                    {security.twoFactor ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              <div className="st-row">
                <div>
                  <span className="st-field-label">Session timeout</span>
                </div>
                <select
                  className="st-select"
                  value={security.sessionTimeout}
                  onChange={(e) =>
                    setSecurity((s) => ({
                      ...s,
                      sessionTimeout: e.target.value,
                    }))
                  }
                >
                  {["15", "30", "60", "120", "240"].map((v) => (
                    <option key={v} value={v}>
                      {v} minutes
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case "Danger":
        return (
          <div className="st-section st-danger">
            {confirm && (
              <ConfirmDialog
                message={confirm.message}
                onConfirm={confirm.action}
                onCancel={() => setConfirm(null)}
                danger={true}
              />
            )}
            <span className="st-section-title">⚠️ Danger zone</span>
            {[
              {
                title: "Export all data",
                sub: "Download a complete JSON archive.",
                btn: "Export",
                color: "#185FA5",
                bg: "var(--db-blue-lt)",
                action: exportAllData,
                requireConfirm: false,
              },
              {
                title: "Reset statistics",
                sub: "Clear all stats. Irreversible.",
                btn: "Reset",
                color: "var(--db-amber)",
                bg: "var(--db-amber-bg)",
                action: () => {},
                requireConfirm: true,
              },
              {
                title: "Delete all students",
                sub: "Permanently delete all records.",
                btn: "Delete all",
                color: "var(--db-red)",
                bg: "var(--db-red-bg)",
                action: () => {},
                requireConfirm: true,
              },
              {
                title: "Delete account",
                sub: "Delete this admin account permanently.",
                btn: "Delete",
                color: "var(--db-red)",
                bg: "var(--db-red-bg)",
                action: () => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                },
                requireConfirm: true,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="st-row"
                style={{ padding: "14px 0", borderBottom: "var(--db-border)" }}
              >
                <div>
                  <span className="st-field-label">{item.title}</span>
                  <span className="st-field-sub">{item.sub}</span>
                </div>
                <button
                  style={{
                    padding: "7px 14px",
                    borderRadius: "var(--db-r)",
                    fontSize: 12,
                    cursor: "pointer",
                    background: item.bg,
                    color: item.color,
                    border: `0.5px solid ${item.color}`,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  onClick={() => {
                    if (item.requireConfirm)
                      setConfirm({
                        message: `${item.title}: this action cannot be undone. Are you sure?`,
                        action: item.action,
                      });
                    else item.action();
                  }}
                >
                  {item.btn}
                </button>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="st-page">
      <div className="st-nav">
        {ST_SECTIONS.map((s) => (
          <button
            key={s}
            className={`st-nav-item${active === s ? " st-nav-active" : ""}`}
            onClick={() => setActive(s)}
            style={
              s === "Danger" && active !== s ? { color: "var(--db-red)" } : {}
            }
          >
            {navIcons[s]} {s}
          </button>
        ))}
      </div>
      <div className="st-content">{renderSection()}</div>
      {savedToast && (
        <div className="st-saved-toast">
          <Icon name="check" size={14} /> Changes saved successfully!
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD HOME
══════════════════════════════════════════════════════════════ */
function DashboardHome({
  students,
  teachers,
  sections,
  payments,
  notifications,
  attendanceStats,
  revenueStats,
  setActiveNav,
  onAddUser,
}) {
  const [avgVisible, setAvgVisible] = useState(false);
  const avgRef = useRef(null);

  const totalStudents = useCountUp(students.length);
  const teacherCount = useCountUp(teachers.length);
  const classCount = useCountUp(sections.length);
  const attendanceRate = useCountUp(attendanceStats?.avgRate ?? 0, 1200, "%");

  // Animation de la barre d'assiduité via IntersectionObserver
  useEffect(() => {
    const el = avgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAvgVisible(true);
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const recentStudents = students.slice(0, 5);
  const quickActions = [
    {
      label: "Add a user",
      desc: "Link a parent to a student",
      action: () => onAddUser("parent"),
      icon: "heart",
      color: "#BE185D",
      bg: "#FDF2F8",
    },
    {
      label: "Send a notification",
      desc: "Alert students and staff",
      action: () => setActiveNav("Notifications"),
      icon: "bell",
      color: "#B45309",
      bg: "#FEF3DC",
    },
    {
      label: "View payments",
      desc: "Track invoices",
      action: () => setActiveNav("Payments"),
      icon: "credit",
      color: "#0F766E",
      bg: "#F0FDF4",
    },
    {
      label: "View absences",
      desc: "Absence reports",
      action: () => setActiveNav("Absences"),
      icon: "file",
      color: "#185FA5",
      bg: "#E6F1FB",
    },
    {
      label: "Manage classes",
      desc: "Sections and schedules",
      action: () => setActiveNav("Classes"),
      icon: "building",
      color: "#7A4A0A",
      bg: "#FEF3DC",
    },
  ];

  const chartData =
    attendanceStats?.weekly?.length >= 2
      ? attendanceStats.weekly
      : FALLBACK_ATTENDANCE;
const revenueData = (() => {
  const raw = revenueStats?.monthly;
  if (!raw || raw.length < 2) return FALLBACK_REVENUE;
  return raw.map(item => ({
    m: item.m || item.month || item._id || "?",
    v: item.v || item.total || item.amount || 0,
  }));
})();

  return (
    <>
      <div className="db-stats">
        <StatCard
          icon="users"
          label="Total students"
          value={totalStudents}
          delta={`+${attendanceStats?.newThisMonth ?? 0} this month`}
          icBg="#E6F1FB"
          icColor="#185FA5"
          deltaColor="#3B6D11"
        />
        <StatCard
          icon="teacher"
          label="Teachers"
          value={teacherCount}
          delta={`${teachers.length} active`}
          icBg="#EAF3DE"
          icColor="#3B6D11"
          deltaColor="#3B6D11"
        />
        <StatCard
          icon="building"
          label="Active classes"
          value={classCount}
          delta={`${sections.length} sections`}
          icBg="#FEF3DC"
          icColor="#633806"
          deltaColor="#633806"
        />
        <StatCard
          icon="trend"
          label="Attendance rate"
          value={attendanceRate}
          delta={attendanceStats?.trend ?? "—"}
          icBg="#FCEBEB"
          icColor="#A32D2D"
          deltaColor="#3B6D11"
        />
      </div>
      <div className="db-mid">
        <div className="db-panel">
          <div className="db-ph">
            <div>
              <span className="db-pt">Attendance overview</span>
              <span className="db-ps">Students vs teachers — this week</span>
            </div>
            <span className="db-chip">This week</span>
          </div>
          <LineChart data={chartData} />
          <div className="db-legend">
            <div className="db-leg-item">
              <div className="db-leg-dot" style={{ background: "#185FA5" }} />
              Students
            </div>
            <div className="db-leg-item">
              <div className="db-leg-dot" style={{ background: "#97C459" }} />
              Teachers
            </div>
          </div>
        </div>
        <div className="db-panel">
          <div className="db-ph">
            <span className="db-pt">Quick actions</span>
          </div>
          <div className="db-actions">
            {quickActions.map((a) => (
              <div className="db-action" key={a.label} onClick={a.action}>
                <div
                  className="db-action-ic"
                  style={{ background: a.bg, color: a.color }}
                >
                  <Icon name={a.icon} size={14} />
                </div>
                <div className="db-action-body">
                  <span className="db-action-lbl">{a.label}</span>
                  <span className="db-action-desc">{a.desc}</span>
                </div>
                <span className="db-action-arr">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="db-bot">
        <div className="db-panel">
          <div className="db-ph">
            <div>
              <span className="db-pt">Recent enrollments</span>
              <span className="db-ps">Last 5 students</span>
            </div>
            <button
              className="db-view-all"
              onClick={() => setActiveNav("Students")}
            >
              View all →
            </button>
          </div>
          <table className="db-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Language</th>
                <th>Level</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="db-s-cell">
                      <div className="db-mini-av">{initials(s.name)}</div>
                      {s.name}
                    </div>
                  </td>
                  <td>{s.language}</td>
                  <td>
                    <span className={`db-lvl ${levelCls(s.level)}`}>
                      {s.level}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`db-status ${s.status === "active" ? "db-st-active" : "db-st-pending"}`}
                    >
                      <span className="db-dot" />
                      {s.status === "active" ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="db-date-cell">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="db-panel">
          <div className="db-ph">
            <div>
              <span className="db-pt">Monthly Revenue</span>
              <span className="db-ps">Last 7 months · DA</span>
            </div>
          </div>
          <RevenueChart data={revenueData} />
          <div className="db-avg-row" ref={avgRef}>
            <span className="db-avg-lbl">Avg. attendance</span>
            <div className="db-avg-track">
              <div
                className="db-avg-fill"
                style={{
                  width: avgVisible
                    ? `${attendanceStats?.avgRate ?? 90}%`
                    : "0%",
                }}
              />
            </div>
            <span className="db-avg-val">{attendanceStats?.avgRate ?? 0}%</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   STUDENT PROFILE MODAL
══════════════════════════════════════════════════════════════ */
function StudentProfileModal({ studentId, onClose, onArchived }) {
  const [student, setStudent] = useState(null);
  const [sections, setSections] = useState([]);
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [confirm, setConfirm] = useState(false);

   useEffect(() => {
    if (!studentId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [profileData, sectionsData] = await Promise.all([
          apiFetch(`/users/${studentId}/profile`),
          apiFetch(`/users/${studentId}/sections`),
        ]);

        if (profileData?.success) setStudent(profileData.student);
        if (sectionsData?.success) {
          setSections(sectionsData.sections || []);
          if (sectionsData.sections?.length > 0) {
            try {
              const cmData = await apiFetch(
                `/sections/${sectionsData.sections[0].id}/students`
              );
              if (cmData?.success) {
                setClassmates(
                  (cmData.students || []).filter(
                    (s) => String(s._id || s.id) !== String(studentId)
                  )
                );
              }
            } catch {
              setClassmates([]);
            }
          }
        }
      } catch (err) {
        console.error("StudentProfileModal error:", err);
      } finally {
        setLoading(false);
      }
    };

fetchData();
  }, [studentId]);

  const handleArchive = async () => {
    try {
      const data = await apiFetch(`/users/${studentId}/archive`, { method: "PATCH" });
      if (data?.success) {
        if (onArchived) onArchived(studentId);
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };


  const ini = (name) =>
    (name || "??").split(" ").map(n => n[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();

  const levelCls = (lvl) => {
    const c = (lvl?.[0] || "a").toLowerCase();
    return c === "a" ? "db-lv-a" : c === "b" ? "db-lv-b" : "db-lv-c";
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const TABS = [
    { key: "info",       label: "Info" },
    { key: "courses",    label: "Courses" },
    { key: "classmates", label: "Classmates" },
  ];

  // ── Overlay style ──────────────────────────────────────────
  const overlayStyle = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 300,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "16px",
  };

  const modalStyle = {
    background: "var(--db-card, #fff)",
    borderRadius: "var(--db-r, 12px)",
    boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>

        {/* ── Header ── */}
        <div style={{
          padding: "20px 20px 0",
          borderBottom: "1px solid var(--db-border, #e5e7eb)",
        }}>
          {loading ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "var(--db-text3, #9ca3af)", fontSize: 13 }}>
              Loading…
            </div>
          ) : student ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                {/* Avatar */}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #185FA5, #1A6CC4)",
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18, fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {ini(student.name)}
                </div>

                {/* Nom + badges */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "var(--db-text, #111)", marginBottom: 4 }}>
                    {student.name}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    {student.level && (
                      <span className={`db-lvl ${levelCls(student.level)}`}>{student.level}</span>
                    )}
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px",
                      borderRadius: 20,
                      background: student.status === "active" ? "#EAF3DE" : "#FAEEDA",
                      color: student.status === "active" ? "#3B6D11" : "#633806",
                    }}>
                      <span style={{
                        display: "inline-block", width: 6, height: 6,
                        borderRadius: "50%", marginRight: 4,
                        background: student.status === "active" ? "#3B6D11" : "#B45309",
                        verticalAlign: "middle",
                      }} />
                      {student.status === "active" ? "Active" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Bouton archiver */}
                <button
                  title="Archive student"
                  onClick={() => setConfirm(true)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--db-text3, #9ca3af)", padding: "6px",
                    borderRadius: "8px", transition: "all .2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#C0352A"; e.currentTarget.style.background = "var(--db-red-bg, #FCEBEB)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--db-text3, #9ca3af)"; e.currentTarget.style.background = "none"; }}
                >
                  <Icon name="trash" size={15} />
                </button>

                {/* Bouton fermer */}
                <button
                  onClick={onClose}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--db-text3, #9ca3af)", fontSize: 18,
                    lineHeight: 1, padding: "4px", flexShrink: 0,
                  }}
                >✕</button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 0, borderBottom: "none" }}>
                {TABS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      padding: "8px 16px",
                      fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400,
                      color: activeTab === t.key ? "#185FA5" : "var(--db-text2, #6b7280)",
                      background: "none", border: "none", cursor: "pointer",
                      borderBottom: activeTab === t.key ? "2px solid #185FA5" : "2px solid transparent",
                      transition: "all .15s",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: "16px 0", textAlign: "center", color: "var(--db-text3)", fontSize: 13 }}>
              Student not found.
            </div>
          )}
        </div>

        {/* ── Body ── */}
        {!loading && student && (
          <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1 }}>

            {/* TAB : Info */}
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Email",       student.email   || "—"],
                  ["Phone",       student.phone   || "—"],
                  ["Language",    student.language|| "—"],
                  ["Level",       student.level   || "—"],
                  ["Schedule",    student.schedule|| "—"],
                  ["Absences",    student.absences ?? 0],
                  ["Enrolled on", formatDate(student.createdAt)],
                  ["Notes",       student.notes   || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center",
                    padding: "9px 12px",
                    background: "var(--db-bg, #f9fafb)",
                    borderRadius: "var(--db-r, 8px)",
                    gap: 12,
                  }}>
                    <span style={{ fontSize: 12, color: "var(--db-text3, #9ca3af)", minWidth: 90, fontWeight: 500 }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: 13, color: "var(--db-text, #111)", fontWeight: label === "Absences" ? 700 : 400,
                      color: label === "Absences"
                        ? (student.absences >= 8 ? "#C0352A" : student.absences >= 4 ? "#7A4A0A" : "#2D7A3A")
                        : "var(--db-text, #111)",
                    }}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB : Courses */}
            {activeTab === "courses" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sections.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--db-text3)", fontSize: 13 }}>
                    Not enrolled in any section yet.
                  </div>
                ) : sections.map(sec => (
                  <div key={sec.id} style={{
                    padding: "12px 14px",
                    background: "var(--db-bg, #f9fafb)",
                    border: "1px solid var(--db-border, #e5e7eb)",
                    borderLeft: "3px solid #185FA5",
                    borderRadius: "var(--db-r, 8px)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{sec.name}</span>
                      <span className={`db-lvl ${levelCls(sec.level)}`}>{sec.level}</span>
                    </div>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {[
                        ["Language", sec.language],
                        ["Teacher",  sec.teacher],
                        ["Schedule", sec.time],
                        ["Room",     sec.room],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontSize: 10, color: "var(--db-text3)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                            {k}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{v || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB : Classmates */}
            {activeTab === "classmates" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {classmates.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--db-text3)", fontSize: 13 }}>
                    No classmates found.
                  </div>
                ) : classmates.map((c, idx) => {
                  const name = `${c.prenom || ""} ${c.nom || ""}`.trim() || c.email;
                  const enrolled = c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                    : "—";
                  return (
                    <div key={c._id || c.id || idx} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 0",
                      borderBottom: idx < classmates.length - 1 ? "1px solid var(--db-border, #e5e7eb)" : "none",
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "linear-gradient(135deg,#185FA5,#1A6CC4)",
                        color: "#fff", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                      }}>
                        {ini(name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--db-text)" }}>{name}</div>
                        <div style={{ fontSize: 11, color: "var(--db-text3)" }}>Enrolled {enrolled}</div>
                      </div>
                      <span style={{
                        fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                        background: c.actif ? "#EAF3DE" : "#FAEEDA",
                        color: c.actif ? "#3B6D11" : "#633806",
                      }}>
                        {c.actif ? "Active" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        {!loading && student && (
          <div style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--db-border, #e5e7eb)",
            display: "flex", justifyContent: "flex-end",
          }}>
            <button
              onClick={onClose}
              style={{
                padding: "7px 18px", borderRadius: "var(--db-r, 8px)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                background: "var(--db-bg, #f3f4f6)",
                color: "var(--db-text2, #6b7280)",
                border: "1px solid var(--db-border, #e5e7eb)",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* ── Confirm archive ── */}
      {confirm && (
        <ConfirmDialog
          message={`Archive ${student?.name}? They can be restored later by an admin.`}
          onConfirm={handleArchive}
          onCancel={() => setConfirm(false)}
          danger={true}
        />
        
      )}

    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   ADMIN DASHBOARD — composant principal
══════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserDefaultRole, setAddUserDefaultRole] = useState("");

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [toast, setToast] = useState(null);

  const currentUserId = getUserIdFromToken();

  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    deleteOne,
    deleteAll,
    refresh,
  } = useNotifications(currentUserId);

  const showToast = useCallback((msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // Socket.IO — events temps réel
useSocket(currentUserId, useCallback((event, data) => {
  switch (event) {
    case 'student:added':
      setStudents(prev => [...prev, {
        id: data._id,
        name: `${data.prenom || ""} ${data.nom || ""}`.trim(),
        language: data.language || "—",
        level: data.level || "A1",
        status: data.actif ? "active" : "pending",
        date: new Date(data.createdAt).toLocaleDateString("en-US"),
        absences: 0,
        phone: data.telephone || "—",
        email: data.email,
        section: data.section || "Not assigned",
      }]);
      showToast(`New student: ${data.prenom} ${data.nom}`);
      break;

    case 'section:updated':
    case 'section:assigned':
      // ✅ Met à jour la section avec le nouveau nombre d'étudiants
      setSections(prev => prev.map(s =>
        String(s.id) === String(data.id || data._id)
          ? { ...s, students: data.students ?? s.students, ...data }
          : s
      ));
      break;

    case 'payment:updated':
      setPayments(prev => prev.map(p =>
        String(p.id) === String(data.id)
          ? { ...p, status: data.status, paid: data.paid ?? p.paid }
          : p
      ));
      break;

    case 'absence:marked':
      // ✅ Met à jour le compteur d'absences de l'étudiant
      setStudents(prev => prev.map(s =>
        String(s.id) === String(data.studentId)
          ? { ...s, absences: data.totalAbsences ?? s.absences + 1 }
          : s
      ));
      break;

    case 'notification:new':
    case 'notification':
      refresh();
      break;

    default:
      break;
  }
}, [showToast, refresh]));
  /* ── Loaders ── */
  const loadStudents = useCallback(async () => {
    try {
      const [studData, sectData] = await Promise.all([
        apiFetch("/users/students"),
        apiFetch("/sections"),
      ]);
      if (studData.success) {
        const sects = sectData.success ? sectData.sections || [] : [];
        setStudents(
          studData.students.map((s) => {
            const studentSection = sects.find((sec) =>
              (sec.studentIds || []).includes(String(s._id)),
            );
            return {
              id: s._id,
              name: `${s.prenom || ""} ${s.nom || ""}`.trim() || s.email,
              language: s.language || studentSection?.language || "—",
              level: s.level || studentSection?.level || "A1",
              status: s.actif ? "active" : "pending",
              date: new Date(s.createdAt).toLocaleDateString("en-US"),
              absences: s.absences || 0,
              phone: s.telephone || "—",
              email: s.email,
              section: studentSection?.name || "Not assigned",
            };
          }),
        );
      }
    } catch (err) {
      console.error("Students error:", err);
    }
  }, []);

  const loadTeachers = useCallback(async () => {
    try {
      const data = await apiFetch("/users/teachers");
      if (data.success)
        setTeachers(
          data.teachers.map((t) => ({
            id: t._id,
            name: `${t.prenom || ""} ${t.nom || ""}`.trim() || t.email,
            specialty: t.specialty || "—",
            email: t.email,
            phone: t.telephone || "—",
            classes: t.classes || [],
            students: t.students || 0,
            hours: t.hours || 0,
            rating: t.rating || "—",
            joined:
              t.joined || new Date(t.createdAt).toLocaleDateString("en-US"),
          })),
        );
    } catch (err) {
      console.error("Teachers error:", err);
    }
  }, []);

  const loadSections = useCallback(async () => {
    try {
      const data = await apiFetch("/sections");
      if (data.success)
        setSections(
          (data.sections || []).map((s) => ({
            id: s._id || s.id,
            name: s.name,
            language: s.language,
            level: s.level,
            teacher: s.teacher || "—",
            teacherId: s.teacherId || s.teacher_id || "",
            students: s.students || s.studentsCount || 0,
            capacity: s.capacity || 12,
            time: s.time || "—",
            room: s.room || "—",
          })),
        );
    } catch (err) {
      console.error("Sections error:", err);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    try {
      const data = await apiFetch("/payments");
      if (data.success)
        setPayments(
          data.payments.map((p) => ({
            id: String(p._id || p.id),
            student: p.student || "—",
            lang: p.language || p.lang || "—",
            level: p.level || "—",
            amount: p.amount || 0,
            paid: p.paid || 0,
            due: p.due
              ? new Date(p.due).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })
              : "—",
            status: p.status,
            method: p.method || "—",
            createdAt: p.createdAt,
          })),
        );
    } catch (err) {
      console.error("Payments error:", err);
    }
  }, []);

  const loadAttendanceStats = useCallback(async () => {
    try {
      const data = await apiFetch("/absences/stats");
      if (data.success) setAttendanceStats(data.stats);
    } catch {}
  }, []);

  const loadRevenueStats = useCallback(async () => {
    try {
      const data = await apiFetch("/payments/stats");
      if (data.success) setRevenueStats(data.stats);
    } catch {}
  }, []);

  useEffect(() => {
    loadStudents();
    loadTeachers();
    loadSections();
    loadPayments();
    loadAttendanceStats();
    loadRevenueStats();
  }, []);

  const getBadge = (item) => (item.badge === "notif" ? unreadCount : 0);

  const openAddUser = (role = "") => {
    setAddUserDefaultRole(role);
    setShowAddUser(true);
  };

  const renderContent = () => {
    switch (activeNav) {
      case "Students":
        return (
          <StudentsPage
            students={students}
            setStudents={setStudents}
            onAdd={() => openAddUser("etudiant")}
          />
        );
      case "Teachers":
        return (
          <TeachersPage
            teachers={teachers}
            setTeachers={setTeachers}
            onAdd={() => openAddUser("professeur")}
          />
        );
      case "Classes":
        return (
          <ClassesPage
            sections={sections}
            setSections={setSections}
            loadSections={loadSections}
          />
        );
      case "Payments":
        return <PaymentsPage payments={payments} setPayments={setPayments} />;
      case "Absences":
        return <AbsencesPage />;
      case "Notifications":
        return (
          <NotificationsPage
            notifications={notifications}
            markRead={markRead}
            markAllRead={markAllRead}
            deleteOne={deleteOne}
            deleteAll={deleteAll}
            refresh={refresh}
          />
        );
      case "Settings":
        return <SettingsPage />;
      default:
        return (
          <DashboardHome
            students={students}
            teachers={teachers}
            sections={sections}
            payments={payments}
            notifications={notifications}
            attendanceStats={attendanceStats}
            revenueStats={revenueStats}
            setActiveNav={setActiveNav}
            onAddUser={openAddUser}
          />
        );
    }
  };

  return (
    <div className={`db-layout${collapsed ? " db-collapsed" : ""}`}>
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
              <h2>Language</h2>
              <span>School Admin</span>
            </div>
          )}
        </div>
        <button className="db-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "›" : "‹"}
        </button>
        {!collapsed && (
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#1A6CC4,#0D4F94)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              AD
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                Main Admin
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                Administrator
              </span>
            </div>
          </div>
        )}
        <nav className="db-nav">
          {["main", "manage"].map((section) => (
            <React.Fragment key={section}>
              {!collapsed && (
                <span
                  className="db-nav-label"
                  style={section === "manage" ? { marginTop: 10 } : {}}
                >
                  {section === "main" ? "Main" : "Manage"}
                </span>
              )}
              {NAV_ITEMS.filter((n) => n.section === section).map((n) => {
                const bdg = getBadge(n);
                return (
                  <button
                    key={n.label}
                    className={`db-nav-item${activeNav === n.label ? " db-nav-active" : ""}`}
                    onClick={() => setActiveNav(n.label)}
                  >
                    <span className="db-nav-icon">
                      <Icon name={n.icon} size={15} />
                    </span>
                    {!collapsed && (
                      <span className="db-nav-text">
                        {n.label}
                        {bdg > 0 && (
                          <span className="db-notif-badge">{bdg}</span>
                        )}
                      </span>
                    )}
                    {collapsed && bdg > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: 7,
                          right: 7,
                          width: 7,
                          height: 7,
                          background: "#EF4444",
                          borderRadius: "50%",
                          border: "1.5px solid #0F2D52",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </nav>
        <div className="db-sidebar-bottom">
          <button
            className="db-nav-item db-nav-danger"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }}
          >
            <span className="db-nav-icon">
              <Icon name="logout" size={15} />
            </span>
            {!collapsed && <span className="db-nav-text">Log out</span>}
          </button>
        </div>
      </aside>

      <div className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-header-title">{activeNav}</div>
<span className="db-header-sub">
  {new Date().toLocaleDateString("en-US", { 
    day: "numeric", month: "long", year: "numeric" 
  })} · Spring semester
</span>
          </div>
          <div className="db-search">
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search students, classes…" />
          </div>
          <div className="db-header-right">
            <button
              className="db-icon-btn"
              onClick={() => setActiveNav("Notifications")}
              style={{ position: "relative" }}
            >
              <Icon name="bell" size={17} />
              {unreadCount > 0 && <span className="db-badge" />}
            </button>
            <div
              className="db-profile"
              onClick={() => setActiveNav("Settings")}
            >
              <div className="db-avatar">AD</div>
              <div>
                <span className="db-pname">Admin</span>
                <span className="db-prole">Administrator</span>
              </div>
            </div>
          </div>
        </header>
        <main className="db-content">{renderContent()}</main>
      </div>

      {showAddUser && (
        <AddUser
          onClose={() => {
            setShowAddUser(false);
            setAddUserDefaultRole("");
          }}
          students={students}
          defaultRole={addUserDefaultRole}
          onSaved={(user) => {
            loadStudents();
            loadTeachers();
            const roleLabels = {
              etudiant: "Student",
              professeur: "Teacher",
              secretaire: "Secretary",
              parent: "Parent",
            };
            showToast(
              `${roleLabels[user.role] || "User"} ${user.prenom} ${user.nom} created.`,
            );
          }}
        />
      )}

      {toast && <Toast msg={toast.msg || toast} color={toast.color} />}
    </div>
  );
};

export default AdminDashboard;
