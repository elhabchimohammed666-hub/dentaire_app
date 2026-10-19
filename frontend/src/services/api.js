const API_BASE = '/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur requête: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const api = {
  // Patients
  getPatients: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/patients${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },
  getPatientById: async (id) => {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    return handleResponse(res);
  },
  createPatient: async (data) => {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updatePatient: async (id, data) => {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deletePatient: async (id) => {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Treatments
  getTreatmentsByPatient: async (patientId) => {
    const res = await fetch(`${API_BASE}/treatments/patient/${patientId}`);
    return handleResponse(res);
  },
  createTreatment: async (data) => {
    const res = await fetch(`${API_BASE}/treatments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateTreatment: async (id, data) => {
    const res = await fetch(`${API_BASE}/treatments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteTreatment: async (id) => {
    const res = await fetch(`${API_BASE}/treatments/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Payments
  getPaymentsByPatient: async (patientId) => {
    const res = await fetch(`${API_BASE}/payments/patient/${patientId}`);
    return handleResponse(res);
  },
  getRecentPayments: async () => {
    const res = await fetch(`${API_BASE}/payments/recent`);
    return handleResponse(res);
  },
  createPayment: async (data) => {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deletePayment: async (id) => {
    const res = await fetch(`${API_BASE}/payments/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Appointments
  getAppointments: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/appointments${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },
  getAppointmentsByPatient: async (patientId) => {
    const res = await fetch(`${API_BASE}/appointments/patient/${patientId}`);
    return handleResponse(res);
  },
  createAppointment: async (data) => {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateAppointment: async (id, data) => {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteAppointment: async (id) => {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Waiting Room
  getWaitingQueue: async () => {
    const res = await fetch(`${API_BASE}/waiting`);
    return handleResponse(res);
  },
  addToWaitingQueue: async (data) => {
    const res = await fetch(`${API_BASE}/waiting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateWaitingStatus: async (id, data) => {
    const res = await fetch(`${API_BASE}/waiting/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  removeFromWaitingQueue: async (id) => {
    const res = await fetch(`${API_BASE}/waiting/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
  clearWaitingQueue: async () => {
    const res = await fetch(`${API_BASE}/waiting/clear/all`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Prescriptions
  getPrescriptionsByPatient: async (patientId) => {
    const res = await fetch(`${API_BASE}/prescriptions/patient/${patientId}`);
    return handleResponse(res);
  },
  createPrescription: async (data) => {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deletePrescription: async (id) => {
    const res = await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Expenses & Finance
  getExpenses: async () => {
    const res = await fetch(`${API_BASE}/expenses`);
    return handleResponse(res);
  },
  getFinanceSummary: async () => {
    const res = await fetch(`${API_BASE}/expenses/summary`);
    return handleResponse(res);
  },
  createExpense: async (data) => {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteExpense: async (id) => {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Protheses
  getProtheses: async () => {
    const res = await fetch(`${API_BASE}/protheses`);
    return handleResponse(res);
  },
  getProthesesByPatient: async (patientId) => {
    const res = await fetch(`${API_BASE}/protheses/patient/${patientId}`);
    return handleResponse(res);
  },
  createProthese: async (data) => {
    const res = await fetch(`${API_BASE}/protheses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateProthese: async (id, data) => {
    const res = await fetch(`${API_BASE}/protheses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse(res);
  },
  updateSettings: async (data) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  }
};
