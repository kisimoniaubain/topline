import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Shield,
  Palette,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  HelpCircle,
  Trash2,
  Check,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

import "./SettingsPage.css";

function SettingsPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("topline_user") || "{}"
      );
    } catch {
      return {};
    }
  });

  const [activeSection, setActiveSection] =
    useState("account");

  const [notifications, setNotifications] =
    useState(() => {
      return (
        localStorage.getItem(
          "topline_notifications"
        ) !== "false"
      );
    });

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("topline_dark_mode") ===
      "true"
    );
  });

  const handleNotifications = () => {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      "topline_notifications",
      String(newValue)
    );
  };

  const handleDarkMode = () => {
    const newValue = !darkMode;

    setDarkMode(newValue);

    localStorage.setItem(
      "topline_dark_mode",
      String(newValue)
    );

    document.body.classList.toggle(
      "topline-dark-mode",
      newValue
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("topline_user");

    navigate("/login");
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your Topline account? This cannot be undone."
    );

    if (!confirmed) return;

    const users = JSON.parse(
      localStorage.getItem("topline_users") || "[]"
    );

    const updatedUsers = users.filter(
      (item) => item.id !== user.id
    );

    localStorage.setItem(
      "topline_users",
      JSON.stringify(updatedUsers)
    );

    localStorage.removeItem("topline_user");

    navigate("/register");
  };

  const sections = [
    {
      id: "account",
      label: "Account",
      icon: User,
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="settings-page">
          <div className="settings-container">

            {/* HEADER */}
            <div className="settings-header">
              <h1>Settings</h1>

              <p>
                Manage your Topline account and
                preferences.
              </p>
            </div>

            <div className="settings-layout">

              {/* SIDEBAR */}
              <aside className="settings-menu">
                {sections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <button
                      key={section.id}
                      className={
                        activeSection === section.id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSection(
                          section.id
                        )
                      }
                    >
                      <Icon size={19} />

                      <span>{section.label}</span>

                      <ChevronRight
                        size={16}
                      />
                    </button>
                  );
                })}
              </aside>

              {/* CONTENT */}
              <section className="settings-content">

                {/* ACCOUNT */}
                {activeSection === "account" && (
                  <>
                    <div className="settings-section-header">
                      <div>
                        <h2>Account</h2>

                        <p>
                          Manage your personal
                          account information.
                        </p>
                      </div>

                      <User size={24} />
                    </div>

                    <div className="settings-profile">
                      <div className="settings-avatar">
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase() || "T"}
                      </div>

                      <div>
                        <strong>
                          {user.name ||
                            "Topline User"}
                        </strong>

                        <span>
                          @{user.username ||
                            "username"}
                        </span>
                      </div>
                    </div>

                    <div className="settings-list">

                      <div className="settings-item">
                        <div>
                          <strong>
                            Full name
                          </strong>

                          <span>
                            {user.name ||
                              "Not provided"}
                          </span>
                        </div>
                      </div>

                      <div className="settings-item">
                        <div>
                          <strong>
                            Username
                          </strong>

                          <span>
                            @{user.username ||
                              "username"}
                          </span>
                        </div>
                      </div>

                      <div className="settings-item">
                        <div>
                          <strong>
                            Email address
                          </strong>

                          <span>
                            {user.email ||
                              "Not provided"}
                          </span>
                        </div>
                      </div>

                      <div className="settings-item">
                        <div>
                          <strong>
                            Date of birth
                          </strong>

                          <span>
                            {user.dateOfBirth ||
                              "Not provided"}
                          </span>
                        </div>
                      </div>

                    </div>

                    <button
                      className="settings-primary-button"
                      onClick={() =>
                        navigate("/profile")
                      }
                    >
                      Edit profile
                    </button>
                  </>
                )}

                {/* PRIVACY */}
                {activeSection === "privacy" && (
                  <>
                    <div className="settings-section-header">
                      <div>
                        <h2>
                          Privacy & Security
                        </h2>

                        <p>
                          Control your privacy and
                          account security.
                        </p>
                      </div>

                      <Shield size={24} />
                    </div>

                    <div className="settings-list">

                      <div className="settings-item clickable">
                        <div className="settings-item-icon">
                          <Lock size={19} />
                        </div>

                        <div>
                          <strong>
                            Change password
                          </strong>

                          <span>
                            Update your account
                            password.
                          </span>
                        </div>

                        <ChevronRight size={18} />
                      </div>

                      <div className="settings-item clickable">
                        <div className="settings-item-icon">
                          <Shield size={19} />
                        </div>

                        <div>
                          <strong>
                            Login security
                          </strong>

                          <span>
                            Manage how you sign
                            into Topline.
                          </span>
                        </div>

                        <ChevronRight size={18} />
                      </div>

                      <div className="settings-item clickable">
                        <div className="settings-item-icon">
                          <Globe size={19} />
                        </div>

                        <div>
                          <strong>
                            Who can see your
                            profile
                          </strong>

                          <span>
                            Control profile
                            visibility.
                          </span>
                        </div>

                        <ChevronRight size={18} />
                      </div>

                    </div>
                  </>
                )}

                {/* NOTIFICATIONS */}
                {activeSection ===
                  "notifications" && (
                  <>
                    <div className="settings-section-header">
                      <div>
                        <h2>
                          Notifications
                        </h2>

                        <p>
                          Choose what Topline
                          notifications you receive.
                        </p>
                      </div>

                      <Bell size={24} />
                    </div>

                    <div className="settings-list">

                      <div className="settings-toggle-item">
                        <div>
                          <strong>
                            Push notifications
                          </strong>

                          <span>
                            Receive notifications
                            about activity on your
                            account.
                          </span>
                        </div>

                        <button
                          className={
                            notifications
                              ? "toggle active"
                              : "toggle"
                          }
                          onClick={
                            handleNotifications
                          }
                        >
                          <span />
                        </button>
                      </div>

                      <div className="settings-item">
                        <div>
                          <strong>
                            Notification types
                          </strong>

                          <span>
                            Likes, comments,
                            messages, friends and
                            more.
                          </span>
                        </div>

                        <Check
                          size={19}
                          color="var(--primary)"
                        />
                      </div>

                    </div>
                  </>
                )}

                {/* APPEARANCE */}
                {activeSection ===
                  "appearance" && (
                  <>
                    <div className="settings-section-header">
                      <div>
                        <h2>Appearance</h2>

                        <p>
                          Customize how Topline
                          looks for you.
                        </p>
                      </div>

                      <Palette size={24} />
                    </div>

                    <div className="settings-list">

                      <div className="settings-toggle-item">
                        <div className="settings-item-with-icon">
                          <Moon size={19} />

                          <div>
                            <strong>
                              Dark mode
                            </strong>

                            <span>
                              Use a darker appearance
                              across Topline.
                            </span>
                          </div>
                        </div>

                        <button
                          className={
                            darkMode
                              ? "toggle active"
                              : "toggle"
                          }
                          onClick={handleDarkMode}
                        >
                          <span />
                        </button>
                      </div>

                      <div className="settings-item">
                        <div>
                          <strong>
                            Language
                          </strong>

                          <span>
                            English
                          </span>
                        </div>

                        <ChevronRight
                          size={18}
                        />
                      </div>

                    </div>
                  </>
                )}

                {/* HELP */}
                {activeSection === "help" && (
                  <>
                    <div className="settings-section-header">
                      <div>
                        <h2>
                          Help & Support
                        </h2>

                        <p>
                          Get help using Topline.
                        </p>
                      </div>

                      <HelpCircle size={24} />
                    </div>

                    <div className="settings-list">

                      <div className="settings-item clickable">
                        <div>
                          <strong>
                            Help Center
                          </strong>

                          <span>
                            Find answers to common
                            questions.
                          </span>
                        </div>

                        <ChevronRight
                          size={18}
                        />
                      </div>

                      <div className="settings-item clickable">
                        <div>
                          <strong>
                            Contact support
                          </strong>

                          <span>
                            Get in touch with the
                            Topline team.
                          </span>
                        </div>

                        <ChevronRight
                          size={18}
                        />
                      </div>

                    </div>
                  </>
                )}

                {/* DANGER ZONE */}
                <div className="settings-danger">
                  <div>
                    <h3>Account actions</h3>

                    <p>
                      These actions affect your
                      Topline account.
                    </p>
                  </div>

                  <div className="settings-danger-actions">
                    <button
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      Log out
                    </button>

                    <button
                      className="delete-button"
                      onClick={
                        handleDeleteAccount
                      }
                    >
                      <Trash2 size={18} />
                      Delete account
                    </button>
                  </div>
                </div>

              </section>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default SettingsPage;