import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import nieLogo from '../assets/images/nie-logo.png';
import nieCampusBg from '../assets/images/nie-north-campus.jpg';
import { LogIn, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/student/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.role !== 'STUDENT') {
        throw new Error('This account is registered as Admin. Please use the Admin Portal.');
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('student@nie.ac.in');
    setPassword('Student@NIE2026');
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
        maxWidth: '460px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        padding: '36px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        {/* Brand & Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '14px' }}>
            <img
              src={nieLogo}
              alt="NIE Official Logo"
              style={{ maxHeight: '54px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </Link>
          <h2 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: '800' }}>
            Student Portal Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            CampusFix • The National Institute of Engineering, Mysore
          </p>
        </div>

        {/* Demo Account Helper */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e40af', display: 'block' }}>
              EXPO DEMO CREDENTIALS:
            </span>
            <span style={{ fontSize: '0.82rem', color: '#1e3a8a' }}>
              student@nie.ac.in / Student@NIE2026
            </span>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="btn btn-primary btn-sm"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert('Please contact the NIE North Campus IT helpdesk to reset your student password.'); }}
                style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: '600' }}
              >
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                Sign In to Student Portal
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
          New to CampusFix?{' '}
          <Link to="/student/register" style={{ fontWeight: '700', color: '#1e40af' }}>
            Register as Student
          </Link>
          <div style={{ marginTop: '12px' }}>
            <Link to="/admin/login" style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Are you an administrator? Switch to <strong>Admin Portal →</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
