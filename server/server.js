const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// ---------------- Auth / Login ----------------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ---------------- Register Patient ----------------
app.post('/api/register/patient', async (req, res) => {
  const { name, email, phone, password, gender, blood_group, address, medical_history, age } = req.body;
  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Insert into patients table
    const [patientResult] = await db.query(
      'INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, age || null, gender, blood_group || 'Unknown', phone, email, address, medical_history || 'None']
    );

    // Create login account in users table
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, 'Patient']
    );

    res.status(201).json({ id: patientResult.insertId, message: 'Patient registered successfully' });
  } catch (err) {
    console.error('Error registering patient:', err);
    res.status(500).json({ error: 'Failed to register patient' });
  }
});

// ---------------- Register Doctor ----------------
app.post('/api/register/doctor', async (req, res) => {
  const { name, email, phone, password, specialization, department, schedule, fee } = req.body;
  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Insert into doctors table
    const [doctorResult] = await db.query(
      'INSERT INTO doctors (name, specialization, department, phone, email, schedule, fee) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, specialization, department || specialization, phone, email, schedule, fee || 500]
    );

    // Create login account in users table
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, 'Doctor']
    );

    res.status(201).json({ id: doctorResult.insertId, message: 'Doctor registered successfully' });
  } catch (err) {
    console.error('Error registering doctor:', err);
    res.status(500).json({ error: 'Failed to register doctor' });
  }
});

// ---------------- Patients (CRUD) ----------------
app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.post('/api/patients', async (req, res) => {
  const { name, age, gender, blood_group, phone, email, address, medical_history } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, age, gender, blood_group, phone, email, address, medical_history]
    );
    res.status(201).json({ id: result.insertId, message: 'Patient created successfully' });
  } catch (err) {
    console.error('Error creating patient:', err);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// ---------------- Doctors (CRUD) ----------------
app.get('/api/doctors', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctors ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

app.post('/api/doctors', async (req, res) => {
  const { name, specialization, department, phone, email, schedule, fee } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO doctors (name, specialization, department, phone, email, schedule, fee) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, specialization, department, phone, email, schedule, fee]
    );
    res.status(201).json({ id: result.insertId, message: 'Doctor created successfully' });
  } catch (err) {
    console.error('Error creating doctor:', err);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// ---------------- Staff (CRUD) ----------------
app.get('/api/staff', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM staff ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

app.post('/api/staff', async (req, res) => {
  const { name, role, department, phone, email, shift } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO staff (name, role, department, phone, email, shift) VALUES (?, ?, ?, ?, ?, ?)',
      [name, role, department, phone, email, shift]
    );
    res.status(201).json({ id: result.insertId, message: 'Staff created successfully' });
  } catch (err) {
    console.error('Error creating staff:', err);
    res.status(500).json({ error: 'Failed to create staff' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Hospira Backend API running on port ${PORT}`);
});
