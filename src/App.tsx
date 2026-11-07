import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EditorHeader } from './components/ide/EditorHeader';
import { CodeEditor } from './components/ide/CodeEditor';
import { TerminalPanel } from './components/ide/TerminalPanel';
import { ExerciseDrawer } from './components/ide/ExerciseDrawer';
import { StudentLoginModal } from './components/auth/StudentLoginModal';
import { StudentHistoryModal } from './components/history/StudentHistoryModal';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { SessionSummaryModal } from './components/session/SessionSummaryModal';

import { 
  StudentProfile, 
  ProgrammingLanguage, 
  LabSession, 
  LabExercise,
  CompilationRecord
} from './types/lab';
import { LabStorageService } from './services/storage';
import { CompilerEngine, ExecutionResult } from './services/compilerEngine';
import { AntiCheatMonitor, AntiCheatState } from './services/antiCheat';
import { DEFAULT_STARTER_CODES } from './data/labCurriculum';

export default function App() {
  // Initialize storage
  useEffect(() => {
    LabStorageService.init();
  }, []);

  // Student & Language State
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(() => {
    return LabStorageService.getCurrentStudent();
  });
  const [activeLanguage, setActiveLanguage] = useState<ProgrammingLanguage>('c');

  // Code editors storage per language
  const [codes, setCodes] = useState<Record<ProgrammingLanguage, string>>({
    c: DEFAULT_STARTER_CODES.c,
    python: DEFAULT_STARTER_CODES.python,
    java: DEFAULT_STARTER_CODES.java
  });

  const [activeExercise, setActiveExercise] = useState<LabExercise | null>(null);

  // Active Session Telemetry
  const [sessionStartTime, setSessionStartTime] = useState<string>(() => new Date().toISOString());
  const [activeSeconds, setActiveSeconds] = useState<number>(0);
  const [compilationsCount, setCompilationsCount] = useState<number>(0);
  const [compilationHistory, setCompilationHistory] = useState<CompilationRecord[]>([]);
  const [completedSummarySession, setCompletedSummarySession] = useState<LabSession | null>(null);

  // Terminal & Execution
  const [stdin, setStdin] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Anti-Cheat & Policy
  const [isPasteBlocked, setIsPasteBlocked] = useState<boolean>(true);
  const antiCheat = useMemo(() => new AntiCheatMonitor(true), []);
  const [antiCheatState, setAntiCheatState] = useState<AntiCheatState>(antiCheat.getState());

  // Modal Controls
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(() => !currentStudent);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);
  const [isExercisesDrawerOpen, setIsExercisesDrawerOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

  // Subscribe to anti-cheat state changes
  useEffect(() => {
    const unsubscribe = antiCheat.subscribe((state) => {
      setAntiCheatState(state);
    });
    return unsubscribe;
  }, [antiCheat]);

  // Keep Anti-cheat policy synchronized
  useEffect(() => {
    antiCheat.setPastePolicy(isPasteBlocked);
  }, [isPasteBlocked, antiCheat]);

  // Active Session Timer (Ticks every second when tab is active)
  useEffect(() => {
    if (!currentStudent || isLoginModalOpen) return;

    const interval = setInterval(() => {
      // Check if document is focused/visible to ensure strict active time tracking
      if (!document.hidden) {
        setActiveSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStudent, isLoginModalOpen]);

  // Window Focus & Tab Switch Listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        antiCheat.recordTabSwitch();
      } else {
        antiCheat.recordTabReturn();
      }
    };

    const handleWindowBlur = () => {
      antiCheat.recordTabSwitch();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [antiCheat]);

  // Handle switching tool language
  const handleSelectLanguage = (lang: ProgrammingLanguage) => {
    if (lang === activeLanguage) return;
    setActiveLanguage(lang);
    setExecutionResult(null);
    setActiveExercise(null);
  };

  // Handle student login from modal
  const handleStudentLogin = (student: StudentProfile, lang: ProgrammingLanguage) => {
    setCurrentStudent(student);
    setActiveLanguage(lang);
    setIsLoginModalOpen(false);

    // Reset session metrics for new session
    const newStartTime = new Date().toISOString();
    setSessionStartTime(newStartTime);
    setActiveSeconds(0);
    setCompilationsCount(0);
    setCompilationHistory([]);
    setExecutionResult(null);
    antiCheat.reset();
  };

  // Handle Compilation
  const handleCompileAndRun = async () => {
    if (isCompiling) return;
    setIsCompiling(true);

    const currentCode = codes[activeLanguage];
    const newCount = compilationsCount + 1;
    setCompilationsCount(newCount);

    try {
      const res = await CompilerEngine.executeCode(activeLanguage, currentCode, stdin);
      setExecutionResult(res);

      const record: CompilationRecord = {
        id: 'comp-' + Date.now(),
        timestamp: new Date().toISOString(),
        language: activeLanguage,
        status: res.status,
        executionTimeMs: res.executionTimeMs,
        output: res.stdout || res.stderr,
        errorDetails: res.compilerDiagnostic,
        codeLength: currentCode.length
      };

      setCompilationHistory(prev => [record, ...prev]);
    } catch (err: any) {
      setExecutionResult({
        status: 'error',
        stdout: '',
        stderr: err?.message || 'Compiler execution error.',
        executionTimeMs: 100,
        exitCode: 1
      });
    } finally {
      setIsCompiling(false);
    }
  };

  // Keyboard shortcut Ctrl/Cmd + Enter to compile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCompileAndRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [codes, activeLanguage, stdin, isCompiling, compilationsCount]);

  // Handle paste attempt
  const handlePasteAttempt = (pastedText: string) => {
    return antiCheat.handlePasteAttempt(pastedText);
  };

  // Handle keystroke
  const handleKeystroke = (delta: number) => {
    antiCheat.recordKeystroke(delta);
  };

  // Handle End Lab Session
  const handleEndSession = () => {
    if (!currentStudent) {
      setIsLoginModalOpen(true);
      return;
    }

    const currentCode = codes[activeLanguage];
    const endTime = new Date().toISOString();

    const finalizedSession: LabSession = {
      id: 'sess-' + Date.now(),
      studentUsn: currentStudent.usn,
      studentName: currentStudent.name,
      department: currentStudent.department,
      batch: currentStudent.batch,
      language: activeLanguage,
      exerciseTitle: activeExercise?.title,
      exerciseId: activeExercise?.id,
      startTime: sessionStartTime,
      endTime: endTime,
      activeDurationSeconds: activeSeconds,
      idleDurationSeconds: 0,
      compilationsCount: compilationsCount,
      compilationHistory: compilationHistory,
      pasteAttemptsCount: antiCheatState.pasteViolations.length,
      pasteViolations: antiCheatState.pasteViolations,
      totalCharsPasted: antiCheatState.totalCharsPasted,
      totalCharsTyped: antiCheatState.totalCharsTyped,
      authenticityScore: antiCheatState.authenticityScore,
      tabSwitchCount: antiCheatState.tabSwitchCount,
      finalCode: currentCode,
      status: 'completed',
      submissionHash: `UNILAB-${activeLanguage.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    // Save to permanent storage
    LabStorageService.completeActiveSession(finalizedSession);
    setCompletedSummarySession(finalizedSession);
    setIsSummaryModalOpen(true);
  };

  // Handle Exercise Selection
  const handleSelectExercise = (exercise: LabExercise) => {
    setActiveExercise(exercise);
    setCodes(prev => ({
      ...prev,
      [exercise.language]: exercise.starterCode
    }));
    if (exercise.testCases && exercise.testCases.length > 0) {
      setStdin(exercise.testCases[0].input || '');
    }
  };

  // Restore code from history or teacher dashboard
  const handleRestoreCode = (restoredCode: string, lang: ProgrammingLanguage) => {
    setActiveLanguage(lang);
    setCodes(prev => ({
      ...prev,
      [lang]: restoredCode
    }));
  };

  const pastSessions = currentStudent ? LabStorageService.getSessionsByUsn(currentStudent.usn) : [];

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans select-none">
      {/* Top Navigation & Live Telemetry Header */}
      <EditorHeader
        student={currentStudent}
        activeLanguage={activeLanguage}
        onSelectLanguage={handleSelectLanguage}
        startTime={sessionStartTime}
        activeSeconds={activeSeconds}
        compilationsCount={compilationsCount}
        authenticityScore={antiCheatState.authenticityScore}
        isPasteBlocked={isPasteBlocked}
        onTogglePasteShield={() => setIsPasteBlocked(prev => !prev)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenExercises={() => setIsExercisesDrawerOpen(true)}
        onOpenTeacherPortal={() => setIsTeacherDashboardOpen(true)}
        onEndSession={handleEndSession}
        onChangeUser={() => setIsLoginModalOpen(true)}
        pastSessionsCount={pastSessions.length}
      />

      {/* Main Workbench Layout: Split Code Editor & Interactive Terminal */}
      <main className="flex-1 flex flex-col md:flex-row p-3 gap-3 overflow-hidden bg-neutral-900/40">
        {/* Left Side: Code Editor */}
        <CodeEditor
          language={activeLanguage}
          code={codes[activeLanguage]}
          onChangeCode={(newCode) => {
            setCodes(prev => ({
              ...prev,
              [activeLanguage]: newCode
            }));
          }}
          onPasteAttempt={handlePasteAttempt}
          onKeystroke={handleKeystroke}
          activeExerciseTitle={activeExercise?.title}
          isPasteBlocked={isPasteBlocked}
        />

        {/* Right Side: Interactive Terminal & Compiler Diagnostics */}
        <TerminalPanel
          language={activeLanguage}
          isCompiling={isCompiling}
          onCompile={handleCompileAndRun}
          result={executionResult}
          stdin={stdin}
          onChangeStdin={setStdin}
          onClearOutput={() => setExecutionResult(null)}
          compileCount={compilationsCount}
        />
      </main>

      {/* Slide-over Lab Exercises Syllabus */}
      <ExerciseDrawer
        isOpen={isExercisesDrawerOpen}
        onClose={() => setIsExercisesDrawerOpen(false)}
        language={activeLanguage}
        onSelectExercise={handleSelectExercise}
        currentExerciseId={activeExercise?.id}
      />

      {/* Student Authentication Modal (USN & Name Gatekeeper) */}
      <StudentLoginModal
        isOpen={isLoginModalOpen}
        onLogin={handleStudentLogin}
        onOpenTeacherPortal={() => {
          setIsLoginModalOpen(false);
          setIsTeacherDashboardOpen(true);
        }}
        onViewHistoryOnly={(student) => {
          setCurrentStudent(student);
          setIsLoginModalOpen(false);
          setIsHistoryModalOpen(true);
        }}
      />

      {/* Student Past Session History Modal */}
      <StudentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        student={currentStudent}
        onRestoreCodeToEditor={handleRestoreCode}
      />

      {/* Teacher / Faculty Sentinel & Monitoring Portal */}
      <TeacherDashboard
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        isPasteBlockedGlobal={isPasteBlocked}
        onToggleGlobalPastePolicy={() => setIsPasteBlocked(prev => !prev)}
        onOpenSessionInIDE={handleRestoreCode}
      />

      {/* Session Concluded Summary Receipt Modal */}
      <SessionSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        session={completedSummarySession}
        onStartNewSession={() => {
          setIsSummaryModalOpen(false);
          // start fresh session
          setSessionStartTime(new Date().toISOString());
          setActiveSeconds(0);
          setCompilationsCount(0);
          setCompilationHistory([]);
          setExecutionResult(null);
          antiCheat.reset();
        }}
      />
    </div>
  );
}
