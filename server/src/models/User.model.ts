import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email?: string;
  password: string;
  avatar?: string;
  refreshTokenHash?: string;

  xp: number;
  level: number;
  streakCurrent: number;
  streakBest: number;
  lastActivityDate?: Date;
  achievements: string[];

  preferences: {
    theme: 'dark' | 'light' | 'auto';
    pomodoroWork: number;
    pomodoroBreak: number;
    pomodoroLong: number;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
  };

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: { type: String, sparse: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String },
    refreshTokenHash: { type: String, select: false },

    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streakCurrent: { type: Number, default: 0 },
    streakBest: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
    achievements: { type: [String], default: [] },

    preferences: {
      theme: { type: String, enum: ['dark', 'light', 'auto'], default: 'dark' },
      pomodoroWork: { type: Number, default: 25 },
      pomodoroBreak: { type: Number, default: 5 },
      pomodoroLong: { type: Number, default: 15 },
      notificationsEnabled: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
