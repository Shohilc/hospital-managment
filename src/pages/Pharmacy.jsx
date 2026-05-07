import { useState, useEffect } from 'react';
import { medicineQueries } from '../db/queries';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { MdAdd, MdEdit, MdDelete, MdWarning } from 'react-icons/md';

const EMPTY = { name:'', category:'', stock:0, unit:'Tablet', price:0, expiry_date:'' };
const CATEGORIES = ['Analgesic','Antibiotic','Antidiabetic','Cardiovascular','Gastrointestinal','NSAID','Antihistamine','Antifungal','Antiviral','Vitamin','Supplement','Other'];
const UNITS = ['Tablet','Capsule','Syrup (ml)','Injection (ml)','Cream (g)','Drops','Inhaler'];

export default function Pharmacy() {
  const { addToast } = useApp();
  const [meds, setMeds] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => setMeds(medicineQueries.getAll());
  useEffect(load, []);

  const filtered = meds.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = meds.filter(m => m.stock < 30);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (m) => { setEditing(m); setForm({ ...m }); setModal('edit'); };
  const close = () => { setModal(null); setEditing(null); };

  const handleSave = () => {
    if (!form.name) { addToast('Medicine name is required', 'error'); return; }
    if (modal === 'add') { medicineQueries.create(form); addToast('Medicine added', 'success'); }
    else { medicineQueries.update(editing.id, form); addToast('Medicine updated', 'success'); }
    load(); close();
  };

  const handleDelete = (m) => {
    if (!confirm(`Remove ${m.name}?`)) return;
    medicineQueries.delete(m.id);
    addToast('Medicine removed', 'info'); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000*60*60*24);
    return diff < 90;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Pharmacy</h2>
          <p>{meds.length} medicines in inventory</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="add-medicine-btn"><MdAdd /> Add Medicine</button>
      </div>

      {lowStock.length > 0 && (
        <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:12, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
          <MdWarning style={{ color:'var(--amber)', fontSize:20, flexShrink:0 }} />
          <div>
            <strong style={{ fontSize:13 }}>Low Stock Alert:</strong>
            <span style={{ fontSize:13, color:'var(--text-secondary)' }}> {lowStock.map(m => `${m.name} (${m.stock} ${m.unit})`).join(', ')}</span>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <input placeholder="Search medicines..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:300 }} id="medicine-search" />
      </div>

      <div className="card" style={{ padding:0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Medicine</th><th>Category</th><th>Stock</th><th>Price</th><th>Expiry</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>No medicines found</td></tr>
                : filtered.map(m => (
                  <tr key={m.id}>
                    <td style={{ color:'var(--text-muted)' }}>#{m.id}</td>
                    <td>
                      <div style={{ fontWeight:600 }}>{m.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{m.unit}</div>
                    </td>
                    <td><span className="badge badge-blue">{m.category}</span></td>
                    <td>
                      <span style={{ fontWeight:600, color: m.stock < 30 ? 'var(--rose)' : m.stock < 100 ? 'var(--amber)' : 'var(--green)' }}>
                        {m.stock}
                      </span>
                      {m.stock < 30 && <span style={{ fontSize:10, color:'var(--rose)', marginLeft:4 }}>LOW</span>}
                    </td>
                    <td style={{ color:'var(--green)', fontWeight:600 }}>₹{m.price}</td>
                    <td>
                      <span style={{ color: isExpiringSoon(m.expiry_date) ? 'var(--amber)' : 'var(--text-muted)', fontSize:12 }}>
                        {m.expiry_date}
                        {isExpiringSoon(m.expiry_date) && ' ⚠️'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(m)}><MdEdit /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(m)}><MdDelete /></button>
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
        <Modal title={modal === 'add' ? 'Add Medicine' : 'Edit Medicine'} onClose={close}
          footer={<>
            <button className="btn btn-secondary" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Add' : 'Save'}</button>
          </>}
        >
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Medicine Name *</label>
              <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Paracetamol 500mg" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => f('category', e.target.value)}>
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select value={form.unit} onChange={e => f('unit', e.target.value)}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" value={form.stock} onChange={e => f('stock', e.target.value)} min={0} />
            </div>
            <div className="form-group">
              <label>Price per Unit (₹)</label>
              <input type="number" step="0.1" value={form.price} onChange={e => f('price', e.target.value)} min={0} />
            </div>
            <div className="form-group span-2">
              <label>Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={e => f('expiry_date', e.target.value)} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
