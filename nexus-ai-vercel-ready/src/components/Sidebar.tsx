import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Search,
  Download,
  X,
  Code2,
  BookOpen,
  PenTool,
  Globe,
  Languages,
  Lightbulb,
  HelpCircle,
  Check,
  Zap,
  BarChart3,
  User,
  Briefcase,
} from 'lucide-react';
import { ChatSession, AssistantMode, UserAccount } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAllSessions: () => void;
  currentUser: UserAccount;
  onOpenProfile: () => void;
  onOpenPricing: () => void;
  onOpenAnalytics: () => void;
}

const MODE_ICONS: Record<AssistantMode, React.FC<{ className?: string }>> = {
  general: HelpCircle,
  programming: Code2,
  learning: BookOpen,
  writing: PenTool,
  research: Globe,
  business: Briefcase,
  translation: Languages,
  brainstorm: Lightbulb,
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
  currentUser,
  onOpenProfile,
  onOpenPricing,
  onOpenAnalytics,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterMode, setSelectedFilterMode] = useState<AssistantMode | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMode = selectedFilterMode === 'all' || s.mode === selectedFilterMode;
    return matchesSearch && matchesMode;
  });

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleExportHistory = () => {
    const exportData = JSON.stringify(sessions, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_ai_chats_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-80 flex-col border-r border-slate-800 bg-slate-950 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-400 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat Session</span>
          </button>
          <button
            onClick={onClose}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800/60">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Mode Filter Pills */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedFilterMode('all')}
              className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                selectedFilterMode === 'all'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            {(['programming', 'learning', 'writing', 'research'] as AssistantMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedFilterMode(m)}
                className={`rounded-md px-2 py-1 text-[11px] capitalize font-medium transition-colors ${
                  selectedFilterMode === m
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 text-xs">
              <MessageSquare className="h-8 w-8 mb-2 opacity-40" />
              <p>No chat sessions found</p>
            </div>
          ) : (
            filteredSessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const Icon = MODE_ICONS[s.mode] || MessageSquare;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                    {editingId === s.id ? (
                      <form
                        onSubmit={(e) => handleSaveRename(s.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-1"
                      >
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="rounded border border-indigo-500 bg-slate-950 px-1.5 py-0.5 text-xs text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate">{s.title || 'Untitled Conversation'}</span>
                    )}
                  </div>

                  {/* Actions on hover */}
                  {editingId !== s.id && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(s, e)}
                        className="p-1 text-slate-400 hover:text-indigo-400"
                        title="Rename"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(s.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400"
                        title="Delete session"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions & Account Status */}
        <div className="p-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
          {/* User Account Card */}
          <div
            onClick={onOpenProfile}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 font-bold text-white text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col truncate max-w-[120px]">
                <span className="font-bold text-slate-200 truncate">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{currentUser.plan} plan</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPricing();
              }}
              className="rounded-lg bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-indigo-500"
            >
              Upgrade
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleExportHistory}
              className="flex items-center space-x-1.5 rounded-lg px-2 py-1 hover:bg-slate-900 hover:text-slate-200 transition-colors text-[11px]"
              title="Export all chat history"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Export</span>
            </button>

            <button
              onClick={onOpenAnalytics}
              className="flex items-center space-x-1.5 rounded-lg px-2 py-1 hover:bg-slate-900 hover:text-slate-200 transition-colors text-[11px]"
              title="View analytics"
            >
              <BarChart3 className="h-3.5 w-3.5 text-teal-400" />
              <span>Analytics</span>
            </button>

            {sessions.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all chat sessions?')) {
                    onClearAllSessions();
                  }
                }}
                className="flex items-center space-x-1 rounded-lg px-2 py-1 text-slate-500 hover:bg-rose-950/30 hover:text-rose-400 transition-colors text-[11px]"
                title="Clear all chat history"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
