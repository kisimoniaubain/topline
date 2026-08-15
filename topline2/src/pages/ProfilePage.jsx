import { useState } from "react";
import {
  Camera,
  Edit3,
  MapPin,
  Calendar,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Video,
  Settings,
  UserPlus,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import "./ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("topline_user") || "{}"
      );
    } catch {
      return {};
    }
  });

  const [activeTab, setActiveTab] = useState("posts");

  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = JSON.parse(
        localStorage.getItem("topline_posts") || "[]"
      );

      return savedPosts.filter(
        (post) =>
          post.userId === user.id ||
          post.username === user.username
      );
    } catch {
      return [];
    }
  });

  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    location: user.location || "",
  });

  const handleEditChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const saveProfile = (event) => {
    event.preventDefault();

    const updatedUser = {
      ...user,
      name: editForm.name,
      username: editForm.username,
      bio: editForm.bio,
      location: editForm.location,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "topline_user",
      JSON.stringify(updatedUser)
    );

    try {
      const users = JSON.parse(
        localStorage.getItem("topline_users") || "[]"
      );

      const updatedUsers = users.map((item) =>
        item.id === user.id
          ? {
              ...item,
              ...updatedUser,
            }
          : item
      );

      localStorage.setItem(
        "topline_users",
        JSON.stringify(updatedUsers)
      );
    } catch {
      console.error("Could not update users.");
    }

    setEditing(false);
  };

  const removePost = (postId) => {
    try {
      const allPosts = JSON.parse(
        localStorage.getItem("topline_posts") || "[]"
      );

      const updatedPosts = allPosts.filter(
        (post) => post.id !== postId
      );

      localStorage.setItem(
        "topline_posts",
        JSON.stringify(updatedPosts)
      );

      setPosts((current) =>
        current.filter((post) => post.id !== postId)
      );
    } catch {
      console.error("Could not delete post.");
    }
  };

  const getInitial = () => {
    return (
      user.name?.charAt(0)?.toUpperCase() ||
      user.username?.charAt(0)?.toUpperCase() ||
      "T"
    );
  };

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="profile-page">
          <div className="profile-container">
            {/* COVER */}
            <section className="profile-cover">
              <div className="profile-cover-gradient" />

              <button
                className="cover-camera"
                aria-label="Change cover photo"
              >
                <Camera size={18} />
                <span>Edit cover</span>
              </button>
            </section>

            {/* PROFILE INFORMATION */}
            <section className="profile-info-card">
              <div className="profile-main-info">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name || "Profile"}
                      />
                    ) : (
                      getInitial()
                    )}
                  </div>

                  <button
                    className="profile-avatar-camera"
                    aria-label="Change profile photo"
                  >
                    <Camera size={15} />
                  </button>
                </div>

                <div className="profile-details">
                  <h1>
                    {user.name || "Topline User"}
                  </h1>

                  <p className="profile-username">
                    @{user.username || "username"}
                  </p>

                  <p className="profile-bio">
                    {user.bio ||
                      "Welcome to my Topline profile."}
                  </p>

                  <div className="profile-meta">
                    {user.location && (
                      <span>
                        <MapPin size={15} />
                        {user.location}
                      </span>
                    )}

                    {user.dateOfBirth && (
                      <span>
                        <Calendar size={15} />
                        Joined Topline
                      </span>
                    )}
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="profile-edit-button"
                    onClick={() => setEditing(true)}
                  >
                    <Edit3 size={17} />
                    Edit profile
                  </button>

                  <button
                    className="profile-settings-button"
                    aria-label="Profile settings"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </div>

              {/* STATS */}
              <div className="profile-stats">
                <div>
                  <strong>{posts.length}</strong>
                  <span>Posts</span>
                </div>

                <div>
                  <strong>0</strong>
                  <span>Friends</span>
                </div>

                <div>
                  <strong>0</strong>
                  <span>Followers</span>
                </div>

                <div>
                  <strong>0</strong>
                  <span>Following</span>
                </div>
              </div>
            </section>

            {/* TABS */}
            <div className="profile-tabs">
              <button
                className={
                  activeTab === "posts" ? "active" : ""
                }
                onClick={() => setActiveTab("posts")}
              >
                <ImageIcon size={17} />
                Posts
              </button>

              <button
                className={
                  activeTab === "videos" ? "active" : ""
                }
                onClick={() => setActiveTab("videos")}
              >
                <Video size={17} />
                Videos
              </button>

              <button
                className={
                  activeTab === "about" ? "active" : ""
                }
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
            </div>

            {/* CONTENT */}
            <section className="profile-content">
              {/* ABOUT */}
              {activeTab === "about" && (
                <div className="profile-about-card">
                  <h2>About</h2>

                  <div className="about-row">
                    <MapPin size={19} />

                    <div>
                      <span>Location</span>

                      <strong>
                        {user.location ||
                          "Not added yet"}
                      </strong>
                    </div>
                  </div>

                  <div className="about-row">
                    <Calendar size={19} />

                    <div>
                      <span>Date of birth</span>

                      <strong>
                        {user.dateOfBirth ||
                          "Not added"}
                      </strong>
                    </div>
                  </div>

                  <div className="about-row">
                    <UserPlus size={19} />

                    <div>
                      <span>Username</span>

                      <strong>
                        @{user.username ||
                          "username"}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* VIDEOS */}
              {activeTab === "videos" && (
                <div className="profile-empty">
                  <Video size={35} />

                  <h2>No videos yet</h2>

                  <p>
                    Videos you post will appear here.
                  </p>
                </div>
              )}

              {/* POSTS */}
              {activeTab === "posts" && (
                <>
                  {posts.length === 0 ? (
                    <div className="profile-empty">
                      <ImageIcon size={35} />

                      <h2>No posts yet</h2>

                      <p>
                        Posts you create will appear
                        here on your profile.
                      </p>
                    </div>
                  ) : (
                    <div className="profile-posts">
                      {posts.map((post) => (
                        <article
                          className="profile-post-card"
                          key={post.id}
                        >
                          <div className="profile-post-header">
                            <div className="profile-post-user">
                              <div className="profile-post-avatar">
                                {getInitial()}
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

                            <button
                              className="profile-post-more"
                              onClick={() =>
                                removePost(post.id)
                              }
                              aria-label="Delete post"
                            >
                              <MoreHorizontal
                                size={20}
                              />
                            </button>
                          </div>

                          <p>{post.text}</p>

                          {post.image && (
                            <img
                              src={post.image}
                              alt="Post"
                            />
                          )}

                          <div className="profile-post-stats">
                            <span>
                              ❤️ {post.likes || 0}
                            </span>

                            <span>
                              {post.comments || 0}{" "}
                              comments
                            </span>

                            <span>
                              {post.shares || 0} shares
                            </span>
                          </div>

                          <div className="profile-post-actions">
                            <button>
                              <Heart size={18} />
                              Like
                            </button>

                            <button>
                              <MessageCircle
                                size={18}
                              />
                              Comment
                            </button>

                            <button>
                              <Share2 size={18} />
                              Share
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      <MobileNav />

      {/* EDIT PROFILE MODAL */}
      {editing && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h2>Edit profile</h2>

              <button
                onClick={() => setEditing(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveProfile}>
              <label>
                Name

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Username

                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Bio

                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  placeholder="Tell people about yourself..."
                  rows="4"
                />
              </label>

              <label>
                Location

                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleEditChange}
                  placeholder="Your location"
                />
              </label>

              <div className="profile-modal-actions">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;