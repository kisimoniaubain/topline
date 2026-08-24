import {
  Home,
  Users,
  MessageCircle,
  Bell,
  PlaySquare,
  Bookmark,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, Link } from "react-router-dom";

function Sidebar() {
  const handleLogout = () => {
    // Clear only auth token to preserve uploaded images
    localStorage.removeItem("topline_token");
    window.dispatchEvent(new Event("topline-auth-change"));
  };

  const menuItems = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "Friends", icon: Users, path: "/friends" },
    { label: "Messages", icon: MessageCircle, path: "/messages" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
    { label: "Videos", icon: PlaySquare, path: "/videos" },
    { label: "Saved", icon: Bookmark, path: "/saved" },
    { label: "Profile", icon: User, path: "/profile" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className="desktop-sidebar">
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <Link
          to="/login"
          replace
          className="sidebar-link logout-button"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;