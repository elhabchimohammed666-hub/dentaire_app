const express = require('express');
const router = express.Router();
const WaitingQueue = require('../models/WaitingQueue');

// GET active waiting room list
router.get('/', async (req, res) => {
  try {
    const queue = await WaitingQueue.find({ status: { $ne: 'Terminé' } })
      .populate('patient', 'firstName lastName phone cin customId medicalHistory')
      .sort({ arrivalTime: 1 });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add patient to waiting room
router.post('/', async (req, res) => {
  try {
    const item = new WaitingQueue(req.body);
    const saved = await item.save();
    const populated = await WaitingQueue.findById(saved._id).populate(
      'patient',
      'firstName lastName phone cin customId medicalHistory'
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update status in waiting room
router.put('/:id', async (req, res) => {
  try {
    const updated = await WaitingQueue.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('patient', 'firstName lastName phone cin customId medicalHistory');

    if (!updated) {
      return res.status(404).json({ message: 'Patient non trouvé dans la file' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE remove from waiting room
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await WaitingQueue.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Élément non trouvé' });
    }
    res.json({ message: 'Retiré de la salle d’attente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE clear waiting room ("Vider la salle")
router.delete('/clear/all', async (req, res) => {
  try {
    await WaitingQueue.deleteMany({ status: { $ne: 'Terminé' } });
    res.json({ message: 'Salle d’attente vidée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
