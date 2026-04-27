import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubtask {
  _id: mongoose.Types.ObjectId;
  title: string;
  done: boolean;
  order: number;
}

export interface IReminder {
  remindAt: Date;
  sent: boolean;
}

export interface IRecurring {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
}

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'inbox' | 'todo' | 'doing' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date;
  dueDate?: Date;
  dueTime?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags: mongoose.Types.ObjectId[];
  position: string;
  subtasks: ISubtask[];
  reminders: IReminder[];
  recurring?: IRecurring;
  pomodorosUsed: number;
  notes?: string;
  completedAt?: Date;
  deletedAt?: Date;
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;

  isOverdue: boolean;
  subtaskProgress: { done: number; total: number; pct: number };
}

const subtaskSchema = new Schema<ISubtask>(
  {
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const taskSchema = new Schema<ITask>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    title: { type: String, required: true, maxlength: 200, trim: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['inbox', 'todo', 'doing', 'review', 'done'],
      default: 'inbox',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    startDate: { type: Date },
    dueDate: { type: Date, index: true },
    dueTime: { type: String, match: /^\d{2}:\d{2}$/ },
    estimatedMinutes: { type: Number },
    actualMinutes: { type: Number },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    position: { type: String, required: true, default: 'a', index: true },
    subtasks: { type: [subtaskSchema], default: [] },
    reminders: {
      type: [
        {
          remindAt: { type: Date, required: true },
          sent: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    recurring: {
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'] },
      interval: { type: Number },
      daysOfWeek: [{ type: Number }],
      endDate: { type: Date },
    },
    pomodorosUsed: { type: Number, default: 0 },
    notes: { type: String },
    completedAt: { type: Date },
    deletedAt: { type: Date, index: true },
    xpReward: { type: Number, default: 25 },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

taskSchema.index({ owner: 1, status: 1, position: 1 });
taskSchema.index({ owner: 1, dueDate: 1 });
taskSchema.index({ owner: 1, deletedAt: 1, updatedAt: 1 });

taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === 'done') return false;
  return this.dueDate < new Date();
});

taskSchema.virtual('subtaskProgress').get(function () {
  const total = this.subtasks.length;
  const done = this.subtasks.filter((s) => s.done).length;
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

export const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
