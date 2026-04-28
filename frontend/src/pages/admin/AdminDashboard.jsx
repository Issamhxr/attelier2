import React, { useState, useEffect, useRef, useMemo } from "react";
import "../../styles/Dashboard.css";

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
        <path d="M8 7V5" />
        <path d="M16 7V5" />
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
  };
  return icons[name] || null;
};

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const attendanceData = [
  { day: "Mon", students: 94, teachers: 88 },
  { day: "Tue", students: 88, teachers: 85 },
  { day: "Wed", students: 90, teachers: 87 },
  { day: "Thu", students: 91, teachers: 89 },
  { day: "Fri", students: 87, teachers: 84 },
];

const MONTHLY_REVENUE = [
  { m: "Oct", v: 182000 },
  { m: "Nov", v: 195000 },
  { m: "Dec", v: 171000 },
  { m: "Jan", v: 208000 },
  { m: "Feb", v: 224000 },
  { m: "Mar", v: 237000 },
  { m: "Apr", v: 148000 },
];

const ALL_STUDENTS = [
  {
    id: 1,
    name: "Boumalek Abdellah",
    language: "English",
    level: "B2",
    status: "active",
    date: "14 Apr",
    absences: 2,
    phone: "0550 111 111",
    email: "abdellah@mail.com",
    section: "Section A",
  },
  {
    id: 2,
    name: "Djebali Rania",
    language: "French",
    level: "A1",
    status: "active",
    date: "13 Apr",
    absences: 0,
    phone: "0661 222 222",
    email: "rania@mail.com",
    section: "Section B",
  },
  {
    id: 3,
    name: "Kaci Sofiane",
    language: "English",
    level: "B2",
    status: "active",
    date: "12 Apr",
    absences: 5,
    phone: "0770 333 333",
    email: "sofiane@mail.com",
    section: "Section A",
  },
  {
    id: 4,
    name: "Merzouk Ilyas",
    language: "Spanish",
    level: "C1",
    status: "pending",
    date: "11 Apr",
    absences: 1,
    phone: "0550 444 444",
    email: "ilyas@mail.com",
    section: "Section C",
  },
  {
    id: 5,
    name: "Hadj Amira",
    language: "German",
    level: "B1",
    status: "active",
    date: "10 Apr",
    absences: 8,
    phone: "0661 555 555",
    email: "amira@mail.com",
    section: "Section D",
  },
  {
    id: 6,
    name: "Bensalah Karim",
    language: "Mandarin",
    level: "A2",
    status: "active",
    date: "9 Apr",
    absences: 3,
    phone: "0770 666 666",
    email: "karim@mail.com",
    section: "Section E",
  },
  {
    id: 7,
    name: "Zerrouki Fatima",
    language: "French",
    level: "A1",
    status: "active",
    date: "8 Apr",
    absences: 0,
    phone: "0550 777 777",
    email: "fatima@mail.com",
    section: "Section B",
  },
  {
    id: 8,
    name: "Hamidi Youcef",
    language: "Spanish",
    level: "C1",
    status: "active",
    date: "7 Apr",
    absences: 12,
    phone: "0661 888 888",
    email: "youcef@mail.com",
    section: "Section C",
  },
  {
    id: 9,
    name: "Bouchemot Mohammed",
    language: "English",
    level: "B2",
    status: "active",
    date: "6 Apr",
    absences: 2,
    phone: "0550 999 000",
    email: "med@mail.com",
    section: "Section A",
  },
  {
    id: 10,
    name: "Benali Fatima",
    language: "French",
    level: "A2",
    status: "pending",
    date: "5 Apr",
    absences: 0,
    phone: "0661 001 002",
    email: "fatima.b@mail.com",
    section: "Section B",
  },
];

const ALL_TEACHERS = [
  {
    id: 1,
    name: "John Doe",
    specialty: "English",
    email: "john@langschool.dz",
    phone: "0550 100 200",
    classes: ["Section A (B2)", "Section C (C1)"],
    students: 23,
    hours: 18,
    rating: 4.8,
    joined: "Sep 2023",
  },
  {
    id: 2,
    name: "Sarah Smith",
    specialty: "French",
    email: "sarah@langschool.dz",
    phone: "0661 300 400",
    classes: ["Section B (A1)", "Section B (B1)"],
    students: 18,
    hours: 16,
    rating: 4.6,
    joined: "Jan 2024",
  },
  {
    id: 3,
    name: "Ali Ben",
    specialty: "German / Mandarin",
    email: "ali@langschool.dz",
    phone: "0770 500 600",
    classes: ["Section D (B1)", "Section E (A2)"],
    students: 12,
    hours: 14,
    rating: 4.7,
    joined: "Oct 2023",
  },
  {
    id: 4,
    name: "Maria Garcia",
    specialty: "Spanish",
    email: "maria@langschool.dz",
    phone: "0550 700 800",
    classes: ["Section C (C1)"],
    students: 12,
    hours: 10,
    rating: 4.9,
    joined: "Mar 2024",
  },
];

const ALL_CLASSES = [
  {
    name: "Section A",
    language: "English",
    level: "B2",
    flag: "🇬🇧",
    teacher: "John Doe",
    students: 11,
    capacity: 12,
    time: "Mon/Wed 9am",
    room: "A101",
    colorCls: "cp-card-en",
  },
  {
    name: "Section B",
    language: "French",
    level: "A1",
    flag: "🇫🇷",
    teacher: "Sarah Smith",
    students: 9,
    capacity: 12,
    time: "Tue/Thu 11am",
    room: "B204",
    colorCls: "cp-card-fr",
  },
  {
    name: "Section C",
    language: "Spanish",
    level: "C1",
    flag: "🇪🇸",
    teacher: "Maria Garcia",
    students: 12,
    capacity: 12,
    time: "Mon/Fri 2pm",
    room: "C302",
    colorCls: "cp-card-es",
  },
  {
    name: "Section D",
    language: "German",
    level: "B1",
    flag: "🇩🇪",
    teacher: "Ali Ben",
    students: 7,
    capacity: 12,
    time: "Wed/Fri 10am",
    room: "D201",
    colorCls: "cp-card-de",
  },
  {
    name: "Section E",
    language: "Mandarin",
    level: "A2",
    flag: "🇨🇳",
    teacher: "Ali Ben",
    students: 5,
    capacity: 12,
    time: "Tue/Thu 4pm",
    room: "D201",
    colorCls: "cp-card-zh",
  },
  {
    name: "Section F",
    language: "Arabic",
    level: "A1",
    flag: "🇩🇿",
    teacher: "—",
    students: 0,
    capacity: 12,
    time: "To be defined",
    room: "—",
    colorCls: "cp-card-ar",
  },
];

const ALL_ABSENCES = [
  {
    id: 1,
    name: "Boumalek Abdellah",
    language: "English",
    level: "B2",
    date: "2026-04-20",
    session: "Morning",
    reason: "Sick",
    justified: true,
  },
  {
    id: 2,
    name: "Djebali Rania",
    language: "French",
    level: "A1",
    date: "2026-04-20",
    session: "Evening",
    reason: "Personal",
    justified: false,
  },
  {
    id: 3,
    name: "Kaci Sofiane",
    language: "English",
    level: "B2",
    date: "2026-04-19",
    session: "Morning",
    reason: "Unknown",
    justified: false,
  },
  {
    id: 4,
    name: "Merzouk Ilyas",
    language: "Spanish",
    level: "C1",
    date: "2026-04-19",
    session: "Weekend",
    reason: "Travel",
    justified: true,
  },
  {
    id: 5,
    name: "Hadj Amira",
    language: "German",
    level: "B1",
    date: "2026-04-18",
    session: "Morning",
    reason: "Sick",
    justified: true,
  },
  {
    id: 6,
    name: "Hamidi Youcef",
    language: "Spanish",
    level: "C1",
    date: "2026-04-18",
    session: "Morning",
    reason: "Unknown",
    justified: false,
  },
  {
    id: 7,
    name: "Bensalah Karim",
    language: "Mandarin",
    level: "A2",
    date: "2026-04-17",
    session: "Evening",
    reason: "Personal",
    justified: true,
  },
  {
    id: 8,
    name: "Kaci Sofiane",
    language: "English",
    level: "B2",
    date: "2026-04-16",
    session: "Morning",
    reason: "Unknown",
    justified: false,
  },
  {
    id: 9,
    name: "Hamidi Youcef",
    language: "Spanish",
    level: "C1",
    date: "2026-04-15",
    session: "Morning",
    reason: "Unknown",
    justified: false,
  },
  {
    id: 10,
    name: "Hadj Amira",
    language: "German",
    level: "B1",
    date: "2026-04-14",
    session: "Morning",
    reason: "Sick",
    justified: false,
  },
  {
    id: 11,
    name: "Zerrouki Fatima",
    language: "French",
    level: "A1",
    date: "2026-04-13",
    session: "Evening",
    reason: "Personal",
    justified: true,
  },
  {
    id: 12,
    name: "Bouchemot Mohammed",
    language: "English",
    level: "B2",
    date: "2026-04-12",
    session: "Morning",
    reason: "Travel",
    justified: true,
  },
];

const PAYMENTS = [
  {
    id: "INV-2026-041",
    student: "Boumalek Abdellah",
    lang: "English",
    level: "B2",
    amount: 4500,
    paid: 4500,
    due: "10 Apr",
    status: "paid",
    method: "Cash",
  },
  {
    id: "INV-2026-040",
    student: "Djebali Rania",
    lang: "French",
    level: "A1",
    amount: 3800,
    paid: 0,
    due: "9 Apr",
    status: "overdue",
    method: "—",
  },
  {
    id: "INV-2026-039",
    student: "Kaci Sofiane",
    lang: "English",
    level: "B2",
    amount: 4500,
    paid: 2250,
    due: "15 Apr",
    status: "partial",
    method: "Cash",
  },
  {
    id: "INV-2026-038",
    student: "Merzouk Ilyas",
    lang: "Spanish",
    level: "C1",
    amount: 5200,
    paid: 5200,
    due: "7 Apr",
    status: "paid",
    method: "CCP",
  },
  {
    id: "INV-2026-037",
    student: "Hadj Amira",
    lang: "German",
    level: "B1",
    amount: 4200,
    paid: 0,
    due: "20 Apr",
    status: "pending",
    method: "—",
  },
  {
    id: "INV-2026-036",
    student: "Bensalah Karim",
    lang: "Mandarin",
    level: "A2",
    amount: 4800,
    paid: 4800,
    due: "5 Apr",
    status: "paid",
    method: "Transfer",
  },
  {
    id: "INV-2026-035",
    student: "Zerrouki Fatima",
    lang: "French",
    level: "A1",
    amount: 3800,
    paid: 1900,
    due: "18 Apr",
    status: "partial",
    method: "Cash",
  },
  {
    id: "INV-2026-034",
    student: "Hamidi Youcef",
    lang: "Spanish",
    level: "C1",
    amount: 5200,
    paid: 5200,
    due: "3 Apr",
    status: "paid",
    method: "CCP",
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "payment",
    icon: "💳",
    title: "Payment received",
    msg: "Bensalah Karim paid 4,800 DA for Mandarin A2.",
    time: "10 min ago",
    tag: "payment",
    read: false,
  },
  {
    id: 2,
    type: "absence",
    icon: "📋",
    title: "Unjustified absence",
    msg: "Djebali Rania is absent (French A1 — Evening).",
    time: "30 min ago",
    tag: "absence",
    read: false,
  },
  {
    id: 3,
    type: "system",
    icon: "🔔",
    title: "Reminder: class tomorrow",
    msg: "10 students enrolled in English B2 tomorrow at 9am.",
    time: "1h ago",
    tag: "system",
    read: false,
  },
  {
    id: 4,
    type: "alert",
    icon: "⚠️",
    title: "Late payment",
    msg: "Djebali Rania — invoice INV-2026-040 due on 9 Apr.",
    time: "2h ago",
    tag: "alert",
    read: true,
  },
  {
    id: 5,
    type: "payment",
    icon: "💳",
    title: "Partial payment",
    msg: "Zerrouki Fatima paid 1,900 DA out of 3,800 DA (French A1).",
    time: "Yesterday 16:45",
    tag: "payment",
    read: true,
  },
  {
    id: 6,
    type: "system",
    icon: "📊",
    title: "Weekly report",
    msg: "The weekly attendance report is available.",
    time: "Yesterday 08:00",
    tag: "system",
    read: true,
  },
  {
    id: 7,
    type: "absence",
    icon: "📋",
    title: "Absence threshold",
    msg: "Hamidi Youcef has exceeded 10 absences (Section C).",
    time: "Today 7am",
    tag: "absence",
    read: true,
  },
  {
    id: 8,
    type: "alert",
    icon: "⚠️",
    title: "Maximum capacity",
    msg: "Section C (Spanish C1) is full — 12/12 students.",
    time: "21 Apr",
    tag: "alert",
    read: true,
  },
];

const NAV_ITEMS = [
  { label: "Dashboard", section: "main", icon: "grid", badge: null },
  { label: "Students", section: "main", icon: "users", badge: null },
  { label: "Teachers", section: "main", icon: "teacher", badge: null },
  { label: "Classes", section: "main", icon: "building", badge: null },
  { label: "Notifications", section: "manage", icon: "bell", badge: "notif" },
  { label: "Payments", section: "manage", icon: "credit", badge: null },
  { label: "Absences", section: "manage", icon: "file", badge: null },
  { label: "Settings", section: "manage", icon: "settings", badge: null },
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

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const initials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
const levelCls = (lvl) => {
  const c = lvl[0].toLowerCase();
  return c === "a" ? "db-lv-a" : c === "b" ? "db-lv-b" : "db-lv-c";
};
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const fmtDA = (n) => n.toLocaleString("en-US") + " DA";
const pct = (d) => Math.round((d.paid / d.amount) * 100);
const occColor = (s, cap) => {
  const r = s / cap;
  if (r >= 1) return "#A32D2D";
  if (r >= 0.75) return "#2D7A3A";
  return "#1A6CC4";
};

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
  const gridValues = [82, 86, 90, 94, 98];
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
        {gridValues.map((v) => (
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

function BarChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const MIN = 80,
    MAX = 100,
    H = 140;
  return (
    <div className="db-bar-wrap">
      {data.map((d) => {
        const sh = Math.round(((d.students - MIN) / (MAX - MIN)) * H);
        const th = Math.round(((d.teachers - MIN) / (MAX - MIN)) * H);
        return (
          <div className="db-bar-group" key={d.day}>
            <div className="db-bar-row" style={{ height: H }}>
              <div
                className="db-bar db-bar-blue"
                style={{ height: sh }}
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
              <div
                className="db-bar db-bar-light"
                style={{ height: th }}
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
            </div>
            <span className="db-bar-label">{d.day}</span>
          </div>
        );
      })}
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
  const grids = [160000, 190000, 220000];
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
        {grids.map((v) => (
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
          const frac = counts[s.key] / total;
          const dash = frac * C;
          const offset = C - cum * C;
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

const AU_PERMISSIONS = [
  "Student management",
  "Payment management",
  "Absence management",
  "View reports",
  "Edit schedule",
];

function AddUser({ onClose, onSaved, students }) {
  const [form, setForm] = useState(initialUserForm);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
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
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    }
    if (step === 3) {
      if (form.role === "etudiant") {
        if (!form.language) e.language = true;
        if (!form.level) e.level = true;
        if (!form.schedule) e.schedule = true;
      }
      if (form.role === "professeur") {
        if (!form.specialty.trim()) e.specialty = true;
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validate()) return;
    if (step === 2) {
      const res = await fetch("http://localhost:5000/api/users/validate-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ step: 2, email: form.email }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors((e) => ({ ...e, email: true }));
        return;
      }
    }
    setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setSaved(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
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
        {/* Header */}
        <div className="au-header">
          <div>
            <span className="au-title">Add a user</span>
            <span className="au-subtitle">Create a new account for your institution</span>
          </div>
          {onClose && (
            <button className="au-close" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Stepper */}
        <div className="au-stepper">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            const disabled = !form.role && n > 1;
            return (
              <React.Fragment key={label}>
                <div className={`au-step${active ? " au-step-active" : ""}${done ? " au-step-done" : ""}${disabled ? " au-step-disabled" : ""}`}>
                  <div className="au-step-circle">
                    {done ? <Icon name="check" size={11} /> : n}
                  </div>
                  <span className="au-step-label">{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`au-step-line${done ? " au-step-line-done" : ""}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1 — Role selection */}
        {step === 1 && (
          <div className="au-body">
            <p className="au-body-hint">Choose the type of account to create</p>
            <div className="au-role-grid">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  className={`au-role-card${form.role === r.id ? " au-role-active" : ""}${errors.role ? " au-role-err" : ""}`}
                  style={form.role === r.id ? { borderColor: r.color, background: `${r.bg}` } : {}}
                  onClick={() => set("role", r.id)}
                >
                  <div className="au-role-icon" style={{ background: r.bg, color: r.color }}>
                    <Icon name={r.icon} size={20} />
                  </div>
                  <span className="au-role-label" style={form.role === r.id ? { color: r.color } : {}}>
                    {r.label}
                  </span>
                  <span className="au-role-desc">{r.desc}</span>
                  {form.role === r.id && (
                    <div className="au-role-check" style={{ background: r.color }}>
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

        {/* STEP 2 — Personal information */}
        {step === 2 && (
          <div className="au-body">
            {roleConfig && (
              <div className="au-role-badge" style={{ background: roleConfig.bg, color: roleConfig.color, borderColor: `${roleConfig.color}30` }}>
                <Icon name={roleConfig.icon} size={13} /> {roleConfig.label}
              </div>
            )}
            <div className="au-row">
              <div className="au-field">
                <label>First name <span className="au-req">*</span></label>
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
                <label>Last name <span className="au-req">*</span></label>
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
              <label>Email address <span className="au-req">*</span></label>
              <input
                type="email"
                placeholder="user@school.dz"
                className={errors.email ? "au-err" : ""}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
              {errors.email && <span className="au-errmsg">Valid email required</span>}
            </div>
            <div className="au-row">
              <div className="au-field">
                <label>Phone <span className="au-optional">(optional)</span></label>
                <input
                  type="tel"
                  placeholder="+213 6 00 00 00 00"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div className="au-field">
                <label>Date of birth <span className="au-optional">(optional)</span></label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => set("dob", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Role-specific details */}
        {step === 3 && (
          <div className="au-body">
            {/* Student */}
            {form.role === "etudiant" && (
              <>
                <div className="au-field">
                  <label>Language <span className="au-req">*</span></label>
                  <div className="au-chips">
                    {AU_LANGUAGES.map((l) => (
                      <button key={l} className={`au-chip${form.language === l ? " au-chip-active" : ""}${errors.language ? " au-chip-err" : ""}`} onClick={() => set("language", l)}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {errors.language && <span className="au-errmsg">Select a language</span>}
                </div>
                <div className="au-field">
                  <label>Level <span className="au-req">*</span></label>
                  <div className="au-chips">
                    {AU_LEVELS.map((lv) => (
                      <button key={lv} className={`au-chip au-chip-lv${form.level === lv ? " au-chip-lv-active " + lvCls(lv) : ""}${errors.level ? " au-chip-err" : ""}`} onClick={() => set("level", lv)}>
                        {lv}
                      </button>
                    ))}
                  </div>
                  {errors.level && <span className="au-errmsg">Select a level</span>}
                </div>
                <div className="au-field">
                  <label>Schedule <span className="au-req">*</span></label>
                  <div className="au-chips">
                    {AU_SCHEDULES.map((s) => (
                      <button key={s} className={`au-chip${form.schedule === s ? " au-chip-active" : ""}${errors.schedule ? " au-chip-err" : ""}`} onClick={() => set("schedule", s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.schedule && <span className="au-errmsg">Select a schedule</span>}
                </div>
                <div className="au-field">
                  <label>Notes <span className="au-optional">(optional)</span></label>
                  <textarea placeholder="Additional information…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                </div>
              </>
            )}

            {/* Teacher */}
            {form.role === "professeur" && (
              <>
                <div className="au-field">
                  <label>Specialty <span className="au-req">*</span></label>
                  <div className="au-chips">
                    {AU_LANGUAGES.map((l) => (
                      <button key={l} className={`au-chip${form.specialty.includes(l) ? " au-chip-active" : ""}`}
                        onClick={() => {
                          const parts = form.specialty ? form.specialty.split(" / ") : [];
                          const next = parts.includes(l) ? parts.filter((x) => x !== l) : [...parts, l];
                          set("specialty", next.join(" / "));
                          setErrors((e) => ({ ...e, specialty: false }));
                        }}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {errors.specialty && <span className="au-errmsg">Select at least one specialty</span>}
                </div>
                <div className="au-row">
                  <div className="au-field">
                    <label>Hours / week</label>
                    <input type="number" placeholder="18" min="1" max="40" value={form.hours} onChange={(e) => set("hours", e.target.value)} />
                  </div>
                  <div className="au-field">
                    <label>Start date</label>
                    <input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
                  </div>
                </div>
                <div className="au-field">
                  <label>Notes <span className="au-optional">(optional)</span></label>
                  <textarea placeholder="Experience, remarks…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                </div>
              </>
            )}

            {/* Secretary */}
            {form.role === "secretaire" && (
              <>
                <div className="au-field">
                  <label>Department</label>
                  <input type="text" placeholder="General Administration" value={form.department} onChange={(e) => set("department", e.target.value)} />
                </div>
                <div className="au-field">
                  <label>Access permissions</label>
                  <div className="au-perm-list">
                    {AU_PERMISSIONS.map((p) => (
                      <label key={p} className={`au-perm-item${form.permissions.includes(p) ? " au-perm-active" : ""}`}>
                        <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePerm(p)} style={{ display: "none" }} />
                        <div className="au-perm-check">
                          {form.permissions.includes(p) && <Icon name="check" size={10} />}
                        </div>
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="au-field">
                  <label>Notes <span className="au-optional">(optional)</span></label>
                  <textarea placeholder="Additional information…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                </div>
              </>
            )}

            {/* Parent */}
            {form.role === "parent" && (
              <>
                <div className="au-field">
                  <label>Linked student <span className="au-optional">(optional)</span></label>
                  <select value={form.linkedStudent} onChange={(e) => set("linkedStudent", e.target.value)} className="au-select">
                    <option value="">— Select a student —</option>
                    {(students || []).map((s) => (
                      <option key={s.id} value={s.id}>{s.name} · {s.language} {s.level}</option>
                    ))}
                  </select>
                </div>
                <div className="au-field">
                  <label>Relationship</label>
                  <div className="au-chips">
                    {["Father", "Mother", "Guardian (M)", "Guardian (F)", "Other"].map((r) => (
                      <button key={r} className={`au-chip${form.notes === r ? " au-chip-active" : ""}`} onClick={() => set("notes", r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="au-field">
                  <label>Remarks <span className="au-optional">(optional)</span></label>
                  <textarea placeholder="Additional information…" value={form.department} onChange={(e) => set("department", e.target.value)} />
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4 — Confirmation */}
        {step === 4 && (
          <div className="au-body au-confirm">
            {saved ? (
              <div className="au-success">
                <div className="au-success-icon" style={{ background: roleConfig?.bg, color: roleConfig?.color }}>
                  <Icon name="check" size={28} />
                </div>
                <span className="au-success-title">Account created!</span>
                <span className="au-success-sub">The account has been successfully saved.</span>
              </div>
            ) : (
              <>
                <div className="au-preview-avatar" style={roleConfig ? { background: `linear-gradient(135deg,${roleConfig.color},${roleConfig.color}99)` } : {}}>
                  {ini}
                </div>
                <span className="au-preview-name">{form.fname} {form.lname}</span>
                <span className="au-preview-email">{form.email}</span>
                {roleConfig && (
                  <div className="au-preview-role-badge" style={{ background: roleConfig.bg, color: roleConfig.color }}>
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
                      <span className={`au-lvl ${lvCls(form.level)}`}>{form.level}</span>
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
                  {form.role === "professeur" && form.hours && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Hours/week</span>
                      <span className="au-preview-val">{form.hours}h</span>
                    </div>
                  )}
                  {form.role === "secretaire" && form.department && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Department</span>
                      <span className="au-preview-val">{form.department}</span>
                    </div>
                  )}
                  {form.role === "secretaire" && form.permissions.length > 0 && (
                    <div className="au-preview-row" style={{ gridColumn: "1/-1" }}>
                      <span className="au-preview-lbl">Permissions</span>
                      <span className="au-preview-val">{form.permissions.join(", ")}</span>
                    </div>
                  )}
                  {form.role === "parent" && form.linkedStudent && (
                    <div className="au-preview-row">
                      <span className="au-preview-lbl">Linked student</span>
                      <span className="au-preview-val">
                        {(students || []).find((s) => s.id == form.linkedStudent)?.name || "—"}
                      </span>
                    </div>
                  )}
                  {form.notes && form.role !== "parent" && (
                    <div className="au-preview-row" style={{ gridColumn: "1/-1" }}>
                      <span className="au-preview-lbl">Notes</span>
                      <span className="au-preview-val">{form.notes}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        {!saved && (
          <div className="au-footer">
            {step > 1 ? (
              <button className="au-btn-back" onClick={prev}>← Back</button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <button className="au-btn-next" onClick={next} style={roleConfig ? { background: `linear-gradient(135deg,${roleConfig.color},${roleConfig.color}cc)` } : {}}>
                Continue →
              </button>
            ) : (
              <button className="au-btn-submit" onClick={handleSubmit} style={roleConfig ? { background: `linear-gradient(135deg,${roleConfig.color},${roleConfig.color}cc)` } : {}}>
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
   STUDENTS PAGE
══════════════════════════════════════════════════════════════ */
function StudentsPage({ students, setStudents, onAdd }) {
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [viewMode, setViewMode] = useState("table");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.language.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterLang !== "All" && s.language !== filterLang) return false;
      if (filterStatus !== "All" && s.status !== filterStatus.toLowerCase()) return false;
      if (filterLevel !== "All" && s.level[0] !== filterLevel) return false;
      return true;
    });
  }, [students, search, filterLang, filterStatus, filterLevel]);

  const archiveStudent = (id) => {
    fetch(`http://localhost:5000/api/users/${id}/archive`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStudents((ss) => ss.filter((s) => s.id !== id));
      })
      .catch((err) => console.error("Archive error:", err));
  };

  return (
    <div className="sp-page">
      <div className="sp-topbar">
        <div>
          <div className="sp-topbar-title">Student Management</div>
          <span className="sp-topbar-sub">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""} · Spring semester 2026
          </span>
        </div>
        <button className="db-btn-primary" onClick={onAdd}>
          <Icon name="useradd" size={13} /> Add a user
        </button>
      </div>
      <div className="sp-filters">
        <div className="sp-search">
          <Icon name="search" size={13} />
          <input placeholder="Search a student…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="sp-filter-group">
          <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)}>
            {["All", "English", "French", "Spanish", "German", "Arabic", "Mandarin"].map((l) => (
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
          <button className={`sp-view-btn${viewMode === "table" ? " active" : ""}`} onClick={() => setViewMode("table")}>
            <Icon name="grid" size={13} />
          </button>
          <button className={`sp-view-btn${viewMode === "cards" ? " active" : ""}`} onClick={() => setViewMode("cards")}>
            <Icon name="users" size={13} />
          </button>
        </div>
      </div>
      {viewMode === "cards" ? (
        <div className="sp-card-grid">
          {filtered.map((s) => (
            <div className="sp-card" key={s.id}>
              <div className="sp-card-top">
                <div className="sp-avatar">{initials(s.name)}</div>
                <div className="sp-card-info">
                  <div className="sp-card-name">{s.name}</div>
                  <span className="sp-card-lang">{s.language} · {s.section}</span>
                  <span className="sp-card-date">Enrolled on {s.date}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <span className={`db-lvl ${levelCls(s.level)}`}>{s.level}</span>
                  <span className={`db-status ${s.status === "active" ? "db-st-active" : "db-st-pending"}`} style={{ fontSize: 10.5 }}>
                    <span className="db-dot" />
                    {s.status === "active" ? "Active" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="sp-card-meta">
                <span style={{ fontSize: 12, color: "var(--db-text2)" }}>📵 {s.absences} absences</span>
                <span style={{ fontSize: 12, color: "var(--db-text3)", marginLeft: "auto" }}>{s.phone}</span>
              </div>
              <div className="sp-card-prog">
                <div className="sp-prog-label">
                  <span>Attendance</span>
                  <span>{Math.max(0, 100 - s.absences * 5)}%</span>
                </div>
                <div className="sp-prog-track">
                  <div className="sp-prog-fill" style={{ width: `${Math.max(0, 100 - s.absences * 5)}%` }} />
                </div>
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
                <tr key={s.id}>
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
                    <span style={{ fontSize: 13, fontWeight: 600, color: s.absences >= 8 ? "#C0352A" : s.absences >= 4 ? "#7A4A0A" : "#2D7A3A" }}>
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
                    <button
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--db-text3)", padding: "5px", borderRadius: "7px", transition: "all 0.2s" }}
                      onClick={() => archiveStudent(s.id)}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#C0352A"; e.currentTarget.style.background = "var(--db-red-bg)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--db-text3)"; e.currentTarget.style.background = "none"; }}
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
   TEACHERS PAGE
══════════════════════════════════════════════════════════════ */
function TeachersPage({ teachers, setTeachers, onAdd }) {
  const [toast, setToast] = useState(null);

  return (
    <div className="tp-page">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 17, fontWeight: 600, color: "var(--db-text)" }}>
            Teacher Management
          </div>
          <span style={{ fontSize: 12, color: "var(--db-text2)" }}>
            {teachers.length} teachers · {teachers.reduce((a, t) => a + t.students, 0)} students supervised
          </span>
        </div>
        <button className="db-btn-primary" onClick={onAdd}>
          <Icon name="useradd" size={13} /> Add a user
        </button>
      </div>
      <div className="tp-card-grid">
        {teachers.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--db-text3)", fontSize: 13 }}>
            No teachers registered.
          </div>
        )}
        {teachers.map((t) => (
          <div className="tp-card" key={t.id}>
            <div className="tp-card-header">
              <div className="tp-avatar">{initials(t.name)}</div>
              <div className="tp-card-info">
                <span className="tp-name">{t.name}</span>
                <span className="tp-specialty">{t.specialty}</span>
                <span className="tp-email">{t.email}</span>
              </div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--db-text3)", padding: "4px", borderRadius: "7px" }}
                onClick={() => {
                  fetch(`http://localhost:5000/api/users/${t.id}/archive`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  })
                    .then((r) => r.json())
                    .then((data) => { if (data.success) setTeachers((ts) => ts.filter((x) => x.id !== t.id)); })
                    .catch((err) => console.error("Archive error:", err));
                }}
              >
                <Icon name="trash" size={13} />
              </button>
            </div>
            <div className="tp-card-stats">
              <div className="tp-stat-box">
                <span className="tp-stat-val">{t.students}</span>
                <span className="tp-stat-lbl">Students</span>
              </div>
              <div className="tp-stat-box">
                <span className="tp-stat-val">{t.hours}h</span>
                <span className="tp-stat-lbl">Hours/week</span>
              </div>
              <div className="tp-stat-box">
                <span className="tp-stat-val" style={{ color: "#B45309" }}>⭐{t.rating}</span>
                <span className="tp-stat-lbl">Rating</span>
              </div>
            </div>
            <div className="tp-classes-row">
              {t.classes && t.classes.map((c) => (
                <span key={c} className="tp-class-tag">{c}</span>
              ))}
              {(!t.classes || t.classes.length === 0) && (
                <span style={{ fontSize: 11.5, color: "var(--db-text3)" }}>No section assigned</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: "var(--db-text3)", marginTop: 8 }}>
              Since {t.joined} · {t.phone}
            </div>
          </div>
        ))}
      </div>
      {toast && <Toast msg={toast} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLASSES PAGE
══════════════════════════════════════════════════════════════ */
function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    language: "English",
    level: "A1",
    teacher: "",
    time: "",
    room: "",
    capacity: 12,
  });

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const loadSections = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/sections", { headers })
      .then((r) => r.json())
      .then((data) => { if (data.success) setClasses(data.sections); })
      .catch((err) => console.error("Section load error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSections(); }, []);

  const addClass = () => {
    if (!form.name.trim()) return;
    fetch("http://localhost:5000/api/sections", { method: "POST", headers, body: JSON.stringify(form) })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setClasses((cs) => [data.section, ...cs]);
          setForm({ name: "", language: "English", level: "A1", teacher: "", time: "", room: "", capacity: 12 });
          setShowAdd(false);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error("Section create error:", err));
  };

  const deleteClass = (id) => {
    fetch(`http://localhost:5000/api/sections/${id}`, { method: "DELETE", headers })
      .then((r) => r.json())
      .then((data) => { if (data.success) setClasses((cs) => cs.filter((c) => c.id !== id)); })
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <div className="cp-page">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 17, fontWeight: 600, color: "var(--db-text)" }}>
            Class Management
          </div>
          <span style={{ fontSize: 12, color: "var(--db-text2)" }}>
            {classes.length} sections · {classes.reduce((a, c) => a + (c.students || 0), 0)} students enrolled
          </span>
        </div>
        <button className="db-btn-primary" onClick={() => setShowAdd((v) => !v)}>
          <Icon name="plus" size={13} /> New section
        </button>
      </div>

      {showAdd && (
        <div className="db-panel" style={{ borderLeft: "3px solid var(--db-blue)" }}>
          <div className="db-pt" style={{ marginBottom: 14 }}>New section</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Section name", "name", "Section F"],
              ["Teacher", "teacher", "Full Name"],
              ["Schedule", "time", "Mon/Wed 10am"],
              ["Room", "room", "A201"],
            ].map(([lbl, key, ph]) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text2)" }}>{lbl}</span>
                <input
                  style={{ border: "var(--db-border2)", borderRadius: "var(--db-r)", padding: "8px 12px", fontSize: 13, background: "var(--db-bg)", color: "var(--db-text)", outline: "none", fontFamily: "var(--font-body)" }}
                  placeholder={ph}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text2)" }}>Language</span>
              <select
                style={{ border: "var(--db-border2)", borderRadius: "var(--db-r)", padding: "8px 12px", fontSize: 13, background: "var(--db-bg)", color: "var(--db-text)", outline: "none", fontFamily: "var(--font-body)" }}
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
              >
                {["English", "French", "Spanish", "German", "Mandarin", "Arabic"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text2)" }}>Level</span>
              <select
                style={{ border: "var(--db-border2)", borderRadius: "var(--db-r)", padding: "8px 12px", fontSize: 13, background: "var(--db-bg)", color: "var(--db-text)", outline: "none", fontFamily: "var(--font-body)" }}
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              >
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
            <button className="db-btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="db-btn-primary" onClick={addClass}>
              <Icon name="check" size={13} /> Create
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--db-text3)", fontSize: 13 }}>
          Loading sections…
        </div>
      )}

      <div className="cp-grid">
        {!loading && classes.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--db-text3)", fontSize: 13 }}>
            No sections created.
          </div>
        )}
        {classes.map((c) => (
          <div className={`cp-card ${c.colorCls}`} key={c.id || c.name}>
            <div className="cp-card-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span className="cp-flag">{c.flag}</span>
                  <div>
                    <div className="cp-card-name">{c.name}</div>
                    <div className="cp-card-level">{c.language} · <span className={`db-lvl ${levelCls(c.level)}`}>{c.level}</span></div>
                  </div>
                </div>
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--db-text3)", padding: "4px", borderRadius: "7px", flexShrink: 0 }} onClick={() => deleteClass(c.id)}>
                <Icon name="trash" size={13} />
              </button>
            </div>
            <div className="cp-card-body">
              <div className="cp-occ-row">
                <div className="cp-occ-track">
                  <div className="cp-occ-fill" style={{ width: `${(c.students / c.capacity) * 100}%`, background: occColor(c.students, c.capacity) }} />
                </div>
                <span className="cp-occ-label" style={{ color: occColor(c.students, c.capacity) }}>{c.students}/{c.capacity}</span>
              </div>
              <div className="cp-meta-row">
                <div className="cp-meta-item">
                  <span className="cp-meta-lbl">Teacher</span>
                  <span className="cp-meta-val">{c.teacher || "—"}</span>
                </div>
                <div className="cp-meta-item">
                  <span className="cp-meta-lbl">Schedule</span>
                  <span className="cp-meta-val">{c.time || "—"}</span>
                </div>
                <div className="cp-meta-item">
                  <span className="cp-meta-lbl">Room</span>
                  <span className="cp-meta-val">{c.room || "—"}</span>
                </div>
                <div className="cp-meta-item">
                  <span className="cp-meta-lbl">Open seats</span>
                  <span className="cp-meta-val" style={{ color: c.capacity - c.students > 3 ? "var(--db-green)" : "var(--db-red)" }}>
                    {c.capacity - c.students}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ABSENCES PAGE
══════════════════════════════════════════════════════════════ */
function AbsencesPage() {
  const [absences, setAbsences] = useState([]);
  const [stats, setStats] = useState({ total: 0, justified: 0, unjustified: 0, thisWeek: 0 });
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
  const PER_PAGE = 8;

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const loadAbsences = () => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:5000/api/absences", { headers }).then((r) => r.json()),
      fetch("http://localhost:5000/api/absences/stats", { headers }).then((r) => r.json()),
    ])
      .then(([absData, statsData]) => {
        if (absData.success) setAbsences(absData.absences);
        if (statsData.success) setStats(statsData.stats);
      })
      .catch((err) => console.error("Absences error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAbsences(); }, []);

  const toggleJustified = (id) => {
    fetch(`http://localhost:5000/api/absences/${id}/justify`, { method: "PATCH", headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.success)
          setAbsences((as) => as.map((a) => a.id === id ? { ...a, justified: data.justified } : a));
      })
      .catch((err) => console.error("Toggle justified error:", err));
  };

  const deleteAbsence = (id, e) => {
    e.stopPropagation();
    fetch(`http://localhost:5000/api/absences/${id}`, { method: "DELETE", headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAbsences((as) => as.filter((a) => a.id !== id));
          if (selected === id) setSelected(null);
        }
      })
      .catch((err) => console.error("Delete error:", err));
  };

  const filtered = useMemo(() => {
    let rows = absences.filter((a) => {
      const q = search.toLowerCase();
      if (q && !a.name.toLowerCase().includes(q) && !a.language.toLowerCase().includes(q)) return false;
      if (langFilter !== "All" && a.language !== langFilter) return false;
      if (sessFilter !== "All" && a.session !== sessFilter) return false;
      if (reasonFilter !== "All" && a.reason !== reasonFilter) return false;
      if (justified === "Yes" && !a.justified) return false;
      if (justified === "No" && a.justified) return false;
      return true;
    });
    rows.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [absences, search, langFilter, sessFilter, reasonFilter, justified, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };
  const resetFilters = () => {
    setSearch(""); setLangFilter("All"); setSessFilter("All");
    setReasonFilter("All"); setJustified("All"); setPage(1);
  };
  const SortIcon = ({ col }) => (
    <span className={`va-sort-ic${sortKey === col ? " va-sort-active" : ""}`}>
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="va-wrap">
      <div className="va-topbar">
        <div className="va-topbar-left">
          <div className="va-topbar-title">Absence Reports</div>
          <span className="va-topbar-sub">April 2026 · Spring semester</span>
        </div>
        <div className="va-topbar-right">
          <button className="va-btn-export" onClick={loadAbsences}>
            <Icon name="refresh" size={13} /> Refresh
          </button>
          <button className="va-btn-export">
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
          <input type="text" placeholder="Search student or language…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="va-filter-group">
          <select value={langFilter} onChange={(e) => { setLangFilter(e.target.value); setPage(1); }}>
            {VA_LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select value={sessFilter} onChange={(e) => { setSessFilter(e.target.value); setPage(1); }}>
            {VA_SESSIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={reasonFilter} onChange={(e) => { setReasonFilter(e.target.value); setPage(1); }}>
            {VA_REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={justified} onChange={(e) => { setJustified(e.target.value); setPage(1); }}>
            <option value="All">All statuses</option>
            <option value="Yes">Justified</option>
            <option value="No">Unjustified</option>
          </select>
        </div>
        {(search || langFilter !== "All" || sessFilter !== "All" || reasonFilter !== "All" || justified !== "All") && (
          <button className="va-btn-reset" onClick={resetFilters}>Reset ×</button>
        )}
      </div>

      <div className="va-table-wrap">
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--db-text3)", fontSize: 13 }}>
            Loading absences…
          </div>
        ) : (
          <table className="va-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")} className="va-th-sort">Student <SortIcon col="name" /></th>
                <th onClick={() => toggleSort("language")} className="va-th-sort">Language <SortIcon col="language" /></th>
                <th>Level</th>
                <th onClick={() => toggleSort("date")} className="va-th-sort">Date <SortIcon col="date" /></th>
                <th>Session</th>
                <th onClick={() => toggleSort("reason")} className="va-th-sort">Reason <SortIcon col="reason" /></th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr><td colSpan={8} className="va-empty">No absences recorded.</td></tr>
              )}
              {pageData.map((a) => (
                <tr key={a.id} className={selected === a.id ? "va-row-selected" : ""} onClick={() => setSelected(selected === a.id ? null : a.id)}>
                  <td>
                    <div className="va-s-cell">
                      <div className="va-avatar">{initials(a.name)}</div>
                      <span className="va-name">{a.name}</span>
                    </div>
                  </td>
                  <td className="va-lang">{a.language}</td>
                  <td><span className={`va-lvl ${levelCls(a.level).replace("db-", "va-")}`}>{a.level}</span></td>
                  <td className="va-date">{formatDate(a.date)}</td>
                  <td><span className={`va-session va-sess-${a.session.toLowerCase()}`}>{a.session}</span></td>
                  <td className="va-reason">{a.reason}</td>
                  <td>
                    <span className={`va-status ${a.justified ? "va-just" : "va-unjust"}`}>
                      <span className="va-dot" />
                      {a.justified ? "Justified" : "Unjustified"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: 4 }}>
                    <button className="va-btn-detail" onClick={(e) => { e.stopPropagation(); setSelected(selected === a.id ? null : a.id); }}>
                      {selected === a.id ? "−" : "+"}
                    </button>
                    <button className="va-btn-detail" style={{ color: "var(--db-red)" }} onClick={(e) => deleteAbsence(a.id, e)}>
                      <Icon name="trash" size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (() => {
        const a = absences.find((x) => x.id === selected);
        if (!a) return null;
        return (
          <div className="va-detail">
            <div className="va-detail-header">
              <div className="va-detail-avatar">{initials(a.name)}</div>
              <div>
                <span className="va-detail-name">{a.name}</span>
                <span className="va-detail-sub">{a.language} · {a.session} session</span>
              </div>
              <span className={`va-status ${a.justified ? "va-just" : "va-unjust"}`} style={{ marginLeft: "auto" }}>
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
                    <span className={`va-lvl ${levelCls(r.v).replace("db-", "va-")}`}>{r.v}</span>
                  ) : (
                    <span className="va-detail-val">{r.v}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="va-detail-actions">
              <button className={`va-btn-toggle ${a.justified ? "va-btn-unjustify" : "va-btn-justify"}`} onClick={() => toggleJustified(a.id)}>
                {a.justified ? "Mark as unjustified" : "Mark as justified"}
              </button>
              <button className="va-btn-notify">
                <Icon name="bell" size={12} /> Notify student
              </button>
            </div>
          </div>
        );
      })()}

      <div className="va-pagination">
        <span className="va-pg-info">
          {filtered.length === 0 ? "0" : `${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)}`} of {filtered.length} records
        </span>
        <div className="va-pg-btns">
          <button className="va-pg-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button className="va-pg-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span key={`e-${i}`} className="va-pg-ellipsis">…</span>
              ) : (
                <button key={p} className={`va-pg-btn${page === p ? " va-pg-active" : ""}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              )
            )}
          <button className="va-pg-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
          <button className="va-pg-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAYMENTS PAGE
══════════════════════════════════════════════════════════════ */
function PaymentsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const barRef = useRef(null);

  const total = useCountUpDA(1365000);
  const collected = useCountUpDA(878500);
  const pending = useCountUpDA(486500);
  const overdue = useCountUpDA(38000);

  const counts = {
    paid: PAYMENTS.filter((p) => p.status === "paid").length,
    partial: PAYMENTS.filter((p) => p.status === "partial").length,
    pending: PAYMENTS.filter((p) => p.status === "pending").length,
    overdue: PAYMENTS.filter((p) => p.status === "overdue").length,
  };

  const TAB_KEY = { All: null, Paid: "paid", Partial: "partial", Pending: "pending", Overdue: "overdue" };
  const TAB_CNT = { All: PAYMENTS.length, Paid: counts.paid, Partial: counts.partial, Pending: counts.pending, Overdue: counts.overdue };

  const filtered = PAYMENTS.filter((d) => {
    const fk = TAB_KEY[filter];
    const mf = !fk || d.status === fk;
    const q = search.toLowerCase();
    const ms = !q || d.student.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.lang.toLowerCase().includes(q);
    return mf && ms;
  });

  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = pct(selected) + "%";
    }, 60);
    return () => clearTimeout(t);
  }, [selected]);

  return (
    <div className="vp-page">
      <div className="db-stats">
        <StatCard icon="credit" label="Total revenue" value={total} delta="+8.4% this month" icBg="#E6F1FB" icColor="#185FA5" deltaColor="#3B6D11" />
        <StatCard icon="check" label="Collected" value={collected} delta="64.3% of total" icBg="#EAF3DE" icColor="#3B6D11" deltaColor="#3B6D11" />
        <StatCard icon="warning" label="Pending" value={pending} delta="3 students" icBg="#FAEEDA" icColor="#633806" deltaColor="#633806" />
        <StatCard icon="warning" label="Overdue" value={overdue} delta="1 student" icBg="#FCEBEB" icColor="#A32D2D" deltaColor="#A32D2D" />
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
          <RevenueChart data={MONTHLY_REVENUE} />
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
            <span className="db-ps">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="vp-controls">
            <div className="vp-search">
              <Icon name="search" size={13} />
              <input type="text" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="vp-btn-export"><Icon name="download" size={13} /> Export</button>
            <button className="vp-btn-new"><Icon name="plus" size={13} /> New</button>
          </div>
        </div>
        <div className="vp-tabs">
          {VP_FILTERS.map((f) => (
            <button key={f} className={`vp-tab${filter === f ? " vp-tab-active" : ""}`} onClick={() => setFilter(f)}>
              {f}<span className="vp-tab-n">{TAB_CNT[f]}</span>
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
              {filtered.map((d) => {
                const s = VP_STATUS[d.status];
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
                    <td className="vp-col-level"><span className={`db-lvl db-lv-${d.level[0].toLowerCase()}`}>{d.level}</span></td>
                    <td><span className="vp-amount">{fmtDA(d.amount)}</span></td>
                    <td className="vp-col-paid"><span style={{ color: d.paid > 0 ? "#3B6D11" : "var(--db-text3)" }}>{d.paid > 0 ? fmtDA(d.paid) : "—"}</span></td>
                    <td className="vp-col-prog">
                      <div className="vp-prog">
                        <div className="vp-prog-track">
                          <div className="vp-prog-fill" style={{ width: pct(d) + "%", background: s.prog }} />
                        </div>
                        <span className="vp-prog-pct">{pct(d)}%</span>
                      </div>
                    </td>
                    <td className="db-date-cell">{d.due}</td>
                    <td>
                      <span className={`db-status ${s.cls}`}>
                        <span className="db-dot" style={{ background: s.dot }} />
                        {s.label}
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
              <div className="vp-empty-icon"><Icon name="search" size={20} /></div>
              <span className="vp-empty-title">No results</span>
              <span className="vp-empty-sub">Try a different filter or search term.</span>
            </div>
          )}
        </div>
      </div>
      {selected && (
        <div className="vp-overlay" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="vp-modal">
            <div className="vp-modal-top">
              <div className="vp-modal-head">
                <div>
                  <span className="vp-modal-id">{selected.id}</span>
                  <span className="vp-modal-name">{selected.student}</span>
                </div>
                <button className="vp-modal-close" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="vp-modal-meta">
                <span className={`db-status ${VP_STATUS[selected.status].cls}`}>
                  <span className="db-dot" style={{ background: VP_STATUS[selected.status].dot }} />
                  {VP_STATUS[selected.status].label}
                </span>
                <span className={`db-lvl db-lv-${selected.level[0].toLowerCase()}`}>{selected.level}</span>
                <span style={{ fontSize: 12, color: "var(--db-text2)" }}>{selected.lang}</span>
              </div>
            </div>
            <div className="vp-modal-body">
              {[
                ["Language / Level", `${selected.lang} · ${selected.level}`],
                ["Total amount", fmtDA(selected.amount)],
                ["Amount paid", selected.paid > 0 ? fmtDA(selected.paid) : "—"],
                ["Balance due", fmtDA(selected.amount - selected.paid)],
                ["Due date", selected.due],
                ["Method", selected.method],
              ].map(([k, v], i) => (
                <div className="vp-modal-row" key={i}>
                  <span>{k}</span>
                  <strong style={k === "Balance due" ? { color: selected.amount - selected.paid > 0 ? "#A32D2D" : "#27500A" } : k === "Amount paid" ? { color: selected.paid > 0 ? "#27500A" : "var(--db-text3)" } : {}}>
                    {v}
                  </strong>
                </div>
              ))}
            </div>
            <div className="vp-modal-foot">
              <div className="vp-modal-bar-wrap">
                <div className="vp-modal-bar-track">
                  <div className="vp-modal-bar-fill" ref={barRef} style={{ width: 0 }} />
                </div>
                <span className="vp-modal-bar-pct">{pct(selected)}% paid</span>
              </div>
              {selected.amount - selected.paid > 0 && (
                <button className="vp-modal-btn-primary">Record a payment</button>
              )}
              <button className="vp-modal-btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATIONS PAGE
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

function NotificationsPage({ notifications, setNotifications }) {
  const [tab, setTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ title: "", message: "", type: "Informational", targets: [] });
  const [formErrors, setFormErrors] = useState({});

  const unread = notifications.filter((n) => !n.read).length;
  const tabs = [
    { label: "All", key: "All" },
    { label: "Payments", key: "payment" },
    { label: "Absences", key: "absence" },
    { label: "System", key: "system" },
    { label: "Alerts", key: "alert" },
  ];
  const filtered = tab === "All" ? notifications : notifications.filter((n) => n.type === tab);

  const showToastMsg = (msg, color = "#3B6D11") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };
  const markAllRead = () => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
    showToastMsg("All notifications marked as read.");
  };
  const deleteNotif = (id, e) => {
    e.stopPropagation();
    setNotifications((ns) => ns.filter((n) => n.id !== id));
  };
  const toggleRead = (id) =>
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  const clearAll = () => {
    setNotifications([]);
    showToastMsg("All notifications deleted.");
  };
  const toggleTarget = (t) => {
    setForm((f) => ({ ...f, targets: f.targets.includes(t) ? f.targets.filter((x) => x !== t) : [...f.targets, t] }));
    setFormErrors((e) => ({ ...e, targets: false }));
  };
  const sendNotification = () => {
    const e = {};
    if (!form.title.trim()) e.title = true;
    if (!form.message.trim()) e.message = true;
    if (form.targets.length === 0) e.targets = true;
    setFormErrors(e);
    if (Object.keys(e).length > 0) return;
    const typeMap = { Informational: "system", Reminder: "system", Alert: "alert", "Payment reminder": "payment" };
    const iconMap = { Informational: "🔔", Reminder: "📋", Alert: "⚠️", "Payment reminder": "💳" };
    const newNotif = {
      id: Date.now(),
      type: typeMap[form.type],
      icon: iconMap[form.type],
      title: form.title,
      msg: form.message,
      time: "Just now",
      tag: typeMap[form.type],
      read: false,
    };
    setNotifications((ns) => [newNotif, ...ns]);
    setForm({ title: "", message: "", type: "Informational", targets: [] });
    setShowForm(false);
    setTab("All");
    showToastMsg(`✓ Notification sent to: ${form.targets.join(", ")}`);
  };
  const tagCls = { payment: "nt-tag-payment", absence: "nt-tag-absence", system: "nt-tag-system", alert: "nt-tag-alert" };
  const icCls = { payment: "nt-ic-success", absence: "nt-ic-warn", system: "nt-ic-info", alert: "nt-ic-danger" };

  return (
    <div className="nt-page">
      <div className="nt-topbar">
        <div className="nt-topbar-left">
          <div className="nt-title">Notifications</div>
          <span className="nt-sub">Manage and send alerts to your students and teachers</span>
        </div>
        <div className="nt-topbar-right">
          {unread > 0 && (
            <button className="nt-btn nt-btn-ghost" onClick={markAllRead}>
              <Icon name="check" size={13} /> Mark all as read ({unread})
            </button>
          )}
          <button className="nt-btn nt-btn-ghost" onClick={() => setShowForm((v) => !v)}>
            {showForm ? <><Icon name="check" size={13} style={{ transform: "rotate(45deg)" }} /> Cancel</> : <><Icon name="plus" size={13} /> New notification</>}
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
              <label>Title <span style={{ color: "var(--db-blue)" }}>*</span></label>
              <input
                type="text"
                placeholder="e.g. Payment reminder"
                value={form.title}
                onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setFormErrors((ev) => ({ ...ev, title: false })); }}
                style={formErrors.title ? { borderColor: "var(--db-red)" } : {}}
              />
              {formErrors.title && <span style={{ fontSize: 11, color: "var(--db-red)" }}>Title required</span>}
            </div>
            <div className="nt-field">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                {NT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="nt-field">
            <label>Message <span style={{ color: "var(--db-blue)" }}>*</span></label>
            <textarea
              placeholder="Write your message here…"
              value={form.message}
              onChange={(e) => { setForm((f) => ({ ...f, message: e.target.value })); setFormErrors((ev) => ({ ...ev, message: false })); }}
              style={formErrors.message ? { borderColor: "var(--db-red)" } : {}}
            />
            {formErrors.message && <span style={{ fontSize: 11, color: "var(--db-red)" }}>Message required</span>}
          </div>
          <div className="nt-field">
            <label>Recipients <span style={{ color: "var(--db-blue)" }}>*</span></label>
            <div className="nt-target-chips">
              {NT_TARGETS.map((t) => (
                <button
                  key={t}
                  className={`nt-target-chip${form.targets.includes(t) ? " nt-target-chip-active" : ""}`}
                  style={formErrors.targets && !form.targets.includes(t) ? { borderColor: "var(--db-red)" } : {}}
                  onClick={() => toggleTarget(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {formErrors.targets && <span style={{ fontSize: 11, color: "var(--db-red)" }}>Select at least one recipient</span>}
          </div>
          <div className="nt-send-footer">
            <span className="nt-char-count" style={form.message.length > 300 ? { color: "#B45309" } : {}}>
              {form.message.length}/500
            </span>
            <div className="nt-send-actions">
              <button className="nt-btn nt-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="nt-btn nt-btn-primary" onClick={sendNotification}>
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
              <button key={t.key} className={`nt-tab${tab === t.key ? " nt-tab-active" : ""}`} onClick={() => setTab(t.key)}>
                {t.label}
                <span className="nt-tab-n">
                  {t.key === "All" ? notifications.length : notifications.filter((n) => n.type === t.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="nt-empty">
            <div className="nt-empty-ic"><Icon name="bell" size={20} /></div>
            <span className="nt-empty-t">No notifications</span>
            <span className="nt-empty-s">You're all caught up!</span>
          </div>
        ) : (
          <div className="nt-list">
            {filtered.map((n) => (
              <div key={n.id} className={`nt-item${!n.read ? " nt-item-unread" : ""}`} onClick={() => toggleRead(n.id)}>
                <div className={`nt-item-ic ${icCls[n.type] || "nt-ic-info"}`} style={{ fontSize: 16 }}>{n.icon}</div>
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
                <button className="nt-item-del" title="Delete" onClick={(e) => deleteNotif(n.id, e)}>
                  <Icon name="trash" size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <div className="nt-toast" style={{ background: toast.color }}><Icon name="check" size={14} /> {toast.msg}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SETTINGS PAGE
══════════════════════════════════════════════════════════════ */
const ST_SECTIONS = ["Profile", "School", "Appearance", "Notifications", "Security", "Danger"];

function SettingsPage() {
  const [active, setActive] = useState("Profile");
  const [savedToast, setSavedToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({ fname: "", lname: "", email: "", phone: "", role: "" });
  const [school, setSchool] = useState({ name: "", city: "", address: "", email: "", phone: "", maxStudents: "" });
  const [appearance, setAppearance] = useState({ accentColor: "#185FA5", dateFormat: "MM/DD/YYYY", language: "English", timezone: "Africa/Algiers" });
  const [notifPrefs, setNotifPrefs] = useState({ emailAbsence: true, emailPayment: true, emailSystem: false, pushAbsence: true, pushPayment: true, pushSystem: true, weeklyReport: true, monthlyReport: false });
  const [security, setSecurity] = useState({ currentPwd: "", newPwd: "", confirmPwd: "", twoFactor: false, sessionTimeout: "30" });
  const [secErrors, setSecErrors] = useState({});

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/users/me", { headers }).then((r) => r.json()),
      fetch("http://localhost:5000/api/settings", { headers }).then((r) => r.json()),
    ])
      .then(([meData, settingsData]) => {
        if (meData.success) {
          const u = meData.user;
          setProfile({ fname: u.prenom || "", lname: u.nom || "", email: u.email || "", phone: u.telephone || "", role: u.role || "" });
        }
        if (settingsData.success) {
          const s = settingsData.settings;
          setSchool({ name: s.schoolName || "", city: s.city || "", address: s.address || "", email: s.email || "", phone: s.phone || "", maxStudents: s.maxStudents || "" });
        }
      })
      .catch((err) => console.error("Settings load error:", err))
      .finally(() => setLoading(false));
  }, []);

  const showSaved = () => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2500); };

  const Toggle = ({ value, onChange }) => (
    <label className="st-toggle">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span className="st-toggle-slider" />
    </label>
  );

  const navIcons = {
    Profile: <Icon name="user" size={14} />,
    School: <Icon name="building" size={14} />,
    Appearance: <Icon name="eye" size={14} />,
    Notifications: <Icon name="bell" size={14} />,
    Security: <Icon name="lock" size={14} />,
    Danger: <Icon name="warning" size={14} />,
  };

  const inputStyle = {
    border: "var(--db-border2)", borderRadius: "var(--db-r)", padding: "8px 12px", fontSize: 13,
    background: "var(--db-bg)", color: "var(--db-text)", outline: "none", fontFamily: "var(--font-body)", width: "100%", transition: "all 0.2s",
  };

  const saveProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ fname: profile.fname, lname: profile.lname, email: profile.email, phone: profile.phone }),
      });
      const data = await res.json();
      if (data.success) showSaved();
    } catch (err) { console.error("Profile save error:", err); }
  };

  const saveSchool = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName: school.name, city: school.city, address: school.address, email: school.email, phone: school.phone, maxStudents: school.maxStudents }),
      });
      const data = await res.json();
      if (data.success) showSaved();
    } catch (err) { console.error("School save error:", err); }
  };

  const renderSection = () => {
    if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "var(--db-text3)", fontSize: 13 }}>Loading…</div>;

    switch (active) {
      case "Profile":
        return (
          <div className="st-section">
            <span className="st-section-title">Profile information</span>
            <div className="st-row">
              <div className="st-avatar-row">
                <div className="st-big-avatar">
                  {`${profile.fname?.[0] || ""}${profile.lname?.[0] || ""}`.toUpperCase() || "AD"}
                </div>
                <div className="st-avatar-actions">
                  <button className="st-btn-sm st-btn-upload">Change photo</button>
                  <button className="st-btn-sm st-btn-remove">Remove</button>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["First name", "fname", profile.fname], ["Last name", "lname", profile.lname]].map(([label, key, val]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
                  <input style={inputStyle} value={val} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            {[["Email", "email", "email", profile.email], ["Phone", "phone", "tel", profile.phone], ["Role", "role", "text", profile.role]].map(([label, key, type, val]) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
                <input
                  style={{ ...inputStyle, opacity: key === "role" ? 0.6 : 1 }}
                  type={type}
                  value={val}
                  readOnly={key === "role"}
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
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
                <input style={inputStyle} value={val} onChange={(e) => setSchool((s) => ({ ...s, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="st-save-row">
              <button className="st-btn-cancel" onClick={() => window.location.reload()}>Reset</button>
              <button className="st-btn-save" onClick={saveSchool}>Save</button>
            </div>
          </div>
        );

      case "Appearance":
        return (
          <div className="st-section">
            <span className="st-section-title">Appearance & localization</span>
            <div className="st-row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>Accent color</span>
              <div className="st-colors">
                {ACCENT_COLORS.map((c) => (
                  <div key={c} className={`st-color-swatch${appearance.accentColor === c ? " st-color-active" : ""}`} style={{ background: c }} onClick={() => setAppearance((a) => ({ ...a, accentColor: c }))} />
                ))}
              </div>
            </div>
            {[
              ["Date format", "dateFormat", ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]],
              ["Language", "language", ["English", "Français", "العربية"]],
              ["Timezone", "timezone", ["Africa/Algiers", "Europe/Paris", "UTC"]],
            ].map(([label, key, opts]) => (
              <div key={key} className="st-row">
                <div><span className="st-field-label">{label}</span></div>
                <select className="st-select" value={appearance[key]} onChange={(e) => setAppearance((a) => ({ ...a, [key]: e.target.value }))}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="st-save-row">
              <button className="st-btn-save" onClick={showSaved}>Apply</button>
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="st-section">
            <span className="st-section-title">Notification preferences</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--db-text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Email notifications
              </span>
              {[["Absences", "emailAbsence"], ["Payments", "emailPayment"], ["System", "emailSystem"]].map(([label, key]) => (
                <div key={key} className="st-row">
                  <div>
                    <span className="st-field-label">{label}</span>
                    <span className="st-field-sub">Receive email alerts</span>
                  </div>
                  <div className="st-toggle-wrap">
                    <Toggle value={notifPrefs[key]} onChange={(v) => setNotifPrefs((p) => ({ ...p, [key]: v }))} />
                    <span className="st-toggle-label">{notifPrefs[key] ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "var(--db-border)", paddingTop: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--db-text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Automatic reports
                </span>
              </div>
              {[["Weekly report", "weeklyReport", "Sent every Monday"], ["Monthly report", "monthlyReport", "Sent on the 1st of each month"]].map(([label, key, sub]) => (
                <div key={key} className="st-row">
                  <div>
                    <span className="st-field-label">{label}</span>
                    <span className="st-field-sub">{sub}</span>
                  </div>
                  <div className="st-toggle-wrap">
                    <Toggle value={notifPrefs[key]} onChange={(v) => setNotifPrefs((p) => ({ ...p, [key]: v }))} />
                    <span className="st-toggle-label">{notifPrefs[key] ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="st-save-row">
              <button className="st-btn-save" onClick={showSaved}>Save</button>
            </div>
          </div>
        );

      case "Security":
        return (
          <div className="st-section">
            <span className="st-section-title">Account security</span>
            {[["Current password", "currentPwd", "Your current password"], ["New password", "newPwd", "Minimum 8 characters"], ["Confirm", "confirmPwd", "Re-enter new password"]].map(([label, key, ph]) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--db-text)" }}>{label}</span>
                <input
                  type="password"
                  style={{ ...inputStyle, borderColor: secErrors[key] ? "var(--db-red)" : undefined }}
                  placeholder={ph}
                  value={security[key]}
                  onChange={(e) => { setSecurity((s) => ({ ...s, [key]: e.target.value })); setSecErrors((er) => ({ ...er, [key]: false })); }}
                />
                {secErrors[key] && (
                  <span style={{ fontSize: 11, color: "var(--db-red)" }}>
                    {key === "confirmPwd" ? "Passwords do not match" : key === "newPwd" ? "Minimum 8 characters" : "Required"}
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
                if (security.newPwd !== security.confirmPwd) e.confirmPwd = true;
                setSecErrors(e);
                if (Object.keys(e).length) return;
                try {
                  const res = await fetch("http://localhost:5000/api/users/change-password", {
                    method: "PATCH",
                    headers: { ...headers, "Content-Type": "application/json" },
                    body: JSON.stringify({ currentPwd: security.currentPwd, newPwd: security.newPwd }),
                  });
                  const data = await res.json();
                  if (!res.ok) { setSecErrors({ currentPwd: true }); return; }
                  setSecurity({ currentPwd: "", newPwd: "", confirmPwd: "", twoFactor: security.twoFactor, sessionTimeout: security.sessionTimeout });
                  showSaved();
                } catch (err) { console.error("Error:", err); }
              }}
            >
              Update password
            </button>
            <div style={{ borderTop: "var(--db-border)", paddingTop: 18, marginTop: 4, display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="st-row">
                <div>
                  <span className="st-field-label">Two-factor authentication</span>
                  <span className="st-field-sub">Add an extra layer of security</span>
                </div>
                <div className="st-toggle-wrap">
                  <Toggle value={security.twoFactor} onChange={(v) => setSecurity((s) => ({ ...s, twoFactor: v }))} />
                  <span className="st-toggle-label">{security.twoFactor ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div className="st-row">
                <div><span className="st-field-label">Session timeout</span></div>
                <select className="st-select" value={security.sessionTimeout} onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))}>
                  {["15", "30", "60", "120", "240"].map((v) => <option key={v} value={v}>{v} minutes</option>)}
                </select>
              </div>
            </div>
          </div>
        );

      case "Danger":
        return (
          <div className="st-section st-danger">
            <span className="st-section-title">⚠️ Danger zone</span>
            {[
              { title: "Export all data", sub: "Download a complete archive.", btn: "Export", color: "#185FA5", bg: "var(--db-blue-lt)" },
              { title: "Reset statistics", sub: "Clear all stats. Irreversible.", btn: "Reset", color: "var(--db-amber)", bg: "var(--db-amber-bg)" },
              { title: "Delete all students", sub: "Permanently delete all records. Irreversible.", btn: "Delete all", color: "var(--db-red)", bg: "var(--db-red-bg)" },
              { title: "Delete account", sub: "Delete this admin account and all associated data.", btn: "Delete", color: "var(--db-red)", bg: "var(--db-red-bg)" },
            ].map((item) => (
              <div key={item.title} className="st-row" style={{ padding: "14px 0", borderBottom: "var(--db-border)" }}>
                <div>
                  <span className="st-field-label">{item.title}</span>
                  <span className="st-field-sub">{item.sub}</span>
                </div>
                <button style={{ padding: "7px 14px", borderRadius: "var(--db-r)", fontSize: 12, cursor: "pointer", background: item.bg, color: item.color, border: `0.5px solid ${item.color}`, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>
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
          <button key={s} className={`st-nav-item${active === s ? " st-nav-active" : ""}`} onClick={() => setActive(s)} style={s === "Danger" && active !== s ? { color: "var(--db-red)" } : {}}>
            {navIcons[s]} {s}
          </button>
        ))}
      </div>
      <div className="st-content">{renderSection()}</div>
      {savedToast && (
        <div className="st-saved-toast"><Icon name="check" size={14} /> Changes saved successfully!</div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD HOME
══════════════════════════════════════════════════════════════ */
function DashboardHome({ students, notifications, setActiveNav, onAddUser }) {
  const [avgVisible, setAvgVisible] = useState(false);
  const avgRef = useRef(null);
  const totalStudents = useCountUp(students.length);
  const teachers = useCountUp(4);
  const classes = useCountUp(6);
  const attendance = useCountUp(96.2, 1200, "%");

  useEffect(() => {
    const t = setTimeout(() => setAvgVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const recentStudents = students.slice(0, 5);

  const quickActions = [
    { label: "Add a user", desc: "Link a parent to a student", action: () => onAddUser("parent"), icon: "heart", color: "#BE185D", bg: "#FDF2F8" },
    { label: "Send a notification", desc: "Alert students and staff", action: () => setActiveNav("Notifications"), icon: "bell", color: "#B45309", bg: "#FEF3DC" },
    { label: "View payments", desc: "Track invoices", action: () => setActiveNav("Payments"), icon: "credit", color: "#0F766E", bg: "#F0FDF4" },
    { label: "View absences", desc: "Absence reports", action: () => setActiveNav("Absences"), icon: "file", color: "#185FA5", bg: "#E6F1FB" },
    { label: "Manage classes", desc: "Sections and schedules", action: () => setActiveNav("Classes"), icon: "building", color: "#7A4A0A", bg: "#FEF3DC" },
  ];

  return (
    <>
      <div className="db-stats">
        <StatCard icon="users" label="Total students" value={totalStudents} delta="+8 this month" icBg="#E6F1FB" icColor="#185FA5" deltaColor="#3B6D11" />
        <StatCard icon="teacher" label="Teachers" value={teachers} delta="+1 this month" icBg="#EAF3DE" icColor="#3B6D11" deltaColor="#3B6D11" />
        <StatCard icon="building" label="Active classes" value={classes} delta="6 languages" icBg="#FEF3DC" icColor="#633806" deltaColor="#633806" />
        <StatCard icon="trend" label="Attendance rate" value={attendance} delta="+1.4% vs last week" icBg="#FCEBEB" icColor="#A32D2D" deltaColor="#3B6D11" />
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
          <LineChart data={attendanceData} />
          <div className="db-legend">
            <div className="db-leg-item"><div className="db-leg-dot" style={{ background: "#185FA5" }} />Students</div>
            <div className="db-leg-item"><div className="db-leg-dot" style={{ background: "#97C459" }} />Teachers</div>
          </div>
        </div>
        <div className="db-panel">
          <div className="db-ph"><span className="db-pt">Quick actions</span></div>
          <div className="db-actions">
            {quickActions.map((a) => (
              <div className="db-action" key={a.label} onClick={a.action}>
                <div className="db-action-ic" style={{ background: a.bg, color: a.color }}><Icon name={a.icon} size={14} /></div>
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
            <button className="db-view-all" onClick={() => setActiveNav("Students")}>View all →</button>
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
                  <td><span className={`db-lvl ${levelCls(s.level)}`}>{s.level}</span></td>
                  <td>
                    <span className={`db-status ${s.status === "active" ? "db-st-active" : "db-st-pending"}`}>
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
              <span className="db-pt">Daily attendance</span>
              <span className="db-ps">% present this week</span>
            </div>
          </div>
          <BarChart data={attendanceData} />
          <div className="db-legend" style={{ marginTop: 8 }}>
            <div className="db-leg-item"><div className="db-leg-dot" style={{ background: "#185FA5" }} />Students</div>
            <div className="db-leg-item"><div className="db-leg-dot" style={{ background: "#B5D4F4" }} />Teachers</div>
          </div>
          <div className="db-avg-row" ref={avgRef}>
            <span className="db-avg-lbl">Weekly avg.</span>
            <div className="db-avg-track">
              <div className="db-avg-fill" style={{ width: avgVisible ? "90%" : "0%" }} />
            </div>
            <span className="db-avg-val">90%</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserDefaultRole, setAddUserDefaultRole] = useState("");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [students, setStudents] = useState([]);
  const [toast, setToast] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [secretaires, setSecretaires] = useState([]);

  const loadStudents = () => {
    fetch("http://localhost:5000/api/users/students", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.students.map((s) => ({
            id: s._id,
            name: `${s.prenom || ""} ${s.nom || ""}`.trim() || s.email,
            language: s.language || "—",
            level: s.level || "A1",
            status: s.actif ? "active" : "pending",
            date: new Date(s.createdAt).toLocaleDateString("en-US"),
            absences: s.absences || 0,
            phone: s.telephone || "—",
            email: s.email,
            section: s.section || "To be assigned",
          }));
          setStudents(formatted);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => { loadStudents(); }, []);

  const loadTeachers = () => {
    fetch("http://localhost:5000/api/users/teachers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.teachers.map((t) => ({
            id: t._id,
            name: `${t.prenom || ""} ${t.nom || ""}`.trim() || t.email,
            specialty: t.specialty || "—",
            email: t.email,
            phone: t.telephone || "—",
            classes: t.classes || [],
            students: t.students || 0,
            hours: t.hours || 0,
            rating: t.rating || "—",
            joined: new Date(t.createdAt).toLocaleDateString("en-US"),
          }));
          setTeachers(formatted);
        }
      })
      .catch((err) => console.error("Teachers load error:", err));
  };

  useEffect(() => { loadTeachers(); }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/students", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.students.map((s) => ({
            id: s._id,
            name: `${s.prenom} ${s.nom}`,
            language: s.language || "—",
            level: s.level || "A1",
            status: s.actif ? "active" : "pending",
            date: new Date(s.createdAt).toLocaleDateString("en-US"),
            absences: 0,
            phone: s.telephone || "—",
            email: s.email,
            section: "To be assigned",
          }));
          setStudents(formatted);
        }
      })
      .catch((err) => console.error("Students load error:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/teachers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.teachers.map((t) => ({
            id: t._id,
            name: `${t.prenom || ""} ${t.nom || ""}`.trim() || t.email,
            specialty: t.specialty || "—",
            email: t.email,
            phone: t.telephone || "—",
            classes: t.classes || [],
            students: t.students || 0,
            hours: t.hours || 0,
            rating: t.rating || "—",
            joined: t.joined || new Date(t.createdAt).toLocaleDateString("en-US"),
          }));
          setTeachers(formatted);
        }
      })
      .catch((err) => console.error("Teachers load error:", err));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const getBadge = (item) => { if (item.badge === "notif") return unreadCount; return 0; };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };
  const openAddUser = (defaultRole = "") => { setAddUserDefaultRole(defaultRole); setShowAddUser(true); };

  const renderContent = () => {
    switch (activeNav) {
      case "Students":
        return <StudentsPage students={students} setStudents={setStudents} onAdd={() => openAddUser("etudiant")} />;
      case "Teachers":
        return <TeachersPage teachers={teachers} setTeachers={setTeachers} onAdd={() => openAddUser("professeur")} />;
      case "Classes":
        return <ClassesPage />;
      case "Payments":
        return <PaymentsPage />;
      case "Absences":
        return <AbsencesPage />;
      case "Notifications":
        return <NotificationsPage notifications={notifications} setNotifications={setNotifications} />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <DashboardHome students={students} notifications={notifications} setActiveNav={setActiveNav} onAddUser={openAddUser} />;
    }
  };

  return (
    <div className={`db-layout${collapsed ? " db-collapsed" : ""}`}>
      <aside className="db-sidebar">
        <div className="db-logo">
          <div className="db-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
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
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1A6CC4,#0D4F94)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              AD
            </div>
            <div>
              <span style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 500, color: "#fff", display: "block", lineHeight: 1.2 }}>
                Main Admin
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Administrator</span>
            </div>
          </div>
        )}
        <nav className="db-nav">
          {["main", "manage"].map((section) => (
            <React.Fragment key={section}>
              {!collapsed && (
                <span className="db-nav-label" style={section === "manage" ? { marginTop: 10 } : {}}>
                  {section === "main" ? "Main" : "Manage"}
                </span>
              )}
              {NAV_ITEMS.filter((n) => n.section === section).map((n) => {
                const bdg = getBadge(n);
                return (
                  <button key={n.label} className={`db-nav-item${activeNav === n.label ? " db-nav-active" : ""}`} onClick={() => setActiveNav(n.label)}>
                    <span className="db-nav-icon"><Icon name={n.icon} size={15} /></span>
                    {!collapsed && (
                      <span className="db-nav-text">
                        {n.label}
                        {bdg > 0 && <span className="db-notif-badge">{bdg}</span>}
                      </span>
                    )}
                    {collapsed && bdg > 0 && (
                      <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#EF4444", borderRadius: "50%", border: "1.5px solid #0F2D52" }} />
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
            onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); window.location.href = "/login"; }}
          >
            <span className="db-nav-icon"><Icon name="logout" size={15} /></span>
            {!collapsed && <span className="db-nav-text">Log out</span>}
          </button>
        </div>
      </aside>

      <div className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-header-title">{activeNav}</div>
            <span className="db-header-sub">April 21, 2026 · Spring semester</span>
          </div>
          <div className="db-search">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search students, classes…" />
          </div>
          <div className="db-header-right">
            <button className="db-icon-btn" onClick={() => setActiveNav("Notifications")} style={{ position: "relative" }}>
              <Icon name="bell" size={17} />
              {unreadCount > 0 && <span className="db-badge" />}
            </button>
            <button className="db-btn-primary db-btn-sm" onClick={() => openAddUser()}>
              <Icon name="useradd" size={13} /> Add
            </button>
            <div className="db-profile" onClick={() => setActiveNav("Settings")}>
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
          onClose={() => { setShowAddUser(false); setAddUserDefaultRole(""); }}
          students={students}
          onSaved={(user) => {
            loadStudents();
            loadTeachers();
            const roleLabels = { etudiant: "Student", professeur: "Teacher", secretaire: "Secretary", parent: "Parent" };
            showToast(`${roleLabels[user.role] || "User"} ${user.prenom} ${user.nom} created successfully.`);
          }}
        />
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
};

export default AdminDashboard;