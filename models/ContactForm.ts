import mongoose, { Document, Schema } from 'mongoose';

export interface IContactForm extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

const ContactFormSchema = new Schema<IContactForm>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.ContactForm || mongoose.model<IContactForm>('ContactForm', ContactFormSchema);