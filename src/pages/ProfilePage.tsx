import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, Trash2, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { updateUsername, changePassword, deleteAccount } from '../lib/api';
import { BackgroundLayout } from '../components/layout/BackgroundLayout';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.user_metadata?.username || '');

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // UC-010: Update Username
  const handleUpdateUsername = async () => {
    if (!newUsername || newUsername.length < 3 || newUsername.length > 20) {
      setMessage({ type: 'error', text: 'Username must be 3-20 characters' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Call server-authoritative Edge Function
      const result = await updateUsername(newUsername);

      if (!result.ok) {
        setMessage({ type: 'error', text: result.error });
        return;
      }

      setMessage({ type: 'success', text: 'Username updated successfully!' });
      setIsEditingUsername(false);

      // Refresh the page to show new username from auth metadata
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // UC-011: Change Password
  const handleChangePassword = async () => {
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Call server-authoritative Edge Function
      const result = await changePassword(passwordData.newPassword);

      if (!result.ok) {
        setMessage({ type: 'error', text: result.error });
        return;
      }

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setShowPasswordChange(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // UC-012: Log Out
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // UC-013: Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type DELETE to confirm' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Call server-authoritative Edge Function
      const result = await deleteAccount(deleteConfirmText);

      if (!result.ok) {
        setMessage({ type: 'error', text: result.error });
        return;
      }

      setMessage({
        type: 'success',
        text: 'Account deleted successfully. Redirecting...'
      });

      setShowDeleteConfirm(false);
      setDeleteConfirmText('');

      // Sign out and redirect after a brief delay
      setTimeout(() => {
        signOut();
        navigate('/');
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <BackgroundLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-parchment-100">Loading...</div>
        </div>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-parchment-100 mb-2">
              Profile
            </h1>
            <p className="text-parchment-200/70 text-sm">
              Manage your ninja operative account
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded border-l-4 ${
                message.type === 'success'
                  ? 'bg-green-900/20 border-green-500 text-green-300'
                  : 'bg-red-900/20 border-red-500 text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Main Profile Card */}
          <div className="bg-ink-800/50 backdrop-blur-sm border border-ink-700 rounded-lg p-6 md:p-8 shadow-2xl space-y-6">

            {/* UC-009: Profile Information Display */}
            <div className="space-y-4">
              {/* Username Section */}
              <div className="flex items-center justify-between p-4 bg-ink-900/30 rounded border border-ink-700/50">
                <div className="flex items-center gap-3">
                  <User className="text-parchment-200/50" size={20} />
                  <div>
                    <div className="text-xs text-parchment-200/70 uppercase tracking-wider">Username</div>
                    {isEditingUsername ? (
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="mt-1 bg-ink-950 border border-ink-600 rounded px-3 py-1 text-parchment-100 focus:border-hanko-500 focus:outline-none"
                        placeholder="Enter new username"
                      />
                    ) : (
                      <div className="text-parchment-100 font-mono">{user.user_metadata?.username || 'Not set'}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditingUsername ? (
                    <>
                      <button
                        onClick={handleUpdateUsername}
                        disabled={loading}
                        className="p-2 text-green-400 hover:bg-green-900/20 rounded transition-colors"
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingUsername(false);
                          setNewUsername(user.user_metadata?.username || '');
                        }}
                        disabled={loading}
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="p-2 text-parchment-200/70 hover:text-parchment-100 hover:bg-ink-700/50 rounded transition-colors"
                      title="Edit username"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Email Section */}
              <div className="flex items-center gap-3 p-4 bg-ink-900/30 rounded border border-ink-700/50">
                <Mail className="text-parchment-200/50" size={20} />
                <div>
                  <div className="text-xs text-parchment-200/70 uppercase tracking-wider">Email</div>
                  <div className="text-parchment-100 font-mono">{user.email}</div>
                </div>
              </div>

              {/* Account Created */}
              <div className="flex items-center gap-3 p-4 bg-ink-900/30 rounded border border-ink-700/50">
                <Shield className="text-parchment-200/50" size={20} />
                <div>
                  <div className="text-xs text-parchment-200/70 uppercase tracking-wider">Member Since</div>
                  <div className="text-parchment-100 font-mono">
                    {new Date(user.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* UC-011: Change Password Section */}
            <div className="border-t border-ink-700/50 pt-6">
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="w-full flex items-center justify-between p-4 bg-ink-900/30 rounded border border-ink-700/50 hover:bg-ink-700/30 transition-colors"
              >
                <span className="text-parchment-100">Change Password</span>
                <Shield size={18} className="text-parchment-200/50" />
              </button>

              {showPasswordChange && (
                <div className="mt-4 p-4 bg-ink-900/30 rounded border border-ink-700/50 space-y-4">
                  <div>
                    <label className="block text-sm text-parchment-200/70 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full bg-ink-950 border border-ink-600 rounded px-3 py-2 text-parchment-100 focus:border-hanko-500 focus:outline-none"
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-parchment-200/70 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full bg-ink-950 border border-ink-600 rounded px-3 py-2 text-parchment-100 focus:border-hanko-500 focus:outline-none"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    variant="primary"
                    className="w-full"
                  >
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </div>
              )}
            </div>

            {/* UC-012: Log Out */}
            <div className="border-t border-ink-700/50 pt-6">
              <Button
                onClick={handleLogout}
                disabled={loading}
                variant="ghost"
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                {loading ? 'Logging Out...' : 'Log Out'}
              </Button>
            </div>

            {/* UC-013: Delete Account */}
            <div className="border-t border-ink-700/50 pt-6">
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="w-full flex items-center justify-between p-4 bg-red-900/20 rounded border border-red-800/50 hover:bg-red-900/30 transition-colors text-red-300"
              >
                <span>Delete Account</span>
                <Trash2 size={18} />
              </button>

              {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-red-900/20 rounded border border-red-800/50 space-y-4">
                  <div className="text-red-300 text-sm">
                    <p className="font-bold mb-2">⚠️ Warning: This action cannot be undone!</p>
                    <p className="mb-2">Deleting your account will:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Permanently delete all your game progress</li>
                      <li>Remove your player profile and stats</li>
                      <li>Delete all your event history</li>
                      <li>Revoke access to your account</li>
                    </ul>
                  </div>
                  <div>
                    <label className="block text-sm text-red-300 mb-1">
                      Type <span className="font-mono font-bold">DELETE</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full bg-ink-950 border border-red-800 rounded px-3 py-2 text-parchment-100 focus:border-red-500 focus:outline-none"
                      placeholder="Type DELETE"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={loading || deleteConfirmText !== 'DELETE'}
                      variant="danger"
                      className="flex-1"
                    >
                      {loading ? 'Processing...' : 'Confirm Delete Account'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      variant="ghost"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Back to Game */}
            <div className="border-t border-ink-700/50 pt-6">
              <Button
                onClick={() => navigate('/game')}
                variant="ghost"
                className="w-full"
              >
                Return to Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}
