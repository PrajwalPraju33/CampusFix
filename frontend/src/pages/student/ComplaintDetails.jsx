import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
  Star,
  CheckCircle2,
  Edit,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit Mode state (only available if SUBMITTED)
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    category: '',
    problemTitle: '',
    description: '',
    roomLabNo: '',
    priority: 'MEDIUM',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Feedback state
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const data = await api.student.getComplaint(id);
      setComplaint(data);
      setEditForm({
        category: data.category,
        problemTitle: data.problemTitle,
        description: data.description,
        roomLabNo: data.roomLabNo,
        priority: data.priority,
      });
    } catch (err) {
      setError(err.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const updated = await api.student.updatePendingComplaint(id, editForm);
      setComplaint(updated);
      setIsEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to update pending complaint.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const updated = await api.student.submitFeedback(id, { rating, comments });
      setComplaint(updated);
    } catch (err) {
      alert(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#64748b' }}>Loading complaint record...</div>;
  }

  if (error || !complaint) {
    return (
      <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={20} />
        <div>
          <strong>Error loading complaint:</strong> {error || 'Record not found.'}
          <div style={{ marginTop: '10px' }}>
            <Link to="/student/my-complaints" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> Back to My Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Back button & ID header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Link to="/student/my-complaints" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to My Complaints
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {location.state?.justCreated && (
        <div className="alert alert-success" style={{ marginBottom: '24px' }}>
          <CheckCircle2 size={18} />
          <span>
            Complaint successfully submitted! Your tracking ID is <strong>{complaint.complaintNumber}</strong>. Our maintenance desk will verify and dispatch technicians shortly.
          </span>
        </div>
      )}

      {/* Main Details Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
              Complaint ID: {complaint.complaintNumber}
            </span>
            <h1 style={{ fontSize: '1.6rem', color: '#0f172a', marginTop: '4px' }}>
              {complaint.problemTitle}
            </h1>
          </div>

          {complaint.status === 'SUBMITTED' && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Edit size={14} /> Edit Pending Complaint
            </button>
          )}
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
              <Building2 size={14} /> Campus & Building
            </span>
            <span style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginTop: '2px' }}>
              {complaint.buildingName} ({complaint.campusName})
            </span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
              <MapPin size={14} /> Specific Location
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
              <Calendar size={14} /> Submitted At
            </span>
            <span style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginTop: '2px' }}>
              {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : ''}
            </span>
          </div>
        </div>

        {/* Edit Form if enabled */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0f172a' }}>Edit Complaint Details</h3>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={editForm.problemTitle}
                onChange={(e) => setEditForm({ ...editForm, problemTitle: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room / Lab No</label>
              <input
                type="text"
                className="form-control"
                value={editForm.roomLabNo}
                onChange={(e) => setEditForm({ ...editForm, roomLabNo: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Problem Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={savingEdit}>
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
              Problem Description
            </h4>
            <p style={{ color: '#1e293b', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {complaint.description}
            </p>
          </div>
        )}

        {/* Attachments Section */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '12px', fontWeight: 600 }}>
              Attached Photograph / Evidence
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

      {/* Assigned Personnel Info (if assigned) */}
      {complaint.assignments && complaint.assignments.length > 0 && (
        <div className="card" style={{ padding: '24px', marginBottom: '24px', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#1e40af', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#1e3a8a' }}>Assigned Maintenance Technician</h3>
              <p style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Personnel dispatched by Administration</p>
            </div>
          </div>

          {complaint.assignments.map((a) => (
            <div key={a.id} style={{ backgroundColor: '#ffffff', padding: '14px 18px', borderRadius: '8px', border: '1px solid #dbeafe', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{a.assignedTo}</strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Assigned: {a.assignedAt ? new Date(a.assignedAt).toLocaleString() : ''}
                </span>
              </div>
              {a.remarks && (
                <p style={{ fontSize: '0.88rem', color: '#334155', marginTop: '6px' }}>
                  Instructions: {a.remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progress Timeline Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>
          Complaint Resolution Timeline
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px' }}>
          Status progression from initial submission to final closure
        </p>

        <Timeline history={complaint.timeline || []} currentStatus={complaint.status} />
      </div>

      {/* Student Feedback Section */}
      {complaint.status === 'CLOSED' && (
        <div className="card" style={{ padding: '28px', borderTop: '4px solid #10b981' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '6px' }}>
            Resolution Feedback & Rating
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '16px' }}>
            This complaint is closed. Please rate the speed and quality of the maintenance team.
          </p>

          {complaint.feedback ? (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', color: '#eab308' }}>
                  {[...Array(complaint.feedback.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#eab308" />
                  ))}
                </div>
                <strong style={{ fontSize: '0.9rem', color: '#166534' }}>
                  {complaint.feedback.rating} out of 5 Stars
                </strong>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#14532d' }}>
                "{complaint.feedback.comments || 'No comments provided.'}"
              </p>
              <span style={{ fontSize: '0.75rem', color: '#65a30d', marginTop: '6px', display: 'block' }}>
                Submitted on {complaint.feedback.createdAt ? new Date(complaint.feedback.createdAt).toLocaleDateString() : ''}
              </span>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label className="form-label">Service Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <Star
                        size={28}
                        color="#eab308"
                        fill={star <= rating ? '#eab308' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Comments or Remarks</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Was the problem fixed satisfactorily? Any suggestions?"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submittingFeedback}
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Service Feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
