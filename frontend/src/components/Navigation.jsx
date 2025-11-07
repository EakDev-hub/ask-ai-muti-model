import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>AI Photo Analyzer</h1>
        </div>
        <div className="nav-tabs">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
          >
            💬 Chat
          </NavLink>
          <NavLink
            to="/batch"
            className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
          >
            📊 Batch Analysis
          </NavLink>
          <NavLink
            to="/idcard"
            className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
          >
            🪪 ID Card Analysis
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;