import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../utils/constants';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { token, isAuthenticated, user } = useAuthStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        let newSocket;

        if (isAuthenticated && token) {
            // Create socket connection
            // We assume the socket server is at the same base URL (or adjusted if API path differs)
            // Usually socket.io connects to the rootURL, not /api
            // If API_BASE_URL is 'http://localhost:5001/api', socket URL should be 'http://localhost:5001'
            const socketUrl = API_BASE_URL.replace('/api', '');

            newSocket = io(socketUrl, {
                auth: { token },
                transports: ['websocket'],
                reconnection: true,
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
            });

            // --- Global Event Listeners for Query Invalidation ---

            // Booking Updates
            newSocket.on('booking:created', (data) => {
                // Invalidate bookings lists
                queryClient.invalidateQueries({ queryKey: ['staff-bookings'] });
                queryClient.invalidateQueries({ queryKey: ['staff-dashboard'] });
                queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
                queryClient.invalidateQueries({ queryKey: ['customer-slots'] }); // Slot capacity changed
                queryClient.invalidateQueries({ queryKey: ['client-admin-dashboard'] }); // Dashboard stats changed

                // Only show toast if it's relevant to the current user (e.g. staff receiving new booking)
                // Ideally we check if the user belongs to the shop
                if (user?.role === 'staff' || user?.role === 'client_admin') {
                    toast.success('New booking received!');
                }
            });

            newSocket.on('booking:updated', (data) => {
                queryClient.invalidateQueries({ queryKey: ['staff-bookings'] });
                queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
                queryClient.invalidateQueries({ queryKey: ['staff-dashboard'] });

                if (data.status === 'arrived' && user?.role === 'staff') {
                    toast('Customer arrived!', { icon: '👋' });
                }
            });

            newSocket.on('booking:cancelled', (data) => {
                queryClient.invalidateQueries({ queryKey: ['staff-bookings'] });
                queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
                queryClient.invalidateQueries({ queryKey: ['staff-dashboard'] });
                queryClient.invalidateQueries({ queryKey: ['customer-slots'] });
            });

            // Slot Updates
            newSocket.on('slot:updated', () => {
                queryClient.invalidateQueries({ queryKey: ['slots'] });
                queryClient.invalidateQueries({ queryKey: ['customer-slots'] });
            });

            setSocket(newSocket);
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [isAuthenticated, token, queryClient, user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
