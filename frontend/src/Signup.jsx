import { useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, Crown, Lock, Mail, MapPin, Phone, ShieldCheck, Sparkles, Star, User } from "lucide-react";
import { counties } from "./data/kenyaDirectory.js";
import "./Signup.css";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountyCode, setSelectedCountyCode] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [subscription, setSubscription] = useState("VIP");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCounty = useMemo(
    () => counties.find((county) => county.code === selectedCountyCode),
    [selectedCountyCode]
  );

  function handleCountyChange(event) {
    setSelectedCountyCode(event.target.value);
    setSelectedTown("");
  }

  const plans = [
    { name: "VVIP", price: "KES 4,500", icon: Crown, note: "Top placement, boosted visibility, priority review" },
    { name: "VIP", price: "KES 3,000", icon: Sparkles, note: "Featured profile, extra photos, faster approval" },
    { name: "REGULAR", price: "KES 1,500", icon: Star, note: "Standard listing, profile tools, secure messages" }
  ];

  function handleSubmit() {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim() || !selectedCounty || !selectedTown) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000";

    fetch(`${apiBaseUrl}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        countyCode: selectedCounty.code,
        countyName: selectedCounty.name,
        town: selectedTown,
        subscription
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        // Store token and user info
        localStorage.setItem("yekAuthToken", data.token);
        localStorage.setItem("yekUser", JSON.stringify({
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          phone: data.user.phone,
          county: data.user.county,
          town: data.user.town,
          subscription: data.user.subscription,
          isNewSignup: true
        }));

        setLoading(false);
        window.location.hash = "client-dashboard";
      })
      .catch((error) => {
        console.error("Signup error:", error);
        setError("Failed to create account. Please try again.");
        setLoading(false);
      });
  }

  return (
    <main className="signup-page">
      <section className="signup-panel">
        <a className="signup-back" href="#">
          <ArrowLeft size={18} />
          Back to Home
        </a>
        <div className="signup-brand">
          <span className="signup-brand-mark" />
          <strong>Young Escorts Kenya</strong>
        </div>
        <h1>Create Account</h1>
        <p>Create your profile account, choose your county and town, then select the subscription level that fits your visibility needs.</p>
        <form className="signup-form">
          <label>
            Full Name
            <span>
              <User size={18} />
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" />
            </span>
          </label>
          <label>
            Email Address
            <span>
              <Mail size={18} />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </span>
          </label>
          <label>
            Phone Number
            <span>
              <Phone size={18} />
              <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0712 345 678" />
            </span>
          </label>
          <label>
            County
            <span className="signup-select-wrap">
              <MapPin size={18} />
              <select value={selectedCountyCode} onChange={handleCountyChange}>
                <option value="">Choose county</option>
                {counties.map((county) => (
                  <option value={county.code} key={county.code}>
                    {county.name}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <label>
            Nearest Town
            <span className="signup-select-wrap">
              <MapPin size={18} />
              <select
                value={selectedTown}
                onChange={(event) => setSelectedTown(event.target.value)}
                disabled={!selectedCounty}
              >
                <option value="">{selectedCounty ? "Choose nearest town" : "Select county first"}</option>
                {selectedCounty?.towns.map((town) => (
                  <option value={town} key={town}>
                    {town}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <label>
            Password
            <span>
              <Lock size={18} />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create password" />
            </span>
          </label>
          <fieldset className="subscription-fieldset">
            <legend>Choose Subscription</legend>
            <div className="subscription-options">
              {plans.map(({ name, price, icon: Icon, note }) => (
                <button
                  className={subscription === name ? "active" : ""}
                  type="button"
                  onClick={() => setSubscription(name)}
                  key={name}
                >
                  <Icon size={24} />
                  <strong>{name}</strong>
                  <span>{price} / month</span>
                  <small>{note}</small>
                  {subscription === name && <BadgeCheck size={18} />}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="signup-secure-note"><ShieldCheck size={17} /> Your account details will be reviewed before your public profile goes live.</p>
          {error && <p className="signup-error">{error}</p>}
          <button type="button" onClick={handleSubmit} disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</button>
        </form>
        <p className="signup-switch">
          Already have an account? <a href="#signin">Sign in</a>
        </p>
      </section>
    </main>
  );
}
