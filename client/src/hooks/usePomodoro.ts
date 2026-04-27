import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

type PomodoroPhase = 'work' | 'break' | 'long';

interface PomodoroState {
  phase: PomodoroPhase;
  secondsLeft: number;
  isRunning: boolean;
  pomodorosDone: number;
  totalInSession: number;
}

export function usePomodoro() {
  const prefs = useAuthStore((s) => s.user?.preferences);
  const workMins = prefs?.pomodoroWork ?? 25;
  const breakMins = prefs?.pomodoroBreak ?? 5;
  const longMins = prefs?.pomodoroLong ?? 15;

  const [state, setState] = useState<PomodoroState>({
    phase: 'work',
    secondsLeft: workMins * 60,
    isRunning: false,
    pomodorosDone: 0,
    totalInSession: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phaseSeconds = useCallback(
    (phase: PomodoroPhase) => {
      if (phase === 'work') return workMins * 60;
      if (phase === 'break') return breakMins * 60;
      return longMins * 60;
    },
    [workMins, breakMins, longMins]
  );

  const playGong = useCallback(() => {
    if (!prefs?.soundEnabled) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 528;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 2);
  }, [prefs?.soundEnabled]);

  const advance = useCallback(() => {
    setState((prev) => {
      const nextDone = prev.phase === 'work' ? prev.pomodorosDone + 1 : prev.pomodorosDone;
      const needsLong = nextDone > 0 && nextDone % 4 === 0;
      const nextPhase: PomodoroPhase =
        prev.phase === 'work' ? (needsLong ? 'long' : 'break') : 'work';
      playGong();
      return {
        ...prev,
        phase: nextPhase,
        secondsLeft: phaseSeconds(nextPhase),
        pomodorosDone: nextDone,
        totalInSession: prev.phase === 'work' ? prev.totalInSession + 1 : prev.totalInSession,
        isRunning: true,
      };
    });
  }, [phaseSeconds, playGong]);

  useEffect(() => {
    if (!state.isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.secondsLeft <= 1) {
          advance();
          return prev;
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.isRunning, advance]);

  const start = () => setState((s) => ({ ...s, isRunning: true }));
  const pause = () => setState((s) => ({ ...s, isRunning: false }));
  const reset = () =>
    setState((s) => ({ ...s, isRunning: false, secondsLeft: phaseSeconds(s.phase) }));

  const progress = 1 - state.secondsLeft / phaseSeconds(state.phase);
  const minutes = Math.floor(state.secondsLeft / 60);
  const seconds = state.secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { ...state, start, pause, reset, progress, display };
}
