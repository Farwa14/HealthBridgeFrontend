import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { doctorService } from "../services/doctorService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SPECIALTIES = [
  "All", "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedic Surgeon", "Gynecologist", "Pediatrician", "Psychiatrist",
  "Ophthalmologist", "ENT Specialist",
];

const CITIES = ["All", "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar"];

// Placeholder doctors for UI when backend is offline
const PLACEHOLDER_DOCTORS = [
  { id: "1", full_name: "Dr. Ayesha Malik", specialty: "Cardiologist", city: "Lahore", years_of_experience: 12, online_fee: 2000, rating: 4.8, reviews: 124 },
  { id: "2", full_name: "Dr. Tariq Ahmed", specialty: "Neurologist", city: "Karachi", years_of_experience: 8, online_fee: 2500, rating: 4.7, reviews: 89 },
  { id: "3", full_name: "Dr. Sara Iqbal", specialty: "Dermatologist", city: "Islamabad", years_of_experience: 6, online_fee: 1500, rating: 4.9, reviews: 203 },
  { id: "4", full_name: "Dr. Bilal Chaudhry", specialty: "General Physician", city: "Lahore", years_of_experience: 15, online_fee: 1000, rating: 4.6, reviews: 312 },
  { id: "5", full_name: "Dr. Nadia Hussain", specialty: "Gynecologist", city: "Karachi", years_of_experience: 10, online_fee: 2200, rating: 4.8, reviews: 156 },
  { id: "6", full_name: "Dr. Kamran Shah", specialty: "Pediatrician", city: "Rawalpindi", years_of_experience: 9, online_fee: 1800, rating: 4.5, reviews: 78 },
];

function DoctorCard({ doctor }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = "0";
      cardRef.current.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = "all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)";
          cardRef.current.style.opacity = "1";
          cardRef.current.style.transform = "translateY(0)";
        }
      }, 80);
    }
  }, []);

  const initials = doctor.full_name
    .split(" ")
    .filter((w) => w.startsWith("Dr.") === false)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      ref={cardRef}
      className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{
        background: "#fff",
        borderColor: "rgba(46,64,54,0.08)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(46,64,54,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)")}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
          style={{ background: "rgba(46,64,54,0.08)", color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-base mb-0.5 truncate"
            style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {doctor.full_name}
          </h3>
          <p className="text-sm" style={{ color: "#CC5833", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>
            {doctor.specialty}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#1A1A1A", opacity: 0.45, fontFamily: "'Outfit', sans-serif" }}>
            {doctor.city} &middot; {doctor.years_of_experience} yrs experience
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm" style={{ color: "#2E4036", fontFamily: "'IBM Plex Mono', monospace" }}>
            {doctor.rating?.toFixed(1) || "4.7"}
          </span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className="w-3 h-3" viewBox="0 0 12 12" fill={s <= Math.round(doctor.rating || 4.7) ? "#CC5833" : "rgba(204,88,51,0.2)"}>
                <path d="M6 0l1.5 4H12L8.5 6.5 10 12 6 9l-4 3 1.5-5.5L0 4h4.5z" />
              </svg>
            ))}
          </div>
          <span className="text-xs" style={{ color: "#1A1A1A", opacity: 0.35, fontFamily: "'Outfit', sans-serif" }}>
            ({doctor.reviews || 0})
          </span>
        </div>
        <span className="text-sm font-bold" style={{ color: "#2E4036", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          PKR {(doctor.online_fee || 0).toLocaleString()}
        </span>
      </div>

      <Link
        to={`/doctors/${doctor.id}`}
        className="block w-full py-2.5 rounded-xl text-center text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
        style={{ background: "#2E4036", color: "#F2F0E9", fontFamily: "'Outfit', sans-serif" }}
      >
        View Profile
      </Link>
    </div>
  );
}

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState(PLACEHOLDER_DOCTORS);
  const [specialty, setSpecialty] = useState("All");
  const [city, setCity] = useState("All");
  const [search, setSearch] = useState("");
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.opacity = "0";
      headerRef.current.style.transform = "translateY(30px)";
      setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.style.transition = "all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)";
          headerRef.current.style.opacity = "1";
          headerRef.current.style.transform = "translateY(0)";
        }
      }, 60);
    }

    doctorService.listDoctors().then(setDoctors).catch(() => {
      // Use placeholder data when backend is unavailable
    });
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSpecialty = specialty === "All" || d.specialty === specialty;
    const matchCity = city === "All" || d.city === city;
    const matchSearch =
      !search ||
      d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(search.toLowerCase());
    return matchSpecialty && matchCity && matchSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "#F2F0E9" }}>
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-12 px-4" ref={headerRef}>
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-4 text-center"
            style={{ color: "#2E4036", opacity: 0.5, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Find your specialist
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}
          >
            Doctors across{" "}
            <em style={{ color: "#2E4036", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              Pakistan
            </em>
          </h1>
          <p
            className="text-center text-base max-w-xl mx-auto"
            style={{ color: "#1A1A1A", opacity: 0.5, fontFamily: "'Outfit', sans-serif" }}
          >
            Browse verified specialists. Book online or in-clinic consultations.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-4 flex flex-col md:flex-row gap-3"
            style={{ background: "#fff", border: "1px solid rgba(46,64,54,0.08)" }}
          >
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border outline-none text-sm transition-all duration-200"
              style={{
                borderColor: "rgba(46,64,54,0.15)",
                background: "#F2F0E9",
                color: "#1A1A1A",
                fontFamily: "'Outfit', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2E4036")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(46,64,54,0.15)")}
            />
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="px-4 py-2.5 rounded-xl border outline-none text-sm"
              style={{
                borderColor: "rgba(46,64,54,0.15)",
                background: "#F2F0E9",
                color: "#1A1A1A",
                fontFamily: "'Outfit', sans-serif",
                minWidth: 160,
              }}
            >
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2.5 rounded-xl border outline-none text-sm"
              style={{
                borderColor: "rgba(46,64,54,0.15)",
                background: "#F2F0E9",
                color: "#1A1A1A",
                fontFamily: "'Outfit', sans-serif",
                minWidth: 140,
              }}
            >
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs mb-6"
            style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium mb-2" style={{ color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                No doctors found
              </p>
              <p className="text-sm" style={{ color: "#1A1A1A", opacity: 0.4, fontFamily: "'Outfit', sans-serif" }}>
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
