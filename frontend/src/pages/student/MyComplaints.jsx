import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import {
  ClipboardList,
  Search,
  Filter,
  PlusCircle,
  Eye,
  AlertCircle,
} from 'lucide-react';

export const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.student.getMyComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve your complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.complaintNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problemTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomLabNo?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return c.status === 'SUBMITTED' || c.status === 'VERIFIED';
    if (statusFilter === 'IN_PROGRESS') return c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS';
    if (statusFilter === 'RESOLVED') return c.status === 'RESOLUTION_SUBMITTED' || c.status === 'CLOSED';
    if (statusFilter === 'REJECTED') return c.status === 'REJECTED';

    return c.status === statusFilter;
  });

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>My Maintenance Complaints</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Review status updates, assigned technicians, and resolution histories.
          </p>
        </div>
        <Link to="/student/submit-complaint" className="btn btn-primary">
          <PlusCircle size={16} />
          Submit Complaint
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Search box */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by ID, title, room, category..."
              style={{ paddingLeft: '38px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'PENDING', label: 'Pending' },
              { id: 'IN_PROGRESS', label: 'In Progress' },
              { id: 'RESOLVED', label: 'Resolved' },
              { id: 'REJECTED', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className="btn btn-sm"
                style={{
                  backgroundColor: statusFilter === tab.id ? '#1e40af' : '#f1f5f9',
                  color: statusFilter === tab.id ? '#ffffff' : '#475569',
                  border: 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card">
        {loading ? (
          <p style={{ color: '#64748b', padding: '24px 0' }}>Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
            <ClipboardList size={40} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>No complaints found</p>
            <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filter.'
                : 'You have not submitted any complaints yet.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Campus Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#1e40af' }}>{c.complaintNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.problemTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.description}
                      </div>
                    </td>
                    <td>{c.category}</td>
                    <td>
                      <span style={{ fontWeight: 500, color: '#334155' }}>{c.buildingName}</span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>{c.roomLabNo}</span>
                    </td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                    </td>
                    <td>
                      <Link to={`/student/complaints/${c.id}`} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={13} /> Details
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
