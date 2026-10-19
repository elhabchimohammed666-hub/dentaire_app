const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Payment = require('../models/Payment');

// GET all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET financial overview (Recettes vs Dépenses vs Bénéfice)
router.get('/summary', async (req, res) => {
  try {
    const payments = await Payment.find();
    const expenses = await Expense.find();

    const totalRecettes = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalDepenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const beneficeNet = totalRecettes - totalDepenses;

    // Category breakdown for expenses
    const expensesByCategory = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    // Payment methods breakdown
    const paymentsByMethod = payments.reduce((acc, curr) => {
      acc[curr.method] = (acc[curr.method] || 0) + curr.amount;
      return acc;
    }, {});

    res.json({
      totalRecettes,
      totalDepenses,
      beneficeNet,
      expensesByCategory,
      paymentsByMethod,
      paymentsCount: payments.length,
      expensesCount: expenses.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE expense
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Dépense non trouvée' });
    }
    res.json({ message: 'Dépense supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
