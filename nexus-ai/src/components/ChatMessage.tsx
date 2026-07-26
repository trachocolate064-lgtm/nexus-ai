import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Code2,
  BookOpen,
  PenTool,
  Globe,
  Languages,
  Lightbulb,
  HelpCircle,
  Briefcase,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { Message, AssistantMode } from '../types';
import { CodeBlock } from './CodeBlock';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  isLastAssistantMessage?: boolean;
}

const MODE_BADGES: Record<AssistantMode, { label: string; icon: React.FC<{ className?: string }> }> = {
  general: { label: 'General', icon: HelpCircle },
  programming: { label: 'Code', icon: Code2 },
  learning: { label: 'Learning', icon: BookOpen },
  writing: { label: 'Writing', icon: PenTool },
  research: { label: 'Research', icon: Globe },
  business: { label: 'Business', icon: Briefcase },
  translation: { label: 'Translation', icon: Languages },
  brainstorm: { label: 'Brainstorm', icon: Lightbulb },
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRegenerate,
  isLastAssistantMessage,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);

  const isUser = message.role === 'user';

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleSpeech = async () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    setTtsError(null);
    setIsPlayingAudio(true);

    try {
      // First try backend Gemini TTS
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message.content }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio) {
          // Play raw PCM audio or web audio
          const binary = atob(data.audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }

          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          const float32Data = new Float32Array(bytes.length / 2);
          const dataView = new DataView(bytes.buffer);
          
          for (let i = 0; i < float32Data.length; i++) {
            float32Data[i] = dataView.getInt16(i * 2, true) / 32768;
          }

          const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 24000);
          audioBuffer.getChannelData(0).set(float32Data);

          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtx.destination);

          source.onended = () => setIsPlayingAudio(false);
          source.start();
          return;
        }
      }
    } catch (e) {
      console.warn('Backend TTS failed, using browser SpeechSynthesis fallback', e);
    }

    // Fallback: Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content.replace(/```[\s\S]*?```/g, ''));
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
      setTtsError('Audio playback not supported in this browser.');
    }
  };

  const ModeIcon = message.mode ? MODE_BADGES[message.mode]?.icon : null;
  const modeLabel = message.mode ? MODE_BADGES[message.mode]?.label : null;

  return (
    <div
      className={`group relative flex w-full gap-4 px-4 py-6 transition-colors ${
        isUser
          ? 'bg-transparent'
          : 'bg-slate-900/40 dark:bg-slate-900/60 border-y border-slate-800/50'
      }`}
    >
      {/* Avatar */}
      <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105">
        {isUser ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-indigo-500/20 shadow-md">
            <User className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 text-white shadow-teal-500/20 shadow-md">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Top bar: Author name & mode tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <span className={isUser ? 'text-indigo-400' : 'text-teal-400'}>
              {isUser ? 'You' : 'Nexus AI'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500 font-normal">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {!isUser && modeLabel && ModeIcon && (
              <div className="ml-2 flex items-center space-x-1 rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/50">
                <ModeIcon className="h-3 w-3 text-teal-400" />
                <span>{modeLabel}</span>
              </div>
            )}
          </div>
        </div>

        {/* User Attached Files Preview */}
        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 p-2 text-xs shadow-md"
              >
                {att.type === 'image' && att.dataUrl ? (
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    className="h-12 w-12 rounded-lg object-cover border border-slate-800"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/80">
                    <FileText className="h-5 w-5" />
                  </div>
                )}
                <div className="flex flex-col max-w-[180px]">
                  <span className="font-semibold text-slate-200 truncate">{att.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{att.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Content */}
        {message.error ? (
          <div className="flex items-center space-x-2 rounded-lg border border-rose-500/30 bg-rose-950/20 p-3.5 text-sm text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            <span>{message.error}</span>
          </div>
        ) : isUser ? (
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100 font-normal">
            {message.content}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-sm leading-relaxed text-slate-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const value = String(children).replace(/\n$/, '');

                  if (!inline && (match || value.includes('\n'))) {
                    return <CodeBlock language={language} value={value} />;
                  }

                  return (
                    <code
                      className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-xs text-indigo-300 border border-slate-700/60"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <div className="my-4 overflow-x-auto rounded-lg border border-slate-700/60 shadow-sm">
                      <table className="min-w-full divide-y divide-slate-700/60 text-left text-sm">
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return <thead className="bg-slate-800/70 text-slate-200 font-semibold">{children}</thead>;
                },
                th({ children }) {
                  return <th className="px-4 py-2.5 font-semibold text-slate-200">{children}</th>;
                },
                td({ children }) {
                  return <td className="px-4 py-2 text-slate-300 border-t border-slate-800/50">{children}</td>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                    >
                      {children}
                      <ExternalLink className="h-3 w-3 inline ml-0.5" />
                    </a>
                  );
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0 text-slate-200 leading-relaxed">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="mb-3 list-disc pl-5 space-y-1 text-slate-200">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="mb-3 list-decimal pl-5 space-y-1 text-slate-200">{children}</ol>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="my-3 border-l-4 border-indigo-500/80 bg-slate-800/30 py-2 pl-4 pr-3 italic text-slate-300 rounded-r-md">
                      {children}
                    </blockquote>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>

            {message.isStreaming && (
              <span className="inline-block h-4 w-1.5 animate-pulse rounded bg-teal-400 ml-1 align-middle" />
            )}
          </div>
        )}

        {/* Grounding Sources / Search Citations */}
        {!isUser && message.groundingSources && message.groundingSources.length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/80 p-3">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-teal-400 mb-2">
              <Globe className="h-3.5 w-3.5" />
              <span>Verified Web Sources ({message.groundingSources.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.groundingSources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/50 max-w-xs truncate"
                  title={source.title}
                >
                  <span className="truncate">{source.title || source.uri}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-teal-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Message Toolbar Actions for Assistant */}
        {!isUser && !message.isStreaming && (
          <div className="flex items-center space-x-2 pt-2 text-xs text-slate-400">
            <button
              onClick={handleCopyContent}
              className="flex items-center space-x-1 rounded px-2 py-1 transition-colors hover:bg-slate-800 hover:text-slate-200"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleSpeech}
              className={`flex items-center space-x-1 rounded px-2 py-1 transition-colors hover:bg-slate-800 ${
                isPlayingAudio ? 'text-teal-400 font-semibold' : 'hover:text-slate-200'
              }`}
              title="Read aloud"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 animate-bounce" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Listen</span>
                </>
              )}
            </button>

            {isLastAssistantMessage && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center space-x-1 rounded px-2 py-1 transition-colors hover:bg-slate-800 hover:text-slate-200"
                title="Regenerate response"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Regenerate</span>
              </button>
            )}

            {ttsError && (
              <span className="text-xs text-rose-400 ml-2">{ttsError}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
