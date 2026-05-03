// src/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import {
  fetchMe, fetchAbsences, fetchEmplois,
  fetchNotes, fetchAnnouncements, fetchConges,
  fetchExams, fetchMessages,
} from '../api/api';

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
  const [trigger,       setTrigger]       = useState(0);

  // ✅ Removed the stray await calls that were here

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const meData = await fetchMe();
      const u = meData.user || meData;
      setUser(u);

const [absData, emploiData, noteData, examData, msgData, annData, congeData] =
  await Promise.allSettled([
    fetchAbsences(),
    fetchEmplois(),
    fetchNotes(),      // ✅ plus besoin de u._id
    fetchExams(),      // ✅ plus besoin de u.section
    fetchMessages(),
    fetchAnnouncements(),
    fetchConges(),
  ]);
      if (absData.status    === 'fulfilled') setAbsences(absData.value?.absences          || []);
      if (emploiData.status === 'fulfilled') setEmplois(emploiData.value?.data            || emploiData.value?.emplois || []);
      if (noteData.status   === 'fulfilled') setNotes(noteData.value?.notes               || []);
      if (examData.status   === 'fulfilled') setExams(examData.value?.exams               || []);
      if (msgData.status    === 'fulfilled') setMessages(msgData.value?.messages          || []);
      if (annData.status    === 'fulfilled') setAnnouncements(annData.value?.announcements || []);
      if (congeData.status  === 'fulfilled') setConges(congeData.value?.conges            || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, trigger]);

  const reload = useCallback(() => setTrigger(t => t + 1), []);

  return {
    user, absences, emplois, notes, messages, setMessages,
    exams, announcements, conges, loading, error, reload,
  };
}