import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import "./loginPage.css";

const messages = [
  "Loading your feed...",
  "Connecting with friends...",
  "Finding new friends...",
  "Sending message...",
  "Uploading your profile...",
  "Welcome to topline!",
];

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================
  // Typing Animation
  // ==========================
  const [typingText, setTypingText] = useState("");

  useEffect(() => {
    let messageIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timeout;

    const typeMessage = () => {
      const currentMessage = messages[messageIndex];

      if (!deleting) {
        characterIndex++;

        setTypingText(
          currentMessage.substring(0, characterIndex)
        );

        if (characterIndex >= currentMessage.length) {
          deleting = true;

          timeout = setTimeout(typeMessage, 1800);
          return;
        }

        timeout = setTimeout(typeMessage, 70);
      } else {
        characterIndex--;

        setTypingText(
          currentMessage.substring(0, characterIndex)
        );

        if (characterIndex <= 0) {
          deleting = false;

          messageIndex =
            (messageIndex + 1) % messages.length;

          timeout = setTimeout(typeMessage, 500);
          return;
        }

        timeout = setTimeout(typeMessage, 40);
      }
    };

    typeMessage();

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Incorrect email/username or password."
        );

        setLoading(false);
        return;
      }

      // 1. Store Auth Token
      localStorage.setItem("topline_token", data.token);

      // 2. Read existing cached local user data
      let localUser = {};

      try {
        const storedLocal =
          localStorage.getItem("topline_user");

        if (
          storedLocal &&
          storedLocal !== "undefined" &&
          storedLocal !== "null"
        ) {
          localUser = JSON.parse(storedLocal);
        }

        const userKey = `topline_user_${
          data.user?.username ||
          data.user?.id ||
          data.user?.email
        }`;

        const storedUserScoped =
          localStorage.getItem(userKey);

        if (
          storedUserScoped &&
          storedUserScoped !== "undefined"
        ) {
          const parsedScoped =
            JSON.parse(storedUserScoped);

          localUser = {
            ...localUser,
            ...parsedScoped,
          };
        }
      } catch (e) {
        console.error(
          "Error reading stored user cache:",
          e
        );
      }

      // 3. Merge backend user with local profile & cover images
      const mergedUser = {
        ...data.user,
        profileImage:
          data.user?.profileImage ||
          localUser?.profileImage ||
          "",
        coverImage:
          data.user?.coverImage ||
          localUser?.coverImage ||
          "",
      };

      // 4. Save merged user data
      localStorage.setItem(
        "topline_user",
        JSON.stringify(mergedUser)
      );

      if (mergedUser.username || mergedUser.id) {
        const userKey = `topline_user_${
          mergedUser.username || mergedUser.id
        }`;

        localStorage.setItem(
          userKey,
          JSON.stringify(mergedUser)
        );
      }

      // Trigger storage event
      window.dispatchEvent(new Event("storage"));

      // Tell App that authentication succeeded
      onLogin();

      // Go to Home
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to Topline. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
    <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full border-[55px] border-vibrant-orange/10"></div>
    <div className="pointer-events-none absolute -top-40 left-[22%] h-[480px] w-[480px] rounded-full border-[80px] border-primary/10"></div>

      <div className="auth-brand">
        <Logo />
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span>WELCOME TO TOPLINE</span>

          <p>
            Continue connecting, sharing, and discovering
            what's happening around you.
          </p>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <label>
            Email or username

            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email or username"
              required
            />
          </label>

          <label>
            Password

            <div className="password-input-wrapper">
              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="password-view-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="primary-button full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>
      </div>

   {/* animated massages */}
      <div class="col-md-5 col-sm-5">


          <div class="chat-animation">

           <div class="message received">
             👋 Hello!
           </div>

           <div class="message sent">
              Hi! 😊
           </div>

           <div class="message received">
              Ready for today's online chat?
           </div>

           <div class="message sent">
              Absolutely! 🚀
           </div>

           <div class="message received">
              Loading your feed...
           </div>
          <div class="typing-container">

          <div className="message sent typing-message">
          <span id="typing-text" className="typing-text">
            {typingText}
          </span>
          <span className="cursor">|</span>
        </div>

        <button class="send-btn">
        <i class="fa-solid fa-paper-plane"></i>
        </button>

         </div>
          </div>

           </div>
      

    </div>
  );
}

export default LoginPage;