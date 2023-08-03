import mongoose from 'mongoose';

interface IReview {
  rating: number;
  comment: string;
  reviewer: string;
  date: Date;
}

export interface IProduct {
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  sellerId: mongoose.Types.ObjectId;
  category: string;
  reviews: IReview[];
  rating: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  reviewer: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

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
    enum: [
      'UI/UX Design',
      'Web Development',
      'Mobile Development',
      'Digital Marketing',
      'Software Solutions',
      'AI & Machine Learning',
      'DevOps & Cloud',
      'Cybersecurity',
      'Data Science',
      'Graphic Design',
      'Content Creation',
      'E-commerce Solutions'
    ],
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  salesCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create indexes for better search performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ salesCount: -1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema); //  
//  
