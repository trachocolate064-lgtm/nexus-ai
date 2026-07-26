import { PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // General
  {
    id: 'gen-1',
    title: 'Explain Complex Topic Simply',
    category: 'general',
    description: 'Deconstruct a tricky concept with intuitive analogies',
    prompt: 'Explain the concept of quantum computing to someone with non-technical background using step-by-step clear analogies and examples.',
    iconName: 'HelpCircle'
  },
  {
    id: 'gen-2',
    title: 'Daily Productivity Planner',
    category: 'general',
    description: 'Structure today’s schedule and prioritize goals',
    prompt: 'Help me plan a highly productive day. Here are my tasks: [List tasks]. Prioritize them using the Eisenhower Matrix and suggest time blocks.',
    iconName: 'Calendar'
  },

  // Programming
  {
    id: 'prog-1',
    title: 'Code Review & Optimization',
    category: 'programming',
    description: 'Find bugs, improve performance, and follow best practices',
    prompt: 'Please review the following code snippet. Check for performance bottlenecks, edge case bugs, readability, and suggest clean refactored TypeScript code:\n\n```typescript\n// paste your code here\n```',
    iconName: 'Code'
  },
  {
    id: 'prog-2',
    title: 'Design API / Database Schema',
    category: 'programming',
    description: 'Architect RESTful endpoints or database structures',
    prompt: 'Architect a clean REST API specification and TypeScript interface schema for an e-commerce order management system.',
    iconName: 'Database'
  },
  {
    id: 'prog-3',
    title: 'Debug Error Message',
    category: 'programming',
    description: 'Identify root cause and provide exact step-by-step fix',
    prompt: 'I am getting this error: [Paste error]. Explain why this happens step by step and provide the code snippet to fix it.',
    iconName: 'Bug'
  },

  // Learning
  {
    id: 'learn-1',
    title: 'Socratic Tutor & Quiz',
    category: 'learning',
    description: 'Interactive lesson with follow-up practice questions',
    prompt: 'Teach me the core principles of Machine Learning (Supervised vs Unsupervised). After explaining clearly, ask me 3 quick practice questions to test my understanding.',
    iconName: 'GraduationCap'
  },
  {
    id: 'learn-2',
    title: 'Step-by-Step Math / Logic Solution',
    category: 'learning',
    description: 'Break down complex math or logical problems',
    prompt: 'Walk me step-by-step through solving Bayes’ Theorem with a practical real-world medical diagnostic example.',
    iconName: 'BookOpen'
  },

  // Writing
  {
    id: 'write-1',
    title: 'Professional Email Drafter',
    category: 'writing',
    description: 'Craft persuasive, polite, and articulate messages',
    prompt: 'Draft a professional email requesting a meeting with a prospective client regarding a project proposal. Key points to include: [Points].',
    iconName: 'PenTool'
  },
  {
    id: 'write-2',
    title: 'Content Summarizer & Key Takeaways',
    category: 'writing',
    description: 'Distill long articles into executive bullet points',
    prompt: 'Summarize the following text into 3 executive takeaways, followed by a concise 2-paragraph overview:\n\n[Paste text here]',
    iconName: 'FileText'
  },

  // Research
  {
    id: 'res-1',
    title: 'Latest Industry Trends & Web Search',
    category: 'research',
    description: 'Fetch up-to-date information with live source citations',
    prompt: 'What are the top recent breakthroughs in renewable energy and battery technology this year? Provide verified key facts and sources.',
    iconName: 'Globe'
  },
  {
    id: 'res-2',
    title: 'Comparative Market Analysis',
    category: 'research',
    description: 'Compare products, technologies, or strategies in a structured table',
    prompt: 'Compare PostgreSQL vs MongoDB for modern web applications. Provide a structured markdown comparison matrix highlighting pros, cons, and best use cases.',
    iconName: 'Search'
  },

  // Translation
  {
    id: 'trans-1',
    title: 'Nuanced Translation & Cultural Context',
    category: 'translation',
    description: 'Translate accurately while preserving tone and idioms',
    prompt: 'Translate the following text into professional business Japanese/Spanish with natural idioms and explain any key nuance choices:\n\n"[Paste text here]"',
    iconName: 'Languages'
  },

  // Brainstorm
  {
    id: 'brain-1',
    title: 'Structured Idea Generator',
    category: 'brainstorm',
    description: 'Brainstorm innovative concepts with feasibility scoring',
    prompt: 'Generate 5 creative app ideas leveraging AI for personal finance management. For each idea, outline the core feature, target user, and key differentiator.',
    iconName: 'Lightbulb'
  },

  // Business
  {
    id: 'biz-1',
    title: 'SaaS Pitch Deck & Value Prop',
    category: 'business',
    description: 'Draft a compelling pitch outline and customer value proposition',
    prompt: 'Help me refine a 10-slide pitch deck structure for an AI productivity B2B platform. Include problem statement, solution, target market size, business model, and competitive moat.',
    iconName: 'Briefcase'
  },
  {
    id: 'biz-2',
    title: 'Go-To-Market Strategy',
    category: 'business',
    description: 'Define customer acquisition channels and launch milestones',
    prompt: 'Develop a 90-day GTM strategy for launching a new developer tool SaaS product. Outline organic content, developer relations, paid acquisition channels, and KPI metrics.',
    iconName: 'Target'
  }
];
