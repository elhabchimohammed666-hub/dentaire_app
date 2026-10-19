const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/treatments', require('./routes/treatmentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/waiting', require('./routes/waitingRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/protheses', require('./routes/protheseRoutes'));
app.use('/api/settings', require('./routes/clinicRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Dentolio API',
    status: 'Running',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Dentolio API Serveur démarré sur le port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
