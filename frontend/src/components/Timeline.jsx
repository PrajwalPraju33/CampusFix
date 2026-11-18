import React from 'react';
import { CheckCircle2, Clock, Wrench, FileCheck } from 'lucide-react';

export const Timeline = ({ history = [], currentStatus }) => {
  const steps = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'VERIFIED', label: 'Verified' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'RESOLUTION_SUBMITTED', label: 'Resolution' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'SUBMITTED': return 0;
      case 'VERIFIED': return 1;
      case 'ASSIGNED': return 2;
      case 'IN_PROGRESS': return 3;
      case 'RESOLUTION_SUBMITTED': return 4;
      case 'CLOSED': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div style={{ marginTop: '16px' }}>
      {/* Visual Stepper Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: '32px',
        padding: '0 10px',
      }}>
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '30px',
          right: '30px',
          height: '4px',
          backgroundColor: '#e2e8f0',
          zIndex: 1,
        }} />
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '30px',
          width: `${Math.min(100, Math.max(0, (currentIndex / (steps.length - 1)) * 90))}%`,
          height: '4px',
          backgroundColor: '#1e40af',
          zIndex: 2,
          transition: 'width 0.4s ease',
        }} />

        {steps.map((s, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={s.key} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 3,
              position: 'relative',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isDone ? '#1e40af' : '#ffffff',
                border: isDone ? '2px solid #1e40af' : '2px solid #cbd5e1',
                color: isDone ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '12px',
                boxShadow: isCurrent ? '0 0 0 4px rgba(30, 64, 175, 0.2)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {isDone ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <span style={{
                marginTop: '8px',
                fontSize: '12px',
                fontWeight: isCurrent ? '700' : '500',
                color: isDone ? '#0f172a' : '#94a3b8',
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit Log / History items */}
      <div className="timeline">
        {history.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No status history available.</p>
        ) : (
          history.map((h, i) => (
            <div key={h.id || i} className="timeline-item">
              <div className="timeline-dot active" />
              <div className="timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>
                    {h.newStatus}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {h.createdAt ? new Date(h.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                {h.remarks && (
                  <p style={{ fontSize: '0.88rem', color: '#334155', marginBottom: '4px' }}>
                    {h.remarks}
                  </p>
                )}
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                  Updated by: {h.updatedBy || 'System'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
