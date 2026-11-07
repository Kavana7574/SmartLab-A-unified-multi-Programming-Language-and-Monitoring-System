import React, { useState } from 'react';
import { 
  X, 
  History, 
  Clock, 
  Flame, 
  ShieldCheck, 
  ShieldAlert, 
  Code2, 
  Award, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Calendar,
  CheckCircle2,
  Copy,
  Hash,
  Terminal
} from 'lucide-react';
import { LabSession, StudentProfile, ProgrammingLanguage } from '../../types/lab';
import { LabStorageService } from '../../services/storage';

interface StudentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  onRestoreCodeToEditor?: (code: string, language: ProgrammingLanguage) => void;
}

export const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({
  isOpen,
  onClose,
  student,
  onRestoreCodeToEditor
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | ProgrammingLanguage>('all');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const sessions = LabStorageService.getSessionsByUsn(student.usn);
  const filteredSessions = selectedLanguage === 'all' 
    ? sessions 
    : sessions.filter(s => s.language === selectedLanguage);

  // Compute aggregate student statistics
  const totalCompilations = sessions.reduce((acc, s) => acc + (s.compilationsCount || 0), 0);
  const totalActiveSeconds = sessions.reduce((acc, s) => acc + (s.activeDurationSeconds || 0), 0);
  const avgAuthenticity = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.authenticityScore || 100), 0) / sessions.length)
    : 100;

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
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Lab Performance & Session History</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {student.usn}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {student.name} • {student.department} ({student.batch})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="px-5 py-3 border-b border-neutral-800 bg-neutral-900/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-neutral-500 block">Total Lab Sessions</span>
            <span className="text-lg font-bold text-white">{sessions.length} recorded</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-neutral-500 block">Total Compilations</span>
            <span className="text-lg font-bold text-amber-300">{totalCompilations} attempts</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-neutral-500 block">Total Lab Active Time</span>
            <span className="text-lg font-bold text-emerald-400">{formatDuration(totalActiveSeconds)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-neutral-500 block">Average Authenticity</span>
            <span className="text-lg font-bold text-cyan-300">{avgAuthenticity}% genuine</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-2.5 bg-neutral-950/40 border-b border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-400">Filter by tool:</span>
          <div className="flex items-center gap-1.5">
            {(['all', 'c', 'python', 'java'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-neutral-800 text-white border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lang === 'all' ? 'All Languages' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Timeline List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">
              <History className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p>No lab sessions recorded yet for {student.usn} in this category.</p>
              <p className="text-xs text-neutral-600 mt-1">
                Start a session in the IDE and click "End Session" to record your first completed lab session.
              </p>
            </div>
          ) : (
            filteredSessions.map((sess) => {
              const isExpanded = expandedSessionId === sess.id;
              return (
                <div
                  key={sess.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/60 overflow-hidden transition-all hover:border-neutral-700"
                >
                  {/* Card Header / Summary */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Language Tag */}
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                          sess.language === 'c'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : sess.language === 'python'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {sess.language === 'c' ? 'C Tool' : sess.language === 'python' ? 'Python Tool' : 'Java Tool'}
                        </span>

                        <h4 className="text-sm font-bold text-white">
                          {sess.exerciseTitle || 'Independent Lab Practice'}
                        </h4>

                        {sess.submissionHash && (
                          <span className="text-[10px] font-mono text-neutral-500">
                            #{sess.submissionHash}
                          </span>
                        )}
                      </div>

                      {/* Timestamps */}
                      <div className="flex items-center gap-3 text-xs text-neutral-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Started: {formatDateTime(sess.startTime)}</span>
                        </span>
                        {sess.endTime && (
                          <span>• Ended: {formatDateTime(sess.endTime)}</span>
                        )}
                      </div>
                    </div>

                    {/* Right summary badges & expand button */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {/* Active Duration */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDuration(sess.activeDurationSeconds)} active</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                          <Flame className="w-3 h-3" />
                          <span>{sess.compilationsCount} compiles</span>
                        </div>
                      </div>

                      {/* Authenticity Badge */}
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border ${
                        sess.authenticityScore >= 90
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : sess.authenticityScore >= 75
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                          : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                      }`}>
                        {sess.authenticityScore >= 80 ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        <span>{sess.authenticityScore}% Auth</span>
                      </div>

                      {/* Teacher Grade Badge if present */}
                      {sess.teacherGrade !== undefined && (
                        <div className="px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/50 text-indigo-300 text-xs font-bold flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>{sess.teacherGrade}/20</span>
                        </div>
                      )}

                      {/* Expand / Collapse Button */}
                      <button
                        type="button"
                        onClick={() => setExpandedSessionId(isExpanded ? null : sess.id)}
                        className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section Details */}
                  {isExpanded && (
                    <div className="p-4 border-t border-neutral-800 bg-neutral-900/40 space-y-4 text-xs">
                      {/* Teacher Evaluation Box */}
                      {sess.teacherFeedback ? (
                        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span>Teacher Evaluation & Remarks ({sess.teacherGrade}/20 Marks)</span>
                          </div>
                          <p className="text-neutral-300 leading-relaxed">{sess.teacherFeedback}</p>
                          <span className="text-[10px] text-neutral-500 block">
                            Evaluated at {formatDateTime(sess.teacherEvaluatedAt)}
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 text-xs flex items-center justify-between">
                          <span>Awaiting faculty grading & lab assessment.</span>
                          <span className="text-[11px] text-amber-400">Status: Submitted</span>
                        </div>
                      )}

                      {/* Telemetry Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                          <span className="text-neutral-500 block">Paste Attempts</span>
                          <span className="font-semibold text-white">{sess.pasteAttemptsCount || 0} attempts</span>
                        </div>
                        <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                          <span className="text-neutral-500 block">Pasted Chars</span>
                          <span className="font-semibold text-white">{sess.totalCharsPasted || 0} characters</span>
                        </div>
                        <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                          <span className="text-neutral-500 block">Authentic Typed</span>
                          <span className="font-semibold text-emerald-400">{sess.totalCharsTyped || 0} characters</span>
                        </div>
                        <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                          <span className="text-neutral-500 block">Tab Switch Away</span>
                          <span className="font-semibold text-white">{sess.tabSwitchCount || 0} times</span>
                        </div>
                      </div>

                      {/* Code Snapshot */}
                      {sess.finalCode && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-neutral-400 flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                              Final Submitted Code Snapshot:
                            </span>
                            <div className="flex items-center gap-2">
                              {onRestoreCodeToEditor && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm('Restore this code back into the current IDE editor?')) {
                                      onRestoreCodeToEditor(sess.finalCode, sess.language);
                                      onClose();
                                    }
                                  }}
                                  className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 cursor-pointer"
                                >
                                  Load into IDE Editor
                                </button>
                              )}
                            </div>
                          </div>
                          <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono text-xs max-h-48 overflow-auto whitespace-pre">
                            {sess.finalCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
