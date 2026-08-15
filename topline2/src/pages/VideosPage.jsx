import { useState } from "react";
import {
  Play,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Search,
  Plus,
  Video as VideoIcon,
  Volume2,
  VolumeX,
} from "lucide-react";

import "./VideosPage.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

function VideosPage() {
  const user = JSON.parse(
    localStorage.getItem("topline_user") || "{}"
  );

  const [activeCategory, setActiveCategory] = useState("For You");
  const [search, setSearch] = useState("");
  const [likedVideos, setLikedVideos] = useState([]);
  const [mutedVideos, setMutedVideos] = useState([]);

  const [videos, setVideos] = useState([
    {
      id: 1,
      user: "John Doe",
      username: "johndoe",
      avatar: "J",
      time: "2h",
      title:
        "Had a great day today! Sometimes the simplest moments are the best ones. 🧡",
      category: "For You",
      likes: 245,
      comments: 31,
      shares: 12,
      video:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      id: 2,
      user: "Sarah Williams",
      username: "sarahw",
      avatar: "S",
      time: "5h",
      title:
        "Beautiful moments from today. What a wonderful experience!",
      category: "Trending",
      likes: 421,
      comments: 54,
      shares: 22,
      video:
        "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 3,
      user: "David Kim",
      username: "davidkim",
      avatar: "D",
      time: "1d",
      title:
        "Never stop exploring. There is always something new to discover.",
      category: "Following",
      likes: 189,
      comments: 18,
      shares: 8,
      video:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
  ]);

  const categories = [
    "For You",
    "Following",
    "Trending",
    "Comedy",
    "Music",
    "Sports",
  ];

  const toggleLike = (id) => {
    setLikedVideos((current) => {
      if (current.includes(id)) {
        return current.filter((videoId) => videoId !== id);
      }

      return [...current, id];
    });

    setVideos((current) =>
      current.map((video) => {
        if (video.id !== id) return video;

        const liked = likedVideos.includes(id);

        return {
          ...video,
          likes: liked
            ? video.likes - 1
            : video.likes + 1,
        };
      })
    );
  };

  const toggleMute = (id) => {
    setMutedVideos((current) => {
      if (current.includes(id)) {
        return current.filter((videoId) => videoId !== id);
      }

      return [...current, id];
    });
  };

  const handleShare = async (video) => {
    const shareText = `Check out this video on Topline by ${video.user}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Topline Video",
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Video information copied!");
      }
    } catch {
      // User cancelled sharing.
    }
  };

  const handleUpload = () => {
    alert(
      "Video upload will be connected to the Topline backend next."
    );
  };

  const filteredVideos = videos.filter((video) => {
    const matchesCategory =
      activeCategory === "For You" ||
      video.category === activeCategory;

    const matchesSearch =
      video.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      video.user
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="videos-page">
          <div className="videos-container">

            {/* HEADER */}
            <header className="videos-header">
              <div>
                <div className="videos-title">
                  <VideoIcon size={27} />
                  <h1>Videos</h1>
                </div>

                <p>
                  Discover videos from people and creators
                  on Topline.
                </p>
              </div>

              <button
                className="video-upload-button"
                onClick={handleUpload}
              >
                <Plus size={18} />
                Create video
              </button>
            </header>

            {/* SEARCH */}
            <div className="videos-search">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            {/* CATEGORIES */}
            <div className="video-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    activeCategory === category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>
              ))}
            </div>

            {/* VIDEO FEED */}
            <div className="videos-feed">
              {filteredVideos.length === 0 ? (
                <div className="videos-empty">
                  <div>
                    <VideoIcon size={30} />
                  </div>

                  <h2>No videos found</h2>

                  <p>
                    Try another search or category.
                  </p>
                </div>
              ) : (
                filteredVideos.map((video) => {
                  const liked = likedVideos.includes(
                    video.id
                  );

                  const muted = mutedVideos.includes(
                    video.id
                  );

                  return (
                    <article
                      className="video-card"
                      key={video.id}
                    >
                      {/* POST HEADER */}
                      <div className="video-post-header">
                        <div className="video-user">
                          <div className="video-avatar">
                            {video.avatar}
                          </div>

                          <div>
                            <strong>
                              {video.user}
                            </strong>

                            <span>
                              @{video.username} ·{" "}
                              {video.time}
                            </span>
                          </div>
                        </div>

                        <button
                          className="video-more"
                          aria-label="More options"
                        >
                          <MoreHorizontal size={21} />
                        </button>
                      </div>

                      {/* TITLE */}
                      <p className="video-title-text">
                        {video.title}
                      </p>

                      {/* VIDEO */}
                      <div className="video-player">
                        <video
                          src={video.video}
                          controls
                          muted={muted}
                          playsInline
                          preload="metadata"
                        />

                        <button
                          className="video-play-overlay"
                          onClick={(event) => {
                            const videoElement =
                              event.currentTarget
                                .previousElementSibling;

                            if (videoElement.paused) {
                              videoElement.play();
                            } else {
                              videoElement.pause();
                            }
                          }}
                        >
                          <Play size={25} fill="currentColor" />
                        </button>

                        <button
                          className="video-mute-button"
                          onClick={() =>
                            toggleMute(video.id)
                          }
                        >
                          {muted ? (
                            <VolumeX size={19} />
                          ) : (
                            <Volume2 size={19} />
                          )}
                        </button>
                      </div>

                      {/* STATS */}
                      <div className="video-stats">
                        <span>
                          ❤️ {video.likes}
                        </span>

                        <span>
                          {video.comments} comments
                        </span>

                        <span>
                          {video.shares} shares
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="video-actions">
                        <button
                          className={
                            liked ? "liked" : ""
                          }
                          onClick={() =>
                            toggleLike(video.id)
                          }
                        >
                          <Heart
                            size={20}
                            fill={
                              liked
                                ? "currentColor"
                                : "none"
                            }
                          />

                          Like
                        </button>

                        <button
                          onClick={() =>
                            alert(
                              "Comments will be connected to the backend."
                            )
                          }
                        >
                          <MessageCircle size={20} />
                          Comment
                        </button>

                        <button
                          onClick={() =>
                            handleShare(video)
                          }
                        >
                          <Share2 size={20} />
                          Share
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default VideosPage;