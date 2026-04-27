import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  emoji: string;
  color: string;
  description?: string;
  deadline?: Date;
  status: 'active' | 'on-hold' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, maxlength: 100, trim: true },
    emoji: { type: String, default: '📁' },
    color: { type: String, default: '#7c3aed', match: /^#[0-9a-fA-F]{6}$/ },
    description: { type: String },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['active', 'on-hold', 'completed', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);
