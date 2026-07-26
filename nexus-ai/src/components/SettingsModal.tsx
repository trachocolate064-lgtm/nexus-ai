import React, { useState } from 'react';
import {
  X,
  Sliders,
  Cpu,
  Globe,
  MessageSquare,
  Sparkles,
  Sun,
  Moon,
  Trash2,
  Download,
  Languages,
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearHistory?: () => void;
  onExportHistory?: () => void;
}

const LANGUAGES = [
  'Auto-Detect',
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Chinese (Mandarin)',
  'Khmer',
  'Vietnamese',
  'Korean',
  'Arabic',
  'Portuguese',
  'Italian',
  'Russian',
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearHistory,
  onExportHistory,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">Nexus AI Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Appearance Theme */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sun className="h-4 w-4 text-amber-400" />
            <span>Appearance Theme</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`flex items-center justify-center space-x-2 rounded-xl border p-3 font-semibold text-xs transition-all ${
                settings.theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-md'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Moon className="h-4 w-4 text-indigo-400" />
              <span>Dark Mode (Default)</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`flex items-center justify-center space-x-2 rounded-xl border p-3 font-semibold text-xs transition-all ${
                settings.theme === 'light'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-md'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Light Canvas</span>
            </button>
          </div>
        </div>

        {/* AI Model Selection */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Cpu className="h-4 w-4 text-indigo-400" />
            <span>AI Reasoning Engine</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateSettings({ model: 'gemini-3.6-flash' })}
              className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                settings.model === 'gemini-3.6-flash'
                  ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-md shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="font-bold text-xs text-slate-100">Gemini 3.6 Flash</span>
              <span className="text-[11px] text-slate-400 mt-1">
                Fastest responses, multimodal file & image understanding.
              </span>
            </button>

            <button
              onClick={() => onUpdateSettings({ model: 'gemini-3.1-pro-preview' })}
              className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                settings.model === 'gemini-3.1-pro-preview'
                  ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-md shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-100">Gemini 3.1 Pro</span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">
                Deepest reasoning for complex STEM, math & multi-step logic.
              </span>
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Languages className="h-4 w-4 text-indigo-400" />
            <span>Response Language Preference</span>
          </label>
          <select
            value={settings.language || 'Auto-Detect'}
            onChange={(e) => onUpdateSettings({ language: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Response Detail Depth */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MessageSquare className="h-4 w-4 text-teal-400" />
            <span>Explanation Depth</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'concise', label: 'Concise', desc: 'Brief & direct' },
              { id: 'balanced', label: 'Balanced', desc: 'Standard detail' },
              { id: 'detailed', label: 'In-Depth', desc: 'Comprehensive' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => onUpdateSettings({ responseDetail: d.id as any })}
                className={`flex flex-col p-2.5 text-center rounded-xl border text-xs font-medium transition-all ${
                  settings.responseDetail === d.id
                    ? 'border-teal-500 bg-teal-500/10 text-teal-300 font-bold'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>{d.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Web Search Grounding Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Google Search Grounding</div>
              <div className="text-[11px] text-slate-400">
                Automatically verify web facts and cite live sources in responses.
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.enableSearchGrounding}
            onChange={(e) => onUpdateSettings({ enableSearchGrounding: e.target.checked })}
            className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        {/* Custom Directive Input */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>Custom System Directive</span>
          </label>
          <textarea
            rows={2}
            value={settings.systemPromptPrefix}
            onChange={(e) => onUpdateSettings({ systemPromptPrefix: e.target.value })}
            placeholder="e.g. Always include TypeScript type definitions in code blocks and write in clear bullet points..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Data & Storage Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Chat Data Management
          </div>
          <div className="flex flex-wrap gap-2">
            {onExportHistory && (
              <button
                type="button"
                onClick={onExportHistory}
                className="flex flex-1 items-center justify-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export History (.JSON)</span>
              </button>
            )}

            {onClearHistory && (
              confirmClear ? (
                <div className="flex items-center space-x-2 flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="flex-1 rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500"
                  >
                    Confirm Delete All
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="flex flex-1 items-center justify-center space-x-1.5 rounded-xl border border-rose-900/50 bg-rose-950/30 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                  <span>Clear All History</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Save/Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
          >
            Save & Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
