const express = require('express');
const router = express.Router();
const Prothese = require('../models/Prothese');

// GET all protheses
router.get('/', async (req, res) => {
  try {
    const protheses = await Prothese.find()
      .populate('patient', 'firstName lastName phone cin customId')
      .sort({ sentDate: -1 });
    res.json(protheses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET protheses by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const protheses = await Prothese.find({ patient: req.params.patientId })
      .sort({ sentDate: -1 });
    res.json(protheses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create prothese order
router.post('/', async (req, res) => {
  try {
    const prothese = new Prothese(req.body);
    const saved = await prothese.save();
    const populated = await Prothese.findById(saved._id).populate(
      'patient',
      'firstName lastName phone cin customId'
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update prothese
router.put('/:id', async (req, res) => {
  try {
    const updated = await Prothese.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('patient', 'firstName lastName phone cin customId');

    if (!updated) {
      return res.status(404).json({ message: 'Commande de prothèse non trouvée' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE prothese
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Prothese.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
