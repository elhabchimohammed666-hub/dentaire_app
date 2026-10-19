const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema(
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
    items: [
      {
        medicine: {
          type: String,
          required: true
        },
        dosage: {
          type: String,
          default: ''
        },
        frequency: {
          type: String,
          default: ''
        },
        duration: {
          type: String,
          default: ''
        },
        instructions: {
          type: String,
          default: ''
        }
      }
    ],
    customText: {
      type: String,
      default: ''
    },
    doctorName: {
      type: String,
      default: 'Dr. Dentolio'
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

module.exports = mongoose.model('Prescription', PrescriptionSchema);
