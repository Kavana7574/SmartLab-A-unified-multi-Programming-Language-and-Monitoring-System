import React from 'react';
import { 
  Terminal, 
  Clock, 
  Flame, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  History, 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  Code2,
  Activity,
  Layers
} from 'lucide-react';
import { ProgrammingLanguage, StudentProfile } from '../../types/lab';

interface EditorHeaderProps {
  student: StudentProfile | null;
  activeLanguage: ProgrammingLanguage;
  onSelectLanguage: (lang: ProgrammingLanguage) => void;
  startTime: string; // ISO
  activeSeconds: number;
  compilationsCount: number;
  authenticityScore: number;
  isPasteBlocked: boolean;
  onTogglePasteShield: () => void;
  onOpenHistory: () => void;
  onOpenExercises: () => void;
  onOpenTeacherPortal: () => void;
  onEndSession: () => void;
  onChangeUser: () => void;
  pastSessionsCount: number;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  student,
  activeLanguage,
  onSelectLanguage,
  startTime,
  activeSeconds,
  compilationsCount,
  authenticityScore,
  isPasteBlocked,
  onTogglePasteShield,
  onOpenHistory,
  onOpenExercises,
  onOpenTeacherPortal,
  onEndSession,
  onChangeUser,
  pastSessionsCount
}) => {
  // Format active seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format start time into readable string
  const formatStartTime = (isoString: string) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  return (
    <header className="bg-neutral-900 border-b border-neutral-800 text-neutral-200 select-none shrink-0 z-20">
      {/* Top Banner Bar */}
      <div className="px-4 py-2 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs bg-neutral-950/60">
        {/* Left: App Brand & Student Details */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold tracking-tight text-white hidden sm:inline">UniLab</span>
          </div>

          <div className="h-4 w-px bg-neutral-800" />

          {/* Student Profile Info */}
          {student ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/80">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-semibold text-white">{student.name}</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  {student.usn}
                </span>
                <span className="text-neutral-500 hidden md:inline text-[11px]">
                  ({student.batch})
                </span>
              </div>

              <button
                type="button"
                onClick={onChangeUser}
                title="Switch student USN or profile"
                className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Switch
              </button>
            </div>
          ) : (
            <button
              onClick={onChangeUser}
              className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer"
            >
              Student Login (Enter USN)
            </button>
          )}
        </div>

        {/* Center / Right: Live Session Telemetry Metrics */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Start Time */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800" title="Exact session start time">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400">Started:</span>
            <span className="font-mono text-neutral-200">{formatStartTime(startTime)}</span>
          </div>

          {/* Active Duration Timer */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/40 text-emerald-300" title="Active focused lab duration">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400/80">Active:</span>
            <span className="font-mono font-bold tracking-wider">{formatTime(activeSeconds)}</span>
          </div>

          {/* Compilations Counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800" title="Total compiler executions in this lab session">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-neutral-400">Compiles:</span>
            <span className="font-mono font-bold text-amber-300">{compilationsCount}</span>
          </div>

          {/* Anti-Paste Shield Status */}
          <button
            type="button"
            onClick={onTogglePasteShield}
            title={isPasteBlocked ? "Direct clipboard paste is completely blocked. Click to switch to audit mode." : "Paste allowed but tracked and flagged for teachers."}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] transition-all cursor-pointer ${
              isPasteBlocked
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            }`}
          >
            {isPasteBlocked ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden md:inline font-semibold">
              {isPasteBlocked ? 'Paste Shield: ON' : 'Paste: AUDIT'}
            </span>
            <span className="font-mono text-[10px] px-1 rounded bg-black/40">
              {authenticityScore}% Auth
            </span>
          </button>
        </div>
      </div>

      {/* Main IDE Tool Bar */}
      <div className="px-4 py-2 flex items-center justify-between gap-3">
        {/* Programming Tool Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          {/* C Programming Tab */}
          <button
            type="button"
            onClick={() => onSelectLanguage('c')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeLanguage === 'c'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-300" />
            <span>C Programming</span>
            <span className="text-[10px] font-mono opacity-80">.c</span>
          </button>

          {/* Python 3 Tab */}
          <button
            type="button"
            onClick={() => onSelectLanguage('python')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeLanguage === 'python'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-300" />
            <span>Python 3</span>
            <span className="text-[10px] font-mono opacity-80">.py</span>
          </button>

          {/* Java Tab */}
          <button
            type="button"
            onClick={() => onSelectLanguage('java')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeLanguage === 'java'
                ? 'bg-red-600 text-white shadow-sm shadow-red-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-300" />
            <span>Java OOP</span>
            <span className="text-[10px] font-mono opacity-80">.java</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Lab Exercises / Manual */}
          <button
            type="button"
            onClick={onOpenExercises}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Lab Syllabus</span>
          </button>

          {/* My Past History */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer relative"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>My Lab History</span>
            {pastSessionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                {pastSessionsCount}
              </span>
            )}
          </button>

          {/* Faculty Dashboard */}
          <button
            type="button"
            onClick={onOpenTeacherPortal}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-medium hidden sm:flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Teacher Portal</span>
          </button>

          {/* End Session Button */}
          <button
            type="button"
            onClick={onEndSession}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-rose-600/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    </header>
  );
};
