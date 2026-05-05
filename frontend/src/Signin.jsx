import { ArrowLeft, Lock, Mail } from "lucide-react";
import "./Signin.css";

export default function Signin() {
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
              <input type="email" placeholder="you@example.com" />
            </span>
          </label>
          <label>
            Password
            <span>
              <Lock size={18} />
              <input type="password" placeholder="Enter password" />
            </span>
          </label>
          <div className="auth-row">
            <label className="auth-check">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#forgot-password">Forgot password?</a>
          </div>
          <button type="button" onClick={() => { localStorage.removeItem("yekClientAccount"); window.location.hash = "client-dashboard"; }}>Sign In</button>
        </form>
        <p className="auth-switch">
          New here? <a href="#signup">Create an account</a>
        </p>
      </section>
    </main>
  );
}
