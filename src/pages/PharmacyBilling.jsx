import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdArrowDropDown, MdAdd, MdDelete, MdReceipt } from 'react-icons/md';

const PATIENTS = [
  { id:1, name:'Alice Johnson', pid:'P-001', age:34 },
  { id:2, name:'Bob Smith',     pid:'P-002', age:52 },
  { id:3, name:'Carol Davis',   pid:'P-003', age:28 },
  { id:4, name:'David Lee',     pid:'P-004', age:67 },
  { id:5, name:'Emma White',    pid:'P-005', age:45 },
];

const MEDICINES = [
  { name:'Aspirin 75mg',       price:25  },
  { name:'Paracetamol 500mg',  price:15  },
  { name:'Amoxicillin 500mg',  price:85  },
  { name:'Metformin 500mg',    price:40  },
  { name:'Atorvastatin 20mg',  price:110 },
  { name:'Amlodipine 5mg',     price:55  },
  { name:'Losartan 50mg',      price:95  },
  { name:'Metoprolol 25mg',    price:60  },
  { name:'Omeprazole 20mg',    price:45  },
  { name:'Cetirizine 10mg',    price:20  },
  { name:'Azithromycin 500mg', price:130 },
  { name:'Ibuprofen 400mg',    price:30  },
];

const PAYMENT_MODES = ['Cash','UPI','Debit Card','Credit Card','Net Banking'];

const GST = 0.12;

const sel = { width:'100%', padding:'11px 36px 11px 12px', border:'1px solid #e0e0e0', borderRadius:8, fontSize:14, color:'#202124', outline:'none', fontFamily:'Inter,sans-serif', background:'#fff', appearance:'none', boxSizing:'border-box', transition:'border-color 0.15s, box-shadow 0.15s' };
const inp = { width:'100%', padding:'11px 12px', border:'1px solid #e0e0e0', borderRadius:8, fontSize:14, color:'#202124', outline:'none', fontFamily:'Inter,sans-serif', background:'#fff', boxSizing:'border-box', transition:'border-color 0.15s, box-shadow 0.15s' };
const focus = e => { e.target.style.borderColor='#1a73e8'; e.target.style.boxShadow='0 0 0 2px rgba(26,115,232,0.14)'; };
const blur  = e => { e.target.style.borderColor='#e0e0e0'; e.target.style.boxShadow='none'; };
const lbl   = txt => <label style={{ fontSize:12, fontWeight:500, color:'#5f6368', display:'block', marginBottom:6 }}>{txt}</label>;

export default function PharmacyBilling() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [payMode, setPayMode]     = useState('');
  const [errors, setErrors]       = useState({});
  const [items, setItems] = useState([
    { medName:'', qty:1, price:0 }
  ]);

  const patient = PATIENTS.find(p => p.id === +patientId) || null;

  const setItem = (i, k, v) => {
    setItems(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [k]: v };
      if (k === 'medName') {
        const found = MEDICINES.find(m => m.name === v);
        next[i].price = found ? found.price : 0;
      }
      return next;
    });
  };

  const addRow    = () => setItems(p => [...p, { medName:'', qty:1, price:0 }]);
  const removeRow = i  => setItems(p => p.filter((_, j) => j !== i));

  const subtotal = items.reduce((s, r) => s + r.price * r.qty, 0);
  const gstAmt   = Math.round(subtotal * GST);
  const total    = subtotal + gstAmt;

  const validate = () => {
    const e = {};
    if (!patientId) e.patient = 'Please select a patient';
    if (items.every(r => !r.medName)) e.items = 'Add at least one medicine';
    if (!payMode) e.payMode = 'Select a payment mode';
    return e;
  };

  const handleGenerate = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    // pass data via sessionStorage
    const bill = {
      patient, items: items.filter(r => r.medName),
      subtotal, gstAmt, total, payMode,
      date: new Date().toLocaleString(), billNo: 'PH-' + Date.now().toString().slice(-6),
    };
    sessionStorage.setItem('pharmBill', JSON.stringify(bill));
    navigate('/pharmacy-bill');
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa', fontFamily:'Inter,sans-serif' }}>
      <nav style={{ background:'#fff', borderBottom:'1px solid #e0e0e0', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:30, height:30, background:'#1a73e8', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏥</div>
          <span style={{ fontSize:15, fontWeight:600, color:'#202124' }}>MediCore HMS</span>
        </div>
        <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'#5f6368', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
          <MdArrowBack style={{ fontSize:16 }} /> Back
        </button>
      </nav>

      <div style={{ display:'flex', justifyContent:'center', padding:'36px 24px 60px' }}>
        <div style={{ width:'100%', maxWidth:640 }}>

          {/* Heading */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ width:52, height:52, background:'#e8f0fe', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, margin:'0 auto 14px', color:'#1a73e8' }}>
              <MdReceipt />
            </div>
            <h1 style={{ fontSize:24, fontWeight:600, color:'#202124', marginBottom:6 }}>Pharmacy Billing</h1>
            <p style={{ fontSize:13, color:'#9aa0a6' }}>Add medicines and generate a patient bill</p>
          </div>

          <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:16, padding:32, boxShadow:'0 2px 8px rgba(60,64,67,0.08)', display:'flex', flexDirection:'column', gap:22 }}>

            {/* Section: Patient */}
            <div style={{ fontSize:12, fontWeight:600, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.06em', paddingBottom:6, borderBottom:'1px solid #f1f3f4' }}>
              Patient Details
            </div>

            <div>
              {lbl('Select Patient *')}
              <div style={{ position:'relative' }}>
                <select value={patientId} onChange={e => { setPatientId(e.target.value); setErrors(p => ({...p, patient:''})); }}
                  style={{ ...sel, ...(errors.patient ? { borderColor:'#d93025', background:'#fffafa' } : {}) }}
                  onFocus={focus} onBlur={blur}>
                  <option value="">Choose patient...</option>
                  {PATIENTS.map(p => <option key={p.id} value={p.id}>{p.pid} — {p.name} ({p.age}y)</option>)}
                </select>
                <MdArrowDropDown style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#9aa0a6', fontSize:22, pointerEvents:'none' }} />
              </div>
              {errors.patient && <span style={{ fontSize:11, color:'#d93025', marginTop:3, display:'block' }}>⚠ {errors.patient}</span>}

              {/* Patient info chip */}
              {patient && (
                <div style={{ marginTop:10, background:'#f8f9fa', border:'1px solid #e0e0e0', borderRadius:10, padding:'10px 14px', display:'flex', gap:20, fontSize:13 }}>
                  <span>👤 <strong>{patient.name}</strong></span>
                  <span style={{ color:'#9aa0a6' }}>ID: {patient.pid}</span>
                  <span style={{ color:'#9aa0a6' }}>Age: {patient.age}y</span>
                </div>
              )}
            </div>

            {/* Section: Medicines */}
            <div style={{ fontSize:12, fontWeight:600, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.06em', paddingBottom:6, borderBottom:'1px solid #f1f3f4' }}>
              Medicine Items
            </div>

            {/* Table header */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 90px 90px 36px', gap:8, padding:'0 0 6px' }}>
              {['Medicine Name','Qty','Unit Price','Amount',''].map((h,i) => (
                <span key={i} style={{ fontSize:11, fontWeight:600, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</span>
              ))}
            </div>

            {/* Medicine rows */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {items.map((row, i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 80px 90px 90px 36px', gap:8, alignItems:'center' }}>
                  {/* Medicine dropdown */}
                  <div style={{ position:'relative' }}>
                    <select value={row.medName} onChange={e => setItem(i, 'medName', e.target.value)}
                      style={{ ...sel, fontSize:13, padding:'9px 30px 9px 10px' }} onFocus={focus} onBlur={blur}>
                      <option value="">Select...</option>
                      {MEDICINES.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <MdArrowDropDown style={{ position:'absolute', right:6, top:'50%', transform:'translateY(-50%)', color:'#9aa0a6', fontSize:18, pointerEvents:'none' }} />
                  </div>
                  {/* Qty */}
                  <input type="number" value={row.qty} min={1} max={999}
                    onChange={e => setItem(i, 'qty', Math.max(1, +e.target.value))}
                    style={{ ...inp, padding:'9px 10px', fontSize:13, textAlign:'center' }}
                    onFocus={focus} onBlur={blur} />
                  {/* Unit price */}
                  <div style={{ fontSize:13, color:'#5f6368', background:'#f8f9fa', border:'1px solid #e0e0e0', borderRadius:8, padding:'9px 10px', textAlign:'right' }}>
                    ₹{row.price}
                  </div>
                  {/* Row total */}
                  <div style={{ fontSize:13, fontWeight:600, color:'#202124', background:'#f8f9fa', border:'1px solid #e0e0e0', borderRadius:8, padding:'9px 10px', textAlign:'right' }}>
                    ₹{(row.price * row.qty).toLocaleString()}
                  </div>
                  {/* Remove */}
                  <button type="button" onClick={() => items.length > 1 && removeRow(i)}
                    style={{ width:32, height:32, borderRadius:8, border:'1px solid #e0e0e0', background:'#fff', color: items.length > 1 ? '#d93025' : '#bdbdbd', cursor: items.length > 1 ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>

            {errors.items && <span style={{ fontSize:11, color:'#d93025' }}>⚠ {errors.items}</span>}

            {/* Add row */}
            <button type="button" onClick={addRow}
              style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px dashed #1a73e8', borderRadius:8, padding:'9px 16px', fontSize:13, fontWeight:500, color:'#1a73e8', cursor:'pointer', width:'fit-content' }}>
              <MdAdd style={{ fontSize:16 }} /> Add Medicine
            </button>

            {/* ── Amount Summary ── */}
            <div style={{ background:'#f8f9fa', border:'1px solid #e0e0e0', borderRadius:12, padding:'16px 18px', display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { label:'Subtotal',   value:`₹${subtotal.toLocaleString()}`,  style:{ color:'#5f6368', fontSize:13 } },
                { label:`GST (12%)`,  value:`₹${gstAmt.toLocaleString()}`,    style:{ color:'#9a6700', fontSize:13 } },
              ].map((r,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', ...r.style }}>
                  <span>{r.label}</span><span style={{ fontWeight:500 }}>{r.value}</span>
                </div>
              ))}
              <div style={{ borderTop:'1px solid #e0e0e0', paddingTop:10, display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:700, color:'#202124' }}>
                <span>Total Amount</span>
                <span style={{ color:'#1e8e3e' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Mode */}
            <div style={{ fontSize:12, fontWeight:600, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.06em', paddingBottom:6, borderBottom:'1px solid #f1f3f4' }}>
              Payment
            </div>

            <div>
              {lbl('Payment Mode *')}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {PAYMENT_MODES.map(m => (
                  <label key={m} style={{
                    display:'flex', alignItems:'center', gap:7, padding:'9px 16px',
                    borderRadius:8, cursor:'pointer', fontSize:13,
                    border:`1px solid ${payMode === m ? '#1a73e8' : errors.payMode ? '#d93025' : '#e0e0e0'}`,
                    background: payMode === m ? '#e8f0fe' : '#fff',
                    color: payMode === m ? '#1a73e8' : '#5f6368',
                    fontWeight: payMode === m ? 600 : 400,
                    transition:'all 0.15s', userSelect:'none',
                  }}>
                    <input type="radio" name="payMode" value={m} checked={payMode===m}
                      onChange={() => { setPayMode(m); setErrors(p => ({...p, payMode:''})); }}
                      style={{ accentColor:'#1a73e8', width:14, height:14 }} />
                    {m}
                  </label>
                ))}
              </div>
              {errors.payMode && <span style={{ fontSize:11, color:'#d93025', marginTop:4, display:'block' }}>⚠ {errors.payMode}</span>}
            </div>

            {/* Generate Bill Button */}
            <button onClick={handleGenerate} id="generate-bill-btn"
              style={{ background:'#1a73e8', color:'#fff', border:'none', borderRadius:24, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background 0.15s', marginTop:6 }}
              onMouseEnter={e => e.currentTarget.style.background='#1557b0'}
              onMouseLeave={e => e.currentTarget.style.background='#1a73e8'}>
              <MdReceipt style={{ fontSize:20 }} /> Generate Bill
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
