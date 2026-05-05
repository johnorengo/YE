import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Map,
  MapPin,
  Route,
  Shield
} from "lucide-react";
import {
  counties as fallbackCounties,
  featuredTowns,
  highways as fallbackHighways
} from "./data/kenyaDirectory.js";
import "./landingpage.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000";

const townImages = {
  Nairobi: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=600&q=80",
  Mombasa: "https://images.unsplash.com/photo-1592329102080-1ef6898eaaef?auto=format&fit=crop&w=600&q=80",
  Kisumu: "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?auto=format&fit=crop&w=600&q=80"
};

const profiles = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80"
];

function Logo() {
  return (
    <a className="brand" href="#" aria-label="Young Escorts Kenya home">
      <span className="brand-mark" aria-hidden="true">
        <span className="mark-dot mark-dot-one" />
        <span className="mark-dot mark-dot-two" />
        <span className="mark-dot mark-dot-three" />
        <span className="mark-arm mark-arm-left" />
        <span className="mark-arm mark-arm-mid" />
        <span className="mark-arm mark-arm-right" />
      </span>
      <span className="brand-name">
        Young Escorts
        <br />
        Kenya
      </span>
    </a>
  );
}

function SelectBox({ icon, label, value, options, onChange }) {
  return (
    <label className="select-box">
      {icon}
      <select value={value} onChange={onChange} aria-label={label}>
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" />
    </label>
  );
}

export default function LandingPage() {
  const [data, setData] = useState({
    counties: fallbackCounties,
    featuredTowns,
    highways: fallbackHighways
  });
  const [town, setTown] = useState("");
  const [road, setRoad] = useState("");

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/landing`)
      .then((response) => {
        if (!response.ok) throw new Error("Landing API unavailable");
        return response.json();
      })
      .then(setData)
      .catch(() =>
        setData({
          counties: fallbackCounties,
          featuredTowns,
          highways: fallbackHighways
        })
      );
  }, []);

  const allTowns = useMemo(
    () => [...new Set(data.counties.flatMap((county) => county.towns))].sort(),
    [data.counties]
  );

  const roadOptions = useMemo(
    () => data.highways.map((highway) => `${highway.code} - ${highway.name}`),
    [data.highways]
  );

  const roadPreview = data.highways.slice(0, 5);
  const popularPreview = ["Nairobi", "Mombasa", "Kisumu"];

  function handleSubmit(event) {
    event.preventDefault();
    const query = new URLSearchParams();
    if (town) query.set("town", town);
    if (road) query.set("road", road);
    window.location.hash = query.toString() ? `map-search?${query}` : "map-search";
  }

  return (
    <div className="page-shell">
      <header className="top-header">
        <Logo />
        <div className="header-actions">
          <a className="auth-link" href="#signin">Sign In</a>
          <a className="auth-link auth-link-strong" href="#signup">Sign Up</a>
          <a className="post-ad" href="#signup">Post Ad</a>
        </div>
      </header>

      <nav className="main-nav" aria-label="Primary navigation">
        <a className="active" href="#">Home</a>
        <a href="#towns">Browse Towns</a>
        <a href="#roads">Major Roads</a>
        <a href="#about">About</a>
        <a href="#signin">Sign In</a>
        <a href="#signup">Sign Up</a>
      </nav>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=80"
            alt="Kenya landscape and skyline"
          />
          <div className="hero-content">
            <h1 id="hero-title">Find towns and roads across Kenya</h1>
            <form className="search-panel" onSubmit={handleSubmit}>
              <div className="search-row">
                <SelectBox
                  icon={<MapPin aria-hidden="true" />}
                  label="Select town"
                  value={town}
                  options={allTowns}
                  onChange={(event) => setTown(event.target.value)}
                />
                <SelectBox
                  icon={<Route aria-hidden="true" />}
                  label="Filter by road"
                  value={road}
                  options={roadOptions}
                  onChange={(event) => setRoad(event.target.value)}
                />
              </div>
              <button className="map-search" type="submit">
                <Map aria-hidden="true" />
                View Map Search
              </button>
            </form>
          </div>
        </section>

        <section className="compact-grid">
          <div className="popular" id="towns">
            <h2>Popular Towns</h2>
            <div className="town-card-row">
              {popularPreview.map((name) => (
                <a className="town-card" href={`#${name.toLowerCase()}`} key={name}>
                  <img src={townImages[name]} alt={`${name} city`} />
                  <span>{name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="roads" id="roads">
            <h2>Browse By Road</h2>
            <div className="road-list">
              {roadPreview.map((highway) => (
                <a href={`#${highway.code.toLowerCase()}`} key={`${highway.code}-${highway.name}`}>
                  <span>
                    <Route aria-hidden="true" />
                    {highway.name.replace(" Road", "")}
                  </span>
                  <ChevronRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="profiles">
            <h2>Latest Profiles</h2>
            <div className="profile-grid">
              {profiles.map((image, index) => (
                <a className="profile-card" href={`#profile-${index + 1}`} key={image}>
                  <img src={image} alt="Profile portrait" />
                  <strong>Name/Alias</strong>
                  <span>Location</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="about">
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="disclaimer">
          <Shield aria-hidden="true" />
          <span>Disclaimer: Users are responsible for verifying information and following applicable laws.</span>
        </p>
      </footer>
    </div>
  );
}
