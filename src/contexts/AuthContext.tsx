import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { pb } from '../lib/pb';
import type { AuthModel } from 'pocketbase';

interface AuthContextType {
  user: AuthModel | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthModel | null>(pb.authStore.model);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(pb.authStore.isAdmin);

  useEffect(() => {
    // Initial check
    setUser(pb.authStore.model);
    setIsAdmin(pb.authStore.isAdmin);
    setLoading(false);

    // Subscribe to auth store changes
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      setUser(model);
      setIsAdmin(pb.authStore.isAdmin);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
