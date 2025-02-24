import mongoose from 'mongoose';

export interface IOrder {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  amount: number;
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID'],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please provide a product ID'],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a seller ID'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative'],
  },
  paymentId: {
    type: String,
    required: [true, 'Please provide a payment ID'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
orderSchema.index({ userId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema); 