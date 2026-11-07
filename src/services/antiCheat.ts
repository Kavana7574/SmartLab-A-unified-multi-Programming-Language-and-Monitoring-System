import { PasteViolation } from '../types/lab';

export interface AntiCheatState {
  isPasteBlocked: boolean; // strict mode
  totalCharsTyped: number;
  totalCharsPasted: number;
  tabSwitchCount: number;
  pasteViolations: PasteViolation[];
  authenticityScore: number;
  lastKeystrokeTime: number;
  averageTypingIntervalMs: number;
  isTabActive: boolean;
}

export class AntiCheatMonitor {
  private state: AntiCheatState = {
    isPasteBlocked: true,
    totalCharsTyped: 0,
    totalCharsPasted: 0,
    tabSwitchCount: 0,
    pasteViolations: [],
    authenticityScore: 100,
    lastKeystrokeTime: Date.now(),
    averageTypingIntervalMs: 150,
    isTabActive: true
  };

  private listeners: ((state: AntiCheatState) => void)[] = [];

  constructor(initialStrictBlock: boolean = true) {
    this.state.isPasteBlocked = initialStrictBlock;
  }

  public setPastePolicy(shouldBlock: boolean): void {
    this.state.isPasteBlocked = shouldBlock;
    this.notify();
  }

  public subscribe(callback: (state: AntiCheatState) => void): () => void {
    this.listeners.push(callback);
    callback(this.state);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public recordKeystroke(charDelta: number = 1): void {
    const now = Date.now();
    const interval = now - this.state.lastKeystrokeTime;
    this.state.lastKeystrokeTime = now;
    this.state.totalCharsTyped += Math.max(1, charDelta);
    
    // Smooth moving average for typing cadence
    if (interval < 5000 && interval > 20) {
      this.state.averageTypingIntervalMs = Math.round((this.state.averageTypingIntervalMs * 4 + interval) / 5);
    }
    this.recomputeScore();
    this.notify();
  }

  public handlePasteAttempt(pastedText: string): { allowed: boolean; violation: PasteViolation } {
    const violation: PasteViolation = {
      id: 'pv-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      characterCount: pastedText.length,
      snippetPreview: pastedText.trim().substring(0, 75) + (pastedText.length > 75 ? '...' : ''),
      actionTaken: this.state.isPasteBlocked ? 'blocked' : 'flagged'
    };

    this.state.pasteViolations.push(violation);
    if (!this.state.isPasteBlocked) {
      this.state.totalCharsPasted += pastedText.length;
    }
    this.recomputeScore();
    this.notify();

    return {
      allowed: !this.state.isPasteBlocked,
      violation
    };
  }

  public recordTabSwitch(): void {
    this.state.tabSwitchCount += 1;
    this.state.isTabActive = false;
    this.recomputeScore();
    this.notify();
  }

  public recordTabReturn(): void {
    this.state.isTabActive = true;
    this.notify();
  }

  public reset(initialState?: Partial<AntiCheatState>): void {
    this.state = {
      isPasteBlocked: true,
      totalCharsTyped: 0,
      totalCharsPasted: 0,
      tabSwitchCount: 0,
      pasteViolations: [],
      authenticityScore: 100,
      lastKeystrokeTime: Date.now(),
      averageTypingIntervalMs: 150,
      isTabActive: true,
      ...initialState
    };
    this.notify();
  }

  private recomputeScore(): void {
    const typed = this.state.totalCharsTyped;
    const pasted = this.state.totalCharsPasted;
    const violations = this.state.pasteViolations.length;
    const tabSwitches = this.state.tabSwitchCount;

    if (typed === 0 && pasted === 0) {
      this.state.authenticityScore = 100;
      return;
    }

    // Heavy penalty for pasted code vs typed code
    let score = (typed / (typed + pasted * 2.5)) * 100;
    // Small deduction for tab switches away from the lab IDE
    score -= tabSwitches * 3;
    // Small deduction for blocked paste attempts (effort to copy-paste)
    score -= violations * 2;

    this.state.authenticityScore = Math.max(5, Math.min(100, Math.round(score)));
  }

  public getState(): AntiCheatState {
    return { ...this.state };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }
}
