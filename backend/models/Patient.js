const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      trim: true
    },
    firstName: {
      type: String,
      required: [true, 'Le prénom est obligatoire'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true
    },
    cin: {
      type: String,
      trim: true,
      default: ''
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Homme', 'Femme'],
      default: 'Femme'
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est obligatoire'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: 'Casablanca'
    },
    profession: {
      type: String,
      default: ''
    },
    civilStatus: {
      type: String,
      enum: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)', 'Autre'],
      default: 'Célibataire'
    },
    mutuelle: {
      provider: {
        type: String,
        default: 'Saham Assurance' // Matches demo (Saham Assurance, RMA, CNSS, CNOPS)
      },
      affiliationNumber: {
        type: String,
        default: ''
      },
      immatriculation: {
        type: String,
        default: ''
      }
    },
    medicalHistory: {
      allergies: {
        type: [String],
        default: []
      },
      chronicDiseases: {
        type: [String],
        default: []
      },
      currentMedications: {
        type: [String],
        default: []
      },
      bleedingDisorders: {
        type: Boolean,
        default: false
      },
      pregnant: {
        type: Boolean,
        default: false
      },
      notes: {
        type: String,
        default: ''
      }
    },
    tags: {
      type: [String],
      default: []
    },
    financials: {
      totalActs: {
        type: Number,
        default: 0
      },
      paidAmount: {
        type: Number,
        default: 0
      },
      remainingAmount: {
        type: Number,
        default: 0
      }
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

// Virtual for full name
PatientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Calculate age virtual
PatientSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const diff = Date.now() - this.dateOfBirth.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

PatientSchema.set('toJSON', { virtuals: true });
PatientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', PatientSchema);
