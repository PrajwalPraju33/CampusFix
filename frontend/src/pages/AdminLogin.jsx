import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import nieLogo from '../assets/images/nie-logo.png';
import nieCampusBg from '../assets/images/nie-north-campus.jpg';
import { ShieldCheck, LogIn, AlertCircle, Lock } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.role !== 'ADMIN') {
        throw new Error('Unauthorized: This account does not possess Administrative privileges.');
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@nie.ac.in');
    setPassword('Admin@NIE2026');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(8, 14, 26, 0.92), rgba(15, 23, 42, 0.95)), url(${nieCampusBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        padding: '36px',
        border: '1px solid rgba(217, 119, 6, 0.3)',
      }}>
        {/* Brand & Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '14px' }}>
            <img
              src={nieLogo}
              alt="NIE Official Logo"
              style={{ maxHeight: '54px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </Link>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#fef3c7',
            color: '#b45309',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '700',
            letterSpacing: '0.04em',
            marginBottom: '10px',
          }}>
            <ShieldCheck size={14} />
            ADMINISTRATION CONSOLE
          </div>
          <h2 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: '800' }}>
            Campus Administrator Sign In
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
            Maintenance Desk & Facility Management
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#92400e', display: 'block' }}>
              SEEDED ADMIN CREDENTIALS:
            </span>
            <span style={{ fontSize: '0.82rem', color: '#78350f' }}>
              admin@nie.ac.in / Admin@NIE2026
            </span>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="btn btn-gold btn-sm"
            style={{ fontSize: '0.78rem', padding: '5px 10px', borderRadius: '6px' }}
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ padding: '10px 14px', fontSize: '0.88rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Administrator Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. admin@nie.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter administrator password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#0f172a',
            }}
          >
            {loading ? 'Verifying Credentials...' : (
              <>
                <LogIn size={18} />
                Access Administration Console
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '0.84rem',
          color: '#64748b',
        }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Lock size={14} color="#64748b" />
            Admin accounts are provisioned via secure institutional database seed.
          </p>
          <div style={{ marginTop: '12px' }}>
            <Link to="/student/login" style={{ color: '#1e40af', fontWeight: '600' }}>
              ← Return to Student Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
