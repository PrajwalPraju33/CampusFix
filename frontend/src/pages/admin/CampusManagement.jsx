import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Building2, Plus, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const CampusManagement = () => {
  const [campuses, setCampuses] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newBuildingName, setNewBuildingName] = useState('');
  const [newBuildingCode, setNewBuildingCode] = useState('');
  const [selectedCampusId, setSelectedCampusId] = useState('');
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campusesData, buildingsData] = await Promise.all([
        api.getCampuses(),
        api.getBuildings(),
      ]);
      setCampuses(campusesData);
      setBuildings(buildingsData);
      if (campusesData.length > 0) {
        setSelectedCampusId(campusesData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    if (!newBuildingName.trim() || !newBuildingCode.trim()) return;

    setAdding(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.admin.createBuilding({
        campusId: parseInt(selectedCampusId),
        name: newBuildingName.trim(),
        code: newBuildingCode.trim(),
      });
      setSuccessMsg(`Building "${newBuildingName}" successfully added.`);
      setNewBuildingName('');
      setNewBuildingCode('');
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add building');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Campus & Facility Management</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Configure institutional buildings, blocks, and coverage areas for maintenance dispatch.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Buildings Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px' }}>
          Active Buildings at NIE North Campus
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {buildings.map((b) => (
            <div key={b.id} className="card card-hover" style={{ borderLeft: '4px solid #1e40af' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                  Code: {b.code}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  ID #{b.id}
                </span>
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '4px' }}>
                {b.name}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                <MapPin size={13} color="#64748b" />
                NIE North Campus, Mysuru
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Building Form */}
      <div className="card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '6px' }}>
          Add New Campus Building / Block
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
          Register an additional building block in the database for complaint routing.
        </p>

        <form onSubmit={handleAddBuilding}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Campus</label>
              <select
                className="form-control"
                value={selectedCampusId}
                onChange={(e) => setSelectedCampusId(e.target.value)}
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Building Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Visvesvaraya Bhavan"
                value={newBuildingName}
                onChange={(e) => setNewBuildingName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Building Code *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. VB"
                value={newBuildingCode}
                onChange={(e) => setNewBuildingCode(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={adding}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> {adding ? 'Adding...' : 'Add Building to Database'}
          </button>
        </form>
      </div>
    </div>
  );
};
