import React, { useState, useEffect, useCallback } from "react";
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
const DAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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
      {tip && <div className="sc-tooltip" style={{ left: tip.x+12, top: tip.y-40 }}><strong>{tip.k==="paid"?"Paid":"Unpaid"}</strong> {tip.month}: {tip.val} students</div>}
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
        <text x={cx} y={cy+12} textAnchor="middle" fontSize="10" fill="#5A6478">Paid rate</text>
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
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fname:"", lname:"", phone:"", email:"", language:"", level:"", section:"" });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const available = sections.filter(s => s.students < s.capacity);
  const submit = () => {
    if (!form.fname || !form.lname) return;
    onSuccess({ name: `${form.lname} ${form.fname}`, language: form.language, level: form.level, phone: form.phone, email: form.email, section: form.section });
    onClose();
  };
  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal" onClick={e => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div><span className="sc-modal-title">New registration</span><span className="sc-modal-sub">Step {step} / 2</span></div>
          <button className="sc-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="sc-modal-steps">
          <div className={`sc-step-dot${step >= 1 ? " active" : ""}`}>1</div>
          <div className="sc-step-line"/>
          <div className={`sc-step-dot${step >= 2 ? " active" : ""}`}>2</div>
        </div>
        {step === 1 && (
          <div className="sc-modal-body">
            <div className="sc-form-row">
              <div className="sc-field"><label>First name</label><input className="sc-input" placeholder="Mohammed" value={form.fname} onChange={e => upd("fname", e.target.value)}/></div>
              <div className="sc-field"><label>Last name</label><input className="sc-input" placeholder="Bouchemot" value={form.lname} onChange={e => upd("lname", e.target.value)}/></div>
            </div>
            <div className="sc-field">
              <label>Phone</label>
              <input
                className="sc-input"
                placeholder="0600000000"
                maxLength={10}
                value={form.phone}
                onChange={e => upd("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>
            <div className="sc-field"><label>Email</label><input className="sc-input" type="email" placeholder="student@mail.com" value={form.email} onChange={e => upd("email", e.target.value)}/></div>
          </div>
        )}
        {step === 2 && (
          <div className="sc-modal-body">
            <div className="sc-form-row">
              <div className="sc-field"><label>Language</label>
                <select className="sc-select" value={form.language} onChange={e => upd("language", e.target.value)} style={{ width:"100%" }}>
                  <option value="">Choose…</option>
                  {["English","French","Spanish","German","Mandarin"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="sc-field"><label>Level</label>
                <select className="sc-select" value={form.level} onChange={e => upd("level", e.target.value)} style={{ width:"100%" }}>
                  <option value="">Choose…</option>
                  {["A1","A2","B1","B2","C1","C2"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="sc-field"><label>Section</label>
              <select className="sc-select" value={form.section} onChange={e => upd("section", e.target.value)} style={{ width:"100%" }}>
                <option value="">Choose a section…</option>
                {available.map(s => <option key={s.name}>{s.name} — {s.language} {s.level} ({s.capacity-s.students} spots)</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="sc-modal-footer">
          {step > 1 && <button className="sc-btn-ghost" onClick={() => setStep(s=>s-1)}>← Back</button>}
          {step < 2 && <button className="sc-btn-primary" onClick={() => setStep(s=>s+1)}>Next →</button>}
          {step === 2 && <button className="sc-btn-primary" onClick={submit}>✓ Register</button>}
        </div>
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
          <div><span className="sc-modal-title">Record a payment</span><span className="sc-modal-sub">New transaction</span></div>
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
              {["Cash","CCP","Bank transfer","Check"].map(m => <option key={m}>{m}</option>)}
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
  const total    = useCountUp(students.length + pending.length);
  const paid     = useCountUp(payments.filter(p => p.status === "paid").length);
  const unpaid   = useCountUp(payments.filter(p => p.status !== "paid").length);
  const sectCount= useCountUp(sections.length);
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
        <StatCard icon="users"    label="Total students"    value={total}     delta="+8 this month" accent="#1A6CC4"/>
        <StatCard icon="credit"   label="Payments received" value={paid}      delta="Paid"           accent="#2D7A3A"/>
        <StatCard icon="warning"  label="Unpaid"            value={unpaid}    delta="To follow up"   neg accent="#C0352A"/>
        <StatCard icon="building" label="Active sections"   value={sectCount} delta="5 languages"    accent="#97C459"/>
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
                { label:"Register a student",  desc:"New registration",   icon:"useradd",  action: () => showRegister() },
                { label:"Record a payment",    desc:"Payment receipt",    icon:"credit",   action: () => showPayment() },
                { label:"View absences",       desc:"Daily report",       icon:"file",     action: () => setActiveNav("Absences") },
                { label:"Timetable",           desc:"Course schedule",    icon:"calendar", action: () => setActiveNav("Timetable") },
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
            <div><span className="sc-pt">Sections & occupancy</span><span className="sc-ps">Capacity per section</span></div>
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
              <div><span className="sc-pt">Pending registrations</span><span className="sc-ps">{pending.length} to validate</span></div>
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
            <div className="sc-ph"><div><span className="sc-pt">Latest payments</span><span className="sc-ps">5 recent transactions</span></div></div>
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
function InscriptionsView({ students, pending, sections, showRegister, API, safeFetch, loadAll, showT }) {
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
          <div><span className="sc-pt">Pending registrations</span><span className="sc-ps">{pending.length} requests to validate</span></div>
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
          <div><span className="sc-pt">All students</span><span className="sc-ps">{filtered.length} students</span></div>
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
function EtudiantsView({ API, safeFetch, showT }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [search, setSearch]    = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [tab, setTab] = useState("active");
  const [archived, setArchived] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);
  const [profileStudentId, setProfileStudentId] = useState(null);

  const loadArchived = async () => {
    setArchivedLoading(true);
    try {
      const res = await safeFetch(`${API}/users/archived?role=etudiant`);
      if (!res) return;
      const data = await res.json();
      if (data.success) setArchived(data.users || []);
    } catch (err) { console.error(err); }
    finally { setArchivedLoading(false); }
  };

  const restoreStudent = async (id) => {
    try {
      const res = await safeFetch(`${API}/users/${id}/restore`, { method: "PATCH" });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setArchived(prev => prev.filter(s => s._id !== id));
        showT("Student restored!");
        const r = await safeFetch(`${API}/users/role/etudiant`);
        if (!r) return;
        const d = await r.json();
        if (d.success) setStudents(d.users);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (tab === "archived" && archived.length === 0) loadArchived();
  }, [tab, archived.length]);

  useEffect(() => {
    safeFetch(`${API}/users/role/etudiant`)
      .then(r => r?.json())
      .then(data => { if (data?.success) setStudents(data.users); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const levels  = ["All", "A1", "A2", "B1", "B2", "C1", "C2"];
  const filtered = students.filter(s => {
    const name   = `${s.prenom || ""} ${s.nom || ""}`.toLowerCase();
    const ms     = !search || name.includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase());
    const ml     = filterLevel  === "All" || s.level === filterLevel;
    const mst    = filterStatus === "All" || (filterStatus === "Active" ? s.actif : !s.actif);
    return ms && ml && mst;
  });

  const total  = students.length;
  const actifs = students.filter(s => s.actif).length;

  const tabBtnStyle = (key) => ({
    padding: "6px 16px",
    borderRadius: "var(--db-r,8px)",
    border: "1px solid var(--db-border,#e5e7eb)",
    fontSize: 12,
    fontWeight: tab === key ? 600 : 400,
    cursor: "pointer",
    background: tab === key ? "#1A6CC4" : "transparent",
    color: tab === key ? "#fff" : "var(--db-text2,#666)",
    transition: "all 0.2s",
  });

  return (
    <>
      {profileStudentId && (
        <StudentProfileModal
          studentId={profileStudentId}
          onClose={() => setProfileStudentId(null)}
          onArchived={(id) => {
            setStudents(prev => prev.filter(s => s._id !== id));
            setProfileStudentId(null);
            showT("Student archived.");
          }}
          API={API}
          safeFetch={safeFetch}
        />
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab("active")} style={tabBtnStyle("active")}>Active</button>
        <button onClick={() => setTab("archived")} style={tabBtnStyle("archived")}>
          Archived {archived.length > 0 && <span style={{ marginLeft:4, background:"rgba(255,255,255,0.3)", borderRadius:10, padding:"1px 6px", fontSize:11 }}>{archived.length}</span>}
        </button>
      </div>

      {tab === "archived" && (
        <div className="sc-panel">
          <div className="sc-ph">
            <div><span className="sc-pt">Archived students</span><span className="sc-ps">{archived.length} archived</span></div>
          </div>
          {archivedLoading ? (
            <div className="sc-empty-state">Loading…</div>
          ) : (
            <table className="sc-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Language</th><th>Level</th><th>Registration date</th><th></th></tr>
              </thead>
              <tbody>
                {archived.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign:"center", padding:"2rem", color:"var(--db-text3)", fontSize:13 }}>No archived students.</td></tr>
                )}
                {archived.map(s => {
                  const name = `${s.prenom || ""} ${s.nom || ""}`.trim();
                  return (
                    <tr key={s._id}>
                      <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(name)}</div><strong>{name}</strong></div></td>
                      <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.email || "—"}</td>
                      <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.telephone || "—"}</td>
                      <td style={{ fontSize:12 }}>{s.language || "—"}</td>
                      <td>{s.level ? <span className={`sc-lvl ${levelCls(s.level)}`}>{s.level}</span> : "—"}</td>
                      <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-GB") : "—"}</td>
                      <td>
                        <button
                          style={{ padding:"4px 12px", borderRadius:"var(--db-r,8px)", border:"1px solid #2D7A3A", background:"#E8F5EC", color:"#2D7A3A", fontSize:11, fontWeight:600, cursor:"pointer" }}
                          onClick={() => restoreStudent(s._id)}
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "active" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:4 }}>
            {[
              { lbl:"Total students", val: total,         color:"#1A6CC4" },
              { lbl:"Active",         val: actifs,         color:"#2D7A3A" },
              { lbl:"Pending",        val: total - actifs, color:"#C0352A" },
            ].map(c => (
              <div className="sc-panel" key={c.lbl} style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>{c.lbl}</div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:600, color:c.color }}>{c.val}</div>
              </div>
            ))}
          </div>
          <div className="sc-panel">
            <div className="sc-ph">
              <div><span className="sc-pt">Student list</span><span className="sc-ps">{filtered.length} results</span></div>
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
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Phone</th><th>Section</th>
                    <th>Language</th><th>Level</th><th>Absences</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const name = `${s.prenom || ""} ${s.nom || ""}`.trim();
                    return (
                      <tr
                        key={s._id}
                        style={{ cursor: "pointer" }}
                        onClick={() => setProfileStudentId(s._id)}
                      >
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
      )}
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
  const [tab, setTab] = useState("active");
  const [archived, setArchived] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);

  const loadArchived = async () => {
    setArchivedLoading(true);
    try {
      const res = await safeFetch(`${API}/users/archived?role=professeur`);
      if (!res) return;
      const data = await res.json();
      if (data.success) setArchived(data.users || []);
    } catch (err) { console.error(err); }
    finally { setArchivedLoading(false); }
  };

  const restoreTeacher = async (id) => {
    try {
      const res = await safeFetch(`${API}/users/${id}/restore`, { method: "PATCH" });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setArchived(prev => prev.filter(t => t._id !== id));
        showT("Teacher restored!");
        const r = await safeFetch(`${API}/users/role/professeur`);
        if (!r) return;
        const d = await r.json();
        if (d.success) setTeachers(d.users);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (tab === "archived" && archived.length === 0) loadArchived();
  }, [tab]);

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
  const actifs = teachers.filter(t => t.actif).length;

  const tabBtnStyle = (key) => ({
    padding: "6px 16px",
    borderRadius: "var(--db-r,8px)",
    border: "1px solid var(--db-border,#e5e7eb)",
    fontSize: 12,
    fontWeight: tab === key ? 600 : 400,
    cursor: "pointer",
    background: tab === key ? "#2D7A3A" : "transparent",
    color: tab === key ? "#fff" : "var(--db-text2,#666)",
    transition: "all 0.2s",
  });

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab("active")} style={tabBtnStyle("active")}>Active</button>
        <button onClick={() => setTab("archived")} style={tabBtnStyle("archived")}>
          Archived {archived.length > 0 && <span style={{ marginLeft:4, background:"rgba(255,255,255,0.3)", borderRadius:10, padding:"1px 6px", fontSize:11 }}>{archived.length}</span>}
        </button>
      </div>

      {tab === "archived" && (
        <div className="sc-panel">
          <div className="sc-ph">
            <div><span className="sc-pt">Archived teachers</span><span className="sc-ps">{archived.length} archived</span></div>
          </div>
          {archivedLoading ? (
            <div className="sc-empty-state">Loading…</div>
          ) : (
            <table className="sc-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Specialty</th><th>Registration date</th><th></th></tr>
              </thead>
              <tbody>
                {archived.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign:"center", padding:"2rem", color:"var(--db-text3)", fontSize:13 }}>No archived teachers.</td></tr>
                )}
                {archived.map(t => {
                  const name = `${t.prenom || ""} ${t.nom || ""}`.trim();
                  return (
                    <tr key={t._id}>
                      <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(name)}</div><strong>{name}</strong></div></td>
                      <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.email || "—"}</td>
                      <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.telephone || "—"}</td>
                      <td style={{ fontSize:12 }}>{t.specialty || "—"}</td>
                      <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB") : "—"}</td>
                      <td>
                        <button
                          style={{ padding:"4px 12px", borderRadius:"var(--db-r,8px)", border:"1px solid #2D7A3A", background:"#E8F5EC", color:"#2D7A3A", fontSize:11, fontWeight:600, cursor:"pointer" }}
                          onClick={() => restoreTeacher(t._id)}
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "active" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:4 }}>
            {[
              { lbl:"Total teachers", val: total,         color:"#1A6CC4" },
              { lbl:"Active",         val: actifs,         color:"#2D7A3A" },
              { lbl:"Archived",       val: total - actifs, color:"#C0352A" },
            ].map(c => (
              <div className="sc-panel" key={c.lbl} style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>{c.lbl}</div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:600, color:c.color }}>{c.val}</div>
              </div>
            ))}
          </div>
          <div className="sc-panel">
            <div className="sc-ph">
              <div><span className="sc-pt">Teacher list</span><span className="sc-ps">{filtered.length} results</span></div>
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
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Specialty</th><th>Registration date</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map(t => {
                    const name = `${t.prenom || ""} ${t.nom || ""}`.trim();
                    const date = t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB") : "—";
                    return (
                      <tr key={t._id}>
                        <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(name)}</div><strong>{name}</strong></div></td>
                        <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.email || "—"}</td>
                        <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.telephone || "—"}</td>
                        <td style={{ fontSize:12 }}>{t.specialty || "—"}</td>
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
      )}
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
  const [sectionStudentsModal, setSectionStudentsModal] = useState(null);
  const [sectionStudentsList, setSectionStudentsList] = useState([]);
  const [sectionStudentsLoading, setSectionStudentsLoading] = useState(false);

  const openSectionStudents = async (section) => {
    setSectionStudentsModal(section);
    setSectionStudentsList([]);
    setSectionStudentsLoading(true);
    try {
      const res = await safeFetch(`${API}/sections/${section.id}/students`);
      if (!res) return;
      const data = await res.json();
      if (data.success) setSectionStudentsList(data.students || []);
    } catch (err) { console.error(err); }
    finally { setSectionStudentsLoading(false); }
  };

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
        <div><span className="sc-pt">Section management</span><span className="sc-ps">{sections.length} active sections</span></div>
        <button className="sc-add-btn" onClick={() => setShowAdd(s=>!s)}><Icon name="plus" size={13}/> New section</button>
      </div>

      {showAdd && (
        <div style={{ background:"var(--db-bg)", border:"var(--db-border)", borderRadius:"var(--db-r)", padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:12 }}>
          <div className="sc-form-row">
            <div className="sc-field"><label>Section name</label><input className="sc-input" placeholder="Section F" value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))}/></div>
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
          <div className="sc-field"><label>Available teacher</label>
            <select className="sc-select" style={{ width:"100%" }} value={form.teacherId} onChange={e => {
              const t = availableTeachers.find(t => t.id === e.target.value);
              setForm(f=>({...f, teacherId: e.target.value, teacher: t?.name || ""}));
            }}>
              <option value="">— Choose a teacher —</option>
              {availableTeachers.length === 0 && <option disabled>No teacher available</option>}
              {availableTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="sc-field"><label>Available room</label>
            <select className="sc-select" style={{ width:"100%" }} value={form.room} onChange={e => setForm(f=>({...f, room:e.target.value}))}>
              <option value="">— Choose a room —</option>
              {availableRooms.map(r => (
                <option key={r} value={r} disabled={usedRooms.includes(r)} style={{ color: usedRooms.includes(r) ? "#aaa" : "inherit" }}>
                  {r}{usedRooms.includes(r) ? " — occupied" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="sc-field"><label>Time slot</label>
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
              <td>
                <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                  <button
                    title="View students"
                    style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:"var(--db-r,8px)", border:"1px solid #1A6CC440", background:"#EBF4FF", color:"#1A6CC4", fontSize:11, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}
                    onClick={() => openSectionStudents(s)}
                  >
                    <Icon name="users" size={11}/> {s.students}
                  </button>
                  <button className="sc-icon-row-btn" onClick={() => deleteSection(s.id, s.name)}><Icon name="trash" size={13}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sectionStudentsModal && (
        <div
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={e => e.target === e.currentTarget && setSectionStudentsModal(null)}
        >
          <div style={{ background:"var(--db-card,#fff)", borderRadius:"var(--db-r,8px)", boxShadow:"0 8px 32px rgba(0,0,0,0.18)", width:"100%", maxWidth:520, overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--db-border,#e5e7eb)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:"var(--db-text)" }}>{sectionStudentsModal.name}</div>
                <div style={{ fontSize:12, color:"var(--db-text2)", marginTop:2 }}>
                  {sectionStudentsModal.language} · {sectionStudentsModal.level} · {sectionStudentsModal.students}/{sectionStudentsModal.capacity} students
                </div>
                <div style={{ fontSize:11, color:"var(--db-text3)", marginTop:4, display:"flex", gap:10 }}>
                  <span>👤 {sectionStudentsModal.teacher}</span>
                  <span>📅 {sectionStudentsModal.time}</span>
                  <span>🚪 {sectionStudentsModal.room}</span>
                </div>
              </div>
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--db-text3)", lineHeight:1 }} onClick={() => setSectionStudentsModal(null)}>✕</button>
            </div>
            <div style={{ maxHeight:360, overflowY:"auto" }}>
              {sectionStudentsLoading ? (
                <div className="sc-empty-state">Loading…</div>
              ) : sectionStudentsList.length === 0 ? (
                <div className="sc-empty-state">No students enrolled in this section.</div>
              ) : (
                <table className="sc-table">
                  <thead><tr><th>Name</th><th>Level</th><th>Phone</th><th>Absences</th><th>Status</th></tr></thead>
                  <tbody>
                    {sectionStudentsList.map(s => {
                      const name = `${s.prenom || ""} ${s.nom || ""}`.trim() || s.email;
                      return (
                        <tr key={s._id || s.id}>
                          <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(name)}</div><strong>{name}</strong></div></td>
                          <td>{s.level ? <span className={`sc-lvl ${levelCls(s.level)}`}>{s.level}</span> : "—"}</td>
                          <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.telephone || "—"}</td>
                          <td><span style={{ fontSize:12, fontWeight:600, color:(s.absences||0)>=8?"#C0352A":(s.absences||0)>=4?"#7A4A0A":"#2D7A3A" }}>{s.absences||0}</span></td>
                          <td><span className={`sc-status ${s.actif?"sc-st-ok":"sc-st-pend"}`}><span className="sc-dot"/> {s.actif?"Active":"Pending"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ padding:"12px 20px", borderTop:"1px solid var(--db-border,#e5e7eb)", display:"flex", justifyContent:"flex-end" }}>
              <button className="sc-btn-ghost" onClick={() => setSectionStudentsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
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
  const rawDay = d.getDay();
  const di = rawDay === 0 ? 6 : rawDay - 1;
  const label = offset===0?"Today":offset===-1?"Yesterday":offset===1?"Tomorrow":DAYS_EN[rawDay];

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
        <div><span className="sc-pt">Timetable</span><span className="sc-ps">{label} — {DAYS_EN[rawDay]}</span></div>
        <div style={{ display:"flex", gap:6 }}>
          <button className="sc-arr-btn" onClick={() => setOffset(o=>o-1)}>‹ Prev.</button>
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
            <div className="sc-field"><label>Start time</label><input className="sc-input" placeholder="08:00" value={form.startTime} onChange={e => setForm(f=>({...f,startTime:e.target.value}))}/></div>
            <div className="sc-field"><label>End time</label><input className="sc-input" placeholder="09:30" value={form.endTime} onChange={e => setForm(f=>({...f,endTime:e.target.value}))}/></div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button className="sc-btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="sc-btn-primary" onClick={addEntry}><Icon name="check" size={13}/> Save</button>
          </div>
        </div>
      )}
      {loading && <div className="sc-empty-state">Loading…</div>}
      {!loading && rows.length === 0 && <div className="sc-empty-state">No classes scheduled for {DAYS_EN[rawDay]}</div>}
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
   STUDENT PROFILE MODAL
══════════════════════════════════════════ */
function StudentProfileModal({ studentId, onClose, onArchived, API, safeFetch }) {
  const [student, setStudent] = useState(null);
  const [sections, setSections] = useState([]);
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    const fetchFn = (path) =>
      safeFetch(`${API}${path}`).then(r => r?.json());

    const load = async () => {
      try {
        const [profileData, sectionsData] = await Promise.all([
          fetchFn(`/users/${studentId}/profile`),
          fetchFn(`/users/${studentId}/sections`),
        ]);
        if (profileData?.success) setStudent(profileData.student);
        if (sectionsData?.success) {
          setSections(sectionsData.sections || []);
          if (sectionsData.sections?.length > 0) {
            const cm = await fetchFn(`/sections/${sectionsData.sections[0].id}/students`);
            if (cm?.success)
              setClassmates((cm.students || []).filter(s => (s._id || s.id) !== studentId));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  const handleArchive = async () => {
    try {
      const res = await safeFetch(`${API}/users/${studentId}/archive`, { method: "PATCH" });
      const data = await res?.json();
      if (data?.success) {
        if (onArchived) onArchived(studentId);
        onClose();
      }
    } catch (err) { console.error(err); }
  };

  const ini = name =>
    (name || "??").split(" ").map(n => n[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
  const lvCls = lvl => {
    const c = (lvl?.[0] || "a").toLowerCase();
    return c === "a" ? "db-lv-a" : c === "b" ? "db-lv-b" : "db-lv-c";
  };
  const fmtDate = d =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const TABS = [
    { key: "info", label: "Info" },
    { key: "courses", label: "Courses" },
    { key: "classmates", label: "Classmates" },
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
        zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "var(--db-card,#fff)", borderRadius: "var(--db-r,12px)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.18)", width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "20px 20px 0", borderBottom: "1px solid var(--db-border,#e5e7eb)" }}>
          {loading ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "var(--db-text3)", fontSize: 13 }}>
              Loading…
            </div>
          ) : student ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg,#1A6CC4,#185FA5)",
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0,
                }}>
                  {ini(student.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "var(--db-text,#111)", marginBottom: 4 }}>
                    {student.name}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    {student.level && (
                      <span className={`sc-lvl ${lvCls(student.level)}`}>{student.level}</span>
                    )}
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                      background: student.status === "active" ? "#EAF3DE" : "#FAEEDA",
                      color: student.status === "active" ? "#2D7A3A" : "#633806",
                    }}>
                      <span style={{
                        display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                        marginRight: 4, verticalAlign: "middle",
                        background: student.status === "active" ? "#2D7A3A" : "#B45309",
                      }} />
                      {student.status === "active" ? "Active" : "Pending"}
                    </span>
                  </div>
                </div>
                <button
                  title="Archive"
                  onClick={() => setConfirm(true)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--db-text3)", padding: 6, borderRadius: 8, transition: "all .2s", flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#C0352A"; e.currentTarget.style.background = "#FCEBEB"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--db-text3)"; e.currentTarget.style.background = "none"; }}
                >
                  <Icon name="trash" size={15} />
                </button>
                <button
                  onClick={onClose}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--db-text3)", fontSize: 18, lineHeight: 1, padding: 4, flexShrink: 0 }}
                >✕</button>
              </div>
              <div style={{ display: "flex" }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                    padding: "8px 16px", fontSize: 13,
                    fontWeight: activeTab === t.key ? 600 : 400,
                    color: activeTab === t.key ? "#1A6CC4" : "var(--db-text2,#6b7280)",
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: activeTab === t.key ? "2px solid #1A6CC4" : "2px solid transparent",
                    transition: "all .15s",
                  }}>{t.label}</button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: "16px 0", textAlign: "center", color: "var(--db-text3)", fontSize: 13 }}>
              Student not found.
            </div>
          )}
        </div>

        {!loading && student && (
          <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1 }}>
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Email",           student.email    || "—"],
                  ["Phone",           student.phone    || "—"],
                  ["Language",        student.language || "—"],
                  ["Level",           student.level    || "—"],
                  ["Schedule",        student.schedule || "—"],
                  ["Absences",        student.absences ?? 0],
                  ["Registered on",   fmtDate(student.createdAt)],
                  ["Notes",           student.notes    || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "9px 12px",
                    background: "var(--db-bg,#f9fafb)",
                    borderRadius: "var(--db-r,8px)",
                  }}>
                    <span style={{ fontSize: 12, color: "var(--db-text3)", minWidth: 100, fontWeight: 500 }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: 13,
                      fontWeight: label === "Absences" ? 700 : 400,
                      color: label === "Absences"
                        ? (student.absences >= 8 ? "#C0352A" : student.absences >= 4 ? "#7A4A0A" : "#2D7A3A")
                        : "var(--db-text,#111)",
                    }}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "courses" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sections.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--db-text3)", fontSize: 13 }}>
                    No section assigned.
                  </div>
                ) : sections.map(sec => (
                  <div key={sec.id} style={{
                    padding: "12px 14px",
                    background: "var(--db-bg,#f9fafb)",
                    border: "1px solid var(--db-border,#e5e7eb)",
                    borderLeft: "3px solid #1A6CC4",
                    borderRadius: "var(--db-r,8px)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{sec.name}</span>
                      <span className={`sc-lvl ${lvCls(sec.level)}`}>{sec.level}</span>
                    </div>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {[["Language", sec.language], ["Teacher", sec.teacher], ["Schedule", sec.time], ["Room", sec.room]].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontSize: 10, color: "var(--db-text3)", textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{v || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "classmates" && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {classmates.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--db-text3)", fontSize: 13 }}>
                    No classmates found.
                  </div>
                ) : classmates.map((c, idx) => {
                  const name = `${c.prenom || ""} ${c.nom || ""}`.trim() || c.email;
                  return (
                    <div key={c._id || idx} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                      borderBottom: idx < classmates.length - 1 ? "1px solid var(--db-border,#e5e7eb)" : "none",
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "linear-gradient(135deg,#1A6CC4,#185FA5)",
                        color: "#fff", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                      }}>
                        {ini(name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--db-text)" }}>{name}</div>
                        <div style={{ fontSize: 11, color: "var(--db-text3)" }}>
                          Registered on {fmtDate(c.createdAt)}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                        background: c.actif ? "#EAF3DE" : "#FAEEDA",
                        color: c.actif ? "#2D7A3A" : "#633806",
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

        {!loading && student && (
          <div style={{
            padding: "12px 20px", borderTop: "1px solid var(--db-border,#e5e7eb)",
            display: "flex", justifyContent: "flex-end",
          }}>
            <button onClick={onClose} style={{
              padding: "7px 18px", borderRadius: "var(--db-r,8px)", fontSize: 13,
              fontWeight: 500, cursor: "pointer",
              background: "var(--db-bg,#f3f4f6)", color: "var(--db-text2,#6b7280)",
              border: "1px solid var(--db-border,#e5e7eb)",
            }}>
              Close
            </button>
          </div>
        )}
      </div>

      {confirm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => e.target === e.currentTarget && setConfirm(false)}
        >
          <div style={{ background: "var(--db-card,#fff)", borderRadius: "var(--db-r,12px)", padding: 24, maxWidth: 360, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "var(--db-text)" }}>⚠️ Archive student</div>
            <p style={{ fontSize: 13, color: "var(--db-text2)", marginBottom: 20 }}>
              Archive {student?.name}? This action can be undone by an administrator.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirm(false)} style={{ padding: "7px 16px", borderRadius: "var(--db-r,8px)", border: "1px solid var(--db-border,#e5e7eb)", background: "transparent", cursor: "pointer", fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={handleArchive} style={{ padding: "7px 16px", borderRadius: "var(--db-r,8px)", border: "none", background: "#A32D2D", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   PAYMENTS VIEW
══════════════════════════════════════════ */
function PaiementsView({ payments, setPayments, students, showPayment, API, safeFetch, showT }) {
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
    const p = payments.find(x => x.id === id);
    try {
      const res = await safeFetch(`${API}/payments/${id}/pay`, {
        method: "PATCH",
        body: JSON.stringify({ method: p?.method || "Cash" }),
      });
      if (!res) return;
      const data = await res.json();
      if (data.success)
        setPayments(ps => ps.map(x => x.id === id ? { ...x, status: "paid" } : x));
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
          { lbl:"Total collected", val:`${totalPaid.toLocaleString()} DA`,   sub:`${payments.filter(p=>p.status==="paid").length} payments`,   color:"#2D7A3A" },
          { lbl:"Unpaid",          val:`${totalUnpaid.toLocaleString()} DA`, sub:`${payments.filter(p=>p.status!=="paid").length} payments`,    color:"#C0352A" },
          { lbl:"Total expected",  val:`${totalAll.toLocaleString()} DA`,    sub:`${payments.length} transactions`,                             color:"#1A6CC4" },
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
          <div><span className="sc-pt">Payment history</span><span className="sc-ps">{filtered.length} transactions</span></div>
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
          <div><span className="sc-pt">Absence register</span><span className="sc-ps">{filtered.length} absences</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:140 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterSec} onChange={e => setFilterSec(e.target.value)}>
              <option>All</option>
              {[...new Set(absences.map(a=>a.section).filter(Boolean))].map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="sc-btn-primary sc-btn-sm" onClick={() => setShowForm(f=>!f)}><Icon name="plus" size={13}/> Record</button>
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
                  <td style={{ fontSize:12 }}>{new Date(a.date).toLocaleDateString("en-GB")}</td>
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
          <span style={{ fontSize:12, color:"var(--db-text2)" }}>Secretariat notification center</span>
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
          ? <div className="sc-notif-empty"><Icon name="bell" size={20}/><span className="sc-notif-empty-t">No notifications</span><span className="sc-notif-empty-s">You're all caught up!</span></div>
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
            <span>Select a message to read</span>
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
  const [notifPrefs, setNotifPrefs] = useState({ paiements:true, inscriptions:true, absences:true, systeme:false });
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
        <span className="sc-settings-title">Personal information</span>
        <div className="sc-form-row">
          {[["First name","fname",profile.fname],["Last name","lname",profile.lname]].map(([lbl,k,v]) => (
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
        <span className="sc-settings-title">Notification preferences</span>
        {[["Payment alerts","paiements"],["New registrations","inscriptions"],["Absence alerts","absences"],["System notifications","systeme"]].map(([lbl,k]) => (
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
        <span className="sc-settings-title">Change password</span>
        {[["Current password","cur","Your password"],["New password","new","Minimum 8 characters"],["Confirm","confirm","Repeat new password"]].map(([lbl,k,ph]) => (
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
          Light theme active — more options coming soon.
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
  { label:"Dashboard",       icon:"grid",     section:"main" },
  { label:"Registrations",   icon:"useradd",  section:"main" },
  { label:"Students",        icon:"users",    section:"main" },
  { label:"Teachers",        icon:"book",     section:"main" },
  { label:"Sections",        icon:"building", section:"main" },
  { label:"Timetable",       icon:"calendar", section:"main" },
  { label:"Payments",        icon:"credit",   section:"management", badge:"pay" },
  { label:"Absences",        icon:"file",     section:"management", badge:"abs" },
  { label:"Notifications",   icon:"bell",     section:"management", badge:"notif" },
  { label:"Messaging",       icon:"mail",     section:"management", badge:"mail" },
  { label:"Settings",        icon:"settings", section:"account" },
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function SecretaireDashboard() {
  const [activeNav, setActiveNav]               = useState("Dashboard");
  const [collapsed, setCollapsed]               = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal]   = useState(false);
  const [toast, setToast]                         = useState(null);
  const [search, setSearch]                       = useState("");

  const currentUserId = localStorage.getItem("userId");
  const { notifications, unreadCount: notifUnreadCount, markRead, deleteOne } = useNotifications(currentUserId);

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
      headers: { ...getHeaders(), ...(options.headers || {}) },
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

  const loadAll = useCallback(async () => {
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
          setStudents(dataS.users.filter(s => s.actif === true).map(s => ({
            id: s._id,
            name: `${s.prenom || ""} ${s.nom || ""}`.trim(),
            section: s.section || "To assign",
            language: s.language || "—",
            level: s.level || "A1",
            phone: s.telephone || "—",
            email: s.email,
            status: "active",
            absences: s.absences || 0,
          })));
          setPending(dataS.users.filter(s => s.actif === false).map(s => ({
            id: s._id,
            name: `${s.prenom || ""} ${s.nom || ""}`.trim(),
            language: s.language || "—",
            level: s.level || "A1",
            phone: s.telephone || "—",
            email: s.email,
            date: new Date(s.createdAt).toLocaleDateString("en-GB"),
          })));
        }
      }

      if (resPay.status === "fulfilled" && resPay.value) {
        const dataPay = await resPay.value.json();
        if (dataPay.success) {
          setPayments(dataPay.payments.map(p => ({
            id: p.id || p._id,
            name: p.student || p.studentName || "—",
            amount: p.amount,
            date: new Date(p.due || p.createdAt).toLocaleDateString("en-GB"),
            method: p.method || "Cash",
            status: p.status,
            section: p.section || "—",
            month: new Date(p.due || p.createdAt).toLocaleDateString("en-GB", { month:"long", year:"numeric" }),
          })));
        }
      }

      if (resSections.status === "fulfilled" && resSections.value) {
        const dataSec = await resSections.value.json();
        if (dataSec.success) {
          setSections(dataSec.sections.map(s => ({
            id: s._id || s.id,
            name: s.name,
            language: s.language,
            level: s.level,
            teacher: s.teacher || "—",
            students: s.students || s.studentsCount || 0,
            capacity: s.capacity || 12,
            time: s.time || "—",
            room: s.room || "—",
          })));
        }
      }

      if (resNotifs.status === "fulfilled" && resNotifs.value) {
        const dataN = await resNotifs.value.json();
        if (dataN.success) {
          setNotifs(dataN.notifications.map(n => ({
            id: n.id || n._id,
            type: n.type,
            icon: n.icon || "🔔",
            title: n.title,
            msg: n.msg || n.message,
            time: n.time,
            tag: n.tag || n.type,
            read: n.read,
          })));
        }
      }

      if (resMsgs.status === "fulfilled" && resMsgs.value) {
        const dataM = await resMsgs.value.json();
        if (dataM.success) {
          setEmails(dataM.messages.map(m => ({
            id: m.id || m._id,
            from: m.from,
            avatar: m.avatar || initials(m.from || ""),
            subject: m.subject,
            preview: m.preview || (m.body || "").slice(0, 80) + "…",
            time: m.time,
            read: m.read,
            starred: m.starred || false,
            tag: m.tag || "sys",
            body: m.body,
          })));
        }
      }
    } catch (err) {
      console.error("loadAll error:", err);
    }
  }, []);

  const socketHandler = useCallback((event, data) => {
    switch (event) {
      case 'student:added':
        setPending(prev => [...prev, {
          id: data._id,
          name: `${data.prenom || ""} ${data.nom || ""}`.trim(),
          language: data.language || "—",
          level: data.level || "A1",
          phone: data.telephone || "—",
          email: data.email,
          date: new Date(data.createdAt).toLocaleDateString("en-GB"),
        }]);
        showT("New registration received!");
        break;
      case 'section:updated':
      case 'section:assigned':
        setSections(prev => prev.map(s =>
          String(s.id) === String(data.id || data._id)
            ? { ...s, students: data.students ?? s.students }
            : s
        ));
        break;
      case 'payment:updated':
        setPayments(prev => prev.map(p =>
          String(p.id) === String(data.id)
            ? { ...p, status: data.status }
            : p
        ));
        break;
      case 'section:created':
        setSections(prev => {
          if (prev.find(s => String(s.id) === String(data.id))) return prev;
          return [...prev, {
            id: data.id, name: data.name, language: data.language,
            level: data.level, teacher: data.teacher || '—',
            students: 0, capacity: data.capacity || 12,
            time: data.time || '—', room: data.room || '—',
          }];
        });
        showT(`New section: ${data.name}`);
        break;
      case 'section:deleted':
        setSections(prev => prev.filter(s => String(s.id) !== String(data.id)));
        break;
      case 'absence:marked':
        loadAll();
        break;
      case 'notification:new':
        setNotifs(prev => [data, ...prev]);
        showT(data.title || "New notification");
        break;
      case 'message:new':
        setEmails(prev => [{
          id: data.id,
          from: data.from || 'New message',
          avatar: '?',
          subject: data.subject,
          preview: data.preview,
          body: '',
          tag: data.tag || 'sys',
          read: false,
          starred: false,
          time: new Date().toLocaleDateString('en-GB'),
        }, ...prev]);
        showT(`📩 ${data.subject}`);
        break;
      default:
        break;
    }
  }, [loadAll]);

  useSocket(currentUserId, socketHandler);
  useEffect(() => { loadAll(); }, [loadAll]);

  const unreadNotif  = notifs.filter(n=>!n.read).length;
  const unreadMail   = emails.filter(e=>!e.read).length;
  const unpaidCount  = payments.filter(p=>p.status!=="paid").length;

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
      case "Students":       return <EtudiantsView {...sharedProps}/>;
      case "Teachers":       return <TeachersView {...sharedProps}/>;
      case "Registrations":  return <InscriptionsView students={students} pending={pending} sections={sections} showRegister={()=>setShowRegisterModal(true)} loadAll={loadAll} {...sharedProps}/>;
      case "Sections":       return <SectionsView sections={sections} setSections={setSections} loadAll={loadAll} {...sharedProps}/>;
      case "Timetable":      return <TimetableView sections={sections} {...sharedProps}/>;
      case "Payments":       return <PaiementsView payments={payments} setPayments={setPayments} students={students} showPayment={()=>setShowPaymentModal(true)} {...sharedProps}/>;
      case "Absences":       return <AbsencesView students={students} {...sharedProps}/>;
      case "Notifications":  return <NotificationsView notifs={notifs} setNotifs={setNotifs} {...sharedProps}/>;
      case "Messaging":      return <InboxView emails={emails} setEmails={setEmails} {...sharedProps}/>;
      case "Settings":       return <SettingsView {...sharedProps}/>;
      default:
        return (
          <DashboardView
            sections={sections} pending={pending} setPending={setPending}
            payments={payments} students={students} setActiveNav={setActiveNav}
            showRegister={() => setShowRegisterModal(true)}
            showPayment={() => setShowPaymentModal(true)}
            loadAll={loadAll} getHeaders={getHeaders}
            {...sharedProps}
          />
        );
    }
  };

  return (
    <div className={`sc-layout${collapsed?" sc-collapsed":""}`}>
      <aside className="sc-sidebar">
        <div className="sc-logo">
          <div className="sc-logo-icon">
            <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          {!collapsed && <div className="sc-logo-text"><h2>Language</h2><span>Secretary</span></div>}
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

      <div className="sc-main">
        <header className="sc-header">
          <div className="sc-header-left">
            <div className="sc-header-title">{activeNav}</div>
            <span className="sc-header-sub">Spring Semester 2026</span>
          </div>
          <div className="sc-search">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search for a student, section…" value={search} onChange={e=>setSearch(e.target.value)}/>
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

      {showRegisterModal && (
        <RegisterModal
          sections={sections}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={async (student) => {
            const parts = student.name.trim().split(" ");
            try {
              const res = await safeFetch(`${API}/secretaire/students/register`, {
                method: "POST",
                body: JSON.stringify({
                  nom:       parts[0] || "",
                  prenom:    parts.slice(1).join(" ") || "",
                  email:     student.email,
                  telephone: student.phone,
                  language:  student.language,
                  level:     student.level,
                  section:   student.section,
                  password:  "etudiant123",
                }),
              });
              if (!res) return;
              const data = await res.json();
              if (data.success) { await loadAll(); showT("Registration saved as pending."); }
              else showT(`Error: ${data.message}`);
            } catch (err) { console.error(err); showT("Connection error."); }
          }}
        />
      )}

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
                  studentId: student?.id,
                  student:   payment.name,
                  language:  student?.language,
                  level:     student?.level,
                  amount:    payment.amount,
                  due:       new Date().toISOString(),
                  method:    payment.method,
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