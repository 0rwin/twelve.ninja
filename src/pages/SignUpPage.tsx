import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BackgroundLayout } from '../components/layout/BackgroundLayout';
import { Button } from '../components/ui/Button';
import { Scroll, ArrowLeft, CheckCircle } from 'lucide-react';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (username.length < 3 || username.length > 20) {
      setError('Username must be between 3 and 20 characters');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username, // Store username in auth metadata
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Step 2: Create player profile in database
        // This will be handled by a database trigger or we'll call the RPC function
        try {
          const { error: profileError } = await supabase.rpc('create_player_profile', {
            user_id: authData.user.id,
            user_email: email,
            player_username: username,
          });

          if (profileError) {
            console.error('Error creating player profile:', profileError);
            // Continue anyway - the user is created in auth
          }
        } catch (profileErr) {
          console.error('Error calling create_player_profile:', profileErr);
          // Continue anyway - the user is created in auth
        }

        setSuccess(true);
        setLoading(false);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
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
            <h2 className="text-2xl font-serif text-parchment-100 mb-4">Account Created</h2>
            <p className="text-parchment-200/80 mb-4 leading-relaxed">
              Welcome to the shadows, <span className="text-parchment-500 font-semibold">{username}</span>.
            </p>
            <p className="text-sm text-parchment-200/60 font-mono mb-6">
              Check your email to verify your account. You'll be redirected to login shortly.
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

        {/* Sign Up Form */}
        <div className="max-w-md w-full border border-ink-700 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-ink-900 border border-ink-700 rounded-full mx-auto flex items-center justify-center mb-4">
              <Scroll className="text-parchment-500 opacity-80" size={20} />
            </div>
            <h2 className="text-2xl font-serif text-parchment-100">Enter the Shadows</h2>
            <p className="text-xs text-parchment-500 font-mono mt-2">Create your operative identity</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs text-parchment-200/70 mb-2 font-mono tracking-wide">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Your ninja name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                className="w-full bg-ink-950 border border-ink-700 text-parchment-200 p-3 rounded focus:outline-none focus:border-parchment-500 transition-colors font-mono text-sm placeholder:text-ink-700"
              />
              <p className="text-xs text-parchment-200/50 mt-1 font-mono">3-20 characters</p>
            </div>

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
                minLength={6}
                className="w-full bg-ink-950 border border-ink-700 text-parchment-200 p-3 rounded focus:outline-none focus:border-parchment-500 transition-colors font-mono text-sm placeholder:text-ink-700"
              />
              <p className="text-xs text-parchment-200/50 mt-1 font-mono">Minimum 6 characters</p>
            </div>

            {error && (
              <div className="text-hanko-500 text-xs font-mono text-center bg-hanko-500/10 p-3 border border-hanko-500/20 rounded">
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={loading} variant="primary" className="w-full">
                {loading ? 'Creating account...' : 'Begin Journey'}
              </Button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <div className="text-xs text-parchment-200/50 font-mono">
              Already an operative?{' '}
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
