const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    teeth: {
      type: [Number], // FDI notation: 11-18, 21-28, 31-38, 41-48
      default: []
    },
    surfaces: {
      type: [String], // O (Occlusale), M (Mésiale), D (Distale), V (Vestibulaire), L (Linguale/Palatine)
      default: []
    },
    actName: {
      type: String,
      required: [true, "Le nom de l'acte est obligatoire"],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Soins conservateurs',
        'Chirurgie & Extraction',
        'Prothèse fixe',
        'Prothèse amovible',
        'Endodontie',
        'Parodontologie',
        'Orthodontie',
        'Implantologie',
        'Esthétique & Blanchiment',
        'Autre'
      ],
      default: 'Soins conservateurs'
    },
    cost: {
      type: Number,
      required: [true, 'Le coût est obligatoire'],
      min: 0
    },
    status: {
      type: String,
      enum: ['Planifié', 'En cours', 'Terminé', 'Annulé'],
      default: 'Terminé'
    },
    color: {
      type: String,
      default: '#0d9488'
    },
    notes: {
      type: String,
      default: ''
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    includedInFeuilleDeSoins: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Treatment', TreatmentSchema);
