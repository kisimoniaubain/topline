import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pause,
  Volume2,
  Heart,
  Send,
  Plus,
} from "lucide-react";
import "./StoryViewerPage.css";

function StoryViewerPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedStories = location.state?.stories || [];
  const initialStoryId = location.state?.storyId;

  const [stories, setStories] = useState(passedStories);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = passedStories.findIndex(
      (story) => story.id === initialStoryId
    );

    return index >= 0 ? index : 0;
  });

  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reply, setReply] = useState("");

  const currentStory = useMemo(
    () => stories[currentIndex],
    [stories, currentIndex]
  );

  /*
   * Load stories from localStorage if the page was
   * opened directly.
   */
  useEffect(() => {
    if (passedStories.length > 0) return;

    try {
      const savedStories = JSON.parse(
        localStorage.getItem("topline_stories") || "[]"
      );

      if (savedStories.length > 0) {
        setStories(savedStories);
      }
    } catch (error) {
      console.error("Unable to load stories:", error);
    }
  }, [passedStories.length]);

  /*
   * Mark the current story as viewed.
   */
  useEffect(() => {
    if (!currentStory) return;

    setStories((previousStories) =>
      previousStories.map((story) =>
        story.id === currentStory.id
          ? { ...story, viewed: true }
          : story
      )
    );

    try {
      const savedStories = JSON.parse(
        localStorage.getItem("topline_stories") || "[]"
      );

      const updatedStories = savedStories.map((story) =>
        story.id === currentStory.id
          ? { ...story, viewed: true }
          : story
      );

      localStorage.setItem(
        "topline_stories",
        JSON.stringify(updatedStories)
      );
    } catch (error) {
      console.error("Unable to update story:", error);
    }
  }, [currentStory]);

  /*
   * Automatic story progression.
   */
  useEffect(() => {
    if (!currentStory || paused) return;

    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((index) => index + 1);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    currentStory,
    paused,
    stories.length,
  ]);

  const previousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
      setLiked(false);
      setReply("");
    }
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((index) => index + 1);
      setLiked(false);
      setReply("");
    }
  };

  const closeViewer = () => {
    navigate("/");
  };

  const sendReply = (event) => {
    event.preventDefault();

    if (!reply.trim()) return;

    console.log("Reply:", {
      storyId: currentStory?.id,
      message: reply,
    });

    setReply("");
  };

  if (!currentStory) {
    return (
      <div className="story-viewer-empty">
        <button onClick={closeViewer}>
          <X size={22} />
        </button>

        <h2>No stories available</h2>

        <p>
          There are currently no stories to display.
        </p>
      </div>
    );
  }

  return (
    <div className="story-viewer-page">

      {/* =========================================
          LEFT SIDEBAR
      ========================================= */}

      <aside className="story-sidebar">

        <div className="story-sidebar-header">
          <button
            className="story-close-mobile"
            onClick={closeViewer}
          >
            <X size={22} />
          </button>

          <h1>Stories</h1>
        </div>

        {/* YOUR STORY */}

        <button className="your-story-card">
          <div className="story-sidebar-avatar">
            <span>You</span>

            <div className="story-add-icon">
              <Plus size={16} />
            </div>
          </div>

          <div>
            <strong>Your story</strong>

            <span>Add to your story</span>
          </div>
        </button>

        <div className="story-sidebar-divider" />

        <h3>All Stories</h3>

        <div className="story-sidebar-list">
          {stories.map((story, index) => (
            <button
              key={story.id}
              className={`story-sidebar-item ${
                index === currentIndex
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setLiked(false);
                setReply("");
              }}
            >
              <div
                className={`story-sidebar-ring ${
                  story.viewed
                    ? "viewed"
                    : ""
                }`}
              >
                {story.image ? (
                  <img
                    src={story.image}
                    alt={story.name}
                  />
                ) : (
                  <span>
                    {story.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div className="story-sidebar-info">
                <strong>{story.name}</strong>

                <span>
                  {story.viewed
                    ? "Viewed"
                    : "New story"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* =========================================
          MAIN VIEWER
      ========================================= */}

      <main className="story-viewer-main">

        {/* TOP BAR */}

        <div className="story-viewer-top">

          <div className="story-brand">
            <span>TOPLINE</span>
          </div>

          <div className="story-viewer-actions">

            <button
              onClick={() =>
                setPaused(!paused)
              }
              title={
                paused
                  ? "Play"
                  : "Pause"
              }
            >
              <Pause size={19} />
            </button>

            <button title="Sound">
              <Volume2 size={19} />
            </button>

            <button title="More">
              <MoreHorizontal size={21} />
            </button>

            <button
              onClick={closeViewer}
              title="Close"
            >
              <X size={23} />
            </button>

          </div>
        </div>

        {/* PROGRESS */}

        <div className="story-progress-container">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="story-progress"
            >
              <div
                className={
                  index < currentIndex
                    ? "completed"
                    : index === currentIndex
                    ? "current"
                    : ""
                }
              />
            </div>
          ))}
        </div>

        {/* USER */}

        <div className="story-user">

          <div className="story-user-avatar">
            {currentStory.image ? (
              <img
                src={currentStory.image}
                alt={currentStory.name}
              />
            ) : (
              currentStory.name
                ?.charAt(0)
                .toUpperCase()
            )}
          </div>

          <div>
            <strong>
              {currentStory.name}
            </strong>

            <span>
              {currentStory.time || "1h"}
            </span>
          </div>

        </div>

        {/* STORY */}

        <div
          className="story-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          <button
            className="story-navigation previous"
            onClick={previousStory}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={32} />
          </button>

          <div className="story-image-container">

            {currentStory.image ? (
              <img
                src={currentStory.image}
                alt={`${currentStory.name}'s story`}
                className="story-main-image"
              />
            ) : (
              <div className="story-no-image">
                <span>
                  {currentStory.name
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            )}

          </div>

          <button
            className="story-navigation next"
            onClick={nextStory}
            disabled={
              currentIndex ===
              stories.length - 1
            }
          >
            <ChevronRight size={32} />
          </button>

        </div>

        {/* REACTIONS */}

        <div className="story-reactions">

          <button>❤️</button>
          <button>😂</button>
          <button>😮</button>
          <button>😢</button>
          <button>😡</button>

        </div>

        {/* REPLY */}

        <form
          className="story-reply"
          onSubmit={sendReply}
        >
          <input
            type="text"
            placeholder={`Reply to ${currentStory.name}...`}
            value={reply}
            onChange={(event) =>
              setReply(event.target.value)
            }
          />

          <button
            type="button"
            className={`story-like ${
              liked ? "liked" : ""
            }`}
            onClick={() =>
              setLiked(!liked)
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
          </button>

          <button
            type="submit"
            className="story-send"
          >
            <Send size={19} />
          </button>
        </form>

      </main>
    </div>
  );
}

export default StoryViewerPage;