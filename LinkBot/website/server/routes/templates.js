const express = require('express');
const Template = require('../models/Template');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['super_admin', 'agency']), async (req, res) => {
  const { name, category, components } = req.body;
  try {
    const template = new Template({ name, category, components, createdBy: req.user.id });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware(['super_admin', 'agency', 'client']), async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;