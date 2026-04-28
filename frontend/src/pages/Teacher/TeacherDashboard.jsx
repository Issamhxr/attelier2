import React, { useState, useEffect, useRef, useMemo } from "react";
import "../../styles/DT.css";

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const STUDENTS = [
  { id:1, name:"Abdou Bouchekrit",  email:"abdoubouchekrit2@gmail.com",  pay:"200DA",  date:"19 Apr 2026", present:true,  level:"B2", language:"English",  phone:"+213 555 001 001" },
  { id:2, name:"Rami Bouchair",     email:"rami.bouchair@gmail.com",     pay:"200DA",  date:"10 Apr 2026", present:true,  level:"A2", language:"Mandarin", phone:"+213 555 002 002" },
  { id:3, name:"Islem Bouchaffa",   email:"islem.bouchaffa@gmail.com",   pay:"1800DA", date:"19 Apr 2026", present:false, level:"C1", language:"Spanish",  phone:"+213 555 003 003" },
  { id:4, name:"Youcef Boudjit",    email:"youcef.boudjit@gmail.com",    pay:"200DA",  date:"08 Apr 2026", present:true,  level:"B1", language:"German",   phone:"+213 555 004 004" },
  { id:5, name:"Abdellah Boumalek", email:"abdellah.boumalek@gmail.com", pay:"200DA",  date:"07 Apr 2026", present:false, level:"A1", language:"French",   phone:"+213 555 005 005" },
  { id:6, name:"Sara Meziane",      email:"sara.meziane@gmail.com",      pay:"1500DA", date:"15 Apr 2026", present:true,  level:"B1", language:"English",  phone:"+213 555 006 006" },
  { id:7, name:"Amira Kaci",        email:"amira.kaci@gmail.com",        pay:"200DA",  date:"12 Apr 2026", present:true,  level:"B2", language:"French",   phone:"+213 555 007 007" },
  { id:8, name:"Yacine Hamdi",      email:"yacine.hamdi@gmail.com",      pay:"200DA",  date:"11 Apr 2026", present:false, level:"A1", language:"Arabic",   phone:"+213 555 008 008" },
];

const MESSAGES = [
  { id:1,  from:"Admin Principal",    avatar:"AP", role:"Administrator", time:"10:32",       date:"Today",     subject:"Weekly attendance report",          body:"Please review and validate the weekly attendance report before end of day. The document has been uploaded to the shared drive.",                          unread:true,  starred:true  },
  { id:2,  from:"Abdou Bouchekrit",  avatar:"AB", role:"Student",       time:"09:15",       date:"Today",     subject:"Question about homework",            body:"Hello teacher, I have a question about the homework you assigned yesterday. Could you clarify the instructions for exercise 3? Thank you.",            unread:true,  starred:false },
  { id:3,  from:"Rami Bouchair",     avatar:"RB", role:"Student",       time:"Yesterday",   date:"Yesterday", subject:"Absent tomorrow",                   body:"Dear teacher, I wanted to inform you that I will be absent tomorrow due to a medical appointment. I will catch up on any missed work.",               unread:false, starred:false },
  { id:4,  from:"Sara Meziane",      email:"sara.meziane@gmail.com", avatar:"SM", role:"Student", time:"Yesterday", date:"Yesterday", subject:"Payment receipt",       body:"Hi, I have sent my payment receipt for this month. Please confirm once you have received it. The reference number is TXN-20260415.",            unread:false, starred:true  },
  { id:5,  from:"Admin Principal",   avatar:"AP", role:"Administrator", time:"Mon",         date:"Mon 13 Apr", subject:"Staff meeting – Friday 17 Apr",    body:"Reminder: there is a mandatory staff meeting this Friday at 14:00 in the main hall. Please confirm your attendance by replying to this message.",  unread:false, starred:false },
  { id:6,  from:"Islem Bouchaffa",   avatar:"IB", role:"Student",       time:"Mon",         date:"Mon 13 Apr", subject:"Re: Spanish C1 materials",         body:"Thank you for sending the materials! I have started working through them and I think they are very helpful. I will be ready for the test.",         unread:false, starred:false },
  { id:7,  from:"Youcef Boudjit",    avatar:"YB", role:"Student",       time:"Sun",         date:"Sun 12 Apr", subject:"Certificate request",               body:"Hello, I would like to request a certificate of attendance for my German B1 course. Could you please let me know the procedure? Thank you.",        unread:false, starred:false },
  { id:8,  from:"Abdellah Boumalek", avatar:"AB2",role:"Student",       time:"11 Apr",      date:"11 Apr",    subject:"French A1 – catch up session",      body:"Dear teacher, I missed the last two sessions. Is it possible to schedule a catch-up session at your convenience? I am available most afternoons.", unread:false, starred:false },
];

const TIMETABLE = {
  Mon: [
    { time:"08:00–09:30", subject:"English B2",   room:"A101", students:12, color:"blue"  },
    { time:"10:00–11:30", subject:"French A1",    room:"B203", students:8,  color:"green" },
    { time:"14:00–15:30", subject:"Spanish C1",   room:"A104", students:6,  color:"amber" },
  ],
  Tue: [
    { time:"09:00–10:30", subject:"German B1",    room:"C301", students:9,  color:"blue"  },
    { time:"11:00–12:30", subject:"Mandarin A2",  room:"B202", students:7,  color:"red"   },
  ],
  Wed: [
    { time:"08:00–09:30", subject:"English B2",   room:"A101", students:12, color:"blue"  },
    { time:"10:00–11:30", subject:"Arabic A1",    room:"A103", students:10, color:"green" },
    { time:"13:00–14:30", subject:"French A1",    room:"B203", students:8,  color:"green" },
    { time:"15:00–16:30", subject:"Spanish C1",   room:"A104", students:6,  color:"amber" },
  ],
  Thu: [
    { time:"09:00–10:30", subject:"German B1",    room:"C301", students:9,  color:"blue"  },
    { time:"11:00–12:30", subject:"English B2",   room:"A101", students:12, color:"blue"  },
  ],
  Fri: [
    { time:"08:00–09:30", subject:"Mandarin A2",  room:"B202", students:7,  color:"red"   },
    { time:"10:00–11:30", subject:"Arabic A1",    room:"A103", students:10, color:"green" },
    { time:"14:00–15:00", subject:"Staff Meeting",room:"Hall", students:0,  color:"amber" },
  ],
  Sat: [
    { time:"09:00–10:30", subject:"English B2",   room:"A101", students:12, color:"blue"  },
    { time:"11:00–12:30", subject:"French A1",    room:"B203", students:8,  color:"green" },
  ],
  Sun: [],
};

const COURSES = [
  { id:1, name:"English B2",   teacher:"Mohammed Bouchemot", students:12, sessions:"Mon, Wed, Thu, Sat", room:"A101", color:"blue",  progress:68 },
  { id:2, name:"French A1",    teacher:"Mohammed Bouchemot", students:8,  sessions:"Mon, Wed, Sat",      room:"B203", color:"green", progress:45 },
  { id:3, name:"Spanish C1",   teacher:"Mohammed Bouchemot", students:6,  sessions:"Mon, Wed",           room:"A104", color:"amber", progress:82 },
  { id:4, name:"German B1",    teacher:"Mohammed Bouchemot", students:9,  sessions:"Tue, Thu",           room:"C301", color:"blue",  progress:53 },
  { id:5, name:"Mandarin A2",  teacher:"Mohammed Bouchemot", students:7,  sessions:"Tue, Fri",           room:"B202", color:"red",   progress:37 },
  { id:6, name:"Arabic A1",    teacher:"Mohammed Bouchemot", students:10, sessions:"Wed, Fri",           room:"A103", color:"green", progress:71 },
];

const navItems = [
  { label:"Home",      icon:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label:"Profile",   icon:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label:"Timetable", icon:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label:"Students",  icon:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label:"Courses",   icon:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  { label:"Messages",  icon:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const initials = (name) => name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

function useCountUp(target, duration=1200) {
  const [value, setValue] = useState(0);
  useEffect(()=>{
    let s=null;
    const step=(ts)=>{ if(!s) s=ts; const p=Math.min((ts-s)/duration,1); const e=1-Math.pow(1-p,3); setValue(Math.round(e*target)); if(p<1) requestAnimationFrame(step); };
    const r=requestAnimationFrame(step);
    return()=>cancelAnimationFrame(r);
  },[target,duration]);
  return value.toLocaleString();
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════ */
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`tc-stat tc-stat--${color}`}>
      <div className="tc-stat-ic">{icon}</div>
      <div className="tc-stat-body">
        <span className="tc-stat-lbl">{label}</span>
        <strong className="tc-stat-val">{value}</strong>
        {sub && <span className="tc-stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
function HomePage({ onNavigate }) {
  const presentCount = STUDENTS.filter(s=>s.present).length;
  const absentCount  = STUDENTS.filter(s=>!s.present).length;
  const unreadCount  = MESSAGES.filter(m=>m.unread).length;
  const totalStudents = useCountUp(200);
  const totalCourses  = useCountUp(20);

  const todayDay = "Wed";
  const todayClasses = TIMETABLE[todayDay] || [];

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p>Manage your students, courses, and attendance</p>
        </div>
      </div>

      <div className="tc-stats">
        <StatCard color="blue"  label="Total Students" value={totalStudents} sub="+5 this month"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard color="green" label="Courses" value={totalCourses} sub="6 languages"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
        />
        <StatCard color="amber" label="Absences Today" value={absentCount} sub={`${presentCount} present`}
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>}
        />
        <StatCard color="blue"  label="Unread Messages" value={unreadCount} sub="4 unread"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
        />
      </div>

      <div className="tc-home-grid">
        {/* Today's schedule */}
        <div className="tc-panel">
          <div className="tc-panel-header">
            <div><span className="tc-panel-title">Today's Schedule</span><span className="tc-panel-sub">Wednesday, April 16</span></div>
            <button className="tc-btn-link" onClick={()=>onNavigate("Timetable")}>View all →</button>
          </div>
          {todayClasses.length === 0
            ? <div className="tc-empty-state"><span>No classes today 🎉</span></div>
            : todayClasses.map((c,i)=>(
              <div key={i} className={`tc-schedule-item tc-schedule-item--${c.color}`}>
                <div className="tc-schedule-time">{c.time}</div>
                <div className="tc-schedule-body">
                  <span className="tc-schedule-name">{c.subject}</span>
                  <span className="tc-schedule-meta">{c.room} · {c.students} students</span>
                </div>
              </div>
            ))
          }
        </div>

        {/* Recent messages */}
        <div className="tc-panel">
          <div className="tc-panel-header">
            <div><span className="tc-panel-title">Recent Messages</span><span className="tc-panel-sub">{unreadCount} unread</span></div>
            <button className="tc-btn-link" onClick={()=>onNavigate("Messages")}>View all →</button>
          </div>
          {MESSAGES.slice(0,4).map(m=>(
            <div key={m.id} className={`tc-msg-preview${m.unread?" tc-msg-preview--unread":""}`}>
              <div className="tc-mini-av tc-mini-av--blue">{m.avatar.slice(0,2)}</div>
              <div className="tc-msg-preview-body">
                <div className="tc-msg-preview-top">
                  <span className="tc-msg-preview-from">{m.from}</span>
                  <span className="tc-msg-preview-time">{m.time}</span>
                </div>
                <span className="tc-msg-preview-subject">{m.subject}</span>
              </div>
              {m.unread && <span className="tc-unread-dot"/>}
            </div>
          ))}
        </div>

        {/* Attendance summary */}
        <div className="tc-panel">
          <div className="tc-panel-header">
            <div><span className="tc-panel-title">Attendance Summary</span><span className="tc-panel-sub">Today's class</span></div>
            <button className="tc-btn-link" onClick={()=>onNavigate("Students")}>View all →</button>
          </div>
          <div className="tc-att-summary">
            <div className="tc-att-donut-wrap">
              <svg width="90" height="90" viewBox="0 0 90 90">
                {(()=>{
                  const r=32, cx=45, cy=45, sw=14, C=2*Math.PI*r;
                  const pPct=presentCount/(presentCount+absentCount);
                  return (<>
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EAF3DE" strokeWidth={sw}/>
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3B6D11" strokeWidth={sw}
                      strokeDasharray={`${pPct*C} ${C}`} strokeDashoffset={C/4}
                      style={{transform:"rotate(-90deg)",transformOrigin:`${cx}px ${cy}px`}}/>
                    <text x={cx} y={cy-3} textAnchor="middle" fontSize="14" fontWeight="600" fill="#1a1a1a">{Math.round(pPct*100)}%</text>
                    <text x={cx} y={cy+12} textAnchor="middle" fontSize="8" fill="#666">present</text>
                  </>);
                })()}
              </svg>
              <div className="tc-att-legend">
                <div className="tc-att-leg-row"><span className="tc-att-dot tc-att-dot--green"/><span>Present</span><strong>{presentCount}</strong></div>
                <div className="tc-att-leg-row"><span className="tc-att-dot tc-att-dot--amber"/><span>Absent</span><strong>{absentCount}</strong></div>
              </div>
            </div>
          </div>
          <div className="tc-att-list">
            {STUDENTS.slice(0,4).map(s=>(
              <div key={s.id} className="tc-att-row">
                <div className="tc-mini-av tc-mini-av--blue">{initials(s.name)}</div>
                <span className="tc-att-name">{s.name}</span>
                <span className={`tc-status ${s.present?"tc-status--present":"tc-status--absent"}`}>
                  <span className="tc-dot"/>{s.present?"Present":"Absent"}
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
function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [profile, setProfile] = useState({
    fname:"Mohammed", lname:"Bouchemot",
    email:"m.bouchemot@languageschool.dz",
    phone:"+213 555 100 200",
    dob:"1985-06-14",
    address:"12 Rue des Frères Bouali, Blida",
    bio:"Experienced language teacher with 10+ years of teaching English and French. Passionate about communicative methods and student-centered learning.",
    languages:["English","French","Spanish"],
    levels:["A1","A2","B1","B2","C1","C2"],
    experience:"10 years",
    education:"Master's in Applied Linguistics – Université de Blida",
  });

  const set = (key, val) => setProfile(p=>({...p,[key]:val}));

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(()=>setSaved(false), 2500);
  };

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div><h1>My Profile</h1><p>Manage your personal and professional information</p></div>
        <button className={`tc-btn-primary${editing?" tc-btn-cancel":""}`} onClick={()=>editing?handleSave():setEditing(true)}>
          {editing
            ? <><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Save changes</>
            : <><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit profile</>
          }
        </button>
      </div>

      {saved && <div className="tc-toast"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Profile saved successfully!</div>}

      <div className="tc-profile-page-grid">
        {/* Left: avatar + summary */}
        <div className="tc-panel tc-profile-card">
          <div className="tc-profile-avatar-wrap">
            <div className="tc-profile-big-av">MB</div>
            {editing && <button className="tc-btn-upload-av">Change photo</button>}
          </div>
          <strong className="tc-profile-fullname">{profile.fname} {profile.lname}</strong>
          <span className="tc-profile-role-badge">Teacher</span>
          <span className="tc-profile-email">{profile.email}</span>
          <div className="tc-profile-stats-row">
            <div className="tc-profile-stat"><strong>{STUDENTS.length}</strong><span>Students</span></div>
            <div className="tc-profile-stat"><strong>{COURSES.length}</strong><span>Courses</span></div>
            <div className="tc-profile-stat"><strong>10y</strong><span>Experience</span></div>
          </div>
          <div className="tc-profile-langs">
            <span className="tc-profile-sec-label">Languages taught</span>
            <div className="tc-chip-row">
              {profile.languages.map(l=><span key={l} className="tc-chip tc-chip--blue">{l}</span>)}
            </div>
          </div>
          <div className="tc-profile-langs">
            <span className="tc-profile-sec-label">Levels</span>
            <div className="tc-chip-row">
              {profile.levels.map(lv=><span key={lv} className={`tc-chip tc-chip--lv tc-chip--${lv[0].toLowerCase()}`}>{lv}</span>)}
            </div>
          </div>
        </div>

        {/* Right: editable fields */}
        <div className="tc-panel tc-profile-fields">
          <span className="tc-section-label">Personal information</span>
          <div className="tc-form-grid2">
            {[["First name","fname",profile.fname],["Last name","lname",profile.lname]].map(([label,key,val])=>(
              <div key={key} className="tc-field">
                <label>{label}</label>
                {editing ? <input value={val} onChange={e=>set(key,e.target.value)}/> : <div className="tc-field-view">{val}</div>}
              </div>
            ))}
          </div>
          {[["Email","email","email",profile.email],["Phone","phone","tel",profile.phone],["Date of birth","dob","date",profile.dob],["Address","address","text",profile.address]].map(([label,key,type,val])=>(
            <div key={key} className="tc-field">
              <label>{label}</label>
              {editing ? <input type={type} value={val} onChange={e=>set(key,e.target.value)}/> : <div className="tc-field-view">{val}</div>}
            </div>
          ))}

          <span className="tc-section-label" style={{marginTop:8}}>Professional information</span>
          {[["Experience","experience","text",profile.experience],["Education","education","text",profile.education]].map(([label,key,type,val])=>(
            <div key={key} className="tc-field">
              <label>{label}</label>
              {editing ? <input type={type} value={val} onChange={e=>set(key,e.target.value)}/> : <div className="tc-field-view">{val}</div>}
            </div>
          ))}
          <div className="tc-field">
            <label>Bio</label>
            {editing
              ? <textarea value={profile.bio} onChange={e=>set("bio",e.target.value)} rows={4}/>
              : <div className="tc-field-view tc-field-view--bio">{profile.bio}</div>
            }
          </div>

          {editing && (
            <div className="tc-field-actions">
              <button className="tc-btn-ghost" onClick={()=>setEditing(false)}>Cancel</button>
              <button className="tc-btn-primary" onClick={handleSave}><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Save changes</button>
            </div>
          )}
        </div>
      </div>

      {/* Security section */}
      <div className="tc-panel" style={{marginTop:0}}>
        <span className="tc-section-label">Security</span>
        <div className="tc-security-row">
          {[["Current password","current","Your current password"],["New password","new","Minimum 8 characters"],["Confirm password","confirm","Repeat new password"]].map(([label,key,ph])=>(
            <div key={key} className="tc-field">
              <label>{label}</label>
              <input type="password" placeholder={ph}/>
            </div>
          ))}
          <div className="tc-field-actions" style={{marginTop:4}}>
            <button className="tc-btn-primary">Update password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TIMETABLE PAGE
══════════════════════════════════════════════════════════════ */
function TimetablePage() {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const [activeDay, setActiveDay] = useState("Wed");

  const totalWeekClasses = Object.values(TIMETABLE).reduce((acc,arr)=>acc+arr.length,0);
  const totalStudents = Object.values(TIMETABLE).flat().reduce((acc,c)=>acc+c.students,0);

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div><h1>Timetable</h1><p>Spring Semester 2026 — weekly schedule</p></div>
        <button className="tc-btn-primary">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>

      {/* Summary cards */}
      <div className="tc-stats" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <StatCard color="blue"  label="Classes/Week"  value={totalWeekClasses} sub="across 6 days"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard color="green" label="Students reached" value={totalStudents} sub="total enrolments"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard color="amber" label="Teaching hours" value={`${(totalWeekClasses*1.5).toFixed(0)}h`} sub="per week"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
      </div>

      {/* Day selector */}
      <div className="tc-panel">
        <div className="tc-day-tabs">
          {days.map(d=>(
            <button key={d} className={`tc-day-tab${activeDay===d?" tc-day-tab--active":""}${TIMETABLE[d].length===0?" tc-day-tab--empty":""}`} onClick={()=>setActiveDay(d)}>
              <span className="tc-day-tab-name">{d}</span>
              <span className="tc-day-tab-count">{TIMETABLE[d].length} class{TIMETABLE[d].length!==1?"es":""}</span>
            </button>
          ))}
        </div>

        <div className="tc-tt-list">
          {TIMETABLE[activeDay].length === 0
            ? <div className="tc-empty-state">No classes on {activeDay} 🗓️</div>
            : TIMETABLE[activeDay].map((c,i)=>(
              <div key={i} className={`tc-tt-item tc-tt-item--${c.color}`}>
                <div className="tc-tt-time-col">
                  <span className="tc-tt-time">{c.time}</span>
                  <span className="tc-tt-duration">90 min</span>
                </div>
                <div className={`tc-tt-bar tc-tt-bar--${c.color}`}/>
                <div className="tc-tt-body">
                  <span className="tc-tt-name">{c.subject}</span>
                  <div className="tc-tt-meta">
                    <span><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>{c.room}</span>
                    <span><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>{c.students} students</span>
                  </div>
                </div>
                <span className={`tc-tt-badge tc-tt-badge--${c.color}`}>{c.subject.split(" ").pop()}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Full week grid */}
      <div className="tc-panel">
        <span className="tc-panel-title" style={{marginBottom:14,display:"block"}}>Weekly overview</span>
        <div className="tc-week-grid">
          {days.map(d=>(
            <div key={d} className={`tc-week-col${d===activeDay?" tc-week-col--active":""}`} onClick={()=>setActiveDay(d)}>
              <div className="tc-week-col-header">{d}<span>{TIMETABLE[d].length}</span></div>
              {TIMETABLE[d].map((c,i)=>(
                <div key={i} className={`tc-week-cell tc-week-cell--${c.color}`}>{c.subject}</div>
              ))}
              {TIMETABLE[d].length===0 && <div className="tc-week-cell tc-week-cell--empty">—</div>}
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
function StudentsPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("All");
  const [entriesFilter, setEntries] = useState("ID");
  const [showModal, setShowModal]   = useState(false);
  const [selected, setSelected]     = useState(null);
  const [newStudent, setNewStudent] = useState({ name:"", email:"", pay:"", date:"" });

  const filtered = useMemo(()=>{
    return STUDENTS.filter(s=>{
      const q = search.toLowerCase();
      const matchSearch = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchStatus = statusFilter==="All" ? true : statusFilter==="Present" ? s.present : !s.present;
      return matchSearch && matchStatus;
    });
  },[search,statusFilter]);

  const presentCount = STUDENTS.filter(s=>s.present).length;
  const absentCount  = STUDENTS.filter(s=>!s.present).length;

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div><h1>Students</h1><p>Manage attendance and records</p></div>
      </div>

      <div className="tc-stats" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <StatCard color="blue"  label="Total Enrolled" value={STUDENTS.length} sub="+5 this month"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
        />
        <StatCard color="green" label="Present Today" value={presentCount} sub={`${Math.round(presentCount/STUDENTS.length*100)}% rate`}
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatCard color="amber" label="Absent Today" value={absentCount} sub="needs follow-up"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
        />
      </div>

      <div className="tc-panel">
        <div className="tc-panel-header">
          <div><span className="tc-panel-title">Student Records</span><span className="tc-panel-sub">Manage attendance and payments</span></div>
        </div>
        <div className="tc-toolbar">
          <div className="tc-toolbar-left">
            <span className="tc-toolbar-label">Entries</span>
            <select className="tc-select" value={entriesFilter} onChange={e=>setEntries(e.target.value)}>
              <option>ID</option><option>Name</option><option>Date</option>
            </select>
            <button className="tc-btn-primary" onClick={()=>setShowModal(true)}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add record
            </button>
          </div>
          <div className="tc-toolbar-right">
            <div className="tc-search-inline">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="search" placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select className="tc-select" value={statusFilter} onChange={e=>setStatus(e.target.value)}>
              <option>All</option><option>Present</option><option>Absent</option>
            </select>
          </div>
        </div>
        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead><tr><th>#</th><th>Student</th><th>Language / Level</th><th>Paid</th><th>Date</th><th>Attendance</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan="7" className="tc-empty">No students found.</td></tr>
                : filtered.map(s=>(
                  <tr key={s.id} className={selected===s.id?"tc-row-selected":""} onClick={()=>setSelected(selected===s.id?null:s.id)}>
                    <td className="tc-td-id">#{s.id}</td>
                    <td>
                      <div className="tc-student-cell">
                        <div className="tc-mini-av tc-mini-av--blue">{initials(s.name)}</div>
                        <div className="tc-student-info"><strong>{s.name}</strong><span>{s.email}</span></div>
                      </div>
                    </td>
                    <td><span className="tc-lang-cell">{s.language} · <span className={`tc-lvl-badge tc-lvl-badge--${s.level[0].toLowerCase()}`}>{s.level}</span></span></td>
                    <td><span className="tc-pay">{s.pay}</span></td>
                    <td className="tc-date">{s.date}</td>
                    <td>
                      <span className={`tc-status ${s.present?"tc-status--present":"tc-status--absent"}`}>
                        <span className="tc-dot"/>{s.present?"Present":"Absent"}
                      </span>
                    </td>
                    <td>
                      <div className="tc-actions">
                        <button className="tc-action-btn" title="Send message" onClick={e=>e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                        <button className="tc-action-btn" title="View profile" onClick={e=>e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="tc-action-btn" title="More options" onClick={e=>e.stopPropagation()}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {/* Expanded detail */}
        {selected && (()=>{
          const s = STUDENTS.find(x=>x.id===selected);
          if(!s) return null;
          return (
            <div className="tc-student-detail">
              <div className="tc-student-detail-header">
                <div className="tc-student-detail-av">{initials(s.name)}</div>
                <div><strong>{s.name}</strong><span>{s.email}</span></div>
                <span className={`tc-status ${s.present?"tc-status--present":"tc-status--absent"}`} style={{marginLeft:"auto"}}><span className="tc-dot"/>{s.present?"Present":"Absent"}</span>
              </div>
              <div className="tc-student-detail-grid">
                {[["Language",s.language],["Level",s.level],["Phone",s.phone],["Payment",s.pay],["Date",s.date]].map(([k,v])=>(
                  <div key={k} className="tc-detail-row"><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
              <div className="tc-student-detail-actions">
                <button className="tc-btn-primary"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send message</button>
                <button className="tc-btn-ghost" onClick={()=>setSelected(null)}>Close</button>
              </div>
            </div>
          );
        })()}
      </div>

      {showModal && (
        <div className="tc-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="tc-modal" onClick={e=>e.stopPropagation()}>
            <div className="tc-modal-header">
              <h3>Add New Student</h3>
              <button className="tc-modal-close" onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div className="tc-modal-body">
              <div className="tc-field"><label>Full Name</label><input type="text" placeholder="e.g. Mohammed Kaci" value={newStudent.name} onChange={e=>setNewStudent({...newStudent,name:e.target.value})}/></div>
              <div className="tc-field"><label>Email</label><input type="email" placeholder="email@example.com" value={newStudent.email} onChange={e=>setNewStudent({...newStudent,email:e.target.value})}/></div>
              <div className="tc-field-row">
                <div className="tc-field"><label>Payment</label><input type="text" placeholder="200DA" value={newStudent.pay} onChange={e=>setNewStudent({...newStudent,pay:e.target.value})}/></div>
                <div className="tc-field"><label>Date</label><input type="text" placeholder="19 Apr 2026" value={newStudent.date} onChange={e=>setNewStudent({...newStudent,date:e.target.value})}/></div>
              </div>
            </div>
            <div className="tc-modal-footer">
              <button className="tc-btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="tc-btn-primary" onClick={()=>setShowModal(false)}>Add Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COURSES PAGE
══════════════════════════════════════════════════════════════ */
function CoursesPage() {
  const [search, setSearch] = useState("");
  const filtered = COURSES.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div><h1>Courses</h1><p>All language courses you are teaching</p></div>
        <div className="tc-search-inline">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" placeholder="Search courses…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="tc-courses-grid">
        {filtered.map(c=>(
          <div key={c.id} className={`tc-course-card tc-course-card--${c.color}`}>
            <div className="tc-course-card-header">
              <div className={`tc-course-ic tc-course-ic--${c.color}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <span className={`tc-course-badge tc-course-badge--${c.color}`}>{c.name.split(" ").pop()}</span>
            </div>
            <h3 className="tc-course-name">{c.name}</h3>
            <span className="tc-course-teacher">{c.teacher}</span>
            <div className="tc-course-meta">
              <div className="tc-course-meta-row">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                {c.students} students
              </div>
              <div className="tc-course-meta-row">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {c.sessions}
              </div>
              <div className="tc-course-meta-row">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                {c.room}
              </div>
            </div>
            <div className="tc-course-progress-wrap">
              <div className="tc-course-progress-header">
                <span>Completion</span><span>{c.progress}%</span>
              </div>
              <div className="tc-course-progress-track">
                <div className={`tc-course-progress-fill tc-course-progress-fill--${c.color}`} style={{width:c.progress+"%"}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MESSAGES PAGE
══════════════════════════════════════════════════════════════ */
function MessagesPage() {
  const [messages, setMessages] = useState(MESSAGES);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");
  const [reply, setReply]       = useState("");
  const [sent, setSent]         = useState(false);
  const [compose, setCompose]   = useState(false);
  const [newMsg, setNewMsg]     = useState({ to:"", subject:"", body:"" });

  const unread = messages.filter(m=>m.unread).length;

  const filtered = useMemo(()=>{
    return messages.filter(m=>{
      if(filter==="Unread" && !m.unread) return false;
      if(filter==="Starred" && !m.starred) return false;
      const q = search.toLowerCase();
      return !q || m.from.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    });
  },[messages,filter,search]);

  const openMsg = (m) => {
    setSelected(m);
    setMessages(ms=>ms.map(x=>x.id===m.id?{...x,unread:false}:x));
    setReply("");
    setSent(false);
  };

  const sendReply = () => {
    if(!reply.trim()) return;
    setSent(true);
    setReply("");
    setTimeout(()=>setSent(false),2500);
  };

  const sendCompose = () => {
    setCompose(false);
    setNewMsg({to:"",subject:"",body:""});
  };

  const toggleStar = (id,e) => {
    e.stopPropagation();
    setMessages(ms=>ms.map(m=>m.id===id?{...m,starred:!m.starred}:m));
  };

  const deleteMsg = (id,e) => {
    e.stopPropagation();
    setMessages(ms=>ms.filter(m=>m.id!==id));
    if(selected?.id===id) setSelected(null);
  };

  return (
    <div className="tc-page">
      <div className="tc-page-header">
        <div><h1>Messages</h1><p>{unread} unread message{unread!==1?"s":""}</p></div>
        <button className="tc-btn-primary" onClick={()=>setCompose(true)}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Compose
        </button>
      </div>

      <div className="tc-msg-layout">
        {/* Inbox list */}
        <div className="tc-msg-sidebar">
          <div className="tc-msg-filters">
            {["All","Unread","Starred"].map(f=>(
              <button key={f} className={`tc-msg-filter-btn${filter===f?" tc-msg-filter-btn--active":""}`} onClick={()=>setFilter(f)}>
                {f}{f==="Unread"&&unread>0&&<span className="tc-msg-filter-count">{unread}</span>}
              </button>
            ))}
          </div>
          <div className="tc-msg-search">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search messages…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="tc-msg-list">
            {filtered.length===0
              ? <div className="tc-empty-state" style={{padding:"32px 16px"}}>No messages found.</div>
              : filtered.map(m=>(
                <div key={m.id} className={`tc-msg-item${selected?.id===m.id?" tc-msg-item--active":""}${m.unread?" tc-msg-item--unread":""}`} onClick={()=>openMsg(m)}>
                  <div className="tc-msg-item-top">
                    <div className="tc-mini-av tc-mini-av--blue">{m.avatar.slice(0,2)}</div>
                    <div className="tc-msg-item-info">
                      <div className="tc-msg-item-row1">
                        <span className="tc-msg-item-from">{m.from}</span>
                        <span className="tc-msg-item-time">{m.time}</span>
                      </div>
                      <span className="tc-msg-item-subject">{m.subject}</span>
                      <span className="tc-msg-item-preview">{m.body.slice(0,60)}…</span>
                    </div>
                  </div>
                  <div className="tc-msg-item-actions">
                    <button className={`tc-msg-star${m.starred?" tc-msg-star--active":""}`} onClick={e=>toggleStar(m.id,e)}>★</button>
                    <button className="tc-msg-del" onClick={e=>deleteMsg(m.id,e)}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Message content */}
        <div className="tc-msg-content">
          {!selected
            ? <div className="tc-msg-empty"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>Select a message to read</span></div>
            : <>
                <div className="tc-msg-view-header">
                  <div className="tc-msg-view-from">
                    <div className="tc-mini-av tc-mini-av--blue tc-mini-av--lg">{selected.avatar.slice(0,2)}</div>
                    <div>
                      <strong>{selected.from}</strong>
                      <span>{selected.role} · {selected.date}</span>
                    </div>
                  </div>
                  <div className="tc-msg-view-subject">{selected.subject}</div>
                  <button className={`tc-msg-star tc-msg-star--lg${selected.starred?" tc-msg-star--active":""}`} onClick={e=>toggleStar(selected.id,e)}>★</button>
                </div>
                <div className="tc-msg-view-body">{selected.body}</div>
                <div className="tc-msg-reply">
                  <span className="tc-msg-reply-label">Reply to {selected.from}</span>
                  <textarea className="tc-msg-reply-input" placeholder="Write your reply…" value={reply} onChange={e=>setReply(e.target.value)} rows={4}/>
                  {sent && <div className="tc-toast tc-toast--inline"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Reply sent!</div>}
                  <div className="tc-msg-reply-footer">
                    <button className="tc-btn-ghost" onClick={()=>setReply("")}>Clear</button>
                    <button className="tc-btn-primary" onClick={sendReply}>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      Send reply
                    </button>
                  </div>
                </div>
              </>
          }
        </div>
      </div>

      {/* Compose modal */}
      {compose && (
        <div className="tc-modal-overlay" onClick={()=>setCompose(false)}>
          <div className="tc-modal" onClick={e=>e.stopPropagation()}>
            <div className="tc-modal-header">
              <h3>New Message</h3>
              <button className="tc-modal-close" onClick={()=>setCompose(false)}>✕</button>
            </div>
            <div className="tc-modal-body">
              <div className="tc-field"><label>To</label><input type="text" placeholder="Recipient name or email" value={newMsg.to} onChange={e=>setNewMsg({...newMsg,to:e.target.value})}/></div>
              <div className="tc-field"><label>Subject</label><input type="text" placeholder="Message subject" value={newMsg.subject} onChange={e=>setNewMsg({...newMsg,subject:e.target.value})}/></div>
              <div className="tc-field"><label>Message</label><textarea rows={5} placeholder="Write your message…" value={newMsg.body} style={{padding:"9px 12px",border:"0.5px solid rgba(0,0,0,0.15)",borderRadius:10,background:"var(--tc-bg)",fontSize:13,fontFamily:"inherit",resize:"vertical"}} onChange={e=>setNewMsg({...newMsg,body:e.target.value})}/></div>
            </div>
            <div className="tc-modal-footer">
              <button className="tc-btn-ghost" onClick={()=>setCompose(false)}>Cancel</button>
              <button className="tc-btn-primary" onClick={sendCompose}>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
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
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function TeacherDashboard() {
  const [activeNav, setActiveNav] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch]       = useState("");

  const unreadCount = MESSAGES.filter(m=>m.unread).length;

  const renderPage = () => {
    switch(activeNav) {
      case "Home":      return <HomePage onNavigate={setActiveNav}/>;
      case "Profile":   return <ProfilePage/>;
      case "Timetable": return <TimetablePage/>;
      case "Students":  return <StudentsPage/>;
      case "Courses":   return <CoursesPage/>;
      case "Messages":  return <MessagesPage/>;
      default:          return <HomePage onNavigate={setActiveNav}/>;
    }
  };

  return (
    <div className={`tc-layout${collapsed?" tc-collapsed":""}`}>

      {/* ── SIDEBAR ── */}
      <aside className="tc-sidebar">
        <div className="tc-logo">
          <div className="tc-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          {!collapsed && <div className="tc-logo-text"><h2>Language</h2><span>School</span></div>}
        </div>

        <button className="tc-toggle" onClick={()=>setCollapsed(!collapsed)} title="Toggle sidebar">
          {collapsed?"›":"‹"}
        </button>

        {!collapsed && (
          <div className="tc-profile">
            <div className="tc-avatar tc-avatar--lg">MB</div>
            <div className="tc-profile-info"><strong>Mohammed Bouchemot</strong><span>Teacher</span></div>
          </div>
        )}
        {collapsed && (
          <div className="tc-profile tc-profile--mini">
            <div className="tc-avatar tc-avatar--sm">MB</div>
          </div>
        )}

        <nav className="tc-nav">
          {!collapsed && <span className="tc-nav-label">Menu</span>}
          {navItems.map(n=>(
            <button key={n.label} className={`tc-nav-item${activeNav===n.label?" tc-nav-active":""}`} onClick={()=>setActiveNav(n.label)}>
              <span className="tc-nav-icon">{n.icon}</span>
              {!collapsed && (
                <span className="tc-nav-text">
                  {n.label}
                  {n.label==="Messages" && unreadCount>0 && <span className="tc-notif-badge">{unreadCount}</span>}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="tc-sidebar-bottom">
          <button className="tc-nav-item tc-nav-danger" onClick={() => {
  localStorage.removeItem("token");
  localStorage.removeItem("nom");
  localStorage.removeItem("prenom");
  window.location.href = "/login";
}}>
            <span className="tc-nav-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            {!collapsed && <span className="tc-nav-text">Log out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="tc-main">
        <header className="tc-header">
          <div className="tc-header-left">
            <div className="tc-header-title">{activeNav}</div>
            <span className="tc-header-sub">April 16, 2026 · Spring Semester</span>
          </div>
          <div className="tc-search">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search students…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="tc-header-right">
            <button className="tc-icon-btn" title="Messages" onClick={()=>setActiveNav("Messages")} style={{position:"relative"}}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {unreadCount>0 && <span className="tc-badge">{unreadCount}</span>}
            </button>
            <button className="tc-icon-btn" title="Notifications">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="tc-badge tc-badge--dot"/>
            </button>
            <div className="tc-profile-pill" onClick={()=>setActiveNav("Profile")}>
              <div className="tc-avatar tc-avatar--sm">MB</div>
              <div><span className="tc-pname">Mohammed B.</span><span className="tc-prole">Teacher</span></div>
            </div>
          </div>
        </header>

        <main className="tc-content">{renderPage()}</main>
      </div>
    </div>
  );
}
