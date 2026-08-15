import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./PreloaderPage.css";

function PreloaderPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="preloader-page">
      <div className="preloader-overlay"></div>

      <div className="preloader-container">
        <img
          src={logo}
          alt="Topline"
          className="preloader-logo"
        />

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="preloader-text">
          Topline is loading...
        </div>

        <div className="preloader-progress">
          <div className="preloader-progress-fill"></div>
        </div>
      </div>
    </div>
  );
}

export default PreloaderPage;