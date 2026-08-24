import { useEffect, useRef, useState } from "react";

import {
  Image,
  Video,
  Smile,
  MapPin,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  X,
  Send,
  UserPlus,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

// Cloudinary Credentials
const CLOUDINARY_CLOUD_NAME = "drqqahmxt";
const CLOUDINARY_UPLOAD_PRESET = "topline2"; // Replace with your actual unsigned preset name

const defaultPosts = [
  {
    id: 1,
    user: {
      name: "John Doe",
      username: "johndoe",
    },
    text: "Had a great day today! Sometimes the simplest moments are the best ones. 🧡",
    image: null,
    createdAt: "2h",
    likes: 245,
    comments: [
      {
        id: 1,
        user: "Sarah",
        text: "Looks like you had a great day!",
      },
    ],
    shares: 12,
    liked: false,
  },
];

const defaultStories = [
  {
    id: 1,
    name: "Sarah",
    viewed: false,
  },
  {
    id: 2,
    name: "David",
    viewed: false,
  },
  {
    id: 3,
    name: "Mary",
    viewed: false,
  },
  {
    id: 4,
    name: "Alex",
    viewed: false,
  },
];

const people = [
  "Michael",
  "Grace",
  "Daniel",
];

const onlineFriends = [
  "Jane",
  "David",
  "Sarah",
];

function HomePage() {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const user = JSON.parse(
    localStorage.getItem("topline_user") || "{}"
  );

  const currentUserName = user.name || "Topline User";

  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("topline_posts");

    return savedPosts
      ? JSON.parse(savedPosts)
      : defaultPosts;
  });

  const [stories, setStories] = useState(() => {
    const savedStories = localStorage.getItem(
      "topline_stories"
    );

    return savedStories
      ? JSON.parse(savedStories)
      : defaultStories;
  });

  const [friends, setFriends] = useState(() => {
    const savedFriends = localStorage.getItem(
      "topline_friends"
    );

    return savedFriends
      ? JSON.parse(savedFriends)
      : [];
  });

  const [showComposer, setShowComposer] =
    useState(false);

  const [postText, setPostText] = useState("");

  const [selectedFeeling, setSelectedFeeling] =
    useState("");

  const [location, setLocation] = useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [selectedVideo, setSelectedVideo] =
    useState(null);

  const [activeComment, setActiveComment] =
    useState(null);

  const [commentText, setCommentText] =
    useState("");

  const [activeMenu, setActiveMenu] =
    useState(null);

  const [activeStory, setActiveStory] =
    useState(null);

  const [showAllStories, setShowAllStories] =
    useState(false);

  const [showAllPeople, setShowAllPeople] =
    useState(false);

  useEffect(() => {
    localStorage.setItem(
      "topline_posts",
      JSON.stringify(posts)
    );
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(
      "topline_stories",
      JSON.stringify(stories)
    );
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(
      "topline_friends",
      JSON.stringify(friends)
    );
  }, [friends]);

  /* =========================
     CREATE POST
  ========================= */

  const createPost = () => {
    if (
      !postText.trim() &&
      !selectedImage &&
      !selectedVideo &&
      !selectedFeeling &&
      !location
    ) {
      return;
    }

    const newPost = {
      id: Date.now(),

      user: {
        name: currentUserName,
        username: user.username || "user",
      },

      text: postText.trim(),

      image: selectedImage,

      video: selectedVideo,

      feeling: selectedFeeling,

      location,

      createdAt: "Just now",

      likes: 0,

      comments: [],

      shares: 0,

      liked: false,
    };

    setPosts((previousPosts) => [
      newPost,
      ...previousPosts,
    ]);

    setPostText("");
    setSelectedFeeling("");
    setLocation("");
    setSelectedImage(null);
    setSelectedVideo(null);

    setShowComposer(false);
  };

  /* =========================
     LIKE
  ========================= */

  const toggleLike = (postId) => {
    setPosts((previousPosts) =>
      previousPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,

          liked: !post.liked,

          likes: post.liked
            ? Math.max(0, post.likes - 1)
            : post.likes + 1,
        };
      })
    );
  };

  /* =========================
     COMMENT
  ========================= */

  const addComment = (postId) => {
    if (!commentText.trim()) {
      return;
    }

    setPosts((previousPosts) =>
      previousPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,

          comments: [
            ...post.comments,

            {
              id: Date.now(),
              user: currentUserName,
              text: commentText.trim(),
            },
          ],
        };
      })
    );

    setCommentText("");
  };

  /* =========================
     SHARE
  ========================= */

  const sharePost = async (postId) => {
    const post = posts.find(
      (item) => item.id === postId
    );

    if (!post) {
      return;
    }

    setPosts((previousPosts) =>
      previousPosts.map((item) =>
        item.id === postId
          ? {
              ...item,
              shares: item.shares + 1,
            }
          : item
      )
    );

    const shareText = `${post.user.name} on Topline: ${post.text}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Topline",
          text: shareText,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          shareText
        );

        alert("Post copied to clipboard.");
      }
    } catch {
      // User cancelled sharing.
    }
  };

  /* =========================
     FILE SELECTION
  ========================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);

    setShowComposer(true);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const videoUrl = URL.createObjectURL(file);

    setSelectedVideo(videoUrl);

    setShowComposer(true);
  };

/* =========================
     STORY
  ========================= */

  const storyFileInputRef = useRef(null);

  const openStory = (story) => {
    setActiveStory(story);

    setStories((previousStories) =>
      previousStories.map((item) =>
        item.id === story.id
          ? {
              ...item,
              viewed: true,
            }
          : item
      )
    );
  };

  // 1. Triggers when clicking "Your story" button
  const createStory = () => {
    if (storyFileInputRef.current) {
      storyFileInputRef.current.click();
    }
  };

  // 2. Triggers after picking a photo/video file
  const handleStoryFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional caption prompt
    const caption = window.prompt("Add a caption to your story (optional):") || "";

    const imageUrl = URL.createObjectURL(file);

    const newStory = {
      id: Date.now(),
      name: currentUserName,
      image: imageUrl, // Local preview URL
      text: caption.trim(),
      viewed: true,
      own: true,
      file: file, // Keep raw file for backend upload if needed
    };

    setStories((previousStories) => [newStory, ...previousStories]);
    setActiveStory(newStory);

    // Reset input so the same file can be selected again if needed
    e.target.value = "";
  };
  /* =========================
     FRIENDS
  ========================= */

  const toggleFriend = (person) => {
    setFriends((previousFriends) => {
      if (previousFriends.includes(person)) {
        return previousFriends.filter(
          (friend) => friend !== person
        );
      }

      return [...previousFriends, person];
    });
  };

  /* =========================
     POST MENU
  ========================= */

  const deletePost = (postId) => {
    setPosts((previousPosts) =>
      previousPosts.filter(
        (post) => post.id !== postId
      )
    );

    setActiveMenu(null);
  };

  const copyPost = async (post) => {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(
      post.text || "Topline post"
    );

    alert("Post text copied.");

    setActiveMenu(null);
  };

  /* =========================
     VISIBLE DATA
  ========================= */

  const visibleStories = showAllStories
    ? stories
    : stories.slice(0, 4);

  const visiblePeople = showAllPeople
    ? people
    : people.slice(0, 3);

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="feed">

          {/* =========================
              STORIES
          ========================= */}

          <section className="stories-section">
            <div className="section-title">
              <h2>Stories</h2>

              <button
                onClick={() =>
                  setShowAllStories(
                    !showAllStories
                  )
                }
              >
                {showAllStories
                  ? "Show less"
                  : "See all"}
              </button>
            </div>

            <div className="stories-row">

              {/* CREATE STORY */}

{/* 1. Hidden File Input */}
<input
  type="file"
  ref={storyFileInputRef}
  onChange={handleStoryFileChange}
  accept="image/*,video/*"
  style={{ display: "none" }}
/>

{/* 2. Your Create Story Button */}
<button
  type="button"
  className="story-card create-story"
  onClick={createStory}
>
  <div className="story-image">
    <span>
      {currentUserName ? currentUserName.charAt(0).toUpperCase() : "U"}
    </span>
  </div>

  <div className="create-story-button">
    <Plus size={18} />
  </div>

  <strong>Your story</strong>
</button>
              {/* STORIES */}

              {visibleStories.map((story) => (
                <button
                  className={`story-card ${
                    story.viewed
                      ? "story-viewed"
                      : ""
                  }`}
                  key={story.id}
                  onClick={() =>
                    openStory(story)
                  }
                >
                  <div className="story-image">
                    <span>
                      {story.name.charAt(0)}
                    </span>
                  </div>

                  <strong>{story.name}</strong>
                </button>
              ))}
            </div>
          </section>

          {/* =========================
              COMPOSER
          ========================= */}

          <section className="composer-card">
            <div className="composer-top">
              <div className="user-avatar">
                {currentUserName.charAt(0)}
              </div>

              <button
                className="composer-input"
                onClick={() =>
                  setShowComposer(true)
                }
              >
                What's on your mind?
              </button>
            </div>

            <div className="composer-actions">

              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <Image size={20} />
                Photo
              </button>

              <button
                onClick={() =>
                  videoInputRef.current?.click()
                }
              >
                <Video size={20} />
                Video
              </button>

              <button
                onClick={() =>
                  setShowComposer(true)
                }
              >
                <Smile size={20} />
                Feeling
              </button>

              <button
                onClick={() => {
                  const value = window.prompt(
                    "Where are you?"
                  );

                  if (value?.trim()) {
                    setLocation(value.trim());
                    setShowComposer(true);
                  }
                }}
              >
                <MapPin size={20} />
                Location
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoChange}
            />
          </section>

          {/* =========================
              FULL COMPOSER
          ========================= */}

          {showComposer && (
            <section className="composer-card">

              <div className="section-title">
                <h2>Create post</h2>

                <button
                  className="icon-button"
                  onClick={() =>
                    setShowComposer(false)
                  }
                >
                  <X size={20} />
                </button>
              </div>

              <textarea
                value={postText}
                onChange={(event) =>
                  setPostText(event.target.value)
                }
                placeholder="What's on your mind?"
                rows="4"
              />

              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginTop: "12px",
                  }}
                />
              )}

              {selectedVideo && (
                <video
                  src={selectedVideo}
                  controls
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginTop: "12px",
                  }}
                />
              )}

              <div className="composer-actions">

                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <Image size={20} />
                  Photo
                </button>

                <button
                  onClick={() =>
                    videoInputRef.current?.click()
                  }
                >
                  <Video size={20} />
                  Video
                </button>

                <button
                  onClick={() => {
                    const feeling =
                      window.prompt(
                        "How are you feeling?"
                      );

                    if (feeling?.trim()) {
                      setSelectedFeeling(
                        feeling.trim()
                      );
                    }
                  }}
                >
                  <Smile size={20} />
                  Feeling
                </button>

                <button
                  onClick={() => {
                    const value =
                      window.prompt(
                        "Where are you?"
                      );

                    if (value?.trim()) {
                      setLocation(
                        value.trim()
                      );
                    }
                  }}
                >
                  <MapPin size={20} />
                  Location
                </button>
              </div>

              {(selectedFeeling ||
                location) && (
                <div style={{ marginTop: "10px" }}>
                  {selectedFeeling && (
                    <span>
                      Feeling:{" "}
                      {selectedFeeling}
                    </span>
                  )}

                  {location && (
                    <span
                      style={{
                        marginLeft: "15px",
                      }}
                    >
                      📍 {location}
                    </span>
                  )}
                </div>
              )}

              <button
                className="primary-button full"
                onClick={createPost}
                style={{
                  marginTop: "15px",
                }}
              >
                Post
              </button>
            </section>
          )}

          {/* =========================
              POSTS
          ========================= */}

          {posts.map((post) => (
            <article
              className="post-card"
              key={post.id}
            >
              <div className="post-header">
                <div className="post-user">
                  <div className="user-avatar">
                    {post.user.name.charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {post.user.name}
                    </strong>

                    <span>
                      @{post.user.username} ·{" "}
                      {post.createdAt}
                    </span>
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <button
                    className="icon-button"
                    aria-label="More options"
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === post.id
                          ? null
                          : post.id
                      )
                    }
                  >
                    <MoreHorizontal size={21} />
                  </button>

                  {activeMenu === post.id && (
                    <div className="post-menu">
                      <button
                        onClick={() =>
                          copyPost(post)
                        }
                      >
                        Copy post
                      </button>

                      {post.user.username ===
                        user.username && (
                        <button
                          onClick={() =>
                            deletePost(
                              post.id
                            )
                          }
                        >
                          Delete post
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {post.text && (
                <p className="post-text">
                  {post.text}
                </p>
              )}

              {post.feeling && (
                <p className="post-meta">
                  Feeling {post.feeling}
                </p>
              )}

              {post.location && (
                <p className="post-meta">
                  📍 {post.location}
                </p>
              )}

              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="post-image"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}

              {post.video && (
                <video
                  src={post.video}
                  controls
                  className="post-image"
                />
              )}

              {!post.image &&
                !post.video && (
                  <div className="post-image">
                    <span>TOPLINE</span>
                  </div>
                )}

              <div className="post-stats">
                <span>
                  ❤️ {post.likes}
                </span>

                <span>
                  {post.comments.length} comments
                </span>

                <span>
                  {post.shares} shares
                </span>
              </div>

              {/* ACTIONS */}

              <div className="post-actions">

                <button
                  className={
                    post.liked
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    toggleLike(post.id)
                  }
                >
                  <Heart
                    size={20}
                    fill={
                      post.liked
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {post.liked
                    ? "Liked"
                    : "Like"}
                </button>

                <button
                  onClick={() =>
                    setActiveComment(
                      activeComment ===
                        post.id
                        ? null
                        : post.id
                    )
                  }
                >
                  <MessageCircle size={20} />
                  Comment
                </button>

                <button
                  onClick={() =>
                    sharePost(post.id)
                  }
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>

              {/* COMMENTS */}

              {activeComment === post.id && (
                <div className="comments-section">

                  {post.comments.map(
                    (comment) => (
                      <div
                        className="comment"
                        key={comment.id}
                      >
                        <div className="user-avatar">
                          {comment.user.charAt(
                            0
                          )}
                        </div>

                        <div>
                          <strong>
                            {comment.user}
                          </strong>

                          <p>
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(event) =>
                        setCommentText(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter"
                        ) {
                          addComment(post.id);
                        }
                      }}
                    />

                    <button
                      onClick={() =>
                        addComment(post.id)
                      }
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </main>

        {/* =========================
            RIGHT SIDEBAR
        ========================= */}

        <aside className="right-sidebar">

          {/* PEOPLE */}

          <section className="side-card">
            <div className="side-card-heading">
              <h3>
                People you may know
              </h3>

              <button
                onClick={() =>
                  setShowAllPeople(
                    !showAllPeople
                  )
                }
              >
                {showAllPeople
                  ? "Show less"
                  : "See all"}
              </button>
            </div>

            {visiblePeople.map(
              (person) => {
                const isFriend =
                  friends.includes(person);

                return (
                  <div
                    className="suggestion"
                    key={person}
                  >
                    <div className="user-avatar">
                      {person.charAt(0)}
                    </div>

                    <div className="suggestion-info">
                      <strong>
                        {person}
                      </strong>

                      <span>
                        8 mutual friends
                      </span>
                    </div>

                    <button
                      className="small-primary"
                      onClick={() =>
                        toggleFriend(
                          person
                        )
                      }
                    >
                      {isFriend ? (
                        <>
                          <UserCheck
                            size={15}
                          />
                          Friends
                        </>
                      ) : (
                        <>
                          <UserPlus
                            size={15}
                          />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                );
              }
            )}
          </section>

          {/* ONLINE */}

          <section className="side-card">
            <div className="side-card-heading">
              <h3>Online friends</h3>

              <button
                onClick={() =>
                  alert(
                    "Online friends feature is ready for the messaging system."
                  )
                }
              >
                See all
              </button>
            </div>

            {onlineFriends.map(
              (person) => (
                <button
                  className="online-user"
                  key={person}
                  onClick={() =>
                    alert(
                      `Opening chat with ${person}`
                    )
                  }
                >
                  <div className="online-avatar">
                    {person.charAt(0)}
                    <span />
                  </div>

                  <strong>
                    {person}
                  </strong>

                  <ChevronRight
                    size={17}
                  />
                </button>
              )
            )}
          </section>
        </aside>
      </div>

      <MobileNav />

      {/* =========================
          STORY VIEWER
      ========================= */}

      {activeStory && (
<div className="modal-overlay">
  <div className="story-viewer">

    {/* CLOSE */}

    <button
      className="story-close-button"
      onClick={() =>
        setActiveStory(null)
      }
      aria-label="Close story"
    >
      <X size={24} />
    </button>


    {/* PROGRESS BAR */}

    <div className="story-progress-bar">
      <div className="story-progress-fill" />
    </div>


    {/* USER INFO */}

    <div className="story-viewer-header">

      <div className="story-viewer-avatar">

        {activeStory.image ? (
          <img
            src={activeStory.image}
            alt={activeStory.name}
          />
        ) : (
          <span>
            {activeStory.name
              .charAt(0)
              .toUpperCase()}
          </span>
        )}

      </div>

      <div className="story-viewer-user">

        <strong>
          {activeStory.name}
        </strong>

        <span>
          {activeStory.time || "1h"}
        </span>

      </div>

    </div>


    {/* STORY CONTENT */}

    <div className="story-viewer-content">

      {activeStory.image ? (

        <img
          src={activeStory.image}
          alt={`${activeStory.name}'s story`}
          className="story-viewer-image"
        />

      ) : activeStory.video ? (

        <video
          src={activeStory.video}
          className="story-viewer-video"
          controls
          autoPlay
          playsInline
        />

      ) : (

        <div className="story-text-content">

          <p>
            {activeStory.text ||
              "This is a Topline story."}
          </p>

        </div>

      )}

    </div>


    {/* TEXT OVER IMAGE */}

    {activeStory.text &&
      activeStory.image && (
        <div className="story-overlay-text">
          {activeStory.text}
        </div>
      )}


    {/* PREVIOUS */}

    <button
      className="story-navigation story-prev"
      onClick={() => {
        console.log("Previous story");
      }}
      aria-label="Previous story"
    >
      ‹
    </button>


    {/* NEXT */}

    <button
      className="story-navigation story-next"
      onClick={() => {
        console.log("Next story");
      }}
      aria-label="Next story"
    >
      ›
    </button>


    {/* REACTIONS */}

    <div className="story-reactions">

      <button
        type="button"
        onClick={() =>
          console.log("Liked story")
        }
      >
        ❤️
      </button>

      <button type="button">
        😂
      </button>

      <button type="button">
        😮
      </button>

      <button type="button">
        😢
      </button>

      <button type="button">
        😡
      </button>

    </div>


    {/* REPLY */}

    <form
      className="story-reply-box"
      onSubmit={(event) => {
        event.preventDefault();

        console.log(
          "Reply:",
          event.target.reply.value
        );

        event.target.reset();
      }}
    >

      <input
        name="reply"
        type="text"
        placeholder={`Reply to ${activeStory.name}...`}
        autoComplete="off"
      />

      <button type="submit">
        <Send size={19} />
      </button>

    </form>

  </div>
</div>
      )}
    </div>
  );
}

export default HomePage;