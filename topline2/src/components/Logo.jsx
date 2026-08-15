import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Logo() {
  return (
    <Link to="/" className="topline-logo">
      <img
        src={logo}
        alt="Topline"
        className="topline-logo-image"
      />
    </Link>
  );
}

export default Logo;