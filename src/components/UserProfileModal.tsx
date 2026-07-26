import React from 'react';
import { X, User, ShieldCheck, Mail, Building, Calendar, Zap, Sparkles, LogOut } from 'lucide-react';
import { UserAccount } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onOpenPricing: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenPricing,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-md font-bold text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">User Profile & Account</h2>
              <p className="text-[11px] text-slate-400">Manage plan settings and usage limits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* User Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <User className="h-4 w-4 text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Account Name</span>
                <span className="text-xs font-bold text-slate-200">{currentUser.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <Mail className="h-4 w-4 text-teal-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Email Address</span>
                <span className="text-xs font-bold text-slate-200">{currentUser.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <Building className="h-4 w-4 text-violet-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Organization / Workspace</span>
                <span className="text-xs font-bold text-slate-200">{currentUser.companyName || 'Individual Creator'}</span>
              </div>
            </div>
          </div>

          {/* Usage Status */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Subscription Tier:</span>
              <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider">
                {currentUser.plan} Plan
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Daily Messages Used:</span>
              <span className="font-mono font-bold text-teal-300">
                {currentUser.dailyMessageCount} / {currentUser.maxDailyMessages > 9999 ? '∞' : currentUser.maxDailyMessages}
              </span>
            </div>

            {currentUser.plan === 'free' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="w-full mt-2 flex items-center justify-center space-x-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-indigo-600 py-2 text-xs font-bold text-white shadow-md hover:opacity-95"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Upgrade to Unlimited Pro ($19/mo)</span>
              </button>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 rounded-xl border border-rose-900/50 bg-rose-950/20 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
