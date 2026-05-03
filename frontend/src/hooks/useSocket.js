// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { getSharedSocket, joinRoom } from './socket';

const ALL_EVENTS = [
  'notification:new',
  'notification:read',
  'notification:read-all',
  'notification:cleared',
  'absence:marked',
  'note:added',
  'student:added',
  'payment:updated',
  'section:updated',
  'section:assigned',
  'exam:added',
  'timetable:updated',
  'message:new', // ✅ manquait
];

export function useSocket(userId, onEvent) {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  });

  useEffect(() => {
    if (!userId) return;

    const sock = getSharedSocket();
    joinRoom(userId);

    const handlers = {};
    ALL_EVENTS.forEach(event => {
      handlers[event] = (data) => onEventRef.current(event, data);
      sock.on(event, handlers[event]);
    });

    // ✅ À la reconnexion, rejoindre les deux rooms
    const onConnect = () => {
      console.log('✅ Socket connecté:', sock.id);
      sock.emit('join', userId);
      const role = localStorage.getItem('role');
      if (role) sock.emit('join-role', role);
    };
    sock.on('connect', onConnect);

    return () => {
      ALL_EVENTS.forEach(event => sock.off(event, handlers[event]));
      sock.off('connect', onConnect); // ✅ cleanup propre
    };
  }, [userId]);
}