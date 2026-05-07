import { useState, useEffect } from 'react';
import { staffQueries } from '../db/queries';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

const EMPTY = { name:'', role:'', department:'', phone:'', email:'', shift:'Morning', status:'Active' };
const ROLES = ['Head Nurse','Nurse','Admin Staff','Lab Technician','Pharmacist','Receptionist','Security','Housekeeping','Ambulance Driver'];
const DEPTS = ['General Ward','ICU','Pediatrics','Maternity','Orthopedics','Laboratory','Pharmacy','Reception','Emergency','Radiology'];
const SHIFTS = ['Morning','Afternoon','Evening','Night'];

export default function Staff() {
  const { addToast } = useApp();
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => setStaff(staffQueries.getAll());
  useEffect(load, []);

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s }); setModal('edit'); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name || !form.role) { addToast('Name and role are required', 'error'); return; }
    if (modal === 'add') { staffQueries.create(form); addToast('Staff added', 'success'); }
    else { staffQueries.update(editing.id, form); addToast('Staff updated', 'success'); }
    load(); close();
  };

  const handleDelete = (s) => {
    if (!confirm(`Remove ${s.name}?`)) return;
    staffQueries.delete(s.id);
    addToast('Staff removed', 'info'); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const shiftColor = { Morning:'amber', Afternoon:'teal', Evening:'purple', Night:'blue' };

  return (
    <div>
      <div className="page-header">
        <div><h2>Staff Management</h2><p>{staff.length} staff members</p></div>
        <button className="btn btn-primary" onClick={openAdd} id="add-staff-btn"><MdAdd /> Add Staff</button>
      </div>

      <div className="filter-bar">
        <input placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:300 }} id="staff-search" />
      </div>

      <div className="card" style={{ padding:0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Role</th><th>Department</th><th>Phone</th><th>Shift</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8} style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>No staff found</td></tr>
                : filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ color:'var(--text-muted)' }}>#{s.id}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="avatar">{s.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight:600 }}>{s.name}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{s.role}</span></td>
                    <td style={{ color:'var(--text-muted)' }}>{s.department}</td>
                    <td>{s.phone}</td>
                    <td><span className={`badge badge-${shiftColor[s.shift] || 'blue'}`}>{s.shift}</span></td>
                    <td><span className={`badge badge-${s.status === 'Active' ? 'green' : 'rose'}`}>{s.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(s)}><MdEdit /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(s)}><MdDelete /></button>
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
        <Modal title={modal === 'add' ? 'Add Staff Member' : 'Edit Staff'} onClose={close}
          footer={<>
            <button className="btn btn-secondary" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Add Staff' : 'Save'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Full Name *</label>
              <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Staff full name" />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select value={form.role} onChange={e => f('role', e.target.value)}>
                <option value="">Select role...</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={form.department} onChange={e => f('department', e.target.value)}>
                <option value="">Select department...</option>
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
            <div className="form-group">
              <label>Shift</label>
              <select value={form.shift} onChange={e => f('shift', e.target.value)}>
                {SHIFTS.map(s => <option key={s}>{s}</option>)}
              </select>
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
