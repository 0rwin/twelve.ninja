import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { BackgroundLayout } from '../components/layout/BackgroundLayout';
import { Button } from '../components/ui/Button';
import { Scroll, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/game');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Navigation will be handled by auth state listener in App.tsx
        console.log('Login successful:', data.user.email);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Back to Landing */}
        <div className="max-w-md w-full mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-parchment-200/70 hover:text-parchment-100 transition-colors text-sm font-mono"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Login Form */}
        <div className="max-w-md w-full border border-ink-700 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-ink-900 border border-ink-700 rounded-full mx-auto flex items-center justify-center mb-4">
              <Scroll className="text-parchment-500 opacity-80" size={20} />
            </div>
            <h2 className="text-2xl font-serif text-parchment-100">Return to the Shadows</h2>
            <p className="text-xs text-parchment-500 font-mono mt-2">Enter your credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs text-parchment-200/70 mb-2 font-mono tracking-wide">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-ink-950 border border-ink-700 text-parchment-200 p-3 rounded focus:outline-none focus:border-parchment-500 transition-colors font-mono text-sm placeholder:text-ink-700"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-parchment-200/70 mb-2 font-mono tracking-wide">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-ink-950 border border-ink-700 text-parchment-200 p-3 rounded focus:outline-none focus:border-parchment-500 transition-colors font-mono text-sm placeholder:text-ink-700"
              />
            </div>

            {error && (
              <div className="text-hanko-500 text-xs font-mono text-center bg-hanko-500/10 p-3 border border-hanko-500/20 rounded">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={loading} variant="primary" className="w-full">
                {loading ? 'Entering...' : 'Enter the Shadows'}
              </Button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/reset-password"
              className="block text-xs text-parchment-500 hover:text-parchment-100 transition-colors font-mono"
            >
              Forgot your password?
            </Link>
            <div className="text-xs text-parchment-200/50 font-mono">
              New operative?{' '}
              <Link to="/signup" className="text-parchment-500 hover:text-parchment-100 transition-colors">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}
