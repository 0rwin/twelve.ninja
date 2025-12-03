import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BackgroundLayout } from '../components/layout/BackgroundLayout';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token hash from URL params
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!tokenHash || type !== 'email') {
          setError('Invalid verification link');
          setVerifying(false);
          return;
        }

        // Supabase automatically handles email verification via the auth listener
        // We just need to check if the user is now authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          setError(sessionError.message);
          setVerifying(false);
          return;
        }

        if (session) {
          setVerifying(false);
          // Redirect to game after 2 seconds
          setTimeout(() => {
            navigate('/game');
          }, 2000);
        } else {
          setError('Email verification failed. Please try again.');
          setVerifying(false);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (verifying) {
    return (
      <BackgroundLayout>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          <div className="max-w-md w-full border border-ink-700 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center">
            <div className="w-16 h-16 border-2 border-parchment-500/30 border-t-parchment-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-serif text-parchment-100 mb-4">Verifying Email</h2>
            <p className="text-parchment-200/80 font-mono text-sm">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  if (error) {
    return (
      <BackgroundLayout>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          <div className="max-w-md w-full border border-hanko-500/30 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center">
            <div className="w-16 h-16 bg-hanko-500/10 border border-hanko-500/30 rounded-full mx-auto flex items-center justify-center mb-4">
              <XCircle className="text-hanko-500" size={32} />
            </div>
            <h2 className="text-2xl font-serif text-parchment-100 mb-4">Verification Failed</h2>
            <p className="text-parchment-200/80 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="relative px-8 py-3 font-sans font-medium transition-all duration-300 border backdrop-blur-sm group overflow-hidden tracking-widest uppercase text-sm border-parchment-500/50 text-parchment-200 hover:border-parchment-500 hover:text-parchment-100 hover:bg-parchment-500/10"
            >
              <span className="relative z-10">Go to Login</span>
            </button>
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-md w-full border border-parchment-500/30 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center">
          <div className="w-16 h-16 bg-parchment-500/10 border border-parchment-500/30 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle className="text-parchment-500" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-parchment-100 mb-4">Email Verified</h2>
          <p className="text-parchment-200/80 mb-4 leading-relaxed">
            Your email has been successfully verified.
          </p>
          <p className="text-sm text-parchment-200/60 font-mono mb-6">
            Redirecting you to the game...
          </p>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-2 border-parchment-500/30 border-t-parchment-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}
