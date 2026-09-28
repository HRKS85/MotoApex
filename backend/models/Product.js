const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discountPercentage: { type: Number, default: 0 },
  category: { type: String, required: true }, // 'Helmets', 'Jackets', 'Gloves', etc.
  images: [{ type: String, required: true }], // Array of 3-5 image URLs for sliding gallery
  stock: { type: Number, required: true, default: 10 },
  specs: {
    material: String,
    certification: String, // e.g., 'ECE 22.06', 'DOT', 'CE Level 2'
    sizes: [String],
  },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  isFeaturedDeal: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);