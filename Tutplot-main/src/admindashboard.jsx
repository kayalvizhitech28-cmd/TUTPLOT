import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import "./admindashboard.css";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalClasses: 0,
    totalFeesCollected: 0,
    attendanceToday: 0
  });

  const [studentChartData, setStudentChartData] = useState([]);
  const [feesChartData, setFeesChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [studentsRes, staffRes, feesRes, attendanceRes] = await Promise.all([
          fetch("http://localhost:3000/api/students"),
          fetch("http://localhost:3000/api/staff"),
          fetch("http://localhost:3000/api/fees"),
          fetch("http://localhost:3000/api/attendance")
        ]);

        const students = await studentsRes.json();
        const staff = await staffRes.json();
        const fees = await feesRes.json();
        const attendance = await attendanceRes.json();

        // Process Students
        const totalStudents = students.length;
        const classes = [...new Set(students.map(s => s.class).filter(c => c))];
        const totalClasses = classes.length;
        
        // Students per class for chart
        const classCounts = {};
        students.forEach(s => {
          if (s.class) {
            classCounts[s.class] = (classCounts[s.class] || 0) + 1;
          }
        });
        const chartData = Object.keys(classCounts).map(className => ({
          name: `Class ${className}`,
          students: classCounts[className]
        })).sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

        // Process Fees
        const totalFeesCollected = fees.reduce((sum, f) => sum + (Number(f.fees_paid) || 0), 0);
        const totalPending = students.reduce((sum, s) => sum + (Number(s.pending_fees) || 0), 0);
        
        const fChartData = [
          { name: 'Collected', value: totalFeesCollected },
          { name: 'Pending', value: totalPending }
        ];

        // Process Attendance (Today)
        const today = new Date().toISOString().split('T')[0];
        const todaysAttendance = attendance.filter(a => a.date && new Date(a.date).toISOString().split('T')[0] === today);
        let attendanceRate = 100;
        if (todaysAttendance.length > 0) {
          const present = todaysAttendance.filter(a => a.status === 'present').length;
          attendanceRate = Math.round((present / todaysAttendance.length) * 100);
        } else {
          attendanceRate = "N/A";
        }

        setStats({
          totalStudents,
          totalStaff: staff.length,
          totalClasses,
          totalFeesCollected,
          attendanceToday: attendanceRate
        });

        setStudentChartData(chartData);
        setFeesChartData(fChartData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data", err);
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      {/* Main Content */}
      <div className="main">
        <h1 className="title">ADMIN DASHBOARD</h1>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: '#64748b' }}>
            Loading dashboard data...
          </div>
        ) : (
          <>
            <div className="stats-container">
              <StatCard title="Total Students" value={stats.totalStudents} icon="👨‍🎓" />
              <StatCard title="Total Staff" value={stats.totalStaff} icon="👨‍🏫" />
              <StatCard title="Active Classes" value={stats.totalClasses} icon="🏫" />
              <StatCard title="Fees Collected" value={`₹${stats.totalFeesCollected}`} icon="💰" />
              <StatCard title="Today's Attendance" value={stats.attendanceToday === "N/A" ? "No Data" : `${stats.attendanceToday}%`} icon="📅" />
            </div>

            <div className="charts-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginTop: '40px' }}>
              
              {/* Bar Chart */}
              <div className="chart-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginBottom: '20px', color: '#1e293b', textAlign: 'center' }}>Students per Class</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="chart-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginBottom: '20px', color: '#1e293b', textAlign: 'center' }}>Fees Overview (₹)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feesChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {feesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(value) => `₹${value}`} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

// Reusable Stat Card
function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default AdminDashboard;