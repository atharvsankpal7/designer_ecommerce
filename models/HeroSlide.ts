import mongoose, { Document, Schema } from 'mongoose';

export interface IHeroSlide extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isActive: boolean;
  linkUrl?: string;
  linkText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    linkText: {
      type: String,
      trim: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
HeroSlideSchema.index({ displayOrder: 1, isActive: 1 });
HeroSlideSchema.index({ isActive: 1, createdAt: -1 });

const HeroSlide = mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);

export default HeroSlide;