import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = value.trim().split('\n');

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-slate-700/60 bg-slate-900 shadow-lg text-slate-100 font-mono text-sm">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Terminal className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 rounded-md bg-slate-800/80 px-2.5 py-1 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-4 leading-relaxed">
        <table className="border-collapse text-left w-full">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-slate-800/30">
                <td className="w-8 select-none text-right pr-4 text-slate-600 text-xs py-0.5">
                  {index + 1}
                </td>
                <td className="whitespace-pre font-mono text-slate-200 py-0.5">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
