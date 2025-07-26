import mongoose, { Document, Schema } from 'mongoose';

export interface ISection extends Document {
  name: string;
  slug: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId;
  level: number; // 0 = main category, 1 = subcategory, 2 = sub-subcategory
  displayOrder: number;
  showInNavbar: boolean;
  showInHomepage: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<ISection>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    default: null,
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
    default: 0,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  showInNavbar: {
    type: Boolean,
    default: false,
  },
  showInHomepage: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index for unique name within same parent
SectionSchema.index({ name: 1, parentId: 1 }, { unique: true });

// Index for efficient querying
SectionSchema.index({ level: 1, displayOrder: 1 });
SectionSchema.index({ parentId: 1, displayOrder: 1 });
SectionSchema.index({ showInNavbar: 1, level: 1 });
SectionSchema.index({ showInHomepage: 1 });

export default mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);