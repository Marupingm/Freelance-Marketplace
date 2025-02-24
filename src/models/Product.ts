import mongoose from 'mongoose';

export interface IProduct {
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  sellerId: mongoose.Types.ObjectId;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide a file URL'],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a seller ID'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Graphic', 'Link Building', 'Music & Animation', 'SEO & Research', 'Technology', 'Traffic'],
  },
}, {
  timestamps: true,
});

// Create indexes for better search performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ sellerId: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema); 