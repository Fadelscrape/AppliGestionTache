import { create } from 'zustand';
import type { ProjectState, Project } from '@/types';

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,

  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  updateProject: (id, partial) =>
    set((state) => ({
      projects: state.projects.map((p) => (p._id === id ? { ...p, ...partial } : p)),
    })),

  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p._id !== id) })),

  setLoading: (isLoading) => set({ isLoading }),
}));
