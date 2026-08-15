import {
  Home,
  PlaySquare,
  Plus,
  Bell,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function MobileNav() {
  const items = [
    {
      label: "Home",
      icon: Home,
      path: "/home",
    },
    {
      label: "Videos",
      icon: PlaySquare,
      path: "/videos",
    },
    {
      label: "Create",
      icon: Plus,
      path: "/create",
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={21} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MobileNav;