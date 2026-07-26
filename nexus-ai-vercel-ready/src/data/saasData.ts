import { SubscriptionPlan, UserAccount, FeedbackItem, AssistantMode } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter Free',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Perfect for casual exploration, daily questions, and light AI assistance.',
    dailyMessageLimit: 20,
    badge: 'Basic',
    features: [
      '20 messages per day',
      'Access to Gemini 3.6 Flash',
      'Standard response speed',
      'Basic document text uploads',
      'Web conversation history',
    ],
    ctaText: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Nexus Pro',
    priceMonthly: 19,
    priceAnnual: 15,
    description: 'Designed for power creators, software engineers, and active researchers.',
    dailyMessageLimit: 'Unlimited',
    badge: 'Most Popular',
    features: [
      'Unlimited daily AI conversations',
      'Gemini 3.6 Flash & Gemini 3.1 Pro',
      'Multimodal PDF, image & source code analysis',
      'Google Search web grounding citations',
      'Voice input & Gemini TTS Audio synthesis',
      'Priority response latency',
      'Export chat history (.JSON)',
    ],
    ctaText: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    priceMonthly: 49,
    priceAnnual: 39,
    description: 'Custom team management, dedicated system prompts, and administrative analytics.',
    dailyMessageLimit: 'Unlimited',
    badge: 'For Teams',
    features: [
      'Everything in Pro Plan',
      'Team workspace & shared agent profiles',
      'Admin monitoring dashboard & usage analytics',
      'Custom API rate limits & system prompts',
      'Dedicated SLA & 24/7 priority support',
      'SSO & SOC-2 security protocols',
    ],
    ctaText: 'Contact Sales / Upgrade',
    popular: false,
  },
];

export const MOCK_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr_free_01',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    role: 'user',
    plan: 'free',
    dailyMessageCount: 14,
    maxDailyMessages: 20,
    createdAt: Date.now() - 15 * 86400000,
    companyName: 'Individual Creator',
  },
  {
    id: 'usr_pro_02',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@techlabs.io',
    role: 'user',
    plan: 'pro',
    dailyMessageCount: 142,
    maxDailyMessages: 999999,
    createdAt: Date.now() - 45 * 86400000,
    companyName: 'TechLabs Innovations',
  },
  {
    id: 'usr_admin_03',
    name: 'Sarah Chen (Admin)',
    email: 'sarah.admin@nexusai.com',
    role: 'admin',
    plan: 'enterprise',
    dailyMessageCount: 88,
    maxDailyMessages: 999999,
    createdAt: Date.now() - 90 * 86400000,
    companyName: 'Nexus AI Platform Team',
  },
];

export const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb_1',
    userName: 'Marcus Vance',
    userEmail: 'marcus.v@codecraft.org',
    rating: 5,
    category: 'praise',
    comment: 'The coding mode and image analysis saved me hours of frontend debugging. Incremental code streaming is flawless!',
    date: '2026-07-25',
    status: 'reviewed',
  },
  {
    id: 'fb_2',
    userName: 'Sophea Kim',
    userEmail: 'sophea.k@designhub.asia',
    rating: 5,
    category: 'feature',
    comment: 'Love the voice input and TTS response feature! Can we get custom voice speed controls in settings?',
    date: '2026-07-24',
    status: 'new',
  },
  {
    id: 'fb_3',
    userName: 'David Miller',
    userEmail: 'd.miller@fintechglobal.com',
    rating: 4,
    category: 'general',
    comment: 'PDF summarization works cleanly. Very smooth UI transition between modes.',
    date: '2026-07-23',
    status: 'resolved',
  },
];

export interface CustomAgentSpec {
  mode: AssistantMode;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: string;
  gradient: string;
  defaultPrompt: string;
}

export const AGENT_SPECS: CustomAgentSpec[] = [
  {
    mode: 'general',
    name: 'General Assistant',
    tagline: 'Versatile daily intelligence',
    description: 'Handles day-to-day queries, formatting, quick answers, and general problem solving.',
    badge: 'Core',
    iconName: 'Sparkles',
    gradient: 'from-teal-500 to-indigo-600',
    defaultPrompt: 'How can I optimize my daily workflow using automated tasks?',
  },
  {
    mode: 'programming',
    name: 'Software Architect',
    tagline: 'Code generation & debugging',
    description: 'Generates clean TypeScript, React, Python, algorithms, and architectural refactoring.',
    badge: 'Developer',
    iconName: 'Code',
    gradient: 'from-indigo-600 to-violet-600',
    defaultPrompt: 'Refactor this React state hook to optimize unnecessary re-renders.',
  },
  {
    mode: 'learning',
    name: 'Socratic Tutor',
    tagline: 'Step-by-step breakdown',
    description: 'Explains complex STEM, physics, and philosophy topics using clear analogies.',
    badge: 'Education',
    iconName: 'GraduationCap',
    gradient: 'from-amber-500 to-orange-600',
    defaultPrompt: 'Explain quantum entanglement like I am a 12-year-old using simple analogies.',
  },
  {
    mode: 'writing',
    name: 'Content Strategist',
    tagline: 'Polished copywriting & editing',
    description: 'Crafts persuasive blog posts, product announcements, technical docs, and marketing copy.',
    badge: 'Creative',
    iconName: 'PenTool',
    gradient: 'from-pink-500 to-rose-600',
    defaultPrompt: 'Write a compelling product launch email announcement for a high-tech SaaS platform.',
  },
  {
    mode: 'research',
    name: 'Research Analyst',
    tagline: 'Fact-finding & citations',
    description: 'Conducts deep comparative market analysis, extracts key insights, and generates comparison tables.',
    badge: 'Analytics',
    iconName: 'Compass',
    gradient: 'from-cyan-500 to-blue-600',
    defaultPrompt: 'Compare server-side rendering vs client-side static hydration for web performance.',
  },
  {
    mode: 'business',
    name: 'Business Advisor',
    tagline: 'Strategy & ROI modeling',
    description: 'Provides pitch deck feedback, financial projections, business model canvas, and market positioning.',
    badge: 'Enterprise',
    iconName: 'Briefcase',
    gradient: 'from-emerald-500 to-teal-600',
    defaultPrompt: 'Draft a SWOT analysis for a B2B AI SaaS product entering the enterprise market.',
  },
];
