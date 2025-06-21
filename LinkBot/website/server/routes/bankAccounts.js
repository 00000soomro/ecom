const express = require('express');
const BankAccount = require('../models/BankAccount');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Save or update bank account details (for super admin)
router.post('/', authMiddleware(['super_admin']), async (req, res) => {
  const { accountHolderName, bankName, accountNumber, routingNumber } = req.body;
  try {
    let bankAccount = await BankAccount.findOne({ adminId: req.user.id });
    if (bankAccount) {
      bankAccount.accountHolderName = accountHolderName;
      bankAccount.bankName = bankName;
      bankAccount.accountNumber = accountNumber;
      bankAccount.routingNumber = routingNumber;
    } else {
      bankAccount = new BankAccount({
        adminId: req.user.id,
        accountHolderName,
        bankName,
        accountNumber,
        routingNumber,
      });
    }
    await bankAccount.save();
    res.status(201).json(bankAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bank account details (for super admin)
router.get('/', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOne({ adminId: req.user.id });
    res.json(bankAccount || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;