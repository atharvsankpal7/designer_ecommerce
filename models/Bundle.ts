import mongoose, { Document, Schema } from 'mongoose';

export interface IBundle extends Document {
  name: string;
  description: string;
  products: mongoose.Types.ObjectId[];
  sectionIds: mongoose.Types.ObjectId[];
  originalPrice: number;
  discountPrice?: number;
  displayImage: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BundleSchema = new Schema<IBundle>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
  sectionIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  }],
  originalPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  displayImage: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Bundle || mongoose.model<IBundle>('Bundle', BundleSchema);