import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,

      // Login action
      login: async (credentials) => {
        try {
            // We'll import authService dynamically to avoid circular deps if needed, 
            // or just rely on the component to call service and pass data here.
            // But having logic here is cleaner.
            // Let's assume passed in data for now to be safe, or import at top if possible.
            // Actually, the plan said "Implement login action that uses authService".
            // So we will modify this file to import authService.
            // For now, let's just set the state setters and let the UI/hooks drive the async flow 
            // OR we can implement the thunk pattern here.
            // Let's go with the pattern where the store handles the async call.
            const { login } = await import('../services/authService'); 
            const response = await login(credentials);
            if (response.token) {
                 const { user, token } = response;
                 set({ 
                     user, 
                     token, 
                     isAuthenticated: true, 
                     role: user.role 
                 });
                 return user;
            }
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
      },

      setAuth: (user, token) => {
        set({ 
            user, 
            token, 
            isAuthenticated: !!token,
            role: user?.role || null 
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, role: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Clear other stores if needed
        localStorage.removeItem('tenant-storage'); 
        localStorage.removeItem('shop-storage');
      },

      updateUser: (userData) => {
        const user = get().user;
        const updatedUser = { ...user, ...userData };
        set({ user: updatedUser });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
          user: state.user, 
          token: state.token, 
          isAuthenticated: state.isAuthenticated,
          role: state.role
      }),
    }
  )
);

