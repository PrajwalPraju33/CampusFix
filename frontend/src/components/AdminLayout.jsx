import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import nieLogo from '../assets/images/nie-logo.png';
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Building,
  LogOut,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Admin Dashboard' },
    { to: '/admin/complaints', icon: <ClipboardList size={18} />, label: 'All Complaints' },
    { to: '/admin/analytics', icon: <BarChart3 size={18} />, label: 'Analytics & Reports' },
    { to: '/admin/campuses', icon: <Building size={18} />, label: 'Campus Management' },
  ];

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className="portal-sidebar" style={{ backgroundColor: '#091322' }}>
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
              Campus<span style={{ color: '#f59e0b' }}>Fix</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <span className="badge" style={{ background: '#78350f', color: '#fde68a', fontSize: '0.68rem' }}>
                <ShieldCheck size={12} />
                ADMINISTRATION CONSOLE
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
              end={item.to === '/admin/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#b45309' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Administration Scope Info */}
        <div style={{
          padding: '16px',
          margin: '14px',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(217, 119, 6, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fde68a', fontSize: '0.8rem', fontWeight: '600' }}>
            <ShieldCheck size={16} />
            <span>Authorized Scope</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#fed7aa', marginTop: '4px' }}>
            Campus: NIE North Campus
          </p>
          <p style={{ fontSize: '0.72rem', color: '#fdba74' }}>
            All Facilities & Departments
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
              backgroundColor: '#b45309',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem',
            }}>
              A
            </div>
            <div style={{ maxWidth: '130px', overflow: 'hidden' }}>
              <p style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Administrator'}
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
              <MapPin size={16} color="#b45309" />
              <span style={{ fontWeight: 600 }}>NIE North Campus Maintenance Desk</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Administrator: <strong>{user?.name}</strong>
            </span>
          </div>
        </header>

        <section className="portal-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
