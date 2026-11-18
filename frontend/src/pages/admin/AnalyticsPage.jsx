import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  Building,
  Shield,
} from 'lucide-react';

export const AnalyticsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getReports()
      .then((data) => setReport(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ padding: '30px', color: '#64748b' }}>Generating institutional maintenance reports...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Maintenance Analytics & Reports</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Performance metrics and resolution tracking for NIE North Campus
          </p>
        </div>

        <button onClick={handlePrint} className="btn btn-secondary">
          <Printer size={16} /> Print / Export Official Report
        </button>
      </div>

      {/* Institutional Header Card */}
      <div className="card" style={{ padding: '24px 30px', marginBottom: '24px', backgroundColor: '#f8fafc', borderLeft: '4px solid #1e40af' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
              OFFICIAL FACILITY REPORT
            </span>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginTop: '2px' }}>
              {report?.institution || 'The National Institute of Engineering (NIE), Mysore'}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Campus: {report?.campus || 'NIE North Campus, Mysuru'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>TOTAL REPORTED</span>
              <strong style={{ fontSize: '1.6rem', color: '#0f172a' }}>{report?.totalComplaints || 0}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>RESOLUTION RATE</span>
              <strong style={{ fontSize: '1.6rem', color: '#10b981' }}>{report?.resolvedRate || '0%'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '16px' }}>
            Complaints by Lifecycle Stage
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Lifecycle Stage</th>
                <th style={{ textAlign: 'right' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {report?.statusBreakdown && Object.entries(report.statusBreakdown).map(([st, cnt]) => (
                <tr key={st}>
                  <td><strong>{st}</strong></td>
                  <td style={{ textAlign: 'right' }}>{cnt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '16px' }}>
            Complaints by Category
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Maintenance Category</th>
                <th style={{ textAlign: 'right' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {report?.categoryBreakdown && Object.entries(report.categoryBreakdown).map(([cat, cnt]) => (
                <tr key={cat}>
                  <td><strong>{cat}</strong></td>
                  <td style={{ textAlign: 'right' }}>{cnt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
