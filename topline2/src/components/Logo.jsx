import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import logo1 from "../assets/logo1.png";

function Logo() {
  return (
    <Link to="/" className="topline-logo">
      <img
        src={document.body.classList.contains("dark") ? logo1 : logo}
        alt="Topline"
        className="topline-logo-image"
      />
    </Link>
  );
}

export default Logo;