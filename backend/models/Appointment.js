const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true,
      default: '09:00'
    },
    durationMinutes: {
      type: Number,
      default: 30
    },
    service: {
      type: String,
      enum: [
        'Contrôle périodique',
        'Soin / Plombage',
        'Détartrage',
        'Extraction',
        'Orthodontie',
        'Endodontie / Dévitalisation',
        'Prothèse / Essayage',
        'Urgence',
        'Blanchiment',
        'Autre'
      ],
      default: 'Contrôle périodique'
    },
    status: {
      type: String,
      enum: ['En attente', 'Confirmé', 'Terminé', 'Annulé', 'Absence non excusée'],
      default: 'Confirmé'
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

module.exports = mongoose.model('Appointment', AppointmentSchema);
