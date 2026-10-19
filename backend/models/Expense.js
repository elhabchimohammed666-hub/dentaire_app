const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now
    },
    title: {
      type: String,
      required: [true, 'Le libellé de la dépense est obligatoire'],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Fournitures & Consommables',
        'Laboratoire de prothèse',
        'Loyer & Charges',
        'Salaires & Honoraires',
        'Maintenance & Équipements',
        'Impôts & Taxes',
        'Marketing & Logiciel',
        'Divers'
      ],
      default: 'Fournitures & Consommables'
    },
    amount: {
      type: Number,
      required: [true, 'Le montant est obligatoire'],
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['Espèce', 'Carte Bancaire', 'Chèque', 'Virement'],
      default: 'Espèce'
    },
    supplier: {
      type: String,
      default: ''
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

module.exports = mongoose.model('Expense', ExpenseSchema);
