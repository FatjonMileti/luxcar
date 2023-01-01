import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <div>
            <span>📍 Rruga Irfan Tomini 4, Tirana 1020</span>
            <span>✉️ info@luxcar.al</span>
          </div>
          <div>
            <span>🕘 E Hënë – E Shtunë: 09:00 – 19:00</span>
          </div>
        </div>
      </div>
      <nav className="navbar">
        <div className="wrap">
          <Link to="/" className="logo">
            LUX<b>CAR</b> <span style={{ fontSize: 12, color: '#aaa' }}>ALBANIA</span>
          </Link>
          <button className="mobile-toggle" onClick={() => setOpen(!open)}>
            ☰ Menu
          </button>
          <div className={`nav-links ${open ? 'open' : ''}`}>
            <NavLink to="/" className={({ isActive }): string => (isActive ? 'active' : '')}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }): string => (isActive ? 'active' : '')}>
              Reth Nesh
            </NavLink>
            <NavLink to="/services" className={({ isActive }): string => (isActive ? 'active' : '')}>
              Shërbimet
            </NavLink>
            <NavLink to="/cars" className={({ isActive }): string => (isActive ? 'active' : '')}>
              Makinat Tona
            </NavLink>
            <NavLink to="/contact" className={({ isActive }): string => (isActive ? 'active' : '')}>
              Kontakt
            </NavLink>
            <NavLink to="/admin" className={({ isActive }): string => (isActive ? 'active' : '')}>
              Admin
            </NavLink>
          </div>
          <a className="nav-phone" href="tel:+355696269999">
            📞 +355 69 626 9999
          </a>
        </div>
      </nav>
    </>
  );
}
