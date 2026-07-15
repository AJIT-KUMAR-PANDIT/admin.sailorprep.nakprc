import { useState } from 'react';
import { pb } from '../lib/pb';
import { Ship, Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await pb.collection('_superusers').authWithPassword(email, password);
      // AuthContext will automatically redirect because pb.authStore updates
    } catch (err: any) {
      console.error(err);
      setError('Invalid admin credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-container-low)] flex items-center justify-center p-4">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary-container)] opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob -z-10"></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-[var(--color-tertiary-container)] opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 -z-10"></div>

      <div className="glass-card w-full max-w-md p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[var(--color-primary)] text-[var(--color-on-primary)] p-4 rounded-2xl mb-4 premium-shadow">
            <Ship size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline-lg)' }}>
            SailorPrep <span className="text-[var(--color-primary)]">Admin</span>
          </h1>
          <p className="text-[var(--color-on-surface-variant)] mt-2">Sign in to manage the application.</p>
        </div>

        {error && (
          <div className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] p-4 rounded-xl mb-6 text-sm font-medium border border-[var(--color-error)]/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-on-surface-variant)]">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl py-3 pl-11 pr-4 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none" 
                placeholder="admin@sailorprep.com" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-on-surface-variant)]">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl py-3 pl-11 pr-4 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all outline-none" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-bold rounded-xl py-3.5 shadow-md hover:bg-[var(--color-primary)]/90 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
