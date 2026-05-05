import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Crown,
  EllipsisVertical,
  Eye,
  Megaphone,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  Users,
  Clock3,
  ArrowDown
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./profile.css";

const avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=140&q=80";
const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

const initialProfiles = [
  { id: 1, alias: "Sweet Rose", handle: "@sweetrose23", town: "Nairobi", road: "Thika Superhighway", tier: "Premium", status: "Active", verification: "Verified", joinDate: "May 31, 2025", category: "Premium", updated: "2 hours ago", flagged: false },
  { id: 2, alias: "Lily M.", handle: "@lily_m", town: "Mombasa", road: "Mombasa Road", tier: "Standard", status: "Pending", verification: "Under Review", joinDate: "May 30, 2025", category: "Standard", updated: "10 min ago", flagged: false },
  { id: 3, alias: "Nia Brown", handle: "@nia_b", town: "Kisumu", road: "Ngege Road", tier: "Premium", status: "Active", verification: "Verified", joinDate: "May 30, 2025", category: "Premium", updated: "25 min ago", flagged: false },
  { id: 4, alias: "Sharon K.", handle: "@shaz_k", town: "Nairobi", road: "Limuru Road", tier: "Standard", status: "Suspended", verification: "Verified", joinDate: "May 29, 2025", category: "Standard", updated: "1 hour ago", flagged: false },
  { id: 5, alias: "Carla", handle: "@carla_y", town: "Nakuru", road: "Nakuru - Eldoret Road", tier: "Premium", status: "Active", verification: "Verified", joinDate: "May 29, 2025", category: "Premium", updated: "3 hours ago", flagged: false },
  { id: 6, alias: "Zuri Love", handle: "@zuri_l", town: "Mombasa", road: "Nyali Road", tier: "Standard", status: "Pending", verification: "Under Review", joinDate: "May 28, 2025", category: "Standard", updated: "10 min ago", flagged: false },
  { id: 7, alias: "Aisha K.", handle: "@aisha_k", town: "Kisumu", road: "Oginga Odinga Road", tier: "Standard", status: "Active", verification: "Verified", joinDate: "May 27, 2025", category: "Standard", updated: "1 hour ago", flagged: false },
  { id: 8, alias: "Bella", handle: "@bella_x", town: "Eldoret", road: "Eldoret - Kitale Road", tier: "Free", status: "Suspended", verification: "Not Verified", joinDate: "May 27, 2025", category: "Free", updated: "10 min ago", flagged: true },
  { id: 9, alias: "Mystique", handle: "@mystique", town: "Nairobi", road: "Outer Ring Road", tier: "Elite", status: "Suspended", verification: "Not Verified", joinDate: "May 26, 2025", category: "Elite", updated: "45 min ago", flagged: true },
  { id: 10, alias: "Queen B", handle: "@queen_b", town: "Mombasa", road: "Mombasa Road", tier: "Elite", status: "Suspended", verification: "Under Review", joinDate: "May 26, 2025", category: "Elite", updated: "1 hour ago", flagged: true }
];

function Topbar({ search, setSearch, onAdd }) {
  return (
    <header className="profile-topbar">
      <h1>Profile Management</h1>
      <div className="profile-topbar-actions">
        <label className="profile-search">
          <Search size={22} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search profiles, aliases, towns, roads..." />
        </label>
        <button className="profile-bell" type="button" aria-label="Notifications">
          <Bell size={24} />
          <span>6</span>
        </button>
        <div className="profile-admin">
          <img src={adminAvatar} alt="" />
          <span>
            <strong>Admin User</strong>
            <small>Super Administrator</small>
          </span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
        <button className="add-profile" type="button" onClick={onAdd}>
          <Plus size={21} />
          Add Profile
        </button>
      </div>
    </header>
  );
}

function StatCard({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button className={`profile-stat ${active ? "active" : ""}`} type="button" onClick={onClick}>
      <span className={`profile-stat-icon ${item.tone}`}>
        <Icon size={34} />
      </span>
      <div>
        <h2>{item.label}</h2>
        <strong>{item.value}</strong>
        <p>{item.note}</p>
      </div>
      <em className={item.bad ? "bad" : "good"}>{item.delta}</em>
    </button>
  );
}

function TierBadge({ tier }) {
  const Icon = tier === "Premium" ? Crown : tier === "Standard" ? Star : ShieldCheck;
  return (
    <span className={`tier-badge ${tier.toLowerCase()}`}>
      <Icon size={14} />
      {tier}
    </span>
  );
}

function StatusBadge({ status }) {
  return <span className={`profile-status ${status.toLowerCase()}`}>{status}</span>;
}

function VerificationBadge({ verification }) {
  const Icon = verification === "Verified" ? ShieldCheck : verification === "Under Review" ? Clock3 : ShieldAlert;
  return (
    <span className={`verification-badge ${verification.toLowerCase().replaceAll(" ", "-")}`}>
      <Icon size={15} />
      {verification}
    </span>
  );
}

export default function Profile() {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({ town: "All Towns", road: "All Roads", status: "All Statuses", verification: "All Verifications", category: "All Categories" });
  const [search, setSearch] = useState("");

  const filteredProfiles = useMemo(() => {
    const term = search.toLowerCase();
    return profiles.filter((profile) => {
      const matchesSearch = !term || [profile.alias, profile.handle, profile.town, profile.road, profile.status, profile.verification].join(" ").toLowerCase().includes(term);
      const matchesTown = filters.town === "All Towns" || profile.town === filters.town;
      const matchesRoad = filters.road === "All Roads" || profile.road === filters.road;
      const matchesStatus = filters.status === "All Statuses" || profile.status === filters.status;
      const matchesVerification = filters.verification === "All Verifications" || profile.verification === filters.verification;
      const matchesCategory = filters.category === "All Categories" || profile.category === filters.category;
      return matchesSearch && matchesTown && matchesRoad && matchesStatus && matchesVerification && matchesCategory;
    });
  }, [profiles, filters, search]);

  const stats = [
    { key: "All Statuses", label: "Total Profiles", value: profiles.length.toLocaleString(), note: "+1,132 this month", delta: "+ 8.4%", icon: Users, tone: "blue" },
    { key: "Pending", label: "Pending Review", value: profiles.filter((item) => item.status === "Pending").length.toString(), note: "Requires review", delta: "+ 12.6%", icon: Clock3, tone: "orange", bad: true },
    { key: "Active", label: "Active Profiles", value: profiles.filter((item) => item.status === "Active").length.toString(), note: "Currently live", delta: "+ 7.3%", icon: Megaphone, tone: "green" },
    { key: "Suspended", label: "Suspended Profiles", value: profiles.filter((item) => item.status === "Suspended").length.toString(), note: "Temporarily suspended", delta: "+ 5.8%", icon: ShieldAlert, tone: "red", bad: true }
  ];

  const categories = ["All Categories", "Elite", "Premium", "Standard", "Free"];
  const towns = ["All Towns", ...new Set(profiles.map((profile) => profile.town))];
  const roads = ["All Roads", ...new Set(profiles.map((profile) => profile.road))];

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggleSelected(id) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function handleSelectAll(event) {
    setSelectedIds(event.target.checked ? filteredProfiles.map((profile) => profile.id) : []);
  }

  function handleBulkAction(event) {
    const action = event.target.value;
    if (!action) return;
    setProfiles((items) => items.map((item) => {
      if (!selectedIds.includes(item.id)) return item;
      if (action === "activate") return { ...item, status: "Active" };
      if (action === "suspend") return { ...item, status: "Suspended", flagged: true };
      if (action === "verify") return { ...item, verification: "Verified" };
      return item;
    }));
    setSelectedIds([]);
    event.target.value = "";
  }

  function addProfile() {
    const nextId = Math.max(...profiles.map((profile) => profile.id)) + 1;
    setProfiles((items) => [{
      id: nextId,
      alias: `New Profile ${nextId}`,
      handle: `@new_${nextId}`,
      town: "Nairobi",
      road: "Thika Superhighway",
      tier: "Free",
      status: "Pending",
      verification: "Under Review",
      joinDate: "Jun 1, 2025",
      category: "Free",
      updated: "Just now",
      flagged: false
    }, ...items]);
  }

  function clearFilters() {
    setFilters({ town: "All Towns", road: "All Roads", status: "All Statuses", verification: "All Verifications", category: "All Categories" });
    setSearch("");
  }

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Profiles" />
      <div className="profile-main">
        <Topbar search={search} setSearch={setSearch} onAdd={addProfile} />
        <main className="profile-content">
          <section className="profile-stats" aria-label="Profile statistics">
            {stats.map((item) => (
              <StatCard
                item={item}
                active={filters.status === item.key}
                onClick={() => setFilter("status", item.key)}
                key={item.label}
              />
            ))}
          </section>

          <section className="profile-layout">
            <div className="profile-left">
              <section className="profile-filters">
                <label>
                  <span>Town</span>
                  <select value={filters.town} onChange={(event) => setFilter("town", event.target.value)}>
                    {towns.map((town) => <option key={town}>{town}</option>)}
                  </select>
                </label>
                <label>
                  <span>Road</span>
                  <select value={filters.road} onChange={(event) => setFilter("road", event.target.value)}>
                    {roads.map((road) => <option key={road}>{road}</option>)}
                  </select>
                </label>
                <label>
                  <span>Profile Status</span>
                  <select value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>
                    {["All Statuses", "Active", "Pending", "Suspended"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label>
                  <span>Verification Status</span>
                  <select value={filters.verification} onChange={(event) => setFilter("verification", event.target.value)}>
                    {["All Verifications", "Verified", "Under Review", "Not Verified"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label className="filter-search">
                  <span>Search</span>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search alias, email or phone..." />
                  <Search size={18} />
                </label>
                <button type="button" onClick={clearFilters}>Clear Filters</button>
              </section>

              <section className="profiles-table-card">
                <div className="bulk-row">
                  <label>
                    <input type="checkbox" checked={selectedIds.length === filteredProfiles.length && filteredProfiles.length > 0} onChange={handleSelectAll} />
                    Select All
                  </label>
                  <select disabled={selectedIds.length === 0} onChange={handleBulkAction} defaultValue="">
                    <option value="">Bulk Actions</option>
                    <option value="activate">Activate</option>
                    <option value="suspend">Suspend</option>
                    <option value="verify">Verify</option>
                  </select>
                </div>
                <div className="profiles-table-wrap">
                  <table className="profiles-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Photo</th>
                        <th>Alias</th>
                        <th>Town</th>
                        <th>Road</th>
                        <th>Subscription Tier</th>
                        <th>Profile Status</th>
                        <th>Verification</th>
                        <th>Join Date <ArrowDown size={15} /></th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.slice(0, 8).map((profile) => (
                        <tr key={profile.id}>
                          <td><input type="checkbox" checked={selectedIds.includes(profile.id)} onChange={() => toggleSelected(profile.id)} /></td>
                          <td><img className="profile-photo" src={avatar} alt="" /></td>
                          <td><strong>{profile.alias}</strong><small>{profile.handle}</small></td>
                          <td>{profile.town}</td>
                          <td>{profile.road}</td>
                          <td><TierBadge tier={profile.tier} /></td>
                          <td><StatusBadge status={profile.status} /></td>
                          <td><VerificationBadge verification={profile.verification} /></td>
                          <td>{profile.joinDate}</td>
                          <td>
                            <div className="profile-actions">
                              <button type="button" onClick={() => setSearch(profile.alias)} aria-label="View profile"><Eye size={16} /></button>
                              <button type="button" aria-label="More actions"><EllipsisVertical size={17} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="profile-pagination">
                  <p>Showing 1 to {Math.min(filteredProfiles.length, 8)} of {filteredProfiles.length.toLocaleString()} results</p>
                  <div>
                    <button className="active" type="button">1</button>
                    <button type="button">2</button>
                    <button type="button">3</button>
                    <span>...</span>
                    <button type="button">1824</button>
                    <button type="button"><ChevronRight size={17} /></button>
                  </div>
                  <select defaultValue="8 per page">
                    <option>8 per page</option>
                    <option>16 per page</option>
                  </select>
                </div>
              </section>
            </div>

            <aside className="profile-rail">
              <section className="rail-card">
                <h2>Profile Categories</h2>
                <div className="category-list">
                  {categories.map((category) => {
                    const count = category === "All Categories" ? profiles.length : profiles.filter((profile) => profile.category === category).length;
                    return (
                      <button className={filters.category === category ? "active" : ""} type="button" onClick={() => setFilter("category", category)} key={category}>
                        <span className={category.toLowerCase().replace(" ", "-")} />
                        {category}
                        <b>{count.toLocaleString()}</b>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rail-card">
                <div className="rail-heading">
                  <h2>Recently Updated Profiles</h2>
                  <a href="#profiles-admin">View all <ChevronRight size={14} /></a>
                </div>
                <div className="mini-profile-list">
                  {profiles.slice(1, 6).map((profile) => (
                    <button type="button" onClick={() => setSearch(profile.alias)} key={profile.id}>
                      <img src={avatar} alt="" />
                      <span><strong>{profile.alias}</strong><small>{profile.town} - {profile.road}</small></span>
                      <time>{profile.updated}</time>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rail-card">
                <div className="rail-heading">
                  <h2>Flagged Accounts</h2>
                  <a href="#profiles-admin">View all <ChevronRight size={14} /></a>
                </div>
                <div className="flagged-list">
                  {profiles.filter((profile) => profile.flagged).map((profile) => (
                    <button type="button" onClick={() => setSearch(profile.alias)} key={profile.id}>
                      <ShieldAlert size={22} />
                      <span><strong>{profile.alias}</strong><small>{profile.town} - {profile.road}</small></span>
                      <time>{profile.updated}</time>
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </main>
        <footer className="profile-footer">
          <span>(c) 2025 Young Escorts Kenya. All rights reserved.</span>
          <nav>
            <a href="#profiles-admin">Privacy Policy</a>
            <a href="#profiles-admin">Terms of Use</a>
            <a href="#profiles-admin">Support</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
