import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientRegistration from './pages/PatientRegistration';
import ForgotPassword from './pages/ForgotPassword';
import DoctorList from './pages/DoctorList';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientModuleRegistration from './pages/PatientModuleRegistration';
import PatientProfile from './pages/PatientProfile';
import BookAppointment from './pages/BookAppointment';
import AppointmentList from './pages/AppointmentList';
import PharmacyBilling from './pages/PharmacyBilling';
import PharmacyBill from './pages/PharmacyBill';
import BillingGenerate from './pages/BillingGenerate';
import BillingPayment from './pages/BillingPayment';
import BillingInvoice from './pages/BillingInvoice';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Wards from './pages/Wards';
import Pharmacy from './pages/Pharmacy';
import Lab from './pages/Lab';
import Billing from './pages/Billing';
import Staff from './pages/Staff';
import Toast from './components/Toast';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview of hospital operations' },
  '/patients': { title: 'Patient Management', sub: 'Manage all patient records' },
  '/doctors': { title: 'Doctor Management', sub: 'Manage doctor profiles and schedules' },
  '/appointments': { title: 'Appointments', sub: 'Schedule and manage appointments' },
  '/wards': { title: 'Ward & Bed Management', sub: 'Monitor bed availability' },
  '/pharmacy': { title: 'Pharmacy', sub: 'Manage medicine inventory' },
  '/lab': { title: 'Laboratory', sub: 'Lab tests and results' },
  '/billing': { title: 'Billing', sub: 'Invoices and payments' },
  '/staff': { title: 'Staff Management', sub: 'Manage hospital staff' },
};

function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // mobile drawer
  const { sidebarCollapsed, toggleSidebarCollapsed } = useApp();
  const path = window.location.pathname;
  const meta = PAGE_TITLES[path] || { title: 'Hospira HMS', sub: '' };

  // Desktop → toggle collapse; Mobile → toggle drawer
  const handleMenuToggle = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(o => !o);
    } else {
      toggleSidebarCollapsed();
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
      />
      <div className={`main-content${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <Header title={meta.title} sub={meta.sub} onMenuToggle={handleMenuToggle} />
        <div className="page-body">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/wards" element={<Wards />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/staff" element={<Staff />} />
            {/* Billing module */}
            <Route path="/billing-generate" element={<BillingGenerate />} />
            <Route path="/billing-payment"  element={<BillingPayment />} />
            <Route path="/billing-invoice"  element={<BillingInvoice />} />
            {/* Pharmacy module */}
            <Route path="/pharmacy-billing" element={<PharmacyBilling />} />
            <Route path="/pharmacy-bill"    element={<PharmacyBill />} />
            {/* Patient & appointment module */}
            <Route path="/patient-register"   element={<PatientModuleRegistration />} />
            <Route path="/patient-profile"    element={<PatientProfile />} />
            <Route path="/book-appointment"   element={<BookAppointment />} />
            <Route path="/doctor-dashboard"   element={<DoctorDashboard />} />
            <Route path="/doctor-list"        element={<DoctorList />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
      <Toast />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, background: '#f8f9fa' }}>
      <div style={{ width: 52, height: 52, background: '#1a73e8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏥</div>
      <p style={{ color: '#9aa0a6', fontSize: 14, fontWeight: 400 }}>Initializing Hospira HMS...</p>
    </div>
  );
}

// Public routes (no auth required)
function PublicRoutes() {
  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/doctor" element={<DoctorRegistration />} />
        <Route path="/register/patient" element={<PatientRegistration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-register" element={<PatientModuleRegistration />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/pharmacy-billing" element={<PharmacyBilling />} />
        <Route path="/pharmacy-bill" element={<PharmacyBill />} />
        <Route path="/billing-generate" element={<BillingGenerate />} />
        <Route path="/billing-payment" element={<BillingPayment />} />
        <Route path="/billing-invoice" element={<BillingInvoice />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  const { dbReady, user } = useApp();
  if (!dbReady) return <LoadingScreen />;
  if (!user) return <PublicRoutes />;
  return <ProtectedLayout />;
}
