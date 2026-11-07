import { LabSession, StudentProfile, ProgrammingLanguage } from '../types/lab';

const STORAGE_KEYS = {
  CURRENT_STUDENT: 'unilab_current_student',
  CURRENT_SESSION: 'unilab_active_session',
  ALL_SESSIONS: 'unilab_all_sessions',
  STUDENT_PROFILES: 'unilab_student_profiles',
  ANTI_CHEAT_CONFIG: 'unilab_anti_cheat_config',
};

const SAMPLE_STUDENTS: StudentProfile[] = [
  {
    name: 'Aarav Sharma',
    usn: '1MS21CS042',
    semester: '5th Sem',
    section: 'A',
    batch: 'B1',
    department: 'Computer Science & Engineering',
    avatarSeed: 'aarav'
  },
  {
    name: 'Priya Nair',
    usn: '1MS21CS089',
    semester: '5th Sem',
    section: 'A',
    batch: 'B2',
    department: 'Computer Science & Engineering',
    avatarSeed: 'priya'
  },
  {
    name: 'Karthik Rao',
    usn: '1MS21CS054',
    semester: '5th Sem',
    section: 'B',
    batch: 'B1',
    department: 'Information Science & Engineering',
    avatarSeed: 'karthik'
  },
  {
    name: 'Ananya Deshmukh',
    usn: '1MS21CS018',
    semester: '5th Sem',
    section: 'B',
    batch: 'B3',
    department: 'Computer Science & Engineering',
    avatarSeed: 'ananya'
  }
];

const SAMPLE_SESSIONS: LabSession[] = [
  {
    id: 'sess-past-101',
    studentUsn: '1MS21CS042',
    studentName: 'Aarav Sharma',
    department: 'CSE',
    batch: 'B1',
    language: 'c',
    exerciseTitle: 'Matrix Multiplication & Pointer Arithmetic',
    exerciseId: 'c-lab-1',
    startTime: '2026-11-05T09:00:15.000Z',
    endTime: '2026-11-05T10:42:10.000Z',
    activeDurationSeconds: 5820,
    idleDurationSeconds: 295,
    compilationsCount: 14,
    compilationHistory: [
      {
        id: 'c-1',
        timestamp: '2026-11-05T09:12:00.000Z',
        language: 'c',
        status: 'error',
        executionTimeMs: 140,
        output: 'error: subscripted value is neither array nor pointer nor vector\n  *(result + i) = val;\n                  ^\n1 error generated.',
        codeLength: 420
      },
      {
        id: 'c-2',
        timestamp: '2026-11-05T09:35:10.000Z',
        language: 'c',
        status: 'warning',
        executionTimeMs: 160,
        output: 'warning: format specifies type \'int\' but the argument has type \'int *\' [-Wformat]\nCompilation finished with 0 errors.',
        codeLength: 680
      },
      {
        id: 'c-3',
        timestamp: '2026-11-05T10:38:00.000Z',
        language: 'c',
        status: 'success',
        executionTimeMs: 185,
        output: '=== Matrix Multiplication Result ===\n19\t22\n43\t50\nProcess finished with exit code 0.',
        codeLength: 950
      }
    ],
    pasteAttemptsCount: 0,
    pasteViolations: [],
    totalCharsPasted: 0,
    totalCharsTyped: 1240,
    authenticityScore: 98,
    tabSwitchCount: 1,
    finalCode: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int a[2][2] = {{1, 2}, {3, 4}};\n    int b[2][2] = {{5, 6}, {7, 8}};\n    int res[2][2] = {{0, 0}, {0, 0}};\n    // Completed pointer multiplication\n    return 0;\n}`,
    status: 'completed',
    teacherGrade: 19,
    teacherFeedback: 'Excellent pointer arithmetic and good memory layout comprehension. Zero paste detected.',
    teacherEvaluatedAt: '2026-11-05T11:15:00.000Z',
    submissionHash: 'UNILAB-CSE-99A82F'
  },
  {
    id: 'sess-past-102',
    studentUsn: '1MS21CS089',
    studentName: 'Priya Nair',
    department: 'CSE',
    batch: 'B2',
    language: 'python',
    exerciseTitle: 'Recursive Fibonacci & Memoization Benchmark',
    exerciseId: 'py-lab-2',
    startTime: '2026-11-06T14:02:00.000Z',
    endTime: '2026-11-06T15:18:40.000Z',
    activeDurationSeconds: 4420,
    idleDurationSeconds: 180,
    compilationsCount: 8,
    compilationHistory: [],
    pasteAttemptsCount: 1,
    pasteViolations: [
      {
        id: 'pv-1',
        timestamp: '2026-11-06T14:40:12.000Z',
        characterCount: 65,
        snippetPreview: 'memo = {}; def fib(n): if n in memo: return memo[n]',
        actionTaken: 'flagged'
      }
    ],
    totalCharsPasted: 65,
    totalCharsTyped: 890,
    authenticityScore: 93,
    tabSwitchCount: 2,
    finalCode: `# Python memoization lab\nmemo = {}\ndef fib(n):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]`,
    status: 'completed',
    teacherGrade: 18,
    teacherFeedback: 'Good algorithmic analysis. Minor paste flagged on memoization template.',
    teacherEvaluatedAt: '2026-11-06T16:00:00.000Z',
    submissionHash: 'UNILAB-CSE-41D17E'
  },
  {
    id: 'sess-past-103',
    studentUsn: '1MS21CS054',
    studentName: 'Karthik Rao',
    department: 'ISE',
    batch: 'B1',
    language: 'java',
    exerciseTitle: 'Custom Exception Handling & Bank Account',
    exerciseId: 'java-lab-2',
    startTime: '2026-11-06T11:10:00.000Z',
    endTime: '2026-11-06T12:05:00.000Z',
    activeDurationSeconds: 3200,
    idleDurationSeconds: 100,
    compilationsCount: 19,
    compilationHistory: [],
    pasteAttemptsCount: 3,
    pasteViolations: [
      {
        id: 'pv-2',
        timestamp: '2026-11-06T11:25:00.000Z',
        characterCount: 180,
        snippetPreview: 'class InsufficientFundsException extends Exception...',
        actionTaken: 'blocked'
      }
    ],
    totalCharsPasted: 180,
    totalCharsTyped: 750,
    authenticityScore: 78,
    tabSwitchCount: 5,
    finalCode: `public class Main { public static void main(String[] args) { ... } }`,
    status: 'completed',
    teacherGrade: 16,
    teacherFeedback: 'Struggled with throw vs throws, multiple compile cycles. Avoid pasting external snippets.',
    teacherEvaluatedAt: '2026-11-06T13:30:00.000Z',
    submissionHash: 'UNILAB-ISE-77C39B'
  }
];

export const LabStorageService = {
  // Initialize storage if needed
  init(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES)) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(SAMPLE_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALL_SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.ALL_SESSIONS, JSON.stringify(SAMPLE_SESSIONS));
    }
  },

  getStudentProfiles(): StudentProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES);
      return data ? JSON.parse(data) : SAMPLE_STUDENTS;
    } catch {
      return SAMPLE_STUDENTS;
    }
  },

  saveStudentProfile(student: StudentProfile): void {
    const list = this.getStudentProfiles();
    const existingIndex = list.findIndex(s => s.usn.toUpperCase() === student.usn.toUpperCase());
    if (existingIndex >= 0) {
      list[existingIndex] = student;
    } else {
      list.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(list));
    this.setCurrentStudent(student);
  },

  getCurrentStudent(): StudentProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentStudent(student: StudentProfile | null): void {
    if (!student) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
    }
  },

  getActiveSession(): LabSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveActiveSession(session: LabSession | null): void {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    }
  },

  getAllSessions(): LabSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_SESSIONS);
      return data ? JSON.parse(data) : SAMPLE_SESSIONS;
    } catch {
      return SAMPLE_SESSIONS;
    }
  },

  getSessionsByUsn(usn: string): LabSession[] {
    const all = this.getAllSessions();
    return all.filter(s => s.studentUsn.trim().toUpperCase() === usn.trim().toUpperCase());
  },

  completeActiveSession(session: LabSession): void {
    const completedSession: LabSession = {
      ...session,
      endTime: new Date().toISOString(),
      status: 'completed',
      submissionHash: `UNILAB-${session.language.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    const all = this.getAllSessions();
    // Prepend new session
    const updated = [completedSession, ...all.filter(s => s.id !== completedSession.id)];
    localStorage.setItem(STORAGE_KEYS.ALL_SESSIONS, JSON.stringify(updated));
    this.saveActiveSession(null);
  },

  updateSessionGrade(sessionId: string, grade: number, feedback: string): void {
    const all = this.getAllSessions();
    const idx = all.findIndex(s => s.id === sessionId);
    if (idx >= 0) {
      all[idx] = {
        ...all[idx],
        teacherGrade: grade,
        teacherFeedback: feedback,
        teacherEvaluatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.ALL_SESSIONS, JSON.stringify(all));
    }
  },

  deleteSession(sessionId: string): void {
    const all = this.getAllSessions();
    const updated = all.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.ALL_SESSIONS, JSON.stringify(updated));
  },

  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(SAMPLE_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.ALL_SESSIONS, JSON.stringify(SAMPLE_SESSIONS));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }
};
