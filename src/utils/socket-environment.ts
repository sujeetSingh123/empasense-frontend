export const socketEnvironment = {
  path: '/notifications-sockets/socket.io',
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionDelayMax: 500,
  randomizationFactor: 0.5,

  secure: true,
  transports: ['websocket'],
};

export const socketEndpoint = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
