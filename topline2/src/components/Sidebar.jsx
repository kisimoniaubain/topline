// import {
//   Home,
//   Users,
//   MessageCircle,
//   Bell,
//   PlaySquare,
//   Bookmark,
//   User,
//   Settings,
//   LogOut,
// } from "lucide-react";

// import { NavLink, useNavigate } from "react-router-dom";

// function Sidebar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Remove authentication
//     localStorage.removeItem("topline_token");

//     // Keep uploaded images and other user data

//     // Tell the application that authentication changed
//     window.dispatchEvent(
//       new Event("topline-auth-change")
//     );

//     // Go directly to login
//     navigate("/login", { replace: true });
//   };

//   const menuItems = [
//     {
//       label: "Home",
//       icon: Home,
//       path: "/home",
//     },
//     {
//       label: "Friends",
//       icon: Users,
//       path: "/friends",
//     },
//     {
//       label: "Messages",
//       icon: MessageCircle,
//       path: "/messages",
//     },
//     {
//       label: "Notifications",
//       icon: Bell,
//       path: "/notifications",
//     },
//     {
//       label: "Videos",
//       icon: PlaySquare,
//       path: "/videos",
//     },
//     {
//       label: "Saved",
//       icon: Bookmark,
//       path: "/saved",
//     },
//     {
//       label: "Profile",
//       icon: User,
//       path: "/profile",
//     },
//     {
//       label: "Settings",
//       icon: Settings,
//       path: "/settings",
//     },
//   ];

//   return (
//     <aside className="desktop-sidebar">

//       {/* ==============================
//           MAIN NAVIGATION
//       ============================== */}

//       <nav className="sidebar-menu">

//         {menuItems.map((item) => {
//           const Icon = item.icon;

//           return (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "/home"}
//               className={({ isActive }) =>
//                 `sidebar-link ${
//                   isActive ? "active" : ""
//                 }`
//               }
//             >
//               <Icon size={20} />

//               <span>
//                 {item.label}
//               </span>
//             </NavLink>
//           );
//         })}

//       </nav>

//       {/* ==============================
//           LOGOUT
//       ============================== */}

//       <div className="sidebar-bottom">

//         <button
//           type="button"
//           className="sidebar-link logout-button"
//           onClick={handleLogout}
//         >
//           <LogOut size={20} />

//           <span>
//             Log out
//           </span>
//         </button>

//       </div>

//     </aside>
//   );
// }

// export default Sidebar;
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

import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("topline_token");
    window.dispatchEvent(new Event("topline-auth-change"));

    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      path: "/home",
    },
    {
      label: "Friends",
      icon: Users,
      path: "/friends",
    },
    {
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
    {
      label: "Videos",
      icon: PlaySquare,
      path: "/videos",
    },
    {
      label: "Saved",
      icon: Bookmark,
      path: "/saved",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="desktop-sidebar">
      <nav className="sidebar-menu">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.label}
              type="button"
              className={`sidebar-link ${
                isActive ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}

      </nav>

      <div className="sidebar-bottom">

        <button
          type="button"
          className="sidebar-link logout-button"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>

      </div>
    </aside>
  );
}

export default Sidebar;