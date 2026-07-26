import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { PromptStarterCards } from './components/PromptStarterCards';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsModal } from './components/AnalyticsModal';
import { UserProfileModal } from './components/UserProfileModal';
import {
  ChatSession,
  Message,
  AssistantMode,
  UserSettings,
  FileAttachment,
  UserAccount,
  ViewMode,
  UserPlan,
} from './types';
import { MOCK_ACCOUNTS } from './data/saasData';

const STORAGE_SESSIONS_KEY = 'nexus_ai_sessions_v1';
const STORAGE_SETTINGS_KEY = 'nexus_ai_settings_v1';
const STORAGE_USER_KEY = 'nexus_ai_user_v1';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  defaultMode: 'general',
  model: 'gemini-3.6-flash',
  enableSearchGrounding: false,
  responseDetail: 'balanced',
  language: 'Auto-Detect',
  systemPromptPrefix: '',
  autoTTS: false,
};

export default function App() {
  // SaaS User & View Management
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return MOCK_ACCOUNTS[0]; // Starter Free default
  });

  const [viewMode, setViewMode] = useState<ViewMode>('app');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved chat sessions:', e);
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0].id;
      } catch (e) {}
    }
    return null;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  const [currentMode, setCurrentMode] = useState<AssistantMode>(settings.defaultMode || 'general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist User Account
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    } catch (e) {}
  }, [currentUser]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save chat sessions:', e);
    }
  }, [sessions]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Scroll to bottom on new message
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isStreaming]);

  // Plan Selection / Upgrade handler
  const handleSelectPlan = (planId: UserPlan) => {
    setCurrentUser((prev) => ({
      ...prev,
      plan: planId,
      maxDailyMessages: planId === 'free' ? 20 : 999999,
    }));
  };

  // Handle New Chat creation
  const handleNewChat = (mode?: AssistantMode) => {
    const newMode = mode || currentMode;
    const newSession: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: newMode,
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setCurrentMode(newMode);
  };

  // Handle selecting mode
  const handleSelectMode = (mode: AssistantMode) => {
    setCurrentMode(mode);
    if (activeSession && activeSession.messages.length === 0) {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSession.id ? { ...s, mode } : s))
      );
    }
  };

  // Delete chat session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Rename session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    setSessions([]);
    setActiveSessionId(null);
  };

  // Update Settings & Apply Theme
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (updated.theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      return updated;
    });
  };

  // Export History Handler
  const handleExportHistory = () => {
    const exportData = JSON.stringify(sessions, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_ai_chat_history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send Message Logic with Streaming SSE and Attachments
  const handleSendMessage = async (
    text: string,
    attachments?: FileAttachment[],
    overrideMode?: AssistantMode
  ) => {
    if ((!text.trim() && (!attachments || attachments.length === 0)) || isStreaming) return;

    // Check usage limit for Free tier
    if (currentUser.plan === 'free' && currentUser.dailyMessageCount >= currentUser.maxDailyMessages) {
      setIsPricingOpen(true);
      return;
    }

    // Increment message counter for active user
    setCurrentUser((prev) => ({
      ...prev,
      dailyMessageCount: prev.dailyMessageCount + 1,
    }));

    const modeToUse = overrideMode || currentMode;

    let targetSessionId = activeSessionId;
    let currentSessions = sessions;

    // Title generation helper
    const titleText = text.trim() || (attachments?.[0]?.name ? `File: ${attachments[0].name}` : 'New Conversation');

    // Create session if none active
    if (!targetSessionId || !currentSessions.some((s) => s.id === targetSessionId)) {
      const newSession: ChatSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: titleText.slice(0, 36) + (titleText.length > 36 ? '...' : ''),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: modeToUse,
        messages: [],
      };
      targetSessionId = newSession.id;
      currentSessions = [newSession, ...currentSessions];
      setSessions(currentSessions);
      setActiveSessionId(targetSessionId);
    }

    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      attachments,
      timestamp: Date.now(),
      mode: modeToUse,
    };

    const assistantMessageId = `msg_ai_${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      mode: modeToUse,
      isStreaming: true,
    };

    // Update state with User and placeholder Assistant messages
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === targetSessionId) {
          const isFirstMessage = s.messages.length === 0;
          return {
            ...s,
            title: isFirstMessage ? titleText.slice(0, 36) + (titleText.length > 36 ? '...' : '') : s.title,
            updatedAt: Date.now(),
            messages: [...s.messages, userMessage, initialAssistantMessage],
          };
        }
        return s;
      })
    );

    setIsStreaming(true);

    // Get conversation history for backend context
    const currentSessionObj = currentSessions.find((s) => s.id === targetSessionId);
    const existingMessages = currentSessionObj ? currentSessionObj.messages : [];
    const conversationHistory = [...existingMessages, userMessage];

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: conversationHistory,
          mode: modeToUse,
          searchGrounding: settings.enableSearchGrounding,
          responseDetail: settings.responseDetail,
          language: settings.language || 'Auto-Detect',
          systemPromptPrefix: settings.systemPromptPrefix,
          model: settings.model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported on this browser response.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedContent = '';
      let accumulatedGroundingSources: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6);
            try {
              const data = JSON.parse(jsonStr);

              if (data.error) {
                throw new Error(data.error);
              }

              if (data.chunk) {
                accumulatedContent += data.chunk;
              }

              if (data.groundingSources && Array.isArray(data.groundingSources)) {
                accumulatedGroundingSources = data.groundingSources;
              }

              // Stream update into state
              setSessions((prev) =>
                prev.map((s) => {
                  if (s.id === targetSessionId) {
                    return {
                      ...s,
                      messages: s.messages.map((m) =>
                        m.id === assistantMessageId
                          ? {
                              ...m,
                              content: accumulatedContent,
                              groundingSources: accumulatedGroundingSources,
                              isStreaming: !data.done,
                            }
                          : m
                      ),
                    };
                  }
                  return s;
                })
              );
            } catch (errParse) {
              console.warn('SSE Parse line error:', errParse);
            }
          }
        }
      }

      // Mark streaming complete
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMessageId ? { ...m, isStreaming: false } : m
              ),
            };
          }
          return s;
        })
      );
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stream generation aborted by user.');
      } else {
        console.error('Error during chat stream:', error);
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === targetSessionId) {
              return {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        error: error.message || 'Failed to generate AI response.',
                        isStreaming: false,
                      }
                    : m
                ),
              };
            }
            return s;
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Stop current streaming
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  // Regenerate last assistant message
  const handleRegenerate = () => {
    if (!activeSession || activeSession.messages.length < 2 || isStreaming) return;

    const lastUserMessageIndex = [...activeSession.messages]
      .reverse()
      .findIndex((m) => m.role === 'user');

    if (lastUserMessageIndex === -1) return;

    const actualIndex = activeSession.messages.length - 1 - lastUserMessageIndex;
    const lastUserMessage = activeSession.messages[actualIndex];

    // Remove current assistant message after it
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            messages: s.messages.slice(0, actualIndex),
          };
        }
        return s;
      })
    );

    handleSendMessage(lastUserMessage.content, lastUserMessage.attachments, activeSession.mode);
  };

  // View Mode: Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchApp={() => setViewMode('app')}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setViewMode('admin')}
      />
    );
  }

  // View Mode: Admin Dashboard
  if (viewMode === 'admin') {
    return (
      <AdminDashboard
        onClose={() => setViewMode('app')}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${settings.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Navigation Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          const s = sessions.find((x) => x.id === id);
          if (s) setCurrentMode(s.mode);
        }}
        onNewChat={() => handleNewChat()}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAllSessions={handleClearAllSessions}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Main Chat Container */}
      <div className="flex flex-1 flex-col h-full min-w-0 bg-slate-950">
        <Header
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          onNewChat={() => handleNewChat()}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          currentUser={currentUser}
          currentView={viewMode}
          onChangeView={setViewMode}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenPricing={() => setIsPricingOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto">
          {!activeSession || activeSession.messages.length === 0 ? (
            <PromptStarterCards
              activeMode={currentMode}
              onSelectPrompt={(prompt, mode) => {
                setCurrentMode(mode);
                handleSendMessage(prompt, undefined, mode);
              }}
            />
          ) : (
            <div className="mx-auto max-w-4xl pb-6">
              {activeSession.messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onRegenerate={handleRegenerate}
                  isLastAssistantMessage={
                    msg.role === 'assistant' && index === activeSession.messages.length - 1
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Dock */}
        <ChatInput
          onSendMessage={(text, attachments) => handleSendMessage(text, attachments)}
          onStopStreaming={handleStopStreaming}
          isStreaming={isStreaming}
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>

      {/* SaaS Product Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClearHistory={handleClearAllSessions}
        onExportHistory={handleExportHistory}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
        onLogout={() => {
          setCurrentUser(MOCK_ACCOUNTS[0]);
          setIsAuthOpen(false);
        }}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentUser={currentUser}
        onSelectPlan={handleSelectPlan}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        currentUser={currentUser}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onOpenPricing={() => setIsPricingOpen(true)}
        onLogout={() => {
          setCurrentUser(MOCK_ACCOUNTS[0]);
          setIsProfileOpen(false);
        }}
      />
    </div>
  );
}
