import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPrint, MdArrowBack, MdDownload, MdCheck } from 'react-icons/md';

export default function PharmacyBill() {
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('pharmBill');
    if (data) setBill(JSON.parse(data));
    else navigate('/pharmacy-billing');
  }, []);

  if (!bill) return null;

  const PAYMENT_ICONS = { Cash:'💵', UPI:'📲', 'Debit Card':'💳', 'Credit Card':'💳', 'Net Banking':'🏦' };

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa', fontFamily:'Inter,sans-serif' }}>

      {/* Nav — hidden on print */}
      <nav className="no-print" style={{ background:'#fff', borderBottom:'1px solid #e0e0e0', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:30, height:30, background:'#1a73e8', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏥</div>
          <span style={{ fontSize:15, fontWeight:600, color:'#202124' }}>MediCore HMS</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => navigate('/pharmacy-billing')} style={{ background:'none', border:'1px solid #e0e0e0', borderRadius:24, padding:'7px 16px', fontSize:13, color:'#5f6368', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
            <MdArrowBack style={{ fontSize:14 }} /> New Bill
          </button>
          <button onClick={() => window.print()} style={{ background:'#1a73e8', color:'#fff', border:'none', borderRadius:24, padding:'7px 18px', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
            <MdPrint style={{ fontSize:15 }} /> Print
          </button>
        </div>
      </nav>

      <div style={{ display:'flex', justifyContent:'center', padding:'32px 24px 60px' }}>
        <div style={{ width:'100%', maxWidth:660 }}>

          {/* Success banner */}
          <div className="no-print" style={{ background:'#e6f4ea', border:'1px solid #a8d5b5', borderRadius:12, padding:'12px 18px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, background:'#1e8e3e', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, flexShrink:0 }}><MdCheck /></div>
            <div>
              <span style={{ fontSize:14, fontWeight:600, color:'#1e8e3e' }}>Bill generated successfully!</span>
              <span style={{ fontSize:12, color:'#5f6368', marginLeft:8 }}>Bill No: <strong>{bill.billNo}</strong></span>
            </div>
          </div>

          {/* ── Bill Card ── */}
          <div id="bill-print" style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 8px rgba(60,64,67,0.09)' }}>

            {/* Header */}
            <div style={{ background:'#1a73e8', padding:'24px 32px', color:'#fff' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <div style={{ width:38, height:38, background:'rgba(255,255,255,0.2)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🏥</div>
                    <div>
                      <div style={{ fontSize:18, fontWeight:700 }}>MediCore HMS</div>
                      <div style={{ fontSize:12, opacity:0.8 }}>Pharmacy Department</div>
                    </div>
                  </div>
                  <div style={{ fontSize:11, opacity:0.75, marginTop:4 }}>123 Health Avenue, Medical City · Phone: +91 99999 00000</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:22, fontWeight:700 }}>BILL</div>
                  <div style={{ fontSize:13, opacity:0.85, marginTop:2 }}>{bill.billNo}</div>
                  <div style={{ fontSize:11, opacity:0.7, marginTop:4 }}>{bill.date}</div>
                </div>
              </div>
            </div>

            <div style={{ padding:'24px 32px', display:'flex', flexDirection:'column', gap:22 }}>

              {/* Patient + Payment info */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div style={{ background:'#f8f9fa', borderRadius:10, padding:'14px 16px' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Billed To</div>
                  <div style={{ fontSize:15, fontWeight:600, color:'#202124' }}>{bill.patient.name}</div>
                  <div style={{ fontSize:12, color:'#5f6368', marginTop:2 }}>Patient ID: {bill.patient.pid}</div>
                  <div style={{ fontSize:12, color:'#5f6368' }}>Age: {bill.patient.age} years</div>
                </div>
                <div style={{ background:'#f8f9fa', borderRadius:10, padding:'14px 16px' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Payment Info</div>
                  <div style={{ fontSize:14, fontWeight:600, color:'#202124' }}>
                    {PAYMENT_ICONS[bill.payMode] || '💳'} {bill.payMode}
                  </div>
                  <div style={{ marginTop:6, display:'inline-flex', alignItems:'center', gap:4, background:'#e6f4ea', borderRadius:20, padding:'3px 10px', fontSize:12, color:'#1e8e3e', fontWeight:600 }}>
                    <MdCheck style={{ fontSize:13 }} /> Paid
                  </div>
                </div>
              </div>

              {/* Medicine table */}
              <div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#f8f9fa', borderBottom:'2px solid #e0e0e0' }}>
                      {['#','Medicine','Qty','Unit Price','Amount'].map((h,i) => (
                        <th key={h} style={{ textAlign: i > 1 ? 'right' : 'left', padding:'10px 14px', fontSize:11, fontWeight:700, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bill.items.map((r, i) => (
                      <tr key={i} style={{ borderBottom:'1px solid #f1f3f4' }}>
                        <td style={{ padding:'12px 14px', fontSize:12, color:'#9aa0a6' }}>{i+1}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ fontSize:14, fontWeight:500, color:'#202124' }}>{r.medName}</div>
                        </td>
                        <td style={{ padding:'12px 14px', fontSize:13, color:'#5f6368', textAlign:'right' }}>{r.qty}</td>
                        <td style={{ padding:'12px 14px', fontSize:13, color:'#5f6368', textAlign:'right' }}>₹{r.price}</td>
                        <td style={{ padding:'12px 14px', fontSize:14, fontWeight:600, color:'#202124', textAlign:'right' }}>₹{(r.price*r.qty).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div style={{ background:'#f8f9fa', borderRadius:'0 0 10px 10px', padding:'14px 16px', borderTop:'1px solid #e0e0e0' }}>
                  {[
                    { label:'Subtotal', value:`₹${bill.subtotal.toLocaleString()}`, style:{ fontSize:13, color:'#5f6368' } },
                    { label:'GST (12%)',value:`₹${bill.gstAmt.toLocaleString()}`,   style:{ fontSize:13, color:'#9a6700' } },
                  ].map((r,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, ...r.style }}>
                      <span>{r.label}</span><span style={{ fontWeight:500 }}>{r.value}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', borderTop:'1px solid #e0e0e0', paddingTop:10, fontSize:16, fontWeight:700 }}>
                    <span style={{ color:'#202124' }}>Total Paid</span>
                    <span style={{ color:'#1e8e3e' }}>₹{bill.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ textAlign:'center', borderTop:'1px dashed #e0e0e0', paddingTop:18 }}>
                <div style={{ fontSize:13, fontWeight:500, color:'#202124', marginBottom:4 }}>Thank you for choosing MediCore HMS</div>
                <div style={{ fontSize:11, color:'#9aa0a6' }}>This is a computer-generated bill and does not require a signature.</div>
              </div>

            </div>
          </div>

          {/* Action buttons */}
          <div className="no-print" style={{ display:'flex', gap:12, marginTop:20 }}>
            <button onClick={() => navigate('/pharmacy-billing')}
              style={{ flex:1, background:'#fff', border:'1px solid #e0e0e0', borderRadius:24, padding:'12px', fontSize:13, fontWeight:500, color:'#5f6368', cursor:'pointer' }}>
              + New Bill
            </button>
            <button onClick={() => window.print()}
              style={{ flex:2, background:'#1a73e8', color:'#fff', border:'none', borderRadius:24, padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
              <MdPrint style={{ fontSize:17 }} /> Print Bill
            </button>
          </div>
        </div>
      </div>

      <style>{`@media print { .no-print { display:none !important; } body { background:#fff; } }`}</style>
    </div>
  );
}
