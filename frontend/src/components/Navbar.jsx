import React from 'react';
import { Link } from 'react-router-dom';
import nieLogo from '../assets/images/nie-logo.png';
import { LogIn, Shield } from 'lucide-react';

export const Navbar = () => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
      }}>
        {/* NIE Branding & CampusFix Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
          <img
            src={nieLogo}
            alt="The National Institute of Engineering (NIE) Mysore Official Logo"
            style={{ height: '52px', objectFit: 'contain' }}
          />
          <div style={{ borderLeft: '1.5px solid #cbd5e1', paddingLeft: '14px' }}>
            <span style={{
              display: 'block',
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}>
              Campus<span style={{ color: '#1e40af' }}>Fix</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.72rem',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              NIE North Campus • Mysore
            </span>
          </div>
        </Link>

        {/* Links & Portals */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#features" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>
            Features
          </a>
          <a href="#how-it-works" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>
            How It Works
          </a>
          <a href="#buildings" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>
            Campus Buildings
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
            <Link to="/student/login" className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>
              <LogIn size={15} />
              Student Portal
            </Link>
            <Link to="/admin/login" className="btn btn-secondary btn-sm" style={{ padding: '8px 16px' }}>
              <Shield size={15} />
              Admin Portal
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
