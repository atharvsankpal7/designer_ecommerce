import mongoose from 'mongoose';

const ContactSettingsSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    default: '+91 98765 43210'
  },
  email: {
    type: String,
    required: true,
    default: 'hello@sscreation.com'
  },
  address: {
    type: String,
    required: true,
    default: '123 Design Street, Mumbai'
  },
  workingHours: {
    monday: { type: String, default: '9:00 AM - 6:00 PM' },
    tuesday: { type: String, default: '9:00 AM - 6:00 PM' },
    wednesday: { type: String, default: '9:00 AM - 6:00 PM' },
    thursday: { type: String, default: '9:00 AM - 6:00 PM' },
    friday: { type: String, default: '9:00 AM - 6:00 PM' },
    saturday: { type: String, default: '10:00 AM - 4:00 PM' },
    sunday: { type: String, default: 'Closed' }
  },
  mapEmbedUrl: {
    type: String,
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.715872126558!2d72.8245093153778!3d19.04346925793646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c96a34dc4401%3A0x3ffc07e83942b13f!2s123%20Design%20Street%2C%20Mumbai%2C%20Maharashtra%20400001!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
  },
  whatsappNumber: {
    type: String,
    required: true,
    default: '+919876543210'
  }
}, {
  timestamps: true
});

export default mongoose.models.ContactSettings || mongoose.model('ContactSettings', ContactSettingsSchema);