import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  originalPrice: number;
  discountPrice?: number;
  sectionId: mongoose.Types.ObjectId;
  displayImage: string;
  productFiles: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  sectionId: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  displayImage: {
    type: String,
    required: true,
  },
  productFiles: [{
    type: String,
    required: true,
  }],
  isFeatured: {
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

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);