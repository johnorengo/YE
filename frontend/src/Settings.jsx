import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Database,
  Facebook,
  HardDrive,
  Mail,
  Play,
  Search,
  Settings as SettingsIcon,
  Shield,
  UploadCloud,
  Users,
  WalletCards,
  Youtube,
  BadgeCheck,
  Globe,
  Image as ImageIcon
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./Settings.css";

const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";
const avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";

const tabs = [
  ["General", SettingsIcon],
  ["Security", Shield],
  ["Notifications", Bell],
  ["Moderation Rules", BadgeCheck],
  ["Payments", CreditCard],
  ["Roles & Permissions", Users],
  ["Branding", ImageIcon]
];

function Topbar({ onSave }) {
  return (
    <header className="settings-topbar">
      <div>
        <h1>System Settings</h1>
        <p>Manage your platform settings, security, and preferences</p>
      </div>
      <div className="settings-topbar-actions">
        <label className="settings-search">
          <Search size={22} />
          <input placeholder="Search profiles, towns, roads, ads..." />
        </label>
        <button className="settings-bell" type="button" aria-label="Notifications"><Bell size={24} /><span>6</span></button>
        <div className="settings-admin">
          <img src={adminAvatar} alt="" />
          <span><strong>Admin User</strong><small>Super Administrator</small></span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
        <button className="settings-save-top" type="button" onClick={onSave}>Save Changes</button>
        <button className="settings-cancel-top" type="button">Cancel</button>
      </div>
    </header>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="settings-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Toggle({ label, note, checked, onChange }) {
  return (
    <label className="settings-toggle-row">
      <span><strong>{label}</strong><small>{note}</small></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i />
    </label>
  );
}

function CardActions({ onSave }) {
  return <div className="settings-card-actions"><button type="button">Cancel</button><button type="button" onClick={onSave}>Save Changes</button></div>;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  const [savedAt, setSavedAt] = useState("");
  const [settings, setSettings] = useState({
    platformName: "Young Escorts Kenya",
    platformEmail: "admin@youngescortskenya.co.ke",
    timezone: "(UTC+03:00) Nairobi",
    dateFormat: "May 31, 2025",
    itemsPerPage: "25",
    language: "English",
    allowRegistration: true,
    emailVerification: true,
    maintenanceMode: false,
    adExpiry: "30",
    maxImages: "10",
    descriptionLength: "2000",
    imageTypes: "JPG, PNG, WEBP",
    motto: "Find towns and roads across Kenya",
    analyticsId: "G-XXXXXXXXXX",
    supportEmail: "support@youngescortskenya.co.ke",
    supportPhone: "+254 700 000 000",
    office: "Nairobi, Kenya",
    hours: "Mon - Fri: 8:00 AM - 6:00 PM",
    facebook: "https://facebook.com/youngescortskenya",
    twitter: "https://x.com/youngescortskenya",
    instagram: "https://instagram.com/youngescortskenya",
    youtube: "https://youtube.com/@youngescortskenya"
  });

  function update(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function saveChanges() {
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Settings" />
      <div className="settings-main">
        <Topbar onSave={saveChanges} />
        <main className="settings-content">
          {savedAt && <div className="settings-toast">Settings saved at {savedAt}</div>}
          <nav className="settings-tabs" aria-label="Settings sections">
            {tabs.map(([label, Icon]) => (
              <button className={activeTab === label ? "active" : ""} type="button" onClick={() => setActiveTab(label)} key={label}>
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>

          <section className="settings-layout">
            <div className="settings-left">
              <section className="settings-card">
                <h2>{activeTab === "General" ? "General Settings" : `${activeTab} Settings`}</h2>
                <p>Configure basic platform settings and preferences.</p>
                <div className="settings-form-grid">
                  <Field label="Platform Name" value={settings.platformName} onChange={(value) => update("platformName", value)} />
                  <Field label="Platform Email" value={settings.platformEmail} onChange={(value) => update("platformEmail", value)} />
                  <label className="settings-field"><span>Default Timezone</span><select value={settings.timezone} onChange={(event) => update("timezone", event.target.value)}><option>(UTC+03:00) Nairobi</option><option>(UTC+00:00) UTC</option></select></label>
                  <label className="settings-field"><span>Date Format</span><select value={settings.dateFormat} onChange={(event) => update("dateFormat", event.target.value)}><option>May 31, 2025</option><option>2025-05-31</option></select></label>
                  <label className="settings-field"><span>Items Per Page</span><select value={settings.itemsPerPage} onChange={(event) => update("itemsPerPage", event.target.value)}><option>25</option><option>50</option><option>100</option></select></label>
                  <label className="settings-field"><span>Default Language</span><select value={settings.language} onChange={(event) => update("language", event.target.value)}><option>English</option><option>Swahili</option></select></label>
                </div>
                <Toggle label="Allow User Registration" note="Allow new users to create accounts" checked={settings.allowRegistration} onChange={(value) => update("allowRegistration", value)} />
                <Toggle label="Require Email Verification" note="Users must verify email before posting ads" checked={settings.emailVerification} onChange={(value) => update("emailVerification", value)} />
                <Toggle label="Maintenance Mode" note="Temporarily disable public access to the platform" checked={settings.maintenanceMode} onChange={(value) => update("maintenanceMode", value)} />
                <CardActions onSave={saveChanges} />
              </section>

              <section className="settings-card">
                <h2>Contact Information</h2>
                <p>Update platform contact details.</p>
                <div className="settings-form-grid">
                  <Field label="Support Email" value={settings.supportEmail} onChange={(value) => update("supportEmail", value)} />
                  <Field label="Support Phone" value={settings.supportPhone} onChange={(value) => update("supportPhone", value)} />
                  <Field label="Office Location" value={settings.office} onChange={(value) => update("office", value)} />
                  <Field label="Business Hours" value={settings.hours} onChange={(value) => update("hours", value)} />
                </div>
                <CardActions onSave={saveChanges} />
              </section>
            </div>

            <div className="settings-middle">
              <section className="settings-card">
                <h2>Site & Content Settings</h2>
                <p>Manage content and media preferences.</p>
                <div className="settings-form-grid">
                  <Field label="Default Ad Expiry (Days)" value={settings.adExpiry} onChange={(value) => update("adExpiry", value)} />
                  <Field label="Max Images Per Ad" value={settings.maxImages} onChange={(value) => update("maxImages", value)} />
                  <Field label="Max Ad Description Length" value={settings.descriptionLength} onChange={(value) => update("descriptionLength", value)} />
                  <label className="settings-field"><span>Allowed Image Types</span><select value={settings.imageTypes} onChange={(event) => update("imageTypes", event.target.value)}><option>JPG, PNG, WEBP</option><option>JPG, PNG</option></select></label>
                  <label className="settings-field wide"><span>Site Motto</span><input value={settings.motto} onChange={(event) => update("motto", event.target.value)} /></label>
                  <label className="settings-field wide"><span>Google Analytics ID (Optional)</span><input value={settings.analyticsId} onChange={(event) => update("analyticsId", event.target.value)} /></label>
                </div>
                <CardActions onSave={saveChanges} />
              </section>

              <section className="settings-card">
                <h2>Social Media Links</h2>
                <p>Manage your social media presence.</p>
                <div className="social-form">
                  <label><Facebook size={22} />Facebook<input value={settings.facebook} onChange={(event) => update("facebook", event.target.value)} /></label>
                  <label><Globe size={22} />Twitter (X)<input value={settings.twitter} onChange={(event) => update("twitter", event.target.value)} /></label>
                  <label><Globe size={22} />Instagram<input value={settings.instagram} onChange={(event) => update("instagram", event.target.value)} /></label>
                  <label><Youtube size={22} />YouTube<input value={settings.youtube} onChange={(event) => update("youtube", event.target.value)} /></label>
                </div>
                <CardActions onSave={saveChanges} />
              </section>
            </div>

            <aside className="settings-rail">
              <section className="settings-rail-card">
                <h2>System Status</h2>
                <p className="operational"><i />All Systems Operational</p>
                {[["Web Server", "Online", Globe], ["Database", "Online", Database], ["Storage", "72% Used", HardDrive], ["CDN", "Online", Users], ["Email Service", "Online", Mail], ["Payment Gateway", "Online", WalletCards]].map(([label, value, Icon]) => (
                  <div className="status-row" key={label}><Icon size={18} /><span>{label}</span><b>{value}</b>{label === "Storage" && <em><i /></em>}</div>
                ))}
              </section>

              <section className="settings-rail-card">
                <h2>Last Backup</h2>
                <div className="backup-row"><UploadCloud size={22} /><span><strong>May 30, 2025 - 02:15 AM</strong><small>Daily automated backup</small></span></div>
                <button className="backup-button" type="button" onClick={saveChanges}><Play size={16} />Run Backup Now</button>
              </section>

              <section className="settings-rail-card">
                <div className="activity-heading"><h2>Recent Admin Activity</h2><a href="#settings-admin">View all</a></div>
                {["Admin User updated system settings", "Maya D. updated moderation rules", "Zuri Love approved new admin role", "Aisha K. updated payment settings", "Brian M. exported user reports"].map((item, index) => (
                  <article className="activity-row" key={item}><img src={index === 0 ? adminAvatar : avatar} alt="" /><span><strong>{item}</strong><small>{index === 0 ? "2 minutes ago" : `${index} hour ago`}</small></span></article>
                ))}
              </section>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
