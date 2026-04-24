import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { navbarStyles } from '../assets/dummyStyles';
// ADDED 'LogOut' to the import list below
import { Award, LogIn, LogOut, Menu, X } from 'lucide-react'; 
import logo from '../assets/logo.jpg';

const Navbar = ({ logoSrc }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Initial check on load
    const token = localStorage.getItem("authToken");
    setLoggedIn(!!token);

    // Listener for custom login/logout events
    const handler = (ev) => {
      const user = ev?.detail?.user;
      // If user is null/null-ish, loggedIn is false. If user exists, true.
      setLoggedIn(!!user);
    };

    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.clear();
    
    // Notify the app that auth state changed
    window.dispatchEvent(
      new CustomEvent('authChanged', { detail: { user: null } })
    );
    
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className={navbarStyles.nav}>
      <div style={{ backgroundImage: navbarStyles.decorativePatternBackground }} className={navbarStyles.decorativePattern}></div>
      <div className={navbarStyles.bubble1}></div>
      <div className={navbarStyles.bubble2}></div>
      <div className={navbarStyles.bubble3}></div>

      <div className={navbarStyles.container}>
        <div className={navbarStyles.logoContainer}>
          <Link to="/" className={navbarStyles.logoButton}>
            <div className={navbarStyles.logoInner}>
              <img
                src={logoSrc || logo}
                alt="QuizMaster logo"
                className={navbarStyles.logoImage}
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="https://placehold.co/150x150?text=Quiz";
                }}
              />
            </div>
          </Link>
        </div>        
        
        <div className={navbarStyles.titleContainer}>
          <div className={navbarStyles.titleBackground}>
            <h1 className={navbarStyles.titleText}>StudyNP Quiz Application</h1>
          </div>
        </div>

        {/* Desktop Buttons */}
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
              <span style={{ marginLeft: '8px' }}>Logout</span>
            </button>
          ) : (
            <NavLink to='/login' className={navbarStyles.loginButton}>
              <LogIn className={navbarStyles.buttonIcon} />
              <span style={{ marginLeft: '8px' }}>Login</span>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className={navbarStyles.mobileMenuContainer}>
          <button onClick={() => setMenuOpen((s) => !s)} className={navbarStyles.menuToggleButton}>
            {menuOpen ? <X className={navbarStyles.menuIcon} /> : <Menu className={navbarStyles.menuIcon} />}
          </button>

          {menuOpen && (
            <div className={navbarStyles.mobileMenuPanel}>
              <ul className={navbarStyles.mobileMenuList}>
                <li>
                  <NavLink to='/result' className={navbarStyles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                    <Award className={navbarStyles.mobileMenuIcon} />
                    My Results
                  </NavLink>
                </li>
                {loggedIn ? (
                  <li>
                    <button onClick={handleLogout} className={navbarStyles.mobileMenuItem}>
                      <LogOut className={navbarStyles.mobileMenuIcon} />
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavLink to='/login' className={navbarStyles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
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