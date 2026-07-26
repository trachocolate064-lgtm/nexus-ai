import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Mic,
  MicOff,
  Globe,
  Paperclip,
  Sparkles,
  Code2,
  BookOpen,
  PenTool,
  Languages,
  Lightbulb,
  HelpCircle,
  Briefcase,
  X,
  Image as ImageIcon,
  FileText,
  FileSearch,
} from 'lucide-react';
import { AssistantMode, UserSettings, FileAttachment } from '../types';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: FileAttachment[]) => void;
  onStopStreaming?: () => void;
  isStreaming: boolean;
  currentMode: AssistantMode;
  onSelectMode: (mode: AssistantMode) => void;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
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

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  currentMode,
  onSelectMode,
  settings,
  onUpdateSettings,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Handle Speech Recognition setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      rec.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (overrideText?: string) => {
    const textToSend = overrideText !== undefined ? overrideText : input.trim();
    if ((!textToSend && attachments.length === 0) || isStreaming) return;

    let finalPrompt = textToSend;
    if (!finalPrompt && attachments.length > 0) {
      const hasImage = attachments.some((a) => a.type === 'image');
      finalPrompt = hasImage
        ? 'Please analyze this image and describe what you see in detail.'
        : 'Please summarize and explain the key contents of this attached file.';
    }

    onSendMessage(finalPrompt, attachments.length > 0 ? attachments : undefined);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (isImage || isPdf) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const base64 = dataUrl.split(',')[1] || '';
          const newAtt: FileAttachment = {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type: isImage ? 'image' : 'pdf',
            mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
            dataUrl,
            base64,
          };
          setAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
      } else {
        // Read text / code file
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const newAtt: FileAttachment = {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type: 'text',
            mimeType: file.type || 'text/plain',
            dataUrl: '',
            base64: '',
            content,
          };
          setAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="sticky bottom-0 z-20 w-full border-t border-slate-800 bg-slate-950/95 p-3 sm:p-4 backdrop-blur-md">
      <div className="mx-auto max-w-4xl space-y-2">
        {/* Attachments chips row */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-indigo-500/30 bg-slate-900/90 p-2 text-xs">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center space-x-2 rounded-lg bg-slate-950 px-2.5 py-1 text-slate-200 border border-slate-800"
              >
                {att.type === 'image' ? (
                  <img src={att.dataUrl} alt={att.name} className="h-6 w-6 rounded object-cover" />
                ) : (
                  <FileText className="h-4 w-4 text-indigo-400" />
                )}
                <span className="font-medium max-w-[140px] truncate">{att.name}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="text-slate-400 hover:text-rose-400 ml-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* Quick Action Shortcuts for attached files */}
            <div className="ml-auto flex items-center space-x-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleSubmit('Please provide a comprehensive summary and key takeaways of this file.')}
                className="flex items-center space-x-1 rounded-md bg-indigo-600/30 px-2 py-1 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/50"
              >
                <FileSearch className="h-3 w-3" />
                <span>Summarize</span>
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('Please analyze this attachment in detail and explain key details or issues.')}
                className="flex items-center space-x-1 rounded-md bg-teal-600/30 px-2 py-1 text-teal-300 border border-teal-500/30 hover:bg-teal-600/50"
              >
                <Sparkles className="h-3 w-3" />
                <span>Explain</span>
              </button>
            </div>
          </div>
        )}

        {/* Input box container */}
        <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-xl focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening... Speak clearly into your microphone...'
                : `Ask Nexus AI anything, attach files or images...`
            }
            className="w-full resize-none border-none bg-transparent p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none max-h-48"
          />

          {/* Action Toolbar Inside Input Container */}
          <div className="flex items-center justify-between border-t border-slate-800/60 px-3 py-2 text-xs">
            {/* Left controls: Mode selector & File attach */}
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              {/* Mode Dropdown / Shortcuts */}
              <div className="flex items-center space-x-1 bg-slate-950/80 rounded-lg p-1 border border-slate-800">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const isActive = currentMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onSelectMode(m.id)}
                      className={`flex items-center space-x-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title={`Switch to ${m.label} Mode`}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Attach File Button */}
              <label
                className="flex h-7 cursor-pointer items-center space-x-1 rounded-lg px-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors border border-slate-800/80 bg-slate-950"
                title="Upload images (PNG, JPG), PDF documents, or code files"
              >
                <Paperclip className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">Upload</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf,.txt,.js,.ts,.tsx,.json,.py,.java,.cpp,.html,.css,.md,.csv"
                  className="hidden"
                />
              </label>

              {/* Web Search Grounding Quick Toggle */}
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    enableSearchGrounding: !settings.enableSearchGrounding,
                  })
                }
                className={`flex h-7 items-center space-x-1 rounded-lg px-2 text-[11px] font-medium border transition-colors ${
                  settings.enableSearchGrounding
                    ? 'border-teal-500/40 bg-teal-500/10 text-teal-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
                title="Google Search grounding"
              >
                <Globe className="h-3 w-3" />
                <span className="hidden md:inline">Search</span>
              </button>
            </div>

            {/* Right controls: Mic & Send / Stop */}
            <div className="flex items-center space-x-2 shrink-0">
              {/* Mic button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={isListening ? 'Stop recording' : 'Voice dictation'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              {/* Send or Stop button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="flex h-8 items-center space-x-1 rounded-xl bg-rose-600 px-3 text-xs font-semibold text-white shadow-md shadow-rose-600/30 hover:bg-rose-500 transition-all"
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() && attachments.length === 0}
                  className="flex h-8 items-center space-x-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-3.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <span>Send</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footnote instruction */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>Nexus AI supports text, code, images, and PDF uploads.</span>
          <span className="hidden sm:inline">Press Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
