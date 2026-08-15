import { useState } from "react";
import {
  Search,
  UserPlus,
  UserCheck,
  UserMinus,
  MessageCircle,
  Users,
} from "lucide-react";

import "./FriendsPage.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

const people = [
  {
    id: 1,
    name: "Michael",
    username: "michael",
    mutual: 8,
    online: true,
  },
  {
    id: 2,
    name: "Grace",
    username: "grace",
    mutual: 12,
    online: true,
  },
  {
    id: 3,
    name: "Daniel",
    username: "daniel",
    mutual: 5,
    online: false,
  },
  {
    id: 4,
    name: "Sarah",
    username: "sarah",
    mutual: 15,
    online: true,
  },
  {
    id: 5,
    name: "David",
    username: "david",
    mutual: 6,
    online: false,
  },
  {
    id: 6,
    name: "Mary",
    username: "mary",
    mutual: 10,
    online: true,
  },
];

function FriendsPage() {
  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem("topline_friends");

    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] =
    useState("friends");

  const toggleFriend = (person) => {
    let updatedFriends;

    const exists = friends.some(
      (friend) => friend.id === person.id
    );

    if (exists) {
      updatedFriends = friends.filter(
        (friend) => friend.id !== person.id
      );
    } else {
      updatedFriends = [...friends, person];
    }

    setFriends(updatedFriends);

    localStorage.setItem(
      "topline_friends",
      JSON.stringify(updatedFriends)
    );
  };

  const filteredPeople = people.filter((person) =>
    `${person.name} ${person.username}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const myFriends = filteredPeople.filter((person) =>
    friends.some(
      (friend) => friend.id === person.id
    )
  );

  const suggestions = filteredPeople.filter(
    (person) =>
      !friends.some(
        (friend) => friend.id === person.id
      )
  );

  const displayedPeople =
    activeTab === "friends"
      ? myFriends
      : suggestions;

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="feed friends-page">

          {/* HEADER */}

          <section className="friends-header">
            <div>
              <div className="friends-title">
                <Users size={28} />

                <div>
                  <h1>Friends</h1>

                  <p>
                    Connect with people and grow your
                    Topline community.
                  </p>
                </div>
              </div>
            </div>

            <div className="friends-count">
              <strong>{friends.length}</strong>

              <span>
                {friends.length === 1
                  ? "Friend"
                  : "Friends"}
              </span>
            </div>
          </section>

          {/* SEARCH */}

          <section className="friends-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search friends..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </section>

          {/* TABS */}

          <div className="friends-tabs">
            <button
              className={
                activeTab === "friends"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("friends")
              }
            >
              My Friends

              <span>{friends.length}</span>
            </button>

            <button
              className={
                activeTab === "suggestions"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("suggestions")
              }
            >
              People You May Know

              <span>{suggestions.length}</span>
            </button>
          </div>

          {/* FRIENDS GRID */}

          {displayedPeople.length > 0 ? (
            <section className="friends-grid">
              {displayedPeople.map((person) => {
                const isFriend = friends.some(
                  (friend) =>
                    friend.id === person.id
                );

                return (
                  <article
                    className="friend-card"
                    key={person.id}
                  >
                    <div className="friend-cover">
                      <div className="friend-avatar">
                        {person.name.charAt(0)}

                        {person.online && (
                          <span className="friend-online" />
                        )}
                      </div>
                    </div>

                    <div className="friend-info">
                      <h3>{person.name}</h3>

                      <p>
                        @{person.username}
                      </p>

                      <span>
                        {person.mutual} mutual{" "}
                        {person.mutual === 1
                          ? "friend"
                          : "friends"}
                      </span>

                      <div className="friend-actions">
                        {isFriend ? (
                          <>
                            <button
                              className="friend-button"
                              onClick={() =>
                                alert(
                                  `Opening chat with ${person.name}`
                                )
                              }
                            >
                              <MessageCircle
                                size={17}
                              />

                              Message
                            </button>

                            <button
                              className="remove-friend-button"
                              onClick={() =>
                                toggleFriend(person)
                              }
                              title="Remove friend"
                            >
                              <UserMinus
                                size={17}
                              />
                            </button>
                          </>
                        ) : (
                          <button
                            className="friend-button full"
                            onClick={() =>
                              toggleFriend(person)
                            }
                          >
                            <UserPlus
                              size={17}
                            />

                            Add Friend
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : (
            <section className="empty-friends">
              <div>
                <Users size={40} />
              </div>

              <h2>
                {activeTab === "friends"
                  ? "No friends yet"
                  : "No people found"}
              </h2>

              <p>
                {activeTab === "friends"
                  ? "Start adding people to build your Topline network."
                  : "Try searching for another person."}
              </p>

              {activeTab === "friends" && (
                <button
                  className="primary-button"
                  onClick={() =>
                    setActiveTab(
                      "suggestions"
                    )
                  }
                >
                  Find people
                </button>
              )}
            </section>
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default FriendsPage;