import React, { useState, useEffect } from 'react';
import { 
  User, 
  Hash, 
  Terminal, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Sparkles,
  Layers,
  History
} from 'lucide-react';
import { StudentProfile, ProgrammingLanguage } from '../../types/lab';
import { LabStorageService } from '../../services/storage';

interface StudentLoginModalProps {
  isOpen: boolean;
  onLogin: (student: StudentProfile, selectedLanguage: ProgrammingLanguage) => void;
  onOpenTeacherPortal: () => void;
  onViewHistoryOnly?: (student: StudentProfile) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onLogin,
  onOpenTeacherPortal,
  onViewHistoryOnly
}) => {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [batch, setBatch] = useState('B1');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('c');
  const [existingProfiles, setExistingProfiles] = useState<StudentProfile[]>([]);
  const [pastSessionsCount, setPastSessionsCount] = useState<number>(0);
  const [matchedProfile, setMatchedProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (isOpen) {
      const profiles = LabStorageService.getStudentProfiles();
      setExistingProfiles(profiles);

      const lastStudent = LabStorageService.getCurrentStudent();
      if (lastStudent) {
        setName(lastStudent.name);
        setUsn(lastStudent.usn);
        setDepartment(lastStudent.department || 'Computer Science & Engineering');
        setBatch(lastStudent.batch || 'B1');
        checkStudentHistory(lastStudent.usn);
      }
    }
  }, [isOpen]);

  const checkStudentHistory = (inputUsn: string) => {
    if (!inputUsn.trim()) {
      setPastSessionsCount(0);
      setMatchedProfile(null);
      return;
    }
    const sessions = LabStorageService.getSessionsByUsn(inputUsn);
    setPastSessionsCount(sessions.length);

    const found = existingProfiles.find(p => p.usn.toUpperCase() === inputUsn.trim().toUpperCase());
    if (found) {
      setMatchedProfile(found);
      if (!name) setName(found.name);
      if (found.department) setDepartment(found.department);
      if (found.batch) setBatch(found.batch);
    } else {
      setMatchedProfile(null);
    }
  };

  const handleSelectQuickProfile = (profile: StudentProfile) => {
    setName(profile.name);
    setUsn(profile.usn);
    setDepartment(profile.department);
    setBatch(profile.batch);
    checkStudentHistory(profile.usn);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !usn.trim()) return;

    const student: StudentProfile = {
      name: name.trim(),
      usn: usn.trim().toUpperCase(),
      semester: '5th Sem',
      section: 'A',
      batch: batch,
      department: department,
      avatarSeed: name.toLowerCase().replace(/\s+/g, '')
    };

    LabStorageService.saveStudentProfile(student);
    onLogin(student, selectedLanguage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-indigo-950/60 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  UniLab IDE Gatekeeper
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Session Sentinel
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Authenticate your University Seat Number (USN) to initiate your lab session.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenTeacherPortal}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Faculty Portal
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Select Preset Student Avatars */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Quick Select Registered Student (Demo Profiles)
              </label>
              <span className="text-[11px] text-neutral-500">or type custom details below</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {existingProfiles.slice(0, 4).map((prof) => (
                <button
                  key={prof.usn}
                  type="button"
                  onClick={() => handleSelectQuickProfile(prof)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    usn.toUpperCase() === prof.usn.toUpperCase()
                      ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/40'
                      : 'bg-neutral-800/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <p className="text-xs font-semibold text-white truncate">{prof.name}</p>
                  <p className="text-[11px] font-mono text-emerald-400 truncate">{prof.usn}</p>
                  <p className="text-[10px] text-neutral-500">{prof.batch} • {prof.department.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Student USN */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  University Seat No. (USN) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1MS21CS042"
                    value={usn}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setUsn(val);
                      checkStudentHistory(val);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono text-emerald-300 placeholder-neutral-600 outline-none uppercase transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Department & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Department / Branch
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-sm text-neutral-300 outline-none cursor-pointer"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                  <option value="Information Science & Engineering">Information Science & Engineering (ISE)</option>
                  <option value="AI & Machine Learning">AI & Machine Learning (AIML)</option>
                  <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Lab Batch & Desk
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['B1', 'B2', 'B3'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBatch(b)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        batch === b
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Batch {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Programming Tool Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Select Lab Tool for This Session <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* C Tool */}
                <div
                  onClick={() => setSelectedLanguage('c')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedLanguage === 'c'
                      ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                      C
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">GCC 13.2</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">C Programming</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Pointers, Arrays, Data Structures & GCC compiler diagnostics.
                  </p>
                </div>

                {/* Python Tool */}
                <div
                  onClick={() => setSelectedLanguage('python')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedLanguage === 'python'
                      ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">
                      Py
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Python 3.11</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Python 3 Lab</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Algorithms, Dictionaries, Recursion & Scripting runtime.
                  </p>
                </div>

                {/* Java Tool */}
                <div
                  onClick={() => setSelectedLanguage('java')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedLanguage === 'java'
                      ? 'bg-red-950/40 border-red-500 ring-1 ring-red-500/50'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono">
                      Java
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">OpenJDK 21</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Java OOP Lab</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Classes, Inheritance, Exceptions & JVM simulation.
                  </p>
                </div>
              </div>
            </div>

            {/* History Recognition Alert */}
            {pastSessionsCount > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-emerald-300">
                  <History className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Recognized USN: <strong>{pastSessionsCount}</strong> previous lab session{pastSessionsCount > 1 ? 's' : ''} found in record.
                  </span>
                </div>
                {onViewHistoryOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      if (matchedProfile) {
                        onViewHistoryOnly(matchedProfile);
                      } else {
                        onViewHistoryOnly({
                          name,
                          usn: usn.toUpperCase(),
                          semester: '5th Sem',
                          section: 'A',
                          batch,
                          department
                        });
                      }
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer"
                  >
                    View History
                  </button>
                )}
              </div>
            )}

            {/* Sentinel Policy Notice */}
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-neutral-200 font-semibold">Active Lab Sentinel Enabled: </span>
                Your session start time, active duration, and compilation counts are recorded. Copy-paste prevention protects your academic integrity.
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!name.trim() || !usn.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <span>Initialize Lab Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
