const mongoose = require('mongoose');

const ProtheseSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    laboratoryName: {
      type: String,
      required: true,
      default: 'Laboratoire Dentaire Al-Amal'
    },
    prothesisType: {
      type: String,
      required: true,
      enum: [
        'Couronne Zircone',
        'Couronne Céramo-Métallique',
        'Bridge Zircone / Céramique',
        'Facette Dentaire E-Max',
        'Appareil Amovible Résine',
        'Appareil Squeletté (Stellite)',
        'Gouttière de libération / Blanchiment',
        'Inlay / Onlay',
        'Pilier & Couronne sur Implant'
      ],
      default: 'Couronne Zircone'
    },
    teeth: {
      type: [Number],
      default: []
    },
    shade: {
      type: String, // e.g. A2, A3, B1
      default: 'A2'
    },
    sentDate: {
      type: Date,
      default: Date.now
    },
    tryInDate: {
      type: Date
    },
    deliveryDate: {
      type: Date
    },
    costLab: {
      type: Number,
      default: 0
    },
    pricePatient: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Envoyé au labo', 'Reçu au cabinet', 'Essayage réussi', 'Posé / Terminé', 'À retoucher'],
      default: 'Envoyé au labo'
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

module.exports = mongoose.model('Prothese', ProtheseSchema);
