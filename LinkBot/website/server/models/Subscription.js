const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  renewedAt: { type: Date },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);