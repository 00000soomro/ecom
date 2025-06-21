const express = require('express');
const Withdrawal = require('../models/Withdrawal');
const Payment = require('../models/Payment');
const BankAccount = require('../models/BankAccount');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get total revenue and withdrawal summary (for super admin)
router.get('/summary', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const withdrawals = await Withdrawal.find({ adminId: req.user.id });
    const totalWithdrawn = withdrawals
      .filter(w => w.status === 'approved')
      .reduce((sum, w) => sum + w.amount, 0);
    const pendingWithdrawals = withdrawals
      .filter(w => w.status === 'pending')
      .reduce((sum, w) => sum + w.amount, 0);

    res.json({
      totalRevenue,
      totalWithdrawn,
      pendingWithdrawals,
      availableForWithdrawal: totalRevenue - totalWithdrawn - pendingWithdrawals,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request a withdrawal (for super admin)
router.post('/', authMiddleware(['super_admin']), async (req, res) => {
  const { amount } = req.body;
  try {
    // Check if bank account details are provided
    const bankAccount = await BankAccount.findOne({ adminId: req.user.id });
    if (!bankAccount) {
      return res.status(400).json({ message: 'Please provide bank account details before requesting a withdrawal' });
    }

    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const withdrawals = await Withdrawal.find({ adminId: req.user.id });
    const totalWithdrawn = withdrawals
      .filter(w => w.status === 'approved')
      .reduce((sum, w) => sum + w.amount, 0);
    const pendingWithdrawals = withdrawals
      .filter(w => w.status === 'pending')
      .reduce((sum, w) => sum + w.amount, 0);

    const availableForWithdrawal = totalRevenue - totalWithdrawn - pendingWithdrawals;

    if (amount > availableForWithdrawal) {
      return res.status(400).json({ message: 'Insufficient funds for withdrawal' });
    }

    // Simulate bank transfer (replace with actual bank API integration)
    const withdrawal = new Withdrawal({ adminId: req.user.id, amount });
    // Simulate approval (in production, this would be done manually or via a bank API callback)
    withdrawal.status = 'approved';
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get withdrawal history (for super admin)
router.get('/', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ adminId: req.user.id });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;