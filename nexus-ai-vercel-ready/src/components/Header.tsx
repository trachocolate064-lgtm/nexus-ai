import React from 'react';
import {
  Sparkles,
  Plus,
  Settings,
  Globe,
  PanelLeft,
  Code2,
  BookOpen,
  PenTool,
  Languages,
  Lightbulb,
  HelpCircle,
  Cpu,
  ShieldCheck,
  Zap,
  BarChart3,
  User,
  Home,
  Briefcase,
} from 'lucide-react';
import { AssistantMode, UserSettings, UserAccount, ViewMode } from '../types';

interface HeaderProps {
  currentMode: AssistantMode;
  onSelectMode: (mode: AssistantMode) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  currentUser: UserAccount;
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onOpenProfile: () => void;
}

const MODES: Array<{ id: AssistantMode; label: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'programming', label: 'Code', icon: Code2 },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'writing', label: 'Writing', icon: PenTool },
  { id: 'research', label: 'Research', icon: Globe },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'translation', label: 'Translate', icon: Languages },
  { id: 'brainstorm', label: 'Brainstorm', icon: Lightbulb },
];

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onNewChat,
  onOpenSettings,
  onToggleSidebar,
  settings,
  onUpdateSettings,
  currentUser,
  currentView,
  onChangeView,
  onOpenAuth,
  onOpenPricing,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur-md">
      {/* Left section: Sidebar toggle & Logo */}
      <div className="flex items-center space-x-3">
        {currentView === 'app' && (
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            title="Toggle Chat Sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        )}

        <div
          className="flex items-center space-x-2.5 select-none cursor-pointer"
          onClick={() => onChangeView('landing')}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold tracking-tight text-slate-100 text-base">
                Nexus<span className="text-teal-400">AI</span>
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 uppercase">
                {currentUser.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Global View Navigation Pills */}
        <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-800 text-xs">
          <button
            onClick={() => onChangeView('landing')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
              currentView === 'landing' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => onChangeView('app')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
              currentView === 'app' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chat App</span>
          </button>
          <button
            onClick={onOpenPricing}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
              currentView === 'pricing' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Pricing</span>
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onChangeView('admin')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
                currentView === 'admin' ? 'bg-rose-600 text-white font-bold' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Middle section: Mode Selector Tabs (Desktop App View) */}
      {currentView === 'app' && (
        <div className="hidden xl:flex items-center space-x-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-3 w-3 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Right section: Usage Pill, Search Grounding, Profile Avatar, Settings, New Chat */}
      <div className="flex items-center space-x-2">
        {/* Daily Usage Counter Pill */}
        <button
          onClick={onOpenProfile}
          className="hidden sm:flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
          title="Daily usage status & account settings"
        >
          <BarChart3 className="h-3.5 w-3.5 text-teal-400" />
          <span className="font-mono text-[11px] font-bold">
            {currentUser.dailyMessageCount}/{currentUser.maxDailyMessages > 9999 ? '∞' : currentUser.maxDailyMessages}
          </span>
        </button>

        {/* Search Grounding Pill */}
        {currentView === 'app' && (
          <button
            onClick={() =>
              onUpdateSettings({
                enableSearchGrounding: !settings.enableSearchGrounding,
              })
            }
            className={`hidden lg:flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-all ${
              settings.enableSearchGrounding
                ? 'border-teal-500/40 bg-teal-500/10 text-teal-300 shadow-sm'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Google Search Grounding for live web facts"
          >
            <Globe className={`h-3.5 w-3.5 ${settings.enableSearchGrounding ? 'text-teal-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden xl:inline">Web Search</span>
          </button>
        )}

        {/* Settings button */}
        {currentView === 'app' && (
          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        )}

        {/* User Account Avatar */}
        <button
          onClick={onOpenProfile}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md border border-indigo-400/30 hover:opacity-90"
          title={`Signed in as ${currentUser.name}`}
        >
          {currentUser.name.charAt(0)}
        </button>

        {/* New Chat Primary Button */}
        {currentView === 'app' && (
          <button
            onClick={onNewChat}
            className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        )}
      </div>
    </header>
  );
};
