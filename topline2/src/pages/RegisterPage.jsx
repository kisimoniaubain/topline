import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import "./loginPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [typingText, setTypingText] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          dateOfBirth: form.dateOfBirth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to create your account."
        );
        return;
      }

      localStorage.setItem(
        "topline_token",
        data.token
      );

      localStorage.setItem(
        "topline_user",
        JSON.stringify(data.user)
      );

      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to Topline. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* =========================================
          BRAND
      ========================================= */}
      <div className="auth-brand">
        <Logo />
      </div>


      {/* =========================================
          REGISTER CARD
      ========================================= */}
      <div className="auth-card register-card">

        <div className="auth-heading">
          <span>JOIN TOPLINE</span>

          <p>
            Create your account to join topline.
          </p>
        </div>


        {/* ERROR */}
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {/* FULL NAME */}
          <label>
            Full name

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </label>


          {/* USERNAME */}
          <label>
            Username

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
              required
            />
          </label>


          {/* EMAIL */}
          <label>
            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>


          {/* PASSWORDS */}
          <div className="form-row">

            <label>
              Password

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </label>


            <label>
              Confirm password

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm"
                required
              />
            </label>

          </div>


          {/* DATE OF BIRTH */}
          <label>
            Date of birth

            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
            />
          </label>


          {/* SUBMIT */}
          <button
            type="submit"
            className="primary-button full"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>

        </form>


        {/* LOGIN LINK */}
        <p className="auth-switch">
          Already have an account?{" "}

          <Link to="/login">
            Log in
          </Link>
        </p>

      </div>


      {/* =========================================
          ANIMATED CHAT AREA
      ========================================= */}
      <div className="col-md-5 col-sm-5">

        <div className="chat-animation">

          <div className="message received">
            👋 Hello!
          </div>

          <div className="message sent">
            Hi! 😊
          </div>

          <div className="message received">
            Ready for today's online chat?
          </div>

          <div className="message sent">
            Absolutely! 🚀
          </div>

          <div className="message received">
            Loading your feed...
          </div>


          {/* TYPING AREA */}
          <div className="typing-container">

            <div className="message sent typing-message">

              <span className="typing-text">
                {typingText}
              </span>

              <span className="cursor">
                |
              </span>

            </div>


            <button
              type="button"
              className="send-btn"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;