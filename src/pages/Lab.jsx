import { useState, useEffect } from 'react';
import { labQueries, patientQueries } from '../db/queries';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

const EMPTY = { patient_id:'', test_name:'', ordered_by:'', status:'Pending', result:'' };
const TESTS = ['Complete Blood Count','Blood Sugar (Fasting)','HbA1c Test','Lipid Profile','Thyroid Function','Liver Function','Kidney Function','Urine Analysis','MRI Brain','CT Scan','X-Ray Chest','X-Ray Knee','ECG','Echocardiogram','COVID-19 PCR'];

export default function Lab() {
  const { addToast } = useApp();
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => { setTests(labQueries.getAll()); setPatients(patientQueries.getAll()); };
  useEffect(load, []);

  const filtered = tests.filter(t =>
    (!filter || t.status === filter) &&
    (t.patient_name || '').toLowerCase().includes('')
  );

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (t) => { setEditing(t); setForm({ patient_id:t.patient_id, test_name:t.test_name, ordered_by:t.ordered_by, status:t.status, result:t.result }); setModal('edit'); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.patient_id || !form.test_name) { addToast('Patient and test name are required', 'error'); return; }
    if (modal === 'add') { labQueries.create(form); addToast('Lab test ordered', 'success'); }
    else { labQueries.update(editing.id, form); addToast('Lab test updated', 'success'); }
    load(); close();
  };

  const handleDelete = (t) => {
    if (!confirm('Delete this lab test?')) return;
    labQueries.delete(t.id);
    addToast('Lab test deleted', 'info'); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const statusColors = { Pending:'amber', 'In Progress':'blue', Completed:'green', Cancelled:'rose' };

  const stats = {
    pending: tests.filter(t => t.status === 'Pending').length,
    completed: tests.filter(t => t.status === 'Completed').length,
    total: tests.length
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Laboratory</h2><p>Manage lab tests and results</p></div>
        <button className="btn btn-primary" onClick={openAdd} id="add-lab-btn"><MdAdd /> Order Test</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:16 }}>
        {[
          { label:'Total Tests', val:stats.total, color:'var(--accent)', bg:'rgba(59,130,246,0.1)', icon:'🧪' },
          { label:'Pending', val:stats.pending, color:'var(--amber)', bg:'rgba(245,158,11,0.1)', icon:'⏳' },
          { label:'Completed', val:stats.completed, color:'var(--green)', bg:'rgba(16,185,129,0.1)', icon:'✅' },
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
        <select value={filter} onChange={e => setFilter(e.target.value)} id="lab-status-filter">
          <option value="">All Statuses</option>
          <option>Pending</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
        </select>
      </div>

      <div className="card" style={{ padding:0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Patient</th><th>Test</th><th>Ordered By</th><th>Status</th><th>Result</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>No lab tests found</td></tr>
                : filtered.map(t => (
                  <tr key={t.id}>
                    <td style={{ color:'var(--text-muted)' }}>#{t.id}</td>
                    <td style={{ fontWeight:600 }}>{t.patient_name}</td>
                    <td>{t.test_name}</td>
                    <td style={{ color:'var(--text-muted)' }}>{t.ordered_by || '—'}</td>
                    <td><span className={`badge badge-${statusColors[t.status] || 'blue'}`}>{t.status}</span></td>
                    <td style={{ color: t.result ? 'var(--text-primary)' : 'var(--text-muted)' }}>{t.result || 'Awaiting'}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(t)}><MdEdit /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(t)}><MdDelete /></button>
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
        <Modal title={modal === 'add' ? 'Order Lab Test' : 'Update Lab Test'} onClose={close}
          footer={<>
            <button className="btn btn-secondary" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Order Test' : 'Save'}</button>
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
              <label>Test Name *</label>
              <select value={form.test_name} onChange={e => f('test_name', e.target.value)}>
                <option value="">Select test...</option>
                {TESTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Ordered By (Doctor)</label>
              <input value={form.ordered_by} onChange={e => f('ordered_by', e.target.value)} placeholder="Doctor name" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => f('status', e.target.value)}>
                <option>Pending</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
              </select>
            </div>
            <div className="form-group span-2">
              <label>Result</label>
              <textarea value={form.result} onChange={e => f('result', e.target.value)} placeholder="Enter test result..." />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
