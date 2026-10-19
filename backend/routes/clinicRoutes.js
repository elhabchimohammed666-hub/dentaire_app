const express = require('express');
const router = express.Router();
const ClinicSettings = require('../models/ClinicSettings');

// GET settings
router.get('/', async (req, res) => {
  try {
    let settings = await ClinicSettings.findOne();
    if (!settings) {
      settings = await ClinicSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update settings
router.put('/', async (req, res) => {
  try {
    let settings = await ClinicSettings.findOne();
    if (!settings) {
      settings = new ClinicSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const saved = await settings.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
