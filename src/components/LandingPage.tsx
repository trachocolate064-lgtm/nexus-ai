import React from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  Code,
  FileText,
  Mic,
  Globe,
  ArrowRight,
  CheckCircle2,
  Users,
  Star,
  Cpu,
  Layers,
  BarChart3,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, AGENT_SPECS } from '../data/saasData';
import { ViewMode } from '../types';

interface LandingPageProps {
  onLaunchApp: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onOpenPricing,
  onOpenAuth,
  onOpenAdmin,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onLaunchApp}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">Nexus AI</span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  v3.6 Pro
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition-colors">
              Features
            </a>
            <a href="#agents" className="hover:text-indigo-400 transition-colors">
              AI Agents
            </a>
            <button onClick={onOpenPricing} className="hover:text-violet-400 transition-colors">
              Pricing & Plans
            </button>
            <button onClick={onOpenAdmin} className="text-slate-400 hover:text-white transition-colors">
              Admin Portal
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-flex rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onLaunchApp}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all active:scale-95"
            >
              <span>Launch Nexus AI</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4">
        {/* Glowing Background FX */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-indigo-600/20 via-teal-500/10 to-transparent blur-3xl opacity-70" />

        <div className="mx-auto max-w-5xl text-center relative z-10 space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <Zap className="h-3.5 w-3.5 text-teal-400" />
            <span>Next-Generation Multi-Agent AI Platform</span>
            <ChevronRight className="h-3 w-3 text-indigo-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Your intelligent AI assistant for{' '}
            <span className="bg-gradient-to-r from-teal-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              work and learning.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Nexus AI integrates Google Gemini reasoning models with multimodal file analysis, real-time web search grounding, voice synthesis, and specialized AI agent modes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>Start Free Conversation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenPricing}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <span>View Pricing Plans</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <span>Powered by Gemini 3.6 Flash</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <span>No API Key Setup Required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <span>Privacy & Local History Security</span>
            </div>
          </div>
        </div>

        {/* Demo Interface Preview */}
        <div className="mx-auto max-w-6xl mt-12 px-2 relative z-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-2xl shadow-indigo-950/80 backdrop-blur-xl">
            <div className="flex items-center space-x-2 px-3 py-2 border-b border-slate-800">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">nexus-ai-studio // live-workspace</span>
            </div>
            <div className="p-4 sm:p-6 bg-slate-950/90 rounded-b-xl space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-bold text-xs">
                  YOU
                </div>
                <div className="rounded-2xl bg-indigo-600/20 border border-indigo-500/30 p-3.5 text-xs text-slate-200 max-w-xl">
                  Analyze this financial quarter report PDF and summarize key revenue drivers with risk factors in a clean bulleted breakdown.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 text-white font-bold text-xs">
                  AI
                </div>
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-xs text-slate-300 space-y-2 max-w-2xl">
                  <div className="font-bold text-slate-100 flex items-center space-x-2">
                    <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                    <span>Quarterly Executive Summary & Revenue Driver Analysis</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Based on the attached financial report, here is the structured analysis:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">SaaS Recurring Revenue:</strong> Increased by +28% YoY driven by enterprise pro tier upgrades.</li>
                    <li><strong className="text-slate-200">Infrastructure Optimization:</strong> Server latency dropped 35% following Gemini streaming edge deployment.</li>
                    <li><strong className="text-slate-200">Key Risk Factor:</strong> Customer acquisition costs rose 8% due to competitive marketing spend.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Showcase Section */}
      <section id="agents" className="py-20 border-t border-slate-900 bg-slate-950/60 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-teal-400">Custom AI Agents</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tailored Intelligence for Every Task
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Switch seamlessly between specialized prompt personas engineered for maximum precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENT_SPECS.map((agent) => (
              <div
                key={agent.mode}
                onClick={onLaunchApp}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${agent.gradient} text-white shadow-lg`}>
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-semibold text-slate-300 border border-slate-700">
                    {agent.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-teal-400 font-semibold mb-2">{agent.tagline}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.description}</p>
                <div className="flex items-center space-x-1 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Start with this agent</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 border-t border-slate-900 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Core Capabilities</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Speed, Clarity, and Precision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multimodal Vision & Documents</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload PDFs, PNG images, code, or plain text. Gemini reads and explains key details instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Live Search Grounding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your AI responses directly to real-time web facts and verified source URL citations.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Voice & Audio Synthesis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Speak directly via microphone and listen back to crisp AI responses using Gemini TTS models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/80 px-4">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Transparent Plans for Individuals and Teams
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Start for free with 20 daily messages or unlock unlimited AI usage with Pro.
          </p>
          <div className="pt-4">
            <button
              onClick={onOpenPricing}
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
            >
              Explore Subscription Matrix
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-4 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span className="font-bold text-slate-300">Nexus AI Platform</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <button onClick={onLaunchApp} className="hover:text-white transition-colors">
              Chat Interface
            </button>
            <button onClick={onOpenPricing} className="hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={onOpenAdmin} className="hover:text-white transition-colors">
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
