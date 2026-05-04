import { create } from 'zustand';
import { AppUser, UserRole } from '../types';

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (v: boolean) => void;
  overrideRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  overrideRole: (role) =>
    set((s) => ({ user: s.user ? { ...s.user, role } : null })),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
