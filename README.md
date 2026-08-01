# ⚡ Zero Gravity Bot — Premium AI SaaS Platform

![Zero Gravity Bot Banner](https://img.shields.io/badge/Zero_Gravity_Bot-v3.0.0_Pro_SaaS-3B82F6?style=for-the-badge&logo=openai&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Theme_1_Premium_AI-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_Llama_3.3_70B-800_Tokens/sec-F59E0B?style=for-the-badge&logo=lightning&logoColor=white)

**Zero Gravity Bot** is a state-of-the-art, full-stack AI SaaS platform built with React 19, TypeScript, Express, and Groq Llama 3.3 70B hardware acceleration. It delivers ultra-fast streaming responses, 2-way Voice AI, live code sandbox execution, interactive data charts, NanoBana AI image generation, and Google Multi-Account SSO.

---

## ✨ Key Features

- ⚡ **Groq Llama 3.3 70B & DeepSeek R1 Engine**: Ultra-fast streaming intelligence (~800 tokens/sec) with transparent Chain-of-Thought reasoning.
- 🎙️ **Zero Gravity SAT Voice AI Agent**: Hands-free 2-way voice conversation mode featuring real male (SAT Spruce) and female (SAT Sol) voices, live subtitles, canvas waveform visualizer, and hardware mic unlock.
- 📊 **ChartGPT Interactive Data Visualization**: Dynamic Chart.js rendering for bar charts, line graphs, and pie charts with 1-click JSON dataset export.
- 💻 **Live Code Sandbox**: Execute JavaScript and Python code live in the browser terminal runner with error tracebacks.
- 🎨 **NanoBana FLUX AI Image Generator**: High-resolution 1024x1024 photorealistic image generation powered by FLUX Pro.
- 🔐 **Google Multi-Account SSO**: 1-click active session switching between Personal, Work, and Developer Google accounts.
- 🎨 **Theme 1 – Premium AI Design System**: Built with modern dark mode design tokens (`#09090B`, `#111827`, `#0F172A`, `#3B82F6`), card radiuses (`20px`, `18px`, `14px`), and micro-interactions (`scale 1 -> 1.03`).
- 🛠️ **30+ AI SaaS Tools Suite**: Generators for LeetCode, Resumes, System Architecture, SQL Queries, and Academic Research.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, TypeScript 5.7, Vite 6.1
- **Styling & UI**: Tailwind CSS 3.4, Lucide Icons, Framer Motion, Canvas Confetti
- **Backend Server**: Node.js, Express 4.21, Cors with auto-port fallback (`server.js`)
- **AI Cloud API**: Groq Cloud API (`llama-3.3-70b-versatile`, `deepseek-r1-distill-llama-70b`), Pollinations FLUX AI
- **Voice Engine**: Web Speech API SpeechSynthesis & SpeechRecognition (Regional Auto-Matching)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/bhagwatdhonde15/zero_gravity_my_own_chartgpt.git
cd zero_gravity_my_own_chartgpt
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Full-Stack Express Server (Frontend + Backend)
```bash
npm run serve
# Server active at http://localhost:3000
```

### 4. Run Vite Frontend Dev Server
```bash
npm run dev
# Dev server active at http://localhost:5173
```

---

## 📂 Project Structure

```
zero_gravity_my_own_chartgpt/
├── dist/                       # Compiled production build assets
├── public/                     # Static PWA manifest and icons
├── src/
│   ├── components/             # UI Components
│   │   ├── Header.tsx          # Top navigation bar & model dropdown
│   │   ├── Sidebar.tsx         # Conversation history & thread management
│   │   ├── ChatWindow.tsx      # Chat viewport & quick suggestion cards
│   │   ├── ChatInput.tsx       # Message box capsule bar & pills
│   │   ├── ChatMessage.tsx     # Message bubbles & code/chart blocks
│   │   ├── VoiceModeModal.tsx  # SAT Voice AI modal & visualizer
│   │   ├── ChartRenderer.tsx   # Interactive Chart.js SVG renderer
│   │   ├── CodeSandboxModal.tsx# Sandboxed code execution terminal
│   │   ├── AuthSettingsModal.tsx# Google Multi-Account SSO & API keys
│   │   ├── AIToolsSuite.tsx    # 30+ AI SaaS tools suite
│   │   └── AdminDashboard.tsx  # Live telemetry & system metrics
│   ├── services/
│   │   ├── aiService.ts        # Groq Cloud API & Zero Gravity Engine
│   │   ├── voiceService.ts     # SAT Male/Female Voice synthesis
│   │   ├── codeRunnerService.ts# Browser code execution runner
│   │   └── documentService.ts  # File & attachment parser
│   ├── types/                  # TypeScript interfaces & types
│   ├── App.tsx                 # Main application root
│   ├── index.css               # Theme 1 - Premium AI tokens & scrollbars
│   └── main.tsx                # Entry point
├── server.js                   # Unified Full-Stack Express Server
├── tailwind.config.js          # Tailwind design system configuration
├── vite.config.ts              # Vite build configuration
├── vercel.json                 # Vercel deployment configuration
└── package.json                # Project dependencies & scripts
```

---

## 🌐 Deployment

### Deploy on Vercel
1. Push your repository to GitHub.
2. Import project in Vercel.
3. Vercel automatically detects `vercel.json` and deploys your application!

### Deploy on Render / Netlify / Railway
Set build command:
```bash
npm run build
```
Set start command:
```bash
npm start
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more details.

Developed with ❤️ by **Bhagwat Dhonde** for **Zero Gravity Bot**.
