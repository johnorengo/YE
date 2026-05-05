import { useState } from "react";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import "./Signin.css";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000";

    fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
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
          email: data.user.email
        }));

        if (rememberMe) {
          localStorage.setItem("yekRememberMe", "true");
        }

        setLoading(false);
        window.location.hash = "client-dashboard";
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Failed to sign in. Please try again.");
        setLoading(false);
      });
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <a className="auth-back" href="#">
          <ArrowLeft size={18} />
          Back to Home
        </a>
        <div className="auth-brand">
          <span className="auth-brand-mark" />
          <strong>Young Escorts Kenya</strong>
        </div>
        <h1>Sign In</h1>
        <p>Access your account to manage your profile, messages, and listings.</p>
        <form className="auth-form">
          <label>
            Email Address
            <span>
              <Mail size={18} />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </span>
          </label>
          <label>
            Password
            <span>
              <Lock size={18} />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />
            </span>
          </label>
          <div className="auth-row">
            <label className="auth-check">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
              Remember me
            </label>
            <a href="#forgot-password">Forgot password?</a>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="button" onClick={handleSignIn} disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p className="auth-switch">
          New here? <a href="#signup">Create an account</a>
        </p>
      </section>
    </main>
  );
}
