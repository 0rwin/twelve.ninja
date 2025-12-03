import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BackgroundLayout } from '../components/layout/BackgroundLayout';
import { Button } from '../components/ui/Button';
import { Lock, CheckCircle } from 'lucide-react';

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <BackgroundLayout>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          <div className="max-w-md w-full border border-parchment-500/30 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center">
            <div className="w-16 h-16 bg-parchment-500/10 border border-parchment-500/30 rounded-full mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="text-parchment-500" size={32} />
            </div>
            <h2 className="text-2xl font-serif text-parchment-100 mb-4">Password Updated</h2>
            <p className="text-parchment-200/80 mb-4 leading-relaxed">
              Your password has been successfully reset.
            </p>
            <p className="text-sm text-parchment-200/60 font-mono mb-6">
              You'll be redirected to login shortly.
            </p>
            <div className="flex justify-center">
              <div className="w-12 h-12 border-2 border-parchment-500/30 border-t-parchment-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Update Password Form */}
        <div className="max-w-md w-full border border-ink-700 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-ink-900 border border-ink-700 rounded-full mx-auto flex items-center justify-center mb-4">
              <Lock className="text-parchment-500 opacity-80" size={20} />
            </div>
            <h2 className="text-2xl font-serif text-parchment-100">Set New Password</h2>
            <p className="text-xs text-parchment-500 font-mono mt-2">Choose a strong password</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs text-parchment-200/70 mb-2 font-mono tracking-wide">
                New Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-ink-950 border border-ink-700 text-parchment-200 p-3 rounded focus:outline-none focus:border-parchment-500 transition-colors font-mono text-sm placeholder:text-ink-700"
              />
              <p className="text-xs text-parchment-200/50 mt-1 font-mono">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs text-parchment-200/70 mb-2 font-mono tracking-wide">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
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
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BackgroundLayout>
  );
}
