import React, { useState, useEffect } from "react";
import "../../styles/DSC.css";

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
   CONSTANTES
══════════════════════════════════════════ */
const DAYS_FR = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

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
      {tip && <div className="sc-tooltip" style={{ left: tip.x+12, top: tip.y-40 }}><strong>{tip.k==="paid"?"Payés":"Impayés"}</strong>{tip.month} : {tip.val} étudiants</div>}
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
        <text x={cx} y={cy+12} textAnchor="middle" fontSize="10" fill="#5A6478">Taux payé</text>
      </svg>
      <div className="sc-donut-legend">
        <div className="sc-donut-item"><div className="sc-donut-dot" style={{ background:"#1A6CC4" }}/><span>Payés</span><strong>{paid}</strong></div>
        <div className="sc-donut-item"><div className="sc-donut-dot" style={{ background:"#fce8e8", border:"1.5px solid #C0352A" }}/><span>Impayés</span><strong>{total-paid}</strong></div>
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
          <div><span className="sc-modal-title">Nouvelle inscription</span><span className="sc-modal-sub">Étape {step} / 2</span></div>
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
              <div className="sc-field"><label>Prénom</label><input className="sc-input" placeholder="Mohammed" value={form.fname} onChange={e => upd("fname", e.target.value)}/></div>
              <div className="sc-field"><label>Nom</label><input className="sc-input" placeholder="Bouchemot" value={form.lname} onChange={e => upd("lname", e.target.value)}/></div>
            </div>
            <div className="sc-field"><label>Téléphone</label><input className="sc-input" placeholder="+213 6 00 00 00 00" value={form.phone} onChange={e => upd("phone", e.target.value)}/></div>
            <div className="sc-field"><label>Email</label><input className="sc-input" type="email" placeholder="etudiant@mail.com" value={form.email} onChange={e => upd("email", e.target.value)}/></div>
          </div>
        )}
        {step === 2 && (
          <div className="sc-modal-body">
            <div className="sc-form-row">
              <div className="sc-field"><label>Langue</label>
                <select className="sc-select" value={form.language} onChange={e => upd("language", e.target.value)} style={{ width:"100%" }}>
                  <option value="">Choisir…</option>
                  {["English","French","Spanish","German","Mandarin"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="sc-field"><label>Niveau</label>
                <select className="sc-select" value={form.level} onChange={e => upd("level", e.target.value)} style={{ width:"100%" }}>
                  <option value="">Choisir…</option>
                  {["A1","A2","B1","B2","C1","C2"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="sc-field"><label>Section</label>
              <select className="sc-select" value={form.section} onChange={e => upd("section", e.target.value)} style={{ width:"100%" }}>
                <option value="">Choisir une section…</option>
                {available.map(s => <option key={s.name}>{s.name} — {s.language} {s.level} ({s.capacity-s.students} places)</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="sc-modal-footer">
          {step > 1 && <button className="sc-btn-ghost" onClick={() => setStep(s=>s-1)}>← Retour</button>}
          {step < 2 && <button className="sc-btn-primary" onClick={() => setStep(s=>s+1)}>Suivant →</button>}
          {step === 2 && <button className="sc-btn-primary" onClick={submit}>✓ Inscrire</button>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PAYMENT MODAL
══════════════════════════════════════════ */
function PaymentModal({ students, onClose, onSuccess }) {
  const [form, setForm] = useState({ student:"", amount:"4500", month:"", method:"Espèces" });
  const upd = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const months = ["Janvier 2026","Février 2026","Mars 2026","Avril 2026","Mai 2026","Juin 2026"];
  const submit = () => {
    if (!form.student || !form.month) return;
    onSuccess({ name: form.student, amount: parseInt(form.amount), method: form.method, month: form.month });
    onClose();
  };
  return (
    <div className="sc-modal-overlay" onClick={onClose}>
      <div className="sc-modal" onClick={e => e.stopPropagation()}>
        <div className="sc-modal-header">
          <div><span className="sc-modal-title">Enregistrer un paiement</span><span className="sc-modal-sub">Nouvelle transaction</span></div>
          <button className="sc-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="sc-modal-body">
          <div className="sc-field"><label>Étudiant</label>
            <select className="sc-select" value={form.student} onChange={e => upd("student", e.target.value)} style={{ width:"100%" }}>
              <option value="">Choisir un étudiant…</option>
              {students.map(s => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="sc-form-row">
            <div className="sc-field"><label>Montant (DA)</label><input className="sc-input" type="number" value={form.amount} onChange={e => upd("amount", e.target.value)}/></div>
            <div className="sc-field"><label>Mois</label>
              <select className="sc-select" value={form.month} onChange={e => upd("month", e.target.value)} style={{ width:"100%" }}>
                <option value="">Choisir…</option>
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="sc-field"><label>Méthode</label>
            <select className="sc-select" value={form.method} onChange={e => upd("method", e.target.value)} style={{ width:"100%" }}>
              {["Espèces","CCP","Virement","Chèque"].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="sc-modal-footer">
          <button className="sc-btn-ghost" onClick={onClose}>Annuler</button>
          <button className="sc-btn-primary" onClick={submit}><Icon name="check" size={14}/> Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD VIEW
══════════════════════════════════════════ */
function DashboardView({ sections, pending, setPending, payments, students, setActiveNav, showRegister, showPayment, API, headers, loadAll, showT }) {
  const total    = useCountUp(students.length + pending.length);
  const paid     = useCountUp(payments.filter(p => p.status === "paid").length);
  const unpaid   = useCountUp(payments.filter(p => p.status !== "paid").length);
  const sectCount= useCountUp(sections.length);
  const recentPays = [...payments].slice(0, 5);

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`${API}/secretaire/students/${id}/accept`, { method:"PATCH", headers });
      const data = await res.json();
      if (data.success) { await loadAll(); showT("Étudiant accepté."); }
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${API}/secretaire/students/${id}/reject`, { method:"DELETE", headers });
      const data = await res.json();
      if (data.success) { await loadAll(); showT("Inscription rejetée."); }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="sc-stats">
        <StatCard icon="users"    label="Total étudiants"   value={total}     delta="+8 ce mois"  accent="#1A6CC4"/>
        <StatCard icon="credit"   label="Paiements reçus"   value={paid}      delta="Payés"        accent="#2D7A3A"/>
        <StatCard icon="warning"  label="Impayés"           value={unpaid}    delta="À relancer"   neg accent="#C0352A"/>
        <StatCard icon="building" label="Sections actives"  value={sectCount} delta="5 langues"    accent="#97C459"/>
      </div>
      <div className="sc-mid">
        <div className="sc-panel">
          <div className="sc-ph">
            <div><span className="sc-pt">Tendance des paiements</span><span className="sc-ps">6 derniers mois</span></div>
            <span className="sc-chip">6 mois</span>
          </div>
          <PaymentChart data={paymentData}/>
          <div className="sc-legend">
            <div className="sc-leg-item"><div className="sc-leg-dot" style={{ background:"#1A6CC4" }}/> Payés</div>
            <div className="sc-leg-item"><div className="sc-leg-dot" style={{ background:"#C0352A", opacity:.7 }}/> Impayés</div>
          </div>
        </div>
        <div className="sc-side-col">
          <div className="sc-panel">
            <div className="sc-ph"><span className="sc-pt">Statut paiements</span></div>
            <DonutChart paid={payments.filter(p=>p.status==="paid").length} total={payments.length}/>
          </div>
          <div className="sc-panel">
            <div className="sc-ph"><span className="sc-pt">Actions rapides</span></div>
            <div className="sc-actions">
              {[
                { label:"Inscrire un étudiant",    desc:"Nouvelle inscription", icon:"useradd",  action: () => showRegister() },
                { label:"Enregistrer un paiement", desc:"Reçu de paiement",     icon:"credit",   action: () => showPayment() },
                { label:"Voir les absences",        desc:"Rapport du jour",      icon:"file",     action: () => setActiveNav("Absences") },
                { label:"Emploi du temps",          desc:"Planning des cours",   icon:"calendar", action: () => setActiveNav("Emploi du temps") },
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
            <div><span className="sc-pt">Sections & occupation</span><span className="sc-ps">Capacité par section</span></div>
            <button className="sc-view-all" onClick={() => setActiveNav("Sections")}>Voir tout →</button>
          </div>
          <table className="sc-table">
            <thead><tr><th>Section</th><th>Langue</th><th>Niveau</th><th>Enseignant</th><th>Occupation</th><th>Horaire</th></tr></thead>
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
              <div><span className="sc-pt">Inscriptions en attente</span><span className="sc-ps">{pending.length} à valider</span></div>
              {pending.length > 0 && <span className="sc-badge-count">{pending.length}</span>}
            </div>
            <div className="sc-pending-list">
              {pending.length === 0 && <div className="sc-empty-state">Aucune inscription en attente</div>}
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
            <div className="sc-ph"><div><span className="sc-pt">Derniers paiements</span><span className="sc-ps">5 transactions récentes</span></div></div>
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
                    <span className={`sc-pay-status ${p.status==="paid" ? "sc-pay-ok" : "sc-pay-pend"}`}>{p.status==="paid"?"Payé":"En attente"}</span>
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
   INSCRIPTIONS VIEW
══════════════════════════════════════════ */
function InscriptionsView({ students, pending, sections, showRegister, API, headers, loadAll, showT }) {
  const [search, setSearch] = useState("");
  const [filterSec, setFilterSec] = useState("Toutes");

  const filtered = students.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchSec    = filterSec === "Toutes" || s.section === filterSec;
    return matchSearch && matchSec;
  });

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`${API}/secretaire/students/${id}/accept`, { method:"PATCH", headers });
      const data = await res.json();
      if (data.success) { await loadAll(); showT("Étudiant accepté et activé."); }
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${API}/secretaire/students/${id}/reject`, { method:"DELETE", headers });
      const data = await res.json();
      if (data.success) { await loadAll(); showT("Inscription rejetée."); }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="sc-panel">
        <div className="sc-ph">
          <div><span className="sc-pt">Inscriptions en attente</span><span className="sc-ps">{pending.length} demandes à valider</span></div>
          <button className="sc-btn-primary sc-btn-sm" onClick={showRegister}><Icon name="plus" size={13}/> Inscrire</button>
        </div>
        {pending.length === 0
          ? <div className="sc-empty-state">Aucune inscription en attente</div>
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
          <div><span className="sc-pt">Tous les étudiants</span><span className="sc-ps">{filtered.length} étudiants</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:160 }} placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterSec} onChange={e => setFilterSec(e.target.value)}>
              <option>Toutes</option>
              {sections.map(s => <option key={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <table className="sc-table">
          <thead><tr><th>Nom</th><th>Section</th><th>Langue</th><th>Niveau</th><th>Téléphone</th><th>Absences</th><th>Statut</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(s.name)}</div><strong>{s.name}</strong></div></td>
                <td style={{ fontSize:12 }}>{s.section}</td>
                <td>{s.language}</td>
                <td><span className={`sc-lvl ${levelCls(s.level)}`}>{s.level}</span></td>
                <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.phone}</td>
                <td><span style={{ fontSize:12, fontWeight:600, color: s.absences >= 8 ? "#C0352A" : s.absences >= 4 ? "#7A4A0A" : "#2D7A3A" }}>{s.absences}</span></td>
                <td><span className={`sc-status ${s.status==="active" ? "sc-st-ok" : "sc-st-pend"}`}><span className="sc-dot"/> {s.status==="active"?"Actif":"En attente"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
/* ══════════════════════════════════════════
   ETUDIANTS VIEW
══════════════════════════════════════════ */
function EtudiantsView({ API, headers, showT }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [search, setSearch]    = useState("");
  const [filterLevel, setFilterLevel] = useState("Tous");
  const [filterStatus, setFilterStatus] = useState("Tous");

  useEffect(() => {
    fetch(`${API}/users/role/etudiant`, { headers })
      .then(r => r.json())
      .then(data => {
        if (data.success) setStudents(data.users);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const levels  = ["Tous", "A1", "A2", "B1", "B2", "C1", "C2"];
  const filtered = students.filter(s => {
    const name   = `${s.prenom || ""} ${s.nom || ""}`.toLowerCase();
    const ms     = !search || name.includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase());
    const ml     = filterLevel  === "Tous" || s.level === filterLevel;
    const mst    = filterStatus === "Tous" || (filterStatus === "Actif" ? s.actif : !s.actif);
    return ms && ml && mst;
  });

  const total  = students.length;
  const actifs = students.filter(s => s.actif).length;

  return (
    <>
      {/* Cartes résumé */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:4 }}>
        {[
          { lbl:"Total étudiants", val: total,          color:"#1A6CC4" },
          { lbl:"Actifs",          val: actifs,          color:"#2D7A3A" },
          { lbl:"En attente",      val: total - actifs,  color:"#C0352A" },
        ].map(c => (
          <div className="sc-panel" key={c.lbl} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>{c.lbl}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:600, color:c.color }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div className="sc-panel">
        <div className="sc-ph">
          <div>
            <span className="sc-pt">Liste des étudiants</span>
            <span className="sc-ps">{filtered.length} résultats</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {/* Recherche */}
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input
                style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:160 }}
                placeholder="Nom, email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Filtre niveau */}
            <select className="sc-select" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
            {/* Filtre statut */}
            <select className="sc-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option>Tous</option>
              <option>Actif</option>
              <option>En attente</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="sc-empty-state">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="sc-empty-state">Aucun étudiant trouvé</div>
        ) : (
          <table className="sc-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Section</th>
                <th>Langue</th>
                <th>Niveau</th>
                <th>Absences</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const name = `${s.prenom || ""} ${s.nom || ""}`.trim();
                return (
                  <tr key={s._id}>
                    <td>
                      <div className="sc-s-cell">
                        <div className="sc-mini-av">{initials(name)}</div>
                        <strong>{name}</strong>
                      </div>
                    </td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.email || "—"}</td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{s.telephone || "—"}</td>
                    <td style={{ fontSize:12 }}>{s.section || "—"}</td>
                    <td style={{ fontSize:12 }}>{s.language || "—"}</td>
                    <td>
                      {s.level
                        ? <span className={`sc-lvl ${levelCls(s.level)}`}>{s.level}</span>
                        : <span style={{ fontSize:12, color:"var(--db-text3)" }}>—</span>
                      }
                    </td>
                    <td>
                      <span style={{
                        fontSize:12, fontWeight:600,
                        color: (s.absences||0) >= 8 ? "#C0352A" : (s.absences||0) >= 4 ? "#7A4A0A" : "#2D7A3A"
                      }}>
                        {s.absences || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`sc-status ${s.actif ? "sc-st-ok" : "sc-st-pend"}`}>
                        <span className="sc-dot"/> {s.actif ? "Actif" : "En attente"}
                      </span>
                    </td>
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
function TeachersView({ API, headers, showT }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterSpec, setFilterSpec] = useState("Toutes");

  useEffect(() => {
    fetch(`${API}/users/role/professeur`, { headers })
      .then(r => r.json())
      .then(data => {
        if (data.success) setTeachers(data.users);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const specialties = ["Toutes", ...new Set(teachers.map(t => t.specialty).filter(Boolean))];

  const filtered = teachers.filter(t => {
    const name = `${t.prenom || ""} ${t.nom || ""}`.toLowerCase();
    const ms   = !search || name.includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase());
    const msp  = filterSpec === "Toutes" || t.specialty === filterSpec;
    return ms && msp;
  });

  const total  = teachers.length;
  const actifs = teachers.filter(t => t.actif).length;

  return (
    <>
      {/* Cartes résumé */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:4 }}>
        {[
          { lbl:"Total enseignants", val: total,         color:"#1A6CC4" },
          { lbl:"Actifs",            val: actifs,         color:"#2D7A3A" },
          { lbl:"Archivés",          val: total - actifs, color:"#C0352A" },
        ].map(c => (
          <div className="sc-panel" key={c.lbl} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--db-text3)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6 }}>{c.lbl}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:600, color:c.color }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div className="sc-panel">
        <div className="sc-ph">
          <div>
            <span className="sc-pt">Liste des enseignants</span>
            <span className="sc-ps">{filtered.length} résultats</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input
                style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:160 }}
                placeholder="Nom, email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="sc-select" value={filterSpec} onChange={e => setFilterSpec(e.target.value)}>
              {specialties.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="sc-empty-state">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="sc-empty-state">Aucun enseignant trouvé</div>
        ) : (
          <table className="sc-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Spécialité</th>
                <th>Heures/sem</th>
                <th>Inscrit le</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const name = `${t.prenom || ""} ${t.nom || ""}`.trim();
                const date = t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("fr-DZ")
                  : "—";
                return (
                  <tr key={t._id}>
                    <td>
                      <div className="sc-s-cell">
                        <div className="sc-mini-av">{initials(name)}</div>
                        <strong>{name}</strong>
                      </div>
                    </td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.email || "—"}</td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{t.telephone || "—"}</td>
                    <td style={{ fontSize:12 }}>{t.specialty || "—"}</td>
                    <td style={{ fontSize:12, textAlign:"center" }}>{t.hours || "—"}</td>
                    <td style={{ fontSize:12, color:"var(--db-text2)" }}>{date}</td>
                    <td>
                      <span className={`sc-status ${t.actif ? "sc-st-ok" : "sc-st-err"}`}>
                        <span className="sc-dot"/> {t.actif ? "Actif" : "Archivé"}
                      </span>
                    </td>
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
   SECTIONS VIEW — connecté au backend
══════════════════════════════════════════ */
function SectionsView({ sections, setSections, API, headers, showT }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", language:"English", level:"A1", capacity:12, teacher:"", teacherId:"", time:"", room:"" });
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableRooms] = useState([
    "A101", "A102", "A103", "A104",
    "B101", "B102", "B103", "B104",
    "C101", "C102", "C201", "C202",
    "Salle Info 1", "Salle Info 2", "Amphi A", "Amphi B",
  ]);
  const [availableSlots] = useState([
    "Lun 08h00–09h30", "Lun 09h45–11h15", "Lun 11h30–13h00",
    "Lun 14h00–15h30", "Lun 15h45–17h15",
    "Mar 08h00–09h30", "Mar 09h45–11h15", "Mar 11h30–13h00",
    "Mar 14h00–15h30", "Mar 15h45–17h15",
    "Mer 08h00–09h30", "Mer 09h45–11h15", "Mer 11h30–13h00",
    "Mer 14h00–15h30", "Mer 15h45–17h15",
    "Jeu 08h00–09h30", "Jeu 09h45–11h15", "Jeu 11h30–13h00",
    "Jeu 14h00–15h30", "Jeu 15h45–17h15",
    "Ven 08h00–09h30", "Ven 09h45–11h15", "Ven 11h30–13h00",
    "Ven 14h00–15h30", "Ven 15h45–17h15",
    "Sam 08h00–09h30", "Sam 09h45–11h15", "Sam 11h30–13h00",
    "Lun/Mer 08h00–09h30", "Lun/Mer 09h45–11h15", "Lun/Mer 14h00–15h30",
    "Mar/Jeu 08h00–09h30", "Mar/Jeu 09h45–11h15", "Mar/Jeu 14h00–15h30",
    "Mer/Ven 08h00–09h30", "Mer/Ven 09h45–11h15", "Mer/Ven 14h00–15h30",
  ]);

  // Charger les enseignants disponibles depuis le backend
  useEffect(() => {
    fetch(`${API}/users/role/professeur`, { headers })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAvailableTeachers(
            (data.users || data.teachers || [])
              .filter(t => t.actif !== false)
              .map(t => ({
                id: t._id,
                name: `${t.prenom || ""} ${t.nom || ""}`.trim(),
              }))
          );
        }
      })
      .catch(err => console.error("Erreur chargement enseignants:", err));
  }, []);

  // Salles déjà utilisées dans les sections existantes
  const usedRooms = sections.map(s => s.room).filter(Boolean);
  // Créneaux déjà utilisés
  const usedSlots = sections.map(s => s.time).filter(Boolean);

  const addSection = async () => {
    if (!form.name || !form.teacher) return;
    try {
      const res = await fetch(`${API}/secretaire/sections`, {
        method: "POST", headers,
        body: JSON.stringify({ ...form, capacity: parseInt(form.capacity) }),
      });
      const data = await res.json();
      if (data.success) {
        setSections(ss => [...ss, {
          id: data.section._id, name: data.section.name, language: data.section.language,
          level: data.section.level, teacher: data.section.teacher, students: 0,
          capacity: data.section.capacity, time: data.section.time, room: data.section.room,
        }]);
        setForm({ name:"", language:"English", level:"A1", capacity:12, teacher:"", teacherId:"", time:"", room:"" });
        setShowAdd(false);
        showT("Section créée avec succès.");
      } else { showT(`Erreur : ${data.message}`); }
    } catch (err) { console.error(err); }
  };

  const deleteSection = async (id, name) => {
    try {
      const res = await fetch(`${API}/secretaire/sections/${id}`, { method:"DELETE", headers });
      const data = await res.json();
      if (data.success) { setSections(ss => ss.filter(s => s.id !== id && s.name !== name)); showT("Section supprimée."); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="sc-panel">
      <div className="sc-ph">
        <div><span className="sc-pt">Gestion des sections</span><span className="sc-ps">{sections.length} sections actives</span></div>
        <button className="sc-add-btn" onClick={() => setShowAdd(s=>!s)}><Icon name="plus" size={13}/> Nouvelle section</button>
      </div>

      {showAdd && (
        <div style={{ background:"var(--db-bg)", border:"var(--db-border)", borderRadius:"var(--db-r)", padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:12 }}>
          
          {/* Ligne 1 : Nom + Langue */}
          <div className="sc-form-row">
            <div className="sc-field">
              <label>Nom section</label>
              <input className="sc-input" placeholder="Section F" value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))}/>
            </div>
            <div className="sc-field">
              <label>Langue</label>
              <select className="sc-select" style={{ width:"100%" }} value={form.language} onChange={e => setForm(f=>({...f, language:e.target.value}))}>
                {["English","French","Spanish","German","Mandarin","Arabe","Russe"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Ligne 2 : Niveau + Capacité */}
          <div className="sc-form-row">
            <div className="sc-field">
              <label>Niveau</label>
              <select className="sc-select" style={{ width:"100%" }} value={form.level} onChange={e => setForm(f=>({...f, level:e.target.value}))}>
                {["A1","A2","B1","B2","C1","C2"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="sc-field">
              <label>Capacité</label>
              <input className="sc-input" type="number" min={1} max={40} value={form.capacity} onChange={e => setForm(f=>({...f, capacity:e.target.value}))}/>
            </div>
          </div>

          {/* Ligne 3 : Enseignant (select dynamique) */}
          <div className="sc-field">
            <label>Enseignant disponible</label>
            <select
              className="sc-select"
              style={{ width:"100%" }}
              value={form.teacherId}
              onChange={e => {
                const t = availableTeachers.find(t => t.id === e.target.value);
                setForm(f=>({...f, teacherId: e.target.value, teacher: t?.name || ""}));
              }}
            >
              <option value="">— Choisir un enseignant —</option>
              {availableTeachers.length === 0 && (
                <option disabled>Aucun enseignant disponible</option>
              )}
              {availableTeachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Ligne 4 : Salle (select) */}
          <div className="sc-field">
            <label>Salle disponible</label>
            <select
              className="sc-select"
              style={{ width:"100%" }}
              value={form.room}
              onChange={e => setForm(f=>({...f, room:e.target.value}))}
            >
              <option value="">— Choisir une salle —</option>
              {availableRooms.map(r => (
                <option
                  key={r}
                  value={r}
                  disabled={usedRooms.includes(r)}
                  style={{ color: usedRooms.includes(r) ? "#aaa" : "inherit" }}
                >
                  {r}{usedRooms.includes(r) ? " — occupée" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Ligne 5 : Horaire (select) */}
          <div className="sc-field">
            <label>Créneau horaire</label>
            <select
              className="sc-select"
              style={{ width:"100%" }}
              value={form.time}
              onChange={e => setForm(f=>({...f, time:e.target.value}))}
            >
              <option value="">— Choisir un créneau —</option>
              {availableSlots.map(slot => (
                <option
                  key={slot}
                  value={slot}
                  disabled={usedSlots.includes(slot)}
                  style={{ color: usedSlots.includes(slot) ? "#aaa" : "inherit" }}
                >
                  {slot}{usedSlots.includes(slot) ? " — déjà utilisé" : ""}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button className="sc-btn-ghost" onClick={() => { setShowAdd(false); setForm({ name:"", language:"English", level:"A1", capacity:12, teacher:"", teacherId:"", time:"", room:"" }); }}>
              Annuler
            </button>
            <button
              className="sc-btn-primary"
              onClick={addSection}
              disabled={!form.name || !form.teacher || !form.room || !form.time}
              style={{ opacity: (!form.name || !form.teacher || !form.room || !form.time) ? 0.5 : 1 }}
            >
              <Icon name="check" size={13}/> Créer
            </button>
          </div>
        </div>
      )}

      <table className="sc-table">
        <thead><tr><th>Section</th><th>Langue</th><th>Niveau</th><th>Enseignant</th><th>Occupation</th><th>Horaire</th><th>Salle</th><th></th></tr></thead>
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
   TIMETABLE VIEW — connecté au backend
══════════════════════════════════════════ */
function TimetableView({ API, headers, sections, showT }) {
  const [offset, setOffset]   = useState(0);
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ section:"", subject:"", teacher:"", room:"", startTime:"08h00", endTime:"09h30" });

  const d = new Date(); d.setDate(d.getDate() + offset);
  const di = d.getDay();
  const label = offset===0?"Aujourd'hui":offset===-1?"Hier":offset===1?"Demain":DAYS_FR[di];

  const loadTimetable = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/secretaire/timetable?day=${di}`, { headers });
      const data = await res.json();
      if (data.success) setRows(data.timetable);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadTimetable(); }, [di]);

  const addEntry = async () => {
    if (!form.room || !form.startTime || !form.endTime) return;
    try {
      const res  = await fetch(`${API}/secretaire/timetable`, {
        method:"POST", headers,
        body: JSON.stringify({ ...form, dayOfWeek: di }),
      });
      const data = await res.json();
      if (data.success) { await loadTimetable(); setShowAdd(false); showT("Créneau ajouté."); }
    } catch (err) { console.error(err); }
  };

  const deleteEntry = async (id) => {
    try {
      const res  = await fetch(`${API}/secretaire/timetable/${id}`, { method:"DELETE", headers });
      const data = await res.json();
      if (data.success) { setRows(rs => rs.filter(r => r.id !== id)); showT("Créneau supprimé."); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="sc-panel">
      <div className="sc-ph">
        <div><span className="sc-pt">Emploi du temps</span><span className="sc-ps">{label} — {DAYS_FR[di]}</span></div>
        <div style={{ display:"flex", gap:6 }}>
          <button className="sc-arr-btn" onClick={() => setOffset(o=>o-1)}>‹ Préc.</button>
          <button className="sc-arr-btn" onClick={() => setOffset(0)}>Aujourd'hui</button>
          <button className="sc-arr-btn" onClick={() => setOffset(o=>o+1)}>Suiv. ›</button>
          <button className="sc-btn-primary sc-btn-sm" onClick={() => setShowAdd(v=>!v)}><Icon name="plus" size={13}/> Ajouter</button>
        </div>
      </div>

      {showAdd && (
        <div style={{ background:"var(--db-bg)", border:"var(--db-border)", borderRadius:"var(--db-r)", padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:12 }}>
          <div className="sc-form-row">
            <div className="sc-field"><label>Section</label>
              <select className="sc-select" style={{ width:"100%" }} value={form.section} onChange={e => setForm(f=>({...f, section:e.target.value}))}>
                <option value="">Choisir…</option>
                {sections.map(s => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="sc-field"><label>Enseignant</label><input className="sc-input" placeholder="Nom enseignant" value={form.teacher} onChange={e => setForm(f=>({...f,teacher:e.target.value}))}/></div>
          </div>
          <div className="sc-form-row">
            <div className="sc-field"><label>Salle</label><input className="sc-input" placeholder="A101" value={form.room} onChange={e => setForm(f=>({...f,room:e.target.value}))}/></div>
            <div className="sc-field"><label>Matière</label><input className="sc-input" placeholder="English" value={form.subject} onChange={e => setForm(f=>({...f,subject:e.target.value}))}/></div>
          </div>
          <div className="sc-form-row">
            <div className="sc-field"><label>Heure début</label><input className="sc-input" placeholder="08h00" value={form.startTime} onChange={e => setForm(f=>({...f,startTime:e.target.value}))}/></div>
            <div className="sc-field"><label>Heure fin</label><input className="sc-input" placeholder="09h30" value={form.endTime} onChange={e => setForm(f=>({...f,endTime:e.target.value}))}/></div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button className="sc-btn-ghost" onClick={() => setShowAdd(false)}>Annuler</button>
            <button className="sc-btn-primary" onClick={addEntry}><Icon name="check" size={13}/> Enregistrer</button>
          </div>
        </div>
      )}

      {loading && <div className="sc-empty-state">Chargement…</div>}
      {!loading && rows.length === 0 && <div className="sc-empty-state">Aucun cours prévu pour {DAYS_FR[di]}</div>}
      {!loading && rows.map((r) => (
        <div className="sc-tt-row" key={r.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div className="sc-tt-time">{r.time}</div>
          <div className="sc-tt-body" style={{ flex:1 }}>
            <div className="sc-tt-subj">{r.subject} — {r.section}</div>
            <div className="sc-tt-room">Salle {r.room} · {r.teacher}</div>
          </div>
          <span className="sc-status sc-st-blue"><span className="sc-dot"/> Planifié</span>
          <button className="sc-icon-row-btn" onClick={() => deleteEntry(r.id)}><Icon name="trash" size={13}/></button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   PAYMENTS VIEW
══════════════════════════════════════════ */
function PaiementsView({ payments, setPayments, students, showPayment, API, headers, showT }) {
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [filterMonth, setFilterMonth]   = useState("Tous");

  const totalPaid    = payments.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const totalUnpaid  = payments.filter(p=>p.status!=="paid").reduce((a,p)=>a+p.amount,0);
  const totalAll     = payments.reduce((a,p)=>a+p.amount,0);
  const months       = [...new Set(payments.map(p=>p.month))];

  const filtered = payments.filter(p => {
    const ms  = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const mst = filterStatus==="Tous" || (filterStatus==="Payé"?p.status==="paid":p.status!=="paid");
    const mm  = filterMonth==="Tous" || p.month===filterMonth;
    return ms && mst && mm;
  });

  const markPaid = async (id) => {
    try {
      const res  = await fetch(`${API}/payments/${id}/pay`, { method:"PATCH", headers, body: JSON.stringify({}) });
      const data = await res.json();
      if (data.success) setPayments(ps => ps.map(p => p.id===id ? { ...p, status:"paid" } : p));
    } catch (err) { console.error(err); }
  };

  const deleteP = async (id) => {
    try {
      const res  = await fetch(`${API}/payments/${id}`, { method:"DELETE", headers });
      const data = await res.json();
      if (data.success) { setPayments(ps => ps.filter(p => p.id!==id)); showT("Paiement supprimé."); }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { lbl:"Total encaissé", val:`${totalPaid.toLocaleString()} DA`,   sub:`${payments.filter(p=>p.status==="paid").length} paiements`,   color:"#2D7A3A" },
          { lbl:"Non payés",      val:`${totalUnpaid.toLocaleString()} DA`, sub:`${payments.filter(p=>p.status!=="paid").length} paiements`,    color:"#C0352A" },
          { lbl:"Total prévu",    val:`${totalAll.toLocaleString()} DA`,    sub:`${payments.length} transactions`,                              color:"#1A6CC4" },
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
          <div><span className="sc-pt">Historique des paiements</span><span className="sc-ps">{filtered.length} transactions</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:140 }} placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option>Tous</option><option>Payé</option><option>Non payé</option>
            </select>
            <select className="sc-select" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option>Tous</option>
              {months.map(m => <option key={m}>{m}</option>)}
            </select>
            <button className="sc-btn-primary sc-btn-sm" onClick={showPayment}><Icon name="plus" size={13}/> Nouveau</button>
          </div>
        </div>
        <table className="sc-table">
          <thead><tr><th>Étudiant</th><th>Section</th><th>Mois</th><th>Montant</th><th>Date</th><th>Méthode</th><th>Statut</th><th></th></tr></thead>
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
                    ? <span className="sc-status sc-st-ok"><span className="sc-dot"/> Payé</span>
                    : <span className="sc-status sc-st-pend"><span className="sc-dot"/> Non payé</span>
                  }
                </td>
                <td>
                  <div style={{ display:"flex", gap:4 }}>
                    {p.status!=="paid" && <button className="sc-btn-accept" title="Marquer payé" onClick={()=>markPaid(p.id)}>✓</button>}
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
   ABSENCES VIEW — connecté au backend
══════════════════════════════════════════ */
function AbsencesView({ students, API, headers, showT }) {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterSec, setFilterSec] = useState("Toutes");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student:"", studentId:"", section:"", session:"", date:"", justified: false });

  const loadAbsences = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/secretaire/absences`, { headers });
      const data = await res.json();
      if (data.success) setAbsences(data.absences);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAbsences(); }, []);

  const critical = students.filter(s => s.absences >= 8);

  const filtered = absences.filter(a => {
    const ms   = !search || a.student.toLowerCase().includes(search.toLowerCase());
    const msec = filterSec==="Toutes" || a.section===filterSec;
    return ms && msec;
  });

  const toggle = async (id) => {
    try {
      const res  = await fetch(`${API}/secretaire/absences/${id}/justify`, { method:"PATCH", headers });
      const data = await res.json();
      if (data.success) setAbsences(as => as.map(a => a.id===id ? { ...a, justified:data.justified } : a));
    } catch (err) { console.error(err); }
  };

  const deleteA = async (id) => {
    try {
      const res  = await fetch(`${API}/secretaire/absences/${id}`, { method:"DELETE", headers });
      const data = await res.json();
      if (data.success) { setAbsences(as => as.filter(a => a.id!==id)); showT("Absence supprimée."); }
    } catch (err) { console.error(err); }
  };

  const addAbsence = async () => {
    if (!form.student || !form.date) return;
    try {
      const res  = await fetch(`${API}/secretaire/absences`, {
        method:"POST", headers,
        body: JSON.stringify({ student: form.student, studentId: form.studentId || null, section: form.section, session: form.session, date: form.date, justified: false }),
      });
      const data = await res.json();
      if (data.success) {
        setAbsences(as => [{ id: data.absence._id, student: data.absence.student, section: data.absence.section, date: data.absence.date, session: data.absence.session, justified: false }, ...as]);
        setForm({ student:"", studentId:"", section:"", session:"", date:"", justified:false });
        setShowForm(false);
        showT("Absence enregistrée.");
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
                <div style={{ fontSize:11, color:"var(--db-text2)" }}>{s.section} · Seuil critique dépassé (max 8)</div>
              </div>
              <span className="sc-status sc-st-err"><span className="sc-dot"/> Critique</span>
            </div>
          ))}
        </div>
      )}
      <div className="sc-panel">
        <div className="sc-ph">
          <div><span className="sc-pt">Registre des absences</span><span className="sc-ps">{filtered.length} absences</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"var(--db-bg)", border:"var(--db-border)", borderRadius:9, padding:"7px 12px" }}>
              <Icon name="search" size={12}/>
              <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:140 }} placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="sc-select" value={filterSec} onChange={e => setFilterSec(e.target.value)}>
              <option>Toutes</option>
              {[...new Set(absences.map(a=>a.section).filter(Boolean))].map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="sc-btn-primary sc-btn-sm" onClick={() => setShowForm(f=>!f)}><Icon name="plus" size={13}/> Saisir</button>
          </div>
        </div>
        {showForm && (
          <div style={{ background:"var(--db-bg)", border:"var(--db-border)", borderRadius:"var(--db-r)", padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:12 }}>
            <div className="sc-form-row">
              <div className="sc-field"><label>Étudiant</label>
                <select className="sc-select" style={{ width:"100%" }} value={form.studentId} onChange={e => {
                  const s = students.find(st => st.id === e.target.value);
                  setForm(f=>({...f, studentId: e.target.value, student: s?.name || "", section: s?.section || ""}));
                }}>
                  <option value="">Choisir…</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="sc-field"><label>Date</label><input className="sc-input" type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))}/></div>
            </div>
            <div className="sc-form-row">
              <div className="sc-field"><label>Séance</label><input className="sc-input" placeholder="09h00-10h30" value={form.session} onChange={e => setForm(f=>({...f,session:e.target.value}))}/></div>
              <div className="sc-field"><label>Section</label><input className="sc-input" placeholder="Section A" value={form.section} onChange={e => setForm(f=>({...f,section:e.target.value}))}/></div>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button className="sc-btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
              <button className="sc-btn-primary" onClick={addAbsence}><Icon name="check" size={13}/> Enregistrer</button>
            </div>
          </div>
        )}
        {loading ? <div className="sc-empty-state">Chargement…</div> : (
          <table className="sc-table">
            <thead><tr><th>Étudiant</th><th>Section</th><th>Date</th><th>Séance</th><th>Justifiée</th><th></th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign:"center", padding:"2rem", color:"var(--db-text3)", fontSize:13 }}>Aucune absence enregistrée.</td></tr>}
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><div className="sc-s-cell"><div className="sc-mini-av">{initials(a.student)}</div><strong>{a.student}</strong></div></td>
                  <td style={{ fontSize:12, color:"var(--db-text2)" }}>{a.section}</td>
                  <td style={{ fontSize:12 }}>{new Date(a.date).toLocaleDateString("fr-DZ")}</td>
                  <td style={{ fontSize:12, color:"var(--db-text2)" }}>{a.session}</td>
                  <td>
                    <button onClick={() => toggle(a.id)} style={{ background:"none", border:"none", cursor:"pointer" }}>
                      <span className={`sc-status ${a.justified ? "sc-st-ok" : "sc-st-err"}`}><span className="sc-dot"/> {a.justified ? "Oui" : "Non"}</span>
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
   NOTIFICATIONS VIEW — connecté au backend
══════════════════════════════════════════ */
function NotificationsView({ notifs, setNotifs, API, headers, showT }) {
  const [tab, setTab] = useState("Tout");

  const markAll = async () => {
    try {
      await fetch(`${API}/secretaire/notifications/read-all`, { method:"PATCH", headers });
      setNotifs(ns => ns.map(n => ({ ...n, read:true })));
      showT("Toutes les notifications marquées comme lues.");
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    try {
      await Promise.all(notifs.map(n => fetch(`${API}/secretaire/notifications/${n.id}`, { method:"DELETE", headers })));
      setNotifs([]);
      showT("Notifications effacées.");
    } catch (err) { console.error(err); }
  };

  const toggleRead = async (id) => {
    try {
      await fetch(`${API}/secretaire/notifications/${id}/read`, { method:"PATCH", headers });
      setNotifs(ns => ns.map(n => n.id===id ? { ...n, read:!n.read } : n));
    } catch (err) { console.error(err); }
  };

  const del = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(`${API}/secretaire/notifications/${id}`, { method:"DELETE", headers });
      setNotifs(ns => ns.filter(n => n.id!==id));
    } catch (err) { console.error(err); }
  };

  const tabs = [
    { lbl:"Tout", key:"Tout" }, { lbl:"Paiements", key:"pay" },
    { lbl:"Inscriptions", key:"ins" }, { lbl:"Absences", key:"abs" }, { lbl:"Système", key:"sys" },
  ];
  const icCls  = { pay:"sc-nic-pay", abs:"sc-nic-abs", ins:"sc-nic-ins", sys:"sc-nic-sys" };
  const tagCls = { pay:"sc-ntag-pay", abs:"sc-ntag-abs", ins:"sc-ntag-ins", sys:"sc-ntag-sys" };
  const tagLbl = { pay:"Paiement", abs:"Absence", ins:"Inscription", sys:"Système" };
  const filtered = tab==="Tout" ? notifs : notifs.filter(n=>n.type===tab);
  const unread   = notifs.filter(n=>!n.read).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:600, color:"var(--db-text)" }}>Notifications</div>
          <span style={{ fontSize:12, color:"var(--db-text2)" }}>Centre de notification du secrétariat</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {unread > 0 && <button className="sc-btn-ghost" onClick={markAll}><Icon name="check" size={13}/> Tout lire ({unread})</button>}
          {notifs.length > 0 && (
            <button style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", background:"var(--db-red-bg)", color:"var(--db-red)", border:"1px solid rgba(192,53,42,.15)", borderRadius:"var(--db-r)", cursor:"pointer", fontSize:12.5 }} onClick={clearAll}>
              <Icon name="trash" size={13}/> Tout effacer
            </button>
          )}
        </div>
      </div>
      <div className="sc-panel" style={{ padding:0 }}>
        <div style={{ padding:"0 18px" }}>
          <div className="sc-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`sc-tab${tab===t.key?" active":""}`} onClick={()=>setTab(t.key)}>
                {t.lbl}<span className="sc-tab-n">{t.key==="Tout"?notifs.length:notifs.filter(n=>n.type===t.key).length}</span>
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0
          ? <div className="sc-notif-empty"><Icon name="bell" size={20}/><span className="sc-notif-empty-t">Aucune notification</span><span className="sc-notif-empty-s">Vous êtes à jour !</span></div>
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
   INBOX VIEW — connecté au backend
══════════════════════════════════════════ */
function InboxView({ emails, setEmails, API, headers, showT }) {
  const [selected, setSelected]   = useState(null);
  const [tab, setTab]             = useState("Tout");
  const [search, setSearch]       = useState("");
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const tabs = [
    { lbl:"Tout", key:"Tout" }, { lbl:"Absences", key:"abs" },
    { lbl:"Inscriptions", key:"ins" }, { lbl:"Système", key:"sys" },
  ];
  const filtered = emails.filter(e => {
    const mt = tab==="Tout" || e.tag===tab;
    const ms = !search || e.from?.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });
  const unread = emails.filter(e=>!e.read).length;

  const open = async (email) => {
    setSelected(email); setShowReply(false); setReplyText("");
    if (!email.read) {
      try {
        await fetch(`${API}/secretaire/messages/${email.id}/read`, { method:"PATCH", headers });
        setEmails(es => es.map(e => e.id===email.id ? { ...e, read:true } : e));
      } catch (err) { console.error(err); }
    }
  };

  const toggleStar = async (id, ev) => {
    ev.stopPropagation();
    try {
      const res  = await fetch(`${API}/secretaire/messages/${id}/star`, { method:"PATCH", headers });
      const data = await res.json();
      if (data.success) setEmails(es => es.map(e => e.id===id ? { ...e, starred:data.starred } : e));
    } catch (err) { console.error(err); }
  };

  const delEmail = async (id) => {
    try {
      await fetch(`${API}/secretaire/messages/${id}`, { method:"DELETE", headers });
      setEmails(es => es.filter(e => e.id!==id));
      setSelected(null);
      showT("Message supprimé.");
    } catch (err) { console.error(err); }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;
    try {
      const res  = await fetch(`${API}/secretaire/messages/${selected.id}/reply`, {
        method:"POST", headers, body: JSON.stringify({ body: replyText }),
      });
      const data = await res.json();
      if (data.success) { setReplyText(""); setShowReply(false); showT(`Réponse envoyée.`); }
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
            <input style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"var(--db-text)", width:"100%" }} placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          {unread > 0 && <span className="sc-inbox-unread-badge">{unread} non lus</span>}
        </div>
        <div className="sc-tabs" style={{ padding:"0 8px", marginBottom:0 }}>
          {tabs.map(t => (
            <button key={t.key} className={`sc-tab${tab===t.key?" active":""}`} onClick={()=>setTab(t.key)} style={{ padding:"8px 12px", fontSize:11.5 }}>
              {t.lbl}<span className="sc-tab-n">{t.key==="Tout"?emails.length:emails.filter(e=>e.tag===t.key).length}</span>
            </button>
          ))}
        </div>
        <div className="sc-inbox-msgs">
          {filtered.length === 0 && <div className="sc-empty-state" style={{ padding:"2rem" }}>Aucun message</div>}
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
              <button className="sc-arr-btn" onClick={()=>setSelected(null)} style={{ display:"flex", alignItems:"center", gap:5 }}><Icon name="arrowL" size={14}/> Retour</button>
              <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                <button className="sc-btn-ghost" style={{ display:"flex", alignItems:"center", gap:5, fontSize:12 }} onClick={()=>setShowReply(s=>!s)}><Icon name="reply" size={13}/> Répondre</button>
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
                <div className="sc-inbox-reply-lbl">Répondre à {selected.from}</div>
                <textarea className="sc-inbox-reply-ta" placeholder="Votre réponse…" value={replyText} onChange={e=>setReplyText(e.target.value)} rows={4}/>
                <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
                  <button className="sc-btn-ghost" onClick={()=>setShowReply(false)}>Annuler</button>
                  <button className="sc-btn-primary" onClick={sendReply}><Icon name="send" size={13}/> Envoyer</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="sc-inbox-empty-detail">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>Sélectionnez un message pour le lire</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SETTINGS VIEW — connecté au backend
══════════════════════════════════════════ */
function SettingsView({ API, headers, showT }) {
  const [active, setActive]   = useState("Profil");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ fname:"", lname:"", email:"", phone:"", role:"" });
  const [notifPrefs, setNotifPrefs] = useState({ paiements:true, inscriptions:true, absences:true, systeme:false });
  const [security, setSecurity]     = useState({ cur:"", new:"", confirm:"" });
  const [secErr, setSecErr]         = useState({});

  useEffect(() => {
    fetch(`${API}/secretaire/profile`, { headers })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
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
      const res  = await fetch(`${API}/secretaire/profile`, {
        method:"PUT", headers,
        body: JSON.stringify({ nom: profile.lname, prenom: profile.fname, email: profile.email, telephone: profile.phone }),
      });
      const data = await res.json();
      if (data.success) showT("Profil enregistré !");
      else showT(`Erreur : ${data.message}`);
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
      const res  = await fetch(`${API}/secretaire/change-password`, {
        method:"PATCH", headers,
        body: JSON.stringify({ currentPwd: security.cur, newPwd: security.new }),
      });
      const data = await res.json();
      if (data.success) { setSecurity({ cur:"", new:"", confirm:"" }); showT("Mot de passe mis à jour !"); }
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
    { key:"Profil", icon:"user" }, { key:"Notifications", icon:"bell" },
    { key:"Sécurité", icon:"lock" }, { key:"Apparence", icon:"eye" },
  ];

  if (loading) return <div className="sc-empty-state">Chargement…</div>;

  const renderContent = () => {
    if (active === "Profil") return (
      <div className="sc-settings-section">
        <span className="sc-settings-title">Informations personnelles</span>
        <div className="sc-form-row">
          {[["Prénom","fname",profile.fname],["Nom","lname",profile.lname]].map(([lbl,k,v]) => (
            <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
              <input className="sc-input" value={v} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))}/>
            </div>
          ))}
        </div>
        {[["Email","email","email",profile.email],["Téléphone","phone","tel",profile.phone],["Rôle","role","text",profile.role]].map(([lbl,k,t,v]) => (
          <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
            <input className="sc-input" type={t} value={v} readOnly={k==="role"} style={{ opacity: k==="role" ? 0.6 : 1 }} onChange={e=>k!=="role"&&setProfile(p=>({...p,[k]:e.target.value}))}/>
          </div>
        ))}
        <div className="sc-settings-save-row">
          <button className="sc-btn-primary" onClick={saveProfile}><Icon name="check" size={13}/> Enregistrer</button>
        </div>
      </div>
    );
    if (active === "Notifications") return (
      <div className="sc-settings-section">
        <span className="sc-settings-title">Préférences de notifications</span>
        {[["Alertes paiements","paiements"],["Nouvelles inscriptions","inscriptions"],["Alertes absences","absences"],["Notifications système","systeme"]].map(([lbl,k]) => (
          <div key={k} className="sc-settings-row">
            <span className="sc-settings-lbl">{lbl}</span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Toggle value={notifPrefs[k]} onChange={v=>setNotifPrefs(p=>({...p,[k]:v}))}/>
              <span style={{ fontSize:12, color:"var(--db-text2)" }}>{notifPrefs[k]?"Activé":"Désactivé"}</span>
            </div>
          </div>
        ))}
        <div className="sc-settings-save-row"><button className="sc-btn-primary" onClick={() => showT("Préférences enregistrées !")}><Icon name="check" size={13}/> Enregistrer</button></div>
      </div>
    );
    if (active === "Sécurité") return (
      <div className="sc-settings-section">
        <span className="sc-settings-title">Modifier le mot de passe</span>
        {[["Mot de passe actuel","cur","Votre mot de passe"],["Nouveau mot de passe","new","Minimum 8 caractères"],["Confirmer","confirm","Répéter le nouveau"]].map(([lbl,k,ph]) => (
          <div key={k} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"var(--db-text)" }}>{lbl}</span>
            <input type="password" className="sc-input" placeholder={ph} value={security[k]} style={{ borderColor:secErr[k]?"var(--db-red)":undefined }} onChange={e=>{ setSecurity(s=>({...s,[k]:e.target.value})); setSecErr(er=>({...er,[k]:false})); }}/>
            {secErr[k] && <span style={{ fontSize:11, color:"var(--db-red)" }}>{k==="confirm"?"Ne correspond pas":k==="new"?"Min. 8 caractères":"Requis"}</span>}
          </div>
        ))}
        <button className="sc-btn-primary" style={{ alignSelf:"flex-start" }} onClick={savePassword}><Icon name="lock" size={13}/> Mettre à jour</button>
      </div>
    );
    if (active === "Apparence") return (
      <div className="sc-settings-section">
        <span className="sc-settings-title">Apparence</span>
        <div style={{ padding:"20px", background:"var(--db-bg)", borderRadius:"var(--db-r)", textAlign:"center", color:"var(--db-text2)", fontSize:13 }}>
          Thème clair activé — d'autres options disponibles prochainement.
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
// ✅ CORRIGÉ — avec Étudiants et Enseignants
const NAV_ITEMS = [
  { label:"Dashboard",       icon:"grid",     section:"main" },
  { label:"Inscriptions",    icon:"useradd",  section:"main" },
  { label:"Étudiants",       icon:"users",    section:"main" },   // ← ajouté
  { label:"Enseignants",     icon:"book",     section:"main" },   // ← ajouté
  { label:"Sections",        icon:"building", section:"main" },
  { label:"Emploi du temps", icon:"calendar", section:"main" },
  { label:"Paiements",       icon:"credit",   section:"gestion", badge:"pay" },
  { label:"Absences",        icon:"file",     section:"gestion", badge:"abs" },
  { label:"Notifications",   icon:"bell",     section:"gestion", badge:"notif" },
  { label:"Messagerie",      icon:"mail",     section:"gestion", badge:"mail" },
  { label:"Paramètres",      icon:"settings", section:"compte" },
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function SecretaireDashboard() {
  const [activeNav, setActiveNav]         = useState("Dashboard");
  const [collapsed, setCollapsed]         = useState(false);
  const [showRegister, setShowRegister]   = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toast, setToast]                 = useState(null);
  const [search, setSearch]               = useState("");

  // ── State principal — tout vide au départ, chargé depuis l'API ──
  const [sections,  setSections]  = useState([]);
  const [students,  setStudents]  = useState([]);
  const [pending,   setPending]   = useState([]);
  const [payments,  setPayments]  = useState([]);
  const [notifs,    setNotifs]    = useState([]);
  const [emails,    setEmails]    = useState([]);

  const TOKEN  = localStorage.getItem("token");
  const API    = "http://localhost:5000/api";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` };

  const showT = msg => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  /* ════════════════════════════════════════
     loadAll — charge tout depuis le backend
  ════════════════════════════════════════ */
  const loadAll = async () => {
    try {
      const [resUsers, resPay, resSections, resNotifs, resMsgs] = await Promise.allSettled([
        fetch(`${API}/users/role/etudiant`,        { headers }),
        fetch(`${API}/payments`,                    { headers }),
        fetch(`${API}/secretaire/sections`,         { headers }),
        fetch(`${API}/secretaire/notifications`,    { headers }),
        fetch(`${API}/secretaire/messages`,         { headers }),
      ]);

      // ── Étudiants (actifs + en attente) ──
      if (resUsers.status === "fulfilled") {
        const dataS = await resUsers.value.json();
        if (dataS.success) {
          setStudents(dataS.users
            .filter(s => s.actif === true)
            .map(s => ({
              id:       s._id,
              name:     `${s.prenom || ""} ${s.nom || ""}`.trim(),
              section:  s.section   || "À assigner",
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
              date:     new Date(s.createdAt).toLocaleDateString("fr-DZ"),
            }))
          );
        }
      }

      // ── Paiements ──
      if (resPay.status === "fulfilled") {
        const dataPay = await resPay.value.json();
        if (dataPay.success) {
          setPayments(dataPay.payments.map(p => ({
            id:      p.id      || p._id,
            name:    p.student || p.studentName || "—",
            amount:  p.amount,
            date:    new Date(p.due || p.createdAt).toLocaleDateString("fr-DZ"),
            method:  p.method  || "Espèces",
            status:  p.status,
            section: p.section || "—",
            month:   new Date(p.due || p.createdAt).toLocaleDateString("fr-DZ", { month:"long", year:"numeric" }),
          })));
        }
      }

      // ── Sections ──
      if (resSections.status === "fulfilled") {
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

      // ── Notifications ──
      if (resNotifs.status === "fulfilled") {
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

      // ── Messages ──
      if (resMsgs.status === "fulfilled") {
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
      console.error("Erreur loadAll:", err);
    }
  };

  // Chargement unique au montage
  useEffect(() => { loadAll(); }, []);

  /* ════════════════════════════════════════
     Badges sidebar
  ════════════════════════════════════════ */
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

  /* ════════════════════════════════════════
     Rendu des vues
  ════════════════════════════════════════ */
const renderView = () => {
  switch (activeNav) {
    case "Étudiants":
      return <EtudiantsView API={API} headers={headers} showT={showT}/>;
    case "Enseignants":
      return <TeachersView API={API} headers={headers} showT={showT}/>;
    case "Inscriptions":
      return <InscriptionsView students={students} pending={pending} sections={sections} showRegister={()=>setShowRegister(true)} API={API} headers={headers} loadAll={loadAll} showT={showT}/>;
    case "Sections":
      return <SectionsView sections={sections} setSections={setSections} API={API} headers={headers} showT={showT}/>;
    case "Emploi du temps":
      return <TimetableView API={API} headers={headers} sections={sections} showT={showT}/>;
    case "Paiements":
      return <PaiementsView payments={payments} setPayments={setPayments} students={students} showPayment={()=>setShowPaymentModal(true)} API={API} headers={headers} showT={showT}/>;
    case "Absences":
      return <AbsencesView students={students} API={API} headers={headers} showT={showT}/>;
    case "Notifications":
      return <NotificationsView notifs={notifs} setNotifs={setNotifs} API={API} headers={headers} showT={showT}/>;
    case "Messagerie":
      return <InboxView emails={emails} setEmails={setEmails} API={API} headers={headers} showT={showT}/>;
    case "Paramètres":
      return <SettingsView API={API} headers={headers} showT={showT}/>;
    default:
      return (
        <DashboardView
          sections={sections} pending={pending} setPending={setPending}
          payments={payments} students={students} setActiveNav={setActiveNav}
          showRegister={() => setShowRegister(true)}
          showPayment={() => setShowPaymentModal(true)}
          API={API} headers={headers} loadAll={loadAll} showT={showT}
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
          {!collapsed && <div className="sc-logo-text"><h2>Language</h2><span>Secrétariat</span></div>}
        </div>
        <button className="sc-toggle" onClick={() => setCollapsed(c=>!c)}>{collapsed?"›":"‹"}</button>
        {!collapsed && (
          <div className="sc-profile-mini">
            <div className="sc-avatar-sm">MB</div>
            <div><span className="sc-pname">Mohammed B.</span><span className="sc-prole">Secrétaire</span></div>
          </div>
        )}
        <nav className="sc-nav">
          {["main","gestion","compte"].map(sec => (
            <React.Fragment key={sec}>
              {!collapsed && <span className="sc-nav-label">{sec==="main"?"Principal":sec==="gestion"?"Gestion":"Compte"}</span>}
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
          <button className="sc-nav-item sc-nav-danger" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("nom"); localStorage.removeItem("prenom"); window.location.href = "/login"; }}>
            <span className="sc-nav-icon"><Icon name="logout" size={15}/></span>
            {!collapsed && <span className="sc-nav-text">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="sc-main">
        <header className="sc-header">
          <div className="sc-header-left">
            <div className="sc-header-title">{activeNav}</div>
            <span className="sc-header-sub">Semestre de printemps 2026</span>
          </div>
          <div className="sc-search">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher un étudiant, une section…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="sc-header-right">
            <button className="sc-btn-primary sc-btn-sm" onClick={()=>setShowRegister(true)}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:4 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Inscrire
            </button>
            <button className="sc-icon-btn" title="Messagerie" onClick={()=>setActiveNav("Messagerie")}>
              <Icon name="mail" size={17}/>
              {unreadMail > 0 && <span className="sc-badge"/>}
            </button>
            <button className="sc-icon-btn" title="Notifications" onClick={()=>setActiveNav("Notifications")}>
              <Icon name="bell" size={17}/>
              {unreadNotif > 0 && <span className="sc-badge"/>}
            </button>
            <div className="sc-profile-chip" onClick={()=>setActiveNav("Paramètres")}>
              <div className="sc-avatar">MB</div>
              <div><span className="sc-pname">Mohammed B.</span><span className="sc-prole">Secrétaire</span></div>
            </div>
          </div>
        </header>
        <main className="sc-content">{renderView()}</main>
      </div>

      {/* MODAL INSCRIPTION */}
      {showRegister && (
        <RegisterModal
          sections={sections}
          onClose={() => setShowRegister(false)}
          onSuccess={async (student) => {
            try {
              const res  = await fetch(`${API}/secretaire/students/register`, {
                method: "POST", headers,
                body: JSON.stringify({
                  nom:       student.name.split(" ")[0],
                  prenom:    student.name.split(" ")[1] || "",
                  email:     student.email,
                  telephone: student.phone,
                  language:  student.language,
                  level:     student.level,
                  section:   student.section,
                  password:  "etudiant123",
                }),
              });
              const data = await res.json();
              if (data.success) { await loadAll(); showT(`Inscription enregistrée en attente.`); }
              else showT(`Erreur : ${data.message}`);
            } catch (err) { console.error(err); showT("Erreur de connexion."); }
          }}
        />
      )}

      {/* MODAL PAIEMENT */}
      {showPaymentModal && (
        <PaymentModal
          students={students}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async (payment) => {
            try {
              const student = students.find(s => s.name === payment.name);
              const res  = await fetch(`${API}/payments`, {
                method: "POST", headers,
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
              const data = await res.json();
              if (data.success) { await loadAll(); showT(`Paiement de ${payment.amount.toLocaleString()} DA enregistré.`); }
              else showT(`Erreur : ${data.message}`);
            } catch (err) { console.error(err); showT("Erreur de connexion."); }
          }}
        />
      )}

      {toast && <Toast msg={toast}/>}
    </div>
  );
}