import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  UserPlus,
  ArrowLeft,
  HelpCircle,
  ShieldAlert,
  Info,
  Check,
  X,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthSession } from '../types';

interface SiteAuthGatekeeperProps {
  onAuthorized: (session: AuthSession) => void;
}

type AuthView = 'login' | 'signup' | 'forgot_password' | 'forgot_username' | 'reset_password_step';

export const SiteAuthGatekeeper: React.FC<SiteAuthGatekeeperProps> = ({ onAuthorized }) => {
  const [view, setView] = useState<AuthView>('login');
  const [authMode, setAuthMode] = useState<'credentials' | 'accessKey'>('credentials');
  
  // Login State
  const [email, setEmail] = useState('admin@careerpulseai.net');
  const [password, setPassword] = useState('admin123');
  const [accessKey, setAccessKey] = useState('SEO-ACCESS-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Registration (Sign Up) State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);

  // Recovery States
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState<{ type: 'success' | 'info'; text: string; details?: string } | null>(null);

  // Status & Error States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate Password Strength
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { label: 'Weak', percent: 25, color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 3) return { label: 'Moderate', percent: 65, color: 'bg-amber-500', text: 'text-amber-400' };
    return { label: 'Strong & Secure', percent: 100, color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const passStrength = getPasswordStrength(regPassword);

  // Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const payload =
        authMode === 'credentials'
          ? { email: email.trim(), password: password.trim(), rememberMe }
          : { accessKey: accessKey.trim(), rememberMe };

      const res = await axios.post('/api/auth/login', payload);

      if (res.data && res.data.success) {
        const session: AuthSession = {
          email: res.data.email || email,
          token: res.data.token,
          expiresAt: res.data.expiresAt,
          role: res.data.role || 'admin',
          rememberMe,
          authorizedAt: new Date().toISOString(),
        };

        localStorage.setItem('site_auth_session', JSON.stringify(session));
        toast.success(res.data.message || 'Site authorization verified.');
        onAuthorized(session);
      } else {
        setErrorMessage(res.data?.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || 'Authorization failed. Please verify credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regTermsAccepted) {
      setErrorMessage('You must accept the Terms of Service to create an account.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await axios.post('/api/auth/register', {
        name: regName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        termsAccepted: regTermsAccepted,
      });

      if (res.data && res.data.success) {
        const session: AuthSession = {
          email: res.data.email || regEmail,
          token: res.data.token,
          expiresAt: res.data.expiresAt,
          role: res.data.role || 'member',
          rememberMe: true,
          authorizedAt: new Date().toISOString(),
        };

        localStorage.setItem('site_auth_session', JSON.stringify(session));
        toast.success(res.data.message || 'Account successfully registered and signed in!');
        onAuthorized(session);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Registration failed. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Request
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await axios.post('/api/auth/forgot-password', {
        email: recoveryEmail.trim(),
      });

      if (res.data && res.data.success) {
        setResetToken(res.data.resetToken);
        setResetCodeInput(res.data.resetCode || '');
        setRecoveryMessage({
          type: 'success',
          text: `Reset instructions sent to ${recoveryEmail}.`,
          details: `Verification code: ${res.data.resetCode}`,
        });
        setView('reset_password_step');
        toast.success('Recovery code generated!');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to request password reset.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password Step Submit
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await axios.post('/api/auth/reset-password', {
        email: recoveryEmail.trim(),
        code: resetCodeInput.trim(),
        newPassword: newPassword.trim(),
      });

      if (res.data && res.data.success) {
        toast.success('Password successfully reset! Please sign in.');
        setEmail(recoveryEmail);
        setPassword(newPassword);
        setView('login');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to reset password.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Username Submit
  const handleForgotUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await axios.post('/api/auth/forgot-username', {
        email: recoveryEmail.trim(),
      });

      if (res.data && res.data.success) {
        setRecoveryMessage({
          type: 'info',
          text: `Account identifier for ${recoveryEmail}:`,
          details: `Username: "${res.data.username}"`,
        });
        toast.success('Account identifier retrieved!');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to retrieve username.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setAuthMode('credentials');
    setEmail('admin@careerpulseai.net');
    setPassword('admin123');
    setErrorMessage(null);
  };

  const handleQuickFillAccessKey = () => {
    setAuthMode('accessKey');
    setAccessKey('SEO-ACCESS-2026');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-xl overflow-y-auto">
      {/* Ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Branding & Lock Icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 mb-2">
            <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            <span>
              {view === 'login' && 'Secure Session Access'}
              {view === 'signup' && 'Create Account'}
              {view === 'forgot_password' && 'Password Recovery'}
              {view === 'forgot_username' && 'Username Recovery'}
              {view === 'reset_password_step' && 'Set New Password'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
            AutoSubmit <span className="text-indigo-400">Pro Enterprise</span>
          </h2>

          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {view === 'login' && 'Sign in to access multi-site submission engines, crawler APIs, and indexing tools.'}
            {view === 'signup' && 'Register your SEO workstation to unlock high-speed automated indexation.'}
            {view === 'forgot_password' && 'Enter your email to receive a password recovery verification code.'}
            {view === 'forgot_username' && 'Enter your registered email address to retrieve your username.'}
            {view === 'reset_password_step' && 'Enter the 6-digit verification code and your new account password.'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-2 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Recovery Info Box */}
        {recoveryMessage && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl space-y-1 text-xs text-indigo-200 animate-in fade-in">
            <div className="flex items-center space-x-1.5 font-bold text-indigo-300">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{recoveryMessage.text}</span>
            </div>
            {recoveryMessage.details && (
              <div className="font-mono text-cyan-300 font-bold bg-zinc-950/80 px-2 py-1 rounded-lg border border-zinc-800">
                {recoveryMessage.details}
              </div>
            )}
          </div>
        )}

        {/* ----------------- VIEW: LOGIN ----------------- */}
        {view === 'login' && (
          <>
            {/* Tab Selector: Account Login vs Access Key */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-2xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('credentials');
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'credentials'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Admin Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('accessKey');
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'accessKey'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Access Key PIN</span>
              </button>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {authMode === 'credentials' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                      <span>Account Email</span>
                      <button
                        type="button"
                        onClick={() => {
                          setRecoveryEmail(email);
                          setErrorMessage(null);
                          setRecoveryMessage(null);
                          setView('forgot_username');
                        }}
                        className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot Username?
                      </button>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@careerpulseai.net"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                      <span>Password</span>
                      <button
                        type="button"
                        onClick={() => {
                          setRecoveryEmail(email);
                          setErrorMessage(null);
                          setRecoveryMessage(null);
                          setView('forgot_password');
                        }}
                        className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                    <span>Site Access Key / PIN</span>
                    <span className="text-[10px] font-mono text-zinc-500">Default: SEO-ACCESS-2026</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      required
                      placeholder="SEO-ACCESS-2026"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono uppercase tracking-wider transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Remember session (30 days)</span>
                </label>

                <span className="text-[11px] text-emerald-400 flex items-center space-x-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>TLS / AES-256</span>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In &amp; Launch Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Fill Helpers */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Quick Auto-Fill Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setView('signup');
                    setErrorMessage(null);
                  }}
                  className="text-cyan-400 hover:underline cursor-pointer font-sans font-bold"
                >
                  Create New Account →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickFillAdmin}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 text-[11px] text-zinc-300 font-mono flex items-center justify-center space-x-1 transition-all cursor-pointer"
                >
                  <Mail className="w-3 h-3 text-indigo-400" />
                  <span>Admin (admin123)</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickFillAccessKey}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 text-[11px] text-zinc-300 font-mono flex items-center justify-center space-x-1 transition-all cursor-pointer"
                >
                  <Key className="w-3 h-3 text-cyan-400" />
                  <span>Access Key PIN</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ----------------- VIEW: SIGN UP (REGISTRATION) ----------------- */}
        {view === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  placeholder="Alex Rivera"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    placeholder="arivera"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="alex@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Create Password</span>
                <span className={`text-[10px] font-bold ${passStrength.text}`}>
                  {regPassword ? passStrength.label : 'Min 6 chars'}
                </span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength progress bar */}
              {regPassword && (
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full transition-all duration-300 ${passStrength.color}`}
                      style={{ width: `${passStrength.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Upper &amp; Lowercase</span>
                    <span>Numbers &amp; Symbols</span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms acceptance checkbox */}
            <div className="pt-1">
              <label className="flex items-start space-x-2 text-xs text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={regTermsAccepted}
                  onChange={(e) => setRegTermsAccepted(e.target.checked)}
                  required
                  className="w-4 h-4 mt-0.5 rounded bg-zinc-950 border-zinc-700 text-indigo-600 focus:ring-0"
                />
                <span className="leading-snug text-[11px]">
                  I agree to the <span className="text-indigo-400 underline">Terms of Service</span> and acknowledge the Privacy &amp; Anti-Spam Policy.
                </span>
              </label>
            </div>

            {/* Submit Registration */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account &amp; Sign In</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setErrorMessage(null);
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Already have an account? Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* ----------------- VIEW: FORGOT PASSWORD ----------------- */}
        {view === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                  placeholder="admin@careerpulseai.net"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Recovery Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setErrorMessage(null);
                  setRecoveryMessage(null);
                }}
                className="text-zinc-400 hover:text-zinc-200 inline-flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setView('forgot_username');
                  setErrorMessage(null);
                  setRecoveryMessage(null);
                }}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                Forgot Username?
              </button>
            </div>
          </form>
        )}

        {/* ----------------- VIEW: RESET PASSWORD (STEP 2) ----------------- */}
        {view === 'reset_password_step' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>6-Digit Verification Code</span>
                <span className="text-[10px] text-emerald-400 font-mono">Code pre-filled</span>
              </label>
              <input
                type="text"
                value={resetCodeInput}
                onChange={(e) => setResetCodeInput(e.target.value)}
                required
                placeholder="123456"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-center tracking-widest text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono text-base font-bold transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Set New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="New strong password"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Password &amp; Sign In</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setErrorMessage(null);
                  setRecoveryMessage(null);
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel and return to Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* ----------------- VIEW: FORGOT USERNAME ----------------- */}
        {view === 'forgot_username' && (
          <form onSubmit={handleForgotUsernameSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                  placeholder="admin@careerpulseai.net"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Retrieve Account Username</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setErrorMessage(null);
                  setRecoveryMessage(null);
                }}
                className="text-zinc-400 hover:text-zinc-200 inline-flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setView('forgot_password');
                  setErrorMessage(null);
                  setRecoveryMessage(null);
                }}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
