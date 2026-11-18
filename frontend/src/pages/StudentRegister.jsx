import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import nieLogo from '../assets/images/nie-logo.png';
import nieCampusBg from '../assets/images/nie-north-campus.jpg';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const StudentRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campusId, setCampusId] = useState('');
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getCampuses()
      .then((data) => {
        setCampuses(data);
        if (data.length > 0) setCampusId(data[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        campusId: campusId ? parseInt(campusId) : undefined,
      });
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(10, 20, 38, 0.88), rgba(15, 23, 42, 0.92)), url(${nieCampusBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        padding: '36px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '14px' }}>
            <img
              src={nieLogo}
              alt="NIE Official Logo"
              style={{ maxHeight: '54px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </Link>
          <h2 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: '800' }}>
            Student Account Registration
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            Join CampusFix to report issues and track repairs at NIE
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ padding: '10px 14px', fontSize: '0.88rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Prajwal Rao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. yourname@nie.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Campus</label>
            <select
              className="form-control"
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
            >
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              {campuses.length === 0 && (
                <option value="1">NIE North Campus</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min 6 Characters)</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus size={18} />
                Register Account
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '0.88rem',
          color: '#64748b',
        }}>
          Already have an account?{' '}
          <Link to="/student/login" style={{ fontWeight: '700', color: '#1e40af' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
