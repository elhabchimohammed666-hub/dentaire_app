const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treatment',
      default: null
    },
    amount: {
      type: Number,
      required: [true, 'Le montant est obligatoire'],
      min: 1
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    method: {
      type: String,
      enum: ['Espèce', 'Carte Bancaire', 'Chèque', 'Virement'],
      default: 'Espèce'
    },
    invoiceNumber: {
      type: String,
      trim: true
    },
    checkNumber: {
      type: String,
      default: ''
    },
    note: {
      type: String,
      default: ''
    },
    remainingBalanceAfter: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', PaymentSchema);
