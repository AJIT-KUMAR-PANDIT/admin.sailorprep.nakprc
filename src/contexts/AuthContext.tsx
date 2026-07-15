import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { pb } from '../lib/pb';
import type { AuthModel } from 'pocketbase';

interface AuthContextType {
  user: AuthModel | null;
  isSuperuser: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isSuperuser: false, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthModel | null>(pb.authStore.model);
  const [loading, setLoading] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(pb.authStore.isSuperuser);

  useEffect(() => {
    // Initial check
    setUser(pb.authStore.model);
    setIsSuperuser(pb.authStore.isSuperuser);
    setLoading(false);

    // Subscribe to auth store changes
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      setUser(model);
      setIsSuperuser(pb.authStore.isSuperuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSuperuser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
