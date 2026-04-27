import confetti from 'canvas-confetti';

export function triggerConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
  });
}

export function triggerMiniConfetti() {
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.7 },
    scalar: 0.7,
  });
}
