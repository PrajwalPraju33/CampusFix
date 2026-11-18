import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Sparkles,
  AlertTriangle,
  Upload,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  MapPin,
  HelpCircle,
} from 'lucide-react';

export const SubmitComplaint = () => {
  const navigate = useNavigate();

  const [campuses, setCampuses] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    campusId: '',
    buildingId: '',
    category: 'Wi-Fi and Network',
    problemTitle: '',
    roomLabNo: '',
    description: '',
    priority: 'MEDIUM',
  });

  const [file, setFile] = useState(null);
  const [uploadedPath, setUploadedPath] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');

  // Duplicate Check state
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [potentialDuplicates, setPotentialDuplicates] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Load Campuses
    api.getCampuses()
      .then((data) => {
        setCampuses(data);
        if (data.length > 0) {
          const firstCampusId = data[0].id;
          setFormData((prev) => ({ ...prev, campusId: firstCampusId }));
          return api.getBuildings(firstCampusId);
        }
      })
      .then((bldgs) => {
        if (bldgs) {
          setBuildings(bldgs);
          if (bldgs.length > 0) {
            setFormData((prev) => ({ ...prev, buildingId: bldgs[0].id }));
          }
        }
      })
      .catch((err) => console.error(err));

    // Load Categories
    api.getCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error(err));
  }, []);

  const handleCampusChange = async (e) => {
    const cId = e.target.value;
    setFormData((prev) => ({ ...prev, campusId: cId }));
    try {
      const bldgs = await api.getBuildings(cId);
      setBuildings(bldgs);
      if (bldgs.length > 0) {
        setFormData((prev) => ({ ...prev, buildingId: bldgs[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsUploading(true);
    try {
      const res = await api.upload(selectedFile);
      setUploadedPath(res.filePath);
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAiAnalysis = async () => {
    if (!formData.description || formData.description.length < 5) {
      setAiError('Please enter a problem description first to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAiError('');
    try {
      const selectedBuilding = buildings.find(b => b.id.toString() === formData.buildingId?.toString());
      const res = await api.ai.analyze({
        problemTitle: formData.problemTitle,
        description: formData.description,
        category: formData.category,
        campusId: formData.campusId ? parseInt(formData.campusId) : undefined,
        buildingId: formData.buildingId ? parseInt(formData.buildingId) : undefined,
        buildingName: selectedBuilding?.name || '',
        roomLabNo: formData.roomLabNo,
      });

      setAiResult(res);

      // Populate / suggest values if not already customized
      if (res.suggestedPriority) {
        setFormData(prev => ({ ...prev, priority: res.suggestedPriority }));
      }
      if (res.problemTitle && (!formData.problemTitle || formData.problemTitle.trim().length === 0)) {
        setFormData(prev => ({ ...prev, problemTitle: res.problemTitle }));
      }
      if (res.category && categories.some(c => c.name === res.category)) {
        setFormData(prev => ({ ...prev, category: res.category }));
      }

      // Check duplicates
      if (res.duplicateWarning && res.potentialDuplicates?.length > 0) {
        setDuplicateWarning(true);
        setPotentialDuplicates(res.potentialDuplicates);
      } else {
        setDuplicateWarning(false);
        setPotentialDuplicates([]);
      }
    } catch (err) {
      setAiError('AI analysis unavailable. You can still submit your complaint directly.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      const payload = {
        campusId: parseInt(formData.campusId),
        buildingId: parseInt(formData.buildingId),
        category: formData.category,
        problemTitle: formData.problemTitle,
        description: formData.description,
        roomLabNo: formData.roomLabNo,
        priority: formData.priority,
        attachmentPaths: uploadedPath ? [uploadedPath] : [],
      };

      const res = await api.student.submitComplaint(payload);
      navigate(`/student/complaints/${res.id}`, { state: { justCreated: true, complaintNumber: res.complaintNumber } });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit complaint. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Submit Maintenance Complaint</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Report physical, electrical, network, or laboratory issues for NIE North Campus.
        </p>
      </div>

      {submitError && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{submitError}</span>
        </div>
      )}

      {/* Duplicate Complaint Warning Banner */}
      {duplicateWarning && (
        <div className="alert alert-warning" style={{ display: 'block', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={20} color="#b45309" />
            <strong style={{ fontSize: '1rem', color: '#92400e' }}>
              Potential Duplicate Complaint Detected!
            </strong>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#78350f', marginBottom: '12px' }}>
            Our smart detection engine noticed similar open maintenance complaints reported in the same location:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {potentialDuplicates.map((dup) => (
              <div key={dup.id} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #fde68a',
                fontSize: '0.85rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>{dup.complaintNumber}: {dup.problemTitle}</span>
                  <span className="badge badge-in_progress">{dup.status}</span>
                </div>
                <div style={{ color: '#64748b', marginTop: '4px', fontSize: '0.8rem' }}>
                  Location: {dup.roomLabNo} • Similarity: {Math.round(dup.similarityScore * 100)}% ({dup.matchReason})
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: '#92400e', marginTop: '10px', fontStyle: 'italic' }}>
            * If your problem is distinct from the issues listed above, you may safely proceed with your submission.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
        {/* Campus & Building Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">
              <MapPin size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Institution Campus
            </label>
            <select
              className="form-control"
              value={formData.campusId}
              onChange={handleCampusChange}
              required
            >
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              {campuses.length === 0 && <option value="1">NIE North Campus</option>}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Building2 size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Building / Block
            </label>
            <select
              className="form-control"
              value={formData.buildingId}
              onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
              required
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Room / Lab No Input */}
        <div className="form-group">
          <label className="form-label">
            Specific Room / Lab / Location Details *
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Lab 204, Classroom 301, 2nd Floor Corridor Restroom"
            value={formData.roomLabNo}
            onChange={(e) => setFormData({ ...formData, roomLabNo: e.target.value })}
            required
          />
          <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Provide exact room numbers or physical reference locations to assist maintenance technicians.
          </span>
        </div>

        {/* Category Selection */}
        <div className="form-group">
          <label className="form-label">Maintenance Category *</label>
          <select
            className="form-control"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          {/* Subcategory helper text */}
          {categories.find(c => c.name === formData.category)?.description && (
            <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Common issues: {categories.find(c => c.name === formData.category)?.description}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Complaint Title *</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Wi-Fi router unreachable, DHCP failure in Lab 204"
            value={formData.problemTitle}
            onChange={(e) => setFormData({ ...formData, problemTitle: e.target.value })}
            required
          />
        </div>

        {/* Description & AI Button */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Detailed Problem Description *</label>
            <button
              type="button"
              onClick={handleAiAnalysis}
              disabled={isAnalyzing}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.78rem',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                borderColor: '#bfdbfe',
              }}
            >
              <Sparkles size={14} color="#1d4ed8" />
              {isAnalyzing ? 'Analyzing with Gemini...' : 'Analyze with AI'}
            </button>
          </div>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Describe what is broken, when it started happening, error codes, noise, physical damage..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          {aiError && (
            <span style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '4px', display: 'block' }}>
              {aiError}
            </span>
          )}
        </div>

        {/* AI Suggestions Box (if analyzed) */}
        {aiResult && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '18px 20px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={18} color="#15803d" />
              <strong style={{ fontSize: '0.95rem', color: '#166534' }}>
                Gemini Smart Complaint Analysis
              </strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#4b5563' }}>Suggested Category:</span>{' '}
                <strong style={{ color: '#0f172a' }}>{aiResult.category}</strong>
              </div>
              <div>
                <span style={{ color: '#4b5563' }}>Suggested Priority:</span>{' '}
                <strong style={{ color: '#0f172a' }}>{aiResult.suggestedPriority}</strong>
              </div>
              <div>
                <span style={{ color: '#4b5563' }}>Department:</span>{' '}
                <strong style={{ color: '#0f172a' }}>{aiResult.maintenanceDepartment}</strong>
              </div>
              <div>
                <span style={{ color: '#4b5563' }}>Actionable Summary:</span>{' '}
                <strong style={{ color: '#0f172a' }}>{aiResult.recommendedAction}</strong>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '10px', fontStyle: 'italic' }}>
              Summary: {aiResult.summary}
            </p>
          </div>
        )}

        {/* Priority & Photo Attachment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Urgency / Priority</label>
            <select
              className="form-control"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="LOW">LOW (Minor cosmetic / non-urgent)</option>
              <option value="MEDIUM">MEDIUM (Standard maintenance)</option>
              <option value="HIGH">HIGH (Disrupts classes / labs)</option>
              <option value="CRITICAL">CRITICAL (Safety hazard / electrical sparks)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Attach Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileUpload}
            />
            {isUploading && (
              <span style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '4px', display: 'block' }}>
                Uploading image...
              </span>
            )}
            {uploadedPath && (
              <span style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> Image attached successfully
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/student/dashboard')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || isUploading}
            style={{ padding: '12px 28px' }}
          >
            {submitting ? 'Submitting Complaint...' : 'Submit Maintenance Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};
