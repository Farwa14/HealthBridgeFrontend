import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-6 py-3 flex items-center gap-8 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/60"
          : "bg-white/20 backdrop-blur-md border border-white/30"
      }`}
      style={{ minWidth: "min(720px, 94vw)" }}
    >
      <Link
        to="/"
        className="font-bold text-lg tracking-tight"
        style={{ color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Sync
      </Link>

      <div className="flex items-center gap-6 ml-4 flex-1">
        <Link
          to="/doctors"
          className="text-sm transition-all duration-200 hover:-translate-y-px"
          style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}
        >
          Find Doctors
        </Link>
        <Link
          to="/for-doctors"
          className="text-sm transition-all duration-200 hover:-translate-y-px"
          style={{ color: "#1A1A1A", fontFamily: "'Outfit', sans-serif" }}
        >
          For Doctors
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to={user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"}
              className="text-sm font-medium transition-all duration-200"
              style={{ color: "#2E4036" }}
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-full transition-all duration-200 active:scale-95"
              style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm transition-all duration-200 hover:-translate-y-px"
              style={{ color: "#1A1A1A" }}
            >
              Login
            </Link>
            <Link
              to="/register/patient"
              className="text-sm px-4 py-2 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-97"
              style={{ background: "#CC5833", color: "#fff", fontFamily: "'Outfit', sans-serif" }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
