const mysql = require('mysql2/promise');

async function initializeDB() {
  // Connect to MySQL server (assuming root with no password)
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    console.log('Connected to MySQL server successfully.');
  } catch (error) {
    console.error('Failed to connect to MySQL server. Please ensure MySQL is running, and the user is root with no password.');
    console.error(error.message);
    process.exit(1);
  }

  try {
    // Create database
    console.log('Creating hospital database if it does not exist...');
    await connection.query('CREATE DATABASE IF NOT EXISTS hospital;');
    console.log('Database `hospital` created or already exists.');

    // Switch to hospital database
    await connection.query('USE hospital;');

    // Create tables
    console.log('Creating tables...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT,
        gender VARCHAR(50),
        blood_group VARCHAR(10),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        medical_history TEXT,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255),
        department VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        schedule TEXT,
        fee DECIMAL(10, 2) DEFAULT 500,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        department VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        shift VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Patient',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables for patients, doctors, staff, and users created successfully!');

    // Add some test data
    console.log('Inserting test data...');
    
    // Seed Patients
    await connection.query(`
      INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history)
      VALUES 
      ('Alice Johnson', 34, 'Female', 'A+', '9876500001', 'alice@gmail.com', '123 Main St', 'Hypertension'),
      ('Bob Smith', 52, 'Male', 'O-', '9876500002', 'bob@gmail.com', '456 Oak Ave', 'Diabetes Type 2')
      ON DUPLICATE KEY UPDATE name=name;
    `);

    // Seed Doctors
    await connection.query(`
      INSERT INTO doctors (name, specialization, department, phone, email, schedule, fee)
      VALUES 
      ('Dr. James Wilson', 'Cardiology', 'Heart Care', '9876543210', 'james@hospira.com', 'Mon-Fri 9AM-5PM', 800),
      ('Dr. Sarah Lee', 'Neurology', 'Brain & Spine', '9876543211', 'sarah@hospira.com', 'Mon-Wed-Fri 10AM-4PM', 1000)
      ON DUPLICATE KEY UPDATE name=name;
    `);

    // Seed Staff
    await connection.query(`
      INSERT INTO staff (name, role, department, phone, email, shift)
      VALUES 
      ('Nurse Mary', 'Head Nurse', 'General Ward', '9876600001', 'mary@hospira.com', 'Morning'),
      ('Tom Admin', 'Receptionist', 'Front Desk', '9876600003', 'tom@hospira.com', 'Morning')
      ON DUPLICATE KEY UPDATE name=name;
    `);

    // Seed Users (default login accounts)
    await connection.query(`
      INSERT INTO users (name, email, password, role)
      VALUES 
      ('Dr. Admin', 'admin@hospira.com', 'admin123', 'Admin'),
      ('Dr. Admin', 'admin@medicore.com', 'admin123', 'Admin'),
      ('Dr. Sarah Lee', 'doctor@hospira.com', 'doctor123', 'Doctor'),
      ('Reception', 'reception@hospira.com', 'recep123', 'Receptionist')
      ON DUPLICATE KEY UPDATE name=name;
    `);
    
    console.log('Test data inserted successfully!');
    
    await connection.end();
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Error executing database queries:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
}

initializeDB();
