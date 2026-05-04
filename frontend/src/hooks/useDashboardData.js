import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  return fetch(`${API}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  }).then(res => {
    if (res.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }
    return res.json();
  });
}

export function useDashboardData() {
  const [user,          setUser]          = useState(null);
  const [absences,      setAbsences]      = useState([]);
  const [emplois,       setEmplois]       = useState([]);
  const [notes,         setNotes]         = useState([]);
  const [messages,      setMessages]      = useState([]);
  const [exams,         setExams]         = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [conges,        setConges]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [meData, absData, emploiData, notesData, examsData, notifsData] = await Promise.all([
        apiFetch('/users/me'),
        apiFetch('/absences'),
        apiFetch('/emplois'),
        apiFetch('/notes'),
        apiFetch('/exams'),
        apiFetch('/notifications'),
      ]);

      if (!meData.success) throw new Error('Failed to load user');
      setUser(meData.user);
      if (absData.success)   setAbsences(absData.absences   || []);
      if (emploiData.success) setEmplois(emploiData.data    || []);
      if (notesData.success)  setNotes(notesData.notes      || []);
      if (examsData.success)  setExams(examsData.exams      || []);

      if (notifsData.success) {
        setAnnouncements(
          (notifsData.notifications || [])
            .filter(n => n.type === 'system' || n.type === 'alert')
            .slice(0, 5)
            .map(n => ({
              tag: n.tag || 'Info', tagClass: 'db-tag-blue',
              text: n.msg || '', message: n.msg || '',
              createdAt: n.createdAt || new Date().toISOString(),
            }))
        );
      }

      // Messages reçus (inbox étudiant)
      try {
       const msgsData = await apiFetch('/notifications'); // fallback
if (msgsData.success) {
  setMessages([]);  // vide par défaut si pas d'endpoint dédié
}
        if (msgsData.success) {
          setMessages((msgsData.messages || []).map(m => ({
            id: m.id || m._id,
            from: m.from || 'Administration',
            avatar: (m.from || 'AD').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            subject: m.subject || '—',
            preview: m.preview || (m.body || '').slice(0, 80),
            body: m.body || '',
            tag: m.tag || 'system',
            read: m.read || false,
            starred: m.starred || false,
            time: m.time || new Date().toLocaleDateString('en-US'),
          })));
        }
      } catch { setMessages([]); }

      setConges([]);
    } catch (err) {
      console.error('useDashboardData:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { user, absences, emplois, notes, messages, setMessages, exams, announcements, conges, loading, error, reload: load };
}