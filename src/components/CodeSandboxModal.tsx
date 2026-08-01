import React from 'react';
import { Terminal, X, Play, Copy, Check, Clock, AlertTriangle } from 'lucide-react';
import { CodeExecutionResult } from '../types/chat';

interface CodeSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CodeExecutionResult | null;
  onReRun: () => void;
}

export const CodeSandboxModal: React.FC<CodeSandboxModalProps> = ({
  isOpen,
  onClose,
  result,
  onReRun,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !result) return null;

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(result.output.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-3xl bg-[#050811] border border-[#1e3a8a]/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Terminal Header Bar */}
        <div className="px-4 py-3 bg-[#0f172a] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-blue-500/80 inline-block" />
            </div>
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono font-semibold text-white">
              Zero Gravity Live Terminal — ({result.language.toUpperCase()})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-[#94a3b8] flex items-center space-x-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{result.executionTimeMs}ms</span>
            </span>

            <button
              onClick={onReRun}
              className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1e293b] transition-colors"
              title="Re-run code"
            >
              <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1e293b] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Snippet Preview */}
        <div className="p-4 bg-[#090d16] border-b border-[#1e293b] max-h-36 overflow-y-auto">
          <div className="text-[10px] font-mono text-[#94a3b8] mb-1">EXECUTED SCRIPT</div>
          <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap">
            <code>{result.code}</code>
          </pre>
        </div>

        {/* Terminal Logs Output */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2 bg-[#050811] font-mono text-xs leading-relaxed">
          <div className="flex items-center justify-between text-[#94a3b8] text-[10px] pb-1 border-b border-[#1e293b]">
            <span>CONSOLE OUTPUT LOGS</span>
            <button
              onClick={handleCopyLogs}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Terminal</span>
                </>
              )}
            </button>
          </div>

          {result.error && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Execution Error:</span>
                <p className="mt-0.5">{result.error}</p>
              </div>
            </div>
          )}

          {result.output.map((line, idx) => (
            <div key={idx} className="flex space-x-2 text-[#f8fafc]">
              <span className="text-blue-400 select-none">&gt;</span>
              <span className="whitespace-pre-wrap">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
