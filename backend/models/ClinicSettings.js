const mongoose = require('mongoose');

const ClinicSettingsSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      default: 'Cabinet Dentaire Dr. Dentolio'
    },
    doctorName: {
      type: String,
      default: 'Dr. Dentolio'
    },
    specialty: {
      type: String,
      default: 'Chirurgien-Dentiste - Soins, Prothèses & Implantologie'
    },
    address: {
      type: String,
      default: 'Boulevard Zerktouni, Résidence Al Manar, Casablanca'
    },
    phone: {
      type: String,
      default: '+212 5 22 34 56 78'
    },
    mobile: {
      type: String,
      default: '+212 6 61 98 76 54'
    },
    email: {
      type: String,
      default: 'contact@dentolio.ma'
    },
    website: {
      type: String,
      default: 'www.dentolio.ma'
    },
    ice: {
      type: String,
      default: '001524389000045'
    },
    ifNumber: {
      type: String,
      default: '45678912'
    },
    inpe: {
      type: String,
      default: '109876543'
    },
    currency: {
      type: String,
      default: 'DH'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ClinicSettings', ClinicSettingsSchema);
