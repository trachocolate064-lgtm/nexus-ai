export type AssistantMode = 
  | 'general'
  | 'learning'
  | 'programming'
  | 'writing'
  | 'research'
  | 'translation'
  | 'brainstorm'
  | 'business';

export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: UserPlan;
  avatarUrl?: string;
  dailyMessageCount: number;
  maxDailyMessages: number;
  createdAt: number;
  companyName?: string;
}

export type ViewMode = 'landing' | 'app' | 'pricing' | 'admin' | 'analytics';

export interface SubscriptionPlan {
  id: UserPlan;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  dailyMessageLimit: number | 'Unlimited';
  badge?: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

export interface FeedbackItem {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  category: 'general' | 'bug' | 'feature' | 'praise';
  comment: string;
  date: string;
  status: 'new' | 'reviewed' | 'resolved';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'text';
  mimeType: string;
  dataUrl: string;
  base64: string;
  content?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  mode?: AssistantMode;
  attachments?: FileAttachment[];
  groundingSources?: GroundingSource[];
  isStreaming?: boolean;
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  mode: AssistantMode;
  messages: Message[];
  systemInstruction?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  defaultMode: AssistantMode;
  model: 'gemini-3.6-flash' | 'gemini-3.1-pro-preview';
  enableSearchGrounding: boolean;
  responseDetail: 'concise' | 'balanced' | 'detailed';
  language: string;
  systemPromptPrefix: string;
  autoTTS: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: AssistantMode;
  description: string;
  prompt: string;
  iconName: string;
}
