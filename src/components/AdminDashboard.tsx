import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  Star,
  RefreshCw,
  X,
} from 'lucide-react';
import { UserAccount, FeedbackItem, UserPlan } from '../types';
import { MOCK_ACCOUNTS, MOCK_FEEDBACK } from '../data/saasData';

interface AdminDashboardProps {
  onClose: () => void;
  currentUser: UserAccount;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, currentUser }) => {
  const [users, setUsers] = useState<UserAccount[]>(MOCK_ACCOUNTS);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(MOCK_FEEDBACK);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'feedback' | 'system'>('users');

  const totalMessages = users.reduce((acc, u) => acc + u.dailyMessageCount, 0);
  const totalProUsers = users.filter((u) => u.plan === 'pro' || u.plan === 'enterprise').length;

  const handlePromotePlan = (userId: string, newPlan: UserPlan) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              plan: newPlan,
              maxDailyMessages: newPlan === 'free' ? 20 : 999999,
            }
          : u
      )
    );
  };

  const handleResolveFeedback = (feedbackId: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, status: 'resolved' } : f))
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-violet-600 text-white shadow-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-white">Nexus AI Admin Portal</h1>
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                System Administrator
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live user telemetry, AI token consumption, subscription tiers, and feedback management.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center space-x-1.5 self-start md:self-auto rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
          <span>Exit Admin Portal</span>
        </button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Registered Users</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{users.length}</span>
            <span className="text-[10px] text-teal-400 font-bold flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +18% MoM
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Messages Streamed</span>
            <MessageSquare className="h-4 w-4 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{totalMessages.toLocaleString()}</span>
            <span className="text-[10px] text-teal-400 font-bold">Gemini 3.6 SSE</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Paid Subscriptions (Pro/Ent)</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{totalProUsers}</span>
            <span className="text-[10px] text-amber-400 font-bold">
              {Math.round((totalProUsers / users.length) * 100)}% Conversion
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>API Health Status</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400">100% Operational</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 px-4 transition-colors ${
            activeTab === 'feedback'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          User Feedback Queue ({feedbacks.length})
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 px-4 transition-colors ${
            activeTab === 'system'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          System Telemetry & Gateway
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-400">Showing {filteredUsers.length} accounts</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Subscription Plan</th>
                  <th className="p-3.5">Daily Usage</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 text-indigo-300 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-100">{user.name}</span>
                          <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                          user.plan === 'enterprise'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : user.plan === 'pro'
                            ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-xs">
                      {user.dailyMessageCount} / {user.maxDailyMessages > 9999 ? '∞' : user.maxDailyMessages}
                    </td>

                    <td className="p-3.5">
                      <span className="text-[11px] font-semibold text-slate-400">{user.role}</span>
                    </td>

                    <td className="p-3.5 text-right space-x-1.5">
                      {user.plan === 'free' ? (
                        <button
                          onClick={() => handlePromotePlan(user.id, 'pro')}
                          className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-500 transition-colors"
                        >
                          Upgrade to Pro
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePromotePlan(user.id, 'free')}
                          className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          Reset to Free
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback Queue */}
      {activeTab === 'feedback' && (
        <div className="space-y-3">
          {feedbacks.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-white">{item.userName}</span>
                  <span className="text-[11px] text-slate-400">({item.userEmail})</span>
                  <div className="flex items-center text-amber-400">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="ml-1 text-[11px] font-bold">{item.rating}/5</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                    item.status === 'resolved'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">{item.comment}</p>
              {item.status !== 'resolved' && (
                <button
                  onClick={() => handleResolveFeedback(item.id)}
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-500"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* System Gateway */}
      {activeTab === 'system' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Gemini Gateway Health & Tokens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold">Active Server Endpoint:</span>
              <div className="font-mono text-teal-400 font-bold">/api/chat/stream (SSE)</div>
              <p className="text-[11px] text-slate-500">
                Maintains standard 3000 port binding with lazy Gemini GenAI initialization.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold">TTS Voice Engine Endpoint:</span>
              <div className="font-mono text-indigo-400 font-bold">/api/tts (Gemini Flash TTS)</div>
              <p className="text-[11px] text-slate-500">
                Delivers raw audio/wav output for clear text-to-speech output.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
