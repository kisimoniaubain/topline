import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PreloaderPage from "./pages/PreloaderPage";
import LandingPage from "./pages/PreloaderPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import VideosPage from "./pages/VideosPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import StoryViewerPage from "./pages/StoryViewerPage";

function App() {
  // Check auth using topline_token instead of topline_user
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("topline_token"))
  );

  useEffect(() => {
    const handleAuthChange = () => {
      // Updates state based on presence of active JWT token
      setIsAuthenticated(Boolean(localStorage.getItem("topline_token")));
    };

    window.addEventListener("topline-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("topline-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Preloader */}
        <Route
          path="/"
          element={<PreloaderPage />}
        />

        {/* Landing */}
        <Route
          path="/landing"
          element={<LandingPage />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginPage
                onLogin={() => setIsAuthenticated(true)}
              />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* Home */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <HomePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/stories"
          element={<StoryViewerPage />}
        />

        {/* Friends */}
        <Route
          path="/friends"
          element={
            isAuthenticated ? (
              <FriendsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Messages */}
        <Route
          path="/messages"
          element={
            isAuthenticated ? (
              <MessagesPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            isAuthenticated ? (
              <NotificationsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Videos */}
        <Route
          path="/videos"
          element={
            isAuthenticated ? (
              <VideosPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Saved */}
        <Route
          path="/saved"
          element={
            isAuthenticated ? (
              <SavedPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <SettingsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;