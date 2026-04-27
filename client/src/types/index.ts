export type Theme = 'dark' | 'light' | 'auto';
export type TaskStatus = 'inbox' | 'todo' | 'doing' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'archived';

export interface UserPreferences {
  theme: Theme;
  pomodoroWork: number;
  pomodoroBreak: number;
  pomodoroLong: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface User {
  _id: string;
  username: string;
  email?: string;
  avatar?: string;
  xp: number;
  level: number;
  streakCurrent: number;
  streakBest: number;
  lastActivityDate?: string;
  achievements: string[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: string;
  color: string;
}

export interface Subtask {
  _id: string;
  title: string;
  done: boolean;
  order: number;
}

export interface SubtaskProgress {
  done: number;
  total: number;
  pct: number;
}

export interface Task {
  _id: string;
  owner: string;
  project?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate?: string;
  dueDate?: string;
  dueTime?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags: Tag[];
  position: string;
  subtasks: Subtask[];
  pomodorosUsed: number;
  notes?: string;
  completedAt?: string;
  deletedAt?: string;
  xpReward: number;
  isOverdue?: boolean;
  subtaskProgress?: SubtaskProgress;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  owner: string;
  name: string;
  emoji: string;
  color: string;
  description?: string;
  deadline?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  pages: number;
}

export interface AnalyticsSummary {
  todayCompleted: number;
  todayTotal: number;
  weekCompleted: number;
  streakCurrent: number;
  totalXP: number;
  level: number;
}

export interface HeatmapEntry {
  date: string;
  count: number;
}

export interface WeeklyEntry {
  date: string;
  count: number;
}

export interface PriorityEntry {
  priority: TaskPriority;
  count: number;
}

// Zustand store types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, partial: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, partial: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setLoading: (v: boolean) => void;
}

export interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
  activeModal: string | null;
  commandPaletteOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
  openModal: (name: string) => void;
  closeModal: () => void;
  setCommandPaletteOpen: (v: boolean) => void;
}
