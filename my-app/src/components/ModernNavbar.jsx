import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import './ModernNavbar.css';

const ModernNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">TI</div>
          <span className="logo-text">Tensed Intern</span>
        </div>

        {/* Nav Links */}
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#jobs" className="nav-link">Live Jobs</a>
          <a href="#settings" className="nav-link">Settings</a>
        </div>

        {/* User Info and Logout */}
        <div className="navbar-right">
          {user && (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <p className="user-name">{user.name}</p>
                  <p className="user-status">Active</p>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
