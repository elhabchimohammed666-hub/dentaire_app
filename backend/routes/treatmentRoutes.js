const express = require('express');
const router = express.Router();
const Treatment = require('../models/Treatment');
const { recalculateFinancials } = require('./patientRoutes');

// GET treatments by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const treatments = await Treatment.find({ patient: req.params.patientId }).sort({ date: -1 });
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create treatment
router.post('/', async (req, res) => {
  try {
    const treatment = new Treatment(req.body);
    const saved = await treatment.save();
    await recalculateFinancials(saved.patient);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update treatment
router.put('/:id', async (req, res) => {
  try {
    const updated = await Treatment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Acte non trouvé' });
    }
    await recalculateFinancials(updated.patient);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE treatment
router.delete('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) {
      return res.status(404).json({ message: 'Acte non trouvé' });
    }
    await recalculateFinancials(treatment.patient);
    res.json({ message: 'Acte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
