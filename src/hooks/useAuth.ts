import { useEffect } from 'react';
import { onAuthChanged } from '../services/auth.service';
import { useAuthStore } from '../store';

export function useAuth() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsub = onAuthChanged((user) => {
      setUser(user);
    });
    return unsub;
  }, []);
}
