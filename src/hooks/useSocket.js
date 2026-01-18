import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import { useAuthStore } from '../store/authStore';

export const useSocket = (shopId = null) => {
  const socketRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected');
      
      // Join shop room if shopId is provided
      if (shopId && user.tenantId) {
        socket.emit('join-shop', {
          tenantId: user.tenantId,
          shopId,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Cleanup on unmount
    return () => {
      if (shopId && user.tenantId) {
        socket.emit('leave-shop', {
          tenantId: user.tenantId,
          shopId,
        });
      }
      socket.disconnect();
    };
  }, [user, shopId]);

  // Return socket instance and helper functions
  return {
    socket: socketRef.current,
    on: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    off: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    },
    emit: (event, data) => {
      if (socketRef.current) {
        socketRef.current.emit(event, data);
      }
    },
  };
};

