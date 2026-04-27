import { useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import type { Task } from '@/types';
import { triggerConfetti } from '@/components/ui/ConfettiEffect';

export function useTasks() {
  const store = useTaskStore();

  const fetchTodayTasks = useCallback(async () => {
    store.setLoading(true);
    try {
      const res = await api.get('/api/tasks/today');
      store.setTasks(res.data.data.tasks);
    } catch {
      store.setError('Erreur lors du chargement des tâches');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async (params?: Record<string, string>) => {
    store.setLoading(true);
    try {
      const res = await api.get('/api/tasks', { params });
      store.setTasks(res.data.data.tasks);
    } catch {
      store.setError('Erreur lors du chargement des tâches');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: Partial<Task>) => {
    const res = await api.post('/api/tasks', data);
    const task: Task = res.data.data.task;
    store.addTask(task);
    toast.success('Tâche créée !');
    return task;
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    store.updateTask(id, data);
    try {
      const res = await api.put(`/api/tasks/${id}`, data);
      store.updateTask(id, res.data.data.task);
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  }, []);

  const completeTask = useCallback(async (id: string) => {
    store.updateTask(id, { status: 'done' });
    try {
      const res = await api.patch(`/api/tasks/${id}/complete`);
      const { xpGained, newAchievements, user, task } = res.data.data;
      store.updateTask(id, task);
      useAuthStore.getState().updateUser(user);
      toast.success(`+${xpGained} XP !`, { icon: '⚡' });
      if (task.priority === 'urgent') triggerConfetti();
      if (newAchievements?.length > 0) {
        newAchievements.forEach((a: string) => toast.success(`🏆 Achievement : ${a}`));
      }
    } catch {
      store.updateTask(id, { status: 'todo' });
      toast.error('Erreur lors de la complétion');
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    store.removeTask(id);
    try {
      await api.delete(`/api/tasks/${id}`);
      toast.success('Tâche supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  }, []);

  const patchStatus = useCallback(async (id: string, status: Task['status']) => {
    store.updateTask(id, { status });
    await api.patch(`/api/tasks/${id}/status`, { status });
  }, []);

  const patchPosition = useCallback(async (id: string, position: string) => {
    store.updateTask(id, { position });
    await api.patch(`/api/tasks/${id}/position`, { position });
  }, []);

  return { ...store, fetchTasks, fetchTodayTasks, createTask, updateTask, completeTask, deleteTask, patchStatus, patchPosition };
}
