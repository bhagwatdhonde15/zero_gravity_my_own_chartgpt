import React, { useState } from 'react';
import { 
  X, 
  Code, 
  FileText, 
  Mail, 
  PenTool, 
  BookOpen, 
  Sparkles, 
  Send,
  Database,
  Calculator,
  Briefcase,
  Terminal,
  Cpu,
  Layers,
  GraduationCap
} from 'lucide-react';
import { AITool } from '../types/chat';

interface AIToolsSuiteProps {
  isOpen: boolean;
  onClose: () => void;
  onUseToolPrompt: (prompt: string) => void;
}

export const AI_TOOLS_SUITE: AITool[] = [
  // Development
  {
    id: 'code-generator',
    name: 'Code Generator',
    description: 'Generate clean, production-ready code in TypeScript, Python, React, Go, or Java.',
    iconName: 'Code',
    category: 'Development',
    promptTemplate: 'Please write a production-ready script with error handling and full TypeScript typing for the following requirement:\n\n',
    placeholder: 'e.g. Build an async queue worker with exponential backoff retries...'
  },
  {
    id: 'deepseek_code_master',
    name: 'DeepSeek R1 Code Master',
    description: 'DeepSeek R1 reasoning engine for perfect production-grade code, debugging, and system design.',
    iconName: 'Code',
    category: 'Development',
    promptTemplate: 'Using DeepSeek R1 reasoning architecture, generate perfect production-grade code for: {input}',
    placeholder: 'Describe the feature, API, or algorithm to code with DeepSeek R1...'
  },
  {
    id: 'code-debugger',
    name: 'Code Debugger & Refactor',
    description: 'Identify memory leaks, runtime bugs, and optimize complexity.',
    iconName: 'Terminal',
    category: 'Development',
    promptTemplate: 'Analyze this code snippet for bugs, race conditions, memory leaks, and refactor it:\n\n',
    placeholder: 'Paste your buggy code snippet here...'
  },
  {
    id: 'nanobana_image',
    name: 'NanoBana AI Image Generator',
    description: 'Create high-resolution photorealistic FLUX AI images from text prompts.',
    iconName: 'Sparkles',
    category: 'Creative',
    promptTemplate: 'Generate a high-resolution NanoBana FLUX AI image of: {input}',
    placeholder: 'Describe your vision (e.g. A futuristic cyberpunk city in 8k resolution)'
  },
  {
    id: 'leetcode-helper',
    name: 'LeetCode & Algorithm Helper',
    description: 'Get optimal O(N) solutions with detailed step-by-step logic explanations.',
    iconName: 'Cpu',
    category: 'Development',
    promptTemplate: 'Provide the most optimal time and space complexity solution for this problem with logic explanation:\n\n',
    placeholder: 'e.g. LeetCode 15: 3Sum solution in Python...'
  },
  {
    id: 'dsa-tutor',
    name: 'DSA & System Design Tutor',
    description: 'Learn Data Structures, Algorithms, and System Architecture patterns.',
    iconName: 'GraduationCap',
    category: 'Development',
    promptTemplate: 'Explain the core principles and step-by-step system architecture for:\n\n',
    placeholder: 'e.g. Designing a distributed rate-limiter service...'
  },
  {
    id: 'sql-generator',
    name: 'SQL & Database Architect',
    description: 'Generate complex SQL queries, migrations, and PostgreSQL indexes.',
    iconName: 'Database',
    category: 'Development',
    promptTemplate: 'Write optimized PostgreSQL queries and indexes for the following schema requirement:\n\n',
    placeholder: 'e.g. Join users, subscriptions, and invoice logs with aggregation...'
  },
  {
    id: 'regex-generator',
    name: 'Regex & Pattern Matcher',
    description: 'Create and explain regular expressions with test cases.',
    iconName: 'Layers',
    category: 'Development',
    promptTemplate: 'Create a regex pattern and provide test cases for:\n\n',
    placeholder: 'e.g. Validate email addresses with strict TLD check...'
  },

  // Career
  {
    id: 'resume-analyzer',
    name: 'Resume ATS Analyzer',
    description: 'Evaluate ATS keyword density, action verbs, and impact score.',
    iconName: 'FileText',
    category: 'Career',
    promptTemplate: 'Analyze this resume content for ATS optimization and suggest improvements for a Senior Tech Lead role:\n\n',
    placeholder: 'Paste your resume text...'
  },
  {
    id: 'interview-prep',
    name: 'Interview Preparation Coach',
    description: 'Practice mock technical and behavioral interview questions.',
    iconName: 'Briefcase',
    category: 'Career',
    promptTemplate: 'Generate 5 realistic interview questions and sample answers for:\n\n',
    placeholder: 'e.g. Senior Frontend Engineer role at a top AI startup...'
  },
  {
    id: 'email-writer',
    name: 'Executive Email Writer',
    description: 'Draft persuasive emails for sales, negotiations, and leadership.',
    iconName: 'Mail',
    category: 'Career',
    promptTemplate: 'Draft a professional executive email based on the following key points:\n\n',
    placeholder: 'Specify audience, outcome, and tone (e.g. Direct, Formal, Friendly)...'
  },

  // Research & Content
  {
    id: 'research-assistant',
    name: 'Research & Literature Assistant',
    description: 'Synthesize research papers, trade-offs, and citations.',
    iconName: 'BookOpen',
    category: 'Research',
    promptTemplate: 'Provide a comprehensive research synthesis and literature review for:\n\n',
    placeholder: 'Enter research topic or paper summary...'
  },
  {
    id: 'blog-writer',
    name: 'SEO Content & Blog Writer',
    description: 'Write engaging articles optimized for search engine rankings.',
    iconName: 'PenTool',
    category: 'Research',
    promptTemplate: 'Generate a 1,000-word SEO blog article with headings and meta description for:\n\n',
    placeholder: 'Enter article topic and target audience...'
  },

  // Data & Math
  {
    id: 'chart-generator',
    name: 'ChartGPT & Data Visualizer',
    description: 'Convert data, tables, CSV, or metrics into interactive Bar, Line, and Pie charts.',
    iconName: 'BarChart3',
    category: 'Data & Math',
    promptTemplate: 'Please generate a visual ChartGPT data visualization for the following data:\n\n',
    placeholder: 'e.g. Visualize monthly revenue growth for Q1 to Q4...'
  },
  {
    id: 'math-solver',
    name: 'Math & Equation Solver',
    description: 'Solve calculus, linear algebra, and probability equations with steps.',
    iconName: 'Calculator',
    category: 'Data & Math',
    promptTemplate: 'Solve this mathematical problem step-by-step with LaTeX equations:\n\n',
    placeholder: 'e.g. Find the eigenvalues and eigenvectors of matrix A...'
  },

  // Business
  {
    id: 'startup-mentor',
    name: 'Startup & Business Plan Mentor',
    description: 'Formulate Go-To-Market strategies, monetization models, and pitch decks.',
    iconName: 'Sparkles',
    category: 'Business',
    promptTemplate: 'Generate a SaaS business plan, monetization model, and GTM strategy for:\n\n',
    placeholder: 'Describe your startup idea...'
  }
];

export const AIToolsSuite: React.FC<AIToolsSuiteProps> = ({
  isOpen,
  onClose,
  onUseToolPrompt,
}) => {
  const [selectedTool, setSelectedTool] = useState<AITool>(AI_TOOLS_SUITE[0]);
  const [userInputValue, setUserInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Development', 'Career', 'Research', 'Data & Math', 'Business'];

  const filteredTools = activeCategory === 'All'
    ? AI_TOOLS_SUITE
    : AI_TOOLS_SUITE.filter((t) => t.category === activeCategory);

  const handleApplyTool = () => {
    const finalPrompt = selectedTool.promptTemplate + (userInputValue.trim() || selectedTool.placeholder);
    onUseToolPrompt(finalPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-5xl bg-[#171717] border border-[#383838] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Left Sidebar */}
        <div className="w-full md:w-80 bg-[#141414] border-b md:border-b-0 md:border-r border-[#2f2f2f] p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="font-bold text-white text-base">Zero Gravity Tools</h2>
              </div>
              <button onClick={onClose} className="p-1 text-[#94a3b8] hover:text-white rounded-lg md:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#090d16] text-[#94a3b8] hover:text-white border border-[#334155]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tools List */}
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {filteredTools.map((tool) => {
                const isSelected = tool.id === selectedTool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSelectedTool(tool);
                      setUserInputValue('');
                    }}
                    className={`w-full text-left p-3 rounded-2xl flex items-start space-x-3 transition-all ${
                      isSelected
                        ? 'bg-[#2f2f2f] text-white border border-[#383838] shadow-md'
                        : 'hover:bg-[#1e1e1e] text-[#b4b4b4] hover:text-white'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white flex items-center justify-between">
                        <span>{tool.name}</span>
                      </div>
                      <p className="text-[11px] text-[#8e8e8e] line-clamp-2 mt-0.5 leading-tight">
                        {tool.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Generator Section */}
        <div className="flex-1 p-6 flex flex-col justify-between space-y-4 bg-[#171717] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#b4b4b4] hover:text-white rounded-xl hover:bg-[#2f2f2f] hidden md:block transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-white">{selectedTool.name}</h3>
              <p className="text-xs text-[#b4b4b4]">{selectedTool.description}</p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
                Provide Problem Details or Code Input
              </label>
              <textarea
                value={userInputValue}
                onChange={(e) => setUserInputValue(e.target.value)}
                placeholder={selectedTool.placeholder}
                rows={9}
                className="w-full bg-[#141414] text-white placeholder-[#8e8e8e] text-xs sm:text-sm p-4 rounded-2xl border border-[#383838] focus:border-emerald-500 outline-none resize-none leading-relaxed font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleApplyTool}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <span>Generate with Zero Gravity Bot</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
