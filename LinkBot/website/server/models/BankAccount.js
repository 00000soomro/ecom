const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  accountHolderName: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  routingNumber: { type: String, required: true }, // For US banks; adjust for other countries
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BankAccount', bankAccountSchema);