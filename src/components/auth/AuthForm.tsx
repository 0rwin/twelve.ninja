// src/components/auth/AuthForm.tsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Scroll } from 'lucide-react';

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the login link!');
    setLoading(false);
  };

  return (
    <div className="max-w-md w-full border border-ink-700 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl relative">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-ink-900 border border-ink-700 rounded-full mx-auto flex items-center justify-center mb-4">
          <Scroll className="text-parchment-500 opacity-80" size={20} />
        </div>
        <h2 className="text-2xl font-serif text-parchment-100">Identity</h2>
        <p className="text-xs text-parchment-500 font-mono mt-2">Who enters the void?</p>
      </div>

      <form className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-ink-950 border border-ink-700 text-parchment-200 p-3 rounded focus:outline-none focus:border-parchment-500 transition-colors font-mono text-sm placeholder:text-ink-700"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-ink-950 border border-ink-700 text-parchment-200 p-3 rounded focus:outline-none focus:border-parchment-500 transition-colors font-mono text-sm placeholder:text-ink-700"
          />
        </div>

        {message && (
          <div className="text-hanko-500 text-xs font-mono text-center bg-hanko-500/10 p-2 border border-hanko-500/20 rounded">
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button onClick={handleLogin} disabled={loading} variant="primary">
            {loading ? '...' : 'Enter'}
          </Button>
          <Button onClick={handleSignUp} disabled={loading} variant="ghost">
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}