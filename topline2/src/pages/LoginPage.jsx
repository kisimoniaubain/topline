import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react"; // FIXED: Changed from react-router-dom to lucide-react
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import "./loginPage.css";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      // 2. Read existing cached local user data to preserve uploaded Cloudinary photos
      let localUser = {};
      try {
        const storedLocal = localStorage.getItem("topline_user");
        if (storedLocal && storedLocal !== "undefined" && storedLocal !== "null") {
          localUser = JSON.parse(storedLocal);
        }

        // Also check scoped storage key if available
        const userKey = `topline_user_${data.user?.username || data.user?.id || data.user?.email}`;
        const storedUserScoped = localStorage.getItem(userKey);
        if (storedUserScoped && storedUserScoped !== "undefined") {
          const parsedScoped = JSON.parse(storedUserScoped);
          localUser = { ...localUser, ...parsedScoped };
        }
      } catch (e) {
        console.error("Error reading stored user cache:", e);
      }

      // 3. Merge backend user with local profile & cover images
      const mergedUser = {
        ...data.user,
        profileImage: data.user?.profileImage || localUser?.profileImage || "",
        coverImage: data.user?.coverImage || localUser?.coverImage || "",
      };

      // 4. Save merged user data back to localStorage
      localStorage.setItem("topline_user", JSON.stringify(mergedUser));

      if (mergedUser.username || mergedUser.id) {
        const userKey = `topline_user_${mergedUser.username || mergedUser.id}`;
        localStorage.setItem(userKey, JSON.stringify(mergedUser));
      }

      // Trigger storage event so Navbar updates instantly
      window.dispatchEvent(new Event("storage"));

      onLogin();

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
      <div className="auth-brand">
        <Logo />
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span>WELCOME BACK</span>

          <h1>Log in to Topline</h1>

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

            {!loading && <ArrowRight size={18} />}
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
    </div>
  );
}

export default LoginPage;


// import { useState } from "react";
// import { ArrowRight, Eye, EyeOff } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// // import { ArrowRight } from "lucide-react";
// import Logo from "../components/Logo";
// import "./loginPage.css";

// function LoginPage({ onLogin }) {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (event) => {
//     setForm({
//       ...form,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: form.email,
//           password: form.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(
//           data.message ||
//             "Incorrect email/username or password."
//         );

//         setLoading(false);
//         return;
//       }

//       localStorage.setItem(
//         "topline_token",
//         data.token
//       );

//       localStorage.setItem(
//         "topline_user",
//         JSON.stringify(data.user)
//       );

//       onLogin();

//       navigate("/home", { replace: true });
//     } catch (error) {
//       console.error("Login error:", error);

//       setError(
//         "Unable to connect to Topline. Please try again."
//       );

//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-brand">
//         <Logo />
//       </div>

//       <div className="auth-card">
//         <div className="auth-heading">
//           <span>WELCOME BACK</span>

//           <h1>Log in to Topline</h1>

//           <p>
//             Continue connecting, sharing, and discovering
//             what's happening around you.
//           </p>
//         </div>

//         {error && (
//           <div className="form-error">
//             {error}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="auth-form"
//         >
//           <label>
//             Email or username

//             <input
//               type="text"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Enter your email or username"
//               required
//             />
//           </label>
//           <label>
//   Password

//   <div className="password-input-wrapper">
//     <input
//       type={showPassword ? "text" : "password"}
//       name="password"
//       value={form.password}
//       onChange={handleChange}
//       placeholder="Enter your password"
//       required
//     />

//     <button
//       type="button"
//       className="password-view-btn"
//       onClick={() => setShowPassword(!showPassword)}
//       aria-label={showPassword ? "Hide password" : "Show password"}
//     >
//       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//     </button>
//   </div>
// </label>

//           {/* <label>
//             Password

//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required
//             />
//           </label> */}

//           <button
//             type="submit"
//             className="primary-button full"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Log in"}

//             {!loading && <ArrowRight size={18} />}
//           </button>
//         </form>

//         <div className="auth-divider">
//           <span>OR</span>
//         </div>

//         <p className="auth-switch">
//           Don't have an account?{" "}
//           <Link to="/register">
//             Create one
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;