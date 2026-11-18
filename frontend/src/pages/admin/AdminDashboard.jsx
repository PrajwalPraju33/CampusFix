import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Building,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '30px', color: '#64748b' }}>Loading administrative dashboard...</div>;
  }

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091322 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '30px 32px',
        color: '#ffffff',
        marginBottom: '32px',
        border: '1px solid rgba(217, 119, 6, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div>
          <span className="badge" style={{ backgroundColor: '#78350f', color: '#fde68a', marginBottom: '8px' }}>
            <ShieldCheck size={12} /> NIE NORTH CAMPUS MAINTENANCE OPERATIONS
          </span>
          <h1 style={{ fontSize: '1.8rem', color: '#ffffff', marginTop: '4px' }}>
            Administrative Maintenance Console
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Real-time oversight of complaints, technician assignments, and facility resolutions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/complaints" className="btn btn-gold" style={{ padding: '12px 20px' }}>
            <ClipboardList size={16} /> Manage All Complaints
          </Link>
          <Link to="/admin/campuses" className="btn btn-secondary" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}>
            <Building size={16} /> Facilities
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div className="card card-hover" style={{ borderLeft: '4px solid #1e40af' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>TOTAL RECORDED</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            {stats?.totalComplaints || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Across all buildings</span>
        </div>

        <div className="card card-hover" style={{ borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0284c7' }}>NEW SUBMITTED</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0369a1', margin: '4px 0' }}>
            {stats?.newComplaints || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0284c7' }}>Awaiting verification</span>
        </div>

        <div className="card card-hover" style={{ borderLeft: '4px solid #d97706' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#b45309' }}>VERIFIED</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
            {stats?.verifiedComplaints || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309' }}>Ready for assignment</span>
        </div>

        <div className="card card-hover" style={{ borderLeft: '4px solid #7c3aed' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7c3aed' }}>ASSIGNED</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6d28d9', margin: '4px 0' }}>
            {stats?.assignedComplaints || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#7c3aed' }}>Personnel dispatched</span>
        </div>

        <div className="card card-hover" style={{ borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' }}>IN PROGRESS</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1d4ed8', margin: '4px 0' }}>
            {stats?.inProgressComplaints || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>On-site active work</span>
        </div>

        <div className="card card-hover" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669' }}>RESOLVED / CLOSED</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', margin: '4px 0' }}>
            {(stats?.closedComplaints || 0) + (stats?.resolvedComplaints || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669' }}>Verified & completed</span>
        </div>

        <div className="card card-hover" style={{ borderLeft: '4px solid #ef4444' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#dc2626' }}>REJECTED</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b91c1c', margin: '4px 0' }}>
            {stats?.rejectedComplaints || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>Duplicate / invalid</span>
        </div>
      </div>

      {/* Priority & Category Distributions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '16px' }}>
            Priority Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => {
              const count = stats?.priorityDistribution?.[p] || 0;
              const total = stats?.totalComplaints || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={p}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{p}</span>
                    <span style={{ color: '#64748b' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: p === 'CRITICAL' ? '#ef4444' : p === 'HIGH' ? '#f59e0b' : p === 'MEDIUM' ? '#0284c7' : '#64748b',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '16px' }}>
            Top Maintenance Categories
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats?.categoryDistribution && Object.keys(stats.categoryDistribution).length > 0 ? (
              Object.entries(stats.categoryDistribution).slice(0, 5).map(([cat, cnt]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>{cat}</span>
                  <span className="badge badge-submitted">{cnt} Issues</span>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>No category data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Complaints Awaiting Action */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Recent Campus Complaints</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Review issues reported by students</p>
          </div>
          <Link to="/admin/complaints" style={{ fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Manage All Complaints
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Student</th>
                <th>Building & Room</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentComplaints?.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#1e40af' }}>{c.complaintNumber}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.problemTitle}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.category}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: '#0f172a' }}>{c.userName}</div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.userEmail}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{c.buildingName}</span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>{c.roomLabNo}</span>
                  </td>
                  <td><PriorityBadge priority={c.priority} /></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <Link to={`/admin/complaints/${c.id}`} className="btn btn-primary btn-sm">
                      Manage & Verify
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
