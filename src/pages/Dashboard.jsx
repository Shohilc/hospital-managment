import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { patientQueries, doctorQueries, appointmentQueries, bedQueries, billQueries } from '../db/queries';
import { MdPeople, MdLocalHospital, MdCalendarToday, MdAttachMoney, MdBed, MdTrendingUp } from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#f1f3f4' }, ticks: { color: '#9aa0a6', font: { size: 11 } } },
    y: { grid: { color: '#f1f3f4' }, ticks: { color: '#9aa0a6', font: { size: 11 } } }
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, todayAppts: 0, revenue: 0, beds: 0 });
  const [todayAppts, setTodayAppts] = useState([]);

  useEffect(() => {
    setStats({
      patients: patientQueries.count(),
      doctors: doctorQueries.count(),
      todayAppts: appointmentQueries.countToday(),
      revenue: billQueries.totalRevenue(),
      beds: bedQueries.countAvailable(),
    });
    setTodayAppts(appointmentQueries.getToday().slice(0, 5));
  }, []);

  const lineData = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{
      data: [12, 19, 14, 22, 18, 25, 17],
      borderColor: '#1a73e8', backgroundColor: 'rgba(26,115,232,0.06)',
      fill: true, tension: 0.4, pointBackgroundColor: '#1a73e8', pointRadius: 4, borderWidth: 2,
    }]
  };

  const doughnutData = {
    labels: ['Available','Occupied','Maintenance'],
    datasets: [{ data: [stats.beds, 10, 2], backgroundColor: ['#1e8e3e','#d93025','#f29900'], borderWidth: 0 }]
  };

  const doughnutOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#5f6368', font: { size: 11 }, padding: 12 } } },
    cutout: '70%'
  };

  const statCards = [
    { icon:'👥', label:'Total Patients', value: stats.patients, change:'+3 this week', up:true, color:'#1a73e8', bg:'#e8f0fe', nav:'/patients' },
    { icon:'👨‍⚕️', label:'Active Doctors', value: stats.doctors, change:'All available', up:true, color:'#1e8e3e', bg:'#e6f4ea', nav:'/doctors' },
    { icon:'📅', label:"Today's Appointments", value: stats.todayAppts, change:'Next at 9:00 AM', up:true, color:'#7b1fa2', bg:'#f3e8fd', nav:'/appointments' },
    { icon:'💰', label:'Total Revenue', value:`₹${stats.revenue.toLocaleString()}`, change:'+12% this month', up:true, color:'#1e8e3e', bg:'#e6f4ea', nav:'/billing' },
    { icon:'🛏️', label:'Available Beds', value: stats.beds, change:'10 occupied', up:false, color:'#f29900', bg:'#fef7e0', nav:'/wards' },
  ];

  const activity = [
    { dot:'#10b981', text:'Alice Johnson admitted to General Ward', meta:'2 min ago' },
    { dot:'#3b82f6', text:'Appointment booked for Bob Smith', meta:'15 min ago' },
    { dot:'#8b5cf6', text:'Lab results ready for Carol Davis', meta:'1 hr ago' },
    { dot:'#f59e0b', text:'Medicine stock low: Ibuprofen 400mg', meta:'2 hr ago' },
    { dot:'#f43f5e', text:'Bill #4 overdue for David Lee', meta:'3 hr ago' },
  ];

  return (
    <div>
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card" onClick={() => navigate(s.nav)} style={{ cursor:'pointer' }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color, fontSize: 22 }}>{s.icon}</div>
            <div className="stat-info">
              <div className="value" style={{ color: s.color }}>{s.value}</div>
              <div className="label">{s.label}</div>
              <div className={`change ${s.up ? 'up' : 'down'}`}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div>
                <h3 style={{ fontWeight:700 }}>Patient Visits</h3>
                <p style={{ fontSize:12, color:'var(--text-muted)' }}>This week overview</p>
              </div>
              <span className="badge badge-blue" style={{ display:'flex', alignItems:'center', gap:4 }}><MdTrendingUp />+8.2%</span>
            </div>
            <div className="chart-wrapper">
              <Line data={lineData} options={chartOpts} />
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight:700, marginBottom:14 }}>Today's Appointments</h3>
            {todayAppts.length === 0 ? (
              <div className="empty-state"><div className="icon">📅</div><p>No appointments today</p></div>
            ) : (
              <div className="table-container">
                <table>
                  <thead><tr><th>Patient</th><th>Doctor</th><th>Time</th><th>Status</th></tr></thead>
                  <tbody>
                    {todayAppts.map(a => (
                      <tr key={a.id}>
                        <td><strong>{a.patient_name}</strong></td>
                        <td style={{ color:'var(--text-muted)' }}>{a.doctor_name}</td>
                        <td>{a.time}</td>
                        <td><span className={`badge badge-${a.status === 'Scheduled' ? 'blue' : a.status === 'Completed' ? 'green' : 'rose'}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card">
            <h3 style={{ fontWeight:700, marginBottom:14 }}>Bed Occupancy</h3>
            <div style={{ height: 200 }}>
              <Doughnut data={doughnutData} options={doughnutOpts} />
            </div>
          </div>

          <div className="card" style={{ flex:1 }}>
            <h3 style={{ fontWeight:700, marginBottom:14 }}>Recent Activity</h3>
            <div className="activity-list">
              {activity.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{ background: a.dot }} />
                  <div>
                    <p style={{ fontSize:13 }}>{a.text}</p>
                    <p className="meta">{a.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
