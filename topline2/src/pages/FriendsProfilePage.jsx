import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, UserPlus, UserCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import "./FriendsProfilePage.css";

export default function FriendsProfilePage() {
  const [friendProfile, setFriendProfile] = useState(null);
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetch(`/api/user/${id || "user"}`)
      .then(r => r.json())
      .then(data => setFriendProfile(data))
      .catch(() => {});
  }, [id]);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <main className="feed friends-profile-page">
          <Link to="/friends" className="back-btn"><ArrowLeft /> Back</Link>
          <div className="friends-profile-card">
            <div className="profile-cover" style={{ height: 200, background: "linear-gradient(135deg, #f57f17, #d96800)", borderRadius: 16 }} />
            <div className="friends-profile-header" style={{ marginTop: -60, textAlign: "center" }}>
              <div className="friends-avatar">{friendProfile?.profileImage ? <img src={friendProfile.profileImage} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : (id ? id.charAt(0).toUpperCase() : "F")}</div>
              <h1 style={{ margin: 8, fontSize: 24 }}>{id || "Friend"}</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>@{id || "friend"}</p>
            </div>
            <div className="friends-profile-stats" style={{ display: "flex", gap: 30, justifyContent: "center", margin: "20px 0" }}>
              <div><strong>9</strong><span>Posts</span></div>
              <div><strong>0</strong><span>Friends</span></div>
              <div><strong>0</strong><span>Followers</span></div>
            </div>
            <div className="friends-profile-actions" style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
              <button onClick={() => setIsFollowing(!isFollowing)} style={{ padding: "10px 20px", borderRadius: 9, border: "1px solid var(--border-color)", background: "var(--surface)", fontWeight: 600, cursor: "pointer" }}>
                {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />} {isFollowing ? "Following" : "Follow"}
              </button>
              <Link to="/messages" style={{ padding: "10px 20px", borderRadius: 9, border: "1px solid var(--border-color)", background: "var(--primary)", color: "#111", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <MessageCircle size={18} /> Message
              </Link>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
