import { useState } from "react";
import {
  Bookmark,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Video,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

import "./SavedPage.css";

function SavedPage() {
  const [savedItems, setSavedItems] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("topline_saved") || "[]"
      );
    } catch {
      return [];
    }
  });

  const removeSaved = (id) => {
    const updated = savedItems.filter(
      (item) => item.id !== id
    );

    setSavedItems(updated);

    localStorage.setItem(
      "topline_saved",
      JSON.stringify(updated)
    );
  };

  const handleShare = async (item) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.text,
        });
      } else {
        await navigator.clipboard.writeText(item.text);
        alert("Post information copied!");
      }
    } catch {
      // User cancelled sharing.
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="saved-page">
          <div className="saved-container">

            {/* HEADER */}
            <div className="saved-header">
              <div className="saved-title">
                <div className="saved-title-icon">
                  <Bookmark size={25} fill="currentColor" />
                </div>

                <div>
                  <h1>Saved</h1>

                  <p>
                    Find the posts and videos you saved
                    on Topline.
                  </p>
                </div>
              </div>

              {savedItems.length > 0 && (
                <span className="saved-count">
                  {savedItems.length} saved
                </span>
              )}
            </div>

            {/* CONTENT */}
            {savedItems.length === 0 ? (
              <section className="saved-empty">
                <div className="saved-empty-icon">
                  <Bookmark size={34} />
                </div>

                <h2>No saved items yet</h2>

                <p>
                  When you save posts or videos, they'll
                  appear here so you can find them later.
                </p>
              </section>
            ) : (
              <div className="saved-list">
                {savedItems.map((item) => (
                  <article
                    className="saved-card"
                    key={item.id}
                  >
                    {/* HEADER */}
                    <div className="saved-card-header">
                      <div className="saved-user">
                        <div className="saved-avatar">
                          {item.avatar ||
                            item.user?.charAt(0) ||
                            "T"}
                        </div>

                        <div>
                          <strong>
                            {item.user || "Topline User"}
                          </strong>

                          <span>
                            @{item.username || "user"} ·{" "}
                            {item.time || "Recently"}
                          </span>
                        </div>
                      </div>

                      <button
                        className="saved-more"
                        aria-label="More options"
                      >
                        <MoreHorizontal size={21} />
                      </button>
                    </div>

                    {/* TYPE */}
                    <div className="saved-type">
                      {item.type === "video" ? (
                        <>
                          <Video size={14} />
                          Video
                        </>
                      ) : (
                        <>
                          <ImageIcon size={14} />
                          Post
                        </>
                      )}
                    </div>

                    {/* TEXT */}
                    <p className="saved-text">
                      {item.text ||
                        item.title ||
                        "Saved Topline post"}
                    </p>

                    {/* MEDIA */}
                    {item.image && (
                      <div className="saved-media">
                        <img
                          src={item.image}
                          alt={item.title || "Saved post"}
                        />
                      </div>
                    )}

                    {item.video && (
                      <div className="saved-media">
                        <video
                          src={item.video}
                          controls
                          playsInline
                        />
                      </div>
                    )}

                    {/* STATS */}
                    <div className="saved-stats">
                      <span>
                        ❤️ {item.likes || 0}
                      </span>

                      <span>
                        {item.comments || 0} comments
                      </span>

                      <span>
                        {item.shares || 0} shares
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="saved-actions">
                      <button>
                        <Heart size={19} />
                        Like
                      </button>

                      <button>
                        <MessageCircle size={19} />
                        Comment
                      </button>

                      <button
                        onClick={() =>
                          handleShare(item)
                        }
                      >
                        <Share2 size={19} />
                        Share
                      </button>

                      <button
                        className="remove-saved"
                        onClick={() =>
                          removeSaved(item.id)
                        }
                      >
                        <Trash2 size={19} />
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default SavedPage;