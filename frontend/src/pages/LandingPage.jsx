import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import nieLogo from '../assets/images/nie-logo.png';
import nieCampusBg from '../assets/images/nie-north-campus.jpg';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Wifi,
  Zap,
  Droplets,
  Monitor,
  Building2,
  Search,
  MessageSquare,
} from 'lucide-react';

export const LandingPage = () => {
  const buildings = [
    { name: 'Sankaracharya Bhavan', code: 'SB', desc: 'Main academic block housing lecture halls, electronics departments, and faculty cabins.' },
    { name: 'Madhvacharya Bhavan', code: 'MB', desc: 'Computer science & engineering wings, high-performance computing labs, and smart classrooms.' },
    { name: 'Ramanujacharya Bhavan', code: 'RB', desc: 'Mechanical sciences, electrical installations, basic sciences labs, and seminar halls.' },
  ];

  const features = [
    {
      icon: <Sparkles size={24} color="#1e40af" />,
      title: 'AI Smart Complaint Analyzer',
      desc: 'Google Gemini AI analyzes your complaint description in real-time, automatically detecting problem categories, suggesting severity priority, and directing it to the right department.',
    },
    {
      icon: <Search size={24} color="#1e40af" />,
      title: 'Duplicate Detection Engine',
      desc: 'Prevents redundant maintenance calls by automatically detecting if someone already reported a similar issue in the same room or lab location.',
    },
    {
      icon: <Clock size={24} color="#1e40af" />,
      title: 'Real-Time Repair Tracking',
      desc: 'Transparent multi-stage timeline tracking: from submission and admin verification to technician assignment, on-site repair, and resolution closure.',
    },
    {
      icon: <ShieldCheck size={24} color="#1e40af" />,
      title: 'Institutional Grade Security',
      desc: 'Strict role-based access control built on Spring Security and JWT. Clean separation between the Student Portal and the Admin Console.',
    },
    {
      icon: <MessageSquare size={24} color="#1e40af" />,
      title: 'CampusFix AI Assistant',
      desc: 'Integrated AI chat advisor answering questions about campus repair procedures, turnarounds, Wi-Fi connectivity, and facilities maintenance.',
    },
    {
      icon: <CheckCircle2 size={24} color="#1e40af" />,
      title: 'Student Feedback & Rating',
      desc: 'Close the loop with student ratings and comments after repairs are verified, ensuring high maintenance accountability across the campus.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(rgba(10, 20, 38, 0.88), rgba(15, 23, 42, 0.92)), url(${nieCampusBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '80px 0',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginBottom: '24px',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'inline-block',
              }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>
                NIE North Campus • Smart Maintenance System
              </span>
            </div>

            <h1 style={{
              fontSize: '3.4rem',
              fontWeight: '800',
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '20px',
            }}>
              Smarter Campus.<br />
              <span style={{
                background: 'linear-gradient(90deg, #60a5fa, #93c5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Faster Maintenance.
              </span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: '#cbd5e1',
              lineHeight: '1.6',
              marginBottom: '36px',
              maxWidth: '680px',
            }}>
              Report campus issues, track repairs, and keep your campus running with AI-powered CampusFix. Designed specifically for The National Institute of Engineering, Mysore.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link to="/student/login" className="btn btn-primary btn-lg" style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                color: '#ffffff',
                border: 'none',
              }}>
                Student Portal Login
                <ArrowRight size={18} />
              </Link>
              <Link to="/admin/login" className="btn btn-secondary btn-lg" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
              }}>
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Buildings Section */}
      <section id="buildings" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              NIE North Campus Facilities
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px', color: '#0f172a' }}>
              Campus Buildings & Coverage
            </h2>
            <p style={{ color: '#64748b', marginTop: '12px' }}>
              CampusFix monitors maintenance across all primary blocks at NIE North Campus, Mysuru.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {buildings.map((b, i) => (
              <div key={b.code} className="card card-hover" style={{ borderTop: '4px solid #1e40af' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Building2 size={22} />
                  </div>
                  <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                    Code: {b.code}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#0f172a' }}>
                  {b.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Next-Gen Maintenance Architecture
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px', color: '#0f172a' }}>
              Engineered with Intelligence & Transparency
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} className="card card-hover" style={{ padding: '28px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#0f172a' }}>
                  {f.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Complaint Lifecycle
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px', color: '#0f172a' }}>
              How CampusFix Resolves Issues
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Submit Complaint', desc: 'Select building, enter room number, describe the problem, and run AI analysis.' },
              { step: '02', title: 'Verification', desc: 'Admin office reviews the request and validates against duplicates.' },
              { step: '03', title: 'Technician Assigned', desc: 'Assigned to qualified electrical, plumbing, network, or civil personnel.' },
              { step: '04', title: 'On-Site Repair', desc: 'Status updates to IN_PROGRESS while technician resolves the issue.' },
              { step: '05', title: 'Closure & Feedback', desc: 'Admin approves resolution, closes complaint, and student rates the service.' },
            ].map((st, i) => (
              <div key={st.step} style={{
                padding: '24px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e40af' }}>{st.step}</span>
                <h4 style={{ fontSize: '1.05rem', margin: '10px 0 6px 0', color: '#0f172a' }}>{st.title}</h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.5' }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        backgroundColor: '#0a1426',
        color: '#94a3b8',
        padding: '48px 0 24px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px', marginBottom: '36px' }}>
            <div style={{ maxWidth: '380px' }}>
              <div style={{
                background: '#ffffff',
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '8px',
                marginBottom: '14px',
              }}>
                <img src={nieLogo} alt="NIE Logo" style={{ height: '36px' }} />
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#cbd5e1' }}>
                CampusFix is the official AI-Powered Campus Maintenance Management System for The National Institute of Engineering (NIE), Mysore.
              </p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>
                NIE North Campus, Koorgalli Industrial Area, Mysuru - 570018
              </p>
            </div>

            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '14px' }}>Portals</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <li><Link to="/student/login" style={{ color: '#94a3b8' }}>Student Portal</Link></li>
                <li><Link to="/student/register" style={{ color: '#94a3b8' }}>Student Registration</Link></li>
                <li><Link to="/admin/login" style={{ color: '#94a3b8' }}>Admin Console</Link></li>
              </ul>
            </div>

            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '14px' }}>Campus Buildings</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <li>Sankaracharya Bhavan</li>
                <li>Madhvacharya Bhavan</li>
                <li>Ramanujacharya Bhavan</li>
              </ul>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
          }}>
            <p>© {new Date().getFullYear()} The National Institute of Engineering (NIE), Mysore. All rights reserved.</p>
            <p>CampusFix • AI-Powered Campus Maintenance Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
