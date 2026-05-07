import { useState, useEffect } from 'react';
import { patientQueries } from '../db/queries';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

const EMPTY = { name:'', age:'', gender:'Female', blood_group:'A+', phone:'', email:'', address:'', medical_history:'', status:'Active' };
const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const GENDERS = ['Female','Male','Other'];
const STATUSES = ['Active','Admitted','Discharged'];

export default function Patients() {
  const { addToast } = useApp();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => setPatients(patientQueries.getAll());
  useEffect(load, []);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) || p.blood_group.includes(search)
  );

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setModal('edit'); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name || !form.age || !form.phone) { addToast('Name, age and phone are required', 'error'); return; }
    if (modal === 'add') { patientQueries.create(form); addToast('Patient registered successfully', 'success'); }
    else { patientQueries.update(editing.id, form); addToast('Patient updated', 'success'); }
    load(); close();
  };

  const handleDelete = (p) => {
    if (!confirm(`Delete patient "${p.name}"?`)) return;
    patientQueries.delete(p.id);
    addToast('Patient deleted', 'info'); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const statusColor = { Active:'green', Admitted:'blue', Discharged:'amber' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Patients</h2>
          <p>{patients.length} total patients registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="add-patient-btn">
          <MdAdd /> Add Patient
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-bar" style={{ flex:1, maxWidth:340 }}>
          <MdSearch style={{ fontSize:18 }} />
          <input placeholder="Search by name, phone, blood group..." value={search} onChange={e => setSearch(e.target.value)} id="patient-search" />
        </div>
      </div>

      <div className="card" style={{ padding:0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Age/Gender</th><th>Blood Group</th>
                <th>Phone</th><th>Medical History</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>No patients found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ color:'var(--text-muted)' }}>#{p.id}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar">{p.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight:600 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.age} / {p.gender}</td>
                  <td><span className="badge badge-rose">{p.blood_group}</span></td>
                  <td>{p.phone}</td>
                  <td style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'var(--text-muted)' }}>{p.medical_history || '—'}</td>
                  <td><span className={`badge badge-${statusColor[p.status] || 'blue'}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(p)} title="Edit"><MdEdit /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p)} title="Delete"><MdDelete /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Register New Patient' : 'Edit Patient'} onClose={close}
          footer={<>
            <button className="btn btn-secondary" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {modal === 'add' ? 'Register Patient' : 'Save Changes'}
            </button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Full Name *</label>
              <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Patient full name" />
            </div>
            <div className="form-group">
              <label>Age *</label>
              <input type="number" value={form.age} onChange={e => f('age', e.target.value)} placeholder="Age" min={0} max={150} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={e => f('gender', e.target.value)}>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select value={form.blood_group} onChange={e => f('blood_group', e.target.value)}>
                {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="Phone number" />
            </div>
            <div className="form-group span-2">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="Email address" />
            </div>
            <div className="form-group span-2">
              <label>Address</label>
              <input value={form.address} onChange={e => f('address', e.target.value)} placeholder="Full address" />
            </div>
            <div className="form-group span-2">
              <label>Medical History</label>
              <textarea value={form.medical_history} onChange={e => f('medical_history', e.target.value)} placeholder="Known conditions, allergies..." />
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
