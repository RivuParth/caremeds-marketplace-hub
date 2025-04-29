
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentType: {
    type: String,
    enum: ['cash', 'upi'],
    default: 'cash'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  commission: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
