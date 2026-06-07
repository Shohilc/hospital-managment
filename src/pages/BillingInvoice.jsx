import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdPrint, MdCheck, MdDownload, MdArrowBack } from 'react-icons/md';

const fadeUp = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:0.45, ease:[0.16,1,0.3,1] } } };
const stagger = { show:{ transition:{ staggerChildren:0.1 } } };

export default function BillingInvoice() {
  const navigate   = useNavigate();
  const ref        = useRef();
  const [bill, setBill]        = useState(null);
  const [downloading, setDown] = useState(false);

  useEffect(() => {
    const d = sessionStorage.getItem('billingData');
    if (d) setBill(JSON.parse(d));
    else navigate('/billing-generate');
  }, []);

  if (!bill) return null;

  const rows = [
    { desc:'Consultation Charges', amount:bill.consult },
    { desc:'Medicine Charges',     amount:bill.medicine },
  ].filter(r => r.amount > 0);

  const handlePDF = async () => {
    setDown(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set({
        margin: [10,10,10,10],
        filename: `Invoice-${bill.billNo}.pdf`,
        image: { type:'jpeg', quality:0.98 },
        html2canvas: { scale:2, useCORS:true, logging:false },
        jsPDF: { unit:'mm', format:'a4', orientation:'portrait' },
      }).from(ref.current).save();
    } catch(e) { console.error(e); }
    setDown(false);
  };

  const InfoRow = ({ l, v }) => (
    <div className="flex gap-2 text-xs">
      <span className="text-gray-400 w-24 flex-shrink-0">{l}:</span>
      <span className="text-gray-600 font-medium">{v}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 font-sans">

      {/* Nav */}
      <motion.div initial={{ y:-56 }} animate={{ y:0 }} transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
        className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-14 flex items-center justify-between px-4 sm:px-8 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">🏥</div>
          <span className="text-sm font-semibold text-gray-800 hidden sm:block">Hospira HMS</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            onClick={() => navigate('/billing-generate')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100 border border-gray-200">
            <MdArrowBack className="text-base" /> New Bill
          </motion.button>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100 border border-gray-200">
            <MdPrint className="text-base" /> Print
          </motion.button>
          <motion.button whileHover={{ scale:1.04, boxShadow:'0 6px 20px rgba(26,115,232,0.3)' }} whileTap={{ scale:0.97 }}
            onClick={handlePDF} disabled={downloading}
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200
              ${downloading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white shadow-md shadow-blue-500/25 cursor-pointer'}`}>
            {downloading
              ? <><motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.9, ease:'linear' }}
                  className="w-3.5 h-3.5 border-2 border-gray-400 border-t-gray-600 rounded-full" /> Generating...</>
              : <><MdDownload className="text-base" /> Download PDF</>
            }
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-20">

        {/* Success banner */}
        <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
          className="no-print mb-5 bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:400, delay:0.2 }}
            className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <MdCheck className="text-white text-base" />
          </motion.div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-green-700">Invoice Ready!</span>
            <span className="text-xs text-gray-500">Bill: <strong>{bill.billNo}</strong></span>
            <span className="text-xs text-gray-400">{bill.payModeIcon} {bill.payModeLabel} · Paid</span>
          </div>
        </motion.div>

        {/* ═══════════ INVOICE (PDF target) ═══════════ */}
        <motion.div ref={ref} id="invoice-pdf"
          variants={stagger} initial="hidden" animate="show"
          className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/80 border border-gray-100">

          {/* Blue header */}
          <motion.div variants={fadeUp}
            className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 sm:px-8 py-7">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

              {/* Hospital logo + details */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">🏥</div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Hospira HMS</h2>
                  <p className="text-xs text-blue-200 mt-0.5">Hospital Management System</p>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-[10px] text-blue-300">📍 123 Health Avenue, Medical City 600001</p>
                    <p className="text-[10px] text-blue-300">📞 +91 99999 00000 · billing@hospira.com</p>
                  </div>
                </div>
              </div>

              {/* Invoice meta */}
              <div className="sm:text-right">
                <p className="text-[10px] text-blue-300 uppercase tracking-widest mb-1">Invoice</p>
                <p className="text-2xl font-black text-white">{bill.billNo}</p>
                <p className="text-xs text-blue-300 mt-1">{bill.date}</p>
                <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.5, type:'spring' }}
                  className="mt-3 inline-flex items-center gap-2 bg-white/15 border-2 border-white/40 rounded-xl px-3.5 py-1.5 backdrop-blur-sm">
                  <MdCheck className="text-white text-sm" />
                  <span className="text-xs font-black text-white tracking-widest">PAID</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="px-6 sm:px-8 py-7 flex flex-col gap-6">

            {/* Patient + Payment */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Billed To</p>
                <p className="text-base font-bold text-gray-900 mb-2">{bill.patient.name}</p>
                <div className="flex flex-col gap-1.5">
                  <InfoRow l="Patient ID" v={bill.patient.pid} />
                  <InfoRow l="Age" v={`${bill.patient.age} years`} />
                  <InfoRow l="Doctor" v={bill.patient.doctor} />
                  <InfoRow l="Department" v={bill.patient.dept} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Payment Details</p>
                <p className="text-base font-bold text-gray-900 mb-2">{bill.payModeIcon} {bill.payModeLabel}</p>
                <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} transition={{ type:'spring', delay:0.3 }}
                  className="inline-flex items-center gap-1.5 bg-green-100 border border-green-200 rounded-full px-3 py-1 mb-3">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-xs font-bold text-green-700">Payment Confirmed</span>
                </motion.div>
                <div className="flex flex-col gap-1.5">
                  <InfoRow l="Bill ID" v={bill.billNo} />
                  <InfoRow l="Date" v={bill.date} />
                  <InfoRow l="Status" v="Paid ✔" />
                </div>
              </div>
            </motion.div>

            {/* Charges table */}
            <motion.div variants={fadeUp}>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Charge Breakdown</p>
              <div className="rounded-2xl overflow-hidden border border-gray-100">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['#','Description','Amount'].map((h,i) => (
                        <th key={h} className={`px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${i===2?'text-right':'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r,i) => (
                      <motion.tr key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3+i*0.1 }}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="px-4 py-3.5 text-xs text-gray-300 font-mono">{String(i+1).padStart(2,'0')}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-800">{r.desc}</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">₹{r.amount.toLocaleString()}</td>
                      </motion.tr>
                    ))}
                    {bill.discAmt > 0 && (
                      <tr className="border-b border-gray-50">
                        <td className="px-4 py-3.5 text-xs text-gray-300">—</td>
                        <td className="px-4 py-3.5 text-sm text-red-500">Discount Applied</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-red-500 text-right">−₹{bill.discAmt.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="bg-gray-50 px-4 py-4 flex flex-col gap-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>₹{bill.subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-amber-600"><span>GST (5%)</span><span>₹{bill.gstAmt.toLocaleString()}</span></div>
                </div>

                {/* Total amount */}
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-100">Total Amount Paid</span>
                  <motion.span key={bill.total} initial={{ scale:0.8 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300, delay:0.7 }}
                    className="text-2xl sm:text-3xl font-black text-white">₹{bill.total.toLocaleString()}</motion.span>
                </motion.div>
              </div>
            </motion.div>

            {/* Notes */}
            {bill.notes && (
              <motion.div variants={fadeUp} className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 text-sm text-amber-700">
                📝 <strong>Notes:</strong> {bill.notes}
              </motion.div>
            )}

            {/* Footer */}
            <motion.div variants={fadeUp} className="border-t-2 border-dashed border-gray-100 pt-5 text-center">
              <p className="text-sm font-semibold text-gray-800 mb-1">Thank you for choosing Hospira HMS 🏥</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Computer-generated invoice · No physical signature required<br />
                Queries: billing@hospira.com · +91 99999 00000
              </p>
            </motion.div>

          </div>
        </motion.div>

        {/* Bottom actions */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.4 }}
          className="no-print flex flex-col sm:flex-row gap-3 mt-5">
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={() => navigate('/billing-generate')}
            className="flex-1 bg-white border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-2xl text-sm hover:bg-gray-50 transition-all duration-200">
            + New Bill
          </motion.button>
          <motion.button whileHover={{ scale:1.02, boxShadow:'0 8px 32px rgba(26,115,232,0.3)' }} whileTap={{ scale:0.97 }}
            onClick={handlePDF} disabled={downloading}
            className={`flex-[2] flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-lg
              ${downloading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25'}`}>
            {downloading
              ? <><motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.9, ease:'linear' }}
                  className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full" /> Generating PDF...</>
              : <><MdDownload className="text-lg" /> Download PDF Invoice</>
            }
          </motion.button>
        </motion.div>

      </div>
      <style>{`
        @media print { .no-print { display:none!important; } body { background:#fff; } }
      `}</style>
    </div>
  );
}
