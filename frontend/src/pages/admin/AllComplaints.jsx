import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import { Search, Filter, Wrench, AlertCircle, Eye } from 'lucide-react';

export const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [complaintsData, buildingsData, categoriesData] = await Promise.all([
        api.admin.getComplaints(),
        api.getBuildings(),
        api.getCategories(),
      ]);
      setComplaints(complaintsData);
      setBuildings(buildingsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getComplaints({
        buildingId: buildingFilter ? parseInt(buildingFilter) : undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      });
      setComplaints(data);
    } catch (err) {
      setError(err.message || 'Failed to filter complaints');
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.complaintNumber?.toLowerCase().includes(q) ||
      c.problemTitle?.toLowerCase().includes(q) ||
      c.roomLabNo?.toLowerCase().includes(q) ||
      c.userName?.toLowerCase().includes(q) ||
      c.userEmail?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>All Campus Complaints</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Inspect, verify, dispatch technicians, and resolve maintenance reports across NIE North Campus.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '12px' }} />
              <input
                type="text"
                className="form-control"
                placeholder="ID, Title, Room, Student..."
                style={{ paddingLeft: '34px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Building Block</label>
            <select
              className="form-control"
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
            >
              <option value="">All Buildings</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Lifecycle Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLUTION_SUBMITTED">Resolution Submitted</option>
              <option value="CLOSED">Closed & Resolved</option>
              <option value="REJECTED">Rejected</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <Filter size={15} /> Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card">
        {loading ? (
          <p style={{ color: '#64748b', padding: '24px 0' }}>Loading complaints...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <p style={{ fontWeight: 600 }}>No complaints match the specified filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title & Category</th>
                  <th>Student</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#1e40af' }}>{c.complaintNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.problemTitle}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.category}</span>
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
                      {c.assignments && c.assignments.length > 0 ? (
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a' }}>
                          {c.assignments[0].assignedTo}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/admin/complaints/${c.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={13} /> Manage
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
