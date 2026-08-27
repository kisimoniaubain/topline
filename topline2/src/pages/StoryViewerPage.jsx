import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pause,
  Play,
  Volume2,
  Heart,
  Send,
  Clock,
} from "lucide-react";

import "./StoryViewerPage.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

function StoryViewerPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("topline_user") || "{}"
  );

  const currentUserName = user.name || "User";

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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  /*
   * ================================
   * CURRENT STORY
   * ================================
   */

  const currentStory = useMemo(
    () => stories[currentIndex],
    [stories, currentIndex]
  );

  /*
   * ================================
   * HELPERS
   * ================================
   */

  const getOwnerName = (story) => {
    return (
      story?.name ||
      story?.user?.name ||
      story?.owner?.name ||
      "User"
    );
  };

  const getOwnerAvatar = (story) => {
    return (
      story?.profileImage ||
      story?.avatar ||
      story?.user?.profileImage ||
      story?.user?.avatar ||
      story?.owner?.profileImage ||
      story?.owner?.avatar ||
      null
    );
  };

  const resetStoryState = () => {
    setLiked(false);
    setReply("");
    setShowMoreMenu(false);
  };

  const changeStory = (newIndex) => {
    setCurrentIndex(newIndex);
    resetStoryState();
  };

  const saveStories = (updatedStories) => {
    try {
      localStorage.setItem(
        "topline_stories",
        JSON.stringify(updatedStories)
      );
    } catch (error) {
      console.error("Unable to save stories:", error);
    }
  };

  /*
   * ================================
   * LOAD STORIES
   * ================================
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
   * ================================
   * MARK STORY AS VIEWED
   * ================================
   */

  useEffect(() => {
    if (!currentStory) return;

    setStories((previousStories) =>
      previousStories.map((story) =>
        story.id === currentStory.id
          ? {
              ...story,
              viewed: true,
            }
          : story
      )
    );

    try {
      const savedStories = JSON.parse(
        localStorage.getItem("topline_stories") || "[]"
      );

      const updatedStories = savedStories.map((story) =>
        story.id === currentStory.id
          ? {
              ...story,
              viewed: true,
            }
          : story
      );

      localStorage.setItem(
        "topline_stories",
        JSON.stringify(updatedStories)
      );
    } catch (error) {
      console.error("Unable to update story:", error);
    }
  }, [currentStory?.id]);

  /*
   * ================================
   * AUTOMATIC STORY PROGRESSION
   * ================================
   */

  useEffect(() => {
    if (!currentStory || paused) return;

    if (currentIndex >= stories.length - 1) return;

    const timer = setTimeout(() => {
      changeStory(currentIndex + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    currentStory,
    paused,
    stories.length,
  ]);

  /*
   * ================================
   * PREVIOUS STORY
   * ================================
   */

  const previousStory = () => {
    if (currentIndex > 0) {
      changeStory(currentIndex - 1);
    }
  };

  /*
   * ================================
   * NEXT STORY
   * ================================
   */

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      changeStory(currentIndex + 1);
    }
  };

  /*
   * ================================
   * CLOSE VIEWER
   * ================================
   */

  const closeViewer = () => {
    navigate("/home");
  };

  /*
   * ================================
   * SEND REPLY
   * ================================
   */

  const sendReply = (event) => {
    event.preventDefault();

    if (!reply.trim()) return;

    console.log("Reply:", {
      storyId: currentStory?.id,
      message: reply.trim(),
    });

    setReply("");
  };

  /*
   * ================================
   * DELETE STORY
   * ================================
   */

  const deleteStory = () => {
    if (!currentStory) return;

    const updatedStories = stories.filter(
      (story) => story.id !== currentStory.id
    );

    setStories(updatedStories);
    saveStories(updatedStories);

    if (updatedStories.length === 0) {
      closeViewer();
      return;
    }

    if (currentIndex >= updatedStories.length) {
      setCurrentIndex(updatedStories.length - 1);
    }

    setShowMoreMenu(false);
  };

  /*
   * ================================
   * EDIT STORY
   * ================================
   */

  const editStory = () => {
    if (!currentStory) return;

    const caption = window.prompt(
      "Edit story caption:",
      currentStory.text || ""
    );

    if (caption === null) return;

    const updatedStories = stories.map((story) =>
      story.id === currentStory.id
        ? {
            ...story,
            text: caption.trim(),
          }
        : story
    );

    setStories(updatedStories);
    saveStories(updatedStories);

    setShowMoreMenu(false);
  };

  /*
   * ================================
   * STORY OWNERS
   * ================================
   */

  const storyOwners = useMemo(() => {
    const owners = [];

    stories.forEach((story) => {
      const ownerName = getOwnerName(story);

      const alreadyExists = owners.some(
        (owner) => owner.name === ownerName
      );

      if (!alreadyExists) {
        owners.push({
          ...story,
          name: ownerName,
        });
      }
    });

    return owners;
  }, [stories]);

  /*
   * ================================
   * OWNER CHECK
   * ================================
   */

  const isOwner =
    currentStory?.own ||
    getOwnerName(currentStory) === currentUserName;

  /*
   * ================================
   * PAGE
   * ================================
   */

  return (
    <div className="app-shell story-app-shell">

      {/* =================================
          NAVBAR
      ================================= */}

      <Navbar />

      <div className="app-layout story-app-layout">

        {/* =================================
            LEFT SIDEBAR
        ================================= */}

        <Sidebar />

        {/* =================================
            MIDDLE STORY VIEWER
        ================================= */}

        <main className="feed story-viewer-page">

          {!currentStory ? (

            /* =================================
               EMPTY STATE
            ================================= */

            <div className="story-empty-page">

              <div className="story-empty-card">

                <button
                  className="story-empty-close"
                  onClick={closeViewer}
                  aria-label="Close story viewer"
                >
                  <X size={22} />
                </button>

                <div className="story-empty-icon">
                  <Clock size={38} />
                </div>

                <h2>No stories available</h2>

                <p>
                  There are currently no stories to display.
                </p>

                <button
                  className="primary-button"
                  onClick={closeViewer}
                >
                  Back to Home
                </button>

              </div>

            </div>

          ) : (

            /* =================================
               STORY VIEWER
            ================================= */

            <div className="story-viewer-inner">

              {/* STORY HEADER */}

              <div className="story-viewer-header">

                <div className="story-header-title">

                  <div className="story-header-icon">
                    <Clock size={20} />
                  </div>

                  <div>
                    <h1>Stories</h1>

                    <p>
                      {currentIndex + 1} of{" "}
                      {stories.length}
                    </p>
                  </div>

                </div>

                <div className="story-header-actions">

                  {/* PAUSE / PLAY */}

                  <button
                    onClick={() =>
                      setPaused((value) => !value)
                    }
                    title={
                      paused
                        ? "Play story"
                        : "Pause story"
                    }
                  >
                    {paused ? (
                      <Play size={18} />
                    ) : (
                      <Pause size={18} />
                    )}
                  </button>

                  {/* SOUND */}

                  <button
                    onClick={() =>
                      setSoundOn((value) => !value)
                    }
                    title={
                      soundOn
                        ? "Mute"
                        : "Unmute"
                    }
                  >
                    <Volume2
                      size={18}
                      className={
                        !soundOn
                          ? "muted-icon"
                          : ""
                      }
                    />
                  </button>

                  {/* MORE */}

                  <div className="story-more-wrapper">

                    <button
                      title="More"
                      onClick={() =>
                        setShowMoreMenu(
                          (value) => !value
                        )
                      }
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {showMoreMenu && (
                      <div className="story-more-menu">

                        {isOwner ? (
                          <>
                            <button
                              onClick={editStory}
                            >
                              Edit story
                            </button>

                            <button
                              className="danger"
                              onClick={deleteStory}
                            >
                              Delete story
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              console.log(
                                "Report story:",
                                currentStory.id
                              );

                              setShowMoreMenu(false);
                            }}
                          >
                            Report story
                          </button>
                        )}

                      </div>
                    )}

                  </div>

                  {/* CLOSE */}

                  <button
                    className="story-close-button"
                    onClick={closeViewer}
                    title="Close"
                  >
                    <X size={21} />
                  </button>

                </div>

              </div>

              {/* STORY PROGRESS */}

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

              {/* =================================
                  LARGE STORY AREA
              ================================= */}

              <div
                className="story-viewer-content"
                onMouseEnter={() =>
                  setPaused(true)
                }
                onMouseLeave={() =>
                  setPaused(false)
                }
              >

                {/* PREVIOUS BUTTON */}

                <button
                  className="story-navigation previous"
                  onClick={previousStory}
                  disabled={currentIndex === 0}
                  aria-label="Previous story"
                >
                  <ChevronLeft size={30} />
                </button>

                {/* STORY CARD */}

                <div className="story-card">

                  <div className="story-image-container">

                    {currentStory.image ? (
                      <img
                        src={currentStory.image}
                        alt={`${getOwnerName(
                          currentStory
                        )}'s story`}
                        className="story-main-image"
                      />
                    ) : (
                      <div className="story-no-image">

                        <span>
                          {getOwnerName(
                            currentStory
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                      </div>
                    )}

                    {/* CAPTION */}

                    {currentStory.text && (
                      <div className="story-caption">
                        {currentStory.text}
                      </div>
                    )}

                  </div>

                  {/* LEFT CLICK AREA */}

                  <button
                    className="story-image-hit-area left"
                    onClick={previousStory}
                    aria-label="Previous story"
                  />

                  {/* RIGHT CLICK AREA */}

                  <button
                    className="story-image-hit-area right"
                    onClick={nextStory}
                    aria-label="Next story"
                  />

                </div>

                {/* NEXT BUTTON */}

                <button
                  className="story-navigation next"
                  onClick={nextStory}
                  disabled={
                    currentIndex ===
                    stories.length - 1
                  }
                  aria-label="Next story"
                >
                  <ChevronRight size={30} />
                </button>

              </div>

              {/* REACTIONS */}

              <div className="story-reactions">

                <button title="Love">
                  ❤️
                </button>

                <button title="Laugh">
                  😂
                </button>

                <button title="Wow">
                  😮
                </button>

                <button title="Sad">
                  😢
                </button>

                <button title="Angry">
                  😡
                </button>

              </div>

              {/* REPLY */}

              <form
                className="story-reply"
                onSubmit={sendReply}
              >

                <input
                  type="text"
                  placeholder={`Reply to ${getOwnerName(
                    currentStory
                  )}...`}
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
                    setLiked((value) => !value)
                  }
                  title="Like"
                >
                  <Heart
                    size={19}
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
                  title="Send reply"
                >
                  <Send size={18} />
                </button>

              </form>

            </div>
          )}

        </main>

        {/* =================================
            RIGHT STORY OWNER PANEL
        ================================= */}

        {currentStory && (
          <aside className="story-owner-panel">

            <div className="story-owner-card">

              <div className="story-owner-heading">

                <div>
                  <h2>Stories</h2>

                  <p>
                    People with stories
                  </p>
                </div>

                <span>
                  {storyOwners.length}
                </span>

              </div>

              <div className="story-owner-list">

                {storyOwners.map((storyOwner) => {

                  const ownerStories =
                    stories.filter(
                      (story) =>
                        getOwnerName(story) ===
                        storyOwner.name
                    );

                  const ownerStoryIndex =
                    stories.findIndex(
                      (story) =>
                        getOwnerName(story) ===
                        storyOwner.name
                    );

                  const avatar =
                    getOwnerAvatar(storyOwner);

                  const isCurrentOwner =
                    getOwnerName(currentStory) ===
                    storyOwner.name;

                  return (
                    <button
                      key={`${storyOwner.name}-${storyOwner.id || ownerStoryIndex}`}
                      className={`story-owner-list-item ${
                        isCurrentOwner
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {

                        if (
                          ownerStoryIndex >= 0
                        ) {
                          changeStory(
                            ownerStoryIndex
                          );
                        }

                      }}
                    >

                      {/* AVATAR */}

                      <div
                        className={`story-owner-list-avatar ${
                          isCurrentOwner
                            ? "active-ring"
                            : ""
                        }`}
                      >

                        {avatar ? (
                          <img
                            src={avatar}
                            alt={storyOwner.name}
                          />
                        ) : (
                          <span>
                            {storyOwner.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </span>
                        )}

                      </div>

                      {/* OWNER INFO */}

                      <div className="story-owner-list-info">

                        <strong>
                          {storyOwner.name}
                        </strong>

                        <span>
                          {ownerStories.length === 1
                            ? "1 story"
                            : `${ownerStories.length} stories`}
                        </span>

                      </div>

                      <ChevronRight
                        size={17}
                        className="story-owner-arrow"
                      />

                    </button>
                  );
                })}

              </div>

            </div>

          </aside>
        )}

      </div>

      {/* MOBILE NAVIGATION */}

      <MobileNav />

    </div>
  );
}

export default StoryViewerPage;