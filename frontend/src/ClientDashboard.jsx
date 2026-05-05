import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  CreditCard,
  Crown,
  Edit3,
  Eye,
  Gauge,
  Home,
  ImagePlus,
  Inbox,
  Lock,
  MapPin,
  Megaphone,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  User,
  WalletCards
} from "lucide-react";
import { counties } from "./data/kenyaDirectory.js";
import "./ClientDashboard.css";

const avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80";

const navItems = [
  ["Overview", Home],
  ["My Profile", User],
  ["Photos", Camera],
  ["Subscription", Crown],
  ["Ads", Megaphone],
  ["Messages", Inbox],
  ["Payments", WalletCards],
  ["Settings", Settings]
];

const subscriptionPlans = [
  { name: "VVIP", price: "KES 4,500", tone: "red", icon: Crown, features: ["Top profile placement", "Daily boost credits", "Priority verification", "20 photo slots"] },
  { name: "VIP", price: "KES 3,000", tone: "blue", icon: Sparkles, features: ["Featured profile badge", "Weekly boost credits", "Faster approval", "12 photo slots"] },
  { name: "REGULAR", price: "KES 1,500", tone: "green", icon: Star, features: ["Standard listing", "Secure messages", "Basic analytics", "6 photo slots"] }
];

function Logo() {
  return (
    <div className="client-logo">
      <span className="client-logo-mark"><span /><span /><span /></span>
      <strong>Young Escorts<br />Kenya</strong>
    </div>
  );
}

function ClientSidebar({ active, setActive }) {
  return (
    <aside className="client-sidebar">
      <Logo />
      <nav className="client-nav" aria-label="Client dashboard navigation">
        {navItems.map(([label, Icon]) => (
          <button className={active === label ? "active" : ""} type="button" onClick={() => setActive(label)} key={label}>
            <Icon size={21} strokeWidth={1.8} />
            <span>{label}</span>
            {label === "Messages" && <b>3</b>}
          </button>
        ))}
      </nav>
      <section className="client-security">
        <span><ShieldCheck size={22} /></span>
        <strong>Account Security</strong>
        <p>Verification and 2FA protect your profile.</p>
        <em>Secure <Check size={14} /></em>
      </section>
    </aside>
  );
}

function Topbar({ query, setQuery, active, account, plan, onLogout }) {
  return (
    <header className="client-topbar">
      <div>
        <h1>{active === "Overview" ? "Client Dashboard" : active}</h1>
        <p>Manage your profile, subscription, ads, photos, and messages.</p>
      </div>
      <div className="client-topbar-actions">
        <label className="client-search">
          <Search size={22} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your profile, ads, messages..." />
        </label>
        <button className="client-bell" type="button" aria-label="Notifications"><Bell size={24} /><span>4</span></button>
        <div className="client-user">
          <img src={avatar} alt="" />
          <span><strong>{account.alias}</strong><small>{plan} Subscriber</small></span>
          <ChevronDown size={22} />
        </div>
        <button className="client-logout" type="button" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

function StatCard({ label, value, note, icon: Icon, tone, onClick }) {
  return (
    <button className="client-stat" type="button" onClick={onClick}>
      <span className={`client-stat-icon ${tone}`}><Icon size={32} /></span>
      <div><h2>{label}</h2><strong>{value}</strong><p>{note}</p></div>
    </button>
  );
}

function PlanCard({ plan, selected, onSelect }) {
  const Icon = plan.icon;
  return (
    <button className={`client-plan ${plan.tone} ${selected ? "active" : ""}`} type="button" onClick={onSelect}>
      <span><Icon size={28} /></span>
      <strong>{plan.name}</strong>
      <em>{plan.price} / month</em>
      {plan.features.map((feature) => <small key={feature}><Check size={14} />{feature}</small>)}
      {selected && <b><BadgeCheck size={17} />Current Plan</b>}
    </button>
  );
}

function ProfileEditor({ account, countyCode, setCountyCode, town, setTown, selectedCounty, saveProfile, setStatus }) {
  return (
    <section className="client-card profile-editor">
      <div className="client-heading">
        <div><h2>Profile Setup</h2><p>These details power your public listing and admin review.</p></div>
        <button type="button" onClick={saveProfile}>Save Profile</button>
      </div>
      <div className="profile-banner">
        <img src={avatar} alt="" />
        <button type="button" onClick={() => setStatus("Profile photo upload started")}><ImagePlus size={17} />Upload Photo</button>
      </div>
      <div className="client-form-grid">
        <label><span>Alias</span><input defaultValue={account.alias} /></label>
        <label><span>Phone Number</span><input defaultValue={account.phone} /></label>
        <label><span>County</span><select value={countyCode} onChange={(event) => { setCountyCode(event.target.value); setTown(""); }}>{counties.map((county) => <option value={county.code} key={county.code}>{county.name}</option>)}</select></label>
        <label><span>Nearest Town</span><select value={town} onChange={(event) => setTown(event.target.value)}>{selectedCounty?.towns.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label><span>Main Road</span><input defaultValue="Thika Superhighway" /></label>
        <label><span>Availability</span><select defaultValue="Available Today"><option>Available Today</option><option>Available This Week</option><option>Paused</option></select></label>
        <label className="wide"><span>Short Bio</span><textarea defaultValue={`${account.alias} is setting up a new profile in ${town || account.town}. Profile details are reviewed before publication.`} /></label>
      </div>
    </section>
  );
}

function ReviewCard({ account, town, selectedCounty, setStatus }) {
  return (
    <aside className="client-card client-review-card">
      <h2>Account Review</h2>
      <div className="review-profile"><img src={avatar} alt="" /><div><strong>{account.alias}</strong><small>{town || account.town} - {selectedCounty?.name || account.countyName}</small></div></div>
      {[["Phone Number", "Verified", Phone], ["Profile Photo", "Pending", Camera], ["Location", "Verified", MapPin], ["Account Security", "Enabled", ShieldCheck]].map(([label, state, Icon]) => (
        <p className={state.toLowerCase()} key={label}><Icon size={17} /><span>{label}</span><b>{state}</b></p>
      ))}
      <button type="button" onClick={() => setStatus("Verification request sent")}>Submit For Review</button>
    </aside>
  );
}

function SubscriptionSection({ plan, setPlan, setStatus }) {
  return (
    <section className="client-card subscription-card">
      <div className="client-heading">
        <div><h2>Choose Subscription</h2><p>Switch between VVIP, VIP, and Regular visibility packages.</p></div>
        <span><CalendarDays size={16} />Renews Jun 30, 2025</span>
      </div>
      <div className="client-plan-grid">
        {subscriptionPlans.map((item) => <PlanCard plan={item} selected={plan === item.name} onSelect={() => { setPlan(item.name); setStatus(`${item.name} subscription selected`); }} key={item.name} />)}
      </div>
    </section>
  );
}

function AdsTable({ town, plan, setStatus }) {
  return (
    <section className="client-card client-table-card">
      <div className="client-heading">
        <div><h2>My Ads</h2><p>Track your active listings and admin approval status.</p></div>
        <button type="button" onClick={() => setStatus("New ad draft created")}><Plus size={17} />New Ad</button>
      </div>
      <table className="client-table">
        <thead><tr><th>Ad Title</th><th>Town</th><th>Plan</th><th>Status</th><th>Views</th><th>Actions</th></tr></thead>
        <tbody>
          {[["Professional & Discreet Companion", town || "Nairobi", plan, "Active", "1,245"], ["Weekend Companion Available", "Westlands", "VIP", "Pending Review", "628"], ["Elegant Outing Partner", "Kilimani", "REGULAR", "Draft", "0"]].map(([title, rowTown, rowPlan, rowStatus, views]) => (
            <tr key={title}>
              <td>{title}</td>
              <td>{rowTown}</td>
              <td><span className={`table-plan ${rowPlan.toLowerCase()}`}>{rowPlan}</span></td>
              <td><span className={`table-status ${rowStatus.toLowerCase().replace(" ", "-")}`}>{rowStatus}</span></td>
              <td>{views}</td>
              <td><button type="button" onClick={() => setStatus(`${title} opened for editing`)}><MoreVertical size={17} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ActivityCard() {
  return (
    <aside className="client-card activity-card">
      <h2>Recent Activity</h2>
      {["Profile updated", "VIP subscription renewed", "Admin approved phone verification", "New message from support"].map((item, index) => (
        <article key={item}><span>{index + 1}</span><div><strong>{item}</strong><small>{index === 0 ? "Just now" : `${index} hour ago`}</small></div></article>
      ))}
    </aside>
  );
}

function PhotosSection({ setStatus }) {
  const [photos, setPhotos] = useState([
    avatar,
    "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=240&q=80",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80"
  ]);

  function removePhoto(photo) {
    setPhotos((items) => items.filter((item) => item !== photo));
    setStatus("Photo removed from gallery");
  }

  return (
    <section className="client-section-grid">
      <section className="client-card photos-card">
        <div className="client-heading">
          <div><h2>Photo Gallery</h2><p>Upload and arrange the images shown on your public profile.</p></div>
          <button type="button" onClick={() => setStatus("Photo upload started")}><ImagePlus size={17} />Add Photo</button>
        </div>
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <article key={photo}>
              <img src={photo} alt="" />
              <span>{index === 0 ? "Main Photo" : `Gallery ${index}`}</span>
              <div><button type="button" onClick={() => setStatus("Photo editor opened")}><Edit3 size={15} /></button><button type="button" onClick={() => removePhoto(photo)}><Trash2 size={15} /></button></div>
            </article>
          ))}
          <button className="photo-upload-tile" type="button" onClick={() => setStatus("Photo upload started")}><ImagePlus size={28} /><span>Upload New</span></button>
        </div>
      </section>
      <aside className="client-card client-review-card">
        <h2>Photo Rules</h2>
        {["Clear face photo required", "No duplicate images", "Admin review before publishing", "Maximum depends on subscription"].map((item) => <p className="verified" key={item}><Check size={17} /><span>{item}</span><b>OK</b></p>)}
      </aside>
    </section>
  );
}

function MessagesSection({ setStatus }) {
  const conversations = [
    { name: "Admin Support", text: "Your profile photo is under review.", time: "10:24 AM", unread: 2, messages: ["Your profile photo is under review. We will notify you once approved.", "Thank you. I have uploaded two more photos for review."] },
    { name: "Grace Client", text: "Are you available this weekend?", time: "Yesterday", unread: 1, messages: ["Are you available this weekend?", "Yes, please share the town and time."] },
    { name: "Payments", text: "VIP renewal receipt is ready.", time: "May 30", unread: 0, messages: ["VIP renewal receipt is ready.", "Received. Thank you."] }
  ];
  const [selectedName, setSelectedName] = useState(conversations[0].name);
  const selected = conversations.find((item) => item.name === selectedName) || conversations[0];

  return (
    <section className="client-section-grid messages-layout">
      <section className="client-card message-list-card">
        <h2>Inbox</h2>
        {conversations.map(({ name, text, time, unread }) => (
          <button className={selectedName === name ? "active" : ""} type="button" onClick={() => setSelectedName(name)} key={name}><img src={avatar} alt="" /><span><strong>{name}</strong><small>{text}</small></span><time>{time}</time>{unread > 0 && <b>{unread}</b>}</button>
        ))}
      </section>
      <section className="client-card chat-preview-card">
        <div className="client-heading"><div><h2>{selected.name}</h2><p>Online - Usually replies within 2 hours</p></div></div>
        <div className="client-chat-thread">
          <p className="incoming">{selected.messages[0]}<time>{selected.time}</time></p>
          <p className="outgoing">{selected.messages[1]}<time>10:28 AM</time></p>
        </div>
        <label className="client-composer"><input placeholder="Type your message..." /><button type="button" onClick={() => setStatus("Message sent")}><Send size={17} />Send</button></label>
      </section>
    </section>
  );
}

function PaymentsSection({ plan, setStatus }) {
  return (
    <section className="client-section-grid">
      <section className="client-card client-table-card">
        <div className="client-heading"><div><h2>Payment History</h2><p>Receipts and subscription billing records.</p></div><button type="button" onClick={() => setStatus("Payment method added")}><CreditCard size={17} />Add Method</button></div>
        <table className="client-table">
          <thead><tr><th>Transaction</th><th>Plan</th><th>Method</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {[["TXN-CLIENT-0052", plan, "M-Pesa ****678", "KES 3,000", "Active", "May 31, 2025"], ["TXN-CLIENT-0048", "VIP", "Visa ****4242", "KES 3,000", "Active", "Apr 30, 2025"], ["TXN-CLIENT-0041", "REGULAR", "M-Pesa ****678", "KES 1,500", "Active", "Mar 30, 2025"]].map((row) => (
              <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${cell}`}>{index === 1 ? <span className={`table-plan ${String(cell).toLowerCase()}`}>{cell}</span> : index === 4 ? <span className="table-status active">{cell}</span> : cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </section>
      <aside className="client-card client-review-card">
        <h2>Billing Summary</h2>
        <p className="verified"><WalletCards size={17} /><span>Current Plan</span><b>{plan}</b></p>
        <p className="verified"><CalendarDays size={17} /><span>Next Renewal</span><b>Jun 30</b></p>
        <p className="pending"><CreditCard size={17} /><span>Default Method</span><b>M-Pesa</b></p>
        <button type="button" onClick={() => setStatus("Receipt downloaded")}>Download Receipt</button>
      </aside>
    </section>
  );
}

function SettingsSection({ account, setStatus }) {
  return (
    <section className="client-section-grid">
      <section className="client-card">
        <div className="client-heading"><div><h2>Account Settings</h2><p>Control login, privacy, notifications, and visibility preferences.</p></div><button type="button" onClick={() => setStatus("Settings saved")}>Save Settings</button></div>
        <div className="client-form-grid">
          <label><span>Email</span><input defaultValue={account.email} /></label>
          <label><span>Password</span><input type="password" defaultValue="password" /></label>
          <label><span>Profile Visibility</span><select defaultValue="Public"><option>Public</option><option>Hidden</option><option>Paused</option></select></label>
          <label><span>Message Notifications</span><select defaultValue="Enabled"><option>Enabled</option><option>Disabled</option></select></label>
          <label className="wide"><span>Privacy Note</span><textarea defaultValue="Only show verified contact options to signed-in users." /></label>
        </div>
      </section>
      <aside className="client-card client-review-card">
        <h2>Security</h2>
        <p className="verified"><ShieldCheck size={17} /><span>Two Factor Auth</span><b>Enabled</b></p>
        <p className="verified"><Lock size={17} /><span>Password</span><b>Strong</b></p>
        <p className="pending"><Bell size={17} /><span>Login Alerts</span><b>On</b></p>
      </aside>
    </section>
  );
}

export default function ClientDashboard() {
  const storedAccount = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("yekUser") || JSON.parse(localStorage.getItem("yekClientAccount") || "null"));
    } catch {
      return null;
    }
  }, []);

  const [account, setAccount] = useState(storedAccount || {
    fullName: "Sweet Rose",
    alias: "Sweet Rose",
    email: "sweetrose@example.com",
    phone: "0712 345 678",
    countyCode: "047",
    countyName: "Nairobi City",
    town: "Nairobi",
    subscription: "VIP",
    isNewSignup: false
  });

  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [countyCode, setCountyCode] = useState(account.countyCode);
  const [town, setTown] = useState(account.town);
  const [plan, setPlan] = useState(account.subscription);
  const [status, setStatus] = useState(account.isNewSignup ? "New account created. Complete your profile and submit it for review." : "Draft saved");
  const [saving, setSaving] = useState(false);

  const selectedCounty = useMemo(() => counties.find((county) => county.code === countyCode), [countyCode]);

  useEffect(() => {
    // Fetch profile from backend if user has auth token
    const token = localStorage.getItem("yekAuthToken");
    if (token) {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000";
      
      fetch(`${apiBaseUrl}/api/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            const profile = data.profile || {};
            setAccount({
              id: data.user.id,
              fullName: data.user.full_name,
              alias: profile.alias || data.user.full_name,
              email: data.user.email,
              phone: data.user.phone,
              countyCode: profile.county_code || account.countyCode,
              countyName: profile.county_name || account.countyName,
              town: profile.town || account.town,
              subscription: profile.subscription_plan_id === 1 ? "VVIP" : profile.subscription_plan_id === 2 ? "VIP" : "REGULAR"
            });
            setCountyCode(profile.county_code || account.countyCode);
            setTown(profile.town || account.town);
            setPlan(profile.subscription_plan_id === 1 ? "VVIP" : profile.subscription_plan_id === 2 ? "VIP" : "REGULAR");
          }
        })
        .catch((error) => console.error("Failed to fetch profile:", error));
    }
  }, []);

  function saveProfile() {
    const token = localStorage.getItem("yekAuthToken");
    if (!token) {
      setStatus("Please sign in to save profile changes");
      return;
    }

    setSaving(true);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000";

    fetch(`${apiBaseUrl}/api/profile`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: account.fullName,
        phone: account.phone,
        alias: account.alias,
        county: selectedCounty?.name,
        town: town,
        subscription: plan
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setSaving(false);
        if (data.error) {
          setStatus("Failed to save profile: " + data.error);
        } else {
          setStatus("Profile changes saved successfully");
        }
      })
      .catch((error) => {
        console.error("Save profile error:", error);
        setStatus("Failed to save profile changes");
        setSaving(false);
      });
  }

  function handleLogout() {
    localStorage.removeItem("yekAuthToken");
    localStorage.removeItem("yekUser");
    localStorage.removeItem("yekRememberMe");
    localStorage.removeItem("yekClientAccount");
    window.location.hash = "";
  }

  function renderSection() {
    if (active === "My Profile") {
      return (
        <section className="client-grid">
          <ProfileEditor account={account} countyCode={countyCode} setCountyCode={setCountyCode} town={town} setTown={setTown} selectedCounty={selectedCounty} saveProfile={saveProfile} setStatus={setStatus} />
          <ReviewCard account={account} town={town} selectedCounty={selectedCounty} setStatus={setStatus} />
        </section>
      );
    }

    if (active === "Photos") return <PhotosSection setStatus={setStatus} />;
    if (active === "Subscription") return <SubscriptionSection plan={plan} setPlan={setPlan} setStatus={setStatus} />;
    if (active === "Ads") return <AdsTable town={town} plan={plan} setStatus={setStatus} />;
    if (active === "Messages") return <MessagesSection setStatus={setStatus} />;
    if (active === "Payments") return <PaymentsSection plan={plan} setStatus={setStatus} />;
    if (active === "Settings") return <SettingsSection account={account} setStatus={setStatus} />;

    return (
      <section className="client-grid">
        <ProfileEditor account={account} countyCode={countyCode} setCountyCode={setCountyCode} town={town} setTown={setTown} selectedCounty={selectedCounty} saveProfile={saveProfile} setStatus={setStatus} />
        <ReviewCard account={account} town={town} selectedCounty={selectedCounty} setStatus={setStatus} />
        <SubscriptionSection plan={plan} setPlan={setPlan} setStatus={setStatus} />
        <AdsTable town={town} plan={plan} setStatus={setStatus} />
        <ActivityCard />
      </section>
    );
  }

  return (
    <div className="client-shell">
      <ClientSidebar active={active} setActive={setActive} />
      <div className="client-main">
        <Topbar query={query} setQuery={setQuery} active={active} account={account} plan={plan} onLogout={handleLogout} />
        <main className="client-content">
          {status && <div className="client-toast">{status}</div>}
          <section className="client-stats">
            <StatCard label="Profile Views" value="2,453" note="This month" icon={Eye} tone="blue" onClick={() => setActive("Overview")} />
            <StatCard label="Profile Completion" value="82%" note="Add 2 more photos" icon={Gauge} tone="green" onClick={() => setActive("My Profile")} />
            <StatCard label="Active Ads" value="3" note="2 boosted this week" icon={Megaphone} tone="orange" onClick={() => setActive("Ads")} />
            <StatCard label="Subscription" value={plan} note="Renews Jun 30, 2025" icon={Crown} tone="red" onClick={() => setActive("Subscription")} />
          </section>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
