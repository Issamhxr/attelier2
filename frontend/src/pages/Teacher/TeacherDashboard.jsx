import React, { useState, useEffect } from "react";
import "../../styles/DSC.css";
import { useNotifications } from "../../hooks/useNotifications";
import { useSocket } from "../../hooks/useSocket";

/* ══════════════════════════════════════════
   ICONS
══════════════════════════════════════════ */
const Icon = ({ name, size = 16 }) => {
  const s = { width: size, height: size };
  const p = { fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid:     <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    users:    <svg viewBox="0 0 24 24" style={s} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    building: <svg viewBox="0 0 24 24" style={s} {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    calendar: <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    credit:   <svg viewBox="0 0 24 24" style={s} {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    file:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    bell:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    mail:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    settings: <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    logout:   <svg viewBox="0 0 24 24" style={s} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus:     <svg viewBox="0 0 24 24" style={s} {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    check:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    search:   <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    reply:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
    send:     <svg viewBox="0 0 24 24" style={s} {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    arrowL:   <svg viewBox="0 0 24 24" style={s} {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    star:     <svg viewBox="0 0 24 24" style={s} {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    warning:  <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    trend:    <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    book:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    lock:     <svg viewBox="0 0 24 24" style={s} {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    eye:      <svg viewBox="0 0 24 24" style={s} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    download: <svg viewBox="0 0 24 24" style={s} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    filter:   <svg viewBox="0 0 24 24" style={s} {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    refresh:  <svg viewBox="0 0 24 24" style={s} {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    user:     <svg viewBox="0 0 24 24" style={s} {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    useradd:  <svg viewBox="0 0 24 24" style={s} {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  };
  return icons[name] || null;
};

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const paymentData = [
  { month: "Oct", paid: 120, unpaid: 35 },
  { month: "Nov", paid: 135, unpaid: 28 },
  { month: "Dec", paid: 118, unpaid: 42 },
  { month: "Jan", paid: 142, unpaid: 22 },
  { month: "Feb", paid: 148, unpaid: 18 },
  { month: "Mar", paid: 150, unpaid: 16 },
];

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */
function useCountUp(target, duration = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let st = null;
    const step = ts => {
      if (!st) st = ts;
      const p = Math.min((ts - st) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [target]);
  return v.toLocaleString();
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const initials = name => (name || "??").split(" ").map(n => n[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
const levelCls = lvl => { if (!lvl) return "db-lv-a"; const c = lvl[0].toLowerCase(); return c==="a"?"db-lv-a":c==="b"?"db-lv-b":"db-lv-c"; };
const occColor = (s, cap) => { const r = s / cap; if (r >= 1) return "#A32D2D"; if (r >= 0.75) return "#3B6D11"; return "#1A6CC4"; };

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
function Toast({ msg }) {
  return <div className="sc-toast"><Icon name="check" size={14}/> {msg}</div>;
}

/* ══════════════════════════════════════════
   PAYMENT TREND CHART
══════════════════════════════════════════ */
function PaymentChart({ data }) {
  const [tip, setTip] = useState(null);
  const W = 520, H = 170, P = { t: 12, r: 10, b: 28, l: 36 };
  const cw = W - P.l - P.r, ch = H - P.t - P.b, maxV = 180;
  const xs = data.map((_, i) => P.l + i * (cw / (data.length - 1)));
  const ys = v => P.t + ch - (v / maxV) * ch;
  const pathD = k => data.map((d, i) => `${i === 0 ? "M" : "L"}${xs[i]},${ys(d[k])}`).join(" ");
  const areaD = k => pathD(k) + ` L${xs[xs.length-1]},${H-P.b} L${P.l},${H-P.b} Z`;
  return (
    <div className="sc-line-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="sc-line-svg">
        <defs>
          <linearGradient id="g-paid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1A6CC4" stopOpacity=".18"/><stop offset="100%" stopColor="#1A6CC4" stopOpacity="0"/></linearGradient>
          <linearGradient id="g-unpaid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C0352A" stopOpacity=".12"/><stop offset="100%" stopColor="#C0352A" stopOpacity="0"/></linearGradient>
        </defs>
        {[45,90,135,180].map(v => (
          <g key={v}>
            <line x1={P.l} y1={ys(v)} x2={W-P.r} y2={ys(v)} stroke="rgba(0,0,0,0.06)" strokeWidth=".8" strokeDasharray="4 3"/>
            <text x={P.l-5} y={ys(v)+4} fontSize="10" fill="#9BA5B5" textAnchor="end">{v}</text>
          </g>
        ))}
        {data.map((d,i) => <text key={d.month} x={xs[i]} y={H-5} fontSize="10" fill="#5A6478" textAnchor="middle">{d.month}</text>)}
        <path d={areaD("unpaid")} fill="url(#g-unpaid)"/>
        <path d={areaD("paid")} fill="url(#g-paid)"/>
        <path d={pathD("unpaid")} fill="none" stroke="#C0352A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3"/>
        <path d={pathD("paid")} fill="none" stroke="#1A6CC4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((d,i) => (
          <g key={d.month}>
            <circle cx={xs[i]} cy={ys(d.paid)} r="4" fill="#fff" stroke="#1A6CC4" strokeWidth="2.5" style={{ cursor:"pointer" }} onMouseEnter={e => setTip({ x:e.clientX, y:e.clientY, k:"paid", month:d.month, val:d.paid })} onMouseLeave={() => setTip(null)}/>
            <circle cx={xs[i]} cy={ys(d.unpaid)} r="4" fill="#fff" stroke="#C0352A" strokeWidth="2" style={{ cursor:"pointer" }} onMouseEnter={e => setTip({ x:e.clientX, y:e.clientY, k:"unpaid", month:d.month, val:d.unpaid })} onMouseLeave={() => setTip(null)}/>
          </g>
        ))}
      </svg>
      {tip && <div className="sc-tooltip" style={{ left: tip.x+12, top: tip.y-40 }}><strong>{tip.k==="paid"?"Paid":"Unpaid"}</strong>{tip.month} : {tip.val} students</div>}
    </div>
  );
}

/* ══════════════════════════════════════════
   DONUT CHART
══════════════════════════════════════════ */
function DonutChart({ paid, total }) {
  const r = 52, stroke = 12, circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let st = null;
    const step = ts => {
      if (!st) st = ts;
      const p = Math.min((ts-st)/1000, 1);
      setAnim((1 - Math.pow(1-p, 3)) * (total > 0 ? paid/total : 0));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [paid, total]);
  const cx = 68, cy = 68;
  return (
    <div className="sc-donut-wrap">
      <svg width="136" height="136" viewBox="0 0 136 136">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f4f6f9" strokeWidth={stroke}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fce8e8" strokeWidth={stroke} strokeDasharray={`${circ} ${circ}`} strokeDashoffset={0} style={{ transform:"rotate(-90deg)", transformOrigin:`${cx}px ${cy}px` }}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A6CC4" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${anim*circ} ${circ}`} strokeDashoffset={0} style={{ transform:"rotate(-90deg)", transformOrigin:`${cx}px ${cy}px` }}/>
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="18" fontWeight="600" fill="#111827">{Math.round(anim*100)}%</text>
        <text x={cx} y={cy+12} textAnchor="middle" fontSize="10" fill="#5A6478">Payment Rate</text>
      </svg>
      <div className="sc-donut-legend">
        <div className="sc-donut-item"><div className="sc-donut-dot" style={{ background:"#1A6CC4" }}/><span>Paid</span><strong>{paid}</strong></div>
        <div className="sc-donut-item"><div className="sc-donut-dot" style={{ background:"#fce8e8", border:"1.5px solid #C0352A" }}/><span>Unpaid</span><strong>{total-paid}</strong></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════ */
function StatCard({ icon, label, value, delta, neg, accent }) {
  return (
    <div className="sc-stat" style={accent ? { borderTopColor: accent } : {}}>
      <div className="sc-stat-ic" style={accent ? { background: accent+"18", color: accent } : {}}>
        <Icon name={icon} size={18}/>
      </div>
      <div className="sc-stat-body">
        <span className="sc-stat-lbl">{label}</span>
        <strong className="sc-stat-val">{value}</strong>
        <span className={`sc-stat-dl${neg ? " sc-dl-neg" : ""}`}>{delta}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   REGISTER MODAL
══════════════════════════════════════════ */
function RegisterModal({ sections, onClose, onSuccess }) {
  const [form, setForm] = useState({ fname:"", lname:"", phone:"", email:"", language:"", level:"" });
  const [saved, setSaved] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.fname || !form.lname || !form.email) return;
    setSaved(true);
    setTimeout(() => {
      onSuccess({ name: `${form.lname} ${form.fname}`, language: form.language, level: form.level, phone: form.phone, email: form.email, section: "" });
      onClose();
    }, 1800);
  };

  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal" onClick={e => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div><span className="sc-modal-title">New Registration</span><span className="sc-modal-sub">Create a new student account</span></div>
          <button className="sc-modal-close" onClick={onClose}>×</button>
        </div>

        {saved ? (
          <div className="sc-modal-body" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"32px 24px" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"#EAF3DE", color:"#3B6D11", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="check" size={28}/>
            </div>
            <span style={{ fontWeight:600, fontSize:15, color:"var(--db-text)" }}>Account created!</span>
            <span style={{ fontSize:12, color:"var(--db-text2)" }}>The account has been successfully saved.</span>
          </div>
        ) : (
          <>
            <div className="sc-modal-body">
              <div className="sc-form-row">
                <div className="sc-field"><label>First Name *</label><input className="sc-input" placeholder="Mohammed" value={form.fname} onChange={e => upd("fname", e.target.value)}/></div>
                <div className="sc-field"><label>Last Name *</label><input className="sc-input" placeholder="Kaci" value={form.lname} onChange={e => upd("lname", e.target.value)}/></div>
              </div>
              <div className="sc-field"><label>Email *</label><input className="sc-input" type="email" placeholder="student@mail.com" value={form.email} onChange={e => upd("email", e.target.value)}/></div>
              <div className="sc-field"><label>Phone <span style={{fontWeight:400,color:"var(--db-text3)"}}>(optional)</span></label><input className="sc-input" placeholder="+213 6 00 00 00 00" value={form.phone} onChange={e => upd("phone", e.target.value)}/></div>
            </div>
            <div className="sc-modal-footer">
              <button className="sc-btn-ghost" onClick={onClose}>Cancel</button>
              <button className="sc-btn-primary" onClick={submit}>
                <Icon name="check" size={14}/> Register
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════
   PAYMENT MODAL
══════════════════════════════════════════ */
function PaymentModal({ students, onClose, onSuccess }) {
  const [form, setForm] = useState({ student:"", amount:"4500", month:"", method:"Cash" });
  const upd = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const months = ["January 2026","February 2026","March 2026","April 2026","May 2026","June 2026"];
  const submit = () => {
    if (!form.student || !form.month) return;
    onSuccess({ name: form.student, amount: parseInt(form.amount), method: form.method, month: form.month });
    onClose();
  };
  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal" onClick={e => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div><span className="sc-modal-title">Record a Payment</span><span className="sc-modal-sub">New Transaction</span></div>
          <button className="sc-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="sc-modal-body">
          <div className="sc-field"><label>Student</label>
            <select className="sc-select" value={form.student} onChange={e => upd("student", e.target.value)} style={{ width:"100%" }}>
              <option value="">Choose a student…</option>
              {students.map(s => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="sc-form-row">
            <div className="sc-field"><label>Amount (DA)</label><input className="sc-input" type="number" value={form.amount} onChange={e => upd("amount", e.target.value)}/></div>
            <div className="sc-field"><label>Month</label>
              <select className="sc-select" value={form.month} onChange={e => upd("month", e.target.value)} style={{ width:"100%" }}>
                <option value="">Choose…</option>
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="sc-field"><label>Method</label>
            <select className="sc-select" value={form.method} onChange={e => upd("method", e.target.value)} style={{ width:"100%" }}>
              {["Cash","CCP","Wire Transfer","Check"].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="sc-modal-footer">
          <button className="sc-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="sc-btn-primary" onClick={submit}><Icon name="check" size={14}/> Save</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD VIEW
══════════════════════════════════════════ */
function DashboardView({ sections, pending, setPending, payments, students, setActiveNav, showRegister, showPayment, API, getHeaders, safeFetch, loadAll, showT }) {
  const total     = useCountUp(students.length + pending.length);
  const paid      = useCountUp(payments.filter(p => p.status === "paid").length);
  const unpaid    = useCountUp(payments.filter(p => p.status !== "paid").length);
  const sectCount = useCountUp(sections.length);
  const recentPays = [...payments].slice(0, 5);

  const handleAccept = async (id) => {
    try {
      const res = await safeFetch(`${API}/secretaire/students/${id}/accept`, { method:"PATCH" });
      if (!res) return;
      const data = await res.json();
      if (data.success) { await loadAll(); showT("Student accepted."); }
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      const res = await safeFetch(`${API}/secretaire/students/${id}/reject`, { method:"DELETE" });
      if (!res) return;
      const data = await res.json();
      if (data.success) { await loadAll(); showT("Registration rejected."); }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="sc-stats">
        <StatCard icon="users"    label="Total Students"    value={total}     delta="+8 this month"  accent="#1A6CC4"/>
        <StatCard icon="credit"   label="Payments Received" value={paid}      delta="Paid"            accent="#2D7A3A"/>
        <StatCard icon="warning"  label="Unpaid"            value={unpaid}    delta="To follow up"   neg accent="#C0352A"/>
        <StatCard icon="building" label="Active Sections"   value={sectCount} delta="5 languages"    accent="#97C459"/>
      </div>
      <div className="sc-mid">
        <div className="sc-panel">
          <div className="sc-ph">
            <div><span className="sc-pt">Payment Trends</span><span className="sc-ps">Last 6 months</span></div>
            <span className="sc-chip">6 months</span>
          </div>
          <PaymentChart data={paymentData}/>
          <div className="sc-legend">
            <div className="sc-leg-item"><div className="sc-leg-dot" style={{ background:"#1A6CC4" }}/> Paid</div>
            <div className="sc-leg-item"><div className="sc-leg-dot" style={{ background:"#C0352A", opacity:.7 }}/> Unpaid</div>
          </div>
        </div>
        <div className="sc-side-col">
          <div className="sc-panel">
            <div className="sc-ph"><span className="sc-pt">Payment Status</span></div>
            <DonutChart paid={payments.filter(p=>p.status==="paid").length} total={payments.length}/>
          </div>
          <div className="sc-panel">
            <div className="sc-ph"><span className="sc-pt">Quick Actions</span></div>
            <div className="sc-actions">
              {[
                { label:"Register a Student",  desc:"New registration",  icon:"useradd",  action: () => showRegister() },
                { label:"Record a Payment",    desc:"Payment receipt",   icon:"credit",   action: () => showPayment() },
                { label:"View Absences",       desc:"Daily report",      icon:"file",     action: () => setActiveNav("Absences") },
                { label:"Schedule",            desc:"Course planning",   icon:"calendar", action: () => setActiveNav("Schedule") },
              ].map(a => (
                <div className="sc-action" key={a.label} onClick={a.action}>
                  <div className="sc-action-ic"><Icon name={a.icon} size={14}/></div>
                  <div className="sc-action-body"><span className="sc-action-lbl">{a.label}</span><span className="sc-action-desc">{a.desc}</span></div>
                  <span className="sc-action-arr">›</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sc-bot">
        <div className="sc-panel">
          <div className="sc-ph">
            <div><span className="sc-pt">Sections & Occupancy</span><span className="sc-ps">Capacity per section</span></div>
            <button className="sc-view-all" onClick={() => setActiveNav("Sections")}>View all →</button>
          </div>
          <table className="sc-table">
            <thead><tr><th>Section</th><th>Language</th><th>Level</th><th>Teacher</th><th>Occupancy</th><th>Schedule</th></tr></thead>
            <tbody>
              {sections.map(s => (
                <tr key={s.name || s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.language}</td>
                  <td><span className={`sc-lvl ${levelCls(s.level)}`}>{s.level}</span></td>
                  <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(s.teacher)}</div>{s.teacher}</div></td>
                  <td>
                    <div className="sc-occ-cell">
                      <div className="sc-occ-track"><div className="sc-occ-fill" style={{ width:`${(s.students/s.capacity)*100}%`, background: occColor(s.students,s.capacity) }}/></div>
                      <span className="sc-occ-label" style={{ color: occColor(s.students,s.capacity) }}>{s.students}/{s.capacity}</span>
                    </div>
                  </td>
                  <td className="sc-date-cell">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sc-right-col">
          <div className="sc-panel">
            <div className="sc-ph">
              <div><span className="sc-pt">Pending Registrations</span><span className="sc-ps">{pending.length} to validate</span></div>
              {pending.length > 0 && <span className="sc-badge-count">{pending.length}</span>}
            </div>
            <div className="sc-pending-list">
              {pending.length === 0 && <div className="sc-empty-state">No pending registrations</div>}
              {pending.map(s => (
                <div className="sc-pending-item" key={s.id}>
                  <div className="sc-mini-av sc-mini-av-amber">{initials(s.name)}</div>
                  <div className="sc-pending-body">
                    <span className="sc-pending-name">{s.name}</span>
                    <span className="sc-pending-meta">{s.language} · {s.level} · {s.phone}</span>
                  </div>
                  <div className="sc-pending-actions">
                    <button className="sc-btn-accept" onClick={() => handleAccept(s.id)}>✓</button>
                    <button className="sc-btn-reject" onClick={() => handleReject(s.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sc-panel">
            <div className="sc-ph"><div><span className="sc-pt">Recent Payments</span><span className="sc-ps">5 recent transactions</span></div></div>
            <div className="sc-payment-list">
              {recentPays.map(p => (
                <div className="sc-pay-item" key={p.id}>
                  <div className="sc-mini-av">{initials(p.name)}</div>
                  <div className="sc-pay-body">
                    <span className="sc-pay-name">{p.name}</span>
                    <span className="sc-pay-meta">{p.date} · {p.method}</span>
                  </div>
                  <div className="sc-pay-right">
                    <span className="sc-pay-amount">{p.amount.toLocaleString()} DA</span>
                    <span className={`sc-pay-status ${p.status==="paid" ? "sc-pay-ok" : "sc-pay-pend"}`}>{p.status==="paid"?"Paid":"Pending"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   REGISTRATIONS VIEW
══════════════════════════════════════════ */
function RegistrationsView({ students, pending, sections, showRegister, API, safeFetch, loadAll, showT }) {
  const [search, setSearch] = useState("");
  const [filterSec, setFilterSec] = useState("All");

  const filtered = students.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchSec    = filterSec === "All" || s.section === filterSec;
    return matchSearch && matchSec;
  });

  const handleAccept = async (id) => {
    try {
      const res = await safeFetch(`${API}/secretaire/students/${id}/accept`, { method:"PATCH" });
      if (!res) return;
      const data = await res.json();
      if (data.success) { await loadAll(); showT("Student accepted and activated."); }
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      const res = await safeFetch(`${API}/secretaire/students/${id}/reject`, { method:"DELETE" });
      if (!res) return;
      const data = await res.json();
      if (data.success) { await loadAll(); showT("Registration rejected."); }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="sc-panel">
        <div className="sc-ph">
          <div><span className="sc-pt">Pending Registrations</span><span className="sc-ps">{pending.length} requests to validate</span></div>
          <button className="sc-btn-primary sc-btn-sm" onClick={showRegister}><Icon name="plus" size={13}/> Register</button>
        </div>
        {pending.length === 0
          ? <div className="sc-empty-state">No pending registrations</div>
          : <div className="sc-pending-list">
              {pending.map(s => (
                <div className="sc-pending-item" key={s.id}>
                  <div className="sc-mini-av sc-mini-av-amber">{initials(s.name)}</div>
                  <div className="sc-pending-body">
                    <span className="sc-pending-name">{s.name}</span>
                    <span className="sc-pending-meta">{s.language} · {s.level} · {s.phone} · {s.date}</span>
                  </div>
                  <div className="sc-pending-actions">
                    <button className="sc-btn-accept" onClick={() => handleAccept(s.id)}>✓</button>
                    <button className="sc-btn-reject" onClick={() => handleReject(s.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
      <div className="sc-panel">
        <div className="sc-ph">
          <div><span className="sc-pt">All Students</span><span className="sc-ps">{filtered.length} students</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:160 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterSec} onChange={e => setFilterSec(e.target.value)}>
              <option>All</option>
              {sections.map(s => <option key={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <table className="sc-table">
          <thead><tr><th>Name</th><th>Section</th><th>Language</th><th>Level</th><th>Phone</th><th>Absences</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(s.name)}</div><strong>{s.name}</strong></div></td>
                <td style={{ fontSize:12 }}>{s.section}</td>
                <td>{s.language}</td>
                <td><span className={`sc-lvl ${levelCls(s.level)}`}>{s.level}</span></td>
                <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.phone}</td>
                <td><span style={{ fontSize:12, fontWeight:600, color: s.absences >= 8 ? "#C0352A" : s.absences >= 4 ? "#7A4A0A" : "#2D7A3A" }}>{s.absences}</span></td>
                <td><span className={`sc-status ${s.status==="active" ? "sc-st-ok" : "sc-st-pend"}`}><span className="sc-dot"/> {s.status==="active"?"Active":"Pending"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   STUDENTS VIEW
══════════════════════════════════════════ */
function StudentsView({ API, safeFetch, showT }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterLevel, setFilterLevel]   = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    safeFetch(`${API}/users/role/etudiant`)
      .then(r => r?.json())
      .then(data => { if (data?.success) setStudents(data.users); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const levels = ["All", "A1", "A2", "B1", "B2", "C1", "C2"];
  const filtered = students.filter(s => {
    const name = `${s.prenom || ""} ${s.nom || ""}`.toLowerCase();
    const ms   = !search || name.includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase());
    const ml   = filterLevel  === "All" || s.level === filterLevel;
    const mst  = filterStatus === "All" || (filterStatus === "Active" ? s.actif : !s.actif);
    return ms && ml && mst;
  });

  const total  = students.length;
  const active = students.filter(s => s.actif).length;

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:4 }}>
        {[
          { lbl:"Total Students", val: total,          color:"#1A6CC4" },
          { lbl:"Active",         val: active,          color:"#2D7A3A" },
          { lbl:"Pending",        val: total - active,  color:"#C0352A" },
        ].map(c => (
          <div className="sc-panel" key={c.lbl} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>{c.lbl}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:600, color:c.color }}>{c.val}</div>
          </div>
        ))}
      </div>
      <div className="sc-panel">
        <div className="sc-ph">
          <div><span className="sc-pt">Student List</span><span className="sc-ps">{filtered.length} results</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:160 }} placeholder="Name, email…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
            <select className="sc-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option>All</option><option>Active</option><option>Pending</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="sc-empty-state">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="sc-empty-state">No students found</div>
        ) : (
          <table className="sc-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Section</th><th>Language</th><th>Level</th><th>Absences</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(s => {
                const name = `${s.prenom || ""} ${s.nom || ""}`.trim();
                return (
                  <tr key={s._id}>
                    <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(name)}</div><strong>{name}</strong></div></td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.email || "—"}</td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.telephone || "—"}</td>
                    <td style={{ fontSize:12 }}>{s.section || "—"}</td>
                    <td style={{ fontSize:12 }}>{s.language || "—"}</td>
                    <td>{s.level ? <span className={`sc-lvl ${levelCls(s.level)}`}>{s.level}</span> : <span style={{ fontSize:12, color:"var(--db-text3)" }}>—</span>}</td>
                    <td><span style={{ fontSize:12, fontWeight:600, color: (s.absences||0) >= 8 ? "#C0352A" : (s.absences||0) >= 4 ? "#7A4A0A" : "#2D7A3A" }}>{s.absences || 0}</span></td>
                    <td><span className={`sc-status ${s.actif ? "sc-st-ok" : "sc-st-pend"}`}><span className="sc-dot"/> {s.actif ? "Active" : "Pending"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   TEACHERS VIEW
══════════════════════════════════════════ */
function TeachersView({ API, safeFetch, showT }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterSpec, setFilterSpec] = useState("All");

  useEffect(() => {
    safeFetch(`${API}/users/role/professeur`)
      .then(r => r?.json())
      .then(data => { if (data?.success) setTeachers(data.users); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const specialties = ["All", ...new Set(teachers.map(t => t.specialty).filter(Boolean))];
  const filtered = teachers.filter(t => {
    const name = `${t.prenom || ""} ${t.nom || ""}`.toLowerCase();
    const ms   = !search || name.includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase());
    const msp  = filterSpec === "All" || t.specialty === filterSpec;
    return ms && msp;
  });

  const total  = teachers.length;
  const active = teachers.filter(t => t.actif).length;

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:4 }}>
        {[
          { lbl:"Total Teachers", val: total,          color:"#1A6CC4" },
          { lbl:"Active",         val: active,          color:"#2D7A3A" },
          { lbl:"Archived",       val: total - active,  color:"#C0352A" },
        ].map(c => (
          <div className="sc-panel" key={c.lbl} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>{c.lbl}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:600, color:c.color }}>{c.val}</div>
          </div>
        ))}
      </div>
      <div className="sc-panel">
        <div className="sc-ph">
          <div><span className="sc-pt">Teacher List</span><span className="sc-ps">{filtered.length} results</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:160 }} placeholder="Name, email…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterSpec} onChange={e => setFilterSpec(e.target.value)}>
              {specialties.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="sc-empty-state">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="sc-empty-state">No teachers found</div>
        ) : (
          <table className="sc-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Specialty</th><th>Hours/week</th><th>Registered On</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(t => {
                const name = `${t.prenom || ""} ${t.nom || ""}`.trim();
                const date = t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US") : "—";
                return (
                  <tr key={t._id}>
                    <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(name)}</div><strong>{name}</strong></div></td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.email || "—"}</td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.telephone || "—"}</td>
                    <td style={{ fontSize:12 }}>{t.specialty || "—"}</td>
                    <td style={{ fontSize:12, textAlign:"center" }}>{t.hours || "—"}</td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{date}</td>
                    <td><span className={`sc-status ${t.actif ? "sc-st-ok" : "sc-st-err"}`}><span className="sc-dot"/> {t.actif ? "Active" : "Archived"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   SECTIONS VIEW
══════════════════════════════════════════ */
function SectionsView({ sections, setSections, API, safeFetch, showT }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", language:"English", level:"A1", capacity:12, teacher:"", teacherId:"", time:"", room:"" });
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableRooms] = useState([
    "A101","A102","A103","A104","B101","B102","B103","B104",
    "C101","C102","C201","C202","Computer Lab 1","Computer Lab 2","Amphitheater A","Amphitheater B",
  ]);
  const [availableSlots] = useState([
    "Mon 08:00–09:30","Mon 09:45–11:15","Mon 11:30–13:00","Mon 14:00–15:30","Mon 15:45–17:15",
    "Tue 08:00–09:30","Tue 09:45–11:15","Tue 11:30–13:00","Tue 14:00–15:30","Tue 15:45–17:15",
    "Wed 08:00–09:30","Wed 09:45–11:15","Wed 11:30–13:00","Wed 14:00–15:30","Wed 15:45–17:15",
    "Thu 08:00–09:30","Thu 09:45–11:15","Thu 11:30–13:00","Thu 14:00–15:30","Thu 15:45–17:15",
    "Fri 08:00–09:30","Fri 09:45–11:15","Fri 11:30–13:00","Fri 14:00–15:30","Fri 15:45–17:15",
    "Sat 08:00–09:30","Sat 09:45–11:15","Sat 11:30–13:00",
    "Mon/Wed 08:00–09:30","Mon/Wed 09:45–11:15","Mon/Wed 14:00–15:30",
    "Tue/Thu 08:00–09:30","Tue/Thu 09:45–11:15","Tue/Thu 14:00–15:30",
    "Wed/Fri 08:00–09:30","Wed/Fri 09:45–11:15","Wed/Fri 14:00–15:30",
  ]);

  useEffect(() => {
    safeFetch(`${API}/users/role/professeur`)
      .then(r => r?.json())
      .then(data => {
        if (data?.success) {
          setAvailableTeachers(
            (data.users || [])
              .filter(t => t.actif !== false)
              .map(t => ({ id: t._id, name: `${t.prenom || ""} ${t.nom || ""}`.trim() }))
          );
        }
      })
      .catch(err => console.error("Error loading teachers:", err));
  }, []);

  const usedRooms = sections.map(s => s.room).filter(Boolean);
  const usedSlots = sections.map(s => s.time).filter(Boolean);

  const addSection = async () => {
    if (!form.name || !form.teacher) return;
    try {
      const res = await safeFetch(`${API}/secretaire/sections`, {
        method: "POST",
        body: JSON.stringify({ ...form, capacity: parseInt(form.capacity) }),
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setSections(ss => [...ss, {
          id: data.section._id, name: data.section.name, language: data.section.language,
          level: data.section.level, teacher: data.section.teacher, students: 0,
          capacity: data.section.capacity, time: data.section.time, room: data.section.room,
        }]);
        setForm({ name:"", language:"English", level:"A1", capacity:12, teacher:"", teacherId:"", time:"", room:"" });
        setShowAdd(false);
        showT("Section created successfully.");
      } else { showT(`Error: ${data.message}`); }
    } catch (err) { console.error(err); }
  };

  const deleteSection = async (id, name) => {
    try {
      const res = await safeFetch(`${API}/secretaire/sections/${id}`, { method:"DELETE" });
      if (!res) return;
      const data = await res.json();
      if (data.success) { setSections(ss => ss.filter(s => s.id !== id && s.name !== name)); showT("Section deleted."); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="sc-panel">
      <div className="sc-ph">
        <div><span className="sc-pt">Section Management</span><span className="sc-ps">{sections.length} active sections</span></div>
        <button className="sc-add-btn" onClick={() => setShowAdd(s=>!s)}><Icon name="plus" size={13}/> New Section</button>
      </div>
      {showAdd && (
        <div style={{ background:"var(--db-bg)", border:"var(--db-border)", borderRadius:"var(--db-r)", padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:12 }}>
          <div className="sc-form-row">
            <div className="sc-field"><label>Section Name</label><input className="sc-input" placeholder="Section F" value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))}/></div>
            <div className="sc-field"><label>Language</label>
              <select className="sc-select" style={{ width:"100%" }} value={form.language} onChange={e => setForm(f=>({...f, language:e.target.value}))}>
                {["English","French","Spanish","German","Mandarin","Arabic","Russian"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="sc-form-row">
            <div className="sc-field"><label>Level</label>
              <select className="sc-select" style={{ width:"100%" }} value={form.level} onChange={e => setForm(f=>({...f, level:e.target.value}))}>
                {["A1","A2","B1","B2","C1","C2"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="sc-field"><label>Capacity</label><input className="sc-input" type="number" min={1} max={40} value={form.capacity} onChange={e => setForm(f=>({...f, capacity:e.target.value}))}/></div>
          </div>
          <div className="sc-field"><label>Available Teacher</label>
            <select className="sc-select" style={{ width:"100%" }} value={form.teacherId} onChange={e => {
              const t = availableTeachers.find(t => t.id === e.target.value);
              setForm(f=>({...f, teacherId: e.target.value, teacher: t?.name || ""}));
            }}>
              <option value="">— Choose a teacher —</option>
              {availableTeachers.length === 0 && <option disabled>No teachers available</option>}
              {availableTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="sc-field"><label>Available Room</label>
            <select className="sc-select" style={{ width:"100%" }} value={form.room} onChange={e => setForm(f=>({...f, room:e.target.value}))}>
              <option value="">— Choose a room —</option>
              {availableRooms.map(r => (
                <option key={r} value={r} disabled={usedRooms.includes(r)} style={{ color: usedRooms.includes(r) ? "#aaa" : "inherit" }}>
                  {r}{usedRooms.includes(r) ? " — occupied" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="sc-field"><label>Time Slot</label>
            <select className="sc-select" style={{ width:"100%" }} value={form.time} onChange={e => setForm(f=>({...f, time:e.target.value}))}>
              <option value="">— Choose a slot —</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot} disabled={usedSlots.includes(slot)} style={{ color: usedSlots.includes(slot) ? "#aaa" : "inherit" }}>
                  {slot}{usedSlots.includes(slot) ? " — already used" : ""}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button className="sc-btn-ghost" onClick={() => { setShowAdd(false); setForm({ name:"", language:"English", level:"A1", capacity:12, teacher:"", teacherId:"", time:"", room:"" }); }}>Cancel</button>
            <button className="sc-btn-primary" onClick={addSection} disabled={!form.name || !form.teacher || !form.room || !form.time} style={{ opacity: (!form.name || !form.teacher || !form.room || !form.time) ? 0.5 : 1 }}>
              <Icon name="check" size={13}/> Create
            </button>
          </div>
        </div>
      )}
      <table className="sc-table">
        <thead><tr><th>Section</th><th>Language</th><th>Level</th><th>Teacher</th><th>Occupancy</th><th>Schedule</th><th>Room</th><th></th></tr></thead>
        <tbody>
          {sections.map(s => (
            <tr key={s.id || s.name}>
              <td><strong>{s.name}</strong></td>
              <td>{s.language}</td>
              <td><span className={`sc-lvl ${levelCls(s.level)}`}>{s.level}</span></td>
              <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(s.teacher)}</div>{s.teacher}</div></td>
              <td>
                <div className="sc-occ-cell">
                  <div className="sc-occ-track"><div className="sc-occ-fill" style={{ width:`${(s.students/s.capacity)*100}%`, background: occColor(s.students,s.capacity) }}/></div>
                  <span className="sc-occ-label" style={{ color: occColor(s.students,s.capacity) }}>{s.students}/{s.capacity}</span>
                </div>
              </td>
              <td className="sc-date-cell">{s.time}</td>
              <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.room || "—"}</td>
              <td><button className="sc-icon-row-btn" onClick={() => deleteSection(s.id, s.name)}><Icon name="trash" size={13}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════
   TIMETABLE VIEW
══════════════════════════════════════════ */
function TimetableView({ API, safeFetch, sections, showT }) {
  const [offset, setOffset]   = useState(0);
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ section:"", subject:"", teacher:"", room:"", startTime:"08:00", endTime:"09:30" });

  const d = new Date(); d.setDate(d.getDate() + offset);
  const di = d.getDay();
  const label = offset===0?"Today":offset===-1?"Yesterday":offset===1?"Tomorrow":DAYS_EN[di];

  const loadTimetable = async () => {
    setLoading(true);
    try {
      const res  = await safeFetch(`${API}/secretaire/timetable?day=${di}`);
      if (!res) return;
      const data = await res.json();
      if (data.success) setRows(data.timetable);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadTimetable(); }, [di]);

  const addEntry = async () => {
    if (!form.room || !form.startTime || !form.endTime) return;
    try {
      const res  = await safeFetch(`${API}/secretaire/timetable`, {
        method:"POST",
        body: JSON.stringify({ ...form, dayOfWeek: di }),
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) { await loadTimetable(); setShowAdd(false); showT("Slot added."); }
    } catch (err) { console.error(err); }
  };

  const deleteEntry = async (id) => {
    try {
      const res  = await safeFetch(`${API}/secretaire/timetable/${id}`, { method:"DELETE" });
      if (!res) return;
      const data = await res.json();
      if (data.success) { setRows(rs => rs.filter(r => r.id !== id)); showT("Slot deleted."); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="sc-panel">
      <div className="sc-ph">
        <div><span className="sc-pt">Schedule</span><span className="sc-ps">{label} — {DAYS_EN[di]}</span></div>
        <div style={{ display:"flex", gap:6 }}>
          <button className="sc-arr-btn" onClick={() => setOffset(o=>o-1)}>‹ Prev</button>
          <button className="sc-arr-btn" onClick={() => setOffset(0)}>Today</button>
          <button className="sc-arr-btn" onClick={() => setOffset(o=>o+1)}>Next ›</button>
          <button className="sc-btn-primary sc-btn-sm" onClick={() => setShowAdd(v=>!v)}><Icon name="plus" size={13}/> Add</button>
        </div>
      </div>
      {showAdd && (
        <div style={{ background:"var(--db-bg)", border:"var(--db-border)", borderRadius:"var(--db-r)", padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:12 }}>
          <div className="sc-form-row">
            <div className="sc-field"><label>Section</label>
              <select className="sc-select" style={{ width:"100%" }} value={form.section} onChange={e => setForm(f=>({...f, section:e.target.value}))}>
                <option value="">Choose…</option>
                {sections.map(s => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="sc-field"><label>Teacher</label><input className="sc-input" placeholder="Teacher name" value={form.teacher} onChange={e => setForm(f=>({...f,teacher:e.target.value}))}/></div>
          </div>
          <div className="sc-form-row">
            <div className="sc-field"><label>Room</label><input className="sc-input" placeholder="A101" value={form.room} onChange={e => setForm(f=>({...f,room:e.target.value}))}/></div>
            <div className="sc-field"><label>Subject</label><input className="sc-input" placeholder="English" value={form.subject} onChange={e => setForm(f=>({...f,subject:e.target.value}))}/></div>
          </div>
          <div className="sc-form-row">
            <div className="sc-field"><label>Start Time</label><input className="sc-input" placeholder="08:00" value={form.startTime} onChange={e => setForm(f=>({...f,startTime:e.target.value}))}/></div>
            <div className="sc-field"><label>End Time</label><input className="sc-input" placeholder="09:30" value={form.endTime} onChange={e => setForm(f=>({...f,endTime:e.target.value}))}/></div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button className="sc-btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="sc-btn-primary" onClick={addEntry}><Icon name="check" size={13}/> Save</button>
          </div>
        </div>
      )}
      {loading && <div className="sc-empty-state">Loading…</div>}
      {!loading && rows.length === 0 && <div className="sc-empty-state">No classes scheduled for {DAYS_EN[di]}</div>}
      {!loading && rows.map((r) => (
        <div className="sc-tt-row" key={r.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div className="sc-tt-time">{r.time}</div>
          <div className="sc-tt-body" style={{ flex:1 }}>
            <div className="sc-tt-subj">{r.subject} — {r.section}</div>
            <div className="sc-tt-room">Room {r.room} · {r.teacher}</div>
          </div>
          <span className="sc-status sc-st-blue"><span className="sc-dot"/> Scheduled</span>
          <button className="sc-icon-row-btn" onClick={() => deleteEntry(r.id)}><Icon name="trash" size={13}/></button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   PAYMENTS VIEW
══════════════════════════════════════════ */
function PaymentsView({ payments, setPayments, students, showPayment, API, safeFetch, showT }) {
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMonth, setFilterMonth]   = useState("All");

  const totalPaid   = payments.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const totalUnpaid = payments.filter(p=>p.status!=="paid").reduce((a,p)=>a+p.amount,0);
  const totalAll    = payments.reduce((a,p)=>a+p.amount,0);
  const months      = [...new Set(payments.map(p=>p.month))];

  const filtered = payments.filter(p => {
    const ms  = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const mst = filterStatus==="All" || (filterStatus==="Paid"?p.status==="paid":p.status!=="paid");
    const mm  = filterMonth==="All" || p.month===filterMonth;
    return ms && mst && mm;
  });

  const markPaid = async (id) => {
    try {
      const res  = await safeFetch(`${API}/payments/${id}/pay`, { method:"PATCH", body: JSON.stringify({}) });
      if (!res) return;
      const data = await res.json();
      if (data.success) setPayments(ps => ps.map(p => p.id===id ? { ...p, status:"paid" } : p));
    } catch (err) { console.error(err); }
  };

  const deleteP = async (id) => {
    try {
      const res  = await safeFetch(`${API}/payments/${id}`, { method:"DELETE" });
      if (!res) return;
      const data = await res.json();
      if (data.success) { setPayments(ps => ps.filter(p => p.id!==id)); showT("Payment deleted."); }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { lbl:"Total Collected", val:`${totalPaid.toLocaleString()} DA`,   sub:`${payments.filter(p=>p.status==="paid").length} payments`,  color:"#2D7A3A" },
          { lbl:"Unpaid",          val:`${totalUnpaid.toLocaleString()} DA`, sub:`${payments.filter(p=>p.status!=="paid").length} payments`,   color:"#C0352A" },
          { lbl:"Total Expected",  val:`${totalAll.toLocaleString()} DA`,    sub:`${payments.length} transactions`,                           color:"#1A6CC4" },
        ].map(c => (
          <div className="sc-panel" key={c.lbl}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>{c.lbl}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:600, color:c.color, letterSpacing:"-.5px" }}>{c.val}</div>
            <div style={{ fontSize:11, color:"var(--db-text2)", marginTop:4 }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="sc-panel">
        <div className="sc-ph">
          <div><span className="sc-pt">Payment History</span><span className="sc-ps">{filtered.length} transactions</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:140 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option>All</option><option>Paid</option><option>Unpaid</option>
            </select>
            <select className="sc-select" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option>All</option>
              {months.map(m => <option key={m}>{m}</option>)}
            </select>
            <button className="sc-btn-primary sc-btn-sm" onClick={showPayment}><Icon name="plus" size={13}/> New</button>
          </div>
        </div>
        <table className="sc-table">
          <thead><tr><th>Student</th><th>Section</th><th>Month</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(p.name)}</div><strong>{p.name}</strong></div></td>
                <td style={{ fontSize:12, color:"var(--db-text2)" }}>{p.section}</td>
                <td style={{ fontSize:12 }}>{p.month}</td>
                <td><strong style={{ fontFamily:"'Sora',sans-serif" }}>{p.amount.toLocaleString()} DA</strong></td>
                <td style={{ fontSize:12, color:"var(--db-text2)" }}>{p.date}</td>
                <td style={{ fontSize:12 }}>{p.method}</td>
                <td>
                  {p.status==="paid"
                    ? <span className="sc-status sc-st-ok"><span className="sc-dot"/> Paid</span>
                    : <span className="sc-status sc-st-pend"><span className="sc-dot"/> Unpaid</span>
                  }
                </td>
                <td>
                  <div style={{ display:"flex", gap:4 }}>
                    {p.status!=="paid" && <button className="sc-btn-accept" title="Mark as paid" onClick={()=>markPaid(p.id)}>✓</button>}
                    <button className="sc-icon-row-btn" onClick={()=>deleteP(p.id)}><Icon name="trash" size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   ABSENCES VIEW
══════════════════════════════════════════ */
function AbsencesView({ students, API, safeFetch, showT }) {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterSec, setFilterSec] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student:"", studentId:"", section:"", session:"", date:"", justified: false });

  const loadAbsences = async () => {
    setLoading(true);
    try {
      const res  = await safeFetch(`${API}/secretaire/absences`);
      if (!res) return;
      const data = await res.json();
      if (data.success) setAbsences(data.absences);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAbsences(); }, []);

  const critical = students.filter(s => s.absences >= 8);
  const filtered = absences.filter(a => {
    const ms   = !search || a.student.toLowerCase().includes(search.toLowerCase());
    const msec = filterSec==="All" || a.section===filterSec;
    return ms && msec;
  });

  const toggle = async (id) => {
    try {
      const res  = await safeFetch(`${API}/secretaire/absences/${id}/justify`, { method:"PATCH" });
      if (!res) return;
      const data = await res.json();
      if (data.success) setAbsences(as => as.map(a => a.id===id ? { ...a, justified:data.justified } : a));
    } catch (err) { console.error(err); }
  };

  const deleteA = async (id) => {
    try {
      const res  = await safeFetch(`${API}/secretaire/absences/${id}`, { method:"DELETE" });
      if (!res) return;
      const data = await res.json();
      if (data.success) { setAbsences(as => as.filter(a => a.id!==id)); showT("Absence deleted."); }
    } catch (err) { console.error(err); }
  };

  const addAbsence = async () => {
    if (!form.student || !form.date) return;
    try {
      const res  = await safeFetch(`${API}/secretaire/absences`, {
        method:"POST",
        body: JSON.stringify({ student: form.student, studentId: form.studentId || null, section: form.section, session: form.session, date: form.date, justified: false }),
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setAbsences(as => [{ id: data.absence._id, student: data.absence.student, section: data.absence.section, date: data.absence.date, session: data.absence.session, justified: false }, ...as]);
        setForm({ student:"", studentId:"", section:"", session:"", date:"", justified:false });
        setShowForm(false);
        showT("Absence recorded.");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      {critical.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {critical.map(s => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", border:"1px solid rgba(192,53,42,0.2)", borderLeft:"4px solid #C0352A", borderRadius:"var(--db-r)", background:"var(--db-red-bg)" }}>
              <div className="sc-mini-av sc-mini-av-amber">{initials(s.name)}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#C0352A" }}>{s.name} — {s.absences} absences</div>
                <div style={{ fontSize:11, color:"var(--db-text2)" }}>{s.section} · Critical threshold exceeded (max 8)</div>
              </div>
              <span className="sc-status sc-st-err"><span className="sc-dot"/> Critical</span>
            </div>
          ))}
        </div>
      )}
      <div className="sc-panel">
        <div className="sc-ph">
          <div><span className="sc-pt">Absence Register</span><span className="sc-ps">{filtered.length} absences</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:140 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterSec} onChange={e => setFilterSec(e.target.value)}>
              <option>All</option>
              {[...new Set(absences.map(a=>a.section).filter(Boolean))].map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="sc-btn-primary sc-btn-sm" onClick={() => setShowForm(f=>!f)}><Icon name="plus" size={13}/> Enter</button>
          </div>
        </div>
        {showForm && (
          <div style={{ background:"var(--db-bg)", border:"var(--db-border)", borderRadius:"var(--db-r)", padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:12 }}>
            <div className="sc-form-row">
              <div className="sc-field"><label>Student</label>
                <select className="sc-select" style={{ width:"100%" }} value={form.studentId} onChange={e => {
                  const s = students.find(st => st.id === e.target.value);
                  setForm(f=>({...f, studentId: e.target.value, student: s?.name || "", section: s?.section || ""}));
                }}>
                  <option value="">Choose…</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="sc-field"><label>Date</label><input className="sc-input" type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))}/></div>
            </div>
            <div className="sc-form-row">
              <div className="sc-field"><label>Session</label><input className="sc-input" placeholder="09:00-10:30" value={form.session} onChange={e => setForm(f=>({...f,session:e.target.value}))}/></div>
              <div className="sc-field"><label>Section</label><input className="sc-input" placeholder="Section A" value={form.section} onChange={e => setForm(f=>({...f,section:e.target.value}))}/></div>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button className="sc-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="sc-btn-primary" onClick={addAbsence}><Icon name="check" size={13}/> Save</button>
            </div>
          </div>
        )}
        {loading ? <div className="sc-empty-state">Loading…</div> : (
          <table className="sc-table">
            <thead><tr><th>Student</th><th>Section</th><th>Date</th><th>Session</th><th>Justified</th><th></th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign:"center", padding:"2rem", color:"var(--db-text3)", fontSize:13 }}>No absences recorded.</td></tr>}
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(a.student)}</div><strong>{a.student}</strong></div></td>
                  <td style={{ fontSize:12, color:"var(--db-text2)" }}>{a.section}</td>
                  <td style={{ fontSize:12 }}>{new Date(a.date).toLocaleDateString("en-US")}</td>
                  <td style={{ fontSize:12, color:"var(--db-text2)" }}>{a.session}</td>
                  <td>
                    <button onClick={() => toggle(a.id)} style={{ background:"none", border:"none", cursor:"pointer" }}>
                      <span className={`sc-status ${a.justified ? "sc-st-ok" : "sc-st-err"}`}><span className="sc-dot"/> {a.justified ? "Yes" : "No"}</span>
                    </button>
                  </td>
                  <td><button className="sc-icon-row-btn" onClick={()=>deleteA(a.id)}><Icon name="trash" size={13}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   NOTIFICATIONS VIEW
══════════════════════════════════════════ */
function NotificationsView({ notifs, setNotifs, API, safeFetch, showT }) {
  const [tab, setTab] = useState("All");

  const markAll = async () => {
    try {
      await safeFetch(`${API}/secretaire/notifications/read-all`, { method:"PATCH" });
      setNotifs(ns => ns.map(n => ({ ...n, read:true })));
      showT("All notifications marked as read.");
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    try {
      await Promise.all(notifs.map(n => safeFetch(`${API}/secretaire/notifications/${n.id}`, { method:"DELETE" })));
      setNotifs([]);
      showT("Notifications cleared.");
    } catch (err) { console.error(err); }
  };

  const toggleRead = async (id) => {
    try {
      await safeFetch(`${API}/secretaire/notifications/${id}/read`, { method:"PATCH" });
      setNotifs(ns => ns.map(n => n.id===id ? { ...n, read:!n.read } : n));
    } catch (err) { console.error(err); }
  };

  const del = async (id, e) => {
    e.stopPropagation();
    try {
      await safeFetch(`${API}/secretaire/notifications/${id}`, { method:"DELETE" });
      setNotifs(ns => ns.filter(n => n.id!==id));
    } catch (err) { console.error(err); }
  };

  const tabs = [
    { lbl:"All", key:"All" }, { lbl:"Payments", key:"pay" },
    { lbl:"Registrations", key:"ins" }, { lbl:"Absences", key:"abs" }, { lbl:"System", key:"sys" },
  ];
  const icCls  = { pay:"sc-nic-pay", abs:"sc-nic-abs", ins:"sc-nic-ins", sys:"sc-nic-sys" };
  const tagCls = { pay:"sc-ntag-pay", abs:"sc-ntag-abs", ins:"sc-ntag-ins", sys:"sc-ntag-sys" };
  const tagLbl = { pay:"Payment", abs:"Absence", ins:"Registration", sys:"System" };
  const filtered = tab==="All" ? notifs : notifs.filter(n=>n.type===tab);
  const unread   = notifs.filter(n=>!n.read).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:600, color:"var(--db-text)" }}>Notifications</div>
          <span style={{ fontSize:12, color:"var(--db-text2)" }}>Secretariat Notification Center</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {unread > 0 && <button className="sc-btn-ghost" onClick={markAll}><Icon name="check" size={13}/> Mark all read ({unread})</button>}
          {notifs.length > 0 && (
            <button style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", background:"var(--db-red-bg)", color:"var(--db-red)", border:"1px solid rgba(192,53,42,.15)", borderRadius:"var(--db-r)", cursor:"pointer", fontSize:12.5 }} onClick={clearAll}>
              <Icon name="trash" size={13}/> Clear all
            </button>
          )}
        </div>
      </div>
      <div className="sc-panel" style={{ padding:0 }}>
        <div style={{ padding:"0 18px" }}>
          <div className="sc-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`sc-tab${tab===t.key?" active":""}`} onClick={()=>setTab(t.key)}>
                {t.lbl}<span className="sc-tab-n">{t.key==="All"?notifs.length:notifs.filter(n=>n.type===t.key).length}</span>
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0
          ? <div className="sc-notif-empty"><Icon name="bell" size={20}/><span className="sc-notif-empty-t">No notifications</span><span className="sc-notif-empty-s">You're up to date!</span></div>
          : <div className="sc-notif-list">
              {filtered.map(n => (
                <div key={n.id} className={`sc-notif-item${!n.read?" unread":""}`} onClick={()=>toggleRead(n.id)}>
                  <div className={`sc-notif-ic ${icCls[n.type]||"sc-nic-sys"}`}>{n.icon}</div>
                  <div className="sc-notif-body">
                    <div className="sc-notif-head"><span className="sc-notif-title">{n.title}</span>{!n.read && <span className="sc-notif-udot"/>}</div>
                    <div className="sc-notif-msg">{n.msg}</div>
                    <div className="sc-notif-foot"><span className="sc-notif-time">{n.time}</span><span className={`sc-notif-tag ${tagCls[n.tag]||"sc-ntag-sys"}`}>{tagLbl[n.tag]||n.tag}</span></div>
                  </div>
                  <button className="sc-notif-del" onClick={e=>del(n.id,e)}><Icon name="trash" size={13}/></button>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   INBOX VIEW
══════════════════════════════════════════ */
function InboxView({ emails, setEmails, API, safeFetch, showT }) {
  const [selected, setSelected]   = useState(null);
  const [tab, setTab]             = useState("All");
  const [search, setSearch]       = useState("");
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const tabs = [
    { lbl:"All", key:"All" }, { lbl:"Absences", key:"abs" },
    { lbl:"Registrations", key:"ins" }, { lbl:"System", key:"sys" },
  ];
  const filtered = emails.filter(e => {
    const mt = tab==="All" || e.tag===tab;
    const ms = !search || e.from?.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });
  const unread = emails.filter(e=>!e.read).length;

  const open = async (email) => {
    setSelected(email); setShowReply(false); setReplyText("");
    if (!email.read) {
      try {
        await safeFetch(`${API}/secretaire/messages/${email.id}/read`, { method:"PATCH" });
        setEmails(es => es.map(e => e.id===email.id ? { ...e, read:true } : e));
      } catch (err) { console.error(err); }
    }
  };

  const toggleStar = async (id, ev) => {
    ev.stopPropagation();
    try {
      const res  = await safeFetch(`${API}/secretaire/messages/${id}/star`, { method:"PATCH" });
      if (!res) return;
      const data = await res.json();
      if (data.success) setEmails(es => es.map(e => e.id===id ? { ...e, starred:data.starred } : e));
    } catch (err) { console.error(err); }
  };

  const delEmail = async (id) => {
    try {
      await safeFetch(`${API}/secretaire/messages/${id}`, { method:"DELETE" });
      setEmails(es => es.filter(e => e.id!==id));
      setSelected(null);
      showT("Message deleted.");
    } catch (err) { console.error(err); }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;
    try {
      const res  = await safeFetch(`${API}/secretaire/messages/${selected.id}/reply`, {
        method:"POST",
        body: JSON.stringify({ body: replyText }),
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) { setReplyText(""); setShowReply(false); showT("Reply sent."); }
    } catch (err) { console.error(err); }
  };

  const tagColors = {
    sys: { bg:"#FEF3DC", color:"#7A4A0A" }, abs: { bg:"#FDECEB", color:"#C0352A" },
    ins: { bg:"#EBF4FF", color:"#1A6CC4" }, pay: { bg:"#E8F5EC", color:"#2D7A3A" },
  };

  return (
    <div className="sc-inbox-layout">
      <div className="sc-inbox-list">
        <div className="sc-inbox-toolbar">
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
            <Icon name="search" size={12}/>
            <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:"100%" }} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          {unread > 0 && <span className="sc-inbox-unread-badge">{unread} unread</span>}
        </div>
        <div className="sc-tabs" style={{ padding:"0 8px", marginBottom:0 }}>
          {tabs.map(t => (
            <button key={t.key} className={`sc-tab${tab===t.key?" active":""}`} onClick={()=>setTab(t.key)} style={{ padding:"8px 12px", fontSize:11.5 }}>
              {t.lbl}<span className="sc-tab-n">{t.key==="All"?emails.length:emails.filter(e=>e.tag===t.key).length}</span>
            </button>
          ))}
        </div>
        <div className="sc-inbox-msgs">
          {filtered.length === 0 && <div className="sc-empty-state" style={{ padding:"2rem" }}>No messages</div>}
          {filtered.map(email => (
            <div key={email.id} className={`sc-inbox-msg${selected?.id===email.id?" selected":""}${!email.read?" unread":""}`} onClick={()=>open(email)}>
              <div className="sc-inbox-msg-top">
                <div className="sc-inbox-av">{email.avatar}</div>
                <div className="sc-inbox-meta">
                  <div className="sc-inbox-row1"><span className="sc-inbox-from">{email.from}</span><span className="sc-inbox-time">{email.time}</span></div>
                  <div className="sc-inbox-subject">{email.subject}</div>
                  <div className="sc-inbox-preview">{email.preview}</div>
                </div>
                <button className={`sc-inbox-star${email.starred?" active":""}`} onClick={e=>toggleStar(email.id,e)}><Icon name="star" size={13}/></button>
              </div>
              <div className="sc-inbox-msg-footer">
                <span className="sc-inbox-tag-badge" style={{ background:tagColors[email.tag]?.bg, color:tagColors[email.tag]?.color }}>{email.tag}</span>
                {!email.read && <span className="sc-inbox-udot"/>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sc-inbox-detail">
        {selected ? (
          <>
            <div className="sc-inbox-detail-hdr">
              <button className="sc-arr-btn" onClick={()=>setSelected(null)} style={{ display:"flex", alignItems:"center", gap:5 }}><Icon name="arrowL" size={14}/> Back</button>
              <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                <button className="sc-btn-ghost" style={{ display:"flex", alignItems:"center", gap:5, fontSize:12 }} onClick={()=>setShowReply(s=>!s)}><Icon name="reply" size={13}/> Reply</button>
                <button className="sc-icon-row-btn" onClick={()=>delEmail(selected.id)}><Icon name="trash" size={13}/></button>
              </div>
            </div>
            <div className="sc-inbox-detail-subj">{selected.subject}</div>
            <div className="sc-inbox-detail-from">
              <div className="sc-inbox-av">{selected.avatar}</div>
              <div><div className="sc-inbox-from" style={{ fontSize:13 }}>{selected.from}</div><div style={{ fontSize:11, color:"var(--db-text3)" }}>{selected.time}</div></div>
              <span className="sc-inbox-tag-badge" style={{ marginLeft:"auto", background:tagColors[selected.tag]?.bg, color:tagColors[selected.tag]?.color }}>{selected.tag}</span>
            </div>
            <div className="sc-inbox-detail-body">
              {(selected.body || "").split("\n").map((line,i) => <p key={i} style={{ margin:"2px 0", minHeight:14 }}>{line}</p>)}
            </div>
            {showReply && (
              <div className="sc-inbox-reply-box">
                <div className="sc-inbox-reply-lbl">Reply to {selected.from}</div>
                <textarea className="sc-inbox-reply-ta" placeholder="Your reply…" value={replyText} onChange={e=>setReplyText(e.target.value)} rows={4}/>
                <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
                  <button className="sc-btn-ghost" onClick={()=>setShowReply(false)}>Cancel</button>
                  <button className="sc-btn-primary" onClick={sendReply}><Icon name="send" size={13}/> Send</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="sc-inbox-empty-detail">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>Select a message to read it</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SETTINGS VIEW
══════════════════════════════════════════ */
function SettingsView({ API, safeFetch, showT }) {
  const [active, setActive]   = useState("Profile");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ fname:"", lname:"", email:"", phone:"", role:"" });
  const [notifPrefs, setNotifPrefs] = useState({ payments:true, registrations:true, absences:true, system:false });
  const [security, setSecurity]     = useState({ cur:"", new:"", confirm:"" });
  const [secErr, setSecErr]         = useState({});

  useEffect(() => {
    safeFetch(`${API}/secretaire/profile`)
      .then(r => r?.json())
      .then(data => {
        if (data?.success) {
          setProfile({
            fname: data.user.prenom || "", lname: data.user.nom || "",
            email: data.user.email  || "", phone: data.user.telephone || "",
            role:  data.user.role   || "",
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    try {
      const res  = await safeFetch(`${API}/secretaire/profile`, {
        method:"PUT",
        body: JSON.stringify({ nom: profile.lname, prenom: profile.fname, email: profile.email, telephone: profile.phone }),
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) showT("Profile saved!");
      else showT(`Error: ${data.message}`);
    } catch (err) { console.error(err); }
  };

  const savePassword = async () => {
    const e = {};
    if (!security.cur) e.cur = true;
    if (security.new.length < 8) e.new = true;
    if (security.new !== security.confirm) e.confirm = true;
    setSecErr(e);
    if (Object.keys(e).length) return;
    try {
      const res  = await safeFetch(`${API}/secretaire/change-password`, {
        method:"PATCH",
        body: JSON.stringify({ currentPwd: security.cur, newPwd: security.new }),
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) { setSecurity({ cur:"", new:"", confirm:"" }); showT("Password updated!"); }
      else { setSecErr({ cur:true }); }
    } catch (err) { console.error(err); }
  };

  const Toggle = ({ value, onChange }) => (
    <label className="sc-toggle-sw">
      <input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/>
      <span className="sc-toggle-slider"/>
    </label>
  );

  const navSections = [
    { key:"Profile", icon:"user" }, { key:"Notifications", icon:"bell" },
    { key:"Security", icon:"lock" }, { key:"Appearance", icon:"eye" },
  ];

  if (loading) return <div className="sc-empty-state">Loading…</div>;

  const renderContent = () => {
    if (active === "Profile") return (
      <div className="sc-settings-section">
        <span className="sc-settings-title">Personal Information</span>
        <div className="sc-form-row">
          {[["First Name","fname",profile.fname],["Last Name","lname",profile.lname]].map(([lbl,k,v]) => (
            <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
              <input className="sc-input" value={v} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))}/>
            </div>
          ))}
        </div>
        {[["Email","email","email",profile.email],["Phone","phone","tel",profile.phone],["Role","role","text",profile.role]].map(([lbl,k,t,v]) => (
          <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
            <input className="sc-input" type={t} value={v} readOnly={k==="role"} style={{ opacity: k==="role" ? 0.6 : 1 }} onChange={e=>k!=="role"&&setProfile(p=>({...p,[k]:e.target.value}))}/>
          </div>
        ))}
        <div className="sc-settings-save-row">
          <button className="sc-btn-primary" onClick={saveProfile}><Icon name="check" size={13}/> Save</button>
        </div>
      </div>
    );
    if (active === "Notifications") return (
      <div className="sc-settings-section">
        <span className="sc-settings-title">Notification Preferences</span>
        {[["Payment alerts","payments"],["New registrations","registrations"],["Absence alerts","absences"],["System notifications","system"]].map(([lbl,k]) => (
          <div key={k} className="sc-settings-row">
            <span className="sc-settings-lbl">{lbl}</span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Toggle value={notifPrefs[k]} onChange={v=>setNotifPrefs(p=>({...p,[k]:v}))}/>
              <span style={{ fontSize:12, color:"var(--db-text2)" }}>{notifPrefs[k]?"Enabled":"Disabled"}</span>
            </div>
          </div>
        ))}
        <div className="sc-settings-save-row"><button className="sc-btn-primary" onClick={() => showT("Preferences saved!")}><Icon name="check" size={13}/> Save</button></div>
      </div>
    );
    if (active === "Security") return (
      <div className="sc-settings-section">
        <span className="sc-settings-title">Change Password</span>
        {[["Current Password","cur","Your password"],["New Password","new","Minimum 8 characters"],["Confirm","confirm","Repeat new password"]].map(([lbl,k,ph]) => (
          <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
            <input type="password" className="sc-input" placeholder={ph} value={security[k]} style={{ borderColor:secErr[k]?"var(--db-red)":undefined }} onChange={e=>{ setSecurity(s=>({...s,[k]:e.target.value})); setSecErr(er=>({...er,[k]:false})); }}/>
            {secErr[k] && <span style={{ fontSize:11, color:"var(--db-red)" }}>{k==="confirm"?"Does not match":k==="new"?"Min. 8 characters":"Required"}</span>}
          </div>
        ))}
        <button className="sc-btn-primary" style={{ alignSelf:"flex-start" }} onClick={savePassword}><Icon name="lock" size={13}/> Update</button>
      </div>
    );
    if (active === "Appearance") return (
      <div className="sc-settings-section">
        <span className="sc-settings-title">Appearance</span>
        <div style={{ padding:"20px", background:"var(--db-bg)", borderRadius:"var(--db-r)", textAlign:"center", color:"var(--db-text2)", fontSize:13 }}>
          Light theme enabled — more options coming soon.
        </div>
      </div>
    );
  };

  return (
    <div className="sc-settings-layout">
      <div className="sc-settings-nav">
        {navSections.map(s => (
          <button key={s.key} className={`sc-settings-nav-item${active===s.key?" active":""}`} onClick={()=>setActive(s.key)}>
            <Icon name={s.icon} size={14}/> {s.key}
          </button>
        ))}
      </div>
      <div className="sc-settings-content">{renderContent()}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SIDEBAR NAV ITEMS
══════════════════════════════════════════ */
const NAV_ITEMS = [
  { label:"Dashboard",     icon:"grid",     section:"main" },
  { label:"Registrations", icon:"useradd",  section:"main" },
  { label:"Students",      icon:"users",    section:"main" },
  { label:"Teachers",      icon:"book",     section:"main" },
  { label:"Sections",      icon:"building", section:"main" },
  { label:"Schedule",      icon:"calendar", section:"main" },
  { label:"Payments",      icon:"credit",   section:"management", badge:"pay" },
  { label:"Absences",      icon:"file",     section:"management", badge:"abs" },
  { label:"Notifications", icon:"bell",     section:"management", badge:"notif" },
  { label:"Messaging",     icon:"mail",     section:"management", badge:"mail" },
  { label:"Settings",      icon:"settings", section:"account" },
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function SecretaryDashboard() {
  const [activeNav, setActiveNav]                 = useState("Dashboard");
  const [collapsed, setCollapsed]                 = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal]   = useState(false);
  const [toast, setToast]                         = useState(null);
  const [search, setSearch]                       = useState("");

  const currentUserId = localStorage.getItem("userId");
  const { notifications, unreadCount: notifUnreadCount, markRead, deleteOne } = useNotifications(currentUserId);

  useSocket(currentUserId, (event, data) => {
    switch (event) {
      case 'student:added':
        setPending(prev => [...prev, {
          id:       data._id,
          name:     `${data.prenom || ""} ${data.nom || ""}`.trim(),
          language: data.language  || "—",
          level:    data.level     || "A1",
          phone:    data.telephone || "—",
          email:    data.email,
          date:     new Date(data.createdAt).toLocaleDateString("en-US"),
        }]);
        showT("New registration received!");
        break;
      case 'payment:updated':
        setPayments(prev => prev.map(p =>
          p.id === data.id ? { ...p, status: data.status } : p
        ));
        break;
      case 'absence:marked':
        loadAll();
        break;
      case 'section:updated':
      case 'section:assigned':
        setSections(prev => prev.map(s =>
          s.id === data.id ? { ...s, ...data } : s
        ));
        break;
      case 'notification:new':
        setNotifs(prev => [data, ...prev]);
        showT(data.title || "New notification");
        break;
      default:
        break;
    }
  });

  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [pending,  setPending]  = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifs,   setNotifs]   = useState([]);
  const [emails,   setEmails]   = useState([]);

  const API = "http://localhost:5000/api";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const safeFetch = async (url, options = {}) => {
    const opts = {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {}),
      },
    };
    try {
      const res = await fetch(url, opts);
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("nom");
        localStorage.removeItem("prenom");
        localStorage.removeItem("userId");
        window.location.href = "/login";
        return null;
      }
      return res;
    } catch (err) {
      console.error("safeFetch error:", err);
      return null;
    }
  };

  const showT = msg => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const loadAll = async () => {
    try {
      const [resUsers, resPay, resSections, resNotifs, resMsgs] = await Promise.allSettled([
        safeFetch(`${API}/users/role/etudiant`),
        safeFetch(`${API}/payments`),
        safeFetch(`${API}/secretaire/sections`),
        safeFetch(`${API}/secretaire/notifications`),
        safeFetch(`${API}/secretaire/messages`),
      ]);

      if (resUsers.status === "fulfilled" && resUsers.value) {
        const dataS = await resUsers.value.json();
        if (dataS.success) {
          setStudents(dataS.users
            .filter(s => s.actif === true)
            .map(s => ({
              id:       s._id,
              name:     `${s.prenom || ""} ${s.nom || ""}`.trim(),
              section:  s.section   || "To assign",
              language: s.language  || "—",
              level:    s.level     || "A1",
              phone:    s.telephone || "—",
              email:    s.email,
              status:   "active",
              absences: s.absences  || 0,
            }))
          );
          setPending(dataS.users
            .filter(s => s.actif === false)
            .map(s => ({
              id:       s._id,
              name:     `${s.prenom || ""} ${s.nom || ""}`.trim(),
              language: s.language  || "—",
              level:    s.level     || "A1",
              phone:    s.telephone || "—",
              email:    s.email,
              date:     new Date(s.createdAt).toLocaleDateString("en-US"),
            }))
          );
        }
      }

      if (resPay.status === "fulfilled" && resPay.value) {
        const dataPay = await resPay.value.json();
        if (dataPay.success) {
          setPayments(dataPay.payments.map(p => ({
            id:      p.id      || p._id,
            name:    p.student || p.studentName || "—",
            amount:  p.amount,
            date:    new Date(p.due || p.createdAt).toLocaleDateString("en-US"),
            method:  p.method  || "Cash",
            status:  p.status,
            section: p.section || "—",
            month:   new Date(p.due || p.createdAt).toLocaleDateString("en-US", { month:"long", year:"numeric" }),
          })));
        }
      }

      if (resSections.status === "fulfilled" && resSections.value) {
        const dataSec = await resSections.value.json();
        if (dataSec.success) {
          setSections(dataSec.sections.map(s => ({
            id:       s._id || s.id,
            name:     s.name,
            language: s.language,
            level:    s.level,
            teacher:  s.teacher  || "—",
            students: s.students || s.studentsCount || 0,
            capacity: s.capacity || 12,
            time:     s.time     || "—",
            room:     s.room     || "—",
          })));
        }
      }

      if (resNotifs.status === "fulfilled" && resNotifs.value) {
        const dataN = await resNotifs.value.json();
        if (dataN.success) {
          setNotifs(dataN.notifications.map(n => ({
            id:    n.id || n._id,
            type:  n.type,
            icon:  n.icon  || "🔔",
            title: n.title,
            msg:   n.msg   || n.message,
            time:  n.time,
            tag:   n.tag   || n.type,
            read:  n.read,
          })));
        }
      }

      if (resMsgs.status === "fulfilled" && resMsgs.value) {
        const dataM = await resMsgs.value.json();
        if (dataM.success) {
          setEmails(dataM.messages.map(m => ({
            id:      m.id || m._id,
            from:    m.from,
            avatar:  m.avatar || initials(m.from || ""),
            subject: m.subject,
            preview: m.preview || (m.body || "").slice(0, 80) + "…",
            time:    m.time,
            read:    m.read,
            starred: m.starred || false,
            tag:     m.tag     || "sys",
            body:    m.body,
          })));
        }
      }

    } catch (err) {
      console.error("loadAll error:", err);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const unreadNotif = notifs.filter(n=>!n.read).length;
  const unreadMail  = emails.filter(e=>!e.read).length;
  const unpaidCount = payments.filter(p=>p.status!=="paid").length;

  const getBadge = item => {
    if (item.badge==="pay")   return unpaidCount;
    if (item.badge==="abs")   return 0;
    if (item.badge==="notif") return unreadNotif;
    if (item.badge==="mail")  return unreadMail;
    return 0;
  };

  const sharedProps = { API, safeFetch, showT };

  const renderView = () => {
    switch (activeNav) {
      case "Students":
        return <StudentsView {...sharedProps}/>;
      case "Teachers":
        return <TeachersView {...sharedProps}/>;
      case "Registrations":
        return <RegistrationsView students={students} pending={pending} sections={sections} showRegister={()=>setShowRegisterModal(true)} loadAll={loadAll} {...sharedProps}/>;
      case "Sections":
        return <SectionsView sections={sections} setSections={setSections} loadAll={loadAll} {...sharedProps}/>;
      case "Schedule":
        return <TimetableView sections={sections} {...sharedProps}/>;
      case "Payments":
        return <PaymentsView payments={payments} setPayments={setPayments} students={students} showPayment={()=>setShowPaymentModal(true)} {...sharedProps}/>;
      case "Absences":
        return <AbsencesView students={students} {...sharedProps}/>;
      case "Notifications":
        return <NotificationsView notifs={notifs} setNotifs={setNotifs} {...sharedProps}/>;
      case "Messaging":
        return <InboxView emails={emails} setEmails={setEmails} {...sharedProps}/>;
      case "Settings":
        return <SettingsView {...sharedProps}/>;
      default:
        return (
          <DashboardView
            sections={sections} pending={pending} setPending={setPending}
            payments={payments} students={students} setActiveNav={setActiveNav}
            showRegister={() => setShowRegisterModal(true)}
            showPayment={() => setShowPaymentModal(true)}
            loadAll={loadAll}
            getHeaders={getHeaders}
            {...sharedProps}
          />
        );
    }
  };

  return (
    <div className={`sc-layout${collapsed?" sc-collapsed":""}`}>
      {/* SIDEBAR */}
      <aside className="sc-sidebar">
        <div className="sc-logo">
          <div className="sc-logo-icon">
            <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          {!collapsed && <div className="sc-logo-text"><h2>Language</h2><span>Secretariat</span></div>}
        </div>
        <button className="sc-toggle" onClick={() => setCollapsed(c=>!c)}>{collapsed?"›":"‹"}</button>
        {!collapsed && (
          <div className="sc-profile-mini">
            <div className="sc-avatar-sm">MB</div>
            <div><span className="sc-pname">Mohammed B.</span><span className="sc-prole">Secretary</span></div>
          </div>
        )}
        <nav className="sc-nav">
          {["main","management","account"].map(sec => (
            <React.Fragment key={sec}>
              {!collapsed && <span className="sc-nav-label">{sec==="main"?"Main":sec==="management"?"Management":"Account"}</span>}
              {NAV_ITEMS.filter(n=>n.section===sec).map(n => {
                const bdg = getBadge(n);
                return (
                  <button key={n.label} className={`sc-nav-item${activeNav===n.label?" sc-nav-active":""}`} onClick={()=>setActiveNav(n.label)}>
                    <span className="sc-nav-icon"><Icon name={n.icon} size={15}/></span>
                    {!collapsed && (
                      <span className="sc-nav-text">
                        {n.label}
                        {bdg > 0 && <span className="sc-notif-badge">{bdg}</span>}
                      </span>
                    )}
                    {collapsed && bdg > 0 && <span className="sc-notif-dot-col"/>}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </nav>
        <div className="sc-sidebar-bottom">
          <button className="sc-nav-item sc-nav-danger" onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("nom");
            localStorage.removeItem("prenom");
            localStorage.removeItem("userId");
            window.location.href = "/login";
          }}>
            <span className="sc-nav-icon"><Icon name="logout" size={15}/></span>
            {!collapsed && <span className="sc-nav-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="sc-main">
        <header className="sc-header">
          <div className="sc-header-left">
            <div className="sc-header-title">{activeNav}</div>
            <span className="sc-header-sub">Spring Semester 2026</span>
          </div>
          <div className="sc-search">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search for a student, a section…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="sc-header-right">
            <button className="sc-btn-primary sc-btn-sm" onClick={()=>setShowRegisterModal(true)}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:4 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Register
            </button>
            <button className="sc-icon-btn" title="Messaging" onClick={()=>setActiveNav("Messaging")}>
              <Icon name="mail" size={17}/>
              {unreadMail > 0 && <span className="sc-badge"/>}
            </button>
            <button className="sc-icon-btn" title="Notifications" onClick={()=>setActiveNav("Notifications")}>
              <Icon name="bell" size={17}/>
              {unreadNotif > 0 && <span className="sc-badge"/>}
            </button>
            <div className="sc-profile-chip" onClick={()=>setActiveNav("Settings")}>
              <div className="sc-avatar">MB</div>
              <div><span className="sc-pname">Mohammed B.</span><span className="sc-prole">Secretary</span></div>
            </div>
          </div>
        </header>
        <main className="sc-content">{renderView()}</main>
      </div>

      {/* REGISTER MODAL */}
      {showRegisterModal && (
        <RegisterModal
          sections={sections}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={async (student) => {
            try {
              const res = await safeFetch(`${API}/secretaire/students/register`, {
                method: "POST",
                body: JSON.stringify({
                  nom:       student.name.split(" ")[0],
                  prenom:    student.name.split(" ")[1] || "",
                  email:     student.email,
                  telephone: student.phone,
                  language:  student.language,
                  level:     student.level,
                  section:   student.section,
                  password:  "student123",
                }),
              });
              if (!res) return;
              const data = await res.json();
              if (data.success) { await loadAll(); showT("Registration recorded as pending."); }
              else showT(`Error: ${data.message}`);
            } catch (err) { console.error(err); showT("Connection error."); }
          }}
        />
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <PaymentModal
          students={students}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async (payment) => {
            try {
              const student = students.find(s => s.name === payment.name);
              const res = await safeFetch(`${API}/payments`, {
                method: "POST",
                body: JSON.stringify({
                  studentId:   student?.id,
                  studentName: payment.name,
                  language:    student?.language,
                  level:       student?.level,
                  amount:      payment.amount,
                  due:         new Date().toISOString(),
                  method:      payment.method,
                }),
              });
              if (!res) return;
              const data = await res.json();
              if (data.success) { await loadAll(); showT(`Payment of ${payment.amount.toLocaleString()} DA recorded.`); }
              else showT(`Error: ${data.message}`);
            } catch (err) { console.error(err); showT("Connection error."); }
          }}
        />
      )}

      {toast && <Toast msg={toast}/>}
    </div>
  );
}