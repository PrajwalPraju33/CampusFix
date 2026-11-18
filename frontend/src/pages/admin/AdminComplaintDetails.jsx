import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import { Timeline } from '../../components/Timeline';
import {
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Tag,
  Wrench,
  CheckCircle2,
  XCircle,
  UserCheck,
  RotateCcw,
  AlertCircle,
  FileCheck,
  Send,
} from 'lucide-react';

export const AdminComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals / Action Panels
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' | 'assign' | 'status' | 'resolve'
  const [verifyRemarks, setVerifyRemarks] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [approveAndClose, setApproveAndClose] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const loadComplaint = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getComplaint(id);
      setComplaint(data);
    } catch (err) {
      setError(err.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (verified) => {
    setActionLoading(true);
    setActionSuccess('');
    try {
      const res = await api.admin.verifyComplaint(id, { verified, remarks: verifyRemarks });
      setComplaint(res);
      setActionSuccess(`Complaint successfully ${verified ? 'VERIFIED' : 'REJECTED'}.`);
      setVerifyRemarks('');
    } catch (err) {
      alert(err.message || 'Failed to update verification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignedTo.trim()) return;
    setActionLoading(true);
    setActionSuccess('');
    try {
      const res = await api.admin.assignPersonnel(id, { assignedTo, remarks: assignRemarks });
      setComplaint(res);
      setActionSuccess(`Assigned to ${assignedTo}. Status updated to ASSIGNED.`);
      setAssignedTo('');
      setAssignRemarks('');
    } catch (err) {
      alert(err.message || 'Failed to assign personnel');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionSuccess('');
    try {
      const res = await api.admin.updateStatus(id, { status: newStatus, remarks: statusRemarks });
      setComplaint(res);
      setActionSuccess(`Status updated to ${newStatus}.`);
      setStatusRemarks('');
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionSuccess('');
    try {
      const res = await api.admin.resolveComplaint(id, { resolutionRemarks, approveAndClose });
      setComplaint(res);
      setActionSuccess(approveAndClose ? 'Complaint verified and CLOSED.' : 'Resolution recorded.');
      setResolutionRemarks('');
    } catch (err) {
      alert(err.message || 'Failed to record resolution');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '30px', color: '#64748b' }}>Loading complaint record...</div>;
  }

  if (error || !complaint) {
    return (
      <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={20} />
        <div>
          <strong>Error loading complaint:</strong> {error}
          <div style={{ marginTop: '10px' }}>
            <Link to="/admin/complaints" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> Back to All Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Link to="/admin/complaints" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to All Complaints
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {actionSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '24px' }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Details */}
      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af' }}>
              {complaint.complaintNumber}
            </span>
            <h1 style={{ fontSize: '1.6rem', color: '#0f172a', marginTop: '4px' }}>
              {complaint.problemTitle}
            </h1>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Reported by:</span>{' '}
            <strong style={{ color: '#0f172a' }}>{complaint.userName}</strong>
            <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{complaint.userEmail}</div>
          </div>
        </div>

        {/* Location & Metadata Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          padding: '16px 20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
          fontSize: '0.88rem',
        }}>
          <div>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
              <Building2 size={14} /> Building & Campus
            </span>
            <span style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginTop: '2px' }}>
              {complaint.buildingName} ({complaint.campusName})
            </span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
              <MapPin size={14} /> Room / Location
            </span>
            <span style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginTop: '2px' }}>
              {complaint.roomLabNo}
            </span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
              <Tag size={14} /> Category
            </span>
            <span style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginTop: '2px' }}>
              {complaint.category}
            </span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
              <Calendar size={14} /> Reported At
            </span>
            <span style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginTop: '2px' }}>
              {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : ''}
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
            Problem Description
          </h4>
          <p style={{ color: '#1e293b', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {complaint.description}
          </p>
        </div>

        {/* Attachments */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '12px', fontWeight: 600 }}>
              Attached Photograph
            </h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {complaint.attachments.map((att) => (
                <div key={att.id} style={{ maxWidth: '280px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img src={att.filePath} alt={att.fileName} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ padding: '8px 12px', fontSize: '0.78rem', color: '#64748b' }}>
                    {att.fileName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin Action Control Desk */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px', borderTop: '4px solid #b45309' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>
          Maintenance Dispatch & Control Desk
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px' }}>
          Execute status transitions, technician dispatch, and resolution sign-off
        </p>

        {/* Action Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('verify')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'verify' ? '#b45309' : '#f1f5f9',
              color: activeTab === 'verify' ? '#ffffff' : '#334155',
              border: 'none',
            }}
          >
            <FileCheck size={14} /> 1. Verify / Reject
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assign')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'assign' ? '#b45309' : '#f1f5f9',
              color: activeTab === 'assign' ? '#ffffff' : '#334155',
              border: 'none',
            }}
          >
            <UserCheck size={14} /> 2. Assign Personnel
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'status' ? '#b45309' : '#f1f5f9',
              color: activeTab === 'status' ? '#ffffff' : '#334155',
              border: 'none',
            }}
          >
            <Wrench size={14} /> 3. Update Repair Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resolve')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'resolve' ? '#b45309' : '#f1f5f9',
              color: activeTab === 'resolve' ? '#ffffff' : '#334155',
              border: 'none',
            }}
          >
            <CheckCircle2 size={14} /> 4. Resolution & Closure
          </button>
        </div>

        {/* Tab 1: Verify / Reject */}
        {activeTab === 'verify' && (
          <div>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '10px' }}>Verify Complaint Request</h4>
            <div className="form-group">
              <label className="form-label">Verification Remarks / Notes</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="e.g. Verified with department lab technician. Valid issue."
                value={verifyRemarks}
                onChange={(e) => setVerifyRemarks(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleVerify(true)}
                disabled={actionLoading}
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#10b981', borderColor: '#059669' }}
              >
                <CheckCircle2 size={15} /> Verify Complaint
              </button>
              <button
                type="button"
                onClick={() => handleVerify(false)}
                disabled={actionLoading}
                className="btn btn-danger btn-sm"
              >
                <XCircle size={15} /> Reject Complaint
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Assign Personnel */}
        {activeTab === 'assign' && (
          <form onSubmit={handleAssign}>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '10px' }}>Assign Maintenance Personnel</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Technician / Team Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. K. S. Narayanan (Network Team) or Ramesh Kumar (Electrician)"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Dispatch Remarks / Instructions</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Inspect switch port and replace faulty patch cable."
                  value={assignRemarks}
                  onChange={(e) => setAssignRemarks(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" disabled={actionLoading} className="btn btn-gold btn-sm">
              <UserCheck size={15} /> Dispatch & Assign Technician
            </button>
          </form>
        )}

        {/* Tab 3: Update Repair Status */}
        {activeTab === 'status' && (
          <form onSubmit={handleUpdateStatus}>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '10px' }}>Update Repair Progress</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Target Status</label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="IN_PROGRESS">IN_PROGRESS (Work underway)</option>
                  <option value="ON_HOLD">ON_HOLD (Awaiting spare parts)</option>
                  <option value="REOPENED">REOPENED (Issue recurred)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Progress Remarks</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Technician arrived on site, diagnosed cable fault."
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" disabled={actionLoading} className="btn btn-primary btn-sm">
              <Wrench size={15} /> Update Status
            </button>
          </form>
        )}

        {/* Tab 4: Resolution & Closure */}
        {activeTab === 'resolve' && (
          <form onSubmit={handleResolve}>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '10px' }}>Approve Resolution & Close Complaint</h4>
            <div className="form-group">
              <label className="form-label">Resolution Summary / Technician Sign-Off *</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="e.g. Faulty router replaced with new Cisco 5G AP and tested. Internet operational."
                value={resolutionRemarks}
                onChange={(e) => setResolutionRemarks(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={approveAndClose}
                  onChange={(e) => setApproveAndClose(e.target.checked)}
                />
                <span style={{ fontWeight: 600 }}>Approve and mark complaint as CLOSED (Ready for student feedback)</span>
              </label>
            </div>

            <button type="submit" disabled={actionLoading} className="btn btn-primary btn-sm" style={{ backgroundColor: '#10b981', borderColor: '#059669' }}>
              <CheckCircle2 size={15} /> {approveAndClose ? 'Approve & Close Complaint' : 'Submit Resolution'}
            </button>
          </form>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>
          Audit Trail & Timeline
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px' }}>
          Historical transitions logged by system and administrative staff
        </p>

        <Timeline history={complaint.timeline || []} currentStatus={complaint.status} />
      </div>
    </div>
  );
};
