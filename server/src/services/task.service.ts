import { ITask } from '../models/Task.model';
import { IUser } from '../models/User.model';

const LEVELS = [0, 500, 1500, 3500, 7000, 12000, 20000, 32000, 50000, 75000, 100000];

export function getLevel(xp: number): number {
  return LEVELS.filter((threshold) => xp >= threshold).length;
}

export function calculateXP(task: ITask): number {
  const base = { low: 10, medium: 25, high: 50, urgent: 100 }[task.priority];
  const earlyBonus = task.dueDate && new Date() < task.dueDate ? 1.2 : 1;
  const subtaskBonus = task.subtasks.length > 0 ? 1.1 : 1;
  return Math.round(base * earlyBonus * subtaskBonus);
}

const ACHIEVEMENTS = [
  { id: 'first_task', label: 'Premier Pas', condition: (u: AchievementCtx) => u.totalCompleted >= 1 },
  { id: 'streak_7', label: 'Série de 7 jours', condition: (u: AchievementCtx) => u.streakCurrent >= 7 },
  { id: 'streak_30', label: 'Mois parfait', condition: (u: AchievementCtx) => u.streakCurrent >= 30 },
  { id: 'tasks_100', label: 'Centenaire', condition: (u: AchievementCtx) => u.totalCompleted >= 100 },
  { id: 'tasks_10_day', label: 'Productivité Max', condition: (u: AchievementCtx) => u.todayCompleted >= 10 },
  { id: 'level_5', label: 'Expert', condition: (u: AchievementCtx) => u.level >= 5 },
  { id: 'pomodoro_25', label: 'Maître Focus', condition: (u: AchievementCtx) => u.totalPomodoros >= 25 },
  { id: 'urgent_5', label: 'Pompier', condition: (u: AchievementCtx) => u.urgentCompleted >= 5 },
  { id: 'early_10', label: 'Ponctuel', condition: (u: AchievementCtx) => u.earlyCompleted >= 10 },
  { id: 'night_owl', label: 'Oiseau de nuit', condition: (u: AchievementCtx) => u.lateTaskCompleted >= 1 },
];

interface AchievementCtx {
  totalCompleted: number;
  streakCurrent: number;
  todayCompleted: number;
  level: number;
  totalPomodoros: number;
  urgentCompleted: number;
  earlyCompleted: number;
  lateTaskCompleted: number;
}

export function checkNewAchievements(user: IUser, ctx: AchievementCtx): string[] {
  const newlyUnlocked: string[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!user.achievements.includes(achievement.id) && achievement.condition(ctx)) {
      user.achievements.push(achievement.id);
      newlyUnlocked.push(achievement.id);
    }
  }
  return newlyUnlocked;
}

export function updateStreak(user: IUser): void {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const lastDate = user.lastActivityDate?.toDateString();

  if (lastDate === today) {
    // Already active today
  } else if (lastDate === yesterday) {
    user.streakCurrent += 1;
    user.streakBest = Math.max(user.streakBest, user.streakCurrent);
  } else {
    user.streakCurrent = 1;
  }
  user.lastActivityDate = new Date();
}

export function generatePosition(after?: string, before?: string): string {
  if (!after && !before) return 'n';
  if (!after) return (before as string).slice(0, -1) + String.fromCharCode(before!.charCodeAt(before!.length - 1) - 1) || 'a';
  if (!before) return after + 'n';
  // Midpoint between two lexorank strings
  const a = after;
  const b = before;
  if (a < b) return a + 'n';
  return b + 'n';
}
