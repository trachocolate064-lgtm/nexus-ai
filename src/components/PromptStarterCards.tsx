import React, { useState } from 'react';
import {
  Sparkles,
  Code2,
  BookOpen,
  PenTool,
  Globe,
  Languages,
  Lightbulb,
  HelpCircle,
  Briefcase,
  ArrowRight,
  FileSearch,
  Mic,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PROMPT_TEMPLATES } from '../data/promptTemplates';
import { AssistantMode } from '../types';

interface PromptStarterCardsProps {
  onSelectPrompt: (prompt: string, mode: AssistantMode) => void;
  activeMode: AssistantMode;
}

const CATEGORY_TABS: Array<{ id: AssistantMode | 'all'; label: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'all', label: 'All Capabilities', icon: Sparkles },
  { id: 'programming', label: 'Coding & Debugging', icon: Code2 },
  { id: 'learning', label: 'Learning & Lessons', icon: BookOpen },
  { id: 'writing', label: 'Writing & Summaries', icon: PenTool },
  { id: 'research', label: 'Research & Search', icon: Globe },
  { id: 'business', label: 'Business Strategy', icon: Briefcase },
  { id: 'translation', label: 'Translation', icon: Languages },
  { id: 'brainstorm', label: 'Idea Generation', icon: Lightbulb },
  { id: 'general', label: 'Daily Tasks', icon: HelpCircle },
];

const PLATFORM_HIGHLIGHTS = [
  {
    icon: FileSearch,
    title: 'Multimodal Files & Vision',
    desc: 'Attach PDFs, text docs, code, and images for instant AI analysis, code reviews, and summaries.',
  },
  {
    icon: Globe,
    title: 'Google Web Grounding',
    desc: 'Toggle real-time web search for live facts, current events, and source citations.',
  },
  {
    icon: Mic,
    title: 'Voice & Speech Synthesis',
    desc: 'Speak directly with voice input and listen to clear AI audio readings via Gemini TTS.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    desc: 'Server-proxied API calls keep keys confidential with local conversation storage.',
  },
];

export const PromptStarterCards: React.FC<PromptStarterCardsProps> = ({
  onSelectPrompt,
  activeMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AssistantMode | 'all'>(activeMode || 'all');

  const filteredPrompts = PROMPT_TEMPLATES.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-center space-y-10">
      {/* Welcome Hero Banner */}
      <div className="flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>
        <div className="inline-flex items-center space-x-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300 mb-3">
          <Zap className="h-3.5 w-3.5 text-teal-400" />
          <span>Next-Gen Enterprise AI Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-teal-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Nexus AI</span>
        </h1>
        <p className="mt-3 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          Your professional AI platform for technical programming, multimodal document & image analysis, real-time web research, structured writing, and step-by-step learning.
        </p>
      </div>

      {/* Feature Showcase Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
        {PLATFORM_HIGHLIGHTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-sm hover:border-slate-700 transition-colors"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200 mb-1">{item.title}</h3>
              <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div>
        <div className="mb-4 text-left font-semibold text-xs text-slate-400 uppercase tracking-wider">
          Explore Starter Capabilities
        </div>
        <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 border-b border-slate-800/80 pb-4">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPrompt(item.prompt, item.category)}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 border border-slate-700/50">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-teal-400 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Start conversation</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

