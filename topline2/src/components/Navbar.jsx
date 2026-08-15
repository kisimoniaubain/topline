import {
  Bell,
  MessageCircle,
  Search,
  Menu,
} from "lucide-react";

import { Link } from "react-router-dom";
import Logo from "./Logo";

function Navbar({ onMenuClick }) {
  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Logo />
      </div>

      <div className="navbar-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search Topline"
          aria-label="Search Topline"
        />
      </div>

      <div className="navbar-actions">
        <Link
          to="/notifications"
          className="nav-icon-button"
          aria-label="Notifications"
        >
          <Bell size={21} />

          <span className="notification-dot">3</span>
        </Link>

        <Link
          to="/messages"
          className="nav-icon-button"
          aria-label="Messages"
        >
          <MessageCircle size={21} />
        </Link>

        <Link
          to="/profile"
          className="navbar-avatar"
          aria-label="Profile"
        >
          K
        </Link>
      </div>
    </header>
  );
}

export default Navbar;