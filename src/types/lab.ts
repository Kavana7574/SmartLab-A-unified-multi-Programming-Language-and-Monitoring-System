export type ProgrammingLanguage = 'c' | 'python' | 'java';

export interface StudentProfile {
  name: string;
  usn: string;
  semester: string;
  section: string;
  batch: string;
  department: string;
  avatarSeed?: string;
}

export interface CompilationRecord {
  id: string;
  timestamp: string; // ISO string
  language: ProgrammingLanguage;
  status: 'success' | 'warning' | 'error';
  executionTimeMs: number;
  output: string;
  errorDetails?: string;
  codeLength: number;
}

export interface PasteViolation {
  id: string;
  timestamp: string;
  characterCount: number;
  snippetPreview: string;
  actionTaken: 'blocked' | 'flagged';
}

export interface LabSession {
  id: string;
  studentUsn: string;
  studentName: string;
  department: string;
  batch: string;
  language: ProgrammingLanguage;
  exerciseTitle?: string;
  exerciseId?: string;
  
  startTime: string; // ISO
  endTime?: string;  // ISO
  activeDurationSeconds: number;
  idleDurationSeconds: number;
  
  compilationsCount: number;
  compilationHistory: CompilationRecord[];
  
  pasteAttemptsCount: number;
  pasteViolations: PasteViolation[];
  totalCharsPasted: number;
  totalCharsTyped: number;
  authenticityScore: number; // 0 - 100%
  tabSwitchCount: number;
  
  finalCode: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  
  teacherGrade?: number; // e.g. out of 20 or 100
  teacherFeedback?: string;
  teacherEvaluatedAt?: string;
  submissionHash?: string;
}

export interface LabExercise {
  id: string;
  language: ProgrammingLanguage;
  labNumber: number;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  solutionCode?: string;
  testCases: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
}

export interface AntiCheatConfig {
  pastePolicy: 'block' | 'audit_warn' | 'allow';
  trackTabSwitches: boolean;
  minTypingCadenceMs: number;
}
