import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User, Mail, Building, MapPin, Calendar, Shield } from 'lucide-react';

export const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.student.getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '30px', color: '#64748b' }}>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Student Profile</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Registered account credentials and campus association
        </p>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#1e40af',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: '700',
          }}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{profile?.name}</h2>
            <span className="badge badge-submitted" style={{ marginTop: '4px' }}>
              {profile?.role || 'STUDENT'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Mail size={18} color="#64748b" />
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Email Address</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{profile?.email}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Building size={18} color="#64748b" />
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Institution</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{profile?.institution}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <MapPin size={18} color="#64748b" />
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Assigned Campus</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{profile?.campus}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Calendar size={18} color="#64748b" />
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Account Created</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
