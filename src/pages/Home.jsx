import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img20m from '../assets/20m.png';
import img8h from '../assets/8h.png';
import img48h from '../assets/48h.png';
import img72h from '../assets/72h.png';
import img2_12w from '../assets/2-12w.png';
import img3_9m from '../assets/3-9m.png';
import img1y from '../assets/1y.png';
import img10y from '../assets/10y.png';

// Icon SVGs
const icons = {
  home: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 10.5L12 4l9 6.5" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 10v8a2 2 0 002 2h3m6 0h3a2 2 0 002-2v-8" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="9" y="14" width="6" height="6" rx="1.5" fill="#44b89d"/></svg>
  ),
  tools: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l-6 6v3h3l6-6m2-2l3.536-3.536a2.5 2.5 0 10-3.536-3.536L11 9m2 2l-2-2" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  quit: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#35a79c" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#44b89d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  challenge: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#35a79c" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#44b89d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  help: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#35a79c" strokeWidth="2"/><path d="M9.09 9a3 3 0 115.82 0c0 1.657-3 2.5-3 4" stroke="#44b89d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="17" r="1" fill="#44b89d"/></svg>
  ),
  search: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#35a79c" strokeWidth="2" fill="none" /><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" /></svg>
  ),
};

function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSearchIconClick = () => {
    setShowSearch((prev) => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSearch(false);
    setSearchValue('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#f4f6f8',
      fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem 0.5rem 2rem',
        background: '#fff',
        boxShadow: '0 8px 32px 0 rgba(0,47,108,0.08)',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        borderBottom: '1.5px solid #e5e8ee',
      }}>
        <button onClick={() => navigate('/')} style={{
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#002f6c',
          letterSpacing: '1px',
          fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}>
          Breathing Free
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search Icon & Input */}
          <div style={{ position: 'relative', marginRight: '1rem' }}>
            <button
              aria-label="Search"
              onClick={handleSearchIconClick}
              style={{
                background: '#e5e8ee',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
                boxShadow: showSearch ? '0 2px 8px #002f6c33' : '0 1px 3px #002f6c22',
                transition: 'box-shadow 0.2s, background 0.2s',
                height: '40px',
                width: '40px',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" fill="#002f6c" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#002f6c" strokeWidth="2" fill="none" /><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#002f6c" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '110%',
              transform: showSearch ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0.5)',
              opacity: showSearch ? 1 : 0,
              pointerEvents: showSearch ? 'auto' : 'none',
              background: 'rgba(255,255,255,0.97)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px #002f6c22',
              padding: showSearch ? '0.5rem 1rem' : '0 0',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              minWidth: '220px',
              border: '1px solid #e5e8ee',
              transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
            }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Search..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    padding: '0.5rem',
                    width: '150px',
                    background: 'transparent',
                    color: '#002f6c',
                  }}
                />
                <button type="submit" style={{
                  background: '#002f6c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.4rem 0.9rem',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px #002f6c22',
                  transition: 'background 0.2s',
                }}>Go</button>
              </form>
            </div>
          </div>
          <Link to="/login" style={{
            padding: '0.5rem 1.5rem',
            background: '#1976d2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: '600',
            boxShadow: '0 4px 12px #002f6c22',
            transition: 'transform 0.2s, background 0.2s',
            border: 'none',
            fontSize: '1.08rem',
          }}>
            Login
          </Link>
          <Link to="/register" style={{
            padding: '0.5rem 1.5rem',
            background: '#0057b8',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: '600',
            boxShadow: '0 4px 12px #002f6c22',
            transition: 'transform 0.2s, background 0.2s',
            border: 'none',
            fontSize: '1.08rem',
          }}>
            Register
          </Link>
        </div>
      </nav>

      {/* Secondary Navigation Bar */}
      <div style={{
        width: '100%',
        background: '#002f6c',
        boxShadow: '0 2px 8px rgba(0, 47, 108, 0.04)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        padding: '0.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 9,
        borderBottom: '2px solid #e5e8ee',
      }}>
        <button onClick={() => navigate('/')} style={navBtnStyle}>Home</button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('tools')} style={navBtnStyle}>Tools & Tips ▾</button>
          {openDropdown === 'tools' && (
            <div style={dropdownMenuStyle}>
              <button style={dropdownBtnStyle}>Create My Quit Plan</button>
              <button style={dropdownBtnStyle}>How to Quit</button>
              <button style={dropdownBtnStyle}>Breathing Free Text Programs</button>
              <button style={dropdownBtnStyle}>Get Extra Help</button>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('quit')} style={navBtnStyle}>Quit Smoking ▾</button>
          {openDropdown === 'quit' && (
            <div style={dropdownMenuStyle}>
              <button style={dropdownBtnStyle}>Getting Started</button>
              <button style={dropdownBtnStyle}>Why You Should Quit</button>
              <button style={dropdownBtnStyle}>Pick Your Path to Quit</button>
              <button style={dropdownBtnStyle}>How to Stay SmokeFree</button>
            </div>
          )}
        </div>
        <button style={navBtnStyle}>Challenges When Quitting</button>
        <button style={navBtnStyle}>Help Others Quit</button>
      </div>

      {/* Hero Section */}
      <section
        style={{
          width: '100%',
          minHeight: '420px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundImage:
            'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginBottom: '0',
        }}
      >
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            color: 'white',
            padding: '3rem 2rem',
            maxWidth: '700px',
            marginLeft: '5vw',
            textShadow: '0 4px 24px rgba(0,47,108,0.18)',
          }}
        >
          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              marginBottom: '1.2rem',
              lineHeight: 1.1,
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            Freedom begins with a<br />
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #0057b8 0%, #1976d2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '3.2rem',
              fontWeight: 900,
            }}>
              breath of fresh air.
            </span>
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              fontWeight: 400,
              color: '#fff',
              maxWidth: '500px',
              marginBottom: '0',
              lineHeight: 1.6,
              textShadow: '0 2px 8px rgba(0,47,108,0.12)',
            }}
          >
            Join BreathingFree and start your journey to a healthier, happier, smoke-free life today.
          </p>
        </div>
      </section>
      
      {/* Timeline Section - New Design */}
      <div id="timeline" style={{
        padding: '5rem 2rem',
        backgroundColor: 'white',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          width: '100%'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.8rem',
            color: '#2c3e50',
            marginBottom: '1rem',
            fontWeight: '700'
          }}>
            What happens when you quit?
          </h2>
          
          <p style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#34495e',
            maxWidth: '800px',
            margin: '0 auto 4rem',
            lineHeight: '1.6'
          }}>
            The sooner you quit, the sooner you'll notice changes to your body and health. Look at what happens when you quit for good.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '3rem 2rem',
            width: '100%'
          }}>
            {/* 20 minutes */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img20m} alt="20 minutes" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 20 minutes</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Check your pulse rate, it will already be starting to return to normal.</p>
              </div>
            </div>
            
            {/* 8 hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img8h} alt="8 hours" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 8 hours</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Your oxygen levels are recovering, and the harmful carbon monoxide level in your blood will have reduced by half.</p>
              </div>
            </div>
            
            {/* 48 hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img48h} alt="48 hours" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 48 hours</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Your carbon monoxide levels have dropped to that of a non-smoker. Your lungs are clearing out mucus and your senses of taste and smell are improving.</p>
              </div>
            </div>
            
            {/* 72 hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img72h} alt="72 hours" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 72 hours</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>If you notice that breathing feels easier, it's because your bronchial tubes have started to relax. Also your energy will be increasing.</p>
              </div>
            </div>
            
            {/* 2-12 weeks */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img2_12w} alt="2-12 weeks" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 2 to 12 weeks</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Blood will be pumping through to your heart and muscles much better because your circulation will have improved.</p>
              </div>
            </div>
            
            {/* 3-9 months */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img3_9m} alt="3-9 months" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 3 to 9 months</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Any coughs, wheezing or breathing problems will be improving as your lung function increases by up to 10%.</p>
              </div>
            </div>
            
            {/* 1 year */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img1y} alt="1 year" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 1 year</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Great news! Your risk of heart attack will have halved compared with a smoker's.</p>
              </div>
            </div>
            
            {/* 10 years */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img10y} alt="10 years" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 10 years</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>More great news! Your risk of death from lung cancer will have halved compared with a smoker's.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" style={{
        padding: '5rem 2rem',
        backgroundColor: '#f5f7fa',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#2c3e50',
          marginBottom: '3rem',
          fontWeight: '700'
        }}>
          Key Features
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              backgroundColor: 'rgba(53, 167, 156, 0.1)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <div style={{ fontSize: '2rem', color: '#35a79c' }}>📊</div>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1rem' }}>Progress Tracking</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Monitor your smoke-free days, money saved, and health improvements in real-time with our advanced tracking tools.
            </p>
          </div>
          
          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              backgroundColor: 'rgba(68, 184, 157, 0.1)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <div style={{ fontSize: '2rem', color: '#44b89d' }}>🏆</div>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1rem' }}>Achievements & Rewards</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Unlock badges and earn achievements as you reach important milestones in your journey to quit smoking.
            </p>
          </div>
          
          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              backgroundColor: 'rgba(61, 125, 160, 0.1)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <div style={{ fontSize: '2rem', color: '#3d7da0' }}>👥</div>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1rem' }}>Professional Coaching</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Connect with professional coaches to receive personalized guidance for your smoking cessation journey.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            <span style={{ color: '#44b89d' }}>Breathing</span>
            <span style={{ color: '#35a79c' }}>Free</span>
          </div>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: '#bdc3c7' }}>
            Smoking Cessation Support Platform - A comprehensive solution to help you quit smoking. We're here to support you every step of the way.
          </p>
        </div>
        
        <div style={{ marginTop: '2rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
          © 2024 BreathingFree. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// Style cho dropdown và nav button
const navBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontWeight: 600,
  fontSize: '1.1rem',
  cursor: 'pointer',
  padding: '0.5rem 1.2rem',
  borderRadius: '6px',
  transition: 'background 0.2s, color 0.2s',
  outline: 'none',
  boxShadow: 'none',
  position: 'relative',
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: '110%',
  left: 0,
  background: '#fff',
  boxShadow: '0 2px 12px #002f6c22',
  borderRadius: '12px',
  minWidth: '240px',
  zIndex: 100,
  padding: '0.5rem 0',
  border: '1px solid #e5e8ee',
  animation: 'fadeIn 0.2s',
};

const dropdownBtnStyle = {
  display: 'block',
  width: '100%',
  background: 'none',
  border: 'none',
  color: '#002f6c',
  fontWeight: 500,
  fontSize: '1.08rem',
  textAlign: 'left',
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background 0.2s, color 0.2s',
  outline: 'none',
};

export default Home;
