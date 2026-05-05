import {
  BarChart3,
  Check,
  CheckSquare,
  CreditCard,
  Home,
  Inbox,
  MapPin,
  Megaphone,
  Route,
  Settings,
  ShieldCheck,
  User
} from "lucide-react";
import "./sidebar.css";

const navItems = [
  { label: "Dashboard", icon: Home, href: "#admin" },
  { label: "Profiles", icon: User, href: "#profiles-admin" },
  { label: "Locations", icon: MapPin, href: "#locations-admin" },
  { label: "Roads", icon: Route, href: "#roads-admin" },
  { label: "Ads", icon: Megaphone, href: "#ads-admin" },
  { label: "Verification", icon: CheckSquare, href: "#verification-admin" },
  { label: "Reports", icon: ShieldCheck, href: "#reports-admin" },
  { label: "Messages", icon: Inbox, badge: "12", href: "#messages-admin" },
  { label: "Payments", icon: CreditCard, href: "#payments-admin" },
  { label: "Analytics", icon: BarChart3, href: "#analytics-admin" },
  { label: "Settings", icon: Settings, href: "#settings-admin" }
];

function Logo() {
  return (
    <div className="admin-logo" aria-label="Young Escorts Kenya">
      <span className="admin-logo-mark">
        <span />
        <span />
        <span />
      </span>
      <strong>
        Young Escorts
        <br />
        Kenya
      </strong>
    </div>
  );
}

export default function Sidebar({ activeItem = "Dashboard" }) {
  return (
    <aside className="admin-sidebar">
      <Logo />
      <nav className="admin-nav" aria-label="Admin navigation">
        {navItems.map(({ label, icon: Icon, badge, href }) => (
          <a className={label === activeItem ? "active" : ""} href={href} key={label}>
            <Icon size={21} strokeWidth={1.8} />
            <span>{label}</span>
            {badge && <b>{badge}</b>}
          </a>
        ))}
      </nav>
      <div className="security-card">
        <span className="security-icon">
          <ShieldCheck size={22} />
        </span>
        <strong>Admin Security</strong>
        <p>Your account is protected with 2FA.</p>
        <em>
          Secure
          <Check size={14} />
        </em>
      </div>
    </aside>
  );
}
