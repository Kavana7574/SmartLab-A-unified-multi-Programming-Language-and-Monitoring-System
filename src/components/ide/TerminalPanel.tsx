import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Database, 
  Trash2, 
  Keyboard, 
  Share2,
  Clock,
  Layers
} from 'lucide-react';
import { ProgrammingLanguage } from '../../types/lab';
import { ExecutionResult } from '../../services/compilerEngine';

interface TerminalPanelProps {
  language: ProgrammingLanguage;
  isCompiling: boolean;
  onCompile: () => void;
  result: ExecutionResult | null;
  stdin: string;
  onChangeStdin: (val: string) => void;
  onClearOutput: () => void;
  compileCount: number;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  language,
  isCompiling,
  onCompile,
  result,
  stdin,
  onChangeStdin,
  onClearOutput,
  compileCount
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'diagnostics' | 'stdin' | 'memory'>('output');

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-inner">
      {/* Terminal Top Control Bar */}
      <div className="h-10 px-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Output Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('output')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'output'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Output</span>
            {result && result.status === 'error' && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Compiler Diagnostics Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('diagnostics')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Compiler Diagnostics</span>
            <span className="sm:hidden">Diagnostics</span>
          </button>

          {/* STDIN Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('stdin')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'stdin'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-blue-400" />
            <span>STDIN</span>
            {stdin.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </button>

          {/* C-only: Memory & Pointers Tab */}
          {language === 'c' && (
            <button
              type="button"
              onClick={() => setActiveTab('memory')}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'memory'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Pointer Memory</span>
              <span className="sm:hidden">Pointers</span>
            </button>
          )}
        </div>

        {/* Compile / Run Action Button */}
        <div className="flex items-center gap-2">
          {result && (
            <button
              type="button"
              onClick={onClearOutput}
              title="Clear terminal output"
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onCompile}
            disabled={isCompiling}
            className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'Compiling...' : 'Compile & Run'}</span>
            <span className="text-[10px] opacity-70 hidden md:inline font-mono">⌘↵</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Body */}
      <div className="flex-1 p-3 overflow-auto font-mono text-xs leading-relaxed text-neutral-300 bg-neutral-950">
        {activeTab === 'output' && (
          <div>
            {result ? (
              <div className="space-y-3">
                {/* Result header banner */}
                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  result.status === 'success'
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : result.status === 'warning'
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {result.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {result.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {result.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
                    <span className="font-semibold font-sans">
                      {result.status === 'success'
                        ? 'Build Succeeded (Exit code 0)'
                        : result.status === 'warning'
                        ? 'Build Succeeded with Compiler Warnings'
                        : `Build Failed (Exit code ${result.exitCode})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-sans">
                    <span>⏱ {result.executionTimeMs} ms</span>
                    {result.memoryUsageKb && <span>💾 {result.memoryUsageKb} KB</span>}
                  </div>
                </div>

                {/* Standard Output Content */}
                {result.stdout && (
                  <div>
                    <div className="text-[10px] font-sans font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                      Program STDOUT:
                    </div>
                    <pre className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 whitespace-pre-wrap break-all select-text font-mono">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {/* Stderr or compiler diagnostics */}
                {result.stderr && (
                  <div>
                    <div className="text-[10px] font-sans font-semibold text-rose-400 uppercase tracking-wider mb-1">
                      Standard Error / Compiler Output:
                    </div>
                    <pre className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-300 whitespace-pre-wrap break-all select-text font-mono">
                      {result.stderr}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-neutral-600 gap-2">
                <Terminal className="w-8 h-8 opacity-40" />
                <p className="text-xs">Terminal ready. Click <strong className="text-emerald-400">Compile & Run</strong> to build code.</p>
                <p className="text-[11px] text-neutral-600">Total compilations this session: {compileCount}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-3">
            <div className="text-xs text-neutral-400 font-sans">
              Detailed compiler logs, syntax tree diagnostics, and AST errors:
            </div>
            {result?.compilerDiagnostic || result?.stderr ? (
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
                <div className="text-amber-400 font-semibold font-sans text-xs">
                  Compiler Log Analysis:
                </div>
                <pre className="text-neutral-300 whitespace-pre-wrap font-mono text-xs">
                  {result.compilerDiagnostic || result.stderr}
                </pre>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 text-center text-neutral-500 font-sans text-xs">
                No active compiler diagnostics. Clean compilation.
              </div>
            )}
          </div>
        )}

        {activeTab === 'stdin' && (
          <div className="space-y-2 h-full flex flex-col">
            <label className="text-xs text-neutral-400 font-sans flex items-center justify-between">
              <span>Standard Input (STDIN) Stream</span>
              <span className="text-[11px] text-neutral-500">Passed to scanf(), input(), Scanner</span>
            </label>
            <textarea
              value={stdin}
              onChange={(e) => onChangeStdin(e.target.value)}
              placeholder="Enter inputs here separated by newlines (e.g. 5&#10;10&#10;hello)..."
              className="flex-1 min-h-[120px] w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 font-mono text-xs outline-none focus:border-blue-500 resize-none"
            />
          </div>
        )}

        {activeTab === 'memory' && language === 'c' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between font-sans text-xs text-neutral-400">
              <span>C Pointer & Stack Address Visualizer</span>
              <span className="text-[11px] text-purple-400 font-mono">64-bit Memory Model</span>
            </div>
            {result?.detectedPointers && result.detectedPointers.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {result.detectedPointers.map((ptr, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                        *{ptr.name}
                      </span>
                      <span className="text-neutral-400">→</span>
                      <span className="text-emerald-400 font-bold">{ptr.address}</span>
                    </div>
                    <span className="text-neutral-500 text-[11px]">{ptr.targetValue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 text-center text-neutral-500 text-xs font-sans">
                Declare pointer variables (e.g. <code className="text-purple-300">int *ptr = &amp;x;</code>) to inspect live address references here.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div className="h-6 px-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 select-none">
        <div className="flex items-center gap-3">
          <span>Buffer: {result ? `${result.stdout.length} bytes` : '0 bytes'}</span>
          <span>Status: {result ? result.status.toUpperCase() : 'IDLE'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-neutral-500" />
          <span>Last run: {result ? `${result.executionTimeMs}ms` : '--'}</span>
        </div>
      </div>
    </div>
  );
};
