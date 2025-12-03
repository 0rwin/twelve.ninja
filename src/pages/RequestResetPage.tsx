import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BackgroundLayout } from '../components/layout/BackgroundLayout';
import { Button } from '../components/ui/Button';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RequestResetPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
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
            <h2 className="text-2xl font-serif text-parchment-100 mb-4">Check Your Email</h2>
            <p className="text-parchment-200/80 mb-4 leading-relaxed">
              We've sent password reset instructions to:
            </p>
            <p className="text-parchment-500 font-mono text-sm mb-6">{email}</p>
            <p className="text-sm text-parchment-200/60 mb-6 leading-relaxed">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-parchment-500 hover:text-parchment-100 transition-colors text-sm font-mono"
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Back to Login */}
        <div className="max-w-md w-full mb-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-parchment-200/70 hover:text-parchment-100 transition-colors text-sm font-mono"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>

        {/* Reset Request Form */}
        <div className="max-w-md w-full border border-ink-700 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-ink-900 border border-ink-700 rounded-full mx-auto flex items-center justify-center mb-4">
              <Mail className="text-parchment-500 opacity-80" size={20} />
            </div>
            <h2 className="text-2xl font-serif text-parchment-100">Reset Password</h2>
            <p className="text-xs text-parchment-500 font-mono mt-2">Enter your email to receive reset instructions</p>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs text-parchment-200/70 mb-2 font-mono tracking-wide">
                Email Address
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

            {error && (
              <div className="text-hanko-500 text-xs font-mono text-center bg-hanko-500/10 p-3 border border-hanko-500/20 rounded">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={loading} variant="primary" className="w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <div className="text-xs text-parchment-200/50 font-mono">
              Remember your password?{' '}
              <Link to="/login" className="text-parchment-500 hover:text-parchment-100 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}
