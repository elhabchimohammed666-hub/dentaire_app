const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// GET prescriptions by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('patient', 'firstName lastName dateOfBirth cin phone')
      .sort({ date: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create prescription
router.post('/', async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    const saved = await prescription.save();
    const populated = await Prescription.findById(saved._id).populate(
      'patient',
      'firstName lastName dateOfBirth cin phone'
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE prescription
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Prescription.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Ordonnance non trouvée' });
    }
    res.json({ message: 'Ordonnance supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
