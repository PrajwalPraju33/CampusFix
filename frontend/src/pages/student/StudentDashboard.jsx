import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import {
  PlusCircle,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.student.getMyComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message || 'Failed to load your complaints');
    } finally {
      setLoading(false);
    }
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'SUBMITTED' || c.status === 'VERIFIED').length;
  const inProgress = complaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLUTION_SUBMITTED' || c.status === 'CLOSED').length;

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1e36 0%, #1e3a8a 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: '#ffffff',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.25)',
      }}>
        <div>
          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#93c5fd', marginBottom: '8px' }}>
            STUDENT DASHBOARD
          </span>
          <h1 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '6px' }}>
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Report infrastructure issues across NIE North Campus and track repair milestones in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/student/submit-complaint" className="btn btn-gold" style={{ padding: '12px 22px' }}>
            <PlusCircle size={18} />
            Submit New Complaint
          </Link>
          <Link to="/student/assistant" className="btn btn-secondary" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}>
            <Sparkles size={16} />
            AI Assistant
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>Total Complaints</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '10px' }}>
            {loading ? '...' : total}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>All reported issues</span>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>Pending Verification</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '10px' }}>
            {loading ? '...' : pending}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#b45309' }}>Awaiting desk review</span>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>In Progress / Assigned</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '10px' }}>
            {loading ? '...' : inProgress}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#1d4ed8' }}>Active on-site repair</span>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>Resolved & Closed</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '10px' }}>
            {loading ? '...' : resolved}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#047857' }}>Completed maintenance</span>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Recent Maintenance Complaints</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Track the progress of your latest requests</p>
          </div>
          <Link to="/student/my-complaints" style={{ fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All ({complaints.length})
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#64748b', padding: '20px 0' }}>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
            <ClipboardList size={40} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>No complaints filed yet</p>
            <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
              Experiencing any Wi-Fi, electrical, lab equipment, or plumbing issues? Submit your first complaint.
            </p>
            <Link to="/student/submit-complaint" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
              <PlusCircle size={14} /> Submit Complaint
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Issue Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#1e40af' }}>{c.complaintNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.problemTitle}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                      </span>
                    </td>
                    <td>{c.category}</td>
                    <td>
                      <span style={{ color: '#334155', fontWeight: 500 }}>{c.buildingName}</span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>{c.roomLabNo}</span>
                    </td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <Link to={`/student/complaints/${c.id}`} className="btn btn-secondary btn-sm">
                        Track Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
