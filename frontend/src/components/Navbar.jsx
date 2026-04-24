import React, { useState } from 'react'; // For local state
import { Link, NavLink, useNavigate} from 'react-router-dom';
import { navbarStyles } from '../assets/dummyStyles';
import { Award, LogIn, Menu, X } from 'lucide-react';
import logo from '../assets/logo.jpg';
// 1. Import your local logo from the assets folder


const Navbar = ({ logoSrc }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

// LOGOUT FUNCTION  
  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.clear();
    } catch (e) {
      // ignore all the errors
    }
    window.dispatchEvent(
      new CustomEvent('authChanged', { detail: { user: null } })
    );
    setMenuOpen(false);
    try {
      navigate('/login');
    } catch (e) {
      window.location.href = '/login';
    }
  };



  return (
    <nav className={navbarStyles.nav}>
      {/* Decorative Background Elements */}
      <div
        style={{
          backgroundImage: navbarStyles.decorativePatternBackground,
        }} 
        className={navbarStyles.decorativePattern}
      ></div>

      <div className={navbarStyles.bubble1}></div>
      <div className={navbarStyles.bubble2}></div>
      <div className={navbarStyles.bubble3}></div>

      <div className={navbarStyles.container}>
        {/* Logo Section */}
        <div className={navbarStyles.logoContainer}>
          <Link to="/" className={navbarStyles.logoButton}>
            <div className={navbarStyles.logoInner}>
              <img
                // Uses logoSrc if passed as a prop, otherwise uses the local logo.jpg
                src={logoSrc || logo}
                alt="QuizMaster logo"
                className={navbarStyles.logoImage}
                // Safety net: if the image path is broken, it won't crash the UI
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="https://placehold.co/150x150?text=Quiz";
                }}
              />
            </div>
          </Link>
        </div>        
        
        {/* Title Section */}
        <div className={navbarStyles.titleContainer}>
          <div className={navbarStyles.titleBackground}>
            <h1 className={navbarStyles.titleText}>StudyNP Quiz Application</h1>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className={navbarStyles.desktopButtonsContainer}>
          <div className={navbarStyles.spacer}></div>

          <NavLink 
            to='/result' 
            className={({ isActive }) => 
              `${navbarStyles.resultsButton} ${isActive ? 'ring-2 ring-white ring-offset-2' : ''}`
            }
          >
            <Award className={navbarStyles.buttonIcon} />
            <span style={{ marginLeft: '8px' }}>My Results</span>
          </NavLink>

          {loggedIn ? (
            <button onClick={handleLogout} className={navbarStyles.logoutButton}>
              <LogOut className={navbarStyles.buttonIcon} />
              Logout
            </button>
          ) : (
            <NavLink 
              to='/login'
              className={navbarStyles.loginButton}>
                <LogIn className={navbarStyles.buttonIcon} />
              Login
            </NavLink>
          )}
        </div>

        <div className={navbarStyles.mobileMenuContainer}>
          <button 
            onClick={() => setMenuOpen((s) => !s)}
            className={navbarStyles.menuToggleButton}
          >
            {menuOpen ? (
              <X className={navbarStyles.menuIcon} />
            ) : (
              <Menu className={navbarStyles.menuIcon} />
            )}
          </button>

          {menuOpen && (
            <div className={navbarStyles.mobileMenuPanel}>
              <ul className={navbarStyles.mobileMenuList}>
                  <li>
                    <NavLink 
                      to='/result'className={navbarStyles.mobileMenuItem}
                      onClick={() => setMenuOpen(false)} 
                      >
                        <Award className={navbarStyles.mobileMenuIcon} />
                      My Result
                  </NavLink>
                </li>

                {loggedIn ? (
                  <li>
                    <button type='button' onClick={handleLogout} className={navbarStyles.mobileMenuItem}>
                      <LogOut className={navbarStyles.mobileMenuIcon} />
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavLink 
                      to='/login'
                      className={navbarStyles.mobileMenuItem}
                      onClick={() => setMenuOpen(false)} 
                    >
                      <LogIn className={navbarStyles.mobileMenuIcon} />
                      Login
                    </NavLink>
                  </li>
                )}

              </ul>
            </div>
          )}
        </div>
      </div>

      <style>{navbarStyles.animations}</style>
    </nav>
  );
};

export default Navbar;