import mongoose from 'mongoose';

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  price: number;
}

export interface IOrder {
  _id: string;
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  amount: number;
  paymentId?: string;
  paymentToken: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: 'ObjectId',
    ref: 'Product',
    required: [true, 'Product ID is required'],
  },
  sellerId: {
    type: 'ObjectId',
    ref: 'User',
    required: [true, 'Seller ID is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  userId: {
    type: 'ObjectId',
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Order items are required'],
    validate: {
      validator: function(items: OrderItem[]) {
        return items.length > 0;
      },
      message: 'Order must contain at least one item',
    },
  },
  amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  paymentId: {
    type: String,
  },
  paymentToken: {
    type: String,
    required: [true, 'Payment token is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
}, {
  timestamps: true,
  _id: false, // Disable auto _id since we're providing our own
  strict: true,
});

// Create indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentToken: 1 });

// Add a pre-save hook to validate the total amount
orderSchema.pre('save', function(next) {
  const order = this;
  const calculatedTotal = order.items.reduce((sum, item) => sum + item.price, 0);
  
  if (Math.abs(calculatedTotal - order.amount) > 0.01) {
    next(new Error('Order total does not match sum of items'));
  } else {
    next();
  }
});

// Clear existing model if it exists to prevent OverwriteModelError
mongoose.models = {};

export default mongoose.model<IOrder>('Order', orderSchema); //  
