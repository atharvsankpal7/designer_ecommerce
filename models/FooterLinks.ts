import mongoose from 'mongoose';

const FooterLinksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['quick-links', 'categories', 'legal']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for ordering within categories
FooterLinksSchema.index({ category: 1, order: 1 });

export default mongoose.models.FooterLinks || mongoose.model('FooterLinks', FooterLinksSchema);