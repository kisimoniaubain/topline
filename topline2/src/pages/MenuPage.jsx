import { useNavigate } from "react-router-dom";
import "./MenuPage.css";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import { ArrowLeft, Settings, Video, Save, Moon, Sun } from "lucide-react";

export default function MenuPage() {
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <Navbar />
      <div className="menu-page">
      <button onClick={() => navigate("/home")} style={{ marginBottom: 20 }}><ArrowLeft /> Back</button>
      <h2>Menu</h2>
      <button onClick={() => navigate("/settings")} style={{ display: "block", margin: "10px 0" }}><Settings /> Settings</button>
      <button onClick={() => navigate("/saved")} style={{ display: "block", margin: "10px 0" }}><Save /> Saved</button>
      <button onClick={() => navigate("/videos")} style={{ display: "block", margin: "10px 0" }}><Video /> Videos</button>
      <button onClick={() => { document.body.classList.toggle("dark"); localStorage.setItem("topline_dark", document.body.classList.contains("dark") ? "1" : "0"); }} style={{ display: "block", margin: "10px 0", background: "none", border: "none", color: "#111", cursor: "pointer", fontWeight: 600 }}><Moon /> Dark / Light</button>
      <button onClick={() => { localStorage.removeItem("topline_token"); navigate("/login"); }} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, border: "none", background: "#ef4444", color: "white", cursor: "pointer" }}>Log out</button>
    </div>
    <MobileNav />
    </div>
  );
}
