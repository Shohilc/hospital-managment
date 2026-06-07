-- 1. Create the database
CREATE DATABASE IF NOT EXISTS hospital;
USE hospital;

-- 2. Create the Patients table
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

-- 3. Create the Doctors table
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

-- 4. Create the Staff table
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

-- Optional: Insert some initial seed data
INSERT INTO patients (name, age, gender, phone, blood_group) VALUES 
('Alice Johnson', 34, 'Female', '9876500001', 'A+'),
('Bob Smith', 52, 'Male', '9876500002', 'O-');

INSERT INTO doctors (name, specialization, department, fee) VALUES 
('Dr. James Wilson', 'Cardiology', 'Heart Care', 800),
('Dr. Sarah Lee', 'Neurology', 'Brain & Spine', 1000);

INSERT INTO staff (name, role, department, shift) VALUES 
('Nurse Mary', 'Head Nurse', 'General Ward', 'Morning'),
('Tom Admin', 'Receptionist', 'Front Desk', 'Morning');
