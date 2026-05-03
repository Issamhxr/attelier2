// src/hooks/useParentData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchParentChild } from '../api/api';

export function useParentData() {
  const [child,    setChild]    = useState(null);
  const [absences, setAbsences] = useState([]);
  const [notes,    setNotes]    = useState([]);
  const [emplois,  setEmplois]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [trigger,  setTrigger]  = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchParentChild();
      setChild(data.child);
      setAbsences(data.absences || []);
      setNotes(data.notes     || []);
      setEmplois(data.emplois  || []);
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

  return { child, absences, notes, emplois, loading, error, reload };
}