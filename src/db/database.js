// database.js — sql.js initialization, schema creation, and seed data

let db = null;

export async function initDB() {
  if (db) return db;

  const SQL = await window.initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
  });

  const saved = localStorage.getItem('hospira_db');
  if (saved) {
    const buf = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
    createSchema();
    seedData();
    saveDB();
  }

  return db;
}

export function getDB() { return db; }

export function saveDB() {
  if (!db) return;
  const data = db.export();
  const b64 = btoa(String.fromCharCode(...data));
  localStorage.setItem('hospira_db', b64);
}

function createSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, email TEXT UNIQUE, password TEXT, role TEXT
    );
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, age INTEGER, gender TEXT, blood_group TEXT,
      phone TEXT, email TEXT, address TEXT, medical_history TEXT,
      status TEXT DEFAULT 'Active', created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, specialization TEXT, department TEXT,
      phone TEXT, email TEXT, schedule TEXT, fee REAL DEFAULT 500,
      status TEXT DEFAULT 'Active'
    );
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER, doctor_id INTEGER,
      date TEXT, time TEXT, reason TEXT,
      status TEXT DEFAULT 'Scheduled',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(doctor_id) REFERENCES doctors(id)
    );
    CREATE TABLE IF NOT EXISTS beds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ward TEXT, bed_number TEXT,
      status TEXT DEFAULT 'Available',
      patient_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, category TEXT, stock INTEGER DEFAULT 0,
      unit TEXT, price REAL, expiry_date TEXT
    );
    CREATE TABLE IF NOT EXISTS lab_tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER, test_name TEXT, ordered_by INTEGER,
      status TEXT DEFAULT 'Pending', result TEXT,
      ordered_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER, consultation_fee REAL DEFAULT 0,
      medicine_fee REAL DEFAULT 0, lab_fee REAL DEFAULT 0,
      bed_fee REAL DEFAULT 0, total REAL DEFAULT 0,
      status TEXT DEFAULT 'Pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, role TEXT, department TEXT,
      phone TEXT, email TEXT, shift TEXT, status TEXT DEFAULT 'Active'
    );
  `);
}

function seedData() {
  // Users
  db.run(`INSERT INTO users(name,email,password,role) VALUES
    ('Dr. Admin','admin@hospira.com','admin123','Admin'),
    ('Dr. Sarah Lee','doctor@hospira.com','doctor123','Doctor'),
    ('Reception','reception@hospira.com','recep123','Receptionist')`);

  // Doctors
  db.run(`INSERT INTO doctors(name,specialization,department,phone,email,schedule,fee) VALUES
    ('Dr. James Wilson','Cardiology','Heart Care','9876543210','james@hospira.com','Mon-Fri 9AM-5PM',800),
    ('Dr. Sarah Lee','Neurology','Brain & Spine','9876543211','sarah@hospira.com','Mon-Wed-Fri 10AM-4PM',1000),
    ('Dr. Michael Brown','Orthopedics','Bone & Joint','9876543212','michael@hospira.com','Tue-Thu 9AM-3PM',700),
    ('Dr. Priya Sharma','Pediatrics','Child Care','9876543213','priya@hospira.com','Mon-Sat 8AM-2PM',600),
    ('Dr. Robert Chen','Dermatology','Skin Care','9876543214','robert@hospira.com','Wed-Fri 11AM-5PM',650)`);

  // Patients
  db.run(`INSERT INTO patients(name,age,gender,blood_group,phone,email,address,medical_history,status) VALUES
    ('Alice Johnson',34,'Female','A+','9876500001','alice@gmail.com','123 Main St','Hypertension','Active'),
    ('Bob Smith',52,'Male','O-','9876500002','bob@gmail.com','456 Oak Ave','Diabetes Type 2','Active'),
    ('Carol Davis',28,'Female','B+','9876500003','carol@gmail.com','789 Pine Rd','None','Discharged'),
    ('David Lee',67,'Male','AB+','9876500004','david@gmail.com','321 Elm St','Arthritis, Hypertension','Active'),
    ('Emma White',45,'Female','A-','9876500005','emma@gmail.com','654 Cedar Ln','Asthma','Active')`);

  // Appointments
  const today = new Date().toISOString().split('T')[0];
  db.run(`INSERT INTO appointments(patient_id,doctor_id,date,time,reason,status) VALUES
    (1,1,'${today}','09:00','Chest pain follow-up','Scheduled'),
    (2,4,'${today}','10:30','Blood sugar check','Scheduled'),
    (3,2,'${today}','11:00','Migraine consultation','Completed'),
    (4,3,'${today}','14:00','Knee pain','Scheduled'),
    (5,1,'${today}','15:30','Routine checkup','Scheduled')`);

  // Beds
  const wards = ['General','ICU','Pediatrics','Maternity','Orthopedics'];
  let vals = [];
  wards.forEach(w => {
    for (let i = 1; i <= 6; i++) {
      const status = i <= 2 ? 'Occupied' : 'Available';
      const pid = (w === 'General' && i === 1) ? 1 : (w === 'ICU' && i === 1) ? 2 : 'NULL';
      vals.push(`('${w}','${w[0]}${i}','${status}',${pid})`);
    }
  });
  db.run(`INSERT INTO beds(ward,bed_number,status,patient_id) VALUES ${vals.join(',')}`);

  // Medicines
  db.run(`INSERT INTO medicines(name,category,stock,unit,price,expiry_date) VALUES
    ('Paracetamol 500mg','Analgesic',500,'Tablet',2.5,'2026-12-31'),
    ('Amoxicillin 250mg','Antibiotic',200,'Capsule',8.0,'2025-11-30'),
    ('Metformin 500mg','Antidiabetic',150,'Tablet',5.0,'2026-06-30'),
    ('Atorvastatin 10mg','Cardiovascular',80,'Tablet',12.0,'2025-08-31'),
    ('Omeprazole 20mg','Gastrointestinal',300,'Capsule',6.5,'2026-09-30'),
    ('Ibuprofen 400mg','NSAID',18,'Tablet',4.0,'2025-12-31'),
    ('Cetirizine 10mg','Antihistamine',250,'Tablet',3.5,'2026-03-31')`);

  // Lab tests
  db.run(`INSERT INTO lab_tests(patient_id,test_name,ordered_by,status,result) VALUES
    (1,1,'Complete Blood Count','Pending',''),
    (2,2,'HbA1c Test','Completed','7.2%'),
    (3,1,'MRI Brain','Completed','Normal'),
    (4,3,'X-Ray Knee','Completed','Moderate arthritis')`);

  // Bills
  db.run(`INSERT INTO bills(patient_id,consultation_fee,medicine_fee,lab_fee,bed_fee,total,status) VALUES
    (1,800,250,500,2000,3550,'Pending'),
    (2,600,350,200,0,1150,'Paid'),
    (3,1000,150,800,3000,4950,'Paid'),
    (4,700,400,300,0,1400,'Pending')`);

  // Staff
  db.run(`INSERT INTO staff(name,role,department,phone,email,shift,status) VALUES
    ('Nurse Mary','Head Nurse','General Ward','9876600001','mary@hospira.com','Morning','Active'),
    ('Nurse John','Nurse','ICU','9876600002','john@hospira.com','Night','Active'),
    ('Tom Admin','Admin Staff','Reception','9876600003','tom@hospira.com','Morning','Active'),
    ('Lab Tech Raj','Lab Technician','Laboratory','9876600004','raj@hospira.com','Morning','Active'),
    ('Pharmacy Rita','Pharmacist','Pharmacy','9876600005','rita@hospira.com','Evening','Active')`);
}
