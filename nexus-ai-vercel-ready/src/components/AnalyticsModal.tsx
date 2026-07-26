import React from 'react';
import { X, BarChart3, TrendingUp, Sparkles, PieChart, Users, Zap, Globe, MessageSquare } from 'lucide-react';
import { UserAccount } from '../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-md">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Nexus AI Usage Analytics</h2>
              <p className="text-[11px] text-slate-400">Personal & Platform Consumption Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Daily Usage Progress for Active User */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Your Daily Usage Counter</span>
              <span className="font-mono font-bold text-teal-400">
                {currentUser.dailyMessageCount} / {currentUser.maxDailyMessages > 9999 ? '∞' : currentUser.maxDailyMessages} Messages
              </span>
            </div>
            {currentUser.plan === 'free' && (
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (currentUser.dailyMessageCount / currentUser.maxDailyMessages) * 100)}%`,
                  }}
                />
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              {currentUser.plan === 'free'
                ? `Free tier limit resets every 24 hours. You have ${Math.max(0, currentUser.maxDailyMessages - currentUser.dailyMessageCount)} remaining.`
                : 'Pro & Enterprise tier accounts enjoy unlimited daily messages with Gemini models.'}
            </p>
          </div>

          {/* Popular Agents Usage Distribution */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Popular Custom AI Agent Modes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-indigo-300">Software Architect (Code)</span>
                  <span className="font-mono text-slate-400 font-bold">42%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[42%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-teal-300">General Assistant</span>
                  <span className="font-mono text-slate-400 font-bold">28%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-teal-400 w-[28%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-rose-300">Content Strategist (Writing)</span>
                  <span className="font-mono text-slate-400 font-bold">16%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-400 w-[16%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-amber-300">Socratic STEM Tutor</span>
                  <span className="font-mono text-slate-400 font-bold">14%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 w-[14%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Multimodal Feature Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
              <Globe className="h-4 w-4 text-teal-400 mx-auto" />
              <div className="text-sm font-bold text-white">68%</div>
              <div className="text-[10px] text-slate-400">Search Grounding Enabled</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
              <Zap className="h-4 w-4 text-indigo-400 mx-auto" />
              <div className="text-sm font-bold text-white">840ms</div>
              <div className="text-[10px] text-slate-400">Avg Stream First Byte</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
              <MessageSquare className="h-4 w-4 text-violet-400 mx-auto" />
              <div className="text-sm font-bold text-white">99.8%</div>
              <div className="text-[10px] text-slate-400">Successful Responses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
