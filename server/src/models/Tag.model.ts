import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITag extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  color: string;
  createdAt: Date;
}

const tagSchema = new Schema<ITag>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, maxlength: 50, trim: true },
    color: { type: String, default: '#6b7280', match: /^#[0-9a-fA-F]{6}$/ },
  },
  { timestamps: true }
);

tagSchema.index({ owner: 1, name: 1 }, { unique: true });

export const Tag: Model<ITag> = mongoose.model<ITag>('Tag', tagSchema);
