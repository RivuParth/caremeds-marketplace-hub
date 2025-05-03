
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'placeholder.jpg'
  },
  preparationTime: {
    type: Number,
    default: 30 // default 30 minutes
  },
  ingredients: {
    type: [String],
    default: []
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Number, // 0-3 scale where 0 is not spicy, 3 is very spicy
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
