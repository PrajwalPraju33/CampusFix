import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import nieLogo from '../assets/images/nie-logo.png';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Sparkles,
  User,
  LogOut,
  MapPin,
  Building2,
} from 'lucide-react';

export const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  const navItems = [
    { to: '/student/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/student/submit-complaint', icon: <PlusCircle size={18} />, label: 'Submit Complaint' },
    { to: '/student/my-complaints', icon: <ClipboardList size={18} />, label: 'My Complaints' },
    { to: '/student/assistant', icon: <Sparkles size={18} />, label: 'AI Assistant' },
    { to: '/student/profile', icon: <User size={18} />, label: 'My Profile' },
  ];

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className="portal-sidebar">
        {/* Brand */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.03)',
        }}>
          <div style={{
            background: '#ffffff',
            padding: '8px',
            borderRadius: '10px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={nieLogo}
              alt="NIE Official Logo"
              style={{ maxHeight: '42px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Campus<span style={{ color: '#60a5fa' }}>Fix</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <span className="badge" style={{ background: '#1e3a8a', color: '#93c5fd', fontSize: '0.68rem' }}>
                STUDENT PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '20px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#1e40af' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Campus Badge Info */}
        <div style={{
          padding: '16px',
          margin: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.8rem' }}>
            <Building2 size={16} color="#60a5fa" />
            <span>NIE North Campus</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
            The National Institute of Engineering, Mysuru
          </p>
        </div>

        {/* User Card & Logout */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#1e40af',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem',
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div style={{ maxWidth: '130px', overflow: 'hidden' }}>
              <p style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Student'}
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.72rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="portal-main">
        <header className="portal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.85rem' }}>
              <MapPin size={16} color="#1e40af" />
              <span style={{ fontWeight: 600 }}>NIE North Campus, Mysuru</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <NavLink to="/student/submit-complaint" className="btn btn-primary btn-sm">
              <PlusCircle size={15} />
              Submit Complaint
            </NavLink>
          </div>
        </header>

        <section className="portal-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
