import { useState, useEffect } from "react";
import { Camera, Edit3, Image as ImageIcon, Loader2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import "./ProfilePage.css";

// --- CLOUDINARY CONFIGURATION ---
const CLOUDINARY_CLOUD_NAME = "drqqahmxt";
const CLOUDINARY_UPLOAD_PRESET = "topline2";

// Get active session user identifier
const getActiveUserId = () => {
  try {
    const activeUser = localStorage.getItem("current_user");
    if (!activeUser) return "default_user";
    const parsed = JSON.parse(activeUser);
    return parsed.username || parsed.id || "default_user";
  } catch (err) {
    return "default_user";
  }
};

// Safe storage helpers (scoped by user account)
const getStoredProfile = () => {
  const userId = getActiveUserId();
  const storageKey = `topline_user_${userId}`;
  try {
    const item = localStorage.getItem(storageKey);
    if (!item || item === "undefined" || item === "null") {
      // Fallback: check legacy key
      const legacyItem = localStorage.getItem("topline_user");
      return legacyItem ? JSON.parse(legacyItem) : null;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error("Error reading profile:", err);
    return null;
  }
};

const saveStoredProfile = (profileData) => {
  const userId = getActiveUserId();
  const storageKey = `topline_user_${userId}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(profileData));
    // Keep legacy key synced for backward compatibility
    localStorage.setItem("topline_user", JSON.stringify(profileData));
    // Trigger window event so Navbar updates immediately
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Error saving profile:", err);
  }
};

function ProfilePage() {
  useEffect(() => {
    fetch("/api/user/me", { headers: { Authorization: "Bearer " + localStorage.getItem("topline_token") } })
      .then(r => r.json()).then(d => { if (d.user) setUser(d.user); });
  }, []);

  const [user, setUser] = useState(() => {
    const saved = getStoredProfile();
    return (
      saved || {
        name: "Topline User",
        username: "username",
        bio: "Welcome to my profile.",
        profileImage: "",
        coverImage: "",
      }
    );
  });

  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);

  // Upload loading states
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    // Reload profile if user session changed
    const currentProfile = getStoredProfile();
    if (currentProfile) {
      setUser(currentProfile);
    }

    const savedPosts = localStorage.getItem("topline_posts");
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // REST API UPLOAD TO CLOUDINARY
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error?.message || "Failed to upload image to Cloudinary");
    }

    const data = await res.json();
    return data.secure_url;
  };

  // UPLOAD PROFILE PHOTO
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingProfile(true);
      const imageUrl = await uploadToCloudinary(file);

      setUser((prevUser) => {
        const updated = { ...prevUser, profileImage: imageUrl };
        saveStoredProfile(updated);
        return updated;
      });
    } catch (error) {
      console.error("Profile image upload failed:", error);
      alert("Profile upload failed: " + error.message);
    } finally {
      setUploadingProfile(false);
    }
  };

  // UPLOAD COVER PHOTO
  const handleCoverImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const imageUrl = await uploadToCloudinary(file);

      setUser((prevUser) => {
        const updated = { ...prevUser, coverImage: imageUrl };
        saveStoredProfile(updated);
        return updated;
      });
    } catch (error) {
      console.error("Cover image upload failed:", error);
      alert("Cover upload failed: " + error.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const getInitial = () => {
    if (!user) return "T";
    return (
      user.name?.charAt(0)?.toUpperCase() ||
      user.username?.charAt(0)?.toUpperCase() ||
      "T"
    );
  };

  return (
    <div className="app-shell" style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {Navbar ? <Navbar /> : <header style={{ padding: "10px", background: "#fff" }}>Topline Navbar</header>}

      <div className="app-layout">
        {Sidebar && <Sidebar />}

        <main className="profile-page">
          <div className="profile-container">
            {/* TOP HEADER SECTION */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                padding: "0 10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#f7a409",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: "18px",
                    overflow: "hidden",
                    border: "2px solid #fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Mini profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    getInitial()
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h1 style={{ fontSize: "22px", fontWeight: "800", margin: 0, color: "#0f172a", lineHeight: "1.2" }}>
                    {user?.name || "Topline User"}
                  </h1>
                  <span style={{ fontSize: "14px", color: "#64748b" }}>
                    @{user?.username || "username"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditing(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "#0f172a",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* COVER IMAGE */}
            <section className="profile-cover" style={{ position: "relative" }}>
              {user?.coverImage ? (
                <img src={user.coverImage} alt="Cover" className="profile-cover-image" />
              ) : (
                <div className="profile-cover-gradient" />
              )}

              <input
                type="file"
                id="cover-photo-input"
                accept="image/*"
                onChange={handleCoverImageChange}
                disabled={uploadingCover}
                style={{ display: "none" }}
              />
              <label
                htmlFor="cover-photo-input"
                className="cover-camera"
                style={{
                  position: "absolute",
                  bottom: "15px",
                  right: "15px",
                  background: "rgba(0, 0, 0, 0.65)",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: uploadingCover ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  zIndex: 2,
                }}
              >
                {uploadingCover ? <Loader2 size={18} className="spin" /> : <Camera size={18} />}
                <span>{uploadingCover ? "Uploading..." : "Edit cover"}</span>
              </label>
            </section>

            {/* MAIN PROFILE CARD */}
            <section className="profile-info-card">
              <div className="profile-main-info">
                <div className="profile-avatar-wrapper" style={{ position: "relative" }}>
                  <div className="profile-avatar">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" />
                    ) : (
                      getInitial()
                    )}
                  </div>

                  <input
                    type="file"
                    id="profile-photo-input"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    disabled={uploadingProfile}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="profile-photo-input"
                    className="profile-avatar-camera"
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                      background: "#f7a409",
                      color: "#ffffff",
                      padding: "8px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: uploadingProfile ? "not-allowed" : "pointer",
                      border: "2px solid #fff",
                    }}
                    aria-label="Change profile image"
                  >
                    {uploadingProfile ? <Loader2 size={15} className="spin" /> : <Camera size={15} />}
                  </label>
                </div>

                <div className="profile-details">
                  <h1>{user?.name || "Topline User"}</h1>
                  <p className="profile-username">@{user?.username || "username"}</p>
                  <p className="profile-bio">{user?.bio || "Welcome to my profile."}</p>
                </div>

                <div className="profile-actions">
                  <button
                    type="button"
                    className="profile-edit-button"
                    onClick={() => setEditing(true)}
                  >
                    <Edit3 size={17} /> Edit profile
                  </button>
                </div>
              </div>

              <div className="profile-stats">
                <div><strong>{posts.length}</strong><span>Posts</span></div>
                <div><strong>0</strong><span>Friends</span></div>
                <div><strong>0</strong><span>Followers</span></div>
              </div>
            </section>

            <section className="profile-content">
              <div className="profile-empty">
                <ImageIcon size={35} />
                <h2>Profile Persistent Across Logins</h2>
                <p>Profile and cover URLs are stored under your account key and will remain intact whenever you log back in!</p>
              </div>
            </section>
          </div>
        </main>
      </div>

      {MobileNav && <MobileNav />}
    </div>
  );
}

export default ProfilePage;