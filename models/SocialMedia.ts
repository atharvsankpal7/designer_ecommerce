import mongoose from 'mongoose';

const SocialMediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  icon: {
    type: String, // This will store the icon name or custom icon URL
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  showInFooter: {
    type: Boolean,
    default: true
  },
  showInContact: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#000000'
  }
}, {
  timestamps: true
});

// Index for ordering
SocialMediaSchema.index({ order: 1 });

export default mongoose.models.SocialMedia || mongoose.model('SocialMedia', SocialMediaSchema);