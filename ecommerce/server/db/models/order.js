// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This references the 'User' model
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the 'Product' model
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
