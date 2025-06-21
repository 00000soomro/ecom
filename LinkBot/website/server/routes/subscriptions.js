const express = require('express');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Create a new subscription (for agencies or clients)
router.post('/', authMiddleware(['agency', 'client']), async (req, res) => {
  const { plan, amount } = req.body;
  try {
    const subscription = new Subscription({ userId: req.user.id, plan, amount });
    await subscription.save();

    // Create a payment record
    const payment = new Payment({ subscriptionId: subscription._id, amount });
    await payment.save();

    res.status(201).json({ subscription, payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subscriptions (for super admin)
router.get('/', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('userId', 'email');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;