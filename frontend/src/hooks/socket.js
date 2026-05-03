// src/hooks/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:5000/api')
  .replace(/\/api$/, '');

let socket = null;
let joinedUserId = null;

export function getSharedSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      auth: { token: localStorage.getItem('token') },
    });
  }
  return socket;
}

export function joinRoom(userId) {
  if (!userId || joinedUserId === userId) return;
  const sock = getSharedSocket();

  // ✅ Récupère le rôle depuis localStorage
  const role = localStorage.getItem('role');

  const doJoin = () => {
    sock.emit('join', userId);
    if (role) sock.emit('join-role', role); // ✅ Rejoindre la room du rôle
    joinedUserId = userId;
    console.log(`✅ Socket rooms rejointes: user:${userId} + role:${role}`);
  };

  if (!sock.connected) {
    sock.connect();
    sock.once('connect', doJoin);
  } else {
    doJoin();
  }
}