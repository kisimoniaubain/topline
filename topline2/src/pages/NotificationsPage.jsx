import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Send,
  Check,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

import "./NotificationsPage.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

const defaultNotifications = [
  {
    id: 1,
    type: "like",
    user: "Sarah",
    text: "liked your post.",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: "David",
    text: "commented on your post.",
    time: "20 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "friend",
    user: "Mary",
    text: "sent you a friend request.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    type: "message",
    user: "Jane",
    text: "sent you a new message.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "like",
    user: "Michael",
    text: "liked your photo.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 6,
    type: "comment",
    user: "Daniel",
    text: "commented: Great post!",
    time: "Yesterday",
    read: true,
  },
];

function NotificationsPage() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(
      "topline_notifications"
    );

    return saved
      ? JSON.parse(saved)
      : defaultNotifications;
  });

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(
      "topline_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const visibleNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter(
        (notification) => !notification.read
      );
    }

    return notifications;
  }, [notifications, filter]);

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={19} />;

      case "comment":
        return <MessageCircle size={19} />;

      case "friend":
        return <UserPlus size={19} />;

      case "message":
        return <Send size={19} />;

      default:
        return <Bell size={19} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter(
        (notification) => notification.id !== id
      )
    );
  };

  const clearAll = () => {
    const confirmed = window.confirm(
      "Delete all notifications?"
    );

    if (!confirmed) {
      return;
    }

    setNotifications([]);
  };

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="notifications-page">

          {/* HEADER */}

          <section className="notifications-container">
            <div className="notifications-header">
              <div>
                <div className="notifications-title-row">
                  <Bell size={26} />

                  <h1>Notifications</h1>
                </div>

                <p>
                  {unreadCount > 0
                    ? `${unreadCount} unread notifications`
                    : "You're all caught up"}
                </p>
              </div>

              <div className="notifications-header-actions">
                {unreadCount > 0 && (
                  <button
                    className="notification-action"
                    onClick={markAllAsRead}
                  >
                    <Check size={17} />
                    Mark all as read
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    className="notification-action danger"
                    onClick={clearAll}
                  >
                    <Trash2 size={17} />
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* FILTERS */}

            <div className="notification-filters">
              <button
                className={
                  filter === "all" ? "active" : ""
                }
                onClick={() => setFilter("all")}
              >
                All
              </button>

              <button
                className={
                  filter === "unread" ? "active" : ""
                }
                onClick={() => setFilter("unread")}
              >
                Unread

                {unreadCount > 0 && (
                  <span>{unreadCount}</span>
                )}
              </button>
            </div>

            {/* NOTIFICATIONS */}

            <div className="notification-list">
              {visibleNotifications.length > 0 ? (
                visibleNotifications.map(
                  (notification) => (
                    <article
                      key={notification.id}
                      className={`notification-item ${
                        !notification.read
                          ? "unread"
                          : ""
                      }`}
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                    >
                      <div
                        className={`notification-icon ${notification.type}`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      <div className="notification-avatar">
                        {notification.user.charAt(0)}
                      </div>

                      <div className="notification-content">
                        <p>
                          <strong>
                            {notification.user}
                          </strong>{" "}
                          {notification.text}
                        </p>

                        <span>
                          {notification.time}
                        </span>
                      </div>

                      {!notification.read && (
                        <div className="notification-dot" />
                      )}

                      <button
                        className="notification-more"
                        aria-label="Delete notification"
                        onClick={(event) => {
                          event.stopPropagation();

                          deleteNotification(
                            notification.id
                          );
                        }}
                      >
                        <MoreHorizontal size={19} />
                      </button>
                    </article>
                  )
                )
              ) : (
                <div className="notifications-empty">
                  <div>
                    <Bell size={34} />
                  </div>

                  <h2>
                    {filter === "unread"
                      ? "No unread notifications"
                      : "No notifications"}
                  </h2>

                  <p>
                    {filter === "unread"
                      ? "You're all caught up."
                      : "When something happens, you'll see it here."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default NotificationsPage;