const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Patient = require('../models/Patient');
const { recalculateFinancials } = require('./patientRoutes');

// GET payments for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.params.patientId })
      .populate('treatment', 'actName cost date')
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET recent payments (for general dashboard)
router.get('/recent', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('patient', 'firstName lastName customId phone cin')
      .populate('treatment', 'actName cost')
      .sort({ paymentDate: -1 })
      .limit(50);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST record payment
router.post('/', async (req, res) => {
  try {
    const { patient: patientId, amount, method, treatment, note, checkNumber } = req.body;

    // Generate invoice number if not provided (FA-YYYY-XXXXX format matching video)
    const currentYear = new Date().getFullYear();
    const count = await Payment.countDocuments();
    const invoiceNumber = `FA-${currentYear}-${String(count + 1).padStart(5, '0')}`;

    // Get current patient state
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    const currentRemaining = patient.financials.remainingAmount || 0;
    const remainingBalanceAfter = Math.max(0, currentRemaining - amount);

    const payment = new Payment({
      patient: patientId,
      treatment: treatment || null,
      amount: Number(amount),
      method,
      invoiceNumber,
      checkNumber: checkNumber || '',
      note: note || '',
      remainingBalanceAfter
    });

    const saved = await payment.save();
    const newFinancials = await recalculateFinancials(patientId);

    res.status(201).json({
      payment: saved,
      financials: newFinancials
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    await recalculateFinancials(payment.patient);
    res.json({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
