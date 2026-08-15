import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  ArrowLeft,
  Trash2,
  Check,
} from "lucide-react";

import "./MessagesPage.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

const defaultConversations = [
  {
    id: 1,
    name: "Sarah",
    username: "sarah",
    online: true,
    unread: 2,
    messages: [
      {
        id: 1,
        sender: "Sarah",
        text: "Hey! How are you doing?",
        time: "10:20 AM",
        mine: false,
      },
      {
        id: 2,
        sender: "me",
        text: "I'm doing great! How about you?",
        time: "10:22 AM",
        mine: true,
      },
      {
        id: 3,
        sender: "Sarah",
        text: "I'm good too 😊",
        time: "10:23 AM",
        mine: false,
      },
    ],
  },
  {
    id: 2,
    name: "David",
    username: "david",
    online: true,
    unread: 0,
    messages: [
      {
        id: 4,
        sender: "me",
        text: "Are you coming tomorrow?",
        time: "Yesterday",
        mine: true,
      },
      {
        id: 5,
        sender: "David",
        text: "Yes, definitely.",
        time: "Yesterday",
        mine: false,
      },
    ],
  },
  {
    id: 3,
    name: "Jane",
    username: "jane",
    online: false,
    unread: 1,
    messages: [
      {
        id: 6,
        sender: "Jane",
        text: "Did you see my post?",
        time: "Monday",
        mine: false,
      },
    ],
  },
  {
    id: 4,
    name: "Michael",
    username: "michael",
    online: false,
    unread: 0,
    messages: [
      {
        id: 7,
        sender: "me",
        text: "Let's catch up sometime.",
        time: "Sunday",
        mine: true,
      },
    ],
  },
];

function MessagesPage() {
  const user = JSON.parse(
    localStorage.getItem("topline_user") || "{}"
  );

  const currentUserName = user.name || "You";

  const [conversations, setConversations] =
    useState(() => {
      const saved = localStorage.getItem(
        "topline_conversations"
      );

      return saved
        ? JSON.parse(saved)
        : defaultConversations;
    });

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const [mobileChat, setMobileChat] =
    useState(false);

  useEffect(() => {
    localStorage.setItem(
      "topline_conversations",
      JSON.stringify(conversations)
    );
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) =>
      `${conversation.name} ${conversation.username}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [conversations, search]);

  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id === selectedConversation
    ) || null;

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation.id);

    setMobileChat(true);

    setConversations((previous) =>
      previous.map((item) =>
        item.id === conversation.id
          ? {
              ...item,
              unread: 0,
            }
          : item
      )
    );
  };

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !activeConversation) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: currentUserName,
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mine: true,
    };

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                newMessage,
              ],
            }
          : conversation
      )
    );

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    if (!activeConversation) {
      return;
    }

    const confirmed = window.confirm(
      `Delete your conversation with ${activeConversation.name}?`
    );

    if (!confirmed) {
      return;
    }

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              messages: [],
            }
          : conversation
      )
    );
  };

  const totalUnread = conversations.reduce(
    (total, conversation) =>
      total + conversation.unread,
    0
  );

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="messages-page">

          {/* =========================
              CONVERSATIONS
          ========================= */}

          <section
            className={`messages-sidebar ${
              mobileChat
                ? "mobile-hidden"
                : ""
            }`}
          >
            <div className="messages-heading">
              <div>
                <h1>Messages</h1>

                <span>
                  {totalUnread > 0
                    ? `${totalUnread} unread`
                    : "All caught up"}
                </span>
              </div>
            </div>

            {/* SEARCH */}

            <div className="messages-search">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search messages"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            {/* CONVERSATIONS */}

            <div className="conversation-list">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(
                  (conversation) => {
                    const lastMessage =
                      conversation.messages[
                        conversation.messages.length - 1
                      ];

                    return (
                      <button
                        className={`conversation ${
                          selectedConversation ===
                          conversation.id
                            ? "selected"
                            : ""
                        }`}
                        key={conversation.id}
                        onClick={() =>
                          selectConversation(
                            conversation
                          )
                        }
                      >
                        <div className="conversation-avatar">
                          {conversation.name.charAt(
                            0
                          )}

                          {conversation.online && (
                            <span />
                          )}
                        </div>

                        <div className="conversation-info">
                          <div className="conversation-top">
                            <strong>
                              {conversation.name}
                            </strong>

                            {lastMessage && (
                              <small>
                                {lastMessage.time}
                              </small>
                            )}
                          </div>

                          <div className="conversation-bottom">
                            <p>
                              {lastMessage
                                ? lastMessage.text
                                : "No messages yet"}
                            </p>

                            {conversation.unread >
                              0 && (
                              <span className="unread-badge">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  }
                )
              ) : (
                <div className="no-conversations">
                  <Search size={30} />

                  <p>
                    No conversations found.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =========================
              CHAT
          ========================= */}

          <section
            className={`chat-window ${
              !mobileChat
                ? "mobile-chat-hidden"
                : ""
            }`}
          >
            {activeConversation ? (
              <>
                {/* CHAT HEADER */}

                <header className="chat-header">
                  <button
                    className="back-button"
                    onClick={() =>
                      setMobileChat(false)
                    }
                  >
                    <ArrowLeft size={21} />
                  </button>

                  <div className="chat-user-avatar">
                    {activeConversation.name.charAt(
                      0
                    )}

                    {activeConversation.online && (
                      <span />
                    )}
                  </div>

                  <div className="chat-user-info">
                    <strong>
                      {activeConversation.name}
                    </strong>

                    <span>
                      {activeConversation.online
                        ? "Active now"
                        : "Offline"}
                    </span>
                  </div>

                  <div className="chat-header-actions">
                    <button
                      onClick={() =>
                        alert(
                          `Calling ${activeConversation.name}...`
                        )
                      }
                      aria-label="Call"
                    >
                      <Phone size={19} />
                    </button>

                    <button
                      onClick={() =>
                        alert(
                          `Starting video call with ${activeConversation.name}...`
                        )
                      }
                      aria-label="Video call"
                    >
                      <Video size={19} />
                    </button>

                    <button
                      onClick={clearConversation}
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={19} />
                    </button>

                    <button
                      aria-label="More options"
                      onClick={() =>
                        alert(
                          "More conversation options coming soon."
                        )
                      }
                    >
                      <MoreVertical size={19} />
                    </button>
                  </div>
                </header>

                {/* MESSAGES */}

                <div className="chat-messages">
                  {activeConversation.messages
                    .length > 0 ? (
                    activeConversation.messages.map(
                      (item) => (
                        <div
                          className={`message-row ${
                            item.mine
                              ? "mine"
                              : "theirs"
                          }`}
                          key={item.id}
                        >
                          {!item.mine && (
                            <div className="message-avatar">
                              {activeConversation.name.charAt(
                                0
                              )}
                            </div>
                          )}

                          <div className="message-content">
                            <div className="message-bubble">
                              {item.text}
                            </div>

                            <div className="message-time">
                              {item.time}

                              {item.mine && (
                                <Check size={13} />
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="empty-chat">
                      <div>
                        {activeConversation.name.charAt(
                          0
                        )}
                      </div>

                      <h2>
                        Start a conversation
                      </h2>

                      <p>
                        Send a message to{" "}
                        {activeConversation.name}.
                      </p>
                    </div>
                  )}
                </div>

                {/* MESSAGE COMPOSER */}

                <div className="message-composer">
                  <button
                    onClick={() =>
                      alert(
                        "File attachments are coming soon."
                      )
                    }
                    aria-label="Attach file"
                  >
                    <Paperclip size={20} />
                  </button>

                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${activeConversation.name}...`}
                    rows="1"
                  />

                  <button
                    onClick={() =>
                      alert(
                        "Emoji picker coming soon."
                      )
                    }
                    aria-label="Emoji"
                  >
                    <Smile size={20} />
                  </button>

                  <button
                    className="send-message-button"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    aria-label="Send message"
                  >
                    <Send size={19} />
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <div>
                  <Send size={35} />
                </div>

                <h2>Your messages</h2>

                <p>
                  Select a conversation to start
                  chatting.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default MessagesPage;