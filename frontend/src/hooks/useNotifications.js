// src/hooks/useNotifications.js
import { useEffect, useCallback, useState } from 'react';
import { getSharedSocket, joinRoom } from './socket';

const BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
const NOTIF_URL = `${BASE}/notifications`;
const getToken = () => localStorage.getItem('token');

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(NOTIF_URL, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Notifications fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const sock = getSharedSocket();
    joinRoom(userId);

    const onNew = (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    };
    const onRead = ({ id }) => {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };
    const onReadAll = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    };
    const onCleared = () => {
      setNotifications([]);
      setUnreadCount(0);
    };

    sock.on('notification:new',      onNew);
    sock.on('notification:read',     onRead);
    sock.on('notification:read-all', onReadAll);
    sock.on('notification:cleared',  onCleared);

    fetchNotifications();

    return () => {
      sock.off('notification:new',      onNew);
      sock.off('notification:read',     onRead);
      sock.off('notification:read-all', onReadAll);
      sock.off('notification:cleared',  onCleared);
    };
  }, [userId, fetchNotifications]);

  const markRead = useCallback(async (id) => {
    try {
      await fetch(`${NOTIF_URL}/${id}/read`, {
        method: 'PATCH', credentials: 'include',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await fetch(`${NOTIF_URL}/read-all`, {
        method: 'PATCH', credentials: 'include',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  }, []);

  const deleteOne = useCallback(async (id) => {
    try {
      await fetch(`${NOTIF_URL}/${id}`, {
        method: 'DELETE', credentials: 'include',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setNotifications(prev => {
        const removed = prev.find(n => n.id === id);
        if (removed && !removed.read)
          setUnreadCount(c => Math.max(0, c - 1));
        return prev.filter(n => n.id !== id);
      });
    } catch (err) { console.error(err); }
  }, []);

  const deleteAll = useCallback(async () => {
    try {
      await fetch(NOTIF_URL, {
        method: 'DELETE', credentials: 'include',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  }, []);

  return {
    notifications, unreadCount, loading,
    markRead, markAllRead, deleteOne, deleteAll,
    refresh: fetchNotifications,
  };
}