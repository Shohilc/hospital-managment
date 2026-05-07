import { useState, useEffect } from 'react';
import { bedQueries, patientQueries } from '../db/queries';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { MdBed } from 'react-icons/md';

const WARDS = ['General','ICU','Pediatrics','Maternity','Orthopedics'];

export default function Wards() {
  const { addToast } = useApp();
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedWard, setSelectedWard] = useState('All');
  const [modal, setModal] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [assignPatient, setAssignPatient] = useState('');

  const load = () => { setBeds(bedQueries.getAll()); setPatients(patientQueries.getAll()); };
  useEffect(load, []);

  const displayBeds = selectedWard === 'All' ? beds : beds.filter(b => b.ward === selectedWard);

  const stats = {
    available: beds.filter(b => b.status === 'Available').length,
    occupied: beds.filter(b => b.status === 'Occupied').length,
    total: beds.length
  };

  const openBed = (bed) => {
    setSelectedBed(bed);
    setAssignPatient(bed.patient_id || '');
    setModal(true);
  };

  const handleUpdate = () => {
    const pid = assignPatient || null;
    const status = pid ? 'Occupied' : 'Available';
    bedQueries.updateStatus(selectedBed.id, status, pid);
    addToast(`Bed ${selectedBed.bed_number} updated`, 'success');
    load(); setModal(false);
  };

  const wardColors = { General:'blue', ICU:'rose', Pediatrics:'teal', Maternity:'purple', Orthopedics:'amber' };

  return (
    <div>
      <div className="page-header">
        <div><h2>Ward & Bed Management</h2><p>Monitor and manage bed occupancy across wards</p></div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:20 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'rgba(16,185,129,0.1)', color:'var(--green)' }}>🛏️</div>
          <div className="stat-info">
            <div className="value" style={{ color:'var(--green)' }}>{stats.available}</div>
            <div className="label">Available Beds</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'rgba(244,63,94,0.1)', color:'var(--rose)' }}>🔴</div>
          <div className="stat-info">
            <div className="value" style={{ color:'var(--rose)' }}>{stats.occupied}</div>
            <div className="label">Occupied Beds</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'rgba(59,130,246,0.1)', color:'var(--accent)' }}>🏥</div>
          <div className="stat-info">
            <div className="value" style={{ color:'var(--accent)' }}>{stats.total}</div>
            <div className="label">Total Beds</div>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        {['All', ...WARDS].map(w => (
          <button key={w} className={`btn ${selectedWard === w ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setSelectedWard(w)}>{w}</button>
        ))}
      </div>

      {WARDS.filter(w => selectedWard === 'All' || selectedWard === w).map(ward => {
        const wardBeds = beds.filter(b => b.ward === ward);
        if (!wardBeds.length) return null;
        const color = wardColors[ward] || 'blue';
        return (
          <div key={ward} className="card" style={{ marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <MdBed style={{ fontSize:20, color:'var(--accent)' }} />
                <h3 style={{ fontWeight:700 }}>{ward} Ward</h3>
                <span className={`badge badge-${color}`}>{wardBeds.length} beds</span>
              </div>
              <span style={{ fontSize:12, color:'var(--text-muted)' }}>
                {wardBeds.filter(b => b.status === 'Available').length} available
              </span>
            </div>
            <div className="bed-grid">
              {wardBeds.map(bed => (
                <div key={bed.id} className={`bed-cell ${bed.status.toLowerCase()}`} onClick={() => openBed(bed)} title={bed.patient_name || bed.status}>
                  <MdBed style={{ fontSize:22 }} />
                  <span>{bed.bed_number}</span>
                  {bed.patient_name && <span style={{ fontSize:9, textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:80 }}>{bed.patient_name.split(' ')[0]}</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, display:'flex', gap:12, fontSize:11, color:'var(--text-muted)' }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:'50%', background:'var(--green)', display:'inline-block' }} /> Available</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:'50%', background:'var(--rose)', display:'inline-block' }} /> Occupied</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:'50%', background:'var(--amber)', display:'inline-block' }} /> Maintenance</span>
            </div>
          </div>
        );
      })}

      {modal && selectedBed && (
        <Modal title={`Bed ${selectedBed.bed_number} — ${selectedBed.ward} Ward`} onClose={() => setModal(false)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Update Bed</button>
          </>}
        >
          <div className="form-grid single">
            <div className="form-group">
              <label>Current Status</label>
              <span className={`badge badge-${selectedBed.status === 'Available' ? 'green' : 'rose'}`} style={{ width:'fit-content' }}>{selectedBed.status}</span>
            </div>
            <div className="form-group">
              <label>Assign Patient (leave empty to mark available)</label>
              <select value={assignPatient} onChange={e => setAssignPatient(e.target.value)}>
                <option value="">— Available —</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
