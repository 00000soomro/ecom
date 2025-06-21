const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get all payments (for super admin)
router.get('/', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const payments = await Payment.find().populate('subscriptionId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment status (simulate payment completion)
router.put('/:id', authMiddleware(['super_admin']), async (req, res) => {
  const { status } = req.body;
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;