// queries.js — SQL query helpers for all modules
import { getDB, saveDB } from './database';

// ─── Generic helpers ───────────────────────────────────────────
function execQuery(sql, params = []) {
  const db = getDB();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function run(sql, params = []) {
  const db = getDB();
  db.run(sql, params);
  saveDB();
}

// ─── AUTH ──────────────────────────────────────────────────────
export const authQueries = {
  login: (email, password) =>
    execQuery('SELECT * FROM users WHERE email=? AND password=?', [email, password])[0] || null,
  emailExists: (email) =>
    execQuery('SELECT id FROM users WHERE email=?', [email]).length > 0,
  register: (name, email, password, role) => {
    run('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)', [name, email, password, role]);
  }
};

// ─── PATIENTS ──────────────────────────────────────────────────
export const patientQueries = {
  getAll: () => execQuery('SELECT * FROM patients ORDER BY id DESC'),
  getById: id => execQuery('SELECT * FROM patients WHERE id=?', [id])[0],
  create: (p) => {
    run(`INSERT INTO patients(name,age,gender,blood_group,phone,email,address,medical_history,status)
         VALUES(?,?,?,?,?,?,?,?,?)`,
      [p.name, p.age, p.gender, p.blood_group, p.phone, p.email, p.address, p.medical_history, p.status || 'Active']);
  },
  update: (id, p) => {
    run(`UPDATE patients SET name=?,age=?,gender=?,blood_group=?,phone=?,email=?,address=?,medical_history=?,status=? WHERE id=?`,
      [p.name, p.age, p.gender, p.blood_group, p.phone, p.email, p.address, p.medical_history, p.status, id]);
  },
  delete: id => run('DELETE FROM patients WHERE id=?', [id]),
  count: () => execQuery('SELECT COUNT(*) as n FROM patients')[0]?.n || 0
};

// ─── DOCTORS ───────────────────────────────────────────────────
export const doctorQueries = {
  getAll: () => execQuery('SELECT * FROM doctors ORDER BY id DESC'),
  getById: id => execQuery('SELECT * FROM doctors WHERE id=?', [id])[0],
  create: (d) => {
    run(`INSERT INTO doctors(name,specialization,department,phone,email,schedule,fee,status)
         VALUES(?,?,?,?,?,?,?,?)`,
      [d.name, d.specialization, d.department, d.phone, d.email, d.schedule, d.fee, d.status || 'Active']);
  },
  update: (id, d) => {
    run(`UPDATE doctors SET name=?,specialization=?,department=?,phone=?,email=?,schedule=?,fee=?,status=? WHERE id=?`,
      [d.name, d.specialization, d.department, d.phone, d.email, d.schedule, d.fee, d.status, id]);
  },
  delete: id => run('DELETE FROM doctors WHERE id=?', [id]),
  count: () => execQuery('SELECT COUNT(*) as n FROM doctors')[0]?.n || 0
};

// ─── APPOINTMENTS ──────────────────────────────────────────────
export const appointmentQueries = {
  getAll: () => execQuery(`
    SELECT a.*, p.name as patient_name, d.name as doctor_name, d.specialization
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN doctors d ON a.doctor_id = d.id
    ORDER BY a.date DESC, a.time DESC`),
  getToday: () => {
    const today = new Date().toISOString().split('T')[0];
    return execQuery(`
      SELECT a.*, p.name as patient_name, d.name as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.date=? ORDER BY a.time`, [today]);
  },
  create: (a) => {
    run(`INSERT INTO appointments(patient_id,doctor_id,date,time,reason,status)
         VALUES(?,?,?,?,?,?)`,
      [a.patient_id, a.doctor_id, a.date, a.time, a.reason, a.status || 'Scheduled']);
  },
  update: (id, a) => {
    run(`UPDATE appointments SET patient_id=?,doctor_id=?,date=?,time=?,reason=?,status=? WHERE id=?`,
      [a.patient_id, a.doctor_id, a.date, a.time, a.reason, a.status, id]);
  },
  delete: id => run('DELETE FROM appointments WHERE id=?', [id]),
  countToday: () => {
    const today = new Date().toISOString().split('T')[0];
    return execQuery('SELECT COUNT(*) as n FROM appointments WHERE date=?', [today])[0]?.n || 0;
  }
};

// ─── BEDS ──────────────────────────────────────────────────────
export const bedQueries = {
  getAll: () => execQuery(`
    SELECT b.*, p.name as patient_name
    FROM beds b LEFT JOIN patients p ON b.patient_id=p.id ORDER BY b.ward, b.bed_number`),
  getByWard: ward => execQuery(`
    SELECT b.*, p.name as patient_name
    FROM beds b LEFT JOIN patients p ON b.patient_id=p.id WHERE b.ward=?`, [ward]),
  updateStatus: (id, status, patientId) =>
    run('UPDATE beds SET status=?, patient_id=? WHERE id=?', [status, patientId || null, id]),
  countAvailable: () => execQuery("SELECT COUNT(*) as n FROM beds WHERE status='Available'")[0]?.n || 0
};

// ─── MEDICINES ─────────────────────────────────────────────────
export const medicineQueries = {
  getAll: () => execQuery('SELECT * FROM medicines ORDER BY name'),
  getLowStock: () => execQuery('SELECT * FROM medicines WHERE stock < 30 ORDER BY stock'),
  create: (m) => {
    run(`INSERT INTO medicines(name,category,stock,unit,price,expiry_date) VALUES(?,?,?,?,?,?)`,
      [m.name, m.category, m.stock, m.unit, m.price, m.expiry_date]);
  },
  update: (id, m) => {
    run(`UPDATE medicines SET name=?,category=?,stock=?,unit=?,price=?,expiry_date=? WHERE id=?`,
      [m.name, m.category, m.stock, m.unit, m.price, m.expiry_date, id]);
  },
  delete: id => run('DELETE FROM medicines WHERE id=?', [id])
};

// ─── LAB TESTS ─────────────────────────────────────────────────
export const labQueries = {
  getAll: () => execQuery(`
    SELECT l.*, p.name as patient_name
    FROM lab_tests l LEFT JOIN patients p ON l.patient_id=p.id ORDER BY l.id DESC`),
  create: (l) => {
    run(`INSERT INTO lab_tests(patient_id,test_name,ordered_by,status,result) VALUES(?,?,?,?,?)`,
      [l.patient_id, l.test_name, l.ordered_by, l.status || 'Pending', l.result || '']);
  },
  update: (id, l) => {
    run(`UPDATE lab_tests SET status=?,result=? WHERE id=?`, [l.status, l.result, id]);
  },
  delete: id => run('DELETE FROM lab_tests WHERE id=?', [id])
};

// ─── BILLING ───────────────────────────────────────────────────
export const billQueries = {
  getAll: () => execQuery(`
    SELECT b.*, p.name as patient_name
    FROM bills b LEFT JOIN patients p ON b.patient_id=p.id ORDER BY b.id DESC`),
  create: (b) => {
    const total = (+b.consultation_fee || 0) + (+b.medicine_fee || 0) + (+b.lab_fee || 0) + (+b.bed_fee || 0);
    run(`INSERT INTO bills(patient_id,consultation_fee,medicine_fee,lab_fee,bed_fee,total,status)
         VALUES(?,?,?,?,?,?,?)`,
      [b.patient_id, b.consultation_fee, b.medicine_fee, b.lab_fee, b.bed_fee, total, b.status || 'Pending']);
  },
  update: (id, b) => {
    const total = (+b.consultation_fee || 0) + (+b.medicine_fee || 0) + (+b.lab_fee || 0) + (+b.bed_fee || 0);
    run(`UPDATE bills SET consultation_fee=?,medicine_fee=?,lab_fee=?,bed_fee=?,total=?,status=? WHERE id=?`,
      [b.consultation_fee, b.medicine_fee, b.lab_fee, b.bed_fee, total, b.status, id]);
  },
  delete: id => run('DELETE FROM bills WHERE id=?', [id]),
  totalRevenue: () => execQuery("SELECT SUM(total) as n FROM bills WHERE status='Paid'")[0]?.n || 0
};

// ─── STAFF ─────────────────────────────────────────────────────
export const staffQueries = {
  getAll: () => execQuery('SELECT * FROM staff ORDER BY id DESC'),
  create: (s) => {
    run(`INSERT INTO staff(name,role,department,phone,email,shift,status) VALUES(?,?,?,?,?,?,?)`,
      [s.name, s.role, s.department, s.phone, s.email, s.shift, s.status || 'Active']);
  },
  update: (id, s) => {
    run(`UPDATE staff SET name=?,role=?,department=?,phone=?,email=?,shift=?,status=? WHERE id=?`,
      [s.name, s.role, s.department, s.phone, s.email, s.shift, s.status, id]);
  },
  delete: id => run('DELETE FROM staff WHERE id=?', [id])
};
