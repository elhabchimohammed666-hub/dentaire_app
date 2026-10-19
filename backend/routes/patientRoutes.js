const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const Payment = require('../models/Payment');

// Helper to recalculate patient financials
const recalculateFinancials = async (patientId) => {
  const treatments = await Treatment.find({ patient: patientId });
  const payments = await Payment.find({ patient: patientId });

  const totalActs = treatments.reduce((sum, t) => sum + (t.cost || 0), 0);
  const paidAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const remainingAmount = Math.max(0, totalActs - paidAmount);

  await Patient.findByIdAndUpdate(patientId, {
    'financials.totalActs': totalActs,
    'financials.paidAmount': paidAmount,
    'financials.remainingAmount': remainingAmount
  });

  return { totalActs, paidAmount, remainingAmount };
};

// GET all patients
router.get('/', async (req, res) => {
  try {
    const { search, tag, sort } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { phone: searchRegex },
        { cin: searchRegex },
        { customId: searchRegex }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    const patients = await Patient.find(query).sort({ updatedAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Refresh financials
    const financials = await recalculateFinancials(patient._id);
    patient.financials = financials;

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create patient
router.post('/', async (req, res) => {
  try {
    let customId = req.body.customId;
    if (!customId) {
      const count = await Patient.countDocuments();
      customId = `P-${String(count + 1).padStart(4, '0')}`;
    }

    const patient = new Patient({
      ...req.body,
      customId
    });

    const savedPatient = await patient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update patient
router.put('/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    await recalculateFinancials(updatedPatient._id);
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE patient
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    // Clean up related records
    await Treatment.deleteMany({ patient: patient._id });
    await Payment.deleteMany({ patient: patient._id });
    res.json({ message: 'Patient et dossiers associés supprimés avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
module.exports.recalculateFinancials = recalculateFinancials;
