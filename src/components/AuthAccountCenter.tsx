import React, { useState } from 'react';
import {
  Shield,
  Key,
  Smartphone,
  History,
  Laptop,
  Globe,
  Lock,
  UserCheck,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Copy,
  RefreshCw,
  LogOut,
  Mail,
  User,
  Building,
  CreditCard,
  Bell,
  Sparkles,
  Sliders,
  Check,
  Radio,
} from 'lucide-react';
import { UserAccountProfile, DeviceSession, LoginHistoryItem, UserRole } from '../types';
import toast from 'react-hot-toast';

interface AuthAccountCenterProps {
  currentUser?: UserAccountProfile;
  onUpdateUser?: (updated: Partial<UserAccountProfile>) => void;
}

export const AuthAccountCenter: React.FC<AuthAccountCenterProps> = ({
  currentUser: initialUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'sessions' | 'rbac' | 'api_keys' | 'notifications'>('security');

  const [userProfile, setUserProfile] = useState<UserAccountProfile>(
    initialUser || {
      id: 'usr_enterprise_01',
      name: 'Executive Operations Lead',
      email: 'admin@careerpulseai.net',
      role: 'Administrator',
      companyName: 'CareerPulse AI Systems',
      planTier: 'Enterprise Pro',
      mfaEnabled: true,
      mfaMethod: 'authenticator_app',
      activeSessionsCount: 3,
      apiTokensCount: 4,
      createdAt: '2025-01-15T08:30:00Z',
    }
  );

  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([
    {
      id: 'sess_1',
      device: 'MacBook Pro 16" (macOS 15.2)',
      browser: 'Chrome 132.0 (HTTPS)',
      ipAddress: '198.51.100.42',
      location: 'San Francisco, CA, USA',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: 'sess_2',
      device: 'iPhone 16 Pro (iOS 18.2)',
      browser: 'Mobile Safari 18.2',
      ipAddress: '172.56.21.89',
      location: 'San Jose, CA, USA',
      lastActive: '34 minutes ago',
      isCurrent: false,
    },
    {
      id: 'sess_3',
      device: 'Linux Indexer Worker Node #4',
      browser: 'Automated Daemon Agent v2.4',
      ipAddress: '34.120.45.19',
      location: 'Google Cloud us-east1',
      lastActive: '2 minutes ago',
      isCurrent: false,
    },
  ]);

  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([
    {
      id: 'lh_1',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      ip: '198.51.100.42',
      location: 'San Francisco, CA',
      device: 'Chrome / macOS',
      status: 'SUCCESS',
      method: 'Password + TOTP MFA',
    },
    {
      id: 'lh_2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      ip: '172.56.21.89',
      location: 'San Jose, CA',
      device: 'Mobile Safari / iOS',
      status: 'SUCCESS',
      method: 'Biometric FaceID / Passkey',
    },
    {
      id: 'lh_3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      ip: '45.142.122.9',
      location: 'Frankfurt, Germany',
      device: 'Unknown Client',
      status: 'FAILED',
      method: 'Blocked: Rate Limit / IP Shield Challenge',
    },
  ]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleRevokeSession = (sessionId: string) => {
    setDeviceSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success('Session token revoked and destroyed immediately.');
  };

  const handleToggleMfa = () => {
    const updated = !userProfile.mfaEnabled;
    setUserProfile((prev) => ({ ...prev, mfaEnabled: updated }));
    if (onUpdateUser) onUpdateUser({ mfaEnabled: updated });
    toast.success(updated ? 'Multi-Factor Authentication (MFA) Activated' : 'MFA Disabled (Requires Admin re-verification)');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#222] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-display font-black text-2xl shadow-[3px_3px_0_#000]">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black uppercase text-black dark:text-zinc-100 font-mono-brutal">
                {userProfile.name}
              </h2>
              <span className="px-2.5 py-0.5 bg-[#ff4d00] text-black font-bold uppercase text-xs border border-black rounded">
                {userProfile.role}
              </span>
              <span className="px-2 py-0.5 bg-black text-white font-bold uppercase text-xs border border-black rounded">
                {userProfile.planTier}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono-brutal mt-1">
              {userProfile.email} • {userProfile.companyName} • Member since {new Date(userProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 bg-[#f2efeb] dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-mono-brutal font-bold flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${userProfile.mfaEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span>MFA: {userProfile.mfaEnabled ? 'ENFORCED' : 'OFFLINE'}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-500 rounded-lg text-xs font-mono-brutal font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>SOC-2 TYPE II COMPLIANT</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b-4 border-black dark:border-zinc-700 pb-2 overflow-x-auto">
        {[
          { id: 'security', label: 'Security & MFA', icon: Lock },
          { id: 'sessions', label: 'Active Devices & Sessions', icon: Laptop },
          { id: 'rbac', label: 'RBAC & Team Permissions', icon: UserCheck },
          { id: 'api_keys', label: 'API Keys & Secrets', icon: Key },
          { id: 'profile', label: 'Organization & Billing', icon: Building },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-mono-brutal font-extrabold uppercase border-2 border-black dark:border-zinc-600 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 shadow-[3px_3px_0_#ff4d00]'
                  : 'bg-white dark:bg-zinc-900 text-black dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-[2px_2px_0_#000]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Security & MFA */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono-brutal">
          {/* Card 1: Multi-Factor Authentication */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black/20 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#ff4d00]" />
                <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100">
                  Two-Factor Authentication (2FA / MFA)
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded uppercase ${userProfile.mfaEnabled ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                {userProfile.mfaEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Require an authenticator app (Google Authenticator, 1Password, or Authy) code on every administrative login and sensitive action like API key rotation.
            </p>

            <div className="p-3 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-black dark:text-zinc-200">Current Method:</span>
                <span className="font-bold text-[#ff4d00]">TOTP Authenticator App</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-black dark:text-zinc-200">Backup Emergency Codes:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">8 remaining</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleToggleMfa}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer transition-all ${
                  userProfile.mfaEnabled
                    ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-800'
                    : 'bg-[#ff4d00] text-black hover:bg-black hover:text-white'
                }`}
              >
                {userProfile.mfaEnabled ? 'Disable 2FA Protection' : 'Enable 2FA Protection'}
              </button>

              <button
                onClick={() => toast.success('Generated 10 new emergency backup codes!')}
                className="px-3 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] cursor-pointer"
              >
                Regenerate Codes
              </button>
            </div>
          </div>

          {/* Card 2: Password Reset & Hardening */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000] space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black/20 dark:border-zinc-800 pb-3">
              <Key className="w-5 h-5 text-black dark:text-zinc-100" />
              <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100">
                Password &amp; Credential Hardening
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 uppercase mb-1">
                  New Strong Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-lg font-mono-brutal text-xs focus:ring-2 focus:ring-[#ff4d00]"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 dark:text-zinc-200 uppercase mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-lg font-mono-brutal text-xs focus:ring-2 focus:ring-[#ff4d00]"
                />
              </div>

              <div className="p-3 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-300 dark:border-zinc-800 space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Argon2id Key Derivation + AES-256-GCM at rest</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Automatic lockout after 5 consecutive failed attempts</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!newPassword || newPassword !== confirmPassword) {
                    toast.error('Passwords do not match or empty.');
                    return;
                  }
                  toast.success('Password updated successfully across all cluster nodes!');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="w-full py-2 bg-black hover:bg-[#ff4d00] text-white hover:text-black font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer transition-all"
              >
                Update Master Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Active Devices & Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-6 font-mono-brutal">
          <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black/20 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#ff4d00]" />
                  <span>Authorized Devices &amp; Active JWT Sessions</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Real-time visibility into all active browser sessions, indexing daemon workers, and mobile devices.
                </p>
              </div>
              <button
                onClick={() => {
                  setDeviceSessions((prev) => prev.filter((s) => s.isCurrent));
                  toast.success('All other remote sessions have been revoked.');
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-800 rounded-lg text-xs font-bold uppercase cursor-pointer"
              >
                Revoke All Others
              </button>
            </div>

            <div className="space-y-3">
              {deviceSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-white dark:bg-zinc-800 border border-black dark:border-zinc-700 rounded-lg text-black dark:text-zinc-200">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-black dark:text-zinc-100">{session.device}</span>
                        {session.isCurrent && (
                          <span className="px-2 py-0.2 bg-emerald-500 text-white text-[9px] font-extrabold uppercase rounded">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {session.browser} • IP: <span className="font-bold text-black dark:text-zinc-300">{session.ipAddress}</span> ({session.location})
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-0.5">
                        Last Active: {session.lastActive}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="px-3 py-1 bg-white dark:bg-zinc-900 hover:bg-rose-500 hover:text-white text-rose-600 border border-rose-600 text-xs font-bold uppercase rounded cursor-pointer transition-all"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Login Audit Trail */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000] space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black/20 dark:border-zinc-800 pb-3">
              <History className="w-4 h-4 text-black dark:text-zinc-200" />
              <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100">
                Security Audit Trail &amp; Login History
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-950 border-b-2 border-black dark:border-zinc-700">
                    <th className="p-2.5 font-bold uppercase">Timestamp</th>
                    <th className="p-2.5 font-bold uppercase">IP Address</th>
                    <th className="p-2.5 font-bold uppercase">Location</th>
                    <th className="p-2.5 font-bold uppercase">Method</th>
                    <th className="p-2.5 font-bold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loginHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40">
                      <td className="p-2.5 text-zinc-600 dark:text-zinc-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2.5 font-bold text-black dark:text-zinc-200">{item.ip}</td>
                      <td className="p-2.5 text-zinc-700 dark:text-zinc-300">{item.location}</td>
                      <td className="p-2.5 text-zinc-600 dark:text-zinc-400">{item.method}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                              : 'bg-rose-100 text-rose-800 border border-rose-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RBAC Roles & Team */}
      {activeTab === 'rbac' && (
        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000] space-y-6 font-mono-brutal">
          <div>
            <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#ff4d00]" />
              <span>Role-Based Access Control (RBAC) Hierarchy</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Enterprise permission governance across your indexing infrastructure, API endpoints, and campaign budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                role: 'Owner',
                desc: 'Full administrative rights, billing ownership, API master key rotation, and account destruction rights.',
                color: 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300',
                badge: 'Tier 1 - Full Power',
              },
              {
                role: 'Administrator',
                desc: 'Manage campaigns, configure proxies, trigger audits, invite standard team members, and view reports.',
                color: 'border-[#ff4d00] bg-orange-50/50 dark:bg-orange-950/20 text-orange-950 dark:text-orange-200',
                badge: 'Tier 2 - Operations',
                current: userProfile.role === 'Administrator',
              },
              {
                role: 'Standard User',
                desc: 'Submit single & batch URLs, run GEO Content Grader, view historical analytics, and export CSV audit logs.',
                color: 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300',
                badge: 'Tier 3 - Execution',
              },
              {
                role: 'Read-Only User',
                desc: 'Review dashboard metrics, inspect live submission streams, and view executive plain-English summaries.',
                color: 'border-zinc-400 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-400',
                badge: 'Tier 4 - Auditor',
              },
            ].map((r) => (
              <div key={r.role} className={`p-4 border-2 rounded-xl space-y-2 ${r.color}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm uppercase">{r.role}</h4>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-black text-white rounded">
                    {r.badge}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{r.desc}</p>
                {r.current && (
                  <div className="pt-2 text-[10px] font-extrabold text-[#ff4d00] uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your Active Role</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase text-black dark:text-zinc-100">
                Need to invite team members or SEO clients?
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Issue invite tokens with scoped access to specific campaign tags or client domains.
              </p>
            </div>
            <button
              onClick={() => toast.success('Invite link generated: https://app.indexerengine.pro/invite/token_99x7')}
              className="px-4 py-2 bg-black hover:bg-[#ff4d00] text-white hover:text-black font-bold uppercase text-xs rounded-lg border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer transition-all"
            >
              + Invite Colleague
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: API Keys & Integrations */}
      {activeTab === 'api_keys' && (
        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000] space-y-4 font-mono-brutal">
          <div className="flex items-center justify-between border-b-2 border-black/20 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#ff4d00]" />
                <span>REST API Tokens &amp; Webhook Credentials</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Use programmatic keys to trigger URL submissions from CI/CD pipelines, WordPress plugins, or Zapier.
              </p>
            </div>
            <button
              onClick={() => toast.success('New API Token generated: idx_live_sk_94818294719284729')}
              className="px-3 py-1.5 bg-[#ff4d00] text-black font-bold uppercase text-xs border-2 border-black rounded-lg shadow-[2px_2px_0_#000] cursor-pointer"
            >
              + Create API Token
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'tok_1',
                name: 'Production Ingestion Pipeline (Google Cloud)',
                key: 'idx_live_sk_9f81a74e29c81b09284',
                lastUsed: 'Just now',
                scope: 'Full Indexing & Audits',
              },
              {
                id: 'tok_2',
                name: 'Zapier / WordPress Auto-Submit Webhook',
                key: 'idx_live_sk_33d7b89e11a2f477192',
                lastUsed: '2 hours ago',
                scope: 'Submit Only',
              },
            ].map((tok) => (
              <div
                key={tok.id}
                className="p-3.5 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-black dark:text-zinc-100">{tok.name}</div>
                  <div className="text-zinc-500 font-mono text-[11px] mt-0.5 flex items-center gap-2">
                    <span>{tok.key.substring(0, 15)}••••••••••••</span>
                    <button
                      onClick={() => handleCopy(tok.key, tok.id)}
                      className="text-[#ff4d00] hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                      {copiedKey === tok.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === tok.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1">
                    Scope: <span className="font-bold text-black dark:text-zinc-300">{tok.scope}</span> • Last used: {tok.lastUsed}
                  </div>
                </div>

                <button
                  onClick={() => toast.success('API Key revoked successfully.')}
                  className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-rose-600 text-rose-600 rounded text-[11px] font-bold hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                >
                  Revoke Key
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Organization & Billing */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000] space-y-4 font-mono-brutal">
          <div className="flex items-center gap-2 border-b-2 border-black/20 dark:border-zinc-800 pb-3">
            <Building className="w-5 h-5 text-black dark:text-zinc-200" />
            <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100">
              Subscription &amp; Enterprise Capacity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-1">
              <div className="text-[10px] font-bold text-zinc-500 uppercase">Current Tier</div>
              <div className="text-base font-black text-black dark:text-zinc-100">{userProfile.planTier}</div>
              <div className="text-[11px] text-emerald-600 font-bold">Unlimited Worker Threads</div>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-1">
              <div className="text-[10px] font-bold text-zinc-500 uppercase">Monthly URL Submissions</div>
              <div className="text-base font-black text-black dark:text-zinc-100">14,820 / 50,000</div>
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400">Resets in 18 days</div>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-1">
              <div className="text-[10px] font-bold text-zinc-500 uppercase">GEO AI Overviews Analyzed</div>
              <div className="text-base font-black text-black dark:text-zinc-100">1,240 / 5,000</div>
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400">Powered by Gemini AI</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
