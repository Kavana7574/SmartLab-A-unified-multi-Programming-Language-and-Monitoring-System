import React, { useRef, useState, useEffect } from 'react';
import { 
  FileCode, 
  RotateCcw, 
  Copy, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  ShieldAlert,
  Maximize2,
  Terminal,
  FileSpreadsheet
} from 'lucide-react';
import { ProgrammingLanguage } from '../../types/lab';
import { DEFAULT_STARTER_CODES } from '../../data/labCurriculum';

interface CodeEditorProps {
  language: ProgrammingLanguage;
  code: string;
  onChangeCode: (newCode: string) => void;
  onPasteAttempt: (pastedText: string) => { allowed: boolean };
  onKeystroke: (delta: number) => void;
  activeExerciseTitle?: string;
  isPasteBlocked: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChangeCode,
  onPasteAttempt,
  onKeystroke,
  activeExerciseTitle,
  isPasteBlocked
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [pasteAlert, setPasteAlert] = useState<{ show: boolean; msg: string; type: 'blocked' | 'warn' }>({
    show: false,
    msg: '',
    type: 'blocked'
  });
  const [copied, setCopied] = useState(false);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const getFileName = () => {
    switch (language) {
      case 'c': return 'main.c';
      case 'python': return 'solution.py';
      case 'java': return 'Main.java';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const result = onPasteAttempt(pastedText);

    if (!result.allowed) {
      e.preventDefault();
      setPasteAlert({
        show: true,
        msg: `⚠️ Lab Policy: Clipboard paste (${pastedText.length} chars) is blocked to encourage genuine typing.`,
        type: 'blocked'
      });
      setTimeout(() => {
        setPasteAlert(prev => ({ ...prev, show: false }));
      }, 4000);
    } else {
      setPasteAlert({
        show: true,
        msg: `⚠️ Clipboard paste (${pastedText.length} chars) detected and logged for instructor review.`,
        type: 'warn'
      });
      setTimeout(() => {
        setPasteAlert(prev => ({ ...prev, show: false }));
      }, 3500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key indentation support
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChangeCode(newCode);
      onKeystroke(4);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
      return;
    }

    if (!['Control', 'Alt', 'Meta', 'Shift', 'CapsLock', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      onKeystroke(1);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset editor to standard starter template? Any unsaved edits will be replaced.')) {
      onChangeCode(DEFAULT_STARTER_CODES[language] || '');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = Math.max(1, code.split('\n').length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden relative shadow-inner">
      {/* Editor Sub-Header */}
      <div className="h-10 px-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          {/* File Tab */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-950 text-neutral-200 font-mono border border-neutral-800">
            <FileCode className={`w-3.5 h-3.5 ${
              language === 'c' ? 'text-blue-400' : language === 'python' ? 'text-amber-400' : 'text-red-400'
            }`} />
            <span>{getFileName()}</span>
            {activeExerciseTitle && (
              <span className="text-[11px] text-neutral-500 font-sans truncate max-w-[200px]">
                • {activeExerciseTitle}
              </span>
            )}
          </div>
        </div>

        {/* Editor Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            title="Reset to boilerplate starter code"
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            title="Copy code to clipboard"
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Paste Alert Banner */}
      {pasteAlert.show && (
        <div className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b transition-all ${
          pasteAlert.type === 'blocked'
            ? 'bg-rose-950/90 border-rose-600/50 text-rose-200'
            : 'bg-amber-950/90 border-amber-600/50 text-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{pasteAlert.msg}</span>
          </div>
          <button
            onClick={() => setPasteAlert(prev => ({ ...prev, show: false }))}
            className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Textarea with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-sm">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-12 py-3 bg-neutral-900/60 border-r border-neutral-800/80 text-right pr-3 select-none text-neutral-600 text-xs overflow-hidden"
          style={{ lineHeight: '1.5rem' }}
        >
          {lineNumbers.map(n => (
            <div key={n} className="leading-6">
              {n}
            </div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 p-3 bg-transparent text-neutral-100 font-mono text-xs sm:text-sm leading-6 resize-none outline-none overflow-auto selection:bg-emerald-500/30"
          style={{ tabSize: 4 }}
          placeholder={`// Write your ${language.toUpperCase()} lab solution here...`}
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="h-6 px-3 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 select-none">
        <div className="flex items-center gap-3">
          <span>Lines: {lineCount}</span>
          <span>Chars: {code.length}</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-neutral-300">
            {language === 'c' ? 'GCC C99/C11' : language === 'python' ? 'Python 3.11 Runtime' : 'Java OpenJDK 21'}
          </span>
        </div>
      </div>
    </div>
  );
};
