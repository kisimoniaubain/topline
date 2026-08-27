import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageCircle,
  Search,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import "./Navbar.css";

// Safe localStorage getter
const getStoredUser = () => {
  try {
    const item = localStorage.getItem("topline_user");
    if (!item || item === "undefined" || item === "null") return null;
    return JSON.parse(item);
  } catch (err) {
    console.error("Error reading topline_user in Navbar:", err);
    return null;
  }
};

function Navbar({ onMenuClick }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // Listen for real-time updates when user edits profile in other components/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredUser());
    };
    window.addEventListener("storage", handleStorageChange);
    // Fetch profile image from server/Cloudinary
    const userData = getStoredUser();
    if (userData?.username) {
      fetch(`/api/user/${userData.username}`)
        .then(r => r.json())
        .then(data => {
          if (data.profileImage) setUser({ ...userData, profileImage: data.profileImage });
        })
        .catch(() => {});
    }
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("topline_user");
    localStorage.removeItem("topline_token");
    setUser(null);
    window.dispatchEvent(new Event("topline-auth-change"));
  };

  const getInitial = () => {
    if (!user) return "K";
    return (
      user.name?.charAt(0)?.toUpperCase() ||
      user.username?.charAt(0)?.toUpperCase() ||
      "K"
    );
  };

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
          className="nav-icon-button desktop-only"
          aria-label="Notifications"
        >
          <Bell size={21} />
          <span className="notification-dot">3</span>
        </Link>
        <Link
          to="/menu"
          className="nav-icon-button mobile-only"
          aria-label="Menu"
        >
          <Menu size={21} />
          <span className="notification-dot">3</span>
        </Link>

        <Link
          to="/messages"
          className="nav-icon-button"
          aria-label="Messages"
        >
          <MessageCircle size={21} />
        </Link>

        {/* PROFILE AVATAR LINK WITH CLOUDINARY IMAGE DISPLAY */}
        <Link
          to="/profile"
          className="navbar-avatar"
          aria-label="Profile"
          style={{
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          {user?.profileImage || user?.image ? (
            <img
              src={user?.profileImage || user?.image}
              alt="User profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            getInitial()
          )}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;