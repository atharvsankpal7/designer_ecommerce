import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  email: string;
  productId: mongoose.Types.ObjectId;
  bundleId?: mongoose.Types.ObjectId;
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'verified' | 'paid' | 'delivered';
  verificationCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  email: {
    type: String,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  bundleId: {
    type: Schema.Types.ObjectId,
    ref: 'Bundle',
  },
  amount: {
    type: Number,
    required: true,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'paid', 'delivered'],
    default: 'pending',
  },
  verificationCode: {
    type: String,
  },
}, {
  timestamps: true,
});

// Compound indexes for email with productId and bundleId
OrderSchema.index({ email: 1, productId: 1 });
OrderSchema.index({ email: 1, bundleId: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);