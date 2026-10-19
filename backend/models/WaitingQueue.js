const mongoose = require('mongoose');

const WaitingQueueSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    motif: {
      type: String,
      default: 'Urgence / Douleur'
    },
    priority: {
      type: String,
      enum: ['Normale', 'Urgente', 'VIP'],
      default: 'Normale'
    },
    arrivalTime: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['En Salle', 'En consultation', 'Terminé'],
      default: 'En Salle'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WaitingQueue', WaitingQueueSchema);
