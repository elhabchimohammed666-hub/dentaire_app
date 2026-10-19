const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const WaitingQueue = require('../models/WaitingQueue');
const Prescription = require('../models/Prescription');
const Expense = require('../models/Expense');
const Prothese = require('../models/Prothese');
const ClinicSettings = require('../models/ClinicSettings');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dentolio_db';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connecté à MongoDB...');

    // Clear existing data
    await Patient.deleteMany({});
    await Treatment.deleteMany({});
    await Payment.deleteMany({});
    await Appointment.deleteMany({});
    await WaitingQueue.deleteMany({});
    await Prescription.deleteMany({});
    await Expense.deleteMany({});
    await Prothese.deleteMany({});
    await ClinicSettings.deleteMany({});

    console.log('[Seed] Base de données nettoyée.');

    // 1. Clinic Settings
    const settings = await ClinicSettings.create({
      clinicName: 'Cabinet Dentaire Dr. Dentolio',
      doctorName: 'Dr. Dentolio (Safaa Nhari)',
      specialty: 'Chirurgien Dentiste - Soins, Prothèses & Esthétique',
      address: 'Boulevard Zerktouni, Immeuble Les Fleurs, Casablanca',
      phone: '+212 5 22 45 67 89',
      mobile: '+212 6 61 23 45 67',
      email: 'contact@dentolio.ma',
      website: 'www.dentolio.ma',
      ice: '001524389000045',
      ifNumber: '45678912',
      inpe: '109876543',
      currency: 'DH'
    });

    // 2. Patient 1: Najlae Amrani (from the video demo!)
    const p1 = await Patient.create({
      customId: 'P-0001',
      firstName: 'Najlae',
      lastName: 'Amrani',
      cin: 'BE890123',
      dateOfBirth: new Date('2002-02-05'),
      gender: 'Femme',
      phone: '+212 6 61 23 45 67',
      email: 'najlae.amrani@gmail.com',
      address: '124 Rue Rahal Meskini, Apt 4',
      city: 'Casablanca',
      profession: 'Ingénieure Informatique',
      civilStatus: 'Célibataire',
      mutuelle: {
        provider: 'Saham Assurance',
        affiliationNumber: 'SH-8899201',
        immatriculation: 'IM-9021-B'
      },
      medicalHistory: {
        allergies: ['Pénicilline', 'Latex'],
        chronicDiseases: ['Diabète Type 2'],
        currentMedications: ['Metformine 500mg'],
        bleedingDisorders: false,
        pregnant: false,
        notes: 'Patiente allergique aux dérivés de pénicilline. Préférer Macrolides.'
      },
      tags: ['Assurance', 'Orthodontie', 'VIP'],
      financials: {
        totalActs: 3000,
        paidAmount: 2300,
        remainingAmount: 700
      },
      notes: 'Suivi régulier. Traitement d’orthodontie et pose d’appareil partiel.'
    });

    // Treatments for Najlae Amrani (matching video)
    const t1 = await Treatment.create({
      patient: p1._id,
      date: new Date('2026-09-10'),
      teeth: [38],
      surfaces: ['O'],
      actName: 'Extraction d’une canine incluse',
      category: 'Chirurgie & Extraction',
      cost: 600,
      status: 'Terminé',
      color: '#9333ea', // purple matching video
      notes: 'Extraction sans complication sous anesthésie locale',
      includedInFeuilleDeSoins: true
    });

    const t2 = await Treatment.create({
      patient: p1._id,
      date: new Date('2026-09-08'),
      teeth: [35],
      surfaces: ['V', 'O'],
      actName: 'Appareil sur plaque base plastique (1 à 3 dents)',
      category: 'Prothèse amovible',
      cost: 1000,
      status: 'Terminé',
      color: '#0d9488',
      notes: 'Empreinte et essayage validés',
      includedInFeuilleDeSoins: true
    });

    const t3 = await Treatment.create({
      patient: p1._id,
      date: new Date('2026-09-08'),
      teeth: [36],
      surfaces: ['V'],
      actName: 'Approfondissement vestibulaire (greffe cutanée)',
      category: 'Parodontologie',
      cost: 1000,
      status: 'Terminé',
      color: '#0d9488',
      notes: 'Sutures résorbables',
      includedInFeuilleDeSoins: true
    });

    const t4 = await Treatment.create({
      patient: p1._id,
      date: new Date('2026-09-05'),
      teeth: [34],
      surfaces: ['O'],
      actName: 'Détartrage complet sus et sous-gingival',
      category: 'Soins conservateurs',
      cost: 400,
      status: 'Terminé',
      color: '#10b981',
      notes: 'Polissage prophylactique inclus'
    });

    // Payments for Najlae Amrani (matching video: 1500 + 800 paid = 2300, remaining 700)
    await Payment.create({
      patient: p1._id,
      treatment: t2._id,
      amount: 1500,
      paymentDate: new Date('2026-09-08'),
      method: 'Carte Bancaire',
      invoiceNumber: 'FA-2026-00008',
      note: 'Acompte appareil et soins',
      remainingBalanceAfter: 1500
    });

    await Payment.create({
      patient: p1._id,
      treatment: t1._id,
      amount: 800,
      paymentDate: new Date('2026-09-10'),
      method: 'Espèce',
      invoiceNumber: 'FA-2026-00009',
      note: 'Règlement extraction et suite',
      remainingBalanceAfter: 700
    });

    // Appointments for Najlae Amrani (matching video list)
    const appointmentsData = [
      { date: new Date('2026-10-15T08:50:00'), startTime: '08:50', service: 'Contrôle périodique', status: 'Terminé' },
      { date: new Date('2026-10-08T08:30:00'), startTime: '08:30', service: 'Contrôle périodique', status: 'Terminé' },
      { date: new Date('2026-09-28T07:40:00'), startTime: '07:40', service: 'Extraction', status: 'Terminé' },
      { date: new Date('2026-09-18T08:10:00'), startTime: '08:10', service: 'Détartrage', status: 'Terminé' },
      { date: new Date('2026-09-08T08:20:00'), startTime: '08:20', service: 'Orthodontie', status: 'Terminé' },
      { date: new Date('2026-09-05T07:10:00'), startTime: '07:10', service: 'Urgence', status: 'Terminé' },
      { date: new Date('2026-08-30T08:30:00'), startTime: '08:30', service: 'Soin / Plombage', status: 'Terminé' },
      { date: new Date(Date.now() + 86400000 * 2), startTime: '10:00', service: 'Contrôle périodique', status: 'Confirmé' }
    ];

    for (const apt of appointmentsData) {
      await Appointment.create({
        patient: p1._id,
        ...apt
      });
    }

    // Prescription for Najlae Amrani (matching video with ACIGAM)
    await Prescription.create({
      patient: p1._id,
      date: new Date('2026-09-10'),
      doctorName: 'Dr. Dentolio',
      items: [
        {
          medicine: 'ACIGAM 250 MG',
          dosage: '250 mg',
          frequency: '2 fois par jour',
          duration: '3 jours',
          instructions: '1 comprimé après les repas matin et soir'
        },
        {
          medicine: 'PARACÉTAMOL 1G',
          dosage: '1000 mg',
          frequency: '3 fois par jour en cas de douleur',
          duration: '4 jours',
          instructions: 'Espacer les prises de 6 heures minimum'
        },
        {
          medicine: 'ELUDRIL BAIN DE BOUCHE',
          dosage: '15 ml',
          frequency: '3 fois par jour',
          duration: '7 jours',
          instructions: 'Bains de bouche après brossage doux'
        }
      ],
      notes: 'Prescription post-extraction canine'
    });

    // 3. Patient 2: Nadir Alaoui (Waiting room in video)
    const p2 = await Patient.create({
      customId: 'P-0002',
      firstName: 'Nadir',
      lastName: 'Alaoui',
      cin: 'BK654321',
      dateOfBirth: new Date('1990-08-14'),
      gender: 'Homme',
      phone: '+212 6 78 90 12 34',
      email: 'nadir.alaoui@hotmail.com',
      address: '45 Boulevard d’Anfa',
      city: 'Casablanca',
      profession: 'Architecte',
      civilStatus: 'Marié(e)',
      mutuelle: {
        provider: 'RMA Watanya',
        affiliationNumber: 'RMA-442190',
        immatriculation: 'IMM-554'
      },
      medicalHistory: {
        allergies: ['Aspirine', 'AINS'],
        chronicDiseases: ['Hypertension'],
        currentMedications: ['Amlodipine 5mg'],
        bleedingDisorders: false,
        pregnant: false,
        notes: 'Attention: Hypertension artérielle modérée contrôlée.'
      },
      tags: ['Urgence', 'Alerte Médicale'],
      financials: {
        totalActs: 1200,
        paidAmount: 800,
        remainingAmount: 400
      }
    });

    // Nadir's treatment
    await Treatment.create({
      patient: p2._id,
      date: new Date(),
      teeth: [46],
      surfaces: ['M', 'O', 'D'],
      actName: 'Dévitalisation et obturation canalaire molaire',
      category: 'Endodontie',
      cost: 1200,
      status: 'En cours',
      color: '#ef4444'
    });

    await Payment.create({
      patient: p2._id,
      amount: 800,
      paymentDate: new Date(),
      method: 'Espèce',
      invoiceNumber: 'FA-2026-00010',
      note: 'Acompte traitement endodontique'
    });

    // Add Nadir Alaoui to the active Waiting Room (matching video screenshot)
    await WaitingQueue.create({
      patient: p2._id,
      motif: 'Urgence / Douleur',
      priority: 'Urgente',
      arrivalTime: new Date(Date.now() - 1000 * 60 * 25), // arrived 25 min ago
      status: 'En Salle',
      notes: 'Douleur aiguë molaire inférieure droite'
    });

    // 4. Patient 3: Karim Bennani
    const p3 = await Patient.create({
      customId: 'P-0003',
      firstName: 'Karim',
      lastName: 'Bennani',
      cin: 'A345981',
      dateOfBirth: new Date('1985-11-20'),
      gender: 'Homme',
      phone: '+212 6 62 11 22 33',
      email: 'karim.bennani@yahoo.fr',
      address: '78 Rue Taha Houcine',
      city: 'Casablanca',
      profession: 'Cadre Bancaire',
      civilStatus: 'Marié(e)',
      mutuelle: {
        provider: 'CNOPS',
        affiliationNumber: 'CN-1908234',
        immatriculation: 'CP-0988'
      },
      medicalHistory: {
        allergies: [],
        chronicDiseases: [],
        currentMedications: [],
        bleedingDisorders: false,
        pregnant: false
      },
      tags: ['Prothèse', 'Esthétique'],
      financials: {
        totalActs: 5000,
        paidAmount: 5000,
        remainingAmount: 0
      }
    });

    await Treatment.create({
      patient: p3._id,
      date: new Date('2026-09-12'),
      teeth: [11, 21],
      surfaces: ['V', 'L'],
      actName: 'Pose de deux couronnes Zircone E-Max',
      category: 'Prothèse fixe',
      cost: 5000,
      status: 'Terminé',
      color: '#3b82f6'
    });

    await Payment.create({
      patient: p3._id,
      amount: 5000,
      paymentDate: new Date('2026-09-12'),
      method: 'Chèque',
      checkNumber: 'CHQ-8899120',
      invoiceNumber: 'FA-2026-00011',
      note: 'Règlement total couronnes zircone'
    });

    // Lab order for Karim Bennani
    await Prothese.create({
      patient: p3._id,
      laboratoryName: 'Laboratoire Dentaire Al-Amal',
      prothesisType: 'Couronne Zircone',
      teeth: [11, 21],
      shade: 'A1',
      sentDate: new Date('2026-09-02'),
      tryInDate: new Date('2026-09-08'),
      deliveryDate: new Date('2026-09-12'),
      costLab: 1800,
      pricePatient: 5000,
      status: 'Posé / Terminé',
      notes: 'Teinte brillante naturelle, patient très satisfait'
    });

    // 5. Patient 4: Fatima Zahra Mansouri
    const p4 = await Patient.create({
      customId: 'P-0004',
      firstName: 'Fatima Zahra',
      lastName: 'Mansouri',
      cin: 'T234908',
      dateOfBirth: new Date('1995-04-18'),
      gender: 'Femme',
      phone: '+212 6 65 44 33 22',
      email: 'fz.mansouri@outlook.com',
      address: '25 Lotissement Californie',
      city: 'Casablanca',
      profession: 'Médecin Généraliste',
      civilStatus: 'Marié(e)',
      mutuelle: {
        provider: 'CNSS',
        affiliationNumber: 'CNSS-8877112',
        immatriculation: 'MAT-332'
      },
      medicalHistory: {
        allergies: ['Iode'],
        chronicDiseases: [],
        currentMedications: [],
        bleedingDisorders: false,
        pregnant: false
      },
      tags: ['Contrôle', 'Blanchiment'],
      financials: {
        totalActs: 2500,
        paidAmount: 2500,
        remainingAmount: 0
      }
    });

    await Treatment.create({
      patient: p4._id,
      date: new Date('2026-10-01'),
      teeth: [11, 12, 13, 21, 22, 23, 31, 32, 33, 41, 42, 43],
      actName: 'Blanchiment dentaire au fauteuil par photo-activation',
      category: 'Esthétique & Blanchiment',
      cost: 2500,
      status: 'Terminé',
      color: '#eab308'
    });

    await Payment.create({
      patient: p4._id,
      amount: 2500,
      paymentDate: new Date('2026-10-01'),
      method: 'Carte Bancaire',
      invoiceNumber: 'FA-2026-00012',
      note: 'Paiement séance blanchiment'
    });

    // Add Patient 4 to Waiting room as normal priority
    await WaitingQueue.create({
      patient: p4._id,
      motif: 'Contrôle périodique',
      priority: 'Normale',
      arrivalTime: new Date(Date.now() - 1000 * 60 * 10),
      status: 'En Salle',
      notes: 'Visite de contrôle 2 semaines après blanchiment'
    });

    // 6. Expenses (Livre de Recettes et Dépenses)
    await Expense.create([
      {
        date: new Date('2026-10-02'),
        title: 'Achat résines composites et adhésifs 3M',
        category: 'Fournitures & Consommables',
        amount: 2800,
        paymentMethod: 'Chèque',
        supplier: 'DentaMed Maroc'
      },
      {
        date: new Date('2026-10-05'),
        title: 'Facture Prothèses Septembre',
        category: 'Laboratoire de prothèse',
        amount: 3200,
        paymentMethod: 'Virement',
        supplier: 'Laboratoire Dentaire Al-Amal'
      },
      {
        date: new Date('2026-10-01'),
        title: 'Loyer Cabinet Médical',
        category: 'Loyer & Charges',
        amount: 6500,
        paymentMethod: 'Virement',
        supplier: 'Propriétaire Immeuble'
      },
      {
        date: new Date('2026-09-25'),
        title: 'Maintenance trimestrielle unité de stérilisation',
        category: 'Maintenance & Équipements',
        amount: 950,
        paymentMethod: 'Espèce',
        supplier: 'TechDent Sarl'
      }
    ]);

    console.log('[Seed] Données insérées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
