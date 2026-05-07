import { useState, useEffect } from 'react';
import { appointmentQueries, patientQueries, doctorQueries } from '../db/queries';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

const EMPTY = { patient_id:'', doctor_id:'', date:'', time:'', reason:'', status:'Scheduled' };
const STATUSES = ['Scheduled','Completed','Cancelled'];
const TIMES = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

export default function Appointments() {
  const { addToast } = useApp();
  const [appts, setAppts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState({ status:'', date:'' });
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => { setAppts(appointmentQueries.getAll()); setPatients(patientQueries.getAll()); setDoctors(doctorQueries.getAll()); };
  useEffect(load, []);

  const filtered = appts.filter(a =>
    (!filter.status || a.status === filter.status) &&
    (!filter.date || a.date === filter.date)
  );

  const openAdd = () => { setForm({ ...EMPTY, date: new Date().toISOString().split('T')[0] }); setModal('add'); };
  const openEdit = (a) => { setEditing(a); setForm({ patient_id:a.patient_id, doctor_id:a.doctor_id, date:a.date, time:a.time, reason:a.reason, status:a.status }); setModal('edit'); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.patient_id || !form.doctor_id || !form.date || !form.time) { addToast('Patient, doctor, date & time are required', 'error'); return; }
    if (modal === 'add') { appointmentQueries.create(form); addToast('Appointment booked', 'success'); }
    else { appointmentQueries.update(editing.id, form); addToast('Appointment updated', 'success'); }
    load(); close();
  };

  const handleDelete = (a) => {
    if (!confirm('Cancel this appointment?')) return;
    appointmentQueries.delete(a.id);
    addToast('Appointment cancelled', 'info'); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const statusColors = { Scheduled:'blue', Completed:'green', Cancelled:'rose' };

  return (
    <div>
      <div className="page-header">
        <div><h2>Appointments</h2><p>{appts.length} total appointments</p></div>
        <button className="btn btn-primary" onClick={openAdd} id="add-appointment-btn"><MdAdd /> Book Appointment</button>
      </div>

      <div className="filter-bar">
        <select value={filter.status} onChange={e => setFilter(p => ({ ...p, status:e.target.value }))} id="appt-status-filter">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="date" value={filter.date} onChange={e => setFilter(p => ({ ...p, date:e.target.value }))} id="appt-date-filter" />
        <button className="btn btn-secondary btn-sm" onClick={() => setFilter({ status:'', date:'' })}>Clear</button>
      </div>

      <div className="card" style={{ padding:0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8} style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>No appointments found</td></tr>
                : filtered.map(a => (
                  <tr key={a.id}>
                    <td style={{ color:'var(--text-muted)' }}>#{a.id}</td>
                    <td><div style={{ fontWeight:600 }}>{a.patient_name}</div></td>
                    <td>
                      <div style={{ fontWeight:600 }}>{a.doctor_name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{a.specialization}</div>
                    </td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td style={{ color:'var(--text-muted)' }}>{a.reason}</td>
                    <td><span className={`badge badge-${statusColors[a.status] || 'blue'}`}>{a.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(a)}><MdEdit /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(a)}><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Book New Appointment' : 'Edit Appointment'} onClose={close}
          footer={<>
            <button className="btn btn-secondary" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Book' : 'Save'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Patient *</label>
              <select value={form.patient_id} onChange={e => f('patient_id', e.target.value)}>
                <option value="">Select patient...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group span-2">
              <label>Doctor *</label>
              <select value={form.doctor_id} onChange={e => f('doctor_id', e.target.value)}>
                <option value="">Select doctor...</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={e => f('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <select value={form.time} onChange={e => f('time', e.target.value)}>
                <option value="">Select time...</option>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group span-2">
              <label>Reason</label>
              <input value={form.reason} onChange={e => f('reason', e.target.value)} placeholder="Reason for visit" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => f('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
