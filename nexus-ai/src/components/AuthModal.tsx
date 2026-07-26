import React, { useState } from 'react';
import { X, User, Lock, Mail, Shield, CheckCircle2, Sparkles, Building } from 'lucide-react';
import { UserAccount, UserPlan } from '../types';
import { MOCK_ACCOUNTS } from '../data/saasData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'switch'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>('free');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const existing = MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      onLogin(existing);
    } else {
      const newUser: UserAccount = {
        id: `usr_${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: 'user',
        plan: selectedPlan,
        dailyMessageCount: 0,
        maxDailyMessages: selectedPlan === 'free' ? 20 : 999999,
        createdAt: Date.now(),
        companyName: companyName || 'Individual',
      };
      onLogin(newUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-white">Nexus AI Account Authentication</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switching */}
        <div className="grid grid-cols-3 border-b border-slate-800 text-xs font-semibold bg-slate-950/30">
          <button
            onClick={() => setTab('login')}
            className={`py-3 transition-colors ${
              tab === 'login'
                ? 'border-b-2 border-indigo-500 bg-indigo-500/10 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`py-3 transition-colors ${
              tab === 'signup'
                ? 'border-b-2 border-indigo-500 bg-indigo-500/10 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setTab('switch')}
            className={`py-3 transition-colors ${
              tab === 'switch'
                ? 'border-b-2 border-indigo-500 bg-indigo-500/10 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Demo Profiles
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Demo Profile Switcher */}
          {tab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Select a pre-configured account role to test different features and permissions:
              </p>
              <div className="space-y-2">
                {MOCK_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      onLogin(acc);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      currentUser.id === acc.id
                        ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 font-bold text-xs text-indigo-400">
                        {acc.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-slate-100">{acc.name}</span>
                        <span className="text-[11px] text-slate-400">{acc.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="rounded-full bg-indigo-950 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-indigo-300 border border-indigo-800">
                        {acc.plan}
                      </span>
                      {acc.role === 'admin' && (
                        <span className="rounded-full bg-rose-950 px-2 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-800">
                          Admin
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Login or Signup Form */}
          {(tab === 'login' || tab === 'signup') && (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              {tab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {tab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Initial Plan</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value as UserPlan)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="free">Starter Free (20 msgs/day)</option>
                    <option value="pro">Pro ($19/mo - Unlimited)</option>
                    <option value="enterprise">Enterprise ($49/mo - Teams)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-opacity"
              >
                {tab === 'login' ? 'Sign In to Account' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Current Active Account Card */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Active Account Session:</span>
              <span className="font-bold text-slate-200">{currentUser.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="w-full rounded-xl border border-rose-900/40 bg-rose-950/20 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/30 transition-colors"
            >
              Sign Out Active Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
