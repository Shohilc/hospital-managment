import { useState, useEffect } from 'react';
import { doctorQueries } from '../db/queries';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

const EMPTY = { name:'', specialization:'', department:'', phone:'', email:'', schedule:'', fee:500, status:'Active' };
const SPECS = ['Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','General Medicine','Gynecology','Ophthalmology','ENT','Psychiatry','Radiology','Anesthesiology'];
const DEPTS = ['Heart Care','Brain & Spine','Bone & Joint','Child Care','Skin Care','General','Women Health','Eye Care','ENT','Mental Health','Radiology','Operation Theatre'];

export default function Doctors() {
  const { addToast } = useApp();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => setDoctors(doctorQueries.getAll());
  useEffect(load, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (d) => { setEditing(d); setForm({ ...d }); setModal('edit'); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name || !form.specialization) { addToast('Name and specialization are required', 'error'); return; }
    if (modal === 'add') { doctorQueries.create(form); addToast('Doctor added successfully', 'success'); }
    else { doctorQueries.update(editing.id, form); addToast('Doctor updated', 'success'); }
    load(); close();
  };

  const handleDelete = (d) => {
    if (!confirm(`Remove Dr. ${d.name}?`)) return;
    doctorQueries.delete(d.id);
    addToast('Doctor removed', 'info'); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const specColors = ['blue','teal','purple','green','amber','rose'];
  const getColor = (s) => specColors[SPECS.indexOf(s) % specColors.length] || 'blue';

  return (
    <div>
      <div className="page-header">
        <div><h2>Doctors</h2><p>{doctors.length} registered doctors</p></div>
        <button className="btn btn-primary" onClick={openAdd} id="add-doctor-btn"><MdAdd /> Add Doctor</button>
      </div>

      <div className="filter-bar">
        <input placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:300 }} id="doctor-search" />
      </div>

      <div className="grid-auto" style={{ marginBottom: 16 }}>
        {filtered.map(d => (
          <div key={d.id} className="card" style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <div className="avatar" style={{ width:48, height:48, fontSize:18, background:'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
                {d.name.split(' ').map(n => n[0]).slice(0,2).join('')}
              </div>
              <span className={`badge badge-${d.status === 'Active' ? 'green' : 'amber'}`}>{d.status}</span>
            </div>
            <h4 style={{ fontWeight:700, marginBottom:4 }}>{d.name}</h4>
            <span className={`badge badge-${getColor(d.specialization)}`} style={{ marginBottom:10, display:'inline-block' }}>{d.specialization}</span>
            <div style={{ fontSize:12, color:'var(--text-muted)', display:'flex', flexDirection:'column', gap:3 }}>
              <span>🏢 {d.department}</span>
              <span>📞 {d.phone}</span>
              <span>🕐 {d.schedule}</span>
              <span style={{ color:'var(--green)', fontWeight:600 }}>₹{d.fee} / visit</span>
            </div>
            <div style={{ display:'flex', gap:6, marginTop:12 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex:1 }} onClick={() => openEdit(d)}><MdEdit /> Edit</button>
              <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(d)}><MdDelete /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add New Doctor' : 'Edit Doctor'} onClose={close}
          footer={<>
            <button className="btn btn-secondary" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Add Doctor' : 'Save Changes'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Full Name *</label>
              <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Dr. Full Name" />
            </div>
            <div className="form-group">
              <label>Specialization *</label>
              <select value={form.specialization} onChange={e => f('specialization', e.target.value)}>
                <option value="">Select...</option>
                {SPECS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={form.department} onChange={e => f('department', e.target.value)}>
                <option value="">Select...</option>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="Phone number" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="Email" />
            </div>
            <div className="form-group span-2">
              <label>Schedule</label>
              <input value={form.schedule} onChange={e => f('schedule', e.target.value)} placeholder="e.g. Mon-Fri 9AM-5PM" />
            </div>
            <div className="form-group">
              <label>Consultation Fee (₹)</label>
              <input type="number" value={form.fee} onChange={e => f('fee', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => f('status', e.target.value)}>
                <option>Active</option><option>On Leave</option><option>Inactive</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
