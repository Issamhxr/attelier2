// src/api/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur serveur');
  return data;
}

// ── Profil ────────────────────────────────────────────────
export const fetchMe = () => request('/users/me');

// ── Absences ──────────────────────────────────────────────
// ✅ retourne { absences: [...] } — filtre par studentId côté backend via JWT
export const fetchAbsences = () => request('/absences');

// ── Emploi du temps ───────────────────────────────────────
// ✅ le backend filtre automatiquement selon le rôle (etudiant → sa section)
export const fetchEmplois = (jour) =>
  request(jour ? `/emplois?jour=${jour}` : '/emplois');

// ── Examens ───────────────────────────────────────────────
export const fetchExams   = ()     => request('/exams');
export const createExam   = (data) => request('/exams', { method: 'POST', body: JSON.stringify(data) });
export const deleteExam   = (id)   => request(`/exams/${id}`, { method: 'DELETE' });

// ── Notes ─────────────────────────────────────────────────
// ✅ le backend filtre par etudiant via JWT
export const fetchNotes = () => request('/notes');

// ── Todos ─────────────────────────────────────────────────
export const fetchTodos  = ()         => request('/todos');
export const createTodo  = (data)     => request('/todos', { method: 'POST', body: JSON.stringify(data) });
export const updateTodo  = (id, data) => request(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteTodo  = (id)       => request(`/todos/${id}`, { method: 'DELETE' });

// ── Notifications ─────────────────────────────────────────
export const fetchNotifications = ()    => request('/notifications');
export const markNotifRead      = (id)  => request(`/notifications/${id}/read`,  { method: 'PATCH' });
export const markAllNotifsRead  = ()    => request('/notifications/read-all',    { method: 'PATCH' });
export const deleteNotif        = (id)  => request(`/notifications/${id}`,       { method: 'DELETE' });
export const deleteAllNotifs    = ()    => request('/notifications',             { method: 'DELETE' });

// ── Messages (étudiant reçoit via secretaire) ──────────────
// ✅ utilise la route secretaire qui supporte recipient
export const fetchMessages = () => request('/secretaire/messages');
export const markMsgRead   = (id)        => request(`/secretaire/messages/${id}/read`, { method: 'PATCH' });
export const toggleMsgStar = (id)        => request(`/secretaire/messages/${id}/star`, { method: 'PATCH' });
export const deleteMsg     = (id)        => request(`/secretaire/messages/${id}`,      { method: 'DELETE' });
export const replyMsg      = (id, body)  => request(`/secretaire/messages/${id}/reply`,{ method: 'POST', body: JSON.stringify({ body }) });

// ── Annonces ──────────────────────────────────────────────
// ✅ utilise les notifications de type system comme annonces
export const fetchAnnouncements = () =>
  request('/notifications').then(data => ({
    success: true,
    announcements: (data.notifications || [])
      .filter(n => n.type === 'system' || n.type === 'alert')
      .map(n => ({
        tag:       n.tag || 'Info',
        tagClass:  n.type === 'alert' ? 'db-tag-red' : 'db-tag-blue',
        text:      n.msg,
        content:   n.msg,
        createdAt: n.createdAt || new Date().toISOString(),
      })),
  }));

// ── Congés enseignants ────────────────────────────────────
// ✅ récupère les profs archivés/inactifs comme "absents"
export const fetchConges = () =>
  request('/users/role/professeur').then(data => ({
    success: true,
    conges: [],  // pas de modèle Conge dans le backend — laisse vide pour l'instant
  }));

// ── Parent ────────────────────────────────────────────────
export const fetchParentChild = () => request('/parents/child');