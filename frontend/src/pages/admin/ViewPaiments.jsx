import React, { useState, useEffect, useRef } from "react";
import "../../styles/ViewPaiments.css";

/* ─────────────────────────────────────────────────────────────
   DONNÉES
───────────────────────────────────────────────────────────── */
const PAYMENTS = [
  { id:"INV-2026-041", student:"Bouchemot Mohammed", lang:"Anglais",  level:"B2", amount:4500, paid:4500, due:"10 Avr", status:"paid",    method:"Carte"    },
  { id:"INV-2026-040", student:"Boumalek Abdellah",  lang:"Français", level:"A1", amount:3800, paid:0,    due:"9 Avr",  status:"overdue", method:"—"        },
  { id:"INV-2026-039", student:"Boudjit Youcef",     lang:"Espagnol", level:"C1", amount:5200, paid:2600, due:"15 Avr", status:"partial", method:"Espèces"  },
  { id:"INV-2026-038", student:"Bouchekrit Abdou",   lang:"Allemand", level:"B1", amount:4200, paid:4200, due:"7 Avr",  status:"paid",    method:"Carte"    },
  { id:"INV-2026-037", student:"Bouchair Rami",      lang:"Mandarin", level:"A2", amount:4800, paid:0,    due:"20 Avr", status:"pending", method:"—"        },
  { id:"INV-2026-036", student:"Meziane Salim",      lang:"Anglais",  level:"C2", amount:5500, paid:5500, due:"5 Avr",  status:"paid",    method:"Virement" },
  { id:"INV-2026-035", student:"Khelifi Nour",       lang:"Français", level:"B1", amount:3800, paid:1900, due:"18 Avr", status:"partial", method:"Espèces"  },
  { id:"INV-2026-034", student:"Hamidi Anis",        lang:"Italien",  level:"A1", amount:3500, paid:3500, due:"3 Avr",  status:"paid",    method:"Carte"    },
];

const MONTHLY = [
  { m:"Oct", v:182000 }, { m:"Nov", v:195000 }, { m:"Déc", v:171000 },
  { m:"Jan", v:208000 }, { m:"Fév", v:224000 }, { m:"Mar", v:237000 },
  { m:"Avr", v:148000 },
];

const FILTERS = ["Tous","Payé","Partiel","En attente","Impayé"];

const STATUS = {
  paid:    { cls:"vp-st-paid",    label:"Payé",        dot:"#27500A", prog:"#3B6D11" },
  partial: { cls:"vp-st-partial", label:"Partiel",     dot:"#0C447C", prog:"#185FA5" },
  pending: { cls:"vp-st-pending", label:"En attente",  dot:"#633806", prog:"#B5D4F4" },
  overdue: { cls:"vp-st-overdue", label:"Impayé",      dot:"#A32D2D", prog:"#A32D2D" },
};

const LEVEL_CLS = { A:"db-lv-a", B:"db-lv-b", C:"db-lv-c" };

/* ─────────────────────────────────────────────────────────────
   UTILITAIRES
───────────────────────────────────────────────────────────── */
const fmt      = n => n.toLocaleString("fr-DZ") + " DA";
const initials = n => n.split(" ").map(w => w[0]).join("").slice(0, 2);
const pct      = d => Math.round((d.paid / d.amount) * 100);

/* ─────────────────────────────────────────────────────────────
   HOOK count-up
───────────────────────────────────────────────────────────── */
function useCountUp(target, dur = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let t0 = null;
    const step = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [target, dur]);
  return val.toLocaleString("fr-DZ") + " DA";
}

/* ─────────────────────────────────────────────────────────────
   GRAPHIQUE LINÉAIRE SVG
   (même style que LineChart du Dashboard)
───────────────────────────────────────────────────────────── */
function RevenueChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 560, H = 148;
  const PAD = { t: 12, r: 10, b: 28, l: 42 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const minV = 140000;
  const maxV = Math.max(...data.map(d => d.v));

  const xs = data.map((_, i) => PAD.l + i * (cw / (data.length - 1)));
  const yv = v => PAD.t + ch - ((v - minV) / (maxV - minV)) * ch;

  const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"}${xs[i]},${yv(d.v)}`).join(" ");
  const areaD = pathD + ` L${xs[xs.length - 1]},${H - PAD.b} L${PAD.l},${H - PAD.b} Z`;
  const grids = [160000, 190000, 220000];

  return (
    <div className="vp-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="db-line-svg" style={{ width: "100%", height: H }}>
        <defs>
          <linearGradient id="vp-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#185FA5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#185FA5" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {grids.map(v => (
          <g key={v}>
            <line x1={PAD.l} y1={yv(v)} x2={W - PAD.r} y2={yv(v)}
              stroke="rgba(0,0,0,0.07)" strokeWidth="0.8" strokeDasharray="4 3" />
            <text x={PAD.l - 5} y={yv(v) + 4} fontSize="10"
              fill="var(--db-text3,#999)" textAnchor="end">{Math.round(v / 1000)}k</text>
          </g>
        ))}

        {data.map((d, i) => (
          <text key={d.m} x={xs[i]} y={H - 5} fontSize="10"
            fill="var(--db-text2,#666)" textAnchor="middle">{d.m}</text>
        ))}

        <path d={areaD} fill="url(#vp-area)" />
        <path d={pathD} fill="none" stroke="#185FA5" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => (
          <circle key={d.m} cx={xs[i]} cy={yv(d.v)} r="4"
            fill={i === data.length - 1 ? "#185FA5" : "#fff"}
            stroke="#185FA5" strokeWidth="2.5"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, ...d })}
            onMouseLeave={() => setTooltip(null)} />
        ))}
      </svg>

      {tooltip && (
        <div className="db-chart-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 44 }}>
          <strong>{tooltip.m} 2026</strong>
          {fmt(tooltip.v)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DONUT SVG
───────────────────────────────────────────────────────────── */
function Donut({ counts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const slices = [
    { key: "paid",    color: "#3B6D11", label: "Payé"       },
    { key: "partial", color: "#185FA5", label: "Partiel"    },
    { key: "pending", color: "#854F0B", label: "En attente" },
    { key: "overdue", color: "#A32D2D", label: "Impayé"     },
  ];
  const R = 50, cx = 60, cy = 60, sw = 18;
  const r = R - sw / 2;
  const C = 2 * Math.PI * r;
  let cum = 0;

  return (
    <div className="vp-donut-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
        {slices.map(s => {
          const frac = counts[s.key] / total;
          const dash = frac * C;
          const offset = C - cum * C;
          cum += frac;
          return (
            <circle key={s.key} cx={cx} cy={cy} r={r}
              fill="none" stroke={s.color} strokeWidth={sw}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={offset}
              style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }} />
          );
        })}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="17" fontWeight="600"
          fill="var(--db-text,#1a1a1a)">
          {Math.round((counts.paid / total) * 100)}%
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9"
          fill="var(--db-text2,#666)">collecté</text>
      </svg>

      <div className="vp-donut-legend">
        {slices.map(s => (
          <div className="vp-donut-row" key={s.key}>
            <div className="vp-donut-dot" style={{ background: s.color }} />
            <span className="vp-donut-lbl">{s.label}</span>
            <span className="vp-donut-n">{counts[s.key]}</span>
            <span className="vp-donut-pct">{Math.round((counts[s.key] / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD  (réutilise .db-stat / .db-stat-ic du Dashboard)
───────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, delta, icBg, icColor, deltaColor }) {
  return (
    <div className="db-stat">
      <div className="db-stat-ic" style={{ background: icBg, color: icColor }}>{icon}</div>
      <div className="db-stat-body">
        <span className="db-stat-lbl">{label}</span>
        <strong className="db-stat-val">{value}</strong>
        <span className="db-stat-dl" style={{ color: deltaColor }}>{delta}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────────── */
function Modal({ payment, onClose }) {
  const barRef = useRef(null);

  useEffect(() => {
    if (!payment) return;
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = pct(payment) + "%";
    }, 60);
    return () => clearTimeout(t);
  }, [payment]);

  if (!payment) return null;

  const remaining = payment.amount - payment.paid;
  const p         = pct(payment);
  const st        = STATUS[payment.status];

  const rows = [
    ["Langue / Niveau", `${payment.lang} · ${payment.level}`],
    ["Montant total",   fmt(payment.amount)],
    ["Montant payé",    payment.paid > 0 ? fmt(payment.paid) : "—"],
    ["Reste à payer",   fmt(remaining)],
    ["Échéance",        payment.due],
    ["Méthode",         payment.method],
  ];

  return (
    <div className="vp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="vp-modal">
        {/* top */}
        <div className="vp-modal-top">
          <div className="vp-modal-head">
            <div>
              <span className="vp-modal-id">{payment.id}</span>
              <span className="vp-modal-name">{payment.student}</span>
            </div>
            <button className="vp-modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="vp-modal-meta">
            <span className={`db-status ${st.cls}`}>
              <span className="db-dot" style={{ background: st.dot }} />{st.label}
            </span>
            <span className={`db-lvl ${LEVEL_CLS[payment.level[0]]}`}>{payment.level}</span>
            <span style={{ fontSize: 12, color: "var(--db-text2,#666)" }}>{payment.lang}</span>
          </div>
        </div>

        {/* rows */}
        <div className="vp-modal-body">
          {rows.map(([k, v], i) => (
            <div className="vp-modal-row" key={i}>
              <span>{k}</span>
              <strong
                style={
                  k === "Reste à payer"
                    ? { color: remaining > 0 ? "#A32D2D" : "#27500A" }
                    : k === "Montant payé"
                    ? { color: payment.paid > 0 ? "#27500A" : "var(--db-text3,#999)" }
                    : {}
                }>
                {v}
              </strong>
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="vp-modal-foot">
          <div className="vp-modal-bar-wrap">
            <div className="vp-modal-bar-track">
              <div className="vp-modal-bar-fill" ref={barRef} style={{ width: 0 }} />
            </div>
            <span className="vp-modal-bar-pct">{p}% payé</span>
          </div>
          {remaining > 0 && (
            <button className="vp-modal-btn-primary">Enregistrer un paiement</button>
          )}
          <button className="vp-modal-btn-ghost" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────────────────────── */
const ViewPayments = () => {
  const [filter,  setFilter]  = useState("Tous");
  const [search,  setSearch]  = useState("");
  const [selected, setSelected] = useState(null);

  /* KPI count-ups */
  const total     = useCountUp(1365000);
  const collected = useCountUp(878500);
  const pending   = useCountUp(486500);
  const overdue   = useCountUp(38000);

  /* counts par statut */
  const counts = {
    paid:    PAYMENTS.filter(p => p.status === "paid").length,
    partial: PAYMENTS.filter(p => p.status === "partial").length,
    pending: PAYMENTS.filter(p => p.status === "pending").length,
    overdue: PAYMENTS.filter(p => p.status === "overdue").length,
  };

  /* mapping onglet → clé statut */
  const TAB_KEY = { "Tous": null, "Payé":"paid", "Partiel":"partial", "En attente":"pending", "Impayé":"overdue" };
  const TAB_CNT = { "Tous": PAYMENTS.length, "Payé": counts.paid, "Partiel": counts.partial, "En attente": counts.pending, "Impayé": counts.overdue };

  const filtered = PAYMENTS.filter(d => {
    const fk = TAB_KEY[filter];
    const mf = !fk || d.status === fk;
    const q  = search.toLowerCase();
    const ms = !q || d.student.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.lang.toLowerCase().includes(q);
    return mf && ms;
  });

  /* icônes SVG inline */
  const ic = (path, extra = "") => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />{extra && <path d={extra} />}
    </svg>
  );

  const SearchIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  const PlusIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  const ExportIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );

  return (
    <div className="vp-page">

      {/* ── KPI STRIP (classes db-stats/db-stat du Dashboard) ── */}
      <div className="db-stats">
        <StatCard
          icon={ic("M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6")}
          label="Revenu total" value={total} delta="+8.4% ce mois"
          icBg="#E6F1FB" icColor="#185FA5" deltaColor="#3B6D11" />
        <StatCard
          icon={ic("M20 6L9 17l-5-5")}
          label="Collecté" value={collected} delta="64.3 % du total"
          icBg="#EAF3DE" icColor="#3B6D11" deltaColor="#3B6D11" />
        <StatCard
          icon={ic("M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6v6l4 2")}
          label="En attente" value={pending} delta="3 étudiants"
          icBg="#FAEEDA" icColor="#633806" deltaColor="#633806" />
        <StatCard
          icon={ic("M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z","M12 8v4M12 16h.01")}
          label="Impayés" value={overdue} delta="1 étudiant"
          icBg="#FCEBEB" icColor="#A32D2D" deltaColor="#A32D2D" />
      </div>

      {/* ── MID ROW ── */}
      <div className="vp-mid">

        {/* Graphique revenus */}
        <div className="db-panel">
          <div className="db-ph">
            <div>
              <span className="db-pt">Revenus mensuels</span>
              <span className="db-ps">7 derniers mois · DA</span>
            </div>
            <span className="db-chip">2025–2026</span>
          </div>
          <RevenueChart data={MONTHLY} />
        </div>

        {/* Donut statuts */}
        <div className="db-panel">
          <div className="db-ph">
            <span className="db-pt">Statut des paiements</span>
          </div>
          <Donut counts={counts} />
        </div>
      </div>

      {/* ── TABLEAU ── */}
      <div className="db-panel">
        <div className="db-ph" style={{ flexWrap: "wrap", gap: 10 }}>
          <div>
            <span className="db-pt">Factures</span>
            <span className="db-ps">{filtered.length} enregistrement{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="vp-controls">
            <div className="vp-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Rechercher…"
                value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="vp-btn-export">
              <ExportIcon /> Export
            </button>
            <button className="vp-btn-new">
              <PlusIcon /> Nouveau
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="vp-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`vp-tab${filter === f ? " vp-tab-active" : ""}`}
              onClick={() => setFilter(f)}>
              {f}
              <span className="vp-tab-n">{TAB_CNT[f]}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="vp-tbl-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th>N° Facture</th>
                <th>Étudiant</th>
                <th className="vp-col-level">Niveau</th>
                <th>Montant</th>
                <th className="vp-col-paid">Payé</th>
                <th className="vp-col-prog">Progression</th>
                <th>Échéance</th>
                <th>Statut</th>
                <th className="vp-col-method">Méthode</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const st = STATUS[d.status];
                return (
                  <tr key={d.id} className="vp-row" onClick={() => setSelected(d)}>
                    <td><span className="vp-inv-id">{d.id}</span></td>
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
                      <span className={`db-lvl ${LEVEL_CLS[d.level[0]]}`}>{d.level}</span>
                    </td>
                    <td><span className="vp-amount">{fmt(d.amount)}</span></td>
                    <td className="vp-col-paid">
                      <span className="vp-paid-cell"
                        style={{ color: d.paid > 0 ? "#3B6D11" : "var(--db-text3,#999)" }}>
                        {d.paid > 0 ? fmt(d.paid) : "—"}
                      </span>
                    </td>
                    <td className="vp-col-prog">
                      <div className="vp-prog">
                        <div className="vp-prog-track">
                          <div className="vp-prog-fill"
                            style={{ width: pct(d) + "%", background: st.prog }} />
                        </div>
                        <span className="vp-prog-pct">{pct(d)}%</span>
                      </div>
                    </td>
                    <td className="db-date-cell">{d.due}</td>
                    <td>
                      <span className={`db-status ${st.cls}`}>
                        <span className="db-dot" style={{ background: st.dot }} />
                        {st.label}
                      </span>
                    </td>
                    <td className="vp-method vp-col-method">{d.method}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="vp-empty">
              <div className="vp-empty-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span className="vp-empty-title">Aucun résultat</span>
              <span className="vp-empty-sub">Essayez un autre filtre ou terme de recherche.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      <Modal payment={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default ViewPayments;
