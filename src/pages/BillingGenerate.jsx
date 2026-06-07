import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdArrowDropDown, MdReceiptLong, MdAdd, MdRemove } from 'react-icons/md';

const PATIENTS = [
  { id:1, name:'Alice Johnson', pid:'P-001', age:34, doctor:'Dr. James Wilson', dept:'Cardiology' },
  { id:2, name:'Bob Smith',     pid:'P-002', age:52, doctor:'Dr. Sarah Lee',    dept:'Neurology'  },
  { id:3, name:'Carol Davis',   pid:'P-003', age:28, doctor:'Dr. Priya Sharma', dept:'Gynecology' },
  { id:4, name:'David Lee',     pid:'P-004', age:67, doctor:'Dr. Arjun Mehta',  dept:'Pediatrics' },
  { id:5, name:'Emma White',    pid:'P-005', age:45, doctor:'Dr. Neha Kapoor',  dept:'Dermatology'},
];

const GST = 0.05;

const fadeUp = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:0.45, ease:[0.16,1,0.3,1] } } };
const stagger = { show:{ transition:{ staggerChildren:0.08 } } };

const Field = ({ label, req, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500 tracking-wide">
      {label}{req && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          className="text-xs text-red-500 flex items-center gap-1">⚠ {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const inputCls = (err) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 bg-white outline-none transition-all duration-200 font-sans
   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-400
   ${err ? 'border-red-400 bg-red-50/40 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200'}`;

export default function BillingGenerate() {
  const navigate = useNavigate();
  const [patientId, setPid]   = useState('');
  const [consult, setConsult] = useState('');
  const [medicine, setMed]    = useState('');
  const [discount, setDisc]   = useState('');
  const [notes, setNotes]     = useState('');
  const [errors, setErrors]   = useState({});

  const patient   = PATIENTS.find(p => p.id === +patientId) || null;
  const cVal      = parseFloat(consult)  || 0;
  const mVal      = parseFloat(medicine) || 0;
  const dVal      = parseFloat(discount) || 0;
  const subtotal  = cVal + mVal;
  const discAmt   = Math.min(dVal, subtotal);
  const afterDisc = subtotal - discAmt;
  const gstAmt    = Math.round(afterDisc * GST);
  const total     = afterDisc + gstAmt;

  const validate = () => {
    const e = {};
    if (!patientId) e.patient  = 'Please select a patient';
    if (!consult)   e.consult  = 'Consultation charges required';
    else if (cVal < 0) e.consult = 'Cannot be negative';
    if (dVal > subtotal && subtotal > 0) e.discount = 'Discount exceeds total charges';
    return e;
  };

  const handleGenerate = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const bill = { patient, consult:cVal, medicine:mVal, discAmt, subtotal, gstAmt, total, notes,
      billNo:'BL-'+Date.now().toString().slice(-6), date:new Date().toLocaleString() };
    sessionStorage.setItem('billingData', JSON.stringify(bill));
    navigate('/billing-payment');
  };

  const clr = (k) => setErrors(p => ({ ...p, [k]:'' }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 font-sans">

      {/* Nav */}
      <motion.div as="nav" initial={{ y:-56 }} animate={{ y:0 }} transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-14 flex items-center justify-between px-4 sm:px-8 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">🏥</div>
          <span className="text-sm font-semibold text-gray-800 hidden sm:block">Hospira HMS</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full hidden sm:block">Billing</span>
        </div>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-gray-100">
          <MdArrowBack className="text-base" /> Back
        </motion.button>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-20">

        {/* Heading */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          className="text-center mb-8">
          <motion.div whileHover={{ rotate:[0,8,-8,0], scale:1.1 }} transition={{ duration:0.5 }}
            className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm border border-blue-100">
            <MdReceiptLong className="text-blue-600" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">Generate Bill</h1>
          <p className="text-sm text-gray-400">Create a consolidated bill for the patient visit</p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4">

          {/* ── Patient Card ── */}
          <motion.div variants={fadeUp}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-50">Patient Details</p>

            <Field label="Select Patient" req error={errors.patient}>
              <div className="relative">
                <select value={patientId} onChange={e => { setPid(e.target.value); clr('patient'); }}
                  className={inputCls(errors.patient) + ' appearance-none pr-9 cursor-pointer'}>
                  <option value="">Choose patient...</option>
                  {PATIENTS.map(p => <option key={p.id} value={p.id}>{p.pid} — {p.name}</option>)}
                </select>
                <MdArrowDropDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
              </div>
            </Field>

            <AnimatePresence>
              {patient && (
                <motion.div initial={{ opacity:0, height:0, marginTop:0 }} animate={{ opacity:1, height:'auto', marginTop:14 }} exit={{ opacity:0, height:0, marginTop:0 }}
                  transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/60 overflow-hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { l:'Name',       v: patient.name },
                      { l:'Patient ID', v: patient.pid },
                      { l:'Age',        v: `${patient.age} yrs` },
                      { l:'Doctor',     v: patient.doctor },
                      { l:'Department', v: patient.dept },
                    ].map((r,i) => (
                      <div key={i}>
                        <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">{r.l}</div>
                        <div className="text-xs font-semibold text-gray-700">{r.v}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Charges Card ── */}
          <motion.div variants={fadeUp}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-50">Charge Breakdown</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Consultation Charges (₹)" req error={errors.consult}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">₹</span>
                  <input type="number" min={0} value={consult} placeholder="0.00"
                    onChange={e => { setConsult(e.target.value); clr('consult'); }}
                    className={inputCls(errors.consult) + ' pl-7'} />
                </div>
              </Field>
              <Field label="Medicine Charges (₹)">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">₹</span>
                  <input type="number" min={0} value={medicine} placeholder="0.00"
                    onChange={e => setMed(e.target.value)}
                    className={inputCls(false) + ' pl-7'} />
                </div>
              </Field>
            </div>

            <Field label="Discount (₹)" error={errors.discount}>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-400">−</span>
                <input type="number" min={0} value={discount} placeholder="0.00"
                  onChange={e => { setDisc(e.target.value); clr('discount'); }}
                  className={inputCls(errors.discount) + ' pl-7'} />
              </div>
            </Field>

            <div className="mt-4">
              <Field label="Additional Notes">
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  placeholder="Lab charges, room charges, procedures..."
                  className={inputCls(false) + ' resize-none leading-relaxed'} />
              </Field>
            </div>
          </motion.div>

          {/* ── Summary Card ── */}
          <motion.div variants={fadeUp}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-50">Bill Summary</p>

            <div className="flex flex-col gap-0">
              {[
                { l:'Consultation', v:`₹${cVal.toLocaleString()}`, c:'text-gray-600' },
                { l:'Medicine',     v:`₹${mVal.toLocaleString()}`, c:'text-gray-600' },
                { l:'Subtotal',     v:`₹${subtotal.toLocaleString()}`, c:'text-gray-700' },
                ...(discAmt > 0 ? [{ l:'Discount', v:`−₹${discAmt.toLocaleString()}`, c:'text-red-500' }] : []),
                { l:'GST (5%)',     v:`₹${gstAmt.toLocaleString()}`, c:'text-amber-600' },
              ].map((r,i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{r.l}</span>
                  <span className={`text-sm font-medium ${r.c}`}>{r.v}</span>
                </div>
              ))}
            </div>

            <motion.div layout
              className="mt-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex items-center justify-between shadow-lg shadow-blue-500/20">
              <span className="text-sm font-semibold text-blue-100">Total Amount</span>
              <motion.span key={total} initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:300 }}
                className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ₹{total.toLocaleString()}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* ── Button ── */}
          <motion.div variants={fadeUp}>
            <motion.button onClick={handleGenerate} id="generate-hospital-bill-btn"
              whileHover={{ scale:1.02, boxShadow:'0 8px 32px rgba(26,115,232,0.35)' }}
              whileTap={{ scale:0.97 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all duration-200">
              <MdReceiptLong className="text-xl" />
              Generate Bill & Proceed to Payment
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
