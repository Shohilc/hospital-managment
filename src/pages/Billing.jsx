import { useState, useEffect } from 'react';
import { billQueries, patientQueries } from '../db/queries';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { MdAdd, MdEdit, MdDelete, MdPrint } from 'react-icons/md';

const EMPTY = { patient_id:'', consultation_fee:0, medicine_fee:0, lab_fee:0, bed_fee:0, status:'Pending' };

export default function Billing() {
  const { addToast } = useApp();
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => { setBills(billQueries.getAll()); setPatients(patientQueries.getAll()); };
  useEffect(load, []);

  const filtered = bills.filter(b => !filter || b.status === filter);
  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((s, b) => s + (b.total || 0), 0);
  const totalPending = bills.filter(b => b.status === 'Pending').reduce((s, b) => s + (b.total || 0), 0);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (b) => { setEditing(b); setForm({ patient_id:b.patient_id, consultation_fee:b.consultation_fee, medicine_fee:b.medicine_fee, lab_fee:b.lab_fee, bed_fee:b.bed_fee, status:b.status }); setModal('edit'); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.patient_id) { addToast('Select a patient', 'error'); return; }
    if (modal === 'add') { billQueries.create(form); addToast('Bill created', 'success'); }
    else { billQueries.update(editing.id, form); addToast('Bill updated', 'success'); }
    load(); close();
  };

  const handleDelete = (b) => {
    if (!confirm('Delete this bill?')) return;
    billQueries.delete(b.id);
    addToast('Bill deleted', 'info'); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const total = (+form.consultation_fee || 0) + (+form.medicine_fee || 0) + (+form.lab_fee || 0) + (+form.bed_fee || 0);

  return (
    <div>
      <div className="page-header">
        <div><h2>Billing</h2><p>{bills.length} total bills</p></div>
        <button className="btn btn-primary" onClick={openAdd} id="add-bill-btn"><MdAdd /> Create Bill</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:16 }}>
        {[
          { label:'Total Revenue', val:`₹${totalRevenue.toLocaleString()}`, color:'var(--green)', bg:'rgba(16,185,129,0.1)', icon:'💰' },
          { label:'Pending Amount', val:`₹${totalPending.toLocaleString()}`, color:'var(--amber)', bg:'rgba(245,158,11,0.1)', icon:'⏳' },
          { label:'Total Bills', val:bills.length, color:'var(--accent)', bg:'rgba(59,130,246,0.1)', icon:'🧾' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background:s.bg, fontSize:22 }}>{s.icon}</div>
            <div className="stat-info">
              <div className="value" style={{ color:s.color }}>{s.val}</div>
              <div className="label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <select value={filter} onChange={e => setFilter(e.target.value)} id="bill-status-filter">
          <option value="">All Bills</option><option>Pending</option><option>Paid</option><option>Cancelled</option>
        </select>
      </div>

      <div className="card" style={{ padding:0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Patient</th><th>Consultation</th><th>Medicine</th><th>Lab</th><th>Bed</th><th>Total</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={9} style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>No bills found</td></tr>
                : filtered.map(b => (
                  <tr key={b.id}>
                    <td style={{ color:'var(--text-muted)' }}>#{b.id}</td>
                    <td style={{ fontWeight:600 }}>{b.patient_name}</td>
                    <td>₹{b.consultation_fee}</td>
                    <td>₹{b.medicine_fee}</td>
                    <td>₹{b.lab_fee}</td>
                    <td>₹{b.bed_fee}</td>
                    <td style={{ fontWeight:700, color:'var(--accent)' }}>₹{b.total}</td>
                    <td><span className={`badge badge-${b.status === 'Paid' ? 'green' : b.status === 'Pending' ? 'amber' : 'rose'}`}>{b.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(b)} title="Edit"><MdEdit /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(b)} title="Delete"><MdDelete /></button>
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
        <Modal title={modal === 'add' ? 'Create Bill' : 'Edit Bill'} onClose={close}
          footer={<>
            <button className="btn btn-secondary" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Create Bill' : 'Save'}</button>
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
            <div className="form-group">
              <label>Consultation Fee (₹)</label>
              <input type="number" value={form.consultation_fee} onChange={e => f('consultation_fee', e.target.value)} min={0} />
            </div>
            <div className="form-group">
              <label>Medicine Fee (₹)</label>
              <input type="number" value={form.medicine_fee} onChange={e => f('medicine_fee', e.target.value)} min={0} />
            </div>
            <div className="form-group">
              <label>Lab Fee (₹)</label>
              <input type="number" value={form.lab_fee} onChange={e => f('lab_fee', e.target.value)} min={0} />
            </div>
            <div className="form-group">
              <label>Bed Charges (₹)</label>
              <input type="number" value={form.bed_fee} onChange={e => f('bed_fee', e.target.value)} min={0} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => f('status', e.target.value)}>
                <option>Pending</option><option>Paid</option><option>Cancelled</option>
              </select>
            </div>
            <div className="form-group" style={{ alignSelf:'flex-end' }}>
              <div style={{ background:'var(--bg-card)', borderRadius:8, padding:'10px 14px', border:'1px solid var(--border)' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>Total Amount</span>
                <div style={{ fontSize:20, fontWeight:800, color:'var(--accent)' }}>₹{total.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
