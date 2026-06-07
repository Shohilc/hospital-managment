import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdCheck, MdPayment } from 'react-icons/md';

const PAYMENT_MODES = [
  { id:'cash',   label:'Cash',         icon:'💵', desc:'Pay with physical cash' },
  { id:'upi',    label:'UPI',          icon:'📲', desc:'Google Pay, PhonePe, Paytm' },
  { id:'debit',  label:'Debit Card',   icon:'💳', desc:'Visa / Mastercard / Rupay' },
  { id:'credit', label:'Credit Card',  icon:'💳', desc:'Credit card payment' },
  { id:'net',    label:'Net Banking',  icon:'🏦', desc:'Internet banking transfer' },
  { id:'ins',    label:'Insurance',    icon:'🛡️',  desc:'Insurance claim' },
];

const fadeUp = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:0.45, ease:[0.16,1,0.3,1] } } };
const stagger = { show:{ transition:{ staggerChildren:0.08 } } };

export default function BillingPayment() {
  const navigate = useNavigate();
  const [bill, setBill]       = useState(null);
  const [payMode, setPayMode] = useState('');
  const [status, setStatus]   = useState('Pending');
  const [error, setError]     = useState('');

  useEffect(() => {
    const d = sessionStorage.getItem('billingData');
    if (d) setBill(JSON.parse(d));
    else navigate('/billing-generate');
  }, []);

  if (!bill) return null;

  const handleConfirm = () => {
    if (!payMode) { setError('Please select a payment method'); return; }
    setError('');
    setStatus('Processing');
    setTimeout(() => {
      setStatus('Paid');
      const pm = PAYMENT_MODES.find(m => m.id === payMode);
      sessionStorage.setItem('billingData', JSON.stringify({ ...bill, payMode, payModeLabel:pm.label, payModeIcon:pm.icon, status:'Paid' }));
      navigate('/billing-invoice');
    }, 1400);
  };

  const statusCfg = {
    Pending:    { bg:'bg-amber-50',  text:'text-amber-700',  ring:'border-amber-200', dot:'bg-amber-400',  label:'Awaiting Payment' },
    Processing: { bg:'bg-blue-50',   text:'text-blue-700',   ring:'border-blue-200',  dot:'bg-blue-500',   label:'Processing...' },
    Paid:       { bg:'bg-green-50',  text:'text-green-700',  ring:'border-green-200', dot:'bg-green-500',  label:'Payment Confirmed' },
  };
  const sc = statusCfg[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-slate-50 font-sans">

      {/* Nav */}
      <motion.div initial={{ y:-56 }} animate={{ y:0 }} transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-14 flex items-center justify-between px-4 sm:px-8 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">🏥</div>
          <span className="text-sm font-semibold text-gray-800 hidden sm:block">Hospira HMS</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full hidden sm:block">Payment</span>
        </div>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          onClick={() => navigate('/billing-generate')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100">
          <MdArrowBack className="text-base" /> Edit Bill
        </motion.button>
      </motion.div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-20">

        {/* Heading */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          className="text-center mb-8">
          <motion.div whileHover={{ rotate:[0,10,-10,0], scale:1.1 }} transition={{ duration:0.5 }}
            className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm border border-green-100">
            <MdPayment className="text-green-600" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">Payment</h1>
          <p className="text-sm text-gray-400">Choose a method to complete billing</p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4">

          {/* Bill summary strip */}
          <motion.div variants={fadeUp}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-5 shadow-xl shadow-blue-500/25 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-blue-200 font-medium mb-0.5">Patient</p>
                <p className="text-base font-bold">{bill.patient.name}</p>
                <p className="text-xs text-blue-300 mt-0.5">{bill.patient.pid} · {bill.billNo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-200 font-medium mb-0.5">Total Due</p>
                <motion.p key={bill.total} initial={{ scale:0.8 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}
                  className="text-2xl font-black">₹{bill.total.toLocaleString()}</motion.p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border-t border-blue-500/40 pt-3">
              {[
                { l:'Consult', v:`₹${bill.consult}` },
                { l:'Medicine', v:`₹${bill.medicine}` },
                { l:'Discount', v:`−₹${bill.discAmt}` },
                { l:'GST', v:`₹${bill.gstAmt}` },
              ].map((r,i) => (
                <div key={i} className="text-center">
                  <div className="text-[9px] text-blue-300 uppercase tracking-wider mb-0.5">{r.l}</div>
                  <div className="text-xs font-semibold">{r.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment method grid */}
          <motion.div variants={fadeUp}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PAYMENT_MODES.map(m => (
                <motion.label key={m.id}
                  whileHover={{ scale:1.03, y:-1 }} whileTap={{ scale:0.97 }}
                  onClick={() => { setPayMode(m.id); setError(''); }}
                  className={`flex flex-col gap-1 p-3.5 rounded-xl cursor-pointer border-2 transition-all duration-200 select-none
                    ${payMode===m.id
                      ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'}`}>
                  <input type="radio" className="hidden" name="pm" value={m.id} onChange={() => {}} />
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{m.icon}</span>
                    {payMode === m.id && (
                      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:400 }}
                        className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <MdCheck className="text-white text-[10px]" />
                      </motion.div>
                    )}
                  </div>
                  <p className={`text-xs font-bold mt-0.5 ${payMode===m.id ? 'text-blue-700' : 'text-gray-700'}`}>{m.label}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{m.desc}</p>
                </motion.label>
              ))}
            </div>
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  className="text-xs text-red-500 mt-2.5 flex items-center gap-1">⚠ {error}</motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Payment Status */}
          <motion.div variants={fadeUp}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Status</p>
            <AnimatePresence mode="wait">
              <motion.div key={status} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:10 }}
                transition={{ duration:0.25 }}
                className={`flex items-center gap-3 p-4 rounded-xl border ${sc.bg} ${sc.ring}`}>
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${sc.bg} border-2 ${sc.ring} flex items-center justify-center`}>
                    {status === 'Processing'
                      ? <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.9, ease:'linear' }}
                          className={`w-5 h-5 rounded-full border-2 border-transparent border-t-blue-600`} />
                      : status === 'Paid'
                      ? <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:400 }}>
                          <MdCheck className="text-green-600 text-xl" />
                        </motion.div>
                      : <MdPayment className="text-amber-500 text-xl" />
                    }
                  </div>
                  {status !== 'Processing' && (
                    <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 ${sc.dot} rounded-full border-2 border-white`} />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-bold ${sc.text}`}>{sc.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {status==='Pending'    && 'Select a method and click Confirm Payment'}
                    {status==='Processing' && 'Processing your payment, please wait...'}
                    {status==='Paid'       && 'Payment received! Generating invoice...'}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Confirm Button */}
          <motion.div variants={fadeUp}>
            <motion.button onClick={handleConfirm} disabled={status==='Processing'}
              whileHover={status!=='Processing' ? { scale:1.02, boxShadow:'0 8px 32px rgba(30,142,62,0.35)' } : {}}
              whileTap={status!=='Processing' ? { scale:0.97 } : {}}
              className={`w-full font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg
                ${status==='Processing'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-500/25 cursor-pointer'}`}>
              {status==='Processing'
                ? <><motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.9, ease:'linear' }}
                    className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full inline-block" /> Processing...</>
                : <><MdCheck className="text-xl" /> Confirm Payment · ₹{bill.total.toLocaleString()}</>
              }
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
