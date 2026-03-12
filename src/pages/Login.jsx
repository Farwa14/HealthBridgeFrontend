import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.opacity = "0";
      formRef.current.style.transform = "translateY(32px)";
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.transition = "all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)";
          formRef.current.style.opacity = "1";
          formRef.current.style.transform = "translateY(0)";
        }
      }, 80);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      login(data);
      if (data.user.role === "doctor") navigate("/doctor/dashboard");
      else if (data.user.role === "admin") navigate("/admin");
      else navigate("/patient/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F2F0E9" }}>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div ref={formRef} className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center">
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Welcome back
            </p>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}
            >
              Sign in to{" "}
              <em
                className="not-italic"
                style={{ color: "#2E4036", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
              >
                Sync
              </em>
            </h1>
            <p className="text-sm" style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}>
              Your health, organized.
            </p>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-8 shadow-sm border"
            style={{ background: "#fff", borderColor: "rgba(46,64,54,0.08)" }}
          >
            {error && (
              <div
                className="mb-5 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(204,88,51,0.08)", color: "#CC5833", fontFamily: "'Outfit', sans-serif" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  className="block text-xs uppercase tracking-wider mb-2"
                  style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm"
                  style={{
                    borderColor: "rgba(46,64,54,0.15)",
                    background: "#F2F0E9",
                    color: "#1A1A1A",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")}
                />
              </div>

              <div>
                <label
                  className="block text-xs uppercase tracking-wider mb-2"
                  style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm"
                  style={{
                    borderColor: "rgba(46,64,54,0.15)",
                    background: "#F2F0E9",
                    color: "#1A1A1A",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] mt-2"
                style={{
                  background: loading ? "rgba(46,64,54,0.5)" : "#2E4036",
                  color: "#F2F0E9",
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          {/* Bottom links */}
          <div className="mt-6 text-center flex flex-col gap-2">
            <p className="text-sm" style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}>
              New patient?{" "}
              <Link
                to="/register/patient"
                className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "#2E4036" }}
              >
                Create account
              </Link>
            </p>
            <p className="text-sm" style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}>
              Are you a doctor?{" "}
              <Link
                to="/register/doctor"
                className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "#CC5833" }}
              >
                Join as provider
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
