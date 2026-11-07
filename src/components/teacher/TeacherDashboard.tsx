import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  Clock, 
  Award, 
  Code2, 
  Download, 
  Check, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  Unlock
} from 'lucide-react';
import { LabSession, ProgrammingLanguage } from '../../types/lab';
import { LabStorageService } from '../../services/storage';

interface TeacherDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isPasteBlockedGlobal: boolean;
  onToggleGlobalPastePolicy: () => void;
  onOpenSessionInIDE?: (code: string, language: ProgrammingLanguage) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  isOpen,
  onClose,
  isPasteBlockedGlobal,
  onToggleGlobalPastePolicy,
  onOpenSessionInIDE
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | ProgrammingLanguage>('all');
  const [selectedBatch, setSelectedBatch] = useState<'all' | string>('all');
  const [flagFilter, setFlagFilter] = useState<'all' | 'flagged' | 'high_compiles'>('all');
  
  // Inspecting a specific session
  const [inspectingSession, setInspectingSession] = useState<LabSession | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(18);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const allSessions = LabStorageService.getAllSessions();

  // Filter sessions
  const filtered = allSessions.filter((s) => {
    const matchesSearch = 
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentUsn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.exerciseTitle && s.exerciseTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLang = selectedLanguage === 'all' || s.language === selectedLanguage;
    const matchesBatch = selectedBatch === 'all' || s.batch === selectedBatch;

    let matchesFlag = true;
    if (flagFilter === 'flagged') {
      matchesFlag = s.pasteAttemptsCount > 0 || (s.authenticityScore < 85);
    } else if (flagFilter === 'high_compiles') {
      matchesFlag = s.compilationsCount >= 10;
    }

    return matchesSearch && matchesLang && matchesBatch && matchesFlag;
  });

  // Calculate metrics
  const totalSessions = allSessions.length;
  const flaggedIncidents = allSessions.filter(s => (s.pasteAttemptsCount || 0) > 0 || (s.authenticityScore < 85)).length;
  const avgCompiles = totalSessions > 0
    ? Math.round(allSessions.reduce((acc, s) => acc + (s.compilationsCount || 0), 0) / totalSessions)
    : 0;
  const avgActiveMinutes = totalSessions > 0
    ? Math.round(allSessions.reduce((acc, s) => acc + (s.activeDurationSeconds || 0), 0) / totalSessions / 60)
    : 0;

  const handleOpenInspect = (session: LabSession) => {
    setInspectingSession(session);
    setGradeInput(session.teacherGrade ?? 18);
    setFeedbackInput(session.teacherFeedback ?? 'Good implementation. Demonstrated solid logic and code structure.');
    setIsSavedFeedback(false);
  };

  const handleSaveEvaluation = () => {
    if (!inspectingSession) return;
    LabStorageService.updateSessionGrade(inspectingSession.id, gradeInput, feedbackInput);
    setIsSavedFeedback(true);
    setTimeout(() => {
      // update local reference
      setInspectingSession(prev => prev ? {
        ...prev,
        teacherGrade: gradeInput,
        teacherFeedback: feedbackInput,
        teacherEvaluatedAt: new Date().toISOString()
      } : null);
    }, 400);
  };

  const formatDuration = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${secs % 60}s`;
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '--';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const exportCsvReport = () => {
    const headers = ['USN', 'Name', 'Department', 'Batch', 'Tool', 'Exercise', 'Start Time', 'End Time', 'Duration (Sec)', 'Compilations', 'Authenticity (%)', 'Paste Attempts', 'Tab Switches', 'Teacher Grade', 'Feedback'];
    const rows = filtered.map(s => [
      `"${s.studentUsn}"`,
      `"${s.studentName}"`,
      `"${s.department}"`,
      `"${s.batch}"`,
      `"${s.language.toUpperCase()}"`,
      `"${s.exerciseTitle || 'Independent'}"`,
      `"${s.startTime}"`,
      `"${s.endTime || 'Active'}"`,
      s.activeDurationSeconds,
      s.compilationsCount,
      s.authenticityScore,
      s.pasteAttemptsCount,
      s.tabSwitchCount,
      s.teacherGrade ?? 'Unreviewed',
      `"${(s.teacherFeedback || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `unilab_performance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col h-[94vh] overflow-hidden text-neutral-100">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Faculty Lab Sentinel & Performance Portal
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Supervisor Mode
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Live academic integrity monitoring, compilation velocity & grading hub for C, Python, and Java labs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Anti-Cheat Policy Switch */}
            <button
              type="button"
              onClick={onToggleGlobalPastePolicy}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isPasteBlockedGlobal
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                  : 'bg-amber-950/50 border-amber-500/50 text-amber-300'
              }`}
            >
              {isPasteBlockedGlobal ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <Unlock className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPasteBlockedGlobal ? 'Lab Paste Policy: Blocked' : 'Lab Paste Policy: Audit Only'}</span>
            </button>

            {/* Export CSV Report */}
            <button
              type="button"
              onClick={exportCsvReport}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV Report</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Aggregate KPI Stat Tiles */}
        <div className="px-4 py-3 bg-neutral-900/60 border-b border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-neutral-500 block text-[11px]">Monitored Lab Sessions</span>
              <span className="text-xl font-bold text-white">{totalSessions}</span>
            </div>
            <Users className="w-5 h-5 text-blue-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-neutral-500 block text-[11px]">Avg. Compilations / Student</span>
              <span className="text-xl font-bold text-amber-400">{avgCompiles} cycles</span>
            </div>
            <Flame className="w-5 h-5 text-amber-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-neutral-500 block text-[11px]">Avg. Active Lab Time</span>
              <span className="text-xl font-bold text-emerald-400">{avgActiveMinutes} mins</span>
            </div>
            <Clock className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-neutral-500 block text-[11px]">Flagged Paste Violations</span>
              <span className={`text-xl font-bold ${flaggedIncidents > 0 ? 'text-rose-400' : 'text-neutral-400'}`}>
                {flaggedIncidents} flagged
              </span>
            </div>
            <ShieldAlert className="w-5 h-5 text-rose-400 opacity-80" />
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-4 py-3 bg-neutral-950/60 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by student Name, USN (e.g. 1MS21CS042), or problem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
            />
          </div>

          {/* Tool filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[11px]">Tool:</span>
            {(['all', 'c', 'python', 'java'] as const).map(l => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                className={`px-2 py-1 rounded text-[11px] font-semibold uppercase cursor-pointer ${
                  selectedLanguage === l
                    ? 'bg-neutral-800 text-white border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Batch filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[11px]">Batch:</span>
            {['all', 'B1', 'B2', 'B3'].map(b => (
              <button
                key={b}
                onClick={() => setSelectedBatch(b)}
                className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                  selectedBatch === b
                    ? 'bg-neutral-800 text-white border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Anti-cheat audit filter */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFlagFilter(flagFilter === 'flagged' ? 'all' : 'flagged')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold border flex items-center gap-1 cursor-pointer ${
                flagFilter === 'flagged'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>Flagged Paste Only</span>
            </button>
          </div>
        </div>

        {/* Student Sessions Table */}
        <div className="flex-1 overflow-auto p-4">
          <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950/70">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/90 text-neutral-400 select-none">
                  <th className="py-2.5 px-3 font-semibold">Student & USN</th>
                  <th className="py-2.5 px-3 font-semibold">Tool & Lab Topic</th>
                  <th className="py-2.5 px-3 font-semibold">Start & End Time</th>
                  <th className="py-2.5 px-3 font-semibold">Duration</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Compiles</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Authenticity</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Paste / Tab</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Grade</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-500">
                      No student lab sessions match the active search/filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-900/50 transition-colors">
                      {/* Student Info */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{s.studentName}</div>
                        <div className="font-mono text-emerald-400 text-[11px]">{s.studentUsn}</div>
                        <div className="text-[10px] text-neutral-500">{s.batch} • {s.department}</div>
                      </td>

                      {/* Tool & Topic */}
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase inline-block mb-1 ${
                          s.language === 'c'
                            ? 'bg-blue-500/20 text-blue-400'
                            : s.language === 'python'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {s.language}
                        </span>
                        <div className="text-neutral-300 font-medium truncate max-w-[180px]">
                          {s.exerciseTitle || 'Independent Code'}
                        </div>
                      </td>

                      {/* Start / End Time */}
                      <td className="py-3 px-3 text-neutral-400 text-[11px] font-mono">
                        <div>Start: {formatDateTime(s.startTime)}</div>
                        <div className="text-neutral-500">End: {formatDateTime(s.endTime)}</div>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-emerald-400 font-bold">
                          {formatDuration(s.activeDurationSeconds)}
                        </span>
                      </td>

                      {/* Compilations */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
                          <Flame className="w-3 h-3" />
                          {s.compilationsCount}
                        </span>
                      </td>

                      {/* Authenticity Score */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                          s.authenticityScore >= 90
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : s.authenticityScore >= 75
                            ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                        }`}>
                          {s.authenticityScore >= 80 ? (
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <ShieldAlert className="w-3 h-3 text-rose-400" />
                          )}
                          {s.authenticityScore}%
                        </span>
                      </td>

                      {/* Paste & Tab switch flags */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center gap-0.5 text-[10px]">
                          {s.pasteAttemptsCount > 0 ? (
                            <span className="text-rose-400 font-bold">
                              ⚠️ {s.pasteAttemptsCount} paste ({s.totalCharsPasted} chars)
                            </span>
                          ) : (
                            <span className="text-neutral-500">0 paste flags</span>
                          )}
                          <span className="text-neutral-500">{s.tabSwitchCount || 0} tab switches</span>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-3 text-center">
                        {s.teacherGrade !== undefined ? (
                          <span className="font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-700/50">
                            {s.teacherGrade} / 20
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenInspect(s)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 font-medium text-xs transition-colors cursor-pointer"
                        >
                          Inspect & Grade
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspector & Grading Modal */}
        {inspectingSession && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-neutral-100">
              {/* Header */}
              <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Code Inspection & Assessment: {inspectingSession.studentName}
                    <span className="font-mono text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                      {inspectingSession.studentUsn}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {inspectingSession.exerciseTitle || 'Independent Submission'} • {inspectingSession.language.toUpperCase()} Tool
                  </p>
                </div>
                <button
                  onClick={() => setInspectingSession(null)}
                  className="p-1 rounded text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Anti-cheat audit breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-500 block text-[11px]">Compiles Attempted</span>
                    <span className="font-bold text-amber-300 text-sm">{inspectingSession.compilationsCount} cycles</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-500 block text-[11px]">Active Session Time</span>
                    <span className="font-bold text-emerald-400 text-sm">{formatDuration(inspectingSession.activeDurationSeconds)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-500 block text-[11px]">Authenticity Score</span>
                    <span className={`font-bold text-sm ${inspectingSession.authenticityScore >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {inspectingSession.authenticityScore}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-500 block text-[11px]">Paste Incidents</span>
                    <span className={`font-bold text-sm ${inspectingSession.pasteAttemptsCount > 0 ? 'text-rose-400' : 'text-neutral-300'}`}>
                      {inspectingSession.pasteAttemptsCount} ({inspectingSession.totalCharsPasted || 0} chars)
                    </span>
                  </div>
                </div>

                {/* Submitted Code View */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      Submitted Code Snapshot:
                    </span>
                    {onOpenSessionInIDE && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSessionInIDE(inspectingSession.finalCode, inspectingSession.language);
                          setInspectingSession(null);
                          onClose();
                        }}
                        className="text-[11px] px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 cursor-pointer"
                      >
                        Run in Main IDE
                      </button>
                    )}
                  </div>
                  <pre className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs max-h-56 overflow-auto text-neutral-100 whitespace-pre">
                    {inspectingSession.finalCode}
                  </pre>
                </div>

                {/* Teacher Marks & Feedback Form */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      Assign Lab Marks (Max 20 Marks):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={gradeInput}
                        onChange={(e) => setGradeInput(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-16 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center font-bold text-amber-300 text-sm outline-none"
                      />
                      <span className="text-neutral-400 font-bold">/ 20</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 text-[11px] font-semibold">
                      Faculty Remarks & Constructive Lab Feedback:
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="e.g. Good memory handling. Zero paste detected. Need cleaner variable naming..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {isSavedFeedback && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                        <Check className="w-3.5 h-3.5" />
                        Marks & Feedback saved to student record!
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveEvaluation}
                      className="ml-auto py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Save Evaluation & Update Grade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
